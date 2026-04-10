const Booking = require('../models/Booking');
const Parking = require('../models/Parking');

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

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('parkingId', 'name address pricePerHour')
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