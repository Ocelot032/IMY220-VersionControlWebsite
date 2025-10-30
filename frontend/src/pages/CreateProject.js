import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  name: "",
  description: "",
  type: "unspecified",
  hashtags: "",
  image: null,
  files: [],
  version: "1", 
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert("Project name is required");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("version", formData.version);
    data.append("owner", user?.username);
    data.append(
  "hashtags",
  JSON.stringify(
    formData.hashtags
      .split(" ")
      .map((t) => t.trim().replace(/^#/, "")) 
      .filter(Boolean)
  )
);


    if (formData.image) data.append("image", formData.image);
    formData.files.forEach((file) => data.append("files", file));

    try {
      const res = await fetch("/api/project", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        navigate(`/projects/${result._id}`);
      } else {
        alert(result.error || "Failed to create project");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting project");
    }
  };

  return (
    <div>
      <Header />
      <main className="create-project">
        <div className="create-project-container">
          <h1>Create a New Project</h1>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="create-project-form">
            <label>
              Project Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>

            <label>
              Description:
              <textarea
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <label>
              Type:
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="unspecified">Unspecified</option>
                <option value="web">Web App</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop App</option>
                <option value="library">Library</option>
                <option value="framework">Framework</option>
              </select>
            </label>

            <label>
              Version:
              <input
                type="text"
                name="version"
                placeholder="e.g. 1.0.0"
                value={formData.version}
                onChange={handleChange}
              />
            </label>

            <label>
              Hashtags (separate with spaces):
              <input
                type="text"
                name="hashtags"
                placeholder="#react #javascript #node"
                value={formData.hashtags}
                onChange={handleChange}
              />
            </label>

            <label>
              Project Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="preview-image"
              />
            )}

            <label>
              Project Files:
              <input type="file" multiple onChange={handleFileChange} />
            </label>

            {formData.files.length > 0 && (
              <ul className="file-preview-list">
                {formData.files.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}

            <button type="submit" className="submit-btn">Create Project</button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProject;
