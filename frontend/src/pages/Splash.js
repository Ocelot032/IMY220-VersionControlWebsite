import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Link } from 'react-router-dom';

const Splash = () => {
    return (
        <main id="splash">
            <section>
                <h1 id="mainHeading">ZYNTHEX</h1>
                <h2 id="subtitle">SYNC. TRACK. GROW.</h2>
                <p id="description">
                Zynthex is a modern version control platform built for seamless collaboration, tracking, and code management.
                Designed with a focus on clarity, control, and community, it enables developers to manage projects, share progress, and stay in sync.
                Whether working solo or in teams, Zynthex keeps your code organized, your versions traceable, and your workflow effortless.
                </p>
            </section>

            <nav>
                <Link to="/login">
                <button type="button">Login</button>
                </Link>
                <Link to="/register">
                <button type="button">Register</button>
                </Link>
            </nav>
        </main>
    );
}

export default Splash;