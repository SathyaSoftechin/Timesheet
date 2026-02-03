const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/users');
const protect = require('../middlewares/protect');
const authorize = require('../middlewares/authorize');

router.post(
  '/create-user',
  protect,
  authorize('admin','manager'), // 👈 admins and manager can create users
  createUser
);

module.exports = router;


