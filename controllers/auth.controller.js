import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import { fileDeleteToCloudinary, fileUploadToCloudinary } from "../utils/cloudinary.js"
import { getPublicId, isEmail, isMobile } from "../helpers/helper.js"

/**
 * @description Get all users data
 * @method GET
 * @route /api/v1/user/
 * @access public
 */

export const getAllUser = asyncHandler(async (req, res) => {
    // req.status(200).json({`get all User data`})
    const user = await User.find()
    if (user.length > 0) {

        return res.status(200).json({ user, message: ` Total ${user.length} users` })
    }
    res.status(400).json({ message: ` User not found` })
})



/**
 * @description register user
 * @method Post
 * @route /api/v1/auth/register
 * @access public
 */

export const registerUser = asyncHandler(async (req, res) => {

    const { name, auth, password } = req.body

    // validation
    if (!name || !auth || !password) {
        return res.status(400).json({ message: `All field must be required` })
    }




    let authEmail = null
    let authPhone = null

    if (isEmail(auth)) {
        authEmail = auth

        const checkEmail = await User.findOne({ email: auth })
        if (checkEmail) {
            return res.status(400).json({ message: `Email already exist` })
        }
    } else if (isMobile(auth)) {
        authPhone = auth

        // check phone existence
        const checkPhone = await User.findOne({ phone: auth  })
        if (checkPhone) {
            return res.status(400).json({ message: `Phone already exists` })
        }
    } else {
        return res
            .status(400)
            .json({ message: "You must use a Mobile number or Email address" });
    }

    // hash Password
    const hashPass = await bcrypt.hash(password, 10)

    // create new user
    const user = await User.create({
        name, email: authEmail , phone: authPhone , password: hashPass
    })

    res.status(201).json({ user, message: `User created successfully` })

})

