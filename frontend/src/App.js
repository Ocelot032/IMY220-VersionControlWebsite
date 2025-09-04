import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Splash/>}/>
                <Route path = "/home" element = {<Home/>}/>
                <Route path = "/login" element = {<Login/>}/>
                <Route path = "/register" element = {<Register/>}/>
                <Route path = "/profile/:id" element = {<Profile/>}/>
                <Route path = "/projects/:id" element = {<Projects/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;