const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/*
 * @route   /api/login
 * @method  POST
 * @access  Public
 */
module.exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    return next(
      new ErrorResponse(400, 'Email and password both are required!')
    );
  }

  // 2️⃣ Find user + populate role
  const user = await User.findOne({ email }).populate({
    path: 'role',
    select: 'roleId roleName',
  });

  // 3️⃣ Invalid credentials (DO NOT reveal which one failed)
  if (!user || !(await user.matchPassword(password))) {
    return next(
      new ErrorResponse(400, 'Invalid email or password')
    );
  }

  // 4️⃣ Generate token
  const token = user.generateAuthToken();

  // 5️⃣ Prepare response
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    reportsTo: user.reportsTo,
  };

  res.status(200).json({
    ...userData,
    token,
  });
});
