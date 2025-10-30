import React from "react";
import "../styling/profile.css";

const ProfileProjects = ({ title = "Projects", projects }) => (
  <section className="profile-projects">
    <h3 className="profile-section-title">{title}</h3>

    {(!projects || projects.length === 0) ? (
      <p className="no-projects-msg">No projects found.</p>
    ) : (
      <ul className="project-list">
        {projects.map((proj, i) => (
          <li key={i} className="project-list-item">
            <strong className="project-list-name">{proj.name || proj}</strong>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default ProfileProjects;
