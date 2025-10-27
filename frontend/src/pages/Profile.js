import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonalInfo from "../components/PersonalInfo";
import ProjectPreview from "../components/ProjectPreview";
import Friends from "../components/Friends";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { username } = useParams(); // dynamic route: /profile/:username
  const { user } = useContext(AuthContext); // logged-in user info
  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState("none");
  const [editing, setEditing] = useState(false);

  // === Fetch all profile-related data ===
  useEffect(() => {
  if (!user) return;

  setIsOwnProfile(username === user.username);

  const fetchProfileData = async () => {
    try {
      // Get profile info
      const res = await fetch(`/api/users/${username}`, { credentials: "include" });
      const data = await res.json();
      setProfileUser(data);

      // Get friends
      const friendsRes = await fetch(`/api/friends/${username}`);
      const friendsData = await friendsRes.json();

      // Normalise friends array safely
      const friendsArray = Array.isArray(friendsData)
        ? friendsData
        : friendsData.friends || [];

      setFriends(friendsArray);

      // Get pending requests (only if own profile)
      if (username === user.username) {
        const pendingRes = await fetch(`/api/friends/${username}/pending`);
        const pendingData = await pendingRes.json();
        setPendingRequests(Array.isArray(pendingData) ? pendingData : pendingData.pending || []);
      }

      // Check if current user is already friends
      if (friendsArray.some((f) => f.username === user.username)) {
        setIsFriend(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfileData();
}, [username, user]);


  // === Save edited profile ===
  const handleEditSave = async (updatedData) => {
    try {
      const res = await fetch(`/api/users/${user.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setProfileUser(updatedUser);
        setEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // === Send friend request ===
  const handleAddFriend = async () => {
    setFriendRequestStatus("sent");
    try {
      const res = await fetch(`/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          requester: user.username,
          receiver: username,
        }),
      });
      if (!res.ok) throw new Error("Failed to send friend request");
      setFriendRequestStatus("pending");
    } catch (err) {
      console.error(err);
      setFriendRequestStatus("none");
    }
  };

  // === Accept friend request ===
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/friends/${id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ receiver: user.username }),
      });
      if (res.ok) {
        setPendingRequests((prev) => prev.filter((req) => req._id !== id));
      }
    } catch (err) {
      console.error("Error accepting friend:", err);
    }
  };

  if (!user) {
    return <p>You must be logged in to view this page.</p>;
  }

  if (!profileUser) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <Header />

      <h1>{isOwnProfile ? "My Profile" : profileUser.username + "'s Profile"}</h1>

      <PersonalInfo
        user={profileUser}
        isOwnProfile={isOwnProfile}
        editing={editing}
        onSave={handleEditSave}
        onEditToggle={() => setEditing(!editing)}
      />

      {/* Friend controls (only visible on other users' profiles) */}
      {!isOwnProfile && (
        <div>
          <p>{isFriend ? "You are friends" : "Not friends"}</p>
          {!isFriend && (
            <button
              onClick={handleAddFriend}
              disabled={friendRequestStatus === "pending"}
            >
              {friendRequestStatus === "pending"
                ? "Friend Request Sent"
                : "Add Friend"}
            </button>
          )}
        </div>
      )}

      {/* Friends + Pending (only for own profile) */}
      {isOwnProfile && (
        <div>
          <h2>Friends</h2>
          <Friends friends={friends} />

          {pendingRequests.length > 0 && (
            <div>
              <h3>Pending Requests</h3>
              {pendingRequests.map((r) => (
                <div key={r._id}>
                  <p>{r.requester}</p>
                  <button onClick={() => handleAccept(r._id)}>Accept</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects (optional placeholder for now) */}
      <div>
        <h2>Projects</h2>
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectPreview
              key={p._id}
              title={p.title}
              description={p.description}
              author={p.owner}
              lastEdited={p.updatedAt}
            />
          ))
        ) : (
          <p>No projects yet.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;


// import React, {Link} from "react";

// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import PersonalInfo from "../components/PersonalInfo";
// import PersonalInfoEdit from "../components/PersonalInfoEdit";
// import ProjectPreview from "../components/ProjectPreview";
// import Friends from "../components/Friends";

// const Profile = () => {
//     const userProjects = projects.slice(0, Math.ceil(projects.length / 2));

//     return(
//         <div>
//             <Header/>
//             <div>
//                 <h1>My Profile</h1>
//                 <PersonalInfo/>
//                 <PersonalInfoEdit/>
//                 {userProjects.map((p) => (
//                     <ProjectPreview 
//                     key = {p.id}
//                     title = {p.title}
//                     description = {p.description}
//                     author = {p.author}
//                     lastEdited = {p.lastEdited}
//                     />
//                 ))}
//                 <Friends/>
//             </div>
//             <Footer/>
//         </div>
//     );
// };

// export default Profile;