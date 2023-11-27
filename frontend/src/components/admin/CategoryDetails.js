import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'

import Loader from '../layouts/Loader'
import MetaData from '../layouts/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';

const AdminCategoryDetails = () => {

    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState([])
    const [error, setError] = useState('')
    // const [quantity, setQuantity] = useState(0)
    const [errorReview, setErrorReview] = useState('');
    const [success, setSuccess] = useState('')
    const token = localStorage.getItem('token');

    console.log(category)

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    let { id } = useParams()

    const getAdminCategory = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/${id}`, config)
            console.log(data)
            setCategory(data.category)
            setLoading(false)
        } catch (error) {

            setError(error.response.data.message)

        }
    }


    useEffect(() => {
        getAdminCategory(id)
        if (success) {
            successMsg('Category get successfully')
            setSuccess(false)

        }
    }, [id, error, errorReview, success]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={category.name} />
                    <div className="row d-flex justify-content-around">
                        <div className="container col-18 border p-4 mt-4">
                            <div className="row">
                                <div className="col-5 col-lg-5 img-fluid" id="category_image">
                                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'gray', borderRadius: '8px' }}>

                                        <Carousel pause='hover'>
                                            {category.images && category.images.map(image => (
                                                <Carousel.Item key={image.public_id}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={image.url}
                                                        alt={category.name}
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                        <br />
                                        <br />
                                        <h4 style={{ color: 'white' }}>Cateogory # {category._id}</h4>
                                        <br />
                                        <br />
                                    </div>
                                </div>

                                <div className="col-12 col-lg-5 mt-5">
                                    <div className='col-12 mt-4 border p-4' style={{ background: 'black' }}>
                                        <div className='col-12 mt-4 border p-4' style={{ background: 'gray' }}>

                                            <h3>{category.name}</h3>

                                            <hr />


                                            <h4 className="mt-2">Description:</h4>
                                            <p>{category.description}</p>
                                            <hr />
                                            
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
export default AdminCategoryDetails