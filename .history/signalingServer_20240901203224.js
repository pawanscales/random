"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Create the HTTP server
const server = http.createServer(app);

// Create the Socket.io server
const io = new socketIo.Server(server);

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });
    
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });
    
    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(5000, () => {
    console.log('Signaling server running on port 5000');
});
