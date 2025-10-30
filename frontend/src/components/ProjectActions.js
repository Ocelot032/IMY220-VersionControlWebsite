import React, { useState } from "react";
import ProfileEditForm from "./ProfileEditForm";

const ProjectActions = ({ project, user, isOwner, isMember, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const callAPI = async (url, method, body) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      alert(data.message || "Action successful");
      await onUpdate?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = () =>
    callAPI(`/api/project/${project._id}/checkout`, "PATCH", {
      username: user.username,
    });

  const handleCheckIn = () => {
    const message = prompt("Enter a message for this check-in:", "Checked in new version");
    callAPI(`/api/project/${project._id}/checkin`, "PATCH", {
      username: user.username,
      message,
    });
  };

  const handleSaveEdit = async (formData) => {
    await callAPI(`/api/project/${project._id}`, "PATCH", formData);
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?"))
      callAPI(`/api/project/${project._id}`, "DELETE");
  };

  if (editing) {
    return (
      <ProfileEditForm
        project={project}
        onSave={handleSaveEdit}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (!isOwner && !isMember) return null;

  const isCheckedOutByUser = project.checkedOutBy === user.username;
  const isAvailable = project.status === "checkedIn";

  return (
    <section className="actions">
      {isAvailable ? (
        <button onClick={handleCheckOut} disabled={loading}>
          {loading ? "Processing..." : "Check Out"}
        </button>
      ) : isCheckedOutByUser ? (
        <button onClick={handleCheckIn} disabled={loading}>
          {loading ? "Processing..." : "Check In"}
        </button>
      ) : (
        <p className="checked-out-msg">
          Checked out by {project.checkedOutBy}
        </p>
      )}

      {isOwner && (
        <>
          <button onClick={() => setEditing(true)} disabled={loading}>
            Edit
          </button>
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </>
      )}
    </section>
  );
};

export default ProjectActions;
