const express = require('express');
const path = require('path');

const app = express();

app.use("/static", express.static('./static/'));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/main.html'));
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/categories', function(req, res) {
    res.sendFile(path.join(__dirname, '/categories.html'));
});

app.listen(3000);