import React from "react";

const ProjectImage = ({ imageUrl, name }) => {
  if (!imageUrl) return null;
  return (
    <img
      src={`/uploads/projects/${imageUrl}`}
      alt={name}
      className="project-image"
    />
  );
};

export default ProjectImage;
