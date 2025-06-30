import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from "../../utils/toast";
import { updateProfile } from "../../features/thunks/authThunks";
import { clearErrors } from "../../features/reducers/authReducer";
import DOMPurify from 'dompurify';

import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';


const Profile = () => {

    const dispatch = useDispatch();
    const { user, profLoading, profErrors, profError } = useSelector((state) => state.auth);
    const [isClickedFooter, setIsClickedFooter] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setFormValues({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || ''
            });
        }
    }, [user]);

    const handleClickFooter = (event) => {
        event.preventDefault();
        setIsClickedFooter(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        dispatch(clearErrors());
    };
    const closepopup = (event) => {
        event.preventDefault();
        setIsClickedFooter(false);
    };

    const getProfError = (field) => Array.isArray(profErrors) ? profErrors.find(error => error.path === field) : null;
    const firstNameError = getProfError('firstName');
    const lastNameError = getProfError('lastName');

    const profileSubmit = async (event) => {
        event.preventDefault();
        if (isSubmitted) return;
        if (firstNameError || lastNameError) {
            showToast('error', 'Please fix the errors before submitting the form!');
            return;
        }
        setIsSubmitted(true);
        try {
            const userData = {
                firstName: DOMPurify.sanitize(formValues.firstName),
                lastName: DOMPurify.sanitize(formValues.lastName)
            };
            const response = await dispatch(updateProfile(userData)).unwrap();
            if (response.status) {
                showToast('success', `${response.message}`);
                setIsClickedFooter(false);
            } else {
                showToast('error', `${response.message}`);
            }
        } catch (error) {
            showToast('error', 'Something went wrong!');
        } finally {
            setIsSubmitted(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isClickedFooter) {
                setIsClickedFooter(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isClickedFooter]);


    return (
        <Fragment>
            <Helmet>
                <title>Note App — Profile</title>
                <meta
                    name="description"
                    content="Update your profile information on Note App."
                />
                <link rel="canonical" href="https://note21.netlify.app/profile" />
            </Helmet>
            <div className="page flexcol center">
                <article className='w100 flex center-start'><h1 className='heading'>Profile</h1></article>

                <div className="profile">
                    <div className="flex verify center-start g5">
                        <p className="textBig fw-800">{user?.firstName || 'Unknown'} {user?.lastName || 'Unknown'}</p> <EditIcon style={{ cursor: 'pointer' }} onClick={(e) => handleClickFooter(e, user)} />
                    </div>
                    <div className="flexcol start-center">
                        <p className="text" style={{ color: 'var(--codeThree)' }}>Email</p>
                        <p className="text verify flex center-start g5" >{user?.email || 'example@gmail.com'}
                            {user?.isVerified === 1 ? <VerifiedIcon /> : <NewReleasesIcon style={{ color: 'orange' }} />}
                        </p>
                    </div>
                </div>

                <div className={`popup-btn ${isClickedFooter ? 'clicked' : ''}`}>
                    {isClickedFooter && (
                        <div className="popup">
                            <form className="popup-wrapper" onSubmit={profileSubmit}>
                                <h2 className="heading">Update Profile</h2>

                                <div className="popInputCont">
                                    <div className="flexcol start-center w100 g5">
                                        <input type="text" name='firstName' autoComplete="given-name" placeholder='Enter your first name...' value={formValues.firstName} onChange={handleInputChange} />
                                        {firstNameError && <p className="error">{firstNameError.msg}</p>}
                                    </div>
                                    <div className="flexcol start-center w100 g5">
                                        <input type="text" name='lastName' autoComplete="family-name" placeholder='Enter your last name...' value={formValues.lastName} onChange={handleInputChange} />
                                        {lastNameError && <p className="error">{lastNameError.msg}</p>}
                                    </div>
                                    <div className="flexcol start-center w100 g5">
                                        <input type="email" disabled name='email' className='disabled' autoComplete='email' placeholder='Enter your email...' value={formValues.email} onChange={handleInputChange} />
                                        <p className="error">Email used for login can't be changed</p>
                                        {profError && <p className="error">{profError}</p>}
                                    </div>
                                </div>

                                <div className="flex w100 g10" style={{ justifyContent: 'space-between' }}>
                                    <button type='submit' disabled={isSubmitted || profLoading}>{(isSubmitted || profLoading) ? 'Updating...' : 'Update'}</button>
                                    <button type="button" onClick={closepopup}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default Profile