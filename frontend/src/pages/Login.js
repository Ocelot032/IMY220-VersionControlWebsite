// frontend/src/pages/Login.js
import React from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/Login";
import "../global.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h1 className="login-title">Welcome Back!</h1>
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
