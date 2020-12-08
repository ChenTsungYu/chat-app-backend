const router = require('express').Router();
const { login, register } = require('../controllers/authController');
const { validate } = require('../validators');
const { rules: registrationRules } = require('../validators/auth/register');
const { rules: loginRules } = require('../validators/auth/login');
// [ middlewares ]
router.post('/login', [loginRules, validate], login);

router.post('/register', [registrationRules, validate], register);

module.exports = router;