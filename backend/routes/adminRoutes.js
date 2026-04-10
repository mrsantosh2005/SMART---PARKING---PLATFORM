const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingOwners,
  approveOwner,
  getAllParkings,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/pending-owners', getPendingOwners);
router.put('/approve-owner/:id', approveOwner);
router.get('/parkings', getAllParkings);
router.get('/stats', getStats);

module.exports = router;