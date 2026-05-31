const User = require('../models/User');

// @desc    Submit KYC documents
exports.submitKYC = async (req, res) => {
  try {
    console.log('📝 KYC Submission received');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { 
      aadharNumber, aadharName, 
      panNumber, panName,
      gstNumber, businessName,
      propertyType, propertyNumber 
    } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.role !== 'owner') {
      return res.status(403).json({ success: false, error: 'Only owners can submit KYC' });
    }
    
    // Update Aadhar
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
    
    // Update PAN
    if (panNumber && panName) {
      user.kycDocuments.panCard.number = panNumber;
      user.kycDocuments.panCard.name = panName;
      if (req.files?.panImage) {
        user.kycDocuments.panCard.image = req.files.panImage[0].path;
      }
    }
    
    // Update GST
    if (gstNumber && businessName) {
      user.kycDocuments.gstCertificate.number = gstNumber;
      user.kycDocuments.gstCertificate.businessName = businessName;
      if (req.files?.gstImage) {
        user.kycDocuments.gstCertificate.image = req.files.gstImage[0].path;
      }
    }
    
    // Update Property Proof
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
    
    console.log('✅ KYC submitted for user:', user.email);
    
    res.status(200).json({
      success: true,
      message: 'KYC documents submitted successfully. Awaiting verification.',
      data: { kycStatus: user.kycStatus }
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to submit KYC' });
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
        documents: {
          aadhar: {
            submitted: !!user.kycDocuments?.aadharCard?.number,
            verified: user.kycDocuments?.aadharCard?.verified || false,
            number: user.kycDocuments?.aadharCard?.number,
            name: user.kycDocuments?.aadharCard?.name
          },
          pan: {
            submitted: !!user.kycDocuments?.panCard?.number,
            verified: user.kycDocuments?.panCard?.verified || false,
            number: user.kycDocuments?.panCard?.number,
            name: user.kycDocuments?.panCard?.name
          },
          gst: {
            submitted: !!user.kycDocuments?.gstCertificate?.number,
            verified: user.kycDocuments?.gstCertificate?.verified || false,
            number: user.kycDocuments?.gstCertificate?.number,
            businessName: user.kycDocuments?.gstCertificate?.businessName
          },
          property: {
            submitted: !!user.kycDocuments?.propertyProof?.image,
            verified: user.kycDocuments?.propertyProof?.verified || false,
            type: user.kycDocuments?.propertyProof?.type,
            documentNumber: user.kycDocuments?.propertyProof?.documentNumber
          }
        }
      }
    });
  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin: Get pending KYC submissions with details
exports.getPendingKYC = async (req, res) => {
  try {
    const pendingOwners = await User.find({
      role: 'owner',
      kycStatus: 'submitted'
    }).select('name email phone kycDocuments kycSubmittedAt');
    
    // Format response with document submission status
    const formattedData = pendingOwners.map(owner => ({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      kycSubmittedAt: owner.kycSubmittedAt,
      documents: {
        aadhar: {
          submitted: !!owner.kycDocuments?.aadharCard?.number,
          number: owner.kycDocuments?.aadharCard?.number,
          name: owner.kycDocuments?.aadharCard?.name
        },
        pan: {
          submitted: !!owner.kycDocuments?.panCard?.number,
          number: owner.kycDocuments?.panCard?.number,
          name: owner.kycDocuments?.panCard?.name
        },
        gst: {
          submitted: !!owner.kycDocuments?.gstCertificate?.number,
          number: owner.kycDocuments?.gstCertificate?.number,
          businessName: owner.kycDocuments?.gstCertificate?.businessName
        },
        property: {
          submitted: !!owner.kycDocuments?.propertyProof?.image,
          type: owner.kycDocuments?.propertyProof?.type,
          documentNumber: owner.kycDocuments?.propertyProof?.documentNumber
        }
      }
    }));
    
    res.status(200).json({
      success: true,
      count: pendingOwners.length,
      data: formattedData
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
            name: user.kycDocuments?.aadharCard?.name,
            frontImage: user.kycDocuments?.aadharCard?.frontImage,
            backImage: user.kycDocuments?.aadharCard?.backImage
          },
          pan: {
            submitted: !!user.kycDocuments?.panCard?.number,
            number: user.kycDocuments?.panCard?.number,
            name: user.kycDocuments?.panCard?.name,
            image: user.kycDocuments?.panCard?.image
          },
          gst: {
            submitted: !!user.kycDocuments?.gstCertificate?.number,
            number: user.kycDocuments?.gstCertificate?.number,
            businessName: user.kycDocuments?.gstCertificate?.businessName,
            image: user.kycDocuments?.gstCertificate?.image
          },
          property: {
            submitted: !!user.kycDocuments?.propertyProof?.image,
            type: user.kycDocuments?.propertyProof?.type,
            documentNumber: user.kycDocuments?.propertyProof?.documentNumber,
            image: user.kycDocuments?.propertyProof?.image
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
      user.kycVerifiedAt = Date.now();
      user.kycRejectionReason = null;
      user.verifiedBadge = verifiedBadge || 'basic';
      
      // Mark documents as verified
      user.kycDocuments.aadharCard.verified = true;
      user.kycDocuments.panCard.verified = true;
      if (user.kycDocuments.gstCertificate.number) {
        user.kycDocuments.gstCertificate.verified = true;
      }
      if (user.kycDocuments.propertyProof.image) {
        user.kycDocuments.propertyProof.verified = true;
      }
    } else {
      user.kycStatus = 'rejected';
      user.isVerified = false;
      user.kycRejectionReason = rejectionReason || 'Documents are not valid';
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: approved ? 'KYC verified successfully' : 'KYC rejected'
    });
  } catch (error) {
    console.error('Verify KYC error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Admin: Approve owner
exports.approveOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.role !== 'owner') {
      return res.status(400).json({ success: false, error: 'User is not an owner' });
    }
    
    user.isApproved = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Owner approved successfully'
    });
  } catch (error) {
    console.error('Approve owner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get pending owners for admin approval
exports.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await User.find({
      role: 'owner',
      isApproved: false
    }).select('name email phone createdAt');
    
    res.status(200).json({
      success: true,
      count: pendingOwners.length,
      data: pendingOwners
    });
  } catch (error) {
    console.error('Get pending owners error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};