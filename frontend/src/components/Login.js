import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setError("");
        
        try {
        const response = await fetch("http://localhost:3000/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Response:", data);

        if (data.success) {
            localStorage.setItem("token", data.token);
            alert(data.message);
            navigate("/home");
        } else {
            setError(data.message || "Login failed.");
        }
    } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong. Please try again.");
    }
    };

    return (
        <form onSubmit = {handleSubmit}>
            <div>
                <label>Username</label>
                <input
                    type = "text"
                    placeholder = "Username"
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}
                    required
                />
            </div>
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
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
