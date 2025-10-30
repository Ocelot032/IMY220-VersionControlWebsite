import React, { useState } from "react";
import "../styling/profile.css";

const ProfileHeader = ({ profile, visibility, onEditClick }) => {
  const [sending, setSending] = useState(false);
  const [processing, setProcessing] = useState(false);

  // === Add friend ===
  const handleAddFriend = async () => {
    setSending(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:8080/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester: storedUser.username,
          receiver: profile.username,
        }),
      });
      const data = await res.json();
      alert(data.message || "Friend request sent!");
    } catch (err) {
      console.error("Friend request error:", err);
      alert("Could not send friend request.");
    } finally {
      setSending(false);
    }
  };

  // === Unfriend ===
  const handleUnfriend = async () => {
    if (!window.confirm(`Are you sure you want to unfriend ${profile.username}?`)) return;

    setProcessing(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:8080/api/friends/unfriend", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username1: storedUser.username,
          username2: profile.username,
        }),
      });

      const data = await res.json();
      if (res.ok) alert("Friend removed successfully.");
      else alert(data.error || "Failed to unfriend.");
    } catch (err) {
      console.error("Unfriend error:", err);
      alert("Error unfriending user.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="profile-header">
      <img
        className="profile-img"
        src={
          profile.profileImg
            ? `/uploads/profiles/${profile.profileImg}`
            : "/assets/default-profile.png"
        }

        alt={profile.username}
      />

      <div className="profile-header-info">
        <h2 className="profile-name">
          {profile.name} {profile.surname}
        </h2>
        <p className="profile-username">@{profile.username}</p>

        {visibility === "self" && (
          <button className="btn edit-btn" onClick={onEditClick}>
            Edit Profile
          </button>
        )}

        {visibility === "friend" && (
          <button
            className={`btn unfriend-btn ${processing ? "disabled" : ""}`}
            disabled={processing}
            onClick={handleUnfriend}
          >
            {processing ? "Removing..." : "Unfriend"}
          </button>
        )}

        {visibility === "public" && (
          <button
            className={`btn add-friend-btn ${sending ? "disabled" : ""}`}
            disabled={sending}
            onClick={handleAddFriend}
          >
            {sending ? "Pending..." : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;