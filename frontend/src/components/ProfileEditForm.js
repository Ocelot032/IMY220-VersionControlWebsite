import React, { useState } from "react";
import "../styling/profile.css";

const ProfileEditForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    workplace: user.workplace || "",
    birthday: user.birthday || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/users/${user.username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Profile updated successfully!");
        window.location.reload(); // refresh page to show new info
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("An error occurred while updating your profile.");
    }
  };

  return (
    <section className="profile-edit">
      <h3 className="profile-section-title">Edit Profile</h3>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Surname:</label>
          <input
            id="surname"
            name="surname"
            className="form-input"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="workplace">Workplace:</label>
          <input
            id="workplace"
            name="workplace"
            className="form-input"
            value={formData.workplace}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Birthday:</label>
          <input
            id="birthday"
            name="birthday"
            type="date"
            className="form-input"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn save-btn">
          Save Changes
        </button>
      </form>
    </section>
  );
};

export default ProfileEditForm;
