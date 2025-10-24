import React, { useState } from "react";
import { Link } from "react-router-dom"

import Header from "../components/Header";
import Footer from "../components/Footer";

import FeedLocal from "../components/FeedLocal";
import FeedGlobal from "../components/FeedGlobal";

const Home = () => {
    const [showLocal, setShowLocal] = useState(true);

    return (
        <div>
            <Header/>

            <div className = "feed-toggle">
                <button
                    onClick = {() => setShowLocal(true)}
                    className = {showLocal ? "active" : ""}
                >
                    Local Feed
                </button>
                <button
                    onClick = {() => setShowLocal(false)}
                    className = {showLocal ? "active" : ""}
                >
                    Global Feed
                </button>
            </div>

            <div className = "feed-container">
                {showLocal ? <FeedLocal/> : <FeedGlobal/>}
            </div>

            <span>
                <Link to = "/login">
                <button>Login</button>
                </Link>
            </span>
            <br/>
            <span>
                <Link to = "/register">
                <button>Register</button>
                </Link>
            </span>

            <Footer/>
        </div>
    );
}

export default Home;