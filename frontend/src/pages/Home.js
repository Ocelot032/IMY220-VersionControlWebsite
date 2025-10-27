import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectPreview from "../components/ProjectPreview";
import { AuthContext } from "../context/AuthContext"; // assumes you have this
// import AuthContext from "../context/AuthContext"; //  default import


const Home = () => {
  const [showLocal, setShowLocal] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AuthContext); // logged-in user info



  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       setLoading(true);

  //       // const route = showLocal
  //       //   ? `/api/projects/local/${user._id}`
  //       //   : "/api/projects/global";

  //       const route = showLocal
  //           ? `http://localhost:8080/api/project/local/${user.username}`
  //           : "http://localhost:8080/api/project/";

  //       const res = await fetch(route);
  //       const data = await res.json();
  //       setProjects(data);
  //     } catch (err) {
  //       console.error("Error fetching projects:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (user) fetchProjects();
  // }, [showLocal, user]);



  useEffect(() => {
  const fetchProjects = async () => {
    try {
      const baseURL = "http://localhost:8080";
      const route = showLocal
        ? `${baseURL}/api/project/local/${user.username}`
        : `${baseURL}/api/project/`;

      const res = await fetch(route);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // only fetch when user exists
  if (user && user.username) fetchProjects();
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
              owner={proj.owner || "Unknown"}
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