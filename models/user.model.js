import mongoose from "mongoose";

// create user Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true

    },
    email: {
        type: String,
        trim: true,
        unique: true

    },
    phone: {
        type: String,
        trim: true,

    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null,
        trim: true,
    },
    accessToken: {
        type: String,
        default: null,
        trim: true,
    },
    isActivate: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    trash: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

// export Schema
export default mongoose.model("User", userSchema)