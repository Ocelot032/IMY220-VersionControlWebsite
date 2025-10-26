import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected (logged-in only) routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createproject"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


// import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Splash from "./pages/Splash";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";
// import Projects from "./pages/Projects";
// import CreateProject from "./pages/CreateProject";

// const App = () => {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path = "/" element = {<Splash/>}/>
//                 <Route path = "/home" element = {<Home/>}/>
//                 <Route path = "/login" element = {<Login/>}/>
//                 <Route path = "/register" element = {<Register/>}/>
//                 <Route path = "/profile" element = {<Profile/>}/>
//                 <Route path = "/projects" element = {<Projects/>}/>
//                 <Route path = "/createproject" element = {<CreateProject/>}/>
//             </Routes>
//         </BrowserRouter>
//     );
// }

// export default App; 