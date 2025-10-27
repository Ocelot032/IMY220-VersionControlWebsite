import React from "react";

const ProjectPreview = ({ title, description, owner, lastEdited, image, hashtags }) => {
  return (
    <article className="project-preview">
      <img src={image || "/assets/default-project.png"} alt={title} />
      <div className="project-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <small>
          By <strong>{owner}</strong> | Created: {lastEdited}
        </small>
        <div className="hashtags">
          {hashtags && hashtags.map((tag, i) => (
            <span key={i} className="hashtag">#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProjectPreview;






//GOES TO THE PROJECT PAGE WHEN CLICKED

// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ProjectPreview = ({ project }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/projects/${project._id}`);
//   };

//   return (
//     <div className="project-card" onClick={handleClick}>
//       <img src={project.imageUrl} alt={project.name} />
//       <h3>{project.name}</h3>
//       <p>{project.description}</p>
//     </div>
//   );
// };

// export default ProjectPreview;

