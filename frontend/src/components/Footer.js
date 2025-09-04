import React from "react";
import { Link } from "react-router-dom";
import "../styling/footer.css";

const Footer = () => {
    return (
        <div id = "footer"> 
             <p>&copy; {new Date().getFullYear()} Zynthex. All rights reserved.</p>
        </div>
    );
};

export default Footer;