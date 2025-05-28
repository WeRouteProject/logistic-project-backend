import express from 'express';
import { register, login, getDeliveryBoys } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middlewares/validateInput.js';
import ExistingUser from '../middlewares/ExistingUser.js';
import authorizeRole from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/deliveryboys', ExistingUser, authorizeRole(['admin']), getDeliveryBoys);

export default router;
