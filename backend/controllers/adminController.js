const User = require('../models/User');
const Parking = require('../models/Parking');
const Booking = require('../models/Booking');

// @desc    Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get pending owners
exports.getPendingOwners = async (req, res) => {
  try {
    const owners = await User.find({
      role: 'owner',
      isApproved: false,
    }).select('-password');
    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Approve owner
exports.approveOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
      message: 'Owner approved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all parkings
exports.getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find().populate('ownerId', 'name email');
    res.status(200).json({
      success: true,
      count: parkings.length,
      data: parkings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get platform statistics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalParkings = await Parking.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const bookings = await Booking.find({ paymentStatus: 'completed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    
    // Get active bookings (confirmed)
    const activeBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalParkings,
        totalBookings,
        activeBookings,
        completedBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    await user.remove();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};