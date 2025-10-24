import React from "react";
import { Link } from "react-router-dom";

const Header = ({user}) => {
    return (
        <nav id = "navigation">
            <h1 id = "headerTitle">ZYNTHEX</h1>
            <Link to = "/home" className = "navItem">Home</Link>
            <Link to = "/projects" className = "navItem">Projects</Link>
            <Link to = "/profile" className = "navItem">Profile</Link>
        </nav>
    );
};

export default Header;
 