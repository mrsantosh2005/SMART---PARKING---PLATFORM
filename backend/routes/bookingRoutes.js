const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getParkingBookings,
  cancelBooking,
  completeBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking, checkValidation } = require('../middleware/validation');

router
  .route('/')
  .post(protect, validateBooking, checkValidation, createBooking);

router.get('/my-bookings', protect, getMyBookings);
router.get('/parking/:parkingId', protect, authorize('owner', 'admin'), getParkingBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/complete', protect, authorize('owner', 'admin'), completeBooking);

module.exports = router;