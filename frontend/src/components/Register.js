// frontend/src/components/Register.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    birthday: "",
    workplace: "",
    password: "",
    confirmPassword: "",
    profileImg: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImg") {
      setFormData({ ...formData, profileImg: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, surname, username, email, birthday, workplace, password, confirmPassword, profileImg } = formData;

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

    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        if (login) login(data.user);
        navigate("/home");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate encType="multipart/form-data">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="surname">Surname</label>
        <input id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" value={formData.username} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="birthday">Birthday</label>
        <input id="birthday" type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="workplace">Workplace</label>
        <input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="profileImg">Profile Image</label>
        <input id="profileImg" type="file" name="profileImg" accept="image/*" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      {error && <p className="error-msg">{error}</p>}
      <button type="submit" className="btn register-btn" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;