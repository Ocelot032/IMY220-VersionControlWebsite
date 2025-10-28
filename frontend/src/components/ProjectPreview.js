import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectPreview = ({ project }) => {
  const navigate = useNavigate();

  //  Get the logged-in user (or null)
  const [user, setUser] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]); //  Always defined

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setSavedProjects(storedUser.savedProjects || []); //  Prevent undefined
    }
  }, []);

  const handleClick = () => navigate(`/projects/${project._id}`);

  //  Safe Save/Unsave handler
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
      <h3>{project.name}</h3>

      {/* Safe conditional button */}
      <button
        type="button"
        onClick={(e) => handleSave(project._id, e)}
      >
        {savedProjects.includes(project._id) ? "Unsave" : "Save"}
      </button>

      <p>{project.description}</p>
      <small>
        By <strong>{project.owner}</strong> | Version: {project.version}
      </small>

      <div style={{ marginTop: "0.5rem" }}>
        {project.hashtags?.map((tag, i) => (
          <span key={i} style={{ marginRight: "0.5rem", color: "#888" }}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectPreview;








// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ProjectPreview = ({ project }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/projects/${project._id}`);
//   };

//   const handleSave = async (projectId) => {
//   await fetch(`http://localhost:8080/api/projects/save/${projectId}`, {
//     method: "POST",
//     credentials: "include",
//   });
//   fetchProjects(); // re-load feed
// };


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
//       <h3>{project.name}</h3>
//       <button onClick={() => handleSave(project._id)}>
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

