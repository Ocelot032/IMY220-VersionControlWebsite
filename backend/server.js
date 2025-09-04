//Express server

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.post('/auth/signin', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({success: false, message: "Missing username or password "});
    }

    res.json({
        success: true,
        message: "User has successfully signed in! (stubbed)",
        user: {
            id: 1,
            username,
            email: `${username}@xample.com`
        },
        token: "10-ToKeN-DuMmY-10"
    });
}); //stubbing

app.post('/auth/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing username, email or password' });
  }

  res.status(201).json({
    success: true,
    message: 'User has successfully signed up! (stubbed)',
    user: {
      id: Date.now(),      // fake unique id
      username,
      email
    },
    token: '20-ToKeN-DuMmY-20'
  });
});

app.get('/api', (req, res) => {
    res.json({ message: "Hey there form the backend :)" });
});


app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, '../frontend/public/index.html'))
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});