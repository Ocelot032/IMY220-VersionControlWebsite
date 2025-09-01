//Main component for routing

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouterProvider } from "react-router/dom";
import Home from "./pages/Home";


// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <Home/>
//     }, {
//         path: "/posts",
//         element: <Posts/>,
//         children: [
//             {
//                 path: "/edit",
//                 element: <EditPost/>
//             }
//         ]
//     }
// ])

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