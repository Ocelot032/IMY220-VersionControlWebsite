import React from "react";

const Friends = ({ friends }) => {
  if (!friends || friends.length === 0) {
    return <p>No friends yet.</p>;
  }

  return (
    <div>
      {friends.map((friend, index) => (
        <div key={index}>
          {/* if your backend returns friend.username, display that */}
          <p>
            <strong>{friend}</strong>
          </p>

          {/* if your backend includes an image field, show it */}
          {friend.profileImg && (
            <img
              src={
                friend.profileImg.startsWith("http")
                  ? friend.profileImg
                  : `http://localhost:8080/${friend.profileImg}`
              }
              alt={friend.username}
              width="60"
              height="60"
              style={{ borderRadius: "50%" }}
            />
          )}

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Friends;
