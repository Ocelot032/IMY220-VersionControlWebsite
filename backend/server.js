const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { connectDB } = require('./database');

//======== Routes 
const userRoutes = require('./routes/Users');
const projectRoutes = require('./routes/Projects');
const checkinsRoutes = require('./routes/Checkins');
const friendsRoutes = require('./routes/Friends');

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
const uploadDirs = [
    'uploads',
    'uploads/projects',
    'uploads/profiles' 
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

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

// ======== Routes mounting
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/friends', friendsRoutes);

// ======== Root test route
app.get('/api', (req, res) => {
    res.json({ message: 'API working successfully' });
});

// ======== Error handling
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({ error: 'Something went wrong on the server.' });
// });

// ======== Connect to db, start server
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });
