const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getParkingBookings,
  cancelBooking,
  completeBooking,
  verifyBooking,      // ✅ Add this
  verifyQRData        // ✅ Optional - alternative method
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking, checkValidation } = require('../middleware/validation');

// =============================================
// PROTECTED ROUTES (Authentication required)
// =============================================

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (User)
router.post(
  '/',
  protect,
  validateBooking,
  checkValidation,
  createBooking
);

// @route   GET /api/bookings/my-bookings
// @desc    Get logged in user's bookings
// @access  Private (User)
router.get('/my-bookings', protect, getMyBookings);

// @route   GET /api/bookings/parking/:parkingId
// @desc    Get all bookings for a specific parking (owner only)
// @access  Private (Owner/Admin)
router.get('/parking/:parkingId', protect, authorize('owner', 'admin'), getParkingBookings);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private (User who booked or Admin)
router.put('/:id/cancel', protect, cancelBooking);

// @route   PUT /api/bookings/:id/complete
// @desc    Mark booking as completed (owner only)
// @access  Private (Owner/Admin)
router.put('/:id/complete', protect, authorize('owner', 'admin'), completeBooking);

// ✅ @route   POST /api/bookings/verify
// ✅ @desc    Verify booking by QR code (owner/admin only)
// ✅ @access  Private (Owner/Admin)
router.post('/verify', protect, authorize('owner', 'admin'), verifyBooking);

// ✅ @route   POST /api/bookings/verify-qr
// ✅ @desc    Alternative: Verify booking by QR data string
// ✅ @access  Private (Owner/Admin)
router.post('/verify-qr', protect, authorize('owner', 'admin'), verifyQRData);

module.exports = router;