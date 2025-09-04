import React  from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import "../styling/page.css";

const Login = () => {
    return (
        <div>
            <Header/>
            <div>
                <h1>Welcome back to Zynthex!</h1>
                <LoginForm/>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;