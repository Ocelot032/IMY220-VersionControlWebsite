import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav id="navigation">
      <h1 id="headerTitle">ZYNTHEX</h1>

      <Link to="/home" className="navItem">Home</Link>
    


      {user && (
        <Link to={`/profile/${user.username}`} className="navItem">
          My Profile
        </Link>
      )}
    </nav>
  );
};

export default Header;
