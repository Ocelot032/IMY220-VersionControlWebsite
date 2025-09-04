import React from "react";
import { useParams } from "react-router-dom"
import { projects } from "../data/projects"
import "../styling/page.css";

const Project = () => {
    const id = useParams();
    const project = projects.find(p => p.id === parseInt(id));
    console.log(`Your project ID: ${id}`);

    return (
        <div>
            <h1>Project</h1>
            <p>Showing profile with ID: {id}</p>
        </div>
    );
}

export default Project;