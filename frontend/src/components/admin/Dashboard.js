import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../layouts/MetaData'
import Loader from '../layouts/Loader'
import Sidebar from './Sidebar'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

import MonthlySalesChart from './charts/monthlySalesChart';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    // const [mSales, setMonthlySales] = useState('')
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    let outOfStock = 0;
    products.forEach(product => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    })
    const getAdminProducts = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/products`, config)
            setProducts(data.products)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)

        }
    }

    useEffect(() => {
        getAdminProducts()
    }, [])

    // const monthlySales = async () => {
    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         }

    //         const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/monthlySales`, config)
    //         setMonthlySales(data.salesPerMonth)
    //         setLoading(false)

    //     } catch (error) {
    //         setError(error.response.data.message)
    //     }
    // }
    // useEffect(() => {
    //     monthlySales()

    // }, [])


    return (
        <Fragment>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader /> : (
                        <Fragment>
                            <MetaData title={'Admin Dashboard'} />
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Products<br /> <b>{products && products.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <div className="card-body">
                                                {/* <div className="text-center card-font-size">monthlySales<br /> <b>{mSales}</b></div> */}
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                    <MonthlySalesChart />
                </div>
            </div>
        </Fragment >
    )
}
export default Dashboard