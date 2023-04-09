/**
 * @fileoverview サーバ側の実装。
 */
(function() {
    var express = require('express');
    var bodyParser = require('body-parser');
    var cors = require('cors');
    var app = express();
    
    app.use(cors());
    app.use(express.static(__dirname + '/build'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/build/index.html');
    });
    var userInputName = '';
    app.post('/chat', function (req, res) {
        userInputName = req.body.nameInput;
        if (userInputName.length === 0) {
            userInputName = 'no name';
        }
        res.sendFile(__dirname + '/build/main.html');
    });
    var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);

    var user = null;
    var participants = [];
    var canvasDataUrl = '';
    var imageURLs = ["./images/baby.png", "./images/girl.png", "./images/old-woman.png", "./images/person-curly-hair.png", "./images/person-red-hair.png", "./images/woman-white-hair.png" ];
    
    io.sockets.on('connection', function (socket) {
        socket.on('connected', function () {
            user = {name: userInputName, id: socket.id, imageIndex: Math.floor(Math.random() * imageURLs.length), canvasDataUrl: canvasDataUrl};         
            socket.emit('connected', user);
            // 既存の参加者情報を送る
            for (var i in participants) {
                 socket.emit('join', participants[i]);
            }
            participants[socket.id] = user;
            socket.broadcast.emit('join', user);
            var msg = user.name + '(' + socket.id + ')' + 'Connected ';
            console.log(msg);
        });
        socket.on('disconnect', function () {
            if (user !== null) {
                var msg = user.name + '(' + socket.id + ')' + 'Disconnected ';
                console.log(msg);
                delete participants[socket.id];
                socket.broadcast.emit('leave', {id: socket.id});
            }
        });
        socket.on('pointstart', function (object) {
            socket.broadcast.emit('pointstart', object);
            socket.emit('pointstart', object);
        });
        socket.on('pointmove', function (object) {
            socket.broadcast.emit('pointmove', object);
            socket.emit('pointmove', object);
        });
        socket.on('pointend', function (object) {
            socket.broadcast.emit('pointend', object);
            socket.emit('pointend', object);
        });
        socket.on('canvas', function (dataUrl) {           
            // socket.broadcast.emit('canvas', dataUrl);
            // socket.emit('canvas', dataUrl);
            canvasDataUrl = dataUrl;
        });
    });

    server.listen(process.env.PORT || 8080);
})();
