"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default;
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
io.on('connection', function (socket) {
    console.log('A user connected');
    socket.on('offer', function (offer) {
        socket.broadcast.emit('offer', offer);
    });
    socket.on('answer', function (answer) {
        socket.broadcast.emit('answer', answer);
    });
    socket.on('candidate', function (candidate) {
        socket.broadcast.emit('candidate', candidate);
    });
    socket.on('disconnect', function () {
        console.log('User disconnected');
    });
});
server.listen(5000, function () {
    console.log('Signaling server running on port 5000');
});
