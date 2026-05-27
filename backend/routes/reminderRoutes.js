const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  extendBooking,
  sendTrafficAlert,
  getUserReminders,
  triggerReminder
} = require('../controllers/reminderController');

// Extend booking
router.post('/extend', protect, extendBooking);

// Send traffic alert (admin/owner only)
router.post('/traffic-alert', protect, authorize('admin', 'owner'), sendTrafficAlert);

// Get user's upcoming reminders
router.get('/my-reminders', protect, getUserReminders);

// Manually trigger reminder (for testing)
router.post('/trigger', protect, triggerReminder);

module.exports = router;