const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('notification', 'Welcome to the Socket.IO server!');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setInterval(() => {
  io.emit('notification', 'This is a periodic notification from the server.');
  console.log('Sent notification');
}, 2000);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});