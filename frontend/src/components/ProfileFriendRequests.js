import React, { useEffect, useState } from "react";

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
  const method = "PATCH";
  const endpoint = `http://localhost:8080/api/friends/${id}/${action}`;
  try {
    const res = await fetch(endpoint, { method });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || `Request ${action}ed`);
      fetchRequests(); // refresh list

      window.location.reload();
    } else alert(data.error || "Error processing request.");
  } catch (err) {
    console.error(`Error during ${action}:`, err);
  }
};


  if (!requests.length) return null;

  return (
    <section style={{ marginTop: "1rem" }}>
      <h3>Friend Requests</h3>
      {requests.map((req) => (
        <div key={req._id} style={{ border: "1px solid #ccc", padding: "0.5rem", margin: "0.3rem 0" }}>
          <p><strong>{req.requester}</strong> wants to connect.</p>
          <button onClick={() => handleAction(req._id, "accept")} style={{ marginRight: "0.5rem" }}>
            Accept
          </button>
          <button onClick={() => handleAction(req._id, "decline")}>
            Decline
          </button>
        </div>
      ))}
    </section>
  );
};

export default ProfileFriendRequests;
