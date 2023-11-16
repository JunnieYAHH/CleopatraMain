import React, { Fragment } from 'react'
import Search from './Search'
import '../../App.css'

const Header = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="./images/logo.png" alt="Logo" />
          </a>
          <Search  />
          <div className="d-flex align-items-center">
            <button className="btn btn-primary ms-3" id="login_btn">
              Login
            </button>
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