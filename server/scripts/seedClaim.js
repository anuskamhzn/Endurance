// scripts/seedClaim.js
require('dotenv').config();
const mongoose = require('mongoose');
const Claim = require('../models/Claim');

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('MONGO_URI is not set in .env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');

    // Delete existing claims (optional)
    await Claim.deleteMany({});
    console.log('Cleared existing claims');

    const claim = new Claim({
      claimNumber: 'CL-2467802',
      type: 'Mechanical',
      policyNumber: '890790123412',
      date: new Date('2025-04-10'),
      client: 'Albert Flores',
      assignedTo: 'David Jackson',
      currentOdo: 109000,

      customer: {
        name: 'Devon Lane',
        contract: 'EADV25020916',
        deductible: 100,
        vehicle: '2022 DODGE Ram Pickup',
        totalClaims: 1,
        term: '60 mo. / 100,000 mi.',
        vin: '3D7LT5AG141119811',
        status: 'Active'
      },

      sublets: [
        { name: 'Rental Car Service (Max 5 days)', qty: 2, costPer: 30.00, requested: 60.00 },
        { name: 'Tow service - Towing up to 50 miles', qty: 1, costPer: 150.00, requested: 150.00 }
      ],

      services: [
        { description: 'Engine Overheating', cost: 240.00, notes: 'Complain, Cause, corruption' },
        { description: 'Breaking System Issues', cost: 130.00, notes: 'Complain, Cause, corruption' }
      ],

      totals: {
        parts: 2465.00,
        labor: 1275.00,
        subletTotal: 210.00,
        subtotal: 4180.00,
        taxes: 296.25,
        deductible: -100.00,
        total: 4376.25
      },

      otherDetails: [
        { label: 'ARRIVED', value: 'Towed' },
        { label: 'COMMERCIAL USE', value: 'No' },
        { label: 'PHYSICAL DAMAGE', value: 'No' },
        { label: 'MODIFICATIONS', value: 'Oversize Wheels' }
      ],

      status: 'authorized',
      statusHistory: [
        {
          status: 'authorized',
          amount: 4376.25,
          timestamp: new Date('2025-04-15T14:30:00Z'),
          color: 'teal'
        },
        {
          status: 'pending',
          amount: 4376.25,
          timestamp: new Date('2025-04-12T09:15:00Z'),
          color: 'orange'
        }
      ],

      notes: 'Engine failure due to overheating. Customer towed vehicle to shop. Rental car provided.',
      attachments: [],

      payment: {
        status: "not_submitted"
      }

    });

    await claim.save();
    console.log('Successfully seeded full claim:', claim.claimNumber);
    console.log('Claim ID:', claim._id.toString());

  } catch (err) {
    console.error('Error seeding claim:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();