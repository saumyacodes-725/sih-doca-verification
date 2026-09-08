import mongoose from 'mongoose';

const testDetailSchema = new mongoose.Schema(
  { testPoint: String, appliedLoad: String, observedError: String, mpeAllowed: String, status: String },
  { _id: false }
);

const verificationSchema = new mongoose.Schema(
  {
    _id: { type: String },
    applicationId: { type: String, index: true },
    instrumentId: { type: String, index: true },

    officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    officerId: String,
    officerName: String,

    verdict: { type: String, enum: ['PASS', 'FAIL'], required: true },
    checklist: mongoose.Schema.Types.Mixed,
    testMeasurements: mongoose.Schema.Types.Mixed,
    testDetails: [testDetailSchema],
    summaryNotes: String,
    rejectionReason: String,
    evidencePhotos: [String],

    performedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model('Verification', verificationSchema);
