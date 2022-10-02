import express from 'express';
import controller from '../controllers/authController';
const router = express.Router();

router.post('/register', controller.register);
router.post('/username', controller.checkUsername);
router.post('/login', controller.login);
router.get('/verify', controller.verify);

export = router;