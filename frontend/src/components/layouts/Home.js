import React, { Fragment, useState, useEffect } from 'react'
import Pagination from 'react-js-pagination'
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import MetaData from '../layouts/MetaData'
import Product from '../products/Product'
import Loader from '../layouts/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../actions/productActions'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Carousel } from 'react-bootstrap'


const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)

    const categories = [
        'Necklace',
        'Earrings',
        'Rings',
        'Bracelets',
        'Watches',
        'Brooches'
    ]

    const dispatch = useDispatch();

    const { loading, products, productCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)

    const { keyword } = useParams();


    // Toast functions
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    useEffect(() => {
        dispatch(getProducts(keyword, currentPage, price, category, rating))
            .then(() => {
                successMsg(null);
            })
            .catch((error) => {
                errMsg('An error occurred while fetching products');
            });
    }, [dispatch, keyword, currentPage, price, category, rating]);

    function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = productCount;
    if (keyword) {
        count = filteredProductsCount
    }

    return (
        <Fragment>
            <div className='container justify-content-center' style={{ maxWidth: '1000px', maxHeight: '600px', overflow: 'hidden' }}>
            </div>
            <div className='container'>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title={'Buy Quality Jewels'} />
                        <center>
                            <h1 id="products_heading">Cleopatra</h1>
                        </center>
                        <section id="products" className="container mt-5">
                            <div className="row">

                                {keyword ? (
                                    <Fragment>
                                        <div className="col-6 col-md-3 mt-5 mb-5">
                                            <div className="px-5">
                                                <Range
                                                    marks={{
                                                        1: `$1`,
                                                        1000: `$1000`
                                                    }}
                                                    min={1}
                                                    max={1000}
                                                    defaultValue={[1, 1000]}
                                                    tipFormatter={value => `%${value}`}
                                                    tipProps={{
                                                        placement: "top",
                                                        visible: true
                                                    }}
                                                    value={price}
                                                    onChange={price => setPrice(price)}
                                                />

                                                <hr className="my-5" />
                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Categories
                                                    </h4>

                                                    <ul className='pl-0'>
                                                        {categories.map(category => (
                                                            <li
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    listStyleType: 'none'
                                                                }}
                                                                key={category}
                                                                onClick={() => setCategory(category)
                                                                }
                                                            >
                                                                {category}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <hr className="my-3" />
                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Ratings
                                                    </h4>

                                                    <ul className='pl-0'>
                                                        {[5, 4, 3, 2, 1].map(star => (
                                                            <li
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    listStyleType: 'none'
                                                                }}
                                                                key={star}
                                                                onClick={() => setRating(star)
                                                                }
                                                            >
                                                                <div className='rating-outer'>
                                                                    <div className='rating-inner'
                                                                        style={{ width: `${star * 20}%` }}>
                                                                    </div>
                                                                </div>
                                                                {star} Star
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-9">
                                            <div className="row">
                                                {products && products.map(product => (
                                                    <Product key={product._id} product={product}
                                                        col={4} />
                                                ))}
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    products && products.map(product => (
                                        <Product key={product._id} product={product} col={3} />
                                    ))
                                )}


                            </div>
                        </section>

                        {resPerPage <= count && (
                            <div className="d-flex justify-content-center mt-5">
                                <Pagination
                                    activePage={currentPage}
                                    itemsCountPerPage={resPerPage}
                                    totalItemsCount={productCount}
                                    onChange={setCurrentPageNo}
                                    nextPageText={'Next'}
                                    prevPageText={'Prev'}
                                    firstPageText={'First'}
                                    lastPageText={'Last'}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                />
                            </div>
                        )}
                    </Fragment>
                )},
            </div>
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Fragment >
    )
}

export default Home