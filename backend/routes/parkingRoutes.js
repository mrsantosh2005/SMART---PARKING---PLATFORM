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
// PUBLIC ROUTES (No authentication required)
// =============================================

// @route   GET /api/parking
// @desc    Get all parkings (with nearby search & vehicle filter)
// @access  Public
router.get('/', getParkings);

// @route   GET /api/parking/:id
// @desc    Get single parking by ID
// @access  Public
router.get('/:id', getParking);

// =============================================
// OWNER SPECIFIC ROUTES
// =============================================

// @route   GET /api/parking/owner/my-parkings
// @desc    Get all parkings of logged in owner
// @access  Private (Owner only)
router.get('/owner/my-parkings', protect, authorize('owner'), getMyParkings);

// =============================================
// PROTECTED ROUTES (Authentication + Authorization)
// =============================================

// @route   POST /api/parking
// @desc    Add new parking location
// @access  Private (Owner/Admin only)
router.post(
  '/',
  protect,
  authorize('owner', 'admin'),
  checkOwnerApproval,
  validateParking,
  checkValidation,
  addParking
);

// @route   PUT /api/parking/:id
// @desc    Update parking location
// @access  Private (Owner/Admin only)
router.put(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  updateParking
);

// ✅ @route   DELETE /api/parking/:id
// ✅ @desc    Delete parking location (soft delete)
// ✅ @access  Private (Owner/Admin only)
router.delete(
  '/:id',
  protect,
  authorize('owner', 'admin'),
  deleteParking
);

module.exports = router;