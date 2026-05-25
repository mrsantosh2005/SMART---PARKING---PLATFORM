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
const { validateParking, checkValidation } = require('../middleware/validation');

// =============================================
// PUBLIC ROUTES
// =============================================
router.get('/', getParkings);
router.get('/:id', getParking);

// =============================================
// OWNER SPECIFIC ROUTES
// =============================================
router.get('/owner/my-parkings', protect, authorize('owner'), getMyParkings);

// =============================================
// PROTECTED ROUTES
// =============================================
router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  checkOwnerApproval,
  validateParking,
  checkValidation,
  addParking
);

router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  updateParking
);

// ✅ Add this delete route
router.delete(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  deleteParking
);

module.exports = router;