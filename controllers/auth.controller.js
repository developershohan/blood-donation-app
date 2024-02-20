import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  fileDeleteToCloudinary,
  fileUploadToCloudinary,
} from "../utils/cloudinary.js";
import {
  createOTP,
  getPublicId,
  isEmail,
  isMobile,
  tokenDecode,
} from "../helpers/helper.js";
import { sendSMS } from "../utils/sendSMS.js";
import { AccountActivationEmail } from "../mails/AccountActivationEmail.js";

/**
 * @description register user
 * @method Post
 * @route /api/v1/auth/register
 * @access public
 */

export const registerUser = asyncHandler(async (req, res) => {
  const { name, auth, password } = req.body;

  // validation
  if (!name || !auth || !password) {
    return res.status(400).json({ message: `All field must be required` });
  }

  let otp = createOTP();
  let authEmail = null;
  let authPhone = null;

  if (isEmail(auth)) {
    authEmail = auth;

    const checkEmail = await User.findOne({ email: auth });
    if (checkEmail) {
      return res.status(400).json({ message: `Email already exist` });
    }
  } else if (isMobile(auth)) {
    authPhone = auth;

    // check phone existence
    const checkPhone = await User.findOne({ phone: auth });
    if (checkPhone) {
      return res.status(400).json({ message: `Phone already exists` });
    }
  } else {
    return res
      .status(400)
      .json({ message: "You must use a Mobile number or Email address" });
  }

  // hash Password
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    email: authEmail,
    phone: authPhone,
    password: hashPass,
    accessToken: otp,
  });

  if (user) {
    // send token to cookie
    const activationToken = jwt.sign(
      { auth },
      process.env.ACCOUNT_ACTIVATION_SECRET_KEY,
      { expiresIn: "15min" }
    );
    res.cookie("activationToken", activationToken);

    if (authEmail) {
      // send OTP

      await AccountActivationEmail(auth, { code: otp, link: "" });
    } else if (authPhone) {
      await sendSMS(auth, `Hello ${name}, Your OTP is ${otp} `);
    }
  }

  res.status(201).json({ user, message: `User created successfully` });
});

/**
 * @description user Account Activation OTP
 * @method post
 * @route /api/v1/auth/account-activation-by-otp/:token
 * @access public
 */

export const accountActivationByOtp = asyncHandler(async (req, res) => {
  // get token
  const { token } = req.params;
  const { otp } = req.body;

  console.log(token);

  // token decode
   const activationToken = tokenDecode(token)

   console.log(activationToken);
   const tokenVerify = jwt(activationToken, process.env.ACCOUNT_ACTIVATION_SECRET_KEY)


  // response
  res.status(201).json({ user, message: `User created successfully` });
});
