import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../features/reducers/authReducer";
import { showToast } from '../utils/toast';
import { Menu } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../assets/images/logo.png';


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [isHovered, setIsHovered] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    //burger
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const dashboard = () => {
        navigate('/');
    }

    const logoutHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(logout());
            sessionStorage.clear();
            showToast('success', 'Logout Successfully!');
            navigate('/login');
        } catch (error) {
            showToast('error', 'Something went wrong!');
        }
    }

    const postSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/?query=${encodeURIComponent(searchInput.trim())}`);
        } else {
            navigate('/');
        }
        setSearchInput('');
    }

    const searchHandler = (e) => {
        if (e.key === 'Enter') {
            postSearch(e);
        }
    }



    return (
        <Fragment>
            <div className='header'>
                <div className="flex center g10">
                    <div className='header-burger' onClick={toggleMobileMenu}>
                        <Menu />
                    </div>
                    <img className='logo' onClick={dashboard} src={logo} alt="slasa" />
                </div>

                <div className='searchCont'>
                    <input type="text" value={searchInput} placeholder='Search notes...' onChange={(e) => setSearchInput(e.target.value)} onKeyDown={searchHandler} />
                    <SearchIcon onClick={postSearch} />
                </div>

                <div className="nav-mobile">
                    <div className="cartIcon" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        <AccountCircleIcon className='header-icon' />
                        <div className={`hover-div hoverdivone ${isHovered ? 'visible' : ''}`}>
                            <Link to='/' className='text'>Dashboard</Link>
                            <Link to='/profile' className='text'>Profile</Link>
                            <Link onClick={logoutHandler} className='text'>Logout</Link>
                        </div>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && <div className="overlay visible" onClick={toggleMobileMenu}></div>}

            <div className={`drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                    <div className='searchContTwo'>
                        <input type="text" value={searchInput} placeholder='Search products...' onChange={(e) => setSearchInput(e.target.value)} onKeyDown={searchHandler} />
                        <SearchIcon onClick={postSearch} />
                    </div>

                    <Link to="/" className='text'>Dashboard</Link>
                    {!user && <Link to="/login" className='text'>Login</Link>}
                    {!user && <Link to="/signup" className='text'>Signp</Link>}

                    {user && <Link to='/profile' className='text'>Profile</Link>}
                    <Link to='/contact-us' className='text'>Contact us</Link>
                    <Link to='/about-us' className='text'>About us</Link>

                    {user && <Link onClick={logoutHandler} className='text'>Logout</Link>}
                </div>
            </div>
        </Fragment>
    )
};

export default Header;