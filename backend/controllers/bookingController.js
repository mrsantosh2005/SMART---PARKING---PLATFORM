const Booking = require('../models/Booking');
const Parking = require('../models/Parking');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { parkingId, vehicleType, vehicleNumber, startTime, endTime } = req.body;

    console.log('📝 Creating booking:', { parkingId, vehicleType, vehicleNumber, startTime, endTime });

    // Validation
    if (!parkingId || !vehicleType || !vehicleNumber || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Get parking
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found'
      });
    }

    // Check slot availability
    let availableSlots = 0;
    if (vehicleType === 'bike') {
      availableSlots = parking.availableBikeSlots || 0;
    } else {
      availableSlots = parking.availableCarSlots || 0;
    }

    if (availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        error: `No ${vehicleType} slots available`
      });
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        success: false,
        error: 'Start time cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        error: 'End time must be after start time'
      });
    }

    // Calculate amount
    const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const totalAmount = hours * parking.basePricePerHour;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      parkingId,
      vehicleType,
      vehicleNumber: vehicleNumber.toUpperCase(),
      startTime: start,
      endTime: end,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    // Update available slots
    if (vehicleType === 'bike') {
      parking.availableBikeSlots -= 1;
    } else {
      parking.availableCarSlots -= 1;
    }
    await parking.save();

    console.log('✅ Booking created:', booking._id);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Create booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create booking'
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('parkingId', 'name address pricePerHour basePricePerHour')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get bookings'
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking already cancelled'
      });
    }

    // Free up the slot
    const parking = await Parking.findById(booking.parkingId);
    if (parking) {
      if (booking.vehicleType === 'bike') {
        parking.availableBikeSlots += 1;
      } else {
        parking.availableCarSlots += 1;
      }
      await parking.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel booking'
    });
  }
};

// @desc    Complete booking
// @route   PUT /api/bookings/:id/complete
// @access  Private (Owner only)
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('parkingId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.parkingId.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    booking.status = 'completed';
    booking.paymentStatus = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Complete error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete booking'
    });
  }
};