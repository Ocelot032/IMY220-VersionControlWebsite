const express = require('express');
const router = express.Router();
const { queryDB, connectDB } = require('../database');
const { ObjectId } = require('mongodb');

// ======== connect to db
let db;
connectDB().then((database) => { db = database; });

// ======== GET all checkins
router.get('/', async (req, res) => {
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
router.get('/project/:projectId', async (req, res) => {
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
router.get('/user/:username', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;
