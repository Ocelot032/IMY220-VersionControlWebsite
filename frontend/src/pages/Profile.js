import React, {Link} from "react";
import { projects } from "../data/projects";

import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonalInfo from "../components/PersonalInfo";
import PersonalInfoEdit from "../components/PersonalInfoEdit";
import ProjectPreview from "../components/ProjectPreview";
import Friends from "../components/Friends";

const Profile = () => {
    const userProjects = projects.slice(0, Math.ceil(projects.length / 2));

    return(
        <div>
            <Header/>
            <div>
                <h1>My Profile</h1>
                <PersonalInfo/>
                <PersonalInfoEdit/>
                {userProjects.map((p) => (
                    <ProjectPreview 
                    key = {p.id}
                    title = {p.title}
                    description = {p.description}
                    author = {p.author}
                    lastEdited = {p.lastEdited}
                    />
                ))}
                <Friends/>
            </div>
            <Footer/>
        </div>
    );
};

export default Profile;