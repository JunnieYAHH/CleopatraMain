import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'

import Loader from '../layouts/Loader'
import MetaData from '../layouts/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';

const AdminProductDetails = () => {

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [error, setError] = useState('')
    // const [quantity, setQuantity] = useState(0)
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('')
    const token = localStorage.getItem('token');



    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    let { id } = useParams()

    const getAdminProducts = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/product/${id}`, config)
            console.log(data)
            setProduct(data.product)
            setLoading(false)
        } catch (error) {

            setError(error.response.data.message)

        }
    }


    useEffect(() => {
        getAdminProducts(id)
        if (success) {
            successMsg('Product get successfully')
            setSuccess(false)

        }
    }, [id, error, errorReview, success]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={product.name} />
                    <div className="row d-flex justify-content-around">
                        <div className="container col-18 border p-4 mt-4">
                            <div className="row">
                                <div className="col-5 col-lg-5 img-fluid" id="product_image">
                                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'gray', borderRadius: '8px' }}>

                                        <Carousel pause='hover'>
                                            {product.images && product.images.map(image => (
                                                <Carousel.Item key={image.public_id}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={image.url}
                                                        alt={product.title}
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                        <br />
                                        <br />
                                        <h4 style={{ color: 'white' }}>Product # {product._id}</h4>
                                        <br />
                                        <br />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-5 mt-5">
                                    <div className='col-12 mt-4 border p-4' style={{ background: 'black' }}>
                                        <div className='col-12 mt-4 border p-4' style={{ background: 'gray' }}>

                                            <h3>{product.name}</h3>

                                            <hr />

                                            <div className="rating-outer">
                                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                                            </div>
                                            <span id="no_of_reviews" style={{ color: 'black' }}>({product.numOfReviews} Reviews)</span>

                                            <hr />

                                            <p id="product_price">${product.price}</p>
                                            <div className="stockCounter d-inline">
                                                <input type="number" className="form-control count d-inline" value={product.quantity} readOnly />
                                            </div>

                                            <hr />

                                            <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} >{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                                            <hr />

                                            <h4 className="mt-2">Description:</h4>
                                            <p>{product.description}</p>
                                            <hr />
                                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )

}
export default AdminProductDetails