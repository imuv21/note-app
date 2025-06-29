import express from 'express';
import { signupValidator, loginValidator, forgotPasswordValidator, verifyPasswordOtpValidator, updateProfileValidator } from '../middlewares/validation.js';
import rateLimiter from '../middlewares/rateLimiter.js';
import authedUser from '../middlewares/authedUser.js';
import authCont from '../controllers/authCont.js';
const router = express.Router();

router.post(
  '/signup',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000 }), // 5 per hour
  signupValidator, authCont.userSignup
);

router.post(
  '/verify-otp',
  rateLimiter({ max: 10 }), // 10 per 15 min
  authCont.verifyOtp
);

router.post(
  '/login',
  rateLimiter({ max: 10 }), // 10 per 15 min
  loginValidator, authCont.userLogin
);

router.post(
  '/forgot-password',
  rateLimiter({ max: 5, windowMs: 60 * 60 * 1000 }), // 5 per hour
  forgotPasswordValidator, authCont.forgotPassword
);

router.post(
  '/verify-password-otp',
  rateLimiter({ max: 10 }), // 10 per 15 min
  verifyPasswordOtpValidator, authCont.verifyPasswordOtp
);

router.use(authedUser);
router.patch(
  '/update-profile',
  updateProfileValidator, authCont.updateProfile
);

export default router;