import React from "react";

const ProfileProjects = ({ projects }) => (
  <section style={{ marginTop: "1rem" }}>
    <h3>Projects</h3>
    {(!projects || projects.length === 0) ? (
      <p>No projects found.</p>
    ) : (
      <ul>
        {projects.map((proj, i) => (
          <li key={i}>
            <strong>{proj.name || proj}</strong>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default ProfileProjects;
