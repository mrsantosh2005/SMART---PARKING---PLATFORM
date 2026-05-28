const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide parking name'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  
  // Basic Slots
  totalCarSlots: { type: Number, default: 0 },
  availableCarSlots: { type: Number, default: 0 },
  totalBikeSlots: { type: Number, default: 0 },
  availableBikeSlots: { type: Number, default: 0 },
  
  // Pricing
  basePricePerHour: { type: Number, default: 0 },
  carPrice: { type: Number, default: 0 },
  bikePrice: { type: Number, default: 0 },
  
  // EV Charging
  hasEVCharging: { type: Boolean, default: false },
  evChargingSlots: { type: Number, default: 0 },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

parkingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Parking', parkingSchema);