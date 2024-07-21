import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation, useVerifyMutation } from '../redux/api/userApi';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack, useDisclosure } from '@chakra-ui/react';
import { authFailure, authRequest, authSuccess } from '../redux/reducer/userReducer';
const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [otp, setOtp] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [register, { isLoading }] = useRegisterMutation();
    const [verify,{isLoading:otpLoading}] = useVerifyMutation();

   


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authRequest());
        try {
            const newUser = { username, email, password, role, phoneNumber };
            console.log(newUser)
            const result = await register(newUser).unwrap();
    
            if (result.success === true) {
                dispatch(authSuccess({ user: result.user,token: result.token }));
                toast.success(result.message);
                onOpen();
            } else {
                dispatch(authFailure(result.message || 'Unexpected response from server'));
                toast.error(result.message || 'Unexpected response from server');
            }
        } catch (err) {
            console.error("Registration error:", err); // Log the entire error object
            
            let errorMessage = 'Registration failed';
            if (err.data && err.data.message) {
                errorMessage = err.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            dispatch(authFailure(errorMessage));
            toast.error(errorMessage);
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
    const handleOtpSubmit = async (e) => {
        try {
            const result = await verify({ email, otp }).unwrap();
            dispatch(authSuccess({ user: result.user, token: result.token }));
            if (result.success === true) {
                toast.success(result.message);
                onClose();
                // userExist(result.user);
                clearFields();
            } else {
                dispatch(authFailure(result.message || 'Unexpected response from server'));
                toast.error(result.message || 'Unexpected response from server');
            }
            
            
            // Redirect to dashboard or show success message
        } catch (err) {
            dispatch(authFailure(err.data?.message || 'Verification failed'));
            toast.error("Verification failed")
        }

    };


    return (
        <Fragment>
            <main className="signup-form">
                <div className="form-container">
                    <h1>SIGN UP</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="username">Name</label>
                        </div>
                        <div className="form-group">
                            <input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const inputPhoneNumber = e.target.value;
                                    // Ensure only numbers and maximum 10 characters
                                    if (/^\d{0,10}$/.test(inputPhoneNumber)) {
                                        setPhoneNumber(inputPhoneNumber);
                                    }
                                }}
                                placeholder=" "
                                pattern="\d{10}"
                                title="Please enter a 10-digit phone number"
                                required
                            />
                            <label htmlFor="phoneNumber">Phone Number</label>
                        </div>
                        <div className="form-group">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="form-group">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=" "
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="role-options">
                            <div className={`radio-button ${role === "Passenger" ? "active" : ""}`} onClick={() => setRole("Passenger")}>
                                <span>Passenger</span>
                            </div>
                            <div className={`radio-button ${role === "Driver" ? "active" : ""}`} onClick={() => setRole("Driver")}>
                                <span>Driver</span>
                            </div>
                        </div>
                        <p>
                            Already have an account, <Link to="/login">LOGIN</Link>
                        </p>
                        <Button
                            isLoading={isLoading}
                            loadingText='Loading'
                            colorScheme='teal'
                            variant='outline'
                            spinnerPlacement='start'
                            type="submit">
                            SIGN UP
                        </Button>
                    </form>
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
                        <Button colorScheme="blue"isLoading={otpLoading}
                            loadingText='Loading'
                            variant='outline'
                            spinnerPlacement='start' onClick={handleOtpSubmit}>
                            Verify OTP
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fragment>
    );
};

export default SignUp;