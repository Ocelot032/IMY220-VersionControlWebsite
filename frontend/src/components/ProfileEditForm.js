import React, { useState } from "react";

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
    <section style={{ marginTop: "1rem" }}>
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <label>Workplace:
          <input
            name="workplace"
            value={formData.workplace}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>Birthday:
          <input
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
};

export default ProfileEditForm;
