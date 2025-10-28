import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FilesList from "../components/FilesList";
import Messages from "../components/Messages";
import { AuthContext } from "../context/AuthContext";

const Project = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await fetch(`/api/project/${projectId}`);
        const projData = await projRes.json();
        setProject(projData);

        const actRes = await fetch(`/api/activity/project/${projectId}`);
        const actData = await actRes.json();
        setActivity(actData);
      } catch (err) {
        console.error("Error fetching project page data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  const isOwner = user?.username === project.owner;
  const isMember = project.members?.includes(user?.username);

  return (
    <div>
      <Header />

      <main className="project-page">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <img src={`/uploads/projects/${project.imageUrl}`} alt={project.name} width="300" />

        <p>Status: {project.status}</p>
        <p>Version: {project.version}</p>
        <div>
          {project.hashtags?.length > 0 ? (
  project.hashtags.map((tag) => <span key={tag}>#{tag} </span>)
) : (
  <p>No hashtags</p>
)}

        </div>

        {(isOwner || isMember) && (
          <section className="actions">
            {project.status === "checkedIn" ? (
              <button>Check Out</button>
            ) : project.checkedOutBy === user.username ? (
              <button>Check In</button>
            ) : (
              <p>Checked out by {project.checkedOutBy}</p>
            )}
            {isOwner && <button>Edit Project</button>}
            {isOwner && <button>Delete Project</button>}
          </section>
        )}

        <FilesList files={project.files || []} />
        <Messages messages={activity} />

      </main>

      <Footer />
    </div>
  );
};

export default Project;
