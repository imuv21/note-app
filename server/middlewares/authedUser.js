import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { userModel } from '../models/User.js';

const authedUser = async (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, message: "Unauthorized user, no token provided!" });
    }
    const token = authorization.split(' ')[1];
    try {
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(401).json({ status: false, message: "Invalid user ID!" });
        }
        req.user = await userModel.findById(userID).select('-password');
        if (!req.user) {
            return res.status(401).json({ status: false, message: "Unauthorized user, user not found!" });
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: false, message: "Token expired. Please login again!" });
        }
        return res.status(401).json({ status: false, message: "Unauthorized user, invalid token!" });
    }
};

export default authedUser;