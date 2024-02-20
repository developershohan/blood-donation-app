import express from 'express';
import { accountActivationByOtp, registerUser } from "../controllers/auth.controller.js" 

const router = express.Router()

router.post("/register", registerUser)
router.post("/account-activation-by-otp/:token", accountActivationByOtp)

export default router