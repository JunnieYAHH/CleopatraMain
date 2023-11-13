import React, { Fragment } from 'react'

const Footer = () => {
    return (
        <Fragment>
            <footer>
        <div class="footer_main">
            <div class="tag">
                <h1>Contact</h1>
                <a ><i class="fa-solid fa-house"></i>123/Colombo/Sri Lanka</a>
                <a ><i class="fa-solid fa-phone"></i>+94 12 345 6789</a>
                <a ><i class="fa-solid fa-envelope"></i>contact@gmail.com</a>
            </div>
            <div class="tag">
                <h1>Get Help</h1>
                <a  class="center">FAQ</a>
                <a  class="center">Shipping</a>
                <a  class="center">Returns</a>
                <a  class="center">Payment Options</a>
            </div>
            <div class="tag">
                <h1>Our Stores</h1>
                <a  class="center">Sri Lanka</a>
                <a  class="center">USA</a>
                <a  class="center">India</a>
                <a  class="center">Japan</a>
            </div>
            <div class="tag">
                <h1>Follw Us</h1>
                <div class="social_link">
                    <a ><i class="fa-brands fa-facebook-f"></i></a>
                    <a ><i class="fa-brands fa-twitter"></i></a>
                    <a ><i class="fa-brands fa-instagram"></i></a>
                    <a ><i class="fa-brands fa-linkedin-in"></i></a>                    
                </div>
            </div>
        </div>
    </footer>
        </Fragment>
    )
}

export default Footer