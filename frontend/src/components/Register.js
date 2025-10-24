import React from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [workplace, setWorkplace] = useState("");
    const [birthday, setBirthday] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (!email.includes("@")){
            setError("Email not valid.");
            return;
        }

        if (password !== confirmpassword){
            setError("Passwords must match.");
            return;
        }

        setError("");
        alert("Login successful. Welcome Back!"); 
    };

    return (
        <form>
            <div>
                <label>Username: </label>
                <input
                    type = "text"
                    placeholder = "Username"
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <br/>
            <div>
                <label>Email</label>
                <input
                    type = "email"
                    placeholder = "Email"
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <br/>
            <div>
                <label>Birthday</label>
                <input
                    type = "date"
                    placeholder = "Birthday"
                    value={email}
                    onChange = {(e) => setBirthday(e.target.value)}
                    required
                />
            </div>
            <br/>
            <div>
                <label>Workplace</label>
                <input
                    type = "text"
                    placeholder = "Workplace"
                    value={workplace}
                    onChange = {(e) => setWorkplace(e.target.value)}
                    required
                />
            </div>
            <br/>
            <div>
                <label>Password</label>
                <input
                    type = "password"
                    placeholder = "Password"
                    value={password}
                    onChange = {(e) => setPassword(e.target.value)}
                    required
                    minLength = {6}
                />
            </div>
            <br/>
            <div>
                <label>Confirm Password</label>
                <input
                    type = "password"
                    placeholder = "Confirm Password"
                    value={confirmpassword}
                    onChange = {(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength = {6}
                />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;