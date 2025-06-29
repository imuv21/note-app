import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from "../../utils/toast";
import { verifyOtp, signupUser } from "../../features/thunks/authThunks";
import { clearErrors, setSignupData } from "../../features/reducers/authReducer";


const VerifyOTP = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { otpError, signupData } = useSelector((state) => state.auth);

    // Focus management
    const otpInputs = useRef([]);
    const focusNextInput = currentIndex => {
        if (currentIndex < otpInputs.current.length - 1) {
            otpInputs.current[currentIndex + 1].focus();
        }
    };
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));

    const handleInputChange = async (index, newValue) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = newValue;
        setOtpDigits(newOtpDigits);
        if (newValue !== '' && index < otpDigits.length - 1) {
            focusNextInput(index);
        }
        const isOtpComplete = newOtpDigits.every(digit => digit !== '');

        if (isOtpComplete) {
            try {
                const userData = {
                    email: signupData.email,
                    role: 'User',
                    otp: Number(newOtpDigits.join(''))
                };
                const otpResponse = await dispatch(verifyOtp(userData)).unwrap();

                if (otpResponse.status) {
                    dispatch(setSignupData(null));
                    showToast('success', `${otpResponse.message}`);
                    navigate('/login');

                } else {
                    showToast('error', `${otpResponse.message}`);
                }
            } catch (error) {
                showToast('error', 'Something went wrong!');
            }
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '') {
            e.preventDefault();
            if (index > 0) {
                otpInputs.current[index - 1].focus();
            }
        } else if (/^\d$/.test(e.key)) {
            e.preventDefault();
            handleInputChange(index, e.key);
            focusNextInput(index);
        }
    };
    useEffect(() => {
        otpInputs.current[0].focus();
        dispatch(clearErrors());
    }, [dispatch]);

    //time
    const [timeLeft, setTimeLeft] = useState(121);
    const [timerRunning, setTimerRunning] = useState(true);
    useEffect(() => {
        if (timerRunning) {
            const timerInterval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [timerRunning]);
    useEffect(() => {
        if (timeLeft === 0) {
            setTimerRunning(false);
        }
    }, [timeLeft]);

    const handleResendClick = async () => {
        try {
            const response = await dispatch(signupUser(signupData)).unwrap();

            if (response.status) {
                showToast('success', `${response.message}`);
                setTimeLeft(121);
                setTimerRunning(true);
            } else {
                showToast('error', `${response.message}`);
            }
        } catch (error) {
            showToast('error', 'Something went wrong!');
        }
    };

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);


    return (
        <Fragment>
            <Helmet>
                <title>Note App — Verify OTP</title>
                <meta
                    name="description"
                    content="Enter the OTP sent to your email to verify your account."
                />
                <link
                    rel="canonical"
                    href="https://noteapp.netlify.app/verify-otp"
                />
            </Helmet>

            <div className='page flexcol center' style={{ height: '100vh' }}>
                <div className="authBox">
                    <h1 className="headingBig">OTP Verification</h1>
                    <p className="textBig">Enter the OTP you received to {signupData?.email}</p>

                    <div className="otpCont">
                        {otpDigits.map((digit, index) => (
                            <input key={index} value={digit} maxLength={1} className='otpBox' ref={el => (otpInputs.current[index] = el)} onChange={e => handleInputChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <div className='flexcol center g10'>
                        {otpError && <p className="error">{otpError}</p>}
                        <button style={{ borderRadius: 'var(--brTwo)' }} disabled={timerRunning} onClick={handleResendClick}>
                            {timerRunning ? `Resend OTP in ${timeLeft}` : "Resend OTP"}
                        </button>
                        <Link to="/login" className='text'>Go Back</Link>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default VerifyOTP