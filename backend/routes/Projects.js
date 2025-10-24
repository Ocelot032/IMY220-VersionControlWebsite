const express = require('express');
const router = express.Router();
const { queryDB, connectDB } = require('../database');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ======== Multer stuff
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'projectImage') cb(null, 'uploads/projects');
    else cb(null, 'uploads/projects');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ======== Connect to db
let db;
connectDB().then((database) => { db = database; });

// ======== GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await queryDB('projects', 'find');
    res.json(projects);
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// ======== GET single project by id
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.post('/:id/image', upload.single('projectImage'), async (req, res) => {
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
router.post('/:id/files', upload.single('file'), async (req, res) => {
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
router.delete('/:id/files/:fileName', async (req, res) => {
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
router.patch('/:id/checkout', async (req, res) => {
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
router.patch('/:id/checkin', async (req, res) => {
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
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
