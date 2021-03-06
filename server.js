const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 5000;

app.use("/static", express.static('./static/'));

app.use(express.static(__dirname + '/public'));

app.get('/main', function(req, res) {
    res.sendFile(path.join(__dirname, '/main.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/categories', function(req, res) {
    res.sendFile(path.join(__dirname, '/categories.html'));
});

app.get('/file-management', function(req, res) {
    res.sendFile(path.join(__dirname, '/file-management.html'));
});

app.get('/navbar', function(req, res) {
    res.sendFile(path.join(__dirname, '/navbar.html'));
});

app.get('/personal-content', function(req, res) {
    res.sendFile(path.join(__dirname, '/personal-content.html'));
});


app.listen(port);