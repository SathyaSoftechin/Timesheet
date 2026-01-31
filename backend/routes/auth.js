const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');
console.log('✅ authRoutes LOADED');

router.post('/login', login);

module.exports = router;
