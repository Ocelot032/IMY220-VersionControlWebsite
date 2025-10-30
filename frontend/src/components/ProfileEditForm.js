import React, { useState } from "react";
import "../styling/profile.css";

const ProfileEditForm = ({ user }) => {
  const [formData, setFormData] = useState({
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
      alert(data.message || "Profile updated");
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  return (
    <section className="profile-edit">
      <h3 className="profile-section-title">Edit Profile</h3>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
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

        <button type="submit" className="btn save-btn">Save Changes</button>
      </form>
    </section>
  );
};

export default ProfileEditForm;
