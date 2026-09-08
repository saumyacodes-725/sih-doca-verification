import mongoose from 'mongoose';

const historyEntrySchema = new mongoose.Schema({ date: String, event: String }, { _id: false });

const applicationSchema = new mongoose.Schema(
  {
    _id: { type: String },
    instrumentId: { type: String, index: true },
    instrumentName: String,
    instrumentType: String,

    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicantName: String,
    applicantTraderId: String,
    applicantEmail: String,
    contactPhone: String,

    applicationType: String,
    accuracyClass: String,
    premiseAddress: String,
    state: String,
    district: String,

    submittedDate: String,
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'],
      default: 'PENDING_REVIEW'
    },

    feeAmount: String,
    feeBreakdown: {
      verificationFee: String,
      stampingSealFee: String,
      portalProcessingFee: String
    },
    feeTransactionId: String,
    paymentStatus: String,

    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedOfficerId: { type: String, default: null },
    assignedOfficerName: { type: String, default: null },
    scheduledDate: { type: String, default: null },
    scheduledTimeSlot: { type: String, default: null },

    remarks: String,
    history: [historyEntrySchema]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model('Application', applicationSchema);
