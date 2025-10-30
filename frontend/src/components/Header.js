import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import "../global.css";
import "../styling/header.css";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header id="main-header">
      <nav id="main-navigation">
        {/* Left: Brand */}
        <div className="nav-left">
          <Link to="/home" className="nav-brand">
            ZYNTHEX
          </Link>
        </div>

        {/* Center: Create Project */}
        <div className="nav-center">
          {user && (
            <Link
              to="/createproject"
              className="nav-create-btn"
              title="Create Project"
            >
              <FaPlus />
            </Link>
          )}
        </div>

        {/* Right: Profile */}
        <div className="nav-right">
          {user && (
            <Link
              to={`/profile/${user.username}`}
              className="nav-profile-link"
            >
              My Profile
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
