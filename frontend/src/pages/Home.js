import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectPreview from "../components/ProjectPreview";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLocal, setShowLocal] = useState(false); // assuming you toggle local/global feed

  // --- Listen for hashtag clicks from ProjectPreview ---
  useEffect(() => {
    const handleTagSearch = (e) => setSearchTerm(`#${e.detail}`);
    window.addEventListener("searchTag", handleTagSearch);
    return () => window.removeEventListener("searchTag", handleTagSearch);
  }, []);

  // --- Fetch projects (local or global) ---
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

    fetchProjects();
  }, [showLocal, user]);

  // --- Filtering projects by name, owner, description, type, and hashtags ---
  const filteredProjects = projects.filter((p) => {
    if (!searchTerm) return true; // show all if nothing typed
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.owner?.toLowerCase().includes(term) ||
      p.type?.toLowerCase().includes(term) ||
      p.hashtags?.some((tag) => `#${tag.toLowerCase()}`.includes(term))
    );
  });

  return (
    <div>
      <Header />

      <main style={{ padding: "1rem" }}>
        {/* --- Search Bar --- */}
        <div className="search-bar" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* --- Feed toggle (optional) --- */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setShowLocal(false)}
            style={{
              marginRight: "0.5rem",
              background: !showLocal ? "#0077cc" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.3rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Global Feed
          </button>
          <button
            onClick={() => setShowLocal(true)}
            style={{
              background: showLocal ? "#0077cc" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.3rem 0.8rem",
              cursor: "pointer",
            }}
          >
            Local Feed
          </button>
        </div>

        {/* --- Project Feed --- */}
        {loading ? (
          <p>Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          filteredProjects.map((project) => (
            <ProjectPreview key={project._id} project={project} />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;















// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import ProjectPreview from "../components/ProjectPreview";
// import { AuthContext } from "../context/AuthContext";

// const Home = () => {
//   const [showLocal, setShowLocal] = useState(true);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//   const handleTagSearch = (e) => setSearchTerm(`#${e.detail}`);
//   window.addEventListener("searchTag", handleTagSearch);
//   return () => window.removeEventListener("searchTag", handleTagSearch);
// }, []);

//   const { user } = useContext(AuthContext); // logged-in user info

//   useEffect(() => {
//   const fetchProjects = async () => {
//     try {
//       const baseURL = "http://localhost:8080";
//       const route = showLocal
//         ? `${baseURL}/api/project/local/${user.username}`
//         : `${baseURL}/api/project/`;

//       const res = await fetch(route);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       setProjects(data);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // only fetch when user exists
//   if (user && user.username) fetchProjects();
// }, [showLocal, user]);





//   // const filtered = projects.filter(p =>
//   //   p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   // );
//   const filteredProjects = projects.filter((p) => {
//     if (!searchTerm) return true; // show all if nothing typed
//     const term = searchTerm.toLowerCase();
//     return (
//       p.name?.toLowerCase().includes(term) ||
//       p.description?.toLowerCase().includes(term) ||
//       p.owner?.toLowerCase().includes(term) ||
//       p.type?.toLowerCase().includes(term) ||
//       p.hashtags?.some((tag) => `#${tag.toLowerCase()}`.includes(term))
//     );
//   });





//   return (
//     <div>
//       <Header />

//       <div className="feed-toggle">
//         <button
//           onClick={() => setShowLocal(true)}
//           className={showLocal ? "active" : ""}
//         >
//           Local Feed
//         </button>
//         <button
//           onClick={() => setShowLocal(false)}
//           className={!showLocal ? "active" : ""}
//         >
//           Global Feed
//         </button>
//       </div>

//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search projects..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <main className="feed-container">
//         {loading ? (
//           <p>Loading feed...</p>
//         ) : filtered.length === 0 ? (
//           <p>No projects to display.</p>
//         ) : (
//           filtered.map((proj) => (
//             <ProjectPreview key={proj._id} project={proj} />
//           ))
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Home;