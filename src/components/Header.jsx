import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaUser, FaSignOutAlt, FaCog, FaBookmark,  FaCarSide } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyLogoutQuery } from '../redux/api/userApi';
import { userNotExist } from '../redux/reducer/userReducer';
import toast from 'react-hot-toast';
import { resetForm } from '../redux/reducer/bookingSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [logout] = useLazyLogoutQuery();
    const dispatch = useDispatch();

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

    const handleClickOutside = (event) => {
        if (!event.target.closest('.header__user-menu')) {
            setIsMenuOpen(false);
        }
    };

    // Add event listener for clicks on the document
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (
        <motion.header 
            className="header"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="header__container">
                <Link to="/" className="header__logo">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <FaCar className="header__logo-icon" />
                    </motion.div>
                    <span className="header__logo-text">VelocityRide</span>
                </Link>

                <nav className="header__nav">
                    {['Home', 'Our Fleet', 'Services', 'Contact'].map((item, index) => (
                        <motion.div
                            key={item}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="header__nav-link">
                                {item}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                <div className="header__user">
                    {user?._id ? (
                        <motion.div
                            className="header__user-menu"
                            whileHover={{ scale: 1.05 }}
                        >
                            <button className="header__user-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <FaUser />
                                {/* <span>{user.name}</span> */}
                            </button>
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        className="header__user-dropdown"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link to="/profile" className="header__user-link">
                                            <FaUser /> Profile
                                        </Link>
                                        <Link to={user.role !== "Passenger" ? "/mybookings" : "/bookings"} className="header__user-link">
                                            <FaBookmark /> My Bookings
                                        </Link>
                                        {user.role !== "Passenger" && "Admin" && (
                                            <Link to="/myRide" className="header__user-link">
                                                <FaCarSide /> My Ride
                                            </Link>
                                        )}
                                        {user.role === "Admin" && (
                                            <Link to="/admin" className="header__user-link">
                                                <FaCog /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={onLogout} className="header__user-link header__logout">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/login" className="header__auth-button">
                                Sign In
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

export default Header;