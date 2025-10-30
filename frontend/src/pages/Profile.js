import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileHeader from "../components/ProfileHeader";
import ProfileDetails from "../components/ProfileDetails";
import ProfileProjects from "../components/ProfileProjects";
import ProfileFriends from "../components/ProfileFriends";
import ProfileEditForm from "../components/ProfileEditForm";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(true);
  const [savedProjects, setSavedProjects] = useState([]);
  const [createdProjects, setCreatedProjects] = useState([]); 

  // If auth context is still loading
  if (!user) {
    return <p>Loading profile...</p>;
  }

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const res = await fetch(
          `http://localhost:8080/api/users/view/${username}`,
          {
            headers: { "X-Viewer": storedUser?.username || "" },
          }
        );
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

  // Fetch saved projects
  useEffect(() => {
    if (!user?.username) return;

    fetch(`http://localhost:8080/api/users/${user.username}/saved`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load saved projects");
        return res.json();
      })
      .then((data) => setSavedProjects(data.savedProjects || []))
      .catch((err) => console.error("Error loading saved projects:", err));
  }, [user]);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/api/projects/user/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load created projects");
        return res.json();
      })
      .then((data) => setCreatedProjects(data.projects || data || []))
      .catch((err) => console.error("Error loading created projects:", err));
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <Header />

      <main style={{ padding: "1rem" }}>
        <ProfileHeader profile={profile} visibility={visibility} />

        {visibility !== "public" && (
          <>
            <ProfileDetails profile={profile} visibility={visibility} />

            {/* Created Projects */}
            <ProfileProjects
              title="Created Projects"
              projects={createdProjects || []}
            />

            {/* Saved Projects */}
            <ProfileProjects
              title="Saved Projects"
              projects={savedProjects || []}
            />

            <ProfileFriends friends={profile.friends || []} />
          </>
        )}

        {visibility === "self" && <ProfileEditForm user={profile} />}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;