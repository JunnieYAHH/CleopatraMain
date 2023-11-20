import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

//Login
export const login = (email, password) => async (dispatch) => {
    try {

        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/login`, { email, password }, config)

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

// REGISTER USER
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/register`, userData, config)

        console.log(data);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// LOAD USER
export const loadUser = () => async (dispatch) => {
    try {

        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User': `Bearer ${user}`,
            },
        };

        dispatch({ type: LOAD_USER_REQUEST })

        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/me`, config)

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }

}


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    });
};
