const express = require('express');
const router = express.Router();

const { createRole } = require('../controllers/roles');
const protect = require('../middlewares/protect');
const authorize = require('../middlewares/authorize');

router.post(
  '/role',
  protect,
  authorize('admin'), // 👈 ONLY admin can create roles
  createRole
);

module.exports = router;
