import React, { Fragment, useEffect } from 'react'

import MetaData from '../layouts/MetaData'
import Product from '../products/Product'
import Loader from '../layouts/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../actions/productActions'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const dispatch = useDispatch();

    const { loading, products, error, productCount } = useSelector(state => state.products)

    // Toast functions
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    useEffect(() => {
        dispatch(getProducts())
            .then(() => {
                // errMsg('An error occurred while fetching products');
                successMsg('Products fetched successfully');
            })
            .catch((error) => {
                // successMsg('Products fetched successfully');
                errMsg('An error occurred while fetching products');
            });
    }, [dispatch]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Buy Quality Jewels'} />
                    <h1 id="products_heading">Latest Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                </Fragment>
            )},
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Fragment>
    )
}

export default Home