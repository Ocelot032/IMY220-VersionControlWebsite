import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectPreview = ({ project }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setSavedProjects(storedUser.savedProjects || []);
    }
  }, []);

  const handleClick = () => navigate(`/projects/${project._id}`);

  const handleSave = async (projectId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8080/api/projects/save/${projectId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, savedProjects: data.saved || [] };
        setUser(updatedUser);
        setSavedProjects(data.saved || []);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        console.error(data.error || "Save failed");
      }
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  // --- handle clickable hashtags ---
  const handleHashtagClick = (tag, e) => {
    e.stopPropagation();
    // Dispatch a custom event so Home can filter
    window.dispatchEvent(new CustomEvent("searchTag", { detail: tag }));
  };

  // Format creation date safely
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  const memberCount = project.members?.length || 0;
  const checkinCount = project.activity?.length || 0;

  return (
    <div
      className="project-card"
      onClick={handleClick}
      style={{
        border: "2px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        margin: "1rem 0",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
    >
      {/* Project thumbnail */}
      <img
        src={project.imageUrl || "/assets/default-project.png"}
        alt={project.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      {/* Title + save icon */}
      <h3 style={{ marginTop: "0.5rem" }}>
        {project.name}
        {savedProjects.includes(project._id) && (
          <span
            title="You saved this project"
            style={{ marginLeft: "8px", color: "gold" }}
          >
            ★
          </span>
        )}
      </h3>

      {/* Save / Unsave button */}
      <button
        type="button"
        onClick={(e) => handleSave(project._id, e)}
        style={{
          background: savedProjects.includes(project._id) ? "#ffcc00" : "#eee",
          border: "none",
          borderRadius: "5px",
          padding: "0.3rem 0.6rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        {savedProjects.includes(project._id) ? "Unsave" : "Save"}
      </button>

      {/* Description */}
      <p style={{ margin: "0.5rem 0" }}>
        {project.description || "No description provided."}
      </p>

      {/* Owner / Type / Date */}
      <small style={{ display: "block", marginBottom: "0.25rem" }}>
        By{" "}
        <span
          style={{ color: "#0077cc", textDecoration: "underline", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${project.owner}`);
          }}
        >
          @{project.owner}
        </span>{" "}
        | Type: <strong>{project.type || "unspecified"}</strong> | {formattedDate}
      </small>

      {/* Members & activity counts */}
      <small style={{ color: "#666" }}>
        {memberCount} member{memberCount !== 1 ? "s" : ""} · {checkinCount} check-in
        {checkinCount !== 1 ? "s" : ""}
      </small>

      {/* Hashtags */}
      <div style={{ marginTop: "0.5rem" }}>
        {project.hashtags?.map((tag, i) => (
          <span
            key={i}
            onClick={(e) => handleHashtagClick(tag, e)}
            style={{
              marginRight: "0.5rem",
              color: "#0077cc",
              cursor: "pointer",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;



















// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const ProjectPreview = ({ project }) => {
//   const navigate = useNavigate();

//   //  Get the logged-in user (or null)
//   const [user, setUser] = useState(null);
//   const [savedProjects, setSavedProjects] = useState([]); //  Always defined

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//       setSavedProjects(storedUser.savedProjects || []); //  Prevent undefined
//     }
//   }, []);

//   const handleClick = () => navigate(`/projects/${project._id}`);

//   //  Safe Save/Unsave handler
//   const handleSave = async (projectId, e) => {
//     e.stopPropagation();
//     try {
//       const res = await fetch(`http://localhost:8080/api/projects/save/${projectId}`, {
//         method: "POST",
//         credentials: "include",
//       });
//       const data = await res.json();

//       if (res.ok) {
//         const updatedUser = { ...user, savedProjects: data.saved || [] };
//         setUser(updatedUser);
//         setSavedProjects(data.saved || []);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       } else {
//         console.error(data.error || "Save failed");
//       }
//     } catch (err) {
//       console.error("Error saving project:", err);
//     }
//   };

//   return (
//     <div
//       className="project-card"
//       onClick={handleClick}
//       style={{
//         border: "2px solid #ccc",
//         borderRadius: "10px",
//         padding: "1rem",
//         margin: "1rem 0",
//         cursor: "pointer",
//         transition: "0.2s",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
//       onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
//     >
//       <img
//         src={project.imageUrl || "/assets/default-project.png"}
//         alt={project.name}
//         style={{
//           width: "100%",
//           height: "200px",
//           objectFit: "cover",
//           borderRadius: "8px",
//         }}
//       />
//       <h3>{project.name}
//         {savedProjects.includes(project._id) && (
//         <span title="You saved this project" style={{ marginLeft: "8px", color: "gold" }}>★</span>
//   )}
//       </h3>

//       {/* Safe conditional button */}
//       <button
//         type="button"
//         onClick={(e) => handleSave(project._id, e)}
//       >
//         {savedProjects.includes(project._id) ? "Unsave" : "Save"}
//       </button>

//       <p>{project.description}</p>
//       <small>
//         By <strong>{project.owner}</strong> | Version: {project.version}
//       </small>

//       <div style={{ marginTop: "0.5rem" }}>
//         {project.hashtags?.map((tag, i) => (
//           <span key={i} style={{ marginRight: "0.5rem", color: "#888" }}>
//             #{tag}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProjectPreview;