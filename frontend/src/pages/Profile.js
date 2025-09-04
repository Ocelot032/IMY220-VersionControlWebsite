import React from "react";
import { useParams } from "react-router-dom"
import { profiles } from "../data/profiles"
import "../styling/page.css";

const Profile = () => {
    const id = useParams();
    const profile = profiles.find(p => p.id === parseInt(id));

    if (!profile) return <p>profile not found.</p>;
    console.log(`Your profile ID: ${id}`);

    return (
        <div>
            <h1>{profile.name}</h1>
            <p>This is your email {profile.email}</p>
        </div>
    );
}

export default Profile;