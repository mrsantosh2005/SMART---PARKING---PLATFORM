const express = require('express');
const router = express.Router();
const {
  addParking,
  getParkings,
  getParking,
  updateParking,
  getMyParkings,
} = require('../controllers/parkingController');
const { protect, authorize, checkOwnerApproval } = require('../middleware/auth');
const { validateParking, checkValidation } = require('../middleware/validation');

router
  .route('/')
  .get(getParkings)
  .post(
    protect,
    authorize('owner', 'admin'),
    checkOwnerApproval,
    validateParking,
    checkValidation,
    addParking
  );

router.get('/owner/my-parkings', protect, authorize('owner'), getMyParkings);

router
  .route('/:id')
  .get(getParking)
  .put(protect, authorize('owner', 'admin'), updateParking);

module.exports = router;