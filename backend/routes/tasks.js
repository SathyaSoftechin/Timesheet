
const express = require('express');
const router = express.Router();

const { addTask, updateTaskStatus } = require('../controllers/tasks');
const protect = require('../middlewares/protect');
const authorize = require('../middlewares/authorize');

/**
 * Admin + Manager → Add task
 */
router.post(
  '/task',
  protect,
  authorize('admin', 'manager'),
  addTask
);

/**
 * Employee → Update task status
 */
router.patch(
  '/task/:id/status',
  protect,
  authorize('employee'),
  updateTaskStatus
);

module.exports = router;
