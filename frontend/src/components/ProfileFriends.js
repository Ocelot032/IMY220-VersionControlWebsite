import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/profile.css";

const ProfileFriends = ({ friends }) => {
  const navigate = useNavigate();
  const limitedFriends = friends.slice(0, 5);

  if (!friends || friends.length === 0) return null;

  return (
    <section className="profile-friends">
      <h3 className="profile-section-title">Friends</h3>

      <div className="friends-list">
        {limitedFriends.map((f, i) => (
          <div
            key={i}
            className="friend-card"
            onClick={() => navigate(`/profile/${f.username || f}`)}
          >
            <img
              src={f.profileImg || "/assets/default-profile.png"}
              alt={f.username || f}
              className="friend-avatar"
            />
            <div className="friend-info">
              <strong className="friend-name">{f.name || ""} {f.surname || ""}</strong>
              <p className="friend-username">@{f.username || f}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfileFriends;
