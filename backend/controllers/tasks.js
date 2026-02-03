const Timesheet = require('../models/timesheet');
const Task = require('../models/task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const isValidObjectId = require('../utils/validateObjectId');

/**
 * Admin + Manager → Add Task
 */
module.exports.addTask = asyncHandler(async (req, res) => {
  const { timesheet: timesheetId, ...payload } = req.body;
  const user = req.user;

  if (!isValidObjectId(timesheetId)) {
    throw new ErrorResponse(400, 'Invalid timesheet id');
  }

  const timesheet = await Timesheet.findById(timesheetId).populate('employee');
  if (!timesheet) {
    throw new ErrorResponse(404, 'Timesheet not found');
  }

  if (user.role.roleId === 2) {
    throw new ErrorResponse(403, 'Employees cannot add tasks');
  }

  // if (timesheet.rating || timesheet.rating === 0) {
  //   throw new ErrorResponse(400, 'Cannot add task after rating');
  // }

  if (
    user.role.roleId === 1 &&
    !timesheet.employee.reportsTo?.equals(user._id)
  ) {
    throw new ErrorResponse(403, 'Not your team member');
  }

  const task = await Task.create({
    ...payload,
    timesheet: timesheetId,
    assignedBy: user._id,
  });

  timesheet.tasks.push(task._id);
  await timesheet.save();

  res.status(201).json({
    success: true,
    task,
  });
});

/**
 * Employee → Update Task Status
 */
module.exports.updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!isValidObjectId(id)) {
    throw new ErrorResponse(400, 'Invalid task id');
  }

  if (!['pending', 'completed'].includes(status)) {
    throw new ErrorResponse(400, 'Invalid status');
  }

  const task = await Task.findById(id).populate({
    path: 'timesheet',
    populate: { path: 'employee' },
  });

  if (!task) {
    throw new ErrorResponse(404, 'Task not found');
  }

  if (!task.timesheet.employee._id.equals(user._id)) {
    throw new ErrorResponse(403, 'Not allowed');
  }

  task.status = status;
  task.completedAt = status === 'completed' ? new Date() : null;

  await task.save();

  res.json({
    success: true,
    task,
  });
});
