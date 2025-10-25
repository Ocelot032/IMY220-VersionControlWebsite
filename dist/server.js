"use strict";

var express = require('express'); //NORMAL SERVER.JS
// import express from 'express'; //will only work with babel (transpiled)

var path = require('path'); //NORMAL SERVER.JS
// import path from 'path'; //will only work with babel (transpiled)

// create app
var app = express();

// port to listen to
var port = 8080;

// server static page in public directory
app.use(express["static"](path.join(__dirname, '/frontend/public')));

// dont know what this does
app.get('/api', function (req, res) {
  res.json({
    message: 'Hello from Express!'
  });
});

// listen on port - wait for someone to connect
app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});