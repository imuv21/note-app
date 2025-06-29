import mongoose from "mongoose";

//User schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    isVerified: {
        type: Number,
        default: 0,
    },
    otp: {
        type: Number,
        trim: true,
    },
    otpExpiry: {
        type: Date,
    }
});

const userModel = mongoose.model("User", userSchema);
export { userModel };