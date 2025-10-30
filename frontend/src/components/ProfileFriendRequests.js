import React, { useEffect, useState } from "react";
import "../styling/profile.css";

const ProfileFriendRequests = ({ username }) => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/${username}/pending`);
      const data = await res.json();
      setRequests(data.pending || []);
    } catch (err) {
      console.error("Error loading friend requests:", err);
    }
  };

  useEffect(() => {
    if (username) fetchRequests();
  }, [username]);

  const handleAction = async (id, action) => {
    const endpoint = `http://localhost:8080/api/friends/${id}/${action}`;
    try {
      const res = await fetch(endpoint, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Request ${action}ed`);
        fetchRequests();
        window.location.reload();
      } else alert(data.error || "Error processing request.");
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    }
  };

  if (!requests.length) return null;

  return (
    <section className="profile-friend-requests">
      <h3 className="profile-section-title">Friend Requests</h3>

      {requests.map((req) => (
        <div key={req._id} className="friend-request-card">
          <p className="friend-request-text">
            <strong>{req.requester}</strong> wants to connect.
          </p>

          <div className="friend-request-buttons">
            <button
              className="btn accept-btn"
              onClick={() => handleAction(req._id, "accept")}
            >
              Accept
            </button>

            <button
              className="btn decline-btn"
              onClick={() => handleAction(req._id, "decline")}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProfileFriendRequests;
