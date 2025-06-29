import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from "../../utils/toast";
import { forgotPassword } from "../../features/thunks/authThunks";
import { clearErrors, setEmailData } from "../../features/reducers/authReducer";
import DOMPurify from 'dompurify';


const ForgotPassword = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fopaLoading, fopaErrors, fopaError } = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: ''
    });

    //form signup
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        dispatch(clearErrors());
    };

    const getForgotError = (field) => Array.isArray(fopaErrors) ? fopaErrors.find(error => error.path === field) : null;
    const emailError = getForgotError('email');

    const handleForgot = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (emailError) {
            showToast('error', 'Please fix the errors before submitting the form!');
            return;
        }
        setIsSubmitting(true);
        try {
            const userData = {
                email: DOMPurify.sanitize(formData.email)
            };
            const response = await dispatch(forgotPassword(userData)).unwrap();

            if (response.status) {
                dispatch(setEmailData({
                    email: userData.email
                }));
                showToast('success', `${response.message}`);
                navigate('/new-password');
            }
        } catch (error) {
            showToast('error', 'Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);


    return (
        <Fragment>
            <Helmet>
                <title>Note App — Forgot Password</title>
                <meta
                    name="description"
                    content="Request a password reset link for your Note App account."
                />
                <link
                    rel="canonical"
                    href="https://noteapp.netlify.app/forgot-password"
                />
            </Helmet>

            <div className='page flexcol center' style={{ height: '100vh' }}>
                <form className="authBox" onSubmit={handleForgot}>
                    <h1 className="headingBig">Forgot Password?</h1>
                    <p className="textBig">Enter your email to get the otp.</p>

                    <div className='flexcol center g10 w100'>
                        <div className="flexcol start-center w100 g5">
                            <input type="email" name='email' autoComplete='email' style={{ borderRadius: 'var(--brTwo)' }} placeholder='Enter your email...' value={formData.email} onChange={handleChange} />
                            {emailError && <p className="error">{emailError.msg}</p>}
                            {fopaError && <p className="error">{fopaError}</p>}
                        </div>
                    </div>

                    <div className='flexcol center g10'>
                        <button type="submit" style={{ borderRadius: 'var(--brTwo)' }} disabled={isSubmitting || fopaLoading}>{(isSubmitting || fopaLoading) ? 'Sending...' : 'Send OTP'}</button>
                        <Link to="/register" className='text'>Go Back</Link>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default ForgotPassword