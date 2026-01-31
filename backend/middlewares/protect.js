const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  const key = process.env.SECRET;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    return next(
      new ErrorResponse(401, 'No authorization token was found in the request')
    );
  }

  try {
    const payload = jwt.verify(token, key);

    const user = await User.findById(payload.id).populate('role');

    if (!user) {
      return next(
        new ErrorResponse(401, 'You are not logged in as a valid user')
      );
    }

    req.user = user;
    next(); // ✅ only once
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
