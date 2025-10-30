import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileHeader from "../components/ProfileHeader";
import ProfileDetails from "../components/ProfileDetails";
import ProfileProjects from "../components/ProfileProjects";
import ProfileFriends from "../components/ProfileFriends";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfileFriendRequests from "../components/ProfileFriendRequests";
import { AuthContext } from "../context/AuthContext";
import "../styling/profile.css";

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedProjects, setSavedProjects] = useState([]);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(`http://localhost:8080/api/users/view/${username}`, {
          headers: { "X-Viewer": storedUser?.username || "" },
        });
        const data = await res.json();
        setProfile(data.profile);
        setVisibility(data.visibility);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (!user?.username) return;

    fetch(`http://localhost:8080/api/users/${user.username}/saved`)
      .then((res) => res.json())
      .then((data) => setSavedProjects(data.savedProjects || []))
      .catch((err) => console.error("Error loading saved projects:", err));

    fetch(`http://localhost:8080/api/projects/user/${username}`)
      .then((res) => res.json())
      .then((data) => setCreatedProjects(data.projects || []))
      .catch((err) => console.error("Error loading created projects:", err));
  }, [username, user]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <Header />

      <main className="profile-page">
        <section className="profile-header-section">
          <ProfileHeader
            profile={profile}
            visibility={visibility}
            onEditClick={() => setIsEditing(!isEditing)} 
          />
        </section>

        {visibility !== "public" && (
          <div className="profile-content">
            {!isEditing ? (
              <>
                <section className="profile-details-section">
                  <ProfileDetails profile={profile} visibility={visibility} />
                </section>

                {visibility === "self" && (
                  <section className="friend-requests-section">
                    <ProfileFriendRequests username={user.username} />
                  </section>
                )}

                <section className="profile-projects-section">
                  <ProfileProjects
                    title="Created Projects"
                    projects={createdProjects || []}
                  />
                </section>

                <section className="profile-projects-section">
                  <ProfileProjects
                    title="Saved Projects"
                    projects={savedProjects || []}
                  />
                </section>

                <section className="profile-friends-section">
                  <ProfileFriends friends={profile.friends || []} />
                </section>
              </>
            ) : (
              <ProfileEditForm user={profile} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;