import React, { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
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
         <Routes>
         <Route render={({ history }) => <Search history={history} /> } />
         </Routes>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Enter Product Name ..."
              aria-label="Search"
            />
            <button className="btn btn-outline-primary" type="submit">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
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