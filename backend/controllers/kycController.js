const User = require('../models/User');

// @desc    Submit KYC documents
// @route   POST /api/kyc/submit
// @access  Private (Owner only)
exports.submitKYC = async (req, res) => {
  try {
    const { aadharNumber, aadharName, panNumber, panName, gstNumber, businessName, propertyType, propertyNumber } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'Only owners can submit KYC'
      });
    }
    
    // Update KYC documents
    if (aadharNumber && aadharName) {
      user.kycDocuments.aadharCard.number = aadharNumber;
      user.kycDocuments.aadharCard.name = aadharName;
      if (req.files?.aadharFront) {
        user.kycDocuments.aadharCard.frontImage = req.files.aadharFront[0].path;
      }
      if (req.files?.aadharBack) {
        user.kycDocuments.aadharCard.backImage = req.files.aadharBack[0].path;
      }
    }
    
    if (panNumber && panName) {
      user.kycDocuments.panCard.number = panNumber;
      user.kycDocuments.panCard.name = panName;
      if (req.files?.panImage) {
        user.kycDocuments.panCard.image = req.files.panImage[0].path;
      }
    }
    
    if (gstNumber && businessName) {
      user.kycDocuments.gstCertificate.number = gstNumber;
      user.kycDocuments.gstCertificate.businessName = businessName;
      if (req.files?.gstImage) {
        user.kycDocuments.gstCertificate.image = req.files.gstImage[0].path;
      }
    }
    
    if (propertyType && propertyNumber) {
      user.kycDocuments.propertyProof.type = propertyType;
      user.kycDocuments.propertyProof.documentNumber = propertyNumber;
      if (req.files?.propertyImage) {
        user.kycDocuments.propertyProof.image = req.files.propertyImage[0].path;
      }
    }
    
    user.kycStatus = 'submitted';
    user.kycSubmittedAt = Date.now();
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'KYC documents submitted successfully. Awaiting verification.',
      data: {
        kycStatus: user.kycStatus,
        submittedAt: user.kycSubmittedAt
      }
    });
    
  } catch (error) {
    console.error('Submit KYC error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit KYC'
    });
  }
};

// @desc    Get KYC status
// @route   GET /api/kyc/status
// @access  Private (Owner)
exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('kycStatus kycSubmittedAt kycVerifiedAt kycRejectionReason isVerified verifiedBadge kycDocuments');
    
    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        submittedAt: user.kycSubmittedAt,
        verifiedAt: user.kycVerifiedAt,
        rejectionReason: user.kycRejectionReason,
        isVerified: user.isVerified,
        verifiedBadge: user.verifiedBadge,
        documents: {
          aadhar: {
            submitted: !!user.kycDocuments.aadharCard.number,
            verified: user.kycDocuments.aadharCard.verified
          },
          pan: {
            submitted: !!user.kycDocuments.panCard.number,
            verified: user.kycDocuments.panCard.verified
          },
          gst: {
            submitted: !!user.kycDocuments.gstCertificate.number,
            verified: user.kycDocuments.gstCertificate.verified
          },
          property: {
            submitted: !!user.kycDocuments.propertyProof.image,
            verified: user.kycDocuments.propertyProof.verified
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get KYC status'
    });
  }
};

// @desc    Admin: Get all pending KYC submissions
// @route   GET /api/kyc/admin/pending
// @access  Private (Admin only)
exports.getPendingKYC = async (req, res) => {
  try {
    const pendingOwners = await User.find({
      role: 'owner',
      kycStatus: 'submitted'
    }).select('name email phone kycDocuments kycSubmittedAt');
    
    res.status(200).json({
      success: true,
      count: pendingOwners.length,
      data: pendingOwners
    });
    
  } catch (error) {
    console.error('Get pending KYC error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get pending KYC'
    });
  }
};

// @desc    Admin: Verify KYC
// @route   PUT /api/kyc/admin/verify/:userId
// @access  Private (Admin only)
exports.verifyKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, rejectionReason, verifiedBadge } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (approved) {
      user.kycStatus = 'verified';
      user.isVerified = true;  // ✅ CRITICAL: Owner verified
      user.kycVerifiedAt = Date.now();
      user.kycRejectionReason = null;
      user.verifiedBadge = verifiedBadge || 'basic';
      
      // Mark all documents as verified
      user.kycDocuments.aadharCard.verified = true;
      user.kycDocuments.aadharCard.verifiedAt = Date.now();
      user.kycDocuments.panCard.verified = true;
      user.kycDocuments.panCard.verifiedAt = Date.now();
      
      if (user.kycDocuments.gstCertificate.number) {
        user.kycDocuments.gstCertificate.verified = true;
        user.kycDocuments.gstCertificate.verifiedAt = Date.now();
      }
      
      if (user.kycDocuments.propertyProof.image) {
        user.kycDocuments.propertyProof.verified = true;
        user.kycDocuments.propertyProof.verifiedAt = Date.now();
      }
      
    } else {
      user.kycStatus = 'rejected';
      user.isVerified = false;  // ❌ Not verified
      user.kycRejectionReason = rejectionReason || 'Documents are not valid';
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: approved ? 'KYC verified successfully' : 'KYC rejected',
      data: {
        kycStatus: user.kycStatus,
        isVerified: user.isVerified,
        verifiedBadge: user.verifiedBadge
      }
    });
    
  } catch (error) {
    console.error('Verify KYC error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify KYC'
    });
  }
};

// @desc    Get all verified owners (for users to see)
// @route   GET /api/kyc/verified-owners
// @access  Public
exports.getVerifiedOwners = async (req, res) => {
  try {
    const verifiedOwners = await User.find({
      role: 'owner',
      isVerified: true,
      isApproved: true
    }).select('name email phone verifiedBadge');
    
    res.status(200).json({
      success: true,
      count: verifiedOwners.length,
      data: verifiedOwners
    });
    
  } catch (error) {
    console.error('Get verified owners error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get verified owners'
    });
  }
};