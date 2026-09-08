import mongoose from 'mongoose';

const instrumentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    type: String,
    category: String,
    manufacturer: String,
    model: String,
    serialNumber: { type: String, unique: true, sparse: true },
    maxCapacity: String,
    minCapacity: String,
    verificationInterval: String,
    accuracyClass: String,

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ownerName: String,
    ownerTraderId: String,
    ownerEmail: String,
    businessRegNo: String,

    location: String,
    state: String,
    district: String,
    latitude: String,
    longitude: String,

    registrationDate: String,
    status: {
      type: String,
      enum: ['REGISTERED', 'APPLICATION_SUBMITTED', 'SCHEDULED', 'VERIFIED', 'EXPIRED', 'REJECTED'],
      default: 'REGISTERED'
    },
    activeCertificateId: { type: String, default: null },
    lastVerifiedDate: { type: String, default: null },
    expiryDate: { type: String, default: null },
    stampingNumber: { type: String, default: null },
    verificationFeePaid: { type: Boolean, default: false },
    patternApprovalNo: String,
    applicationId: { type: String, default: null }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model('Instrument', instrumentSchema);
