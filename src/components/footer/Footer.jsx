import React from 'react'
import "./footer.css"
import { AiFillFacebook } from "react-icons/ai";

const Footer = () => {
  return (
    
  <footer>
    <div className="footer-content">
        <p>
            &copy; 2025 TechMomentum. All rights reserved.
              <br /> Made by TechMomentum
            </p>
            <div className="social-links">
                <a href=""> <AiFillFacebook /> </a>
                <a href=""></a>
                <a href=""></a>
            </div>
    </div>
  </footer>

  )
}

export default Footer