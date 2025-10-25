import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        username: "",
        email: "",
        birthday: "",
        workplace: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //validation + backend call
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, surname, username, email, birthday, workplace, password, confirmPassword } = formData;

        if (!name || !surname || !username || !email || !birthday || !workplace || !password || !confirmPassword) {
            setError("All fields are required.");
        return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
        return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
        return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
        return;
        }

        try {
        setLoading(true);
        setError("");

        // Connect to backend w/ AuthContext
        await register(formData);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
        <div>
            <label htmlFor="name">Name:</label>
            <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="surname">Surname:</label>
            <input
            id="surname"
            name="surname"
            type="text"
            placeholder="Surmame"
            value={formData.surname}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="username">Username:</label>
            <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="email">Email:</label>
            <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="birthday">Birthday:</label>
            <input
            id="birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="workplace">Workplace:</label>
            <input
            id="workplace"
            name="workplace"
            type="text"
            placeholder="Workplace"
            value={formData.workplace}
            onChange={handleChange}
            required
            />
        </div>
        <br />

        <div>
            <label htmlFor="password">Password:</label>
            <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            />
        </div>
        <br />

        <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            />
        </div>
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
        </button>
        </form>
    );
};

export default RegisterForm;
