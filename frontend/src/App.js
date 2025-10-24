import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Splash/>}/>
                <Route path = "/home" element = {<Home/>}/>
                <Route path = "/login" element = {<Login/>}/>
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/profile" element = {<Profile/>}/>
                <Route path = "/projects" element = {<Projects/>}/>
                <Route path = "/createproject" element = {<CreateProject/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;