

const express = require('express');
const router = express.Router();

const {
  createTimesheet,
  rateTimesheet,
  getMyTimesheets,
  findMyTimesheets,
  getTimesheet,
  getEmployeesTimesheets,
} = require('../controllers/timesheets');

const protect = require('../middlewares/protect');
const authorize = require('../middlewares/authorize');
const validateId = require('../middlewares/validateId');

/**
 * Admin + Manager → Create timesheet
 */
router.post(
  '/timesheet',
  protect,
  authorize('admin', 'manager'), // ✅ FIXED
  createTimesheet
);

/**
 * Admin + Manager → View team timesheets
 */
router.get(
  '/employees-timesheets',
  protect,
  authorize('admin', 'manager'), // ✅ FIXED
  getEmployeesTimesheets
);

/**
 * Admin / Manager / Owner → View single timesheet
 */
router.get(
  '/timesheet/:id',
  validateId('id'),
  protect,
  getTimesheet
);

/**
 * Any logged-in user → Own timesheets
 */
router
  .route('/timesheets')
  .get(protect, getMyTimesheets)
  .post(protect, findMyTimesheets);

/**
 * Manager → Rate timesheet
 */
router.post(
  '/rate-timesheet/:id',
  validateId('id'),
  protect,
  authorize('manager'),
  rateTimesheet
);

module.exports = router;
