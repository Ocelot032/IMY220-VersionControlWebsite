import React, { useState } from "react";

const PersonalInfo = ({ user, isOwnProfile, editing, onSave, onEditToggle }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    surname: user.surname || "",
    username: user.username || "",
    email: user.email || "",
    workplace: user.workplace || "",
    birthday: user.birthday ? user.birthday.slice(0, 10) : "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  if (editing) {
    return (
      <div>
        <h2>Edit Profile</h2>
        {Object.keys(formData)
          .filter((key) => key !== "username" && key !== "email") 
          .map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
              />
            </div>
        ))}

        <button onClick={handleSubmit}>Save</button>
        <button onClick={onEditToggle}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      {isOwnProfile && <button onClick={onEditToggle}>Edit</button>}
      <div>
        <p>
          <strong>Name:</strong> {user.name} {user.surname}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Workplace:</strong> {user.workplace}
        </p>
        <p>
          <strong>Birthday:</strong>{" "}
          {user.birthday ? user.birthday.slice(0, 10) : ""}
        </p>
      </div>
    </div>
  );
};

export default PersonalInfo;