import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../actions/userActions'
import { useNavigate } from 'react-router-dom';



//Google Login
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    const errMsg = (message = '') =>
        toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const loginWithFacebook = (email, accessToken) => {
        // Dispatch the necessary actions for Facebook login
        dispatch(login(email, accessToken));
      };

    useEffect(() => {

        if (isAuthenticated) {
            navigate('/')
        }

        if (error) {
            errMsg(error);
            dispatch(clearErrors());
        }

    }, [dispatch, navigate, isAuthenticated, error])

    const submitHandler = (response, e) => {
        e.preventDefault();
        dispatch(login(email, password))

        const { email, accessToken } = response;
        dispatch(loginWithFacebook(email, accessToken));
    }


    return (
        <Fragment>
            <ToastContainer />
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input type="email" id="email_field" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input type="password" id="password_field" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                                <button id="login_button" type="submit" className="btn btn-block py-3">
                                    LOGIN
                                </button>

                                <Link to="/register" className="float-right mt-3">New User?</Link>
                                <LoginSocialFacebook appId="649261693947479" onResolve={(response) => { console.log(response); }} onReject={(error) => { console.log(error) }} onSubmit={submitHandler}>
                                    <FacebookLoginButton />
                                </LoginSocialFacebook>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login