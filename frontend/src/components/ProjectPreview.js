import React from "react";
// import "../styling/feed.css";

//project preview componentnot

const ProjectPreview = ({ title, description, author, lastEdited }) => {
  return (
    <div className = "activity-item">
      <img src = ""/>
      <h3>{title}</h3>
      
      <p>{description}</p>
      <small>
        By <strong>{author}</strong> | Last edited: {lastEdited}
      </small>
    </div>
  );
};

export default ProjectPreview;
