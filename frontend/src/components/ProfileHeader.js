import React, { useState } from "react";

const ProfileHeader = ({ profile, visibility }) => {
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
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <img
        src={profile.profileImg || "/assets/default-profile.png"}
        alt={profile.username}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <div>
        <h2>{profile.name} {profile.surname}</h2>
        <p>@{profile.username}</p>

        {visibility === "self" && <button>Edit Profile</button>}

        {visibility === "friend" && (
          <button
            disabled={processing}
            onClick={handleUnfriend}
            style={{
              backgroundColor: processing ? "#ccc" : "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "0.4rem 0.8rem",
              cursor: processing ? "not-allowed" : "pointer",
            }}
          >
            {processing ? "Removing..." : "Unfriend"}
          </button>
        )}

        {visibility === "public" && (
          <button
            disabled={sending}
            onClick={handleAddFriend}
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










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ProfileHeader = ({ profile, visibility }) => {
//   const navigate = useNavigate();
//   const [sending, setSending] = useState(false); // track friend request state

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//       <img
//         src={profile.profileImg || "/assets/default-profile.png"}
//         alt={profile.username}
//         style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
//       />
//       <div>
//         <h2>{profile.name} {profile.surname}</h2>
//         <p>@{profile.username}</p>

//         {visibility === "self" && <button>Edit Profile</button>}
//         {visibility === "friend" && <button>Unfriend</button>}

//         {/* Updated Add Friend button */}
//         {visibility === "public" && (
//           <button
//             disabled={sending}
//             onClick={async () => {
//               setSending(true);
//               try {
//                 const storedUser = JSON.parse(localStorage.getItem("user"));
//                 const res = await fetch(`http://localhost:8080/api/friends/request`, {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({
//                     requester: storedUser.username,
//                     receiver: profile.username,
//                   }),
//                 });
//                 const data = await res.json();
//                 alert(data.message || "Friend request sent!");
//               } catch (err) {
//                 console.error("Friend request error:", err);
//                 alert("Could not send friend request.");
//               } finally {
//                 setSending(false);
//               }
//             }}
//             style={{
//               backgroundColor: sending ? "#ccc" : "#0077cc",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               padding: "0.4rem 0.8rem",
//               cursor: sending ? "not-allowed" : "pointer",
//             }}
//           >
//             {sending ? "Pending..." : "Add Friend"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;
