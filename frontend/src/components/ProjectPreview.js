import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/projectPreview.css";

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
    if (!user?.username) return alert("Please log in first.");

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${user.username}/save/${projectId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, savedProjects: data.savedProjects || [] };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSavedProjects(data.savedProjects || []);
      } else {
        console.error(data.error || "Save failed");
      }
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleHashtagClick = (tag, e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("searchTag", { detail: tag }));
  };

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
      id={`project-${project._id}`}
      className="project-card profile-project-card"
      onClick={handleClick}
    >
      <div className="project-info">
        <div className="project-header">
          <h3 className="project-title">
            {project.name}
            {savedProjects.includes(project._id) && (
              <span className="saved-star" title="You saved this project">★</span>
            )}
          </h3>
        </div>

        <button
          type="button"
          className={`save-btn ${savedProjects.includes(project._id) ? "saved" : ""}`}
          onClick={(e) => handleSave(project._id, e)}
        >
          {savedProjects.includes(project._id) ? "Unsave" : "Save"}
        </button>

        <p className="project-description">{project.description || "No description provided."}</p>

        <p className="project-meta">
          By{" "}
          <span
            className="project-owner"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${project.owner}`);
            }}
          >
            @{project.owner}
          </span>{" "}
          | Type: <span className="project-type">{project.type || "unspecified"}</span> |{" "}
          <span className="project-date">{formattedDate}</span>
        </p>

        <p className="project-stats">
          {memberCount} member{memberCount !== 1 ? "s" : ""} · {checkinCount} check-in
          {checkinCount !== 1 ? "s" : ""}
        </p>

        <div className="project-tags">
          {project.hashtags?.map((tag, i) => (
            <span
              key={i}
              className="hashtag"
              onClick={(e) => handleHashtagClick(tag, e)}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;