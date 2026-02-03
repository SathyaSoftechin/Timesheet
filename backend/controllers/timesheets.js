
const User = require('../models/user');
const Timesheet = require('../models/timesheet');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const isValidObjectId = require('../utils/validateObjectId');

/*
 * @route   POST /timesheet
 * @access  Admin, Manager
 */
module.exports.createTimesheet = asyncHandler(async (req, res) => {
  const roleId = req.user.role.roleId;

  if (roleId !== 0 && roleId !== 1) {
    throw new ErrorResponse(403, 'Only admin or manager can create timesheet');
  }

  const { employee, ...payload } = req.body;

  if (!employee || !isValidObjectId(employee)) {
    throw new ErrorResponse(400, 'Invalid employee id');
  }

  const user = await User.findById(employee);
  if (!user) {
    throw new ErrorResponse(404, 'Employee not found');
  }

  // Manager can create timesheet only for their team
  if (roleId === 1 && !user.reportsTo?.equals(req.user._id)) {
    throw new ErrorResponse(403, 'You can create timesheet only for your team');
  }

  const timesheet = await Timesheet.create({
    ...payload,
    employee,
  });

  res.status(201).json({
    success: true,
    timesheet,
  });
});

/*
 * @route   POST /rate-timesheet/:id
 * @access  Manager
 */
module.exports.rateTimesheet = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const { id } = req.params;

  if (req.user.role.roleId !== 1) {
    throw new ErrorResponse(403, 'Only managers can rate timesheets');
  }

  if (rating === undefined || rating < 0 || rating > 5) {
    throw new ErrorResponse(400, 'Rating must be between 0 and 5');
  }

  if (!isValidObjectId(id)) {
    throw new ErrorResponse(400, 'Invalid timesheet id');
  }

  const timesheet = await Timesheet.findById(id).populate('employee');
  if (!timesheet) {
    throw new ErrorResponse(404, 'Timesheet not found');
  }

  if (!timesheet.employee.reportsTo?.equals(req.user._id)) {
    throw new ErrorResponse(403, 'You are not the reporting manager');
  }

  if (timesheet.rating !== undefined) {
    throw new ErrorResponse(400, 'Timesheet already rated');
  }

  timesheet.rating = rating;
  await timesheet.save();

  res.json({
    success: true,
    rating,
  });
});

/*
 * @route   GET /timesheets
 * @access  Protected
 */
module.exports.getMyTimesheets = asyncHandler(async (req, res) => {
  const timesheets = await Timesheet.find({ employee: req.user._id })
    .populate('employee', 'name email')
    .populate('tasks')
    .sort({ date: -1 });

  res.json({
    success: true,
    timesheets,
  });
});

/*
 * @route   POST /timesheets
 * @access  Protected
 */
module.exports.findMyTimesheets = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    throw new ErrorResponse(400, 'Start and end date required');
  }

  const timesheets = await Timesheet.find({
    employee: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  })
    .populate('employee', 'name email')
    .populate('tasks')
    .sort({ date: -1 });

  res.json({
    success: true,
    timesheets,
  });
});

/*
 * @route   GET /timesheet/:id
 * @access  Protected
 */
module.exports.getTimesheet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!isValidObjectId(id)) {
    throw new ErrorResponse(400, 'Invalid timesheet id');
  }

  const timesheet = await Timesheet.findById(id)
    .populate('employee', 'name email reportsTo')
    .populate('tasks');

  if (!timesheet) {
    throw new ErrorResponse(404, 'Timesheet not found');
  }

  const isAdmin = user.role.roleId === 0;
  const isOwner = timesheet.employee._id.equals(user._id);
  const isManager = timesheet.employee.reportsTo?.equals(user._id);

  if (!isAdmin && !isOwner && !isManager) {
    throw new ErrorResponse(403, 'Access denied');
  }

  timesheet.tasks.sort(
    (a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
  );

  res.json({
    success: true,
    timesheet,
  });
});

/*
 * @route   GET /employees-timesheets
 * @access  Admin, Manager
 */
module.exports.getEmployeesTimesheets = asyncHandler(async (req, res) => {
  const roleId = req.user.role.roleId;

  let filter = {};

  // Admin → all timesheets
  if (roleId === 0) {
    filter = {};
  }

  // Manager → only team timesheets
  else if (roleId === 1) {
    const employeeIds = await User.find({ reportsTo: req.user._id })
      .distinct('_id');

    filter = { employee: { $in: employeeIds } };
  }

  else {
    throw new ErrorResponse(403, 'Access denied');
  }

  const timesheets = await Timesheet.find(filter)
    .populate('employee', 'name email role')
    .populate('tasks')
    .sort({ date: -1 });

  res.json({
    success: true,
    timesheets,
  });
});
