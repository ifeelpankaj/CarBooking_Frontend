import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt, FaBookmark, FaBars } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyLogoutQuery } from '../redux/api/userApi';
import { userNotExist } from '../redux/reducer/userReducer';
import { resetForm } from '../redux/reducer/bookingSlice';
import toast from 'react-hot-toast';
import userImg from "../assets/userpic.png"
const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [logout] = useLazyLogoutQuery();
    const dispatch = useDispatch();
    const location = useLocation();
    const onLogout = async () => {
        try {
            dispatch(resetForm());
            const result = await logout();
            if (result.data.success === true) {
                dispatch(userNotExist());
                toast.success(result.data.message);
            } else {
                toast.error('Unable to Logout');
            }
        } catch (error) {
            toast.error('Error during logout');
        }
    };

    const toggleNavMenu = () => {
        setIsNavMenuOpen(!isNavMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsNavMenuOpen(false);
            }
        };

        const handleClickOutside = (event) => {
            if (!event.target.closest('.header__user-menu')) {
                setIsUserMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header__container">
                {isMobileView && (
                    <button className="header__mobile-toggle" onClick={toggleNavMenu}>
                        <FaBars />
                    </button>
                )}

                {!isMobileView && (
                    <Link to="/" className="header__logo">
                        <FaCar className="header__logo-icon" />
                        <span className="header__logo-text">VelocityRide</span>
                    </Link>
                )}

                <nav className={`header__nav ${isNavMenuOpen ? 'header__nav--open' : ''}`}>
                    {['Home', 'Our Fleet', 'Services', 'Contact'].map((item) => (
                        <Link 
                            key={item} 
                            to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                            className={`header__nav-link ${location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`) ? 'active' : ''}`}
                            onClick={() => isMobileView && toggleNavMenu()}
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="header__user">
                    {user?._id ? (
                        <div className="header__user-menu">
                            <button className="header__user-toggle" onClick={toggleUserMenu}>
                            <img src={user?.avatar?.url ? user?.avatar?.url :userImg} alt="User" />
                            </button>
                            {isUserMenuOpen && (
                                <div className="header__user-dropdown">
                                    <Link to="/profile" className="header__user-link">
                                        <FaUser /> Profile
                                    </Link>
                                    {user?.role !== "Driver" ? (
                                        <Link to="/bookings" className="header__user-link">
                                            <FaBookmark /> My Bookings
                                        </Link>
                                    ) : (
                                        <Link to="/mybookings" className="header__user-link">
                                            <FaBookmark /> My Bookings
                                        </Link>
                                    )}
                                    <button onClick={onLogout} className="header__user-link header__logout">
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="header__auth-button">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;