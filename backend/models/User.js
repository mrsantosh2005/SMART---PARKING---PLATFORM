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
  
  // KYC Fields
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
  
  // KYC Documents
  kycDocuments: {
    aadharCard: {
      number: { type: String, default: null },
      name: { type: String, default: null },
      frontImage: { type: String, default: null },
      backImage: { type: String, default: null },
      verified: { type: Boolean, default: false }
    },
    panCard: {
      number: { type: String, default: null },
      name: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false }
    },
    gstCertificate: {
      number: { type: String, default: null },
      businessName: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false }
    },
    propertyProof: {
      type: { type: String, default: null },
      documentNumber: { type: String, default: null },
      image: { type: String, default: null },
      verified: { type: Boolean, default: false }
    }
  },
  
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