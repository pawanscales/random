import express, { Express } from 'express';
import http, { Server } from 'http';
import socketIo, { Socket } from 'socket.io';

const app: Express = express();
const server: Server = http.createServer(app);
const io: socketIo.Server = socketIo(server);

io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    socket.on('offer', (offer: any) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer: any) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate: any) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5000, () => {
    console.log('Signaling server running on port 5000');
});
