import React, { useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { Link, useNavigate } from "react-router-dom";
import "../global.css";
import "../styling/splash.css";

const Splash = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/users/session", {
                    credentials: "include",
                });
                const data = await res.json();

                if (data.loggedIn) {
                    navigate("/home");
                }
            } catch (err) {
                console.error("Error checking session:", err);
            }
        };

        checkSession();
    }, [navigate]);

    return (
    <div className="splash-container">
      <div className="splash-content">
        <h1 className="splash-title">ZYNTHEX</h1>
        <h2 className="splash-subtitle">SYNC. TRACK. GROW.</h2>

        <p className="splash-desc">
          Zynthex is a modern version control platform built for seamless
          collaboration, tracking, and code management. <br />
          Designed with a focus on clarity, control, and community, it enables
          developers to manage projects, share progress, and stay in sync. <br />
          Whether you are going solo or working with a team, Zynthex keeps your
          code organized, your versions traceable, and your workflow flowing.
        </p>

        <div className="splash-buttons">
          <Link to="/login" className="splash-btn">Login</Link>
          <Link to="/register" className="splash-btn secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Splash;
