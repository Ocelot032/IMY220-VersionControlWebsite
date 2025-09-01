import React from "react";
import { BrowserRouter, Route, Routes, createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    }, {
        path: "/posts",
        element: <Posts/>,
        children: [
            {
                path: "/edit",
                element: <EditPost/>
            }
        ]
    }
])

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<Home/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;