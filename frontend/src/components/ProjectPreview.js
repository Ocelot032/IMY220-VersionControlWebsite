import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectPreview = ({ project }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project._id}`);
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

