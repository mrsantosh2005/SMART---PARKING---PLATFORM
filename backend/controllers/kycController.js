const User = require('../models/User');

// @desc    Submit KYC documents
exports.submitKYC = async (req, res) => {
  try {
    console.log('📝 KYC Submission received');
    console.log('User ID:', req.user.id);
    
    const { aadharNumber, aadharName, panNumber, panName } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.role !== 'owner') {
      return res.status(403).json({ success: false, error: 'Only owners can submit KYC' });
    }
    
    // Initialize kycDocuments if not exists
    if (!user.kycDocuments) {
      user.kycDocuments = {};
    }
    if (!user.kycDocuments.aadharCard) {
      user.kycDocuments.aadharCard = {};
    }
    if (!user.kycDocuments.panCard) {
      user.kycDocuments.panCard = {};
    }
    
    // Update Aadhar info
    if (aadharNumber) {
      user.kycDocuments.aadharCard.number = aadharNumber;
      user.kycDocuments.aadharCard.name = aadharName || '';
      if (req.files?.aadharFront) {
        user.kycDocuments.aadharCard.frontImage = req.files.aadharFront[0].path;
      }
      if (req.files?.aadharBack) {
        user.kycDocuments.aadharCard.backImage = req.files.aadharBack[0].path;
      }
    }
    
    // Update PAN info
    if (panNumber) {
      user.kycDocuments.panCard.number = panNumber;
      user.kycDocuments.panCard.name = panName || '';
      if (req.files?.panImage) {
        user.kycDocuments.panCard.image = req.files.panImage[0].path;
      }
    }
    
    // ✅ CRITICAL: Set kycStatus to 'submitted'
    user.kycStatus = 'submitted';
    user.kycSubmittedAt = new Date();
    
    await user.save();
    
    console.log('✅ KYC submitted for user:', user.email);
    console.log('✅ kycStatus:', user.kycStatus);
    
    res.status(200).json({
      success: true,
      message: 'KYC documents submitted successfully. Awaiting verification.',
      data: { kycStatus: user.kycStatus }
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get KYC status
exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus || 'pending',
        isVerified: user.isVerified || false,
        verifiedBadge: user.verifiedBadge || 'none',
      }
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin: Get pending KYC submissions
exports.getPendingKYC = async (req, res) => {
  try {
    console.log('🔍 Fetching pending KYC submissions...');
    
    const pendingOwners = await User.find({
      role: 'owner',
      kycStatus: 'submitted'
    }).select('name email phone kycDocuments kycSubmittedAt');
    
    console.log(`📋 Found ${pendingOwners.length} pending KYC submissions`);
    
    res.status(200).json({
      success: true,
      count: pendingOwners.length,
      data: pendingOwners
    });
  } catch (error) {
    console.error('Get pending KYC error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin: Get single KYC details
exports.getKYCDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email phone kycDocuments kycSubmittedAt');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        kycSubmittedAt: user.kycSubmittedAt,
        documents: {
          aadhar: {
            submitted: !!user.kycDocuments?.aadharCard?.number,
            number: user.kycDocuments?.aadharCard?.number,
            name: user.kycDocuments?.aadharCard?.name
          },
          pan: {
            submitted: !!user.kycDocuments?.panCard?.number,
            number: user.kycDocuments?.panCard?.number,
            name: user.kycDocuments?.panCard?.name
          }
        }
      }
    });
  } catch (error) {
    console.error('Get KYC details error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin: Verify KYC
exports.verifyKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, rejectionReason, verifiedBadge } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (approved) {
      user.kycStatus = 'verified';
      user.isVerified = true;
      user.kycVerifiedAt = new Date();
      user.kycRejectionReason = null;
      user.verifiedBadge = verifiedBadge || 'basic';
      
      if (user.kycDocuments?.aadharCard?.number) {
        user.kycDocuments.aadharCard.verified = true;
      }
      if (user.kycDocuments?.panCard?.number) {
        user.kycDocuments.panCard.verified = true;
      }
      console.log('✅ KYC verified for:', user.email);
    } else {
      user.kycStatus = 'rejected';
      user.isVerified = false;
      user.kycRejectionReason = rejectionReason || 'Documents are not valid';
      console.log('❌ KYC rejected for:', user.email);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: approved ? 'KYC verified successfully' : 'KYC rejected',
    });
  } catch (error) {
    console.error('Verify KYC error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};