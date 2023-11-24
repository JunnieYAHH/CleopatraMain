import React, { Fragment, useState, useEffect } from 'react'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layouts/MetaData'
import Loader from '../layouts/Loader'
import Sidebar from './Sidebar'
import Swal from 'sweetalert2'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ProductReviews = () => {

    const token = localStorage.getItem('token');
    const getUser = JSON.parse(localStorage.getItem('user'));

    const [productId, setProductId] = useState('')
    const [error, setError] = useState('')
    const [listReviews, setListReviews] = useState([])
    const [deleteError, setDeleteError] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)
    const [user, setUser] = useState(getUser)
   
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    const getProductReviews = async (id) => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/reviews?id=${id}`, config)
            setListReviews(data.reviews)

        } catch (error) {
            setError(error.response.data.message)
        }
    }
    const deleteReview = async (id, productId) => {
        try {
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/reviews?id=${id}&productId=${productId}`, config)
            setIsDeleted(data.success)

        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    }

    const deleteReviewHandler = (id) => {
        Swal.fire({
            title: 'Delete User',
            icon: 'info',
            text: 'Do you want to delete this user',
            confirmButtonText: 'Delete',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReview(id, productId)
            }
        })

    }
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    useEffect(() => {
        if (error) {
            errMsg ('error fetching reviews', 'error')
            setError('')
        }

        if (deleteError) {
            errMsg(deleteError, 'error');
            setDeleteError('')
        }

        if (productId !== '') {
            getProductReviews(productId)
        }

        if (isDeleted) {
            successMsg('Review deleted successfully', 'success');
            setIsDeleted(false)
        }
    }, [error, productId, isDeleted, deleteError])

    const submitHandler = (e) => {
        e.preventDefault();
        getProductReviews(productId)
    }

    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        listReviews.forEach(review => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,

                actions:
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteReviewHandler(review._id)}>
                        <i className="fa fa-trash"></i>
                    </button>

            })
        })
        return data;
    }

    return (
        <Fragment>
            <MetaData title={'Product Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="productId_field">Enter Product ID</label>
                                        {/* needtomodify */}
                                        <input
                                            type="text"
                                            id="productId_field"
                                            className="form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        id="search_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-2"
                                    >
                                        SEARCH
                                    </button>
                                </ form>
                            </div>
                        </div>
                        {listReviews && listReviews.length > 0 ? (
                            <MDBDataTable
                                data={setReviews()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        ) : (
                            <p className="mt-5 text-center">No Reviews.</p>
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default ProductReviews