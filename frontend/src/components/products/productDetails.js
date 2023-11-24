import React, { Fragment, useEffect, useState } from 'react';
import '../../ProductDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';


import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import { Carousel } from 'react-bootstrap'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions'

import {
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../../constants/productConstants';

const ProductDetails = ({   cartItems }) => {

    const [loadings, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [rating, setRating] = useState(0);
    const [products, setProduct] = useState({})
    const [error, setError] = useState('')
    const [comment, setComment] = useState('');
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('')

    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, product } = useSelector(state => state.productDetails);

    const user = localStorage.getItem('user');
    const errMsg = (message = '') =>
        toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const productDetails = async (id) => {
        let link = `http://localhost:4001/api/v1/product/${id}`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        if (!res)
            setError('Product not found')
        setProduct(res.data.product)
        setLoading(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: PRODUCT_DETAILS_REQUEST });

                if (id) {
                    const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`);
                    dispatch({
                        type: PRODUCT_DETAILS_SUCCESS,
                        payload: data.product,
                    });
                }
            } catch (error) {
                dispatch({
                    type: PRODUCT_DETAILS_FAIL,
                    payload: error.response.data.message,
                });
                errMsg('Failed to load product details. Please try again.');
            }
        };

        fetchData();

        productDetails(id)
        if (errorReview) {
            errMsg(errorReview)
            setErrorReview('')
        }
        if (success) {
            successMsg('Review posted successfully')
            setSuccess(false)

        }

        return () => {
            dispatch(clearErrors());
        };
    }, [id, error, errorReview, success]);

    const addToCart = () => {
        dispatch(addItemToCart(id, quantity));
        toast.success('Item Added to Cart');
    }

    const increaseQty = (e) => {
        const count = document.querySelector('.count')

        if (count.valueAsNumber >= product.stock) return;

        const qty = count.valueAsNumber + 1;
        setQuantity(qty)
    }

    const decreaseQty = (e) => {
        const count = document.querySelector('.count')

        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty)
    }


    function setUserRatings() {
        const stars = document.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })
        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange')

                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }
                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow')
                    } else {
                        star.classList.remove('yellow')
                    }
                }
                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    }

    const newReview = async (reviewData) => {
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/review`, reviewData, config)
            setSuccess(data.success)

        } catch (error) {
            setErrorReview(error.response.data.message)
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();

        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', id);

        dispatch(newReview(formData));
    }


    return (
        <Fragment>
            <ToastContainer />
            {loading ?
                <Loader />
                : (
                    <Fragment>
                        {product &&
                            <MetaData title={product.name} />}
                        {product &&
                            <div className="row f-flex justify-content-around singleProduct">
                                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                                    <Carousel pause='hover'>
                                        {product.images && product.images.map(image => (
                                            <Carousel.Item key={image.public_id}>
                                                <img className="d-block w-100" src={image.url} alt={product.name} />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>
                                <div className="col-12 col-lg-5 mt-5">
                                    <h3>{product.name}</h3>
                                    <p id="product_id">Product # {product._id}</p>
                                    <hr />

                                    <div className="ratings mt-auto">
                                        <div className="rating-outer">
                                            <div
                                                className="rating-inner"
                                                style={{ width: `${(product.ratings / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-muted">({product.numOfReviews} Reviews)</span>
                                    </div>

                                    <hr />

                                    <p id="product_price">Price: $ {product.price}</p>
                                    <div className="stockCounter d-inline">
                                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                                    </div>
                                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0} onClick={addToCart}>
                                        Add to Cart
                                    </button>

                                    <hr />

                                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} > {product.stock > 1 ? 'In Stock' : 'Out of Stock'}</span></p>

                                    <hr />

                                    <h4 className="mt-2">Description:</h4>
                                    <p>{product.description}</p>
                                    <hr />
                                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                                    {user ?

                                        <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal"
                                            data-target="#ratingModal" onClick={setUserRatings}>
                                            Submit Your Review
                                        </button>
                                        :
                                        <div className="alert alert-danger mt-5" type='alert'>Login Firts to Add Review</div>
                                    }

                                    <div className="row mt-2 mb-5">
                                        <div className="rating w-50">

                                            <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog"
                                                aria-labelledby="ratingModalLabel" aria-hidden="true">
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">

                                                            <ul className="stars">
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                                <li className="star"><i className="fa fa-star"></i></li>
                                                            </ul>

                                                            <textarea name="review" id="review" className="form-control mt-3">

                                                            </textarea>

                                                            <button className="btn my-3 float-right review-btn px-4 text-white"
                                                                data-dismiss="modal" aria-label="Close">Submit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        }
                    </Fragment>
                )}
        </Fragment>
    );
};

export default ProductDetails;