import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import messageRoutes from '@/routes/messageRoutes';
import mediaRoutes from '@/routes/mediaRoutes'
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use('/messages', messageRoutes);
app.use('/media', mediaRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
