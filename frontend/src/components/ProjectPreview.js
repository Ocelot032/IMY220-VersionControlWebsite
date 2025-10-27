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


// import React from "react";
// // import "../styling/feed.css";

// //project preview componentnot

// const ProjectPreview = ({ title, description, author, lastEdited }) => {
//   return (
//     <div className = "activity-item">
//       <img src = ""/>
//       <h3>{title}</h3>
      
//       <p>{description}</p>
//       <small>
//         By <strong>{author}</strong> | Last edited: {lastEdited}
//       </small>
//     </div>
//   );
// };

// export default ProjectPreview;
