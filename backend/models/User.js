const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user',
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'user' ? true : false;
    }
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  
  // ========== KYC FIELDS (Simplified) ==========
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected', 'not_submitted'],
    default: 'not_submitted'
  },
  kycSubmittedAt: {
    type: Date,
    default: null
  },
  kycVerifiedAt: {
    type: Date,
    default: null
  },
  kycRejectionReason: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBadge: {
    type: String,
    enum: ['none', 'basic', 'silver', 'gold', 'platinum'],
    default: 'none'
  },
  
  // KYC Documents - Simple fields
  aadharNumber: { type: String, default: null },
  aadharName: { type: String, default: null },
  aadharFrontImage: { type: String, default: null },
  aadharBackImage: { type: String, default: null },
  panNumber: { type: String, default: null },
  panName: { type: String, default: null },
  panImage: { type: String, default: null },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);