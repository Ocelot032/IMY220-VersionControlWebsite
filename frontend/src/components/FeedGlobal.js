import React from "react";
import ProjectPreview from "./ProjectPreview";
import { projects } from "../data/projects"; 

const FeedGlobal = () => {

  return (
    <div>
      <h2>Global Feed</h2>
      <div className = "feed-grid">
        {projects.map((p) => (
          <ProjectPreview 
            key = {p.id}
            title = {p.title}
            description = {p.description}
            author = {p.author}
            lastEdited = {p.lastEdited}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedGlobal;
