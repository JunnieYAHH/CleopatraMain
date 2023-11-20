import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Search from './Search'
import '../../App.css'

const Header = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const logoutHandler = () => {
    localStorage.removeItem('token', token);
    localStorage.removeItem('user', user);
    navigate('/login')
  }

  return (

    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">
            <Link to="/">
              <img src="./images/logo.png" alt="Logo" />
            </Link>
          </a>
          <Search />
          <div className="d-flex align-items-center">
            {user ?
              <Fragment>
                <Link to="/cart" style={{ textDecoration: 'none' }}>
                  <span id="cart" className="ml-3">  <i className="fa-solid fa-cart-shopping" style={{ color: '#000000' }}></i></span>
                  <span className="ms-1" id="cart_count">2</span>
                </Link>
                <div className='ml-4 dropdown d-inline'>
                  <Link to="!#" className="btn dropdown-toggle text-black"
                    type="button" id="dropDownMenuButton" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    <figure className="avatar avatar-nav">
                      <img src={user.avatar && user.avatar.url} alt={user && user.name} className="rounded-circle" />
                    </figure>
                    <span>{user && user.name}</span>
                  </Link>
                </div>
                <button to="/login" className="btn btn-primary ms-3" id="login_btn" onClick={logoutHandler}>
                  Logout
                </button>
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