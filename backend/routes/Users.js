const express = require('express');
const router = express.Router();
const { queryDB, connectDB } = require('../database');

//get multer instance
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const upload = require('../server').upload; 

//Ensure DB connection
let db;
connectDB().then((database) => { db = database; });

//======== Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, surname } = req.body;

    // basic validation
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All required fields must be filled.' });

    // unique username and not changable
    const existingUser = await queryDB('users', 'find', { query: { $or: [{ username }, { email }] } });
    if (existingUser.length > 0)
      return res.status(400).json({ error: 'Username or email already exists.' });

    const userDoc = {
      username,
      email,
      password,
      name: name || '',
      surname: surname || '',
      workplace: '',
      birthday: '',
      profileImg: '',
      friends: [],
      isAdmin: false,
      createdAt: new Date(),
    };

    const result = await queryDB('users', 'insertOne', { doc: userDoc });
    res.status(201).json({ message: 'User registered successfully', result });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

//======== Login
router.post('/login', async (req, res) => {
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
router.post('/logout', (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const users = await queryDB('users', 'find');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users.' });
  }
});

//======== GET single user by username
router.get('/:username', async (req, res) => {
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
router.patch('/:username', async (req, res) => {
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
router.delete('/:username', async (req, res) => {
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
router.post('/:username/upload', (req, res, next) => {
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

module.exports = router;
