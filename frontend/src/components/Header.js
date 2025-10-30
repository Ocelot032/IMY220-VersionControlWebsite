import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav id="navigation">
      <Link to="/home" className="navItem">
      <h1 id="headerTitle">ZYNTHEX</h1>
      </Link>

      <Link to="/home" className="navItem">Home</Link>

      {user && (
        <>
          {/* New create-project link */}
          <Link to="/createproject" className="navItem" title="Create Project">
            <FaPlus style={{ verticalAlign: "middle", marginRight: "4px" }} />
            Create
          </Link>

          <Link to={`/profile/${user.username}`} className="navItem">
            My Profile
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;











// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Header = () => {
//   const { user } = useContext(AuthContext);

//   return (
//     <nav id="navigation">
//       <h1 id="headerTitle">ZYNTHEX</h1>

//       <Link to="/home" className="navItem">Home</Link>
    
//       {user && (
//         <Link to={`/profile/${user.username}`} className="navItem">
//           My Profile
//         </Link>
//       )}
//     </nav>
//   );
// };

// export default Header;
