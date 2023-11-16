const router = require('express').Router();
const { registerController, loginController } = require('../controller/auth');
const validate = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../request/auth');

router.post('/register', validate(registerSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

module.exports = router;
