import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/layouts/Home';
import ProductDetails from './components/products/productDetails';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/orders/ListOrders'
// admin imports
import Dashboard from './components/admin/Dashboard';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/updateProfile';

// admin imports
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/route/ProtectedRoute';
function App() {


    const [state, setState] = useState({
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    })

    const saveShippingInfo = async (data) => {
        setState({
            ...state,
            shippingInfo: data
        })
        localStorage.setItem('shippingInfo', JSON.stringify(data))
    }


    return (
        <Router>
            <div className="App">
                <div className="container">
                    <Header />
                </div>
                <div className="container container-fluid">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search/:keyword" element={<Home />} />
                        <Route path="/product/:id" element={<ProductDetails />} />

                        <Route path="/cart" element={<Cart />} />
                        <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
                        <Route path="/order/confirm" element={<ProtectedRoute element={ConfirmOrder} />} />
                        <Route path="/payment" element={<Payment shippingInfo={state.shippingInfo} />} />
                        <Route path="/success" element={<OrderSuccess />} />
                        <Route path="/orders/me" element={<ListOrders />} />


                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Route for /me, using ProtectedRoute */}
                        <Route path="/me" element={<ProtectedRoute element={Profile} />} />
                        <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
