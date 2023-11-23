import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/layouts/Home';
import ProductDetails from './components/products/productDetails';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping'
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/updateProfile';

// admin imports
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/route/ProtectedRoute';

import { loadUser } from './actions/userActions';
import store from './store';

function App() {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

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
                        <Route path="/shipping" element={<ProtectedRoute element={Shipping} />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* Route for /me, using ProtectedRoute */}
                        <Route path="/me" element={<ProtectedRoute element={Profile} />} />
                        <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
                        <Route path="/dashboard" isAdmin={true} element={<ProtectedRoute element={Dashboard} />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
