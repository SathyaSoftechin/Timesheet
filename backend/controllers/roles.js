const Role = require('../models/role');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/*
 * @route   POST /role
 * @access  Admin
 * @desc    Create a user role (only once)
 */
module.exports.createRole = asyncHandler(async (req, res, next) => {
  const { roleId, roleName } = req.body;

  // 1️⃣ Validate input
  if (roleId === undefined || !roleName) {
    return next(new ErrorResponse(400, 'roleId and roleName are required'));
  }

  // 2️⃣ Check duplication
  const existingRole = await Role.findOne({
    $or: [{ roleId }, { roleName }],
  });

  if (existingRole) {
    return next(
      new ErrorResponse(409, 'Role already exists')
    );
  }

  // 3️⃣ Create role
  const role = await Role.create({ roleId, roleName });

  res.status(201).json({
    success: true,
    message: 'Role created successfully',
    role,
  });
});
