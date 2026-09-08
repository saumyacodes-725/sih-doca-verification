import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['business', 'lmo', 'gatc', 'admin'], required: true },

    // Optional role-specific profile fields (all roles share one collection for simplicity)
    company: String,
    gstin: String,
    phone: String,
    address: String,
    state: String,
    district: String,
    designation: String,
    badgeNumber: String,
    zone: String,
    labName: String,
    labCode: String,
    accreditationNo: String,
    department: String,
    office: String,

    status: { type: String, default: 'ACTIVE' }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model('User', userSchema);
