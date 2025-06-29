import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from "express-validator";
import { userModel } from '../models/User.js';
import sendMail from '../middlewares/sendMail.js';
import sendError from '../utils/sendError.js';
import { getSignupMessage, getForgotPasswordMessage } from '../utils/emailTemplates.js';


class authCont {

    //auth conts
    static userSignup = async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { firstName, lastName, email, password } = req.body;
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                return res.status(400).json({ status: false, message: `User already exists!` });
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
            const otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes

            const generatedFirstName = firstName || `User${crypto.randomInt(1000, 9999)}`;
            const generatedLastName = lastName || `-${crypto.randomBytes(3).toString('hex')}`;
            const newUser = new userModel({ firstName: generatedFirstName, lastName: generatedLastName, email, password: hashPassword, otp, otpExpiry });
            await newUser.save();

            const signupMsg = getSignupMessage(newUser.firstName, otp);

            await sendMail(newUser.email, 'Verify your account', signupMsg);
            return res.status(201).json({ status: true, message: `Please verify your email using the OTP sent to ${newUser.email}` });

        } catch (error) {
            sendError(res);
        }
    };

    static verifyOtp = async (req, res) => {
        try {
            const { email, otp } = req.body;
            if (!otp) {
                return res.status(400).json({ status: false, message: "OTP is required!" });
            }
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ status: false, message: "User not found!" });
            }
            if (user.otp !== otp) {
                return res.status(400).json({ status: false, message: "Invalid OTP!" });
            }
            if (Date.now() > user.otpExpiry) {
                return res.status(400).json({ status: false, message: "OTP expired!" });
            }
            await userModel.updateOne({ email },
                {
                    $unset: { otp: "", otpExpiry: "" },
                    $set: { isVerified: 1 }
                }
            );
            return res.status(200).json({ status: true, message: "Email verified successfully. Please login now." });

        } catch (error) {
            sendError(res);
        }
    };

    static userLogin = async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found!" });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ status: false, message: "Email or password is incorrect!" });
            }
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            const userResponse = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            };
            return res.status(200).json({ status: true, message: "User logged in successfully.", token, user: userResponse });

        } catch (error) {
            sendError(res);
        }
    };

    static forgotPassword = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found!" });
            }

            const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
            const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
            await userModel.updateOne({ email },
                { $set: { otp, otpExpiry } }
            );

            const forgotMsg = getForgotPasswordMessage(otp);

            await sendMail(user.email, 'Reset Your Password', forgotMsg);
            return res.status(200).json({ status: true, message: `OTP sent to ${user.email}.` });

        } catch (error) {
            sendError(res);
        }
    };

    static verifyPasswordOtp = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { email, otp, newPassword } = req.body;
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found!" });
            }
            if (user.otp !== otp) {
                return res.status(400).json({ status: false, message: "Invalid OTP!" });
            }
            if (Date.now() > user.otpExpiry) {
                return res.status(400).json({ status: false, message: "OTP expired!" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);

            await userModel.updateOne({ email },
                {
                    $set: { password: hashPassword },
                    $unset: { otp: "", otpExpiry: "" }
                }
            );
            return res.status(200).json({ status: true, message: "Password updated successfully." });

        } catch (error) {
            sendError(res);
        }
    };

    static updateProfile = async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { firstName, lastName } = req.body;
            const userId = req.user._id;
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found!" });
            }

            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            await user.save();
            return res.status(200).json({ status: true, message: "Profile updated successfully.", profile: { firstName: user.firstName, lastName: user.lastName } });

        } catch (error) {
            return res.status(500).json({ status: false, message: "Server error, Please try again later!" });
        }
    };
};

export default authCont;