const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const  { MongoClient, ObjectId } = require('mongodb');

const connectionString = "mongodb+srv://marker:mark123@imy220.0gytrcp.mongodb.net/?retryWrites=true&w=majority&appName=IMY220";
const client = new MongoClient(connectionString);

let db;

async function connectDB(){
    if (db) return db;

    try {
        await client.connect(); //opening a connection to mongodb server
        db = client.db("Zynthex");
        console.log("MongoDB Connected");

        //create the indexes
        await db.collection("users").createIndex({ username: 1 }, { unique: true });
        await db.collection("users").createIndex({ email: 1 }, { unique: true });
        await db.collection("projects").createIndex({ owner: 1 });

        return db;
        
    } catch (err) {
        console.error("MongoDB Connection error", err)
        throw err;
    }
}

//general query function
async function queryDB(collectionName, operation, data = {}){
    const db = await connectDB();
    const collection = db.collection(collectionName);
    try {
        switch (operation) {
            case 'find':
                return await collection.find(data.query || {}, data.options || {}).toArray();
            case 'insertOne':
                return await collection.insertOne(data.doc);
            case 'updateOne':
                return await collection.updateOne(data.filter, data.update, data.options || {});
            case 'deleteOne':
                return await collection.deleteOne(data.filter);
            case 'aggregate':
                return await collection.aggregate(data.pipeline || []).toArray();
            default:
                throw new Error('Invalid operation');
        }
    } catch (err) {
        console.error(`Error in ${operation} on ${collectionName}: `, err);
        throw err;
    }
}

//======== Initial Setup
const app = express();
const PORT = 8080;

//======== Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

// Setup static files - frontend + uploads
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//======== Session Setup
app.use(session({
    secret: 'IMY220ProjectFinal', //change to Zynthex?
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

//======== Create upload folders if they dont exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
}

if (!fs.existsSync('uploads/projects')) {
    fs.mkdirSync('uploads/projects', { recursive: true });
}

if (!fs.existsSync('uploads/profiles')) {
    fs.mkdirSync('uploads/profiles', { recursive: true });
}

//======== Multer stuff
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profileImg') cb(null, 'uploads/profiles');
        else cb(null, 'uploads/projects');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5mb limit
});

// Export upload middleware for use in routes
app.locals.upload = upload;

// ======== ROUTES
// ====== USERS
app.post('/api/users/register', upload.single('profileImg'), async (req, res) => {
    try {
        const { username, email, password, name, surname, workplace, birthday, isAdmin } = req.body;

        if (!username || !email || !password)
        return res.status(400).json({ error: 'All required fields must be filled.' });

        // unique username and not changable
        const existingUser = await queryDB('users', 'find', {
        query: { $or: [{ username }, { email }] },
        });
        if (existingUser.length > 0)
        return res.status(400).json({ error: 'Username or email already exists.' });

        // handle file upload
        let profileImg = '';
        if (req.file) {
        profileImg = req.file.filename; 
        }

        const userDoc = {
          username,
          email,
          password,
          name: name || '',
          surname: surname || '',
          workplace: workplace || '',
          birthday: birthday || '',
          profileImg, 
          friends: [],
          isAdmin: isAdmin === 'true' || isAdmin === true, // convert to boolean if needed
          createdAt: new Date(),
        };

        const result = await queryDB('users', 'insertOne', { doc: userDoc });
        res.status(201).json({
        message: 'User registered successfully',
        user: {
            username,
            email,
            name,
            surname,
            profileImg,
        },
        insertedId: result.insertedId,
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
});


//======== Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required.' });

    const user = await queryDB('users', 'find', { query: { username, password } });
    if (user.length === 0)
      return res.status(401).json({ error: 'Invalid credentials.' });

    // create session
    req.session.user = {
      username: user[0].username,
      email: user[0].email,
      isAdmin: user[0].isAdmin,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

//======== Logout
app.post('/api/users/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Logout failed.' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully.' });
    });
  } else {
    res.status(400).json({ error: 'No active session.' });
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

//======== GET single user by username
app.get('/api/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await queryDB('users', 'find', { query: { username } });

    if (!user.length) return res.status(404).json({ error: 'User not found.' });
    res.json(user[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

//======== EDIT profile (ecl username & email)
app.patch('/api/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const updates = req.body;

    //prevent username/email changes
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

// ====== PROJECTS

// ======== GET all projects
app.get('/api/project/', async (req, res) => {
  try {
    const projects = await queryDB('projects', 'find');
    res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// ======== GET single project by id
app.get('/api/project/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const project = await queryDB('projects', 'find', { query: { _id: id } });
    if (!project.length) return res.status(404).json({ error: 'Project not found.' });
    res.json(project[0]);
  } catch (err) {
    console.error('Fetch project error:', err);
    res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// ======== CREATE Project
app.post('/api/project/', async (req, res) => {
  try {
    const { name, description, owner, members, type, hashtags } = req.body;

    if (!name || !owner)
      return res.status(400).json({ error: 'Name and owner are required.' });

    const userExists = await queryDB('users', 'find', { query: { username: owner } });
    if (!userExists.length)
      return res.status(400).json({ error: 'Owner does not exist.' });

    const projectDoc = {
      name,
      description: description || '',
      owner,
      members: members || [],
      type: type || 'unspecified',
      hashtags: hashtags || [],
      image: '',
      status: 'checkedIn',
      version: 1,
      checkedOutBy: '',
      files: [],
      createdAt: new Date(),
    };

    const result = await queryDB('projects', 'insertOne', { doc: projectDoc });
    res.status(201).json({ message: 'Project created successfully', result });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Internal server error during project creation.' });
  }
});

// ======== UPLOAD project name
app.post('/api/project/:id/image', upload.single('projectImage'), async (req, res) => {
     console.log('Uploading image for project', req.params.id, req.file);
  try {
    const id = new ObjectId(req.params.id);
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

    await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: { $set: { image: req.file.filename } },
    });

    res.json({ message: 'Project image uploaded.', file: req.file.filename });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload project image.' });
  }
});

// ======== ADD file to project
app.post('/api/project/:id/files', upload.single('file'), async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const fileInfo = {
      fileName: req.file.originalname,
      fileUrl: req.file.filename,
      uploadedAt: new Date(),
    };

    await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: { $push: { files: fileInfo } },
    });

    res.json({ message: 'File uploaded.', file: fileInfo });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// ======== DELETE file from project
app.delete('/api/project/:id/files/:fileName', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { fileName } = req.params;

    const result = await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: { $pull: { files: { fileName } } },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Project not found.' });

    res.json({ message: 'File removed successfully.' });
  } catch (err) {
    console.error('File deletion error:', err);
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});

// ======== CHECK OUT project
app.patch('/api/project/:id/checkout', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { username } = req.body;

    const project = await queryDB('projects', 'find', { query: { _id: id } });
    if (!project.length) return res.status(404).json({ error: 'Project not found.' });

    if (project[0].status === 'checkedOut')
      return res.status(400).json({ error: 'Project already checked out.' });

    await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: { $set: { status: 'checkedOut', checkedOutBy: username } },
    });

    res.json({ message: `Project checked out by ${username}.` });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to check out project.' });
  }
});

// ======== CHECK IN project
app.patch('/api/project/:id/checkin', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const { username, message } = req.body;

    const project = await queryDB('projects', 'find', { query: { _id: id } });
    if (!project.length) return res.status(404).json({ error: 'Project not found.' });

    if (project[0].checkedOutBy !== username)
      return res.status(400).json({ error: 'You did not check out this project.' });

    const newVersion = project[0].version + 1;

    await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: {
        $set: { status: 'checkedIn', checkedOutBy: '', version: newVersion },
      },
    });

    //log checkin to separate collection
    const checkinDoc = {
      projectId: id,
      username,
      message: message || '',
      version: newVersion,
      timestamp: new Date(),
    };
    await queryDB('checkins', 'insertOne', { doc: checkinDoc });

    res.json({ message: 'Project checked in successfully.', version: newVersion });
  } catch (err) {
    console.error('Checkin error:', err);
    res.status(500).json({ error: 'Failed to check in project.' });
  }
});

// ======== UPDATE project details
app.patch('/api/project/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const updates = req.body;

    // don’t allow owner changes 
    delete updates.owner;

    const result = await queryDB('projects', 'updateOne', {
      filter: { _id: id },
      update: { $set: updates },
    });

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'Project not found.' });

    res.json({ message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// ======== DELETE project
app.delete('/api/project/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await queryDB('projects', 'deleteOne', { filter: { _id: id } });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Project not found.' });

    // also remove related checkins
    await queryDB('checkins', 'deleteOne', { filter: { projectId: id } });

    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// ====== FRIENDS

// ======== SEND friend req
// body: { requester: "username1", receiver: "username2" }
app.post('/api/friends/request', async (req, res) => {
  try {
    const { requester, receiver } = req.body;

    if (!requester || !receiver)
      return res.status(400).json({ error: 'Requester and receiver required.' });

    if (requester === receiver)
      return res.status(400).json({ error: 'You cannot friend yourself.' });

    //check both users exist
    const users = await queryDB('users', 'find', {
      query: { username: { $in: [requester, receiver] } },
    });
    if (users.length < 2)
      return res.status(404).json({ error: 'One or both users not found.' });

    //check if already friends or pending
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
// body: { receiver: "username2" }
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

    //add to both users' friend lists
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
// body: { username1: "A", username2: "B" }
app.delete('/api/friends/unfriend', async (req, res) => {
  try {
    const { username1, username2 } = req.body;

    if (!username1 || !username2)
      return res.status(400).json({ error: 'Both usernames required.' });

    // Find existing friendship first
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

    // Remove from friends collection
    const result = await queryDB('friends', 'deleteOne', {
      filter: {
        $or: [
          { requester: username1, receiver: username2 },
          { requester: username2, receiver: username1 },
        ],
      },
    });

    // Remove each from the other's friend list
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


// ====== CHECKINS

// ======== GET all checkins
app.get('/api/checkins/', async (req, res) => {
  try {
    const checkins = await queryDB('checkins', 'find', {
      query: {},
      options: { sort: { timestamp: -1 } },
    });
    res.json(checkins);
  } catch (err) {
    console.error('Fetch checkins error:', err);
    res.status(500).json({ error: 'Failed to fetch check-ins.' });
  }
});

// ======== GET checkins by project
app.get('/api/checkins/project/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!ObjectId.isValid(projectId))
      return res.status(400).json({ error: 'Invalid project ID format.' });

    const checkins = await queryDB('checkins', 'find', {
      query: { projectId: new ObjectId(projectId) },
      options: { sort: { timestamp: -1 } },
    });

    if (!checkins.length)
      return res.status(404).json({ error: 'No check-ins found for this project.' });

    res.json(checkins);
  } catch (err) {
    console.error('Fetch project checkins error:', err);
    res.status(500).json({ error: 'Failed to fetch project check-ins.' });
  }
});

// ======== GET checkins by user
app.get('/api/checkins/user/:username', async (req, res) => {
  try {
    const username = req.params.username;

    const checkins = await queryDB('checkins', 'find', {
      query: { username },
      options: { sort: { timestamp: -1 } },
    });

    if (!checkins.length)
      return res.status(404).json({ error: 'No check-ins found for this user.' });

    res.json(checkins);
  } catch (err) {
    console.error('Fetch user checkins error:', err);
    res.status(500).json({ error: 'Failed to fetch user check-ins.' });
  }
});

// ======== ADD new chicken
// This will usually be triggered automatically by the project check-in route
// but we include it here for testing or manual use
app.post('/api/checkins/', async (req, res) => {
  try {
    const { projectId, username, message, version } = req.body;

    if (!projectId || !username)
      return res.status(400).json({ error: 'projectId and username required.' });

    if (!ObjectId.isValid(projectId))
      return res.status(400).json({ error: 'Invalid project ID format.' });

    const checkinDoc = {
      projectId: new ObjectId(projectId),
      username,
      message: message || '',
      version: version || 1,
      timestamp: new Date(),
    };

    const result = await queryDB('checkins', 'insertOne', { doc: checkinDoc });
    res.status(201).json({ message: 'Check-in logged successfully.', result });
  } catch (err) {
    console.error('Add checkin error:', err);
    res.status(500).json({ error: 'Failed to log check-in.' });
  }
});

// ======== DELETE chicken
app.delete('/api/checkins/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id))
      return res.status(400).json({ error: 'Invalid check-in ID format.' });

    const result = await queryDB('checkins', 'deleteOne', {
      filter: { _id: new ObjectId(id) },
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'Check-in not found.' });

    res.json({ message: 'Check-in deleted successfully.' });
  } catch (err) {
    console.error('Delete checkin error:', err);
    res.status(500).json({ error: 'Failed to delete check-in.' });
  }
});

// ======== Root test route
app.get('/api', (req, res) => {
    res.json({ message: 'API working successfully' });
});

// ======== Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ======== Connect to db, start server
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
