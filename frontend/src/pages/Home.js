import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectPreview from "../components/ProjectPreview";
import { AuthContext } from "../context/AuthContext";
import "../styling/home.css";


const Home = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showLocal, setShowLocal] = useState(false);

    useEffect(() => {
      const handleTagSearch = (e) => setSearchTerm(`#${e.detail}`);
      window.addEventListener("searchTag", handleTagSearch);
      return () => window.removeEventListener("searchTag", handleTagSearch);
    }, []);

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

    const filteredProjects = projects.filter((p) => {
      if (!searchTerm) return true;
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
        <div id="home-page">
          <Header />

          <main id="home-main" className="home-content">
            {/* --- Search Bar --- */}
            <section id="search-section" className="search-section">
              <input
                id="search-bar"
                className="search-input"
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </section>

            {/* --- Feed toggle --- */}
            <section id="feed-toggle" className="feed-toggle">
              <button
                id="global-feed-btn"
                className={`feed-btn ${!showLocal ? "active" : ""}`}
                onClick={() => setShowLocal(false)}
              >
                Global Feed
              </button>
              <button
                id="local-feed-btn"
                className={`feed-btn ${showLocal ? "active" : ""}`}
                onClick={() => setShowLocal(true)}
              >
                Local Feed
              </button>
            </section>

            {/* --- Project Feed --- */}
            <section id="project-feed" className="project-feed">
              {loading ? (
                <p className="feed-message">Loading projects...</p>
              ) : filteredProjects.length === 0 ? (
                <p className="feed-message">No projects found.</p>
              ) : (
                [...filteredProjects]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((project) => (
                    <ProjectPreview key={project._id} project={project} />
                  ))
              )}
            </section>
          </main>

          <Footer />
        </div>
    );
};

export default Home;