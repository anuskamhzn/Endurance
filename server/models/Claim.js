const mongoose = require('mongoose');
const { Schema } = mongoose;

const StatusHistorySchema = new Schema({
  status: { type: String, required: true },
  amount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  color: { type: String },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const SubletSchema = new Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  costPer: { type: Number, required: true },
  requested: { type: Number, required: true }
});

const ServiceSchema = new Schema({
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  notes: { type: String }
});

const OtherDetailSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  contract: String,
  deductible: Number,
  vehicle: String,
  totalClaims: Number,
  term: String,
  vin: String,
  status: { type: String, default: 'Active' } 
});

const ClaimSchema = new Schema({
  claimNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, 
  policyNumber: String,
  date: { type: Date, default: Date.now },

  client: String,
  assignedTo: String,
  currentOdo: Number,

  // Customer & Contract Info
  customer: CustomerSchema,

  // Breakdown
  sublets: [SubletSchema],
  services: [ServiceSchema],

  // Totals
  totals: {
    parts: Number,
    labor: Number,
    subletTotal: Number,
    subtotal: Number,
    taxes: Number,
    deductible: Number,
    total: Number
  },

  // Other Details
  otherDetails: [OtherDetailSchema],

  // Status
  status: { type: String, default: 'draft' },
  statusHistory: { type: [StatusHistorySchema], default: [] },

  // Notes & Attachments
  notes: String,
  attachments: [String],

  payment: {
    status: { type: String, default: 'pending' }, 
    submittedAt: { type: Date },

    file: {
      data: { type: Buffer },
      contentType: { type: String },
      fileName: { type: String, trim: true } 
    },
    method: { type: String }  
  }

}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);