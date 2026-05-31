const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  submitKYC,
  getKYCStatus,
  getPendingKYC,
  getKYCDetails,
  verifyKYC,
  approveOwner,
  getPendingOwners
} = require('../controllers/kycController');

// Owner routes
router.post('/submit', protect, authorize('owner'), upload.fields([
  { name: 'aadharFront', maxCount: 1 },
  { name: 'aadharBack', maxCount: 1 },
  { name: 'panImage', maxCount: 1 },
  { name: 'gstImage', maxCount: 1 },
  { name: 'propertyImage', maxCount: 1 }
]), submitKYC);

router.get('/status', protect, authorize('owner'), getKYCStatus);

// Admin routes - KYC
router.get('/admin/pending', protect, authorize('admin'), getPendingKYC);
router.get('/admin/details/:userId', protect, authorize('admin'), getKYCDetails);
router.put('/admin/verify/:userId', protect, authorize('admin'), verifyKYC);

// Admin routes - Owner Approval
router.get('/admin/pending-owners', protect, authorize('admin'), getPendingOwners);
router.put('/admin/approve-owner/:userId', protect, authorize('admin'), approveOwner);

module.exports = router;