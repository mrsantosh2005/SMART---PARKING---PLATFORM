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
    default: 'car',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ parkingId: 1, createdAt: -1 });
bookingSchema.index({ startTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);