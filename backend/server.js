//Express server

const express = require('express');//?
const path = require('path');//?

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.post('/auth/signin', (req, res) => {
    res.json({
        email: 'hello@world.com'
    })
}); //?

app.get('/api', (req, res) => {
    res.json({ message: "Hey there form the backend :)" });
});


// app.get('/{*any}', (req, res) => res.sendFile(path.resolve('public', 'index.html')));
app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dirname, '../frontend/public/index.html'))
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});