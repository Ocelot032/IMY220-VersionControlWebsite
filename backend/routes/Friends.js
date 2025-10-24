const express = require('express');
const router = express.Router();
const { queryDB, connectDB } = require('../database');
const { ObjectId } = require('mongodb');


// ======== connect to db
let db;
connectDB().then((database) => { db = database; });

// ======== SEND friend req
// body: { requester: "username1", receiver: "username2" }
router.post('/request', async (req, res) => {
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
router.patch('/:id/accept', async (req, res) => {
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
router.patch('/:id/decline', async (req, res) => {
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
router.delete('/unfriend', async (req, res) => {
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
router.get('/:username', async (req, res) => {
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
router.get('/:username/pending', async (req, res) => {
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

module.exports = router;
