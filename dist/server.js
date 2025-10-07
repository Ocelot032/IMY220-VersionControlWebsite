"use strict";

var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// const express = require('express'); //NORMAL SERVER.JS
//will only work with babel (transpiled)

// const path = require('path'); //NORMAL SERVER.JS
//will only work with babel (transpiled)

// create app
var app = (0, _express["default"])();

// port to listen to
var port = 8080;

// server static page in public directory
app.use(_express["default"]["static"](_path["default"].join(__dirname, '/public')));

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