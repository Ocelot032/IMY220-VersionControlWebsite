import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonalInfo from "../components/PersonalInfo";
import ProjectPreview from "../components/ProjectPreview";
import Friends from "../components/Friends";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const params = useParams();
  const paramUsername = params.username;
  const { user } = useContext(AuthContext);
  const username = paramUsername || (user ? user.username : null);

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
    if (!user || !username) return;

    setIsOwnProfile(username === user.username);

    const fetchProfileData = async () => {
      try {
        // ---- Get profile info ----
        const res = await fetch(`/api/users/${username}`, { credentials: "include" });
        const data = await res.json();
        setProfileUser(data);

        // ---- Get user's projects ----
        const projRes = await fetch(`/api/projects/user/${username}`);
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(Array.isArray(projData) ? projData : []);
        } else {
          setProjects([]); // fallback if none
        }

        // ---- Get friends ----
        const friendsRes = await fetch(`/api/friends/${username}`);
        const friendsData = await friendsRes.json();
        console.log("Friends API response:", friendsData);
        const friendsArray = Array.isArray(friendsData)
          ? friendsData
          : friendsData.friends || [];
        setFriends(friendsArray);

        // ---- Get pending requests (only if own profile) ----
        if (username === user.username) {
          const pendingRes = await fetch(`/api/friends/${username}/pending`);
          const pendingData = await pendingRes.json();
          setPendingRequests(Array.isArray(pendingData) ? pendingData : pendingData.pending || []);
        }

        // ---- Check if already friends ----
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

      <h1>{isOwnProfile ? "My Profile" : `${profileUser.username}'s Profile`}</h1>

      <PersonalInfo
        user={profileUser}
        isOwnProfile={isOwnProfile}
        editing={editing}
        onSave={handleEditSave}
        onEditToggle={() => setEditing(!editing)}
      />

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

      {isOwnProfile && (
        <div>
          <h2>Friends</h2>
          {friends.length > 0 ? (
            <Friends friends={friends} />
          ) : (
            <p>You have no friends yet.</p>
          )}

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

      <div>
        <h2>Projects</h2>
        {projects.length > 0 ? (
  projects.map((p) => (
    <ProjectPreview
      key={p._id}
      title={p.name}
      description={p.description}
      owner={p.owner || "Unknown"}
      lastEdited={new Date(p.createdAt).toLocaleDateString()}
      image={p.imageUrl}
      hashtags={p.hashtags}
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




















// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import PersonalInfo from "../components/PersonalInfo";
// import ProjectPreview from "../components/ProjectPreview";
// import Friends from "../components/Friends";
// import { AuthContext } from "../context/AuthContext";

// const Profile = () => {
//   const params = useParams();
//   const paramUsername = params.username; 
//   const { user } = useContext(AuthContext);
//   const username = paramUsername || (user ? user.username : null);
//   const [profileUser, setProfileUser] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [isFriend, setIsFriend] = useState(false);
//   const [friendRequestStatus, setFriendRequestStatus] = useState("none");
//   const [editing, setEditing] = useState(false);

//   // === Fetch all profile-related data ===
//   useEffect(() => {
//   // if (!user) return; 
//    if (!user || !username) return; //new

//   setIsOwnProfile(username === user.username);

//   const fetchProfileData = async () => {
//     try {
//       // Get profile info
//       const res = await fetch(`/api/users/${username}`, { credentials: "include" }); //valid api route
//       const data = await res.json();
//       setProfileUser(data);

//       // Get friends
//       const friendsRes = await fetch(`/api/friends/${username}`); //valid api route
//       const friendsData = await friendsRes.json();

//       // Normalise friends array safely
//       const friendsArray = Array.isArray(friendsData)
//         ? friendsData
//         : friendsData.friends || [];

//       setFriends(friendsArray);

//       // Get pending requests (only if own profile)
//       if (username === user.username) {
//         const pendingRes = await fetch(`/api/friends/${username}/pending`); //valid api route
//         const pendingData = await pendingRes.json();
//         setPendingRequests(Array.isArray(pendingData) ? pendingData : pendingData.pending || []);
//       }

//       // Check if current user is already friends
//       if (friendsArray.some((f) => f.username === user.username)) {
//         setIsFriend(true);
//       }
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//     }
//   };

//   fetchProfileData();
// }, [username, user]);


//   // === Save edited profile ===
//   const handleEditSave = async (updatedData) => {
//     try {
//       const res = await fetch(`/api/users/${user.username}`, { //valid api route
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(updatedData),
//       });
//       if (res.ok) {
//         const updatedUser = await res.json();
//         setProfileUser(updatedUser);
//         setEditing(false);
//       }
//     } catch (err) {
//       console.error("Error updating profile:", err);
//     }
//   };

//   // === Send friend request ===
//   const handleAddFriend = async () => {
//     setFriendRequestStatus("sent");
//     try {
//       const res = await fetch(`/api/friends/request`, { //valid api route
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           requester: user.username,
//           receiver: username,
//         }),
//       });
//       if (!res.ok) throw new Error("Failed to send friend request");
//       setFriendRequestStatus("pending");
//     } catch (err) {
//       console.error(err);
//       setFriendRequestStatus("none");
//     }
//   };

//   // === Accept friend request ===
//   const handleAccept = async (id) => {
//     try {
//       const res = await fetch(`/api/friends/${id}/accept`, { //valid api route
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ receiver: user.username }),
//       });
//       if (res.ok) {
//         setPendingRequests((prev) => prev.filter((req) => req._id !== id));
//       }
//     } catch (err) {
//       console.error("Error accepting friend:", err);
//     }
//   };

//   if (!user) {
//     return <p>You must be logged in to view this page.</p>;
//   }

//   if (!profileUser) {
//     return <p>Loading profile...</p>;
//   }

//   return (
//     <div>
//       <Header />

//       <h1>{isOwnProfile ? "My Profile" : profileUser.username + "'s Profile"}</h1>

//       <PersonalInfo
//         user={profileUser}
//         isOwnProfile={isOwnProfile}
//         editing={editing}
//         onSave={handleEditSave}
//         onEditToggle={() => setEditing(!editing)}
//       />

//       {/* Friend controls (only visible on other users' profiles) */}
//       {!isOwnProfile && (
//         <div>
//           <p>{isFriend ? "You are friends" : "Not friends"}</p>
//           {!isFriend && (
//             <button
//               onClick={handleAddFriend}
//               disabled={friendRequestStatus === "pending"}
//             >
//               {friendRequestStatus === "pending"
//                 ? "Friend Request Sent"
//                 : "Add Friend"}
//             </button>
//           )}
//         </div>
//       )}

//       {/* Friends + Pending (only for own profile) */}
//       {isOwnProfile && (
//         <div>
//           <h2>Friends</h2>
//           <Friends friends={friends} />

//           {pendingRequests.length > 0 && (
//             <div>
//               <h3>Pending Requests</h3>
//               {pendingRequests.map((r) => (
//                 <div key={r._id}>
//                   <p>{r.requester}</p>
//                   <button onClick={() => handleAccept(r._id)}>Accept</button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Projects (optional placeholder for now) */}
//       <div>
//         <h2>Projects</h2>
//         {projects.length > 0 ? (
//           projects.map((p) => (
//             <ProjectPreview
//               key={p._id}
//               title={p.title}
//               description={p.description}
//               author={p.owner}
//               lastEdited={p.updatedAt}
//             />
//           ))
//         ) : (
//           <p>No projects yet.</p>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Profile;

