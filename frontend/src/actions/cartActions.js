import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    SAVE_SHIPPING_INFO
} from '../constants/cartConstants';

export const addItemToCart = (id, quantity, userId) => async (dispatch, getState) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`)
    console.log("Adding item to cart:", id, quantity, userId);


    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
            userId
        }
    });

    toast.success('Added to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    window.location.reload();

    // Store updated cartItems in sessionStorage
    const { cartItems } = getState().cart;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
    });
    toast.success('Removed to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const { cartItems } = getState().cart;

    const updatedCartItems = cartItems.filter(item => item.product !== id);
    window.location.reload();

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
};

export const saveShippingInfo = (data) => (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
};