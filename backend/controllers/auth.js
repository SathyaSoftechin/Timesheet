const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(400, 'Email and password required'));
  }

  // ✅ POPULATE ROLE HERE (CRITICAL)
  const user = await User.findOne({ email }).populate('role');

  if (!user) {
    return next(new ErrorResponse(401, 'Invalid email or password'));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(401, 'Invalid email or password'));
  }

  // ✅ NOW roleId & roleName EXIST
  const token = user.generateAuthToken();

  const userData = { ...user._doc };
  delete userData.password;

  res.status(200).json({
    success: true,
    token,
    user: userData,
  });
});
