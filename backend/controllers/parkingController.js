const Parking = require('../models/Parking');
const User = require('../models/User');

// @desc    Add parking location
// @route   POST /api/parking
// @access  Private (Owner only)
exports.addParking = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    
    const {
      name,
      address,
      latitude,
      longitude,
      totalCarSlots,
      totalBikeSlots,
      basePricePerHour,
      carPrice,
      bikePrice,
      hasEVCharging
    } = req.body;

    // Validation
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        error: 'Name and address are required'
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    if ((!totalCarSlots || totalCarSlots <= 0) && (!totalBikeSlots || totalBikeSlots <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'At least one car or bike slot is required'
      });
    }

    if (!basePricePerHour || basePricePerHour <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid price per hour is required'
      });
    }

    const owner = await User.findById(req.user.id);
    if (!owner) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!owner.isApproved) {
      return res.status(403).json({
        success: false,
        error: 'Your account is pending approval from admin',
      });
    }

    const parking = await Parking.create({
      ownerId: req.user.id,
      name: name.trim(),
      address: address.trim(),
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      totalCarSlots: parseInt(totalCarSlots) || 0,
      availableCarSlots: parseInt(totalCarSlots) || 0,
      totalBikeSlots: parseInt(totalBikeSlots) || 0,
      availableBikeSlots: parseInt(totalBikeSlots) || 0,
      basePricePerHour: parseFloat(basePricePerHour) || 0,
      carPrice: parseFloat(carPrice) || 0,
      bikePrice: parseFloat(bikePrice) || 0,
      hasEVCharging: hasEVCharging === true || hasEVCharging === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Parking added successfully',
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

// @desc    Get all parkings
// @route   GET /api/parking
// @access  Public
exports.getParkings = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    // Get verified owners
    const verifiedOwners = await User.find({
      role: 'owner',
      isVerified: true,
      isApproved: true
    }).select('_id');

    const verifiedOwnerIds = verifiedOwners.map(owner => owner._id);

    if (verifiedOwnerIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
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

    const parkings = await Parking.find(query).populate('ownerId', 'name email isVerified verifiedBadge');

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
// @route   GET /api/parking/:id
// @access  Public
exports.getParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate('ownerId', 'name email isVerified verifiedBadge');

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
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
// @route   PUT /api/parking/:id
// @access  Private (Owner only)
exports.updateParking = async (req, res) => {
  try {
    let parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    // Check ownership
    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this parking',
      });
    }

    const { totalCarSlots, totalBikeSlots, basePricePerHour } = req.body;
    
    // Update car slots
    if (totalCarSlots !== undefined) {
      const difference = totalCarSlots - parking.totalCarSlots;
      req.body.availableCarSlots = Math.max(0, parking.availableCarSlots + difference);
    }
    
    // Update bike slots
    if (totalBikeSlots !== undefined) {
      const difference = totalBikeSlots - parking.totalBikeSlots;
      req.body.availableBikeSlots = Math.max(0, parking.availableBikeSlots + difference);
    }
    
    // ✅ Update price - IMPORTANT FIX
    if (basePricePerHour !== undefined) {
      req.body.basePricePerHour = parseFloat(basePricePerHour);
    }

    parking = await Parking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Parking updated successfully',
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
// @desc    Delete parking
// @route   DELETE /api/parking/:id
// @access  Private (Owner only)
exports.deleteParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

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
// @route   GET /api/parking/owner/my-parkings
// @access  Private (Owner only)
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