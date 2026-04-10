const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('role').optional().isIn(['user', 'owner']).withMessage('Invalid role'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.validateParking = [
  body('name').notEmpty().withMessage('Parking name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('latitude').isNumeric().withMessage('Valid latitude is required'),
  body('longitude').isNumeric().withMessage('Valid longitude is required'),
  body('totalCarSlots').isInt({ min: 0 }).withMessage('Valid car slots required'),
  body('totalBikeSlots').isInt({ min: 0 }).withMessage('Valid bike slots required'),
  body('pricePerHour').isFloat({ min: 0 }).withMessage('Valid price required'),
];

exports.validateBooking = [
  body('parkingId').notEmpty().withMessage('Parking ID is required'),
  body('vehicleType').isIn(['car', 'bike']).withMessage('Valid vehicle type required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('startTime').isISO8601().withMessage('Valid start time required'),
  body('endTime').isISO8601().withMessage('Valid end time required'),
];

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};