// routes/claimRoutes.js (or claims.js)
const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const mongoose = require('mongoose');

const formidable = require('express-formidable');

// GET all claims (for listing/testing without ID)
router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find({}); // Add .sort({ createdAt: -1 }) or filters if needed
    res.json(claims);
  } catch (err) {
    console.error('GET /api/claims error', err);
    res.status(500).json({ message: 'Server error fetching claims' });
  }
});

// UPDATED: GET single claim with better validation/logging
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Enhanced validation with logging
  if (!id) {
    console.warn('GET /api/claims/:id - Missing ID in request');
    return res.status(400).json({ message: 'Missing claim ID' });
  }

  if (!mongoose.isValidObjectId(id)) {
    console.warn(`GET /api/claims/${id} - Invalid ObjectId format: ${id}`); // Logs the bad ID
    return res.status(400).json({
      message: 'Invalid claim ID format',
      example: 'Use a valid MongoDB ObjectId like 507f1f77bcf86cd799439011'
    });
  }

  try {
    const claim = await Claim.findById(id);
    if (!claim) {
      console.warn(`GET /api/claims/${id} - Claim not found`);
      return res.status(404).json({ message: 'Claim not found' });
    }
    res.json(claim);
  } catch (err) {
    console.error(`GET /api/claims/${id} error`, err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply formidable middleware to the router (or app if preferred) - no uploadDir to keep files in memory as buffers
router.use(formidable({
  keepExtensions: true,
  maxFileSize: 4 * 1024 * 1024, // 4MB limit, matching frontend
  filter: function ({ name, originalFilename, mimetype }) {
    // Only allow PDF, JPEG, PNG for paymentFile
    if (name === 'paymentFile' && (mimetype.startsWith('image/') || mimetype === 'application/pdf')) {
      return true;
    }
    return false;
  }
}));

// POST /api/claims/submit
router.post("/submit", async (req, res) => {
  try {
    const { id, paymentMethod } = req.fields;
    const file = req.files.paymentFile;

    // Validation
    if (!id) {
      return res.status(400).json({ message: 'Claim ID is required' });
    }
    if (!file) {
      return res.status(400).json({ message: 'Invoice file is required' });
    }
    if (!['wire', 'ach', 'check'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Fetch the claim
    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // If claim is already paid, prevent duplicate
    if (claim.payment?.status === 'paid') {
      return res.status(400).json({ message: 'Payment already processed for this claim' });
    }

    // Find the authorized status entry
    const authorizedIndex = claim.statusHistory.findIndex(item => item.status.toLowerCase() === 'authorized');
    if (authorizedIndex === -1) {
      return res.status(400).json({ message: 'No authorized status found' });
    }

    // Update the authorized entry to paid
    claim.statusHistory[authorizedIndex].status = 'paid';
    claim.statusHistory[authorizedIndex].timestamp = new Date();
    claim.statusHistory[authorizedIndex].color = 'green';

    // Store binary file data directly in DB (no disk storage)
    claim.payment.file = {
      data: file.buffer, // Buffer from in-memory file
      contentType: file.type,
      fileName: file.name.trim()
    };
    claim.payment.method = paymentMethod;
    claim.payment.status = 'paid';
    claim.payment.submittedAt = new Date();
    claim.status = 'paid'; // Update overall status

    // Save the updated claim
    await claim.save();

    // Optional: Emit socket event or send email notification here

    res.status(200).json({ message: 'Payment submission successful' });
  } catch (err) {
    console.error('Submit error:', err);
    // No file cleanup needed since files are kept in memory (no disk writes)
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

module.exports = router;