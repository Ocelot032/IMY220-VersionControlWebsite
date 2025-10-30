import React from "react";
import "../styling/profile.css";

const ProfileDetails = ({ profile, visibility }) => (
  <section className="profile-details">
    <h3 className="profile-section-title">About</h3>

    <p className="profile-detail"><strong>Workplace:</strong> {profile.workplace || "Not specified"}</p>
    <p className="profile-detail"><strong>Birthday:</strong> {profile.birthday || "Not specified"}</p>
    <p className="profile-detail"><strong>Email:</strong> {profile.email || "Hidden"}</p>
  </section>
);

export default ProfileDetails;
