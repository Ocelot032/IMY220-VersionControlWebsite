import React  from "react";
import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";
import Footer from "../components/Footer";
import "../styling/page.css";

const Register = () => {
    return (
        <div>
            <Header/>
            <main>
                <h1>Sign Up to Zynthex!</h1>
                <RegisterForm/>
            </main>
            <Footer/>
        </div>
    );
}

export default Register;