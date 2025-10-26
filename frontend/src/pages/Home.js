import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectPreview from "../components/ProjectPreview";
import { AuthContext } from "../context/AuthContext"; // assumes you have this
// import AuthContext from "../context/AuthContext"; // ❌ default import


const Home = () => {
  const [showLocal, setShowLocal] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext); // logged-in user info

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const route = showLocal
          ? `/api/projects/local/${user._id}`
          : "/api/projects/global";
        const res = await fetch(route);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProjects();
  }, [showLocal, user]);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />

      <div className="feed-toggle">
        <button
          onClick={() => setShowLocal(true)}
          className={showLocal ? "active" : ""}
        >
          Local Feed
        </button>
        <button
          onClick={() => setShowLocal(false)}
          className={!showLocal ? "active" : ""}
        >
          Global Feed
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="feed-container">
        {loading ? (
          <p>Loading feed...</p>
        ) : filtered.length === 0 ? (
          <p>No projects to display.</p>
        ) : (
          filtered.map((proj) => (
            <ProjectPreview
              key={proj._id}
              title={proj.name}
              description={proj.description}
              author={proj.author?.username || "Unknown"}
              lastEdited={new Date(proj.createdAt).toLocaleDateString()}
              image={proj.imageUrl}
              hashtags={proj.hashtags}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;


// import React, { useState } from "react";
// import { Link } from "react-router-dom"

// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const Home = () => {
//     const [showLocal, setShowLocal] = useState(true);

//     return (
//         <div>
//             <Header/>

//             <div className = "feed-toggle">
//                 <button
//                     onClick = {() => setShowLocal(true)}
//                     className = {showLocal ? "active" : ""}
//                 >
//                     Local Feed
//                 </button>
//                 <button
//                     onClick = {() => setShowLocal(false)}
//                     className = {showLocal ? "active" : ""}
//                 >
//                     Global Feed
//                 </button>
//             </div>

//             <div className = "feed-container">
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//                 <p>Project Name</p>
//             </div>

//             <span>
//                 <Link to = "/login">
//                 <button>Login</button>
//                 </Link>
//             </span>
//             <br/>
//             <span>
//                 <Link to = "/register">
//                 <button>Register</button>
//                 </Link>
//             </span>

//             <Footer/>
//         </div>
//     );
// }

// export default Home;