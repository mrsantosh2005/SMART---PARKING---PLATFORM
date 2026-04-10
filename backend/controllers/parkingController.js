const Parking = require('../models/Parking');
const User = require('../models/User');

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

exports.getParkings = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    let query = { isActive: true };

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

    const parkings = await Parking.find(query).populate('ownerId', 'name email');

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

exports.getParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate('ownerId', 'name email');

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

exports.getMyParkings = async (req, res) => {
  try {
    const parkings = await Parking.find({ ownerId: req.user.id });

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