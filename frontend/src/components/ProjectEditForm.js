import React, { useState } from "react";

const ProfileEditForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="edit-project-form" onSubmit={handleSubmit}>
      <h3>Edit Project</h3>

      <label htmlFor="name">Name:</label>
      <input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        required
      />

      <div className="form-actions">
        <button type="submit" className="btn save-btn">Save</button>
        <button type="button" className="btn cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
