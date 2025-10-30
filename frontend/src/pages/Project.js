import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectInfo from "../components/ProjectInfo";
import ProjectImage from "../components/ProjectImage";
import ProjectActions from "../components/ProjectActions";
import FilesList from "../components/FilesList";
import Messages from "../components/Messages";
import { AuthContext } from "../context/AuthContext";
import "../styling/project.css";

const Project = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectData = async () => {
    try {
      const [projRes, actRes] = await Promise.all([
        fetch(`/api/project/${projectId}`),
        fetch(`/api/activity/project/${projectId}`),
      ]);
      const projData = await projRes.json();
      const actData = await actRes.json();
      setProject(projData);
      setActivity(actData);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  const isOwner = user?.username === project.owner;
  const isMember = project.members?.includes(user?.username);

  const handleProjectUpdate = async () => {
    await fetchProjectData();
  };

  return (
    <div>
      <Header />
      <main className="project-page">
        <div className="project-container">
          <ProjectInfo project={project} />
          <ProjectImage imageUrl={project.imageUrl} name={project.name} />
          <ProjectActions
            project={project}
            user={user}
            isOwner={isOwner}
            isMember={isMember}
            onUpdate={handleProjectUpdate}
          />
          <FilesList files={project.files || []} />
          <Messages messages={activity} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Project;