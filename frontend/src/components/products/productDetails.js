import React, { Fragment, useEffect } from 'react';
import '../../ProductDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import {
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../../constants/productConstants';

import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import { Carousel } from 'react-bootstrap'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../actions/productActions';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, product } = useSelector(state => state.productDetails);

    const errMsg = (message = '') =>
        toast.error(message, {
            position: toast.POSITION.BOTTOM_CENTER,
        });

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

        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch, id]);

    return (
        <Fragment>
            <ToastContainer />
            {loading ?
                <Loader />
                : (
                    <Fragment>
                        <MetaData title={product.name} />
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
                                        <span className="btn btn-danger minus">-</span>

                                        <input type="number" className="form-control count d-inline" value="1" readOnly />

                                        <span className="btn btn-primary plus">+</span>
                                    </div>
                                    <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button>

                                    <hr />

                                    <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor': 'redColor'} > {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                                    <hr />

                                    <h4 className="mt-2">Description:</h4>
                                    <p>{product.description}</p>
                                    <hr />
                                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>

                                    <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal"
                                        data-target="#ratingModal">
                                        Submit Your Review
                                    </button>

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
