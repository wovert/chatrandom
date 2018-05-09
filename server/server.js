const express = require('express');
const socket = require('socket.io');
const app = express();
var userCount = 0;
const port = 3001;

const server = app.listen(port, () => {
  console.log('Server is running on port 3001!');
});

app.get('/', (req,res) => {
  res.send('<h1>This is the server for Socket IO Chat</h1>');
})

const io = socket(server);

io.on('connection', (socket) => {
  console.log('user has connected');
  userCount++;  
  console.log(`This is the socket id: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('user has disconnected');
    userCount--;
  });
  
  socket.on('SEND_MESSAGE', (data) => {
    console.log('io is :', io)
    io.emit('RECEIVE_MESSAGE', data);
    console.log('message received');
  })
})