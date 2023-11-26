import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductDetails from './components/products/productDetails';
import { toast, ToastContainer } from 'react-toastify';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Home from './components/layouts/Home';
import "react-toastify/dist/ReactToastify.css";
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/orders/ListOrders'
import OrderDetails from './components/orders/OrderDetails'
// admin imports
import Dashboard from './components/admin/Dashboard';
import CreateProduct from './components/admin/CreateProduct';
import ProductsList from './components/admin/ProductsList';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';
import UpdateProduct from './components/admin/UpdateProduct';

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

  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity)
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/${id}`)
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity
      }

      const isItemExist = state.cartItems.find(i => i.product === item.product)
      console.log(isItemExist, state)
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item]
      // })
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
        })
      }
      else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        })
      }

      toast.success('Item Added to Cart', {
        position: toast.POSITION.BOTTOM_RIGHT
      })

    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT
      });
      // navigate('/')
    }

  }

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.product !== id)
    })
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
  }

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

            <Route path="/cart" element={<Cart cartItems={state.cartItems} addItemToCart={addItemToCart} removeItemFromCart={removeItemFromCart} />} exact="true" />
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
            <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} isAdmin={true} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} isAdmin={true} />} />
            <Route path="/admin/products" element={<ProtectedRoute element={ProductsList} isAdmin={true} />} />
            <Route path="/admin/product" element={<ProtectedRoute element={CreateProduct} isAdmin={true} />} />
            <Route path="/admin/orders" element={<ProtectedRoute element={OrdersList} isAdmin={true} />} />
            <Route path="/admin/order/:id" element={<ProtectedRoute element={ProcessOrder} isAdmin={true} />} />
            <Route path="/admin/users" element={<ProtectedRoute element={UsersList} isAdmin={true} />} />
            <Route path="/admin/user/:id" element={<ProtectedRoute element={UpdateUser} isAdmin={true} />} />
            <Route path="/admin/reviews" element={<ProtectedRoute element={ProductReviews} isAdmin={true} />} />
            <Route path="/admin/product/:id" element={<ProtectedRoute element={UpdateProduct} isAdmin={true} />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
