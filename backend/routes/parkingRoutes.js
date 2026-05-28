const express = require('express');
const router = express.Router();
const {
  addParking,
  getParkings,
  getParking,
  updateParking,
  deleteParking,
  getMyParkings,
} = require('../controllers/parkingController');
const { protect, authorize, checkOwnerApproval } = require('../middleware/auth');

// Public routes
router.get('/', getParkings);
router.get('/:id', getParking);

// Protected routes
router.post('/', protect, authorize('owner', 'admin'), checkOwnerApproval, addParking);
router.put('/:id', protect, authorize('owner', 'admin'), updateParking);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteParking);
router.get('/owner/my-parkings', protect, authorize('owner'), getMyParkings);

module.exports = router;