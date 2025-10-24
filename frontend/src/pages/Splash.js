import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Link } from 'react-router-dom';

const Splash = () => {
    return (
        <div id = "body">
            <h1 id = "mainHeading">ZYNTHEX</h1>
            <p id = "subtitle">
                SYNC. TRACK. GROW.</p>
            <p id = "description">
                Zynthex is a modern version control platform built for seamless collaboration, tracking, and code management.
                Designed with a focus on clarity, control, and community, it ables developers to manage projects, share progress, and stay in sync. 
                Whether you are going solo or working with a team, Zynthex keeps your code organized, your versions traceable, and your workflow, well, flowing.</p>
            <span>
                <Link to = "/login">
                <button>LOGIN</button>
                </Link>
            </span>
            <br/>
            <span>
                <Link to = "/register">
                <button>REGISTER</button>
                </Link>
            </span>
        </div>
    );
}

export default Splash;