import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProductDetails from './components/products/productDetails';

//Layouts
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/layouts/Home';
import "react-toastify/dist/ReactToastify.css";

//Carts
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/orders/ListOrders'
import OrderDetails from './components/orders/OrderDetails'

// admin routes
import Dashboard from './components/admin/Dashboard';
import CreateProduct from './components/admin/CreateProduct';
import ProductsList from './components/admin/ProductsList';
import AdminProductDetails from './components/admin/AdminProductDetails';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import AdminUserDetails from './components/admin/UserDetails';
import ProductReviews from './components/admin/ProductReviews';
import UpdateProduct from './components/admin/UpdateProduct';
import CreateCategory from './components/admin/CreateCategory';
import CategoryList from './components/admin/CategoryList';
import AdminCategoryDetails from './components/admin/CategoryDetails';
import UpdateCategory from './components/admin/UpdateCategory';

// auth user
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/updateProfile';
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
              <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} />} exact="true" />

            <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
            <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
            <Route path="/order/confirm" element={<ProtectedRoute element={ConfirmOrder} />} />
            <Route path="/payment" element={<Payment shippingInfo={state.shippingInfo} />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/orders/me" element={<ListOrders />} />
            <Route path="/order/:id" element={<OrderDetails />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Route for /me, using ProtectedRoute */}
            <Route path="/me" element={<ProtectedRoute element={Profile} />} />
            <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} isAdmin={true} />} />
            {/* Product Routes */}
            <Route path="/admin/products" element={<ProtectedRoute element={ProductsList} isAdmin={true} />} />
            <Route path="/admin/product" element={<ProtectedRoute element={CreateProduct} isAdmin={true} />} />
            <Route path="/admin/product/:id" element={<ProtectedRoute element={UpdateProduct} isAdmin={true} />} />
            <Route path="/admin/getprod/:id" element={<ProtectedRoute element={AdminProductDetails} isAdmin={true} />} />
            {/* Category Routes */}
            <Route path="/admin/category" element={<ProtectedRoute element={CreateCategory} isAdmin={true} />} />
            <Route path="/admin/categories" element={<ProtectedRoute element={CategoryList} isAdmin={true} />} />
            <Route path="/admin/category/:id" element={<ProtectedRoute element={UpdateCategory} isAdmin={true} />} />
            <Route path="/admin/categor/:id" element={<ProtectedRoute element={AdminCategoryDetails} isAdmin={true} />} />
            {/* Order Routes */}
            <Route path="/admin/orders" element={<ProtectedRoute element={OrdersList} isAdmin={true} />} />
            <Route path="/admin/order/:id" element={<ProtectedRoute element={ProcessOrder} isAdmin={true} />} />
            {/* User Routes */}
            <Route path="/admin/users" element={<ProtectedRoute element={UsersList} isAdmin={true} />} />
            <Route path="/admin/user/:id" element={<ProtectedRoute element={UpdateUser} isAdmin={true} />} />
            <Route path="/admin/getUser/:id" element={<ProtectedRoute element={AdminUserDetails} isAdmin={true} />} />
            <Route path="/admin/reviews" element={<ProtectedRoute element={ProductReviews} isAdmin={true} />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
