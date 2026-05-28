const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  completeBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/complete', protect, authorize('owner', 'admin'), completeBooking);

module.exports = router;