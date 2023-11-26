import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Search from './Search'
import '../../App.css'

//Google Login
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'

const Header = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const { cartItems } = useSelector(state => state.cart);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user', user);
    navigate('/login')
  }

  return (

    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* <LoginSocialFacebook appId="649261693947479" onResolve={(response) => {console.log(response);}} onReject={(error) => {console.log(error)}}>
            <FacebookLoginButton/>
          </LoginSocialFacebook> */}
          <a className="navbar-brand" href="/">
            <Link to="/">
              <img src="../../images/CleopatraLogo.png" alt="Logo" style={{ width: '150px', height: '75px', borderRadius: '25%' }} />
            </Link>
          </a>
          <Search />
          <div className="d-flex align-items-center">
            {user ?
              <Fragment>
                {user && user.role !== 'admin' ? (
                  <Link to="/cart" style={{ textDecoration: 'none' }}>
                    <span id="cart" className="ml-3">  <i className="fa-solid fa-cart-shopping" style={{ color: '#000000' }}></i></span>
                    <span className="ms-1" id="cart_count">{cartItems.length}</span>
                  </Link>
                ) : (
                  <i class="fa-brands fa-creative-commons-by">A<span>dmin</span> </i>
                )}
                <div className='ml-4 dropdown d-inline'>
                  <Link to="#!" className="btn dropdown-toggle text-black mr-3"
                    type="button" id="dropDownMenuButton" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <figure className="avatar avatar-nav">
                      <img src={user.avatar && user.avatar.url} alt={user && user.name} className="rounded-circle" />
                    </figure>
                    <span>{user && user.name}</span>
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                    {user && user.role !== 'admin' ? (
                      <Link className="dropdown-item" to="/orders/me">Orders</Link>
                    ) : (
                      <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                    )}
                    <Link to="/me" className="dropdown-item">
                      Profile
                    </Link>
                    <Link to="/login" className="dropdown-item" onClick={logoutHandler}>
                      Logout
                    </Link>
                  </div>
                </div>
              </Fragment>
              :
              <Link to="/login" className="btn btn-primary ms-3" id="login_btn">
                Login
              </Link>
            }
          </div>
        </div>
      </nav>
    </Fragment>
  )
}

export default Header