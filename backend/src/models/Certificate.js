import mongoose from 'mongoose';

const testDetailSchema = new mongoose.Schema(
  { testPoint: String, appliedLoad: String, observedError: String, mpeAllowed: String, status: String },
  { _id: false }
);

const certificateSchema = new mongoose.Schema(
  {
    _id: { type: String },
    certificateNumber: { type: String, index: true },
    applicationId: String,
    verificationId: String,
    instrumentId: { type: String, index: true },
    instrumentType: String,
    manufacturer: String,
    model: String,
    serialNumber: { type: String, index: true },
    accuracyClass: String,
    capacity: String,

    ownerName: String,
    businessRegNo: String,
    establishmentAddress: String,

    issueDate: String,
    expiryDate: String,
    status: { type: String, enum: ['VALID', 'EXPIRING_SOON', 'EXPIRED', 'REVOKED'], default: 'VALID' },
    stampingSealNumber: { type: String, index: true },
    verificationStandard: String,

    issuingOfficer: String,
    issuingOfficerId: String,
    issuingOffice: String,

    testResultsSummary: String,
    testDetails: [testDetailSchema],
    evidencePhotos: [String],

    digitalHash: String,
    qrVerificationUrl: String,

    revocationReason: { type: String, default: null },
    revokedAt: { type: String, default: null }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model('Certificate', certificateSchema);
