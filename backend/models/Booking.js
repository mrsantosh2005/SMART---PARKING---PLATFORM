const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parkingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['car', 'bike', 'hatchback', 'sedan', 'suv', 'scooter', 'bus', 'truck', 'ev'],
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Please provide vehicle number'],
    trim: true,
    uppercase: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending',
  },
  
  // Reminder Fields
  reminder30MinSent: { type: Boolean, default: false },
  reminder15MinSent: { type: Boolean, default: false },
  extendRequested: { type: Boolean, default: false },
  extendDuration: { type: Number, default: 0 },
  trafficAlertSent: { type: Boolean, default: false },
  isRecurring: { type: Boolean, default: false },
  recurringId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringBooking', default: null },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);