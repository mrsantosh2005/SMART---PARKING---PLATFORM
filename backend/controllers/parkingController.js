const Parking = require('../models/Parking');
const User = require('../models/User');

// Helper function to get price for specific vehicle type
const getVehiclePrice = (parking, vehicleType) => {
  const prices = {
    'car': parking.carPrice || parking.basePricePerHour,
    'bike': parking.bikePrice || parking.basePricePerHour * 0.5,
    'hatchback': parking.hatchbackPrice || parking.carPrice || parking.basePricePerHour,
    'sedan': parking.sedanPrice || parking.carPrice || parking.basePricePerHour * 1.2,
    'suv': parking.suvPrice || parking.carPrice || parking.basePricePerHour * 1.5,
    'scooter': parking.scooterPrice || parking.bikePrice || parking.basePricePerHour * 0.5,
    'bus': parking.busPrice || parking.basePricePerHour * 3,
    'truck': parking.truckPrice || parking.basePricePerHour * 4,
    'ev': parking.evPrice || parking.carPrice || parking.basePricePerHour,
  };
  return prices[vehicleType] || parking.basePricePerHour;
};

// Helper function to check if vehicle is supported
const isVehicleSupported = (parking, vehicleType) => {
  const supported = {
    'car': parking.totalCarSlots > 0,
    'bike': parking.totalBikeSlots > 0,
    'hatchback': parking.hatchbackSlots > 0 || parking.totalCarSlots > 0,
    'sedan': parking.sedanSlots > 0 || parking.totalCarSlots > 0,
    'suv': parking.suvSlots > 0 || parking.totalCarSlots > 0,
    'scooter': parking.scooterSlots > 0 || parking.totalBikeSlots > 0,
    'bus': parking.busSlots > 0,
    'truck': parking.truckSlots > 0,
    'ev': parking.hasEVCharging && parking.evChargingSlots > 0,
  };
  return supported[vehicleType] || false;
};

// @desc    Add parking location
// @route   POST /api/parking
// @access  Private (Owner only)
exports.addParking = async (req, res) => {
  try {
    const {
      name, address, latitude, longitude,
      totalCarSlots, totalBikeSlots,
      hatchbackSlots, sedanSlots, suvSlots,
      bikeSlots, scooterSlots,
      busSlots, truckSlots,
      hasEVCharging, evChargingSlots,
      basePricePerHour,
      carPrice, bikePrice, hatchbackPrice, sedanPrice, suvPrice,
      scooterPrice, busPrice, truckPrice, evPrice
    } = req.body;

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
      totalCarSlots: parseInt(totalCarSlots) || 0,
      availableCarSlots: parseInt(totalCarSlots) || 0,
      totalBikeSlots: parseInt(totalBikeSlots) || 0,
      availableBikeSlots: parseInt(totalBikeSlots) || 0,
      hatchbackSlots: parseInt(hatchbackSlots) || 0,
      sedanSlots: parseInt(sedanSlots) || 0,
      suvSlots: parseInt(suvSlots) || 0,
      bikeSlots: parseInt(bikeSlots) || 0,
      scooterSlots: parseInt(scooterSlots) || 0,
      busSlots: parseInt(busSlots) || 0,
      truckSlots: parseInt(truckSlots) || 0,
      hasEVCharging: hasEVCharging === 'true' || hasEVCharging === true,
      evChargingSlots: parseInt(evChargingSlots) || 0,
      basePricePerHour: parseFloat(basePricePerHour) || 0,
      carPrice: parseFloat(carPrice) || 0,
      bikePrice: parseFloat(bikePrice) || 0,
      hatchbackPrice: parseFloat(hatchbackPrice) || 0,
      sedanPrice: parseFloat(sedanPrice) || 0,
      suvPrice: parseFloat(suvPrice) || 0,
      scooterPrice: parseFloat(scooterPrice) || 0,
      busPrice: parseFloat(busPrice) || 0,
      truckPrice: parseFloat(truckPrice) || 0,
      evPrice: parseFloat(evPrice) || 0,
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

// @desc    Get all parking locations
// @route   GET /api/parking
// @access  Public
exports.getParkings = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, vehicleType } = req.query;

    let query = { isActive: true };

    // First find verified owners
    const verifiedOwners = await User.find({
      role: 'owner',
      isVerified: true,
      isApproved: true
    }).select('_id');

    const verifiedOwnerIds = verifiedOwners.map(owner => owner._id);
    
    if (verifiedOwnerIds.length > 0) {
      query.ownerId = { $in: verifiedOwnerIds };
    } else {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    // Nearby search
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

    let parkings = await Parking.find(query).populate('ownerId', 'name email isVerified verifiedBadge');

    // Filter by vehicle type
    if (vehicleType) {
      parkings = parkings.filter(p => isVehicleSupported(p, vehicleType));
    }

    // Add dynamic fields
    const enrichedParkings = parkings.map(parking => ({
      ...parking._doc,
      priceForVehicle: getVehiclePrice(parking, vehicleType || 'car'),
      availableForVehicle: isVehicleSupported(parking, vehicleType || 'car') ? 
        (vehicleType === 'bus' ? parking.busSlots : 
         vehicleType === 'truck' ? parking.truckSlots :
         vehicleType === 'ev' ? parking.evChargingSlots :
         parking.availableCarSlots) : 0,
      supportedVehicles: Object.keys({ car:1, bike:1, hatchback:1, sedan:1, suv:1, scooter:1, bus:1, truck:1, ev:1 })
        .filter(v => isVehicleSupported(parking, v))
    }));

    res.status(200).json({
      success: true,
      count: enrichedParkings.length,
      data: enrichedParkings,
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

    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this parking',
      });
    }

    const { totalCarSlots, totalBikeSlots } = req.body;
    
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
    const parking = await Parking.findById(req.params.id);

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
        error: 'Not authorized to delete this parking',
      });
    }

    // Soft delete - set isActive to false
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