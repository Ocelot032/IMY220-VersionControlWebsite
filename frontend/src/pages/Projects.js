import React, {Link} from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

const Projects = () => {
    return(
        <div>
            <Header/>
            <h1>My Projects</h1>
            <p>*All the info of this project</p>
            <p>*All files listed</p>
            <p>*All messages listed</p>
            <button>Edit Project</button>

            <Footer/>
        </div>
    );
};

export default Projects;