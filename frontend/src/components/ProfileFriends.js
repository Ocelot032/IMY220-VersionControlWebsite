import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileFriends = ({ friends }) => {
  const navigate = useNavigate();
  const limitedFriends = friends.slice(0, 5); // show a few

  if (!friends || friends.length === 0) return null;

  return (
    <section style={{ marginTop: "1rem" }}>
      <h3>Friends</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {limitedFriends.map((f, i) => (
          <div
            key={i}
            onClick={() => navigate(`/profile/${f.username || f}`)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.3rem",
              width: "fit-content",
            }}
          >
            <img
              src={f.profileImg || "/assets/default-profile.png"}
              alt={f.username || f}
              style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <strong>{f.name || ""} {f.surname || ""}</strong>
              <p style={{ margin: 0, fontSize: "0.8rem" }}>@{f.username || f}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileFriends;
