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
 * @description Get single users
 * @method Get
 * @route /api/v1/user/:id
 * @access public
 */

export const getSingleUser = asyncHandler(async (req, res) => {

    const {id} = req.params
    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ message: `User is not availble` })
    
    }
    res.status(200).json( user)

})

/**
 * @description Create new user
 * @method Post
 * @route /api/v1/user/
 * @access public
 */

export const createNewUser = asyncHandler(async (req, res) => {

    const { name, email, phone, password } = req.body

    // validation
    if (!name || !email || !phone || !password) {
        res.status(400).json({ message: `All field must be required` })
    }

    // check email validation
    if (!isEmail(email)) {
        return res.status(400).json({ message: `Email is not valid` })
    }

    // check phone validation
    if (!isMobile(phone)) {
        return res.status(400).json({ message: `Mobile Number is not valid` })
    }


    // check email existence
    const checkEmail = await User.findOne({ email })
    if (checkEmail) {
        return res.status(400).json({ message: `Email already exist` })
    }

    // check phone existence
    const checkPhone = await User.findOne({ phone })
    if (checkPhone) {
        return res.status(400).json({ message: `Phone already exists` })
    }

    let fileData = null
    if (req.file) {

        const data = await fileUploadToCloudinary(req.file.path)
        fileData = data.secure_url
    }
    // hash Password
    const hashPass = await bcrypt.hash(password, 10)

    // create new user
    const user = await User.create({
        name, email, phone, password: hashPass, photo: fileData
    })

    res.status(201).json({ user, message: `User created successfully` })

})

/**
 * @description Delete user
 * @method Delete
 * @route /api/v1/user/:id
 * @access public
 */

export const deleteUser = asyncHandler(async (req, res) => {

    // get user id
    const { id } = req.params

    // delete user fro db
    const user = await User.findByIdAndDelete(id)

    // delete user fro cloudinary
    await fileDeleteToCloudinary(getPublicId(user.photo))


    res.status(200).json({ user, message: `User deleted successfully` })
})

/**
 * @description Update user
 * @method Put/ Patch
 * @route /api/v1/user/:id
 * @access public
 */

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name, email, phone } = req.body

    const user = await User.findByIdAndUpdate(id, {
        name, email, phone
    },
        {new: true})

    res.status(200).json({ user, message: `User updated successfully`})

})