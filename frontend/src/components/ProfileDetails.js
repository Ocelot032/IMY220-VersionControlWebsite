import React from "react";

const ProfileDetails = ({ profile, visibility }) => (
  <section style={{ marginTop: "1rem" }}>
    <h3>About</h3>
    <p><strong>Workplace:</strong> {profile.workplace || "Not specified"}</p>
    <p><strong>Birthday:</strong> {profile.birthday || "Not specified"}</p>
    <p><strong>Email:</strong> {profile.email || "Hidden"}</p>
  </section>
);

export default ProfileDetails;
