import React  from "react";
import Header from "../components/Header";
import LoginForm from "../components/Login";
import Footer from "../components/Footer";

const Login = () => {
    return (
        <div>
            <div>
                <h1>Welcome back to Zynthex!</h1>
                <LoginForm/>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;