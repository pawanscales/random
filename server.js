const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server  = http.createServer(app);
const io = socketIo(server);
io.on('connection',(socket)=>{
    console.log('the mentor or mentee connected');
    socket.on('offer',(offer)=>{
        socket.broadcast.emit('offer', offer);
    })
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
      });  
      socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
      });
    
})
server.listen(7800, () => {
    console.log('Signaling server running on port 7800');
  });