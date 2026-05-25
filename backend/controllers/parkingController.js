const Parking = require('../models/Parking');
const User = require('../models/User');

// @desc    Add parking location
exports.addParking = async (req, res) => {
  try {
    const { name, address, latitude, longitude, totalCarSlots, totalBikeSlots, pricePerHour } = req.body;

    const owner = await User.findById(req.user.id);
    if (!owner.isApproved) {
      return res.status(403).json({
        success: false,
        error: 'Your account is pending approval from admin',
      });
    }

    const parking = await Parking.create({
      ownerId: req.user.id,
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      totalCarSlots: parseInt(totalCarSlots),
      totalBikeSlots: parseInt(totalBikeSlots),
      availableCarSlots: parseInt(totalCarSlots),
      availableBikeSlots: parseInt(totalBikeSlots),
      pricePerHour: parseFloat(pricePerHour),
    });

    res.status(201).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    console.error('Add parking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add parking',
    });
  }
};

// @desc    Get all parking locations (ONLY from verified owners)
exports.getParkings = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    const verifiedOwners = await User.find({
      role: 'owner',
      isVerified: true,
      isApproved: true
    }).select('_id');

    const verifiedOwnerIds = verifiedOwners.map(owner => owner._id);

    if (verifiedOwnerIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'No verified parking owners yet'
      });
    }

    let query = { 
      isActive: true,
      ownerId: { $in: verifiedOwnerIds }
    };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      };
    }

    const parkings = await Parking.find(query)
      .populate('ownerId', 'name email isVerified verifiedBadge');

    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings,
    });
  } catch (error) {
    console.error('Get parkings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get parkings',
    });
  }
};

// @desc    Get single parking
exports.getParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id)
      .populate('ownerId', 'name email isVerified verifiedBadge');

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    if (!parking.ownerId.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'This parking is not available. Owner verification pending.',
      });
    }

    res.status(200).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    console.error('Get parking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get parking',
    });
  }
};

// @desc    Update parking
exports.updateParking = async (req, res) => {
  try {
    let parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this parking',
      });
    }

    const { totalCarSlots, totalBikeSlots, pricePerHour } = req.body;
    
    if (totalCarSlots !== undefined) {
      const difference = totalCarSlots - parking.totalCarSlots;
      req.body.availableCarSlots = Math.max(0, parking.availableCarSlots + difference);
    }
    
    if (totalBikeSlots !== undefined) {
      const difference = totalBikeSlots - parking.totalBikeSlots;
      req.body.availableBikeSlots = Math.max(0, parking.availableBikeSlots + difference);
    }

    parking = await Parking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    console.error('Update parking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update parking',
    });
  }
};

// ✅ @desc    Delete parking (Soft delete)
// ✅ @route   DELETE /api/parking/:id
// ✅ @access  Private (Owner only)
exports.deleteParking = async (req, res) => {
  try {
    let parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this parking',
      });
    }

    parking.isActive = false;
    await parking.save();

    res.status(200).json({
      success: true,
      message: 'Parking deleted successfully',
      data: parking,
    });
  } catch (error) {
    console.error('Delete parking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete parking',
    });
  }
};

// @desc    Get owner's parkings
exports.getMyParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ ownerId: req.user.id, isActive: true });

    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings,
    });
  } catch (error) {
    console.error('Get my parkings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get your parkings',
    });
  }
};