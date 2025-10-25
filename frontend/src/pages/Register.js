import React  from "react";
import Header from "../components/Header";
import RegisterForm from "../components/Register";
import Footer from "../components/Footer";

const Register = () => {
    return (
        <div>
            <Header/>
            <main>
                <h1>Sign Up to Zynthex!</h1>
                <p>Become a member of the community today!</p>
                <RegisterForm/>
            </main>
            <Footer/>
        </div>
    );
}

export default Register;