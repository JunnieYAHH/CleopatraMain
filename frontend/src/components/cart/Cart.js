import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../actions/cartActions'
import MetaData from '../layouts/MetaData';

const Cart = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector(state => state.cart)
    // const cartItems = JSON.parse(localStorage.getItem('cartItems'));
    const isAuthenticated = localStorage.getItem('user')
    const [product, setProduct] = useState({})
    const [quantity1, setQuantity] = useState(0)

    const [state, setState] = useState({
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    })

    const addItemToCart = async (id, quantity) => {
        console.log('This is the pakening Quantity', quantity);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`);
            const item = {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity: quantity
            };
            const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const isItemExist = storedCartItems.find(i => i.product === item.product);

            if (isItemExist) {
                const updatedCartItems = storedCartItems.map(i => i.product === isItemExist.product ? item : i);
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            } else {
                const updatedCartItems = [...storedCartItems, item];
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            }
            // console.log('After local storage update:', JSON.parse(localStorage.getItem('cartItems')));
            toast.success('Item Added to Cart', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        } catch (error) {
            toast.error(error, {
                position: toast.POSITION.TOP_LEFT
            });
        }
    };

    const handleRemoveFromCart = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            navigate('/shipping');
        }
    }

    const increaseQty = async (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (newQty > stock) return;
        await addItemToCart(id, newQty);
        window.location.reload()
    }

    const decreaseQty = async (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        await addItemToCart(id, newQty);
        window.location.reload()
    }

    return (
        <Fragment>
            <MetaData title={'Your Cart'} />
            {cartItems === null || cartItems.length === 0 ? (
                <h2 className="mt-5">Your Cart is Empty</h2>
            ) : (
                <Fragment>
                    <h2 className="mt-5">Your Cart: <b>{cartItems.length} items</b></h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            {cartItems.map(item => (
                                <Fragment key={item.product}>
                                    <hr />
                                    <div className="cart-item">
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt="product" height="90" width="115" />
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/products/${item.product}`}>{item.name}</Link>
                                            </div>

                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">${item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span className="btn btn-danger minus" onClick={() => decreaseQty(item.product, item.quantity)}>-</span>
                                                    <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                                                    <span className="btn btn-primary plus" onClick={() => increaseQty(item.product, item.quantity, item.stock)}>+</span>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <span
                                                    id="delete_cart_item"
                                                    className="fa fa-trash btn btn-danger"
                                                    onClick={() => handleRemoveFromCart(item.product)}
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                            <hr />
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)} (Units)</span></p>
                                <p>Est. total: <span className="order-summary-values">${cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}</span></p>

                                <hr />
                                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>Check out</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>

    )
}

export default Cart