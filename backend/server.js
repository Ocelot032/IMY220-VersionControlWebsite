const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");

// ==================== Mongo setup 
const connectionString =
  "mongodb+srv://marker:mark123@imy220.0gytrcp.mongodb.net/?retryWrites=true&w=majority&appName=IMY220";
const client = new MongoClient(connectionString);
let db;

async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db("Zynthex");
    console.log("Connected to Zynthex Database.");

    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("projects").createIndex({ owner: 1 });

    return db;
  } catch (err) {
    console.error("Database Connection error", err);
    throw err;
  }
}

// ==================== Query stuff
async function queryDB(collectionName, operation, data = {}) {
  const db = await connectDB();
  const collection = db.collection(collectionName);

  switch (operation) {
    case "find":
      return await collection
        .find(data.query || {}, data.options || {})
        .toArray();

    case "insertOne":
      return await collection.insertOne(data.doc);

    case "updateOne":
      return await collection.updateOne(
        data.filter,
        data.update,
        data.options || {}
      );

    case "deleteOne":
      return await collection.deleteOne(data.filter || data.query || {});

    case "delete":
      return await collection.deleteMany(data.filter || data.query || {});

    case "aggregate":
      return await collection.aggregate(data.pipeline || []).toArray();

    default:
      throw new Error("Invalid operation");
  }
}

// ==================== Express
const app = express();
const PORT = 8080;

const projectRoot = path.resolve(__dirname, "..", "..");

// ==================== Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
    credentials: true,
  })
);

app.use(
    session({
      secret: "IMY220ProjectFinal",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
);

// ==================== File uploads
const uploadRoot = path.join(projectRoot, "uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });
if (!fs.existsSync(path.join(uploadRoot, "projects")))
    fs.mkdirSync(path.join(uploadRoot, "projects"), { recursive: true });
if (!fs.existsSync(path.join(uploadRoot, "profiles")))
    fs.mkdirSync(path.join(uploadRoot, "profiles"), { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImg") cb(null, path.join(uploadRoot, "profiles"));
    else cb(null, path.join(uploadRoot, "projects"));
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
app.locals.upload = upload;

app.use("/uploads", express.static(uploadRoot));


// ==================== API ROUTES ====================





// ==================== USERS ====================





//======== Register a single user
app.post("/api/users/register", upload.single("profileImg"), async (req, res) => {
  try {
    const user = req.body;
    user.profileImg = req.file ? req.file.filename : null;

    const db = await connectDB();

    const result = await queryDB("users", "insertOne", { doc: user });

    const insertedUser = await db.collection("users").findOne({ _id: result.insertedId });

    req.session.user = insertedUser;

    res.json({ message: "Registration successful", user: insertedUser });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

//======== Login a single user
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required." });
    }

    const users = await queryDB("users", "find", { query: { username, password } });
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const user = users[0];

    req.session.user = {
      _id: user._id, 
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login." });
  }
});

//======== Logout a single user
app.post("/api/users/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Logout failed." });
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully." });
    });
  } else {
    res.status(400).json({ error: "No active session." });
  }
});

//======== GET all users
app.get('/api/users/', async (req, res) => {
  try {
    const users = await queryDB('users', 'find');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users.' });
  }
});

// === Save / Unsave a project 
app.post("/api/users/:username/save/:projectId", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { username, projectId } = req.params;
    const user = await users.findOne({ username });

    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadySaved = user.savedProjects?.includes(projectId);

    const update = alreadySaved
      ? { $pull: { savedProjects: projectId } }
      : { $addToSet: { savedProjects: projectId } };

    await users.updateOne({ username }, update);

    const updatedUser = await users.findOne({ username });
    res.json({ savedProjects: updatedUser.savedProjects || [] });
  } catch (err) {
    console.error("Save/Unsave project error:", err);
    res.status(500).json({ error: "Server error while saving project" });
  }
});

// === Get saved projects for a specific user 
app.get("/api/users/:username/saved", async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const projects = db.collection("projects");

    const user = await users.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const savedIds = user.savedProjects || [];
    if (savedIds.length === 0) {
      return res.json({ savedProjects: [] });
    }

    const { ObjectId } = require("mongodb");
    const objectIds = savedIds.map((id) =>
      typeof id === "string" ? new ObjectId(id) : id
    );

    const savedProjects = await projects
      .find({ _id: { $in: objectIds } })
      .toArray();

    res.json({ savedProjects });
  } catch (err) {
    console.error("Error fetching saved projects:", err);
    res.status(500).json({ error: "Server error while fetching saved projects" });
  }
});

// ======== GET single user by username (context aware)
app.get('/api/users/:username', async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const viewerUsername = req.headers["x-viewer"]; 

    const users = await queryDB('users', 'find', { query: { username: targetUsername } });
    if (!users.length) return res.status(404).json({ error: 'User not found.' });

    const target = users[0];

    let visibleProfile = {
      username: target.username,
      name: target.name,
      profileImg: target.profileImg || "",
    };
    let visibility = "public";

    if (viewerUsername && viewerUsername === target.username) {
      visibility = "self";
      visibleProfile = target;
    }

    else if (viewerUsername && target.friends?.includes(viewerUsername)) {
      visibility = "friend";
      visibleProfile = {
        username: target.username,
        name: target.name,
        profileImg: target.profileImg || "",
        workplace: target.workplace || "",
        birthday: target.birthday || "",
        friends: target.friends || [],
        projects: target.projects || [],
      };
    }

    res.json({ visibility, profile: visibleProfile });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ======== CONTEXT-AWARE profle visibility
app.get('/api/users/view/:username', async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const viewerUsername = req.headers["x-viewer"];

    const users = await queryDB('users', 'find', { query: { username: targetUsername } });
    if (!users.length) return res.status(404).json({ error: 'User not found.' });

    const target = users[0];
    let visibility = "public";
    let visibleProfile = {
      username: target.username,
      name: target.name,
      surname: target.surname || "",
      profileImg: target.profileImg || "",
    };

    if (viewerUsername && viewerUsername === target.username) {
      visibility = "self";
      visibleProfile = target;
    } else if (viewerUsername && target.friends?.includes(viewerUsername)) {
      visibility = "friend";
      visibleProfile = {
        username: target.username,
        name: target.name,
        surname: target.surname || "",
        profileImg: target.profileImg || "",
        workplace: target.workplace || "",
        birthday: target.birthday || "",
        email: target.email || "",
        friends: target.friends || [],
        projects: target.projects || [],
      };
    }

    res.json({ visibility, profile: visibleProfile });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

//======== EDIT profile (excl username & email)
app.patch('/api/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const updates = req.body;

    delete updates.username;
    delete updates.email;

    const result = await queryDB('users', 'updateOne', {
      filter: { username },
      update: { $set: updates },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Internal server error during profile update.' });
  }
});

// ======== SEARCH users by name or username
app.get("/api/users/search/:term", async (req, res) => {
  try {
    const term = req.params.term;
    const users = await queryDB("users", "find", {
      query: {
        $or: [
          { username: { $regex: term, $options: "i" } },
          { name: { $regex: term, $options: "i" } },
        ],
      },
      projection: { password: 0 },
    });
    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ error: "Could not search users." });
  }
});

//======== DELETE user
app.delete('/api/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const result = await queryDB('users', 'deleteOne', { filter: { username } });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'User not found.' });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error during deletion.' });
  }
});

//======== UPLOAD profile img
app.post('/api/users/:username/upload', (req, res, next) => {
  const multer = require('multer');
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/profiles'),
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('profileImg');

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 'File upload failed.' });
    try {
      const username = req.params.username;
      const fileName = req.file.filename;

      await queryDB('users', 'updateOne', {
        filter: { username },
        update: { $set: { profileImg: fileName } },
      });

      res.json({ message: 'Profile image uploaded.', file: fileName });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Error saving profile image.' });
    }
  });
});





// ==================== PROJECTS ====================





// ======== GET all projects
app.get("/api/project/", async (req, res) => {
  try {
    const projects = await queryDB("projects", "find", { sort: { createdAt: -1 } });

    const normalizedProjects = projects.map((p) => ({
      _id: p._id,
      name: p.name || "",
      description: p.description || "",
      owner: p.owner || "",
      type: p.type || "unspecified",
      hashtags: p.hashtags || [],
      members: p.members || [],
      version: p.version || 1,
      status: p.status || "checkedIn",
      activity: p.activity || [],
      imageUrl: p.imageUrl || "",
      createdAt: p.createdAt || new Date(),
    }));

    res.json(normalizedProjects);
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

// ======== GET single project by id
app.get("/api/project/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await queryDB("projects", "find", { query: { _id: id } });

    if (!result.length) return res.status(404).json({ error: "Project not found." });
    const p = result[0];

    const normalizedProject = {
      _id: p._id,
      name: p.name || "",
      description: p.description || "",
      owner: p.owner || "",
      type: p.type || "unspecified",
      hashtags: p.hashtags || [],
      members: p.members || [],
      version: p.version || 1,
      status: p.status || "checkedIn",
      activity: p.activity || [],
      imageUrl: p.imageUrl || "",
      createdAt: p.createdAt || new Date(),
    };

    res.json(normalizedProject);
  } catch (err) {
    console.error("Fetch project error:", err);
    res.status(500).json({ error: "Failed to fetch project." });
  }
});

// ======== GET all projects of a specific user (by username)
app.get("/api/projects/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const projects = await queryDB("projects", "find", { query: { owner: username } });

    if (!projects.length)
      return res.status(404).json({ message: "No projects found for this user." });

    res.json(projects);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ======== SAVE or UNSAVE a project ======== //
app.post("/api/projects/save/:id", async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const db = await connectDB();
    const userId = new ObjectId(req.session.user._id);
    const projectId = new ObjectId(req.params.id); 

    const user = await db.collection("users").findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadySaved = user.savedProjects?.some(
      (p) => p.toString() === projectId.toString()
    );

    const update = alreadySaved
      ? { $pull: { savedProjects: projectId } }
      : { $addToSet: { savedProjects: projectId } };

    await db.collection("users").updateOne({ _id: userId }, update);

    const updatedUser = await db.collection("users").findOne({ _id: userId });
    res.json({ success: true, saved: updatedUser.savedProjects || [] });
  } catch (err) {
    console.error("Error saving project:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== GET local projects for a user (friends' projects)
app.get("/api/project/local/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const userArr = await queryDB("users", "find", { query: { username } });
    if (!userArr.length) return res.status(404).json({ error: "User not found." });

    const user = userArr[0];
    const friendUsernames = user.friends || [];

    const projects = await queryDB("projects", "find", {
      query: {
        $or: [
          { owner: { $in: friendUsernames } },
          { members: { $elemMatch: { $in: friendUsernames } } },
        ],
      },
      sort: { createdAt: -1 },
    });

    res.json(projects);
  } catch (err) {
    console.error("Fetch local projects error:", err);
    res.status(500).json({ error: "Failed to fetch local projects." });
  }
});

// ======== CREATE Project
app.post("/api/project", upload.any(), async (req, res) => {
  try {
    const { name, description, owner, members, type } = req.body;
    let hashtags = [];

    if (req.body.hashtags) {
      try {
        hashtags = JSON.parse(req.body.hashtags);
      } catch {
        hashtags = req.body.hashtags
          .split(" ")
          .map(t => t.trim())
          .filter(Boolean);
      }

      // Normalize all hashtags by removing any leading #
      hashtags = hashtags.map(t => t.replace(/^#/, "").trim());
    }


    if (!name || !owner)
      return res.status(400).json({ error: "Name and owner are required." });

    const userExists = await queryDB("users", "find", { query: { username: owner } });
    if (!userExists.length)
      return res.status(400).json({ error: "Owner does not exist." });

    const projectDoc = {
      name,
      description: description || "",
      owner,
      members: members ? JSON.parse(members) : [owner],
      type: type || "unspecified",
      hashtags,
      files: req.files?.filter(f => f.fieldname === "files").map(f => f.filename) || [],
      version: parseFloat(req.body.version) || 1,
      status: "checkedIn",
      checkedOutBy: "",
      activity: [],
      imageUrl: req.files?.find(f => f.fieldname === "image")?.filename || "",
      discussion: [],
      createdAt: new Date(),
    };

    const result = await queryDB("projects", "insertOne", { doc: projectDoc });
    res.status(201).json({
      message: "Project created successfully",
      _id: result.insertedId,
    });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Internal server error during project creation." });
  }
});

// ======== UPLOAD project image
app.post("/api/project/:id/image", upload.single("projectImage"), async (req, res) => {
  console.log("Uploading image for project", req.params.id, req.file);
  try {
    const id = new ObjectId(req.params.id);
    if (!req.file) return res.status(400).json({ error: "No image uploaded." });

    await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: { $set: { imageUrl: req.file.filename } },
    });

    res.json({ message: "Project image uploaded.", file: req.file.filename });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Failed to upload project image." });
  }
});

// ======== ADD file to project
app.post("/api/project/:id/files", upload.single("file"), async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const fileInfo = {
      filename: req.file.originalname,
      fileUrl: req.file.filename,
      fileType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: { $push: { files: fileInfo } },
    });

    res.json({ message: "File uploaded.", file: fileInfo });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// ======== DELETE file from project
app.delete("/api/project/:id/files/:fileName", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { fileName } = req.params;

    const result = await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: { $pull: { files: { filename: fileName } } },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Project not found." });

    res.json({ message: "File removed successfully." });
  } catch (err) {
    console.error("File deletion error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

// ======== CHECK OUT project
app.patch("/api/project/:id/checkout", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { username } = req.body;

    const project = await queryDB("projects", "find", { query: { _id: id } });
    if (!project.length) return res.status(404).json({ error: "Project not found." });

    if (project[0].status === "checkedOut")
      return res.status(400).json({ error: "Project already checked out." });

    await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: { $set: { status: "checkedOut", checkedOutBy: username } },
    });

    const activityDoc = {
      projectId: id,
      username,
      action: "check-out",
      message: `${username} checked out the project.`,
      version: project[0].version,
      timestamp: new Date(),
    };

    await queryDB("activity", "insertOne", { doc: activityDoc });

    res.json({ message: `Project checked out by ${username}.` });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to check out project." });
  }
});

// ======== CHECK IN project
app.patch("/api/project/:id/checkin", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { username, message } = req.body;

    const project = await queryDB("projects", "find", { query: { _id: id } });
    if (!project.length) return res.status(404).json({ error: "Project not found." });

    if (project[0].checkedOutBy !== username)
      return res.status(400).json({ error: "You did not check out this project." });

    const newVersion = project[0].version + 1;

    await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: {
        $set: { status: "checkedIn", checkedOutBy: "", version: newVersion },
      },
    });

    const activityDoc = {
      projectId: id,
      username,
      action: "check-in",
      message: message || "Checked in new version.",
      version: newVersion,
      timestamp: new Date(),
    };

    await queryDB("activity", "insertOne", { doc: activityDoc });

    res.json({ message: "Project checked in successfully.", version: newVersion });
  } catch (err) {
    console.error("Checkin error:", err);
    res.status(500).json({ error: "Failed to check in project." });
  }
});

// ======== UPDATE project details
app.patch("/api/project/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const updates = req.body;

    delete updates.owner; 

    const result = await queryDB("projects", "updateOne", {
      filter: { _id: id },
      update: { $set: updates },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Project not found." });

    res.json({ message: "Project updated successfully." });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ error: "Failed to update project." });
  }
});

// ======== DELETE project
app.delete("/api/project/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const result = await queryDB("projects", "delete", { query: { _id: id } });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Project not found." });

    await queryDB("activity", "delete", { query: { projectId: id } });

    res.json({ message: "Project deleted successfully." });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Failed to delete project." });
  }
});





// ==================== FRIENDS ====================





// ======== SEND friend req
app.post('/api/friends/request', async (req, res) => {
  try {
    const { requester, receiver } = req.body;

    if (!requester || !receiver)
      return res.status(400).json({ error: 'Requester and receiver required.' });

    if (requester === receiver)
      return res.status(400).json({ error: 'You cannot friend yourself.' });

    const users = await queryDB('users', 'find', {
      query: { username: { $in: [requester, receiver] } },
    });
    if (users.length < 2)
      return res.status(404).json({ error: 'One or both users not found.' });

    const existing = await queryDB('friends', 'find', {
      query: {
        $or: [
          { requester, receiver },
          { requester: receiver, receiver: requester },
        ],
      },
    });
    if (existing.length > 0)
      return res.status(400).json({ error: 'Friend request already exists or users are already friends.' });

    const friendDoc = {
      requester,
      receiver,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await queryDB('friends', 'insertOne', { doc: friendDoc });
    res.status(201).json({ message: 'Friend request sent.', result });
  } catch (err) {
    console.error('Friend request error:', err);
    res.status(500).json({ error: 'Internal server error during friend request.' });
  }
});

// ======== ACCEPT friend req
app.patch('/api/friends/:id/accept', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queryDB('friends', 'updateOne', {
      filter: { _id: new ObjectId(id)
 },
      update: { $set: { status: 'accepted' } },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Friend request not found.' });

    const request = await queryDB('friends', 'find', { query: { _id: new ObjectId(id)
 } });
    const { requester, receiver } = request[0];

    await queryDB('users', 'updateOne', {
      filter: { username: requester },
      update: { $push: { friends: receiver } },
    });
    await queryDB('users', 'updateOne', {
      filter: { username: receiver },
      update: { $push: { friends: requester } },
    });

    res.json({ message: 'Friend request accepted.' });
  } catch (err) {
    console.error('Accept friend error:', err);
    res.status(500).json({ error: 'Internal server error during accept.' });
  }
});

// ======== DECLINE friend req
app.patch('/api/friends/:id/decline', async (req, res) => {
  try {
    const id = req.params.id;

    const result = await queryDB('friends', 'updateOne', {
      filter: { _id: new ObjectId(id) },
      update: { $set: { status: 'declined' } },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Friend request not found.' });

    res.json({ message: 'Friend request declined.' });
  } catch (err) {
    console.error('Decline friend error:', err);
    res.status(500).json({ error: 'Internal server error during decline.' });
  }
});

// ======== UNFRIEND 
app.delete('/api/friends/unfriend', async (req, res) => {
  try {
    const { username1, username2 } = req.body;

    if (!username1 || !username2)
      return res.status(400).json({ error: 'Both usernames required.' });

    const existing = await queryDB('friends', 'find', {
      query: {
        $or: [
          { requester: username1, receiver: username2 },
          { requester: username2, receiver: username1 },
        ],
        status: 'accepted',
      },
    });

    if (existing.length === 0)
      return res.status(404).json({ error: 'No existing friendship found.' });

    const result = await queryDB('friends', 'deleteOne', {
      filter: {
        $or: [
          { requester: username1, receiver: username2 },
          { requester: username2, receiver: username1 },
        ],
      },
    });

    await queryDB('users', 'updateOne', {
      filter: { username: username1 },
      update: { $pull: { friends: username2 } },
    });
    await queryDB('users', 'updateOne', {
      filter: { username: username2 },
      update: { $pull: { friends: username1 } },
    });

    res.json({ message: 'Users unfriended successfully.' });
  } catch (err) {
    console.error('Unfriend error:', err);
    res.status(500).json({ error: 'Internal server error during unfriend.' });
  }
});

// ======== GET all friends of user
app.get('/api/friends/:username', async (req, res) => {
  try {
    const username = req.params.username;

    const accepted = await queryDB('friends', 'find', {
      query: {
        $or: [{ requester: username }, { receiver: username }],
        status: 'accepted',
      },
    });

    const friendUsernames = accepted.map((f) =>
      f.requester === username ? f.receiver : f.requester
    );

    res.json({ friends: friendUsernames });
  } catch (err) {
    console.error('Get friends error:', err);
    res.status(500).json({ error: 'Internal server error fetching friends.' });
  }
});

// ======== GET pending reqs
app.get('/api/friends/:username/pending', async (req, res) => {
  try {
    const username = req.params.username;

    const pending = await queryDB('friends', 'find', {
      query: {
        receiver: username,
        status: 'pending',
      },
    });

    res.json({ pending });
  } catch (err) {
    console.error('Get pending error:', err);
    res.status(500).json({ error: 'Internal server error fetching pending requests.' });
  }
});





// ==================== ACTIVITY ====================





// ======== GET all activity (global feed)
app.get("/api/activity", async (req, res) => {
  try {
    const activity = await queryDB("activity", "find", {
      query: {},
      options: { sort: { timestamp: -1 } },
    });
    res.json(activity);
  } catch (err) {
    console.error("Fetch activity error:", err);
    res.status(500).json({ error: "Failed to fetch activity." });
  }
});

// ======== GET activity for a specific project
app.get("/api/activity/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!ObjectId.isValid(projectId))
      return res.status(400).json({ error: "Invalid project ID format." });

    const activity = await queryDB("activity", "find", {
      query: { projectId: new ObjectId(projectId) },
      options: { sort: { timestamp: -1 } },
    });

    res.json(activity);
  } catch (err) {
    console.error("Fetch project activity error:", err);
    res.status(500).json({ error: "Failed to fetch project activity." });
  }
});

// ======== GET activity by user
app.get("/api/activity/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const activity = await queryDB("activity", "find", {
      query: { username },
      options: { sort: { timestamp: -1 } },
    });
    res.json(activity);
  } catch (err) {
    console.error("Fetch user activity error:", err);
    res.status(500).json({ error: "Failed to fetch user activity." });
  }
});

// ======== DELETE all activity for a project (cleanup)
app.delete("/api/activity/project/:projectId", async (req, res) => {
  try {
    const id = new ObjectId(req.params.projectId);
    await queryDB("activity", "deleteMany", { query: { projectId: id } });
    res.json({ message: "Activity deleted successfully." });
  } catch (err) {
    console.error("Delete activity error:", err);
    res.status(500).json({ error: "Failed to delete activity." });
  }
});





app.get("/api", (req, res) => res.json({ message: "API working successfully" }));

app.get("/test", (req, res) => res.send("Backend alive"));

// ==================== Frontend serving ====================
app.use(express.static(path.join(projectRoot, "frontend", "public")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(projectRoot, "frontend", "public", "index.html"));
});

// ==================== Error handling ====================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

// ==================== Start server ====================
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });