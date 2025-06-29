import { check, body } from "express-validator";

const signupValidator = [
    // check("firstName").not().isEmpty()
    //     .withMessage("First name is required!").isLength({ max: 50 })
    //     .withMessage("First name must not exceed 50 characters!"),
    // check("lastName").not().isEmpty()
    //     .withMessage("Last name is required!").isLength({ max: 50 })
    //     .withMessage("Last name must not exceed 50 characters!"),
    check("email")
        .notEmpty().withMessage("Email is required!")
        .isEmail().withMessage("Invalid email address!")
        .normalizeEmail({ gmail_remove_dots: true }),
    check("password")
        .notEmpty().withMessage("Password is required!")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password must contain at least 8 characters, one uppercase, one lowercase letter, one number, and one special character!")
        .isLength({ max: 50 }).withMessage("Password must not exceed 50 characters!"),
    body("confirmPassword")
        .notEmpty().withMessage("Confirm Password is required!")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match!");
            }
            return true;
        })
];

const loginValidator = [
    check("email")
        .notEmpty().withMessage("Email is required!")
        .isEmail().withMessage("Invalid email address!")
        .normalizeEmail({ gmail_remove_dots: true }),
    check("password")
        .notEmpty().withMessage("Password is required!")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password must contain at least 8 characters, one uppercase, one lowercase letter, one number, and one special character!")
        .isLength({ max: 50 }).withMessage("Password must not exceed 50 characters!")
];

const forgotPasswordValidator = [
    check("email")
        .notEmpty().withMessage("Email is required!")
        .isEmail().withMessage("Invalid email address!")
        .normalizeEmail({ gmail_remove_dots: true }),
];

const verifyPasswordOtpValidator = [
    check("otp")
        .notEmpty().withMessage("OTP is required!")
        .isNumeric().withMessage("OTP must be a number!")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be exactly 6 digits long!"),
    check("newPassword")
        .notEmpty().withMessage("Password is required!")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password must contain at least 8 characters, one uppercase, one lowercase letter, one number, and one special character!")
        .isLength({ max: 50 }).withMessage("Password must not exceed 50 characters!"),
    body("confirmNewPassword")
        .notEmpty().withMessage("Confirm Password is required!")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match!");
            }
            return true;
        })
];

const noteValidator = [
    check("title").not().isEmpty().withMessage("Title is required!")
        .isLength({ max: 100 }).withMessage("Title must not exceed 50 characters!"),
    check("description").not().isEmpty().withMessage("Description is required!")
        .isLength({ max: 5000 }).withMessage("Description must not exceed 5000 characters!")
];

const updateProfileValidator = [
    check("firstName")
        .not().isEmpty().withMessage("First name is required!")
        .isLength({ max: 100 }).withMessage("First name must not exceed 100 characters!"),
    check("lastName")
        .not().isEmpty().withMessage("Last name is required!")
        .isLength({ max: 100 }).withMessage("Last name must not exceed 100 characters!")
];

export { signupValidator, loginValidator, forgotPasswordValidator, verifyPasswordOtpValidator, noteValidator, updateProfileValidator };