import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true }, // Mongo user id, or 'ALL'
    title: String,
    message: String,
    type: { type: String, enum: ['info', 'warning', 'success', 'danger', 'primary'], default: 'info' },
    read: { type: Boolean, default: false },
    link: String
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model('Notification', notificationSchema);
