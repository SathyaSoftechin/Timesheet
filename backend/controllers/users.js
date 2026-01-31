const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Role = require('../models/role');
const isValidObjectId = require('../utils/validateObjectId');

module.exports.createUser = asyncHandler(async (req, res, next) => {
  const userPayload = { ...req.body };

  const userExists = await User.findOne({ email: userPayload.email });
  if (userExists) {
    return next(
      new ErrorResponse(400, 'User is already registered with this email!')
    );
  }

  const role = await Role.findOne({ roleId: userPayload.role });
  if (!role) {
    return next(new ErrorResponse(400, 'Provide valid role for a user!'));
  }

  userPayload.role = role._id;

  if (userPayload.reportsTo && !isValidObjectId(userPayload.reportsTo)) {
    return next(
      new ErrorResponse(400, 'Provide valid reporting manager!')
    );
  }

  let manager = null;
  if (userPayload.reportsTo) {
    manager = await User.findById(userPayload.reportsTo).populate('role');
    if (!manager) {
      return next(
        new ErrorResponse(400, 'Manager not found with the given id!')
      );
    }

    if (manager.role.roleId !== 1) {
      return next(
        new ErrorResponse(
          400,
          'The ID you gave for the manager is not a manager!'
        )
      );
    }
  }

  const user = new User(userPayload);
  await user.save();

  const token = user.generateAuthToken();
  const userData = { ...user._doc };
  delete userData.password;

  res.header('x-auth-token', token).json({
    success: true,
    status: 200,
    token,
    user: userData,
  });
});
