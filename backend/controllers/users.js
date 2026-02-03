const User = require('../models/user');
const Role = require('../models/role');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const isValidObjectId = require('../utils/validateObjectId');

/*
 * @route   POST /api/users
 * @access  Admin
 * @desc    Create a new user (company-ready)
 */
module.exports.createUser = asyncHandler(async (req, res, next) => {
  const userPayload = { ...req.body };

  /* 1️⃣ Check duplicate email */
  const userExists = await User.findOne({ email: userPayload.email });
  if (userExists) {
    return next(
      new ErrorResponse(400, 'User already exists with this email')
    );
  }

  /* 2️⃣ Validate role */
  const role = await Role.findOne({ roleId: userPayload.role });
  if (!role) {
    return next(
      new ErrorResponse(400, 'Invalid role provided')
    );
  }

  userPayload.role = role._id;

  /* 3️⃣ Validate reportsTo (manager) */
  if (userPayload.reportsTo) {
    if (!isValidObjectId(userPayload.reportsTo)) {
      return next(
        new ErrorResponse(400, 'Invalid manager ID')
      );
    }

    const manager = await User.findById(userPayload.reportsTo).populate('role');

    if (!manager) {
      return next(
        new ErrorResponse(400, 'Manager not found')
      );
    }

    if (manager.role.roleId !== 1) {
      return next(
        new ErrorResponse(400, 'reportsTo must be a manager')
      );
    }
  }

  /* 4️⃣ Create user */
  const user = new User(userPayload);
  await user.save();

  /* 5️⃣ Remove password from response */
  const userData = { ...user._doc };
  delete userData.password;

  /* 6️⃣ Response */
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: userData,
  });
});
