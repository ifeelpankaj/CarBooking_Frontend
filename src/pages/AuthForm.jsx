import React, { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation, useVerifyMutation, useLoginMutation } from '../redux/api/userApi';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, useDisclosure } from '@chakra-ui/react';
import { authFailure, authRequest, authSuccess, userExist } from '../redux/reducer/userReducer';
import { motion, AnimatePresence } from 'framer-motion';
const AuthForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Passenger");
    const [otp, setOtp] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [register, { isLoading: registerLoading }] = useRegisterMutation();
    const [verify, { isLoading: otpLoading }] = useVerifyMutation();
    const [login, { isLoading: loginLoading }] = useLoginMutation();

    const isLoading = registerLoading || loginLoading;

    const buttonText = isLoading ? (isLogin ? "SIGN IN..." : "SIGN UP...") : (isLogin ? "SIGN IN" : "SIGN UP");
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authRequest());

        if (isLogin) {
            try {
                const res = await login({ email, password }).unwrap();
                if (res.success) {
                    dispatch(authSuccess({ user: res.user, token: res.token }));
                    toast.success(res.message);
                    dispatch(userExist(res));
                    navigate('/');
                } else {
                    toast.error(res.message || 'Unexpected response from server');
                    dispatch(authFailure(res.message || 'Unexpected response from server'));
                }
            } catch (err) {
                const errorMessage = err.data?.message || err.message || 'An error occurred during login';
                toast.error(errorMessage);
                dispatch(authFailure(errorMessage));
            }
        } else {
            try {
                const newUser = { username, email, password, role, phoneNumber };
                const result = await register(newUser).unwrap();
                if (result.success === true) {
                    dispatch(authSuccess({ user: result.user, token: result.token }));
                    toast.success(result.message);
                    onOpen();
                } else {
                    dispatch(authFailure(result.message || 'Unexpected response from server'));
                    toast.error(result.message || 'Unexpected response from server');
                }
            } catch (err) {
                console.error("Registration error:", err);
                let errorMessage = 'Registration failed';
                if (err.data && err.data.message) {
                    errorMessage = err.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }
                dispatch(authFailure(errorMessage));
                toast.error(errorMessage);
            }
        }
    };

    const handleOtpSubmit = async () => {
        try {
            const result = await verify({ email, otp }).unwrap();
            dispatch(authSuccess({ user: result.user, token: result.token }));
            if (result.success === true) {
                toast.success(result.message);
                onClose();
                clearFields();
            } else {
                dispatch(authFailure(result.message || 'Unexpected response from server'));
                toast.error(result.message || 'Unexpected response from server');
            }
        } catch (err) {
            dispatch(authFailure(err.data?.message || 'Verification failed'));
            toast.error("Verification failed")
        }
    };

    const clearFields = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setRole('');
        setOtp('');
    };

    return (

        <Fragment>
            <main className="auth_container">
                <div className="auth_form_side">
                    <h1>{isLogin ? "Sign in" : "Create Account"}</h1>
                    <p className="divider">Use your {isLogin ? "credential" : "email for registration"}</p>
                    <form onSubmit={handleSubmit} className="auth_form">
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const inputPhoneNumber = e.target.value;
                                            if (/^\d{0,10}$/.test(inputPhoneNumber)) {
                                                setPhoneNumber(inputPhoneNumber);
                                            }
                                        }}
                                        pattern="\d{10}"
                                        title="Please enter a 10-digit phone number"
                                        required
                                    />
                                    <div className="auth_role_selector">
                                        <button
                                            type="button"
                                            className={`auth_role_btn ${role === "Passenger" ? "active" : ""}`}
                                            onClick={() => setRole("Passenger")}
                                        >
                                            Passenger
                                        </button>
                                        <button
                                            type="button"
                                            className={`auth_role_btn ${role === "Driver" ? "active" : ""}`}
                                            onClick={() => setRole("Driver")}
                                        >
                                            Driver
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {isLogin && <a href="#" className="auth_forgot_password">Forgot your password?</a>}
                        <Button
                            type="submit"
                            className="auth_submit_btn"
                            isLoading={isLoading} 
                            disabled={isLoading} 
                        >
                            {buttonText}
                        </Button>
                    </form>
                </div>
                <div className="auth_welcome_side">
                    <h2>{isLogin ? "Welcome Back!" : "Hello, Friend!"}</h2>
                    <p>{isLogin
                        ? "To keep connected with us please login with your credential's"
                        : "Enter your details and start journey with us"}
                    </p>
                    <button onClick={() => setIsLogin(!isLogin)} className="auth_switch_btn">
                        {isLogin ? "SIGN UP" : "SIGN IN"}
                    </button>
                </div>
            </main>


            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Verify Your OTP</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    if (value.length <= 6) {
                                        setOtp(value);
                                    }
                                }}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                autoFocus
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            isLoading={otpLoading}
                            loadingText='Loading'
                            variant='outline'
                            spinnerPlacement='start'
                            onClick={handleOtpSubmit}
                        >
                            Verify OTP
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    );
};

export default AuthForm;