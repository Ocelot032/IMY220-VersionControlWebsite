import React from "react";

const FilesList = ({ files }) => (
  <section>
    <h2>Files</h2>
    {!files || files.length === 0 ? (
      <p>No files yet.</p>
    ) : (
      <ul>
        {files.map((file, i) => (
          <li key={i}>
            <a href={`/uploads/projects/${file}`} download>
              {file}
            </a>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default FilesList;



// import React from "react";
// import { Link } from "react-router-dom";

// const FilesList = ({ files }) => (
//   <section>
//     <h2>Files</h2>
//     {files.length === 0 ? (
//       <p>No files yet.</p>
//     ) : (
//       <ul>
//         {files.map((file) => (
//           <li key={file.fileUrl}>
//             <a href={`/uploads/projects/${file.fileUrl}`} download>
//               {file.filename}
//             </a>
//           </li>
//         ))}
//       </ul>
//     )}
//   </section>
// );

// export default FilesList;
