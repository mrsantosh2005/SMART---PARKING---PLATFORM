const Booking = require('../models/Booking');
const Parking = require('../models/Parking');
const User = require('../models/User');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { parkingId, vehicleType, vehicleNumber, startTime, endTime } = req.body;

    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    const slotField = vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    if (parking[slotField] <= 0) {
      return res.status(400).json({
        success: false,
        error: `No ${vehicleType} slots available`,
      });
    }

    const hours = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));
    const totalAmount = hours * parking.pricePerHour;

    const booking = await Booking.create({
      userId: req.user.id,
      parkingId,
      vehicleType,
      vehicleNumber,
      startTime,
      endTime,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
    });

    await Parking.findByIdAndUpdate(parkingId, {
      [slotField]: parking[slotField] - 1,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create booking',
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('parkingId', 'name address pricePerHour')
      .populate('userId', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get bookings',
    });
  }
};

// @desc    Get parking bookings (for owner)
// @route   GET /api/bookings/parking/:parkingId
// @access  Private (Owner only)
exports.getParkingBookings = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.parkingId);

    if (!parking) {
      return res.status(404).json({
        success: false,
        error: 'Parking not found',
      });
    }

    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    const bookings = await Booking.find({ parkingId: req.params.parkingId })
      .populate('userId', 'name email phone')
      .populate('parkingId', 'name address pricePerHour')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get parking bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get bookings',
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
        error: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: `Booking cannot be cancelled (status: ${booking.status})`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    const parking = await Parking.findById(booking.parkingId);
    const slotField = booking.vehicleType === 'car' ? 'availableCarSlots' : 'availableBikeSlots';
    await Parking.findByIdAndUpdate(booking.parkingId, {
      [slotField]: parking[slotField] + 1,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel booking',
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
        error: 'Booking not found',
      });
    }

    if (booking.parkingId.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized',
      });
    }

    booking.status = 'completed';
    booking.paymentStatus = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to complete booking',
    });
  }
};

// ✅ @desc    Verify booking by QR Code
// @route   POST /api/bookings/verify
// @access  Private (Owner/Admin)
exports.verifyBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required',
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone')
      .populate('parkingId', 'name address pricePerHour');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user is authorized to verify this booking
    const parking = await Parking.findById(booking.parkingId);
    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to verify this booking',
      });
    }

    // Check if booking is valid
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking has been cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Booking has already been completed',
      });
    }

    // Check if booking time is valid
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    if (now < startTime) {
      return res.status(400).json({
        success: false,
        error: `Booking starts at ${startTime.toLocaleString()}. Please come at the scheduled time.`,
      });
    }

    if (now > endTime) {
      return res.status(400).json({
        success: false,
        error: 'Booking has expired',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking verified successfully',
      data: {
        _id: booking._id,
        user: booking.userId,
        parking: booking.parkingId,
        vehicleNumber: booking.vehicleNumber,
        vehicleType: booking.vehicleType,
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalAmount: booking.totalAmount,
        status: booking.status,
      }
    });
  } catch (error) {
    console.error('Verify booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify booking',
    });
  }
};

// ✅ @desc    Get booking by QR data (Alternative method)
// @route   POST /api/bookings/verify-qr
// @access  Private (Owner/Admin)
exports.verifyQRData = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        error: 'QR data is required',
      });
    }

    let parsedData;
    try {
      parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code format',
      });
    }

    const { bookingId } = parsedData;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid QR code: Booking ID not found',
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'name email phone')
      .populate('parkingId', 'name address pricePerHour');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check authorization
    const parking = await Parking.findById(booking.parkingId);
    if (parking.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to verify this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Verify QR error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify QR code',
    });
  }
};