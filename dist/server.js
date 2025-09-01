"use strict"

var express = require('express');
var path = require('path');
var app = express();
var port = 3000;
app.use(express["static"](path.join(__dirname, '../public')));

app.get('/api', function(req, res) {
    res.json({
        message: "  Hey there from the backend :)"
    });
});

app.get('/{*any}', function (req, res) {
    return res.sendFile(path.resolve('public', 'index.html'));
});

app.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
// Tester comment