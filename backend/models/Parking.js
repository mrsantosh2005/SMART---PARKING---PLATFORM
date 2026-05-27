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
      index: '2dsphere',
    },
  },
  
  // ========== MULTI-VEHICLE SLOTS ==========
  // Car Variants
  totalCarSlots: { type: Number, default: 0 },
  availableCarSlots: { type: Number, default: 0 },
  hatchbackSlots: { type: Number, default: 0 },
  sedanSlots: { type: Number, default: 0 },
  suvSlots: { type: Number, default: 0 },
  
  // Two Wheelers
  totalBikeSlots: { type: Number, default: 0 },
  availableBikeSlots: { type: Number, default: 0 },
  bikeSlots: { type: Number, default: 0 },
  scooterSlots: { type: Number, default: 0 },
  
  // Heavy Vehicles
  busSlots: { type: Number, default: 0 },
  truckSlots: { type: Number, default: 0 },
  
  // EV Charging
  hasEVCharging: { type: Boolean, default: false },
  evChargingSlots: { type: Number, default: 0 },
  
  // ========== PRICING ==========
  basePricePerHour: { type: Number, default: 0 },
  
  // Vehicle-specific pricing
  carPrice: { type: Number, default: 0 },
  bikePrice: { type: Number, default: 0 },
  hatchbackPrice: { type: Number, default: 0 },
  sedanPrice: { type: Number, default: 0 },
  suvPrice: { type: Number, default: 0 },
  scooterPrice: { type: Number, default: 0 },
  busPrice: { type: Number, default: 0 },
  truckPrice: { type: Number, default: 0 },
  evPrice: { type: Number, default: 0 },
  
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