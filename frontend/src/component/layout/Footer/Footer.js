import React from 'react'
import playStore from "../../../images/playstore.png"
import appStore from "../../../images/Appstore.png"
import "./Footer.css"

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and ios mobile phone</p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="Appstore" />


            </div>

            <div className="midFooter">

                <h1>ECOMMERCE</h1>
                <p>Green Shopping, Bright Future</p>
                <p>Copyrights 2023 &copy; Suyog Acharya</p>
            </div>

            <div className="rightFooter">
                <h4>
                    Follow Us
                </h4>
                <a href="https://instagram.com/ac_suyog">Instagram</a>
                <a href="https://facebook.com/asuyog042">Facebook</a>
                <a href="https://twitter.com/suyogacharya15">Twitter</a>

            </div>
        </footer>
    )
}

export default Footer

