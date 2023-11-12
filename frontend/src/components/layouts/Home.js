import React, { Fragment,useState ,useEffect } from 'react'
import Pagination  from 'react-js-pagination'

import MetaData from '../layouts/MetaData'
import Product from '../products/Product'
import Loader from '../layouts/Loader'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../actions/productActions'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = ({ match }) => {

    const[currentPage, setCurrentPage] = useState(1)


    const dispatch = useDispatch();

    const { loading, products, error, productCount,resPerpage  } = useSelector(state => state.products)

    const keyword = match?.params?.keyword || '';


    // Toast functions
    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    useEffect(() => {
        dispatch(getProducts(keyword, currentPage))
            .then(() => {
                // errMsg('An error occurred while fetching products');
                successMsg(null);
            })
            .catch((error) => {
                // successMsg('Products fetched successfully');
                errMsg('An error occurred while fetching products');
            });
    }, [dispatch, keyword, currentPage]);

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }

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
                
                    <div className="d-flex justify-content-center mt-5">
                         <Pagination
                           activePage={currentPage}
                           itemsCountPerPage={resPerpage}
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
                   
                </Fragment>
            )},
            <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Fragment>
    )
}

export default Home