import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import React from "react";
import "../styling/page.css";

const Home = () => {
    return (
        <div>
            <Header/>
            <p>This is the Home page for testing.</p><br/>
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
