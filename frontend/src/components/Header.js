import React from "react";
import { Link } from "react-router-dom";
import "../styling/header.css";
import "../styling/page.css";

const Header = ({user}) => {
    return (
        <nav id = "navigation">
            <h1 id = "headerTitle">ZYNTHEX</h1>
            <Link to = "/home" class = "navItem">Home</Link>
            <Link to = "/projects" class = "navItem">Projects</Link>
            <Link to = "/profile" class = "navItem">Profile</Link>
        </nav>
    );
};

export default Header;