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
  totalCarSlots: {
    type: Number,
    required: true,
    min: 0,
  },
  totalBikeSlots: {
    type: Number,
    required: true,
    min: 0,
  },
  availableCarSlots: {
    type: Number,
    required: true,
    min: 0,
  },
  availableBikeSlots: {
    type: Number,
    required: true,
    min: 0,
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0,
  },
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