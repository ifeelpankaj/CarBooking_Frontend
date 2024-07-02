import React, {Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt, FaCog, FaBookmark, FaBars,FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyLogoutQuery } from '../redux/api/userApi';
import { userNotExist } from '../redux/reducer/userReducer';
import toast from 'react-hot-toast';

const Header = () => {
    const {  user } = useSelector(
        (state) => state.auth
    );
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [logout] = useLazyLogoutQuery();
    const dispatch = useDispatch();
    const onLogout = async () => {
        try {
          // Execute the logout query
          const result = await logout();
      
          if (result.data.success === true ) { 
            dispatch(userNotExist()); 
            toast.success(result.data.message)
    
          } else {
            toast.error('Unable to Logout failed:',); // Handle errors
          }
        } catch (error) {
          toast.error('Error during logout:', error); // Handle unexpected errors
        }
      };
      

    return (
        <Fragment>
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="header__container">
                <Link to="/" className="header__logo">
                    <FaCar className="header__logo-icon" />
                    <span className="header__logo-text">VelocityRide</span>
                </Link>

                <nav className="header__nav">
                    <Link to="/" className="header__nav-link">Home</Link>
                    <Link to="/fleet" className="header__nav-link">Our Fleet</Link>
                    <Link to="/services" className="header__nav-link">Services</Link>
                    <Link to="/contact" className="header__nav-link">Contact</Link>
                </nav>

                <div className="header__user">
                    {user?._id ? (
                        <>
                            <button
                                className="header__user-toggle"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <FaUser />
                                <span>{user.name}</span>
                            </button>
                            <div className={`header__user-menu ${isMenuOpen ? 'header__user-menu--open' : ''}`}>
                                <Link to="/profile" className="header__user-link">
                                    <FaUser /> Profile
                                </Link>
                                <Link to="/bookings" className="header__user-link">
                                    <FaBookmark /> My Bookings
                                </Link>
                                {user.role === "Admin" && (
                                    <Link to="/admin" className="header__user-link">
                                        <FaCog /> Admin Panel
                                    </Link>
                                )}
                                <button onClick={onLogout} className="header__user-link header__logout">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="header__auth-button">
                            Sign In
                        </Link>
                    )}
                </div>

                <button
                    className="header__mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <FaBars />
                </button>
            </div>

           {isMobileMenuOpen && (
                <div className="header__mobile-menu header__mobile-menu--open">
                    <button 
                        className="header__mobile-menu-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close mobile menu"
                    >
                        <FaTimes />
                    </button>
                    <div className="header__mobile-menu-title">VelocityRide</div>

                    {user?._id ? (
                        <>
                            <Link to="/login" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                        </>
                    ) : (
                        <Link to="/login" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    )}
                    <Link to="/" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/fleet" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Fleet</Link>
                    <Link to="/services" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
                    <Link to="/contact" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    {user?._id ? (
                        <>
                            <button onClick={onLogout} className="header__user-link header__logout">
                                    <FaSignOutAlt /> Logout
                                </button>
                        </>
                    ) : (
                        <Link to="/login" className="header__nav-link" onClick={() => setIsMobileMenuOpen(false)}>Terms & Condition</Link>
                    )}
                    
                </div>
            )}
        </header>
        </Fragment>
    );
};

export default Header;
