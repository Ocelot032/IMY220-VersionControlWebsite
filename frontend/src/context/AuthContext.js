import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (email, password) => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const register = async (formData) => {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};






// import React, { createContext, useState, useEffect } from "react";
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // ✅ Safe JSON parse
//   const getStoredUser = () => {
//     try {
//       const item = localStorage.getItem("user");
//       return item ? JSON.parse(item) : null;
//     } catch (err) {
//       console.warn("Invalid user data in localStorage. Clearing it.", err);
//       localStorage.removeItem("user");
//       return null;
//     }
//   };

//   const [user, setUser] = useState(getStoredUser());
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user)); // ensure consistency
//     }
//   }, [user]);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };








// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(localStorage.getItem("token") || null);

//     useEffect(() => {
//         if (token && !user) {
//         fetch("/api/users/me", {
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then(res => res.ok ? res.json() : null)
//             .then(data => {
//             if (data?.user) setUser(data.user);
//             })
//             .catch(() => {});
//         }
//     }, [token, user]);

//     const login = async (email, password) => {
//         const res = await fetch("/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         });
//         const data = await res.json();
//         if (res.ok) {
//         setUser(data.user);
//         setToken(data.token);
//         localStorage.setItem("token", data.token);
//         } else {
//         throw new Error(data.message || "Login failed");
//         }
//     };

//     // const register = async (email, password, name) => {
//     //     const res = await fetch("/api/users/register", {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ email, password, name }),
//     //     });
//     //     const data = await res.json();
//     //     if (res.ok) {
//     //     setUser(data.user);
//     //     setToken(data.token);
//     //     localStorage.setItem("token", data.token);
//     //     } else {
//     //     throw new Error(data.message || "Registration failed");
//     //     }
//     // };





// //     const register = async (email, password, username) => {
// //   const res = await fetch("/api/users/register", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ email, password, username }),
// //   });

// //   // 👇 ADD THIS TO SEE THE RAW RESPONSE
// //   const text = await res.text();
// //   console.log("Raw backend response:", text);
// //   console.log("Status code:", res.status);

// //   let data;
// //   try {
// //     data = JSON.parse(text);
// //   } catch (err) {
// //     console.error("Failed to parse JSON:", err);
// //     throw new Error("Backend did not return valid JSON. See console output.");
// //   }

// //   if (res.ok) {
// //     setUser(data.user);
// //     setToken(data.token);
// //     localStorage.setItem("token", data.token);
// //   } else {
// //     throw new Error(data.message || "Registration failed");
// //   }
// // };



// const register = async (formData) => {
//   const res = await fetch("/api/users/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formData),
//   });

//   const text = await res.text();
//   console.log("Raw backend response:", text);

//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     throw new Error("Backend did not return valid JSON");
//   }

//   if (res.ok) {
//     setUser(data.user);
//     setToken(data.token);
//     localStorage.setItem("token", data.token);
//   } else {
//     throw new Error(data.error || data.message || "Registration failed");
//   }
// };



//     const logout = () => {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("token");
//     };

//     return (
//         <AuthContext.Provider value={{ user, token, login, register, logout }}>
//         {children}
//         </AuthContext.Provider>
//     );
// };
