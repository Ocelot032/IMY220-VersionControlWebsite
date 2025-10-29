import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ profile, visibility }) => {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false); // track friend request state

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <img
        src={profile.profileImg || "/assets/default-profile.png"}
        alt={profile.username}
        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
      />
      <div>
        <h2>{profile.name} {profile.surname}</h2>
        <p>@{profile.username}</p>

        {visibility === "self" && <button>Edit Profile</button>}
        {visibility === "friend" && <button>Unfriend</button>}

        {/* Updated Add Friend button */}
        {visibility === "public" && (
          <button
            disabled={sending}
            onClick={async () => {
              setSending(true);
              try {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const res = await fetch(`http://localhost:8080/api/friends/request`, {
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
            }}
            style={{
              backgroundColor: sending ? "#ccc" : "#0077cc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.4rem 0.8rem",
              cursor: sending ? "not-allowed" : "pointer",
            }}
          >
            {sending ? "Pending..." : "Add Friend"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
