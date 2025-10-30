import React from "react";

const ProjectInfo = ({ project }) => (
  <>
    <h1>{project.name}</h1>
    <p className="project-description">{project.description}</p>

    <p className="project-meta">
      Status: {project.status} | Version: {project.version}
    </p>

    <div className="project-tags">
      {project.hashtags?.length ? (
        project.hashtags.map((tag) => <span key={tag}>#{tag}</span>)
      ) : (
        <p>No hashtags</p>
      )}
    </div>
  </>
);

export default ProjectInfo;
