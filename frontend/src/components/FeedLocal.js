import React from "react";
import ProjectPreview from "./ProjectPreview";
import { projects } from "../data/projects";

const FeedLocal = () => {
  const localProjects = projects.slice(0, Math.ceil(projects.length / 2));

  return (
    <div>
      <h2>Local Feed</h2>
      <div className = "feed-grid">
        {localProjects.map((p) => (
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

export default FeedLocal;
