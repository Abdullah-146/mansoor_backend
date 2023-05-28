import mongoose from 'mongoose';

/**
 * Defining Booking Schema
 */
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  timeSlot1: { type: Boolean, default: true },
  timeSlot2: { type: Boolean, default: true },
  totalPrice: { type: Number, default: 0 },
  noPersons: { type: Number, default: 0 },
  isBooked: { type: Boolean, default: false },
  deal: { type: Number, default: 1 },
  themeColor: { type: String, default: '' },
});

export default mongoose.model('Booking', bookingSchema);
