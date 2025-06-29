
export const getSignupMessage = (firstName, otp) => {
    return `
        <div style="font-family: 'Roboto', sans-serif; width: 100%;">
            <div style="background: #5AB2FF; padding: 10px 20px; border-radius: 3px; border: none">
               <a href="" style="font-size:1.6em; color: white; text-decoration:none; font-weight:600">Note App</a>
            </div>
            <p>Hello <span style="color: #5AB2FF; font-size: 1.2em; text-transform: capitalize;">${firstName}</span>!</p>
            <p>Thank you for choosing Note App. Use the following OTP to complete your Sign Up procedure. This OTP is valid for 2 minutes.</p>
            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
               <div style="background: #5AB2FF; color: white; width: fit-content; border-radius: 3px; padding: 5px 10px; font-size: 1.4em;">${otp}</div>
            </div>
            <p>Regards,</p>
            <p>Note App</p>
        </div>`;
};

export const getForgotPasswordMessage = (otp) => {
    return `
        <div style="font-family: 'Roboto', sans-serif; width: 100%;">
            <div style="background: #5AB2FF; padding: 10px 20px; border-radius: 3px; border: none">
                <a href="#" style="font-size:1.6em; color: white; text-decoration:none; font-weight:600">Note App</a>
            </div>
            <p>Hello there!</p>
            <p>Use the following OTP to reset your password. This OTP is valid for 10 minutes.</p>
            <div style="display: flex; align-items: center; justify-content: center; width: 100%;">
                <div style="background: #5AB2FF; color: white; width: fit-content; border-radius: 3px; padding: 5px 10px; font-size: 1.4em;">${otp}</div>
            </div>
            <p>Regards,</p>
            <p>Note App</p>
        </div>`;
}; 