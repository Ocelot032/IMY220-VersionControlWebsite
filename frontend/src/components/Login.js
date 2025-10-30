// frontend/src/components/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("All fields are required.");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (login) login(data.user);
        navigate("/home");
      } else setError(data.error || "Login failed.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      {error && <p className="error-msg">{error}</p>}

      <button type="submit" className="btn login-btn">
        Login
      </button>
    </form>
  );
};

export default LoginForm;


// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const LoginForm = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const { login } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       setError("All fields are required.");
//       return;
//     }

//     setError("");

//     try {
//       const response = await fetch("http://localhost:8080/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//         credentials: "include",
//       });

//       const data = await response.json();
//       console.log("Login response:", data);

//       if (response.ok) {
//         alert(data.message);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         if (login) login(data.user);
//         navigate("/home");
//       } else {
//         setError(data.error || "Login failed.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="login-username">Username</label>
//         <input
//           id="login-username"
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="login-password">Password</label>
//         <input
//           id="login-password"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           minLength={6}
//         />
//       </div>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;