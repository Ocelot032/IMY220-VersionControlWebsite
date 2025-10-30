import React from "react";
import Footer from "../components/Footer";
import RegisterForm from "../components/Register";
import "../global.css";
import "../styling/register.css";

const Register = () => {
    return (
        <div className="register-container">
            <div className="register-card fade-in">
                <h1 className="register-title">Join Today!</h1>
                <p className="register-subtitle">Become a member of the community today!</p>
                <RegisterForm />
            </div>
        </div>
    );
};

export default Register;
