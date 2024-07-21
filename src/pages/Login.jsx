import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/api/userApi';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authFailure, authRequest, authSuccess, userExist } from '../redux/reducer/userReducer';
import { Button } from '@chakra-ui/react';

// have to check some button 
const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [login, { isLoading}] = useLoginMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(authRequest());
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
    };
    

    return (
        <Fragment>
            <main className="login-form">
                <h1>Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-group">
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <p>
                        Create new account,<Link to="/signup">SIGNUP</Link>
                    </p>
                    <Button
                        isLoading={isLoading}

                        loadingText='Loading'
                        colorScheme='teal'
                        variant='outline'
                        spinnerPlacement='start'
                        type="submit">
                        Login
                    </Button>
                </form>
            </main>
        </Fragment>

    )
}

export default Login