import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'

import Search from './Search'
import '../../App.css'

const Header = () => {
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
            <Link to="/login" className="btn btn-primary ms-3" id="login_btn">
              Login
            </Link>
            <div className="d-flex align-items-center ms-3">
              <i className="fa fa-shopping-cart" aria-hidden="true"></i>
              <span className="ms-1" id="cart_count">2</span>
            </div>
          </div>
        </div>
      </nav>

    </Fragment>
  )
}

export default Header