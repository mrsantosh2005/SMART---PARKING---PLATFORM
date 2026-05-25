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
  
  // ========== KYC FIELDS ==========
  kycStatus: {
    type: String,
    enum: ['pending', 'submitted', 'verified', 'rejected'],
    default: 'pending'
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
  
  // KYC Documents
  kycDocuments: {
    aadharCard: {
      number: { type: String, default: null },
      name: { type: String, default: null },
      frontImage: { type: String, default: null },
      backImage: { type: String, default: null },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null }
    },
    panCard: {
      number: { type: String, default: null },
      name: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null }
    },
    gstCertificate: {
      number: { type: String, default: null },
      businessName: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null }
    },
    propertyProof: {
      type: { type: String, enum: ['rent_agreement', 'ownership_deed', 'shop_license', 'other'], default: null },
      documentNumber: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null }
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);