const express = require('express');
const socket = require('socket.io');
const app = express();
const port = 3001;
const server = app.listen(port, () => {console.log('Server is running on port 3001!');});

app.get('/', (req,res) => {
  res.send('<h1>This is the server for Socket IO Chat</h1>');
})

const io = socket(server);

const updateUserCount = () => {
  io.emit('connectedUsers', {connectedUsers: Object.keys(io.sockets.sockets)});
}


io.on('connection', (socket) => {
  console.log('user has connected');
  updateUserCount();

  socket.on('disconnect', () => {
    console.log('user has disconnected');
    updateUserCount();
  });
  
  socket.on('SEND_MESSAGE', (data) => {
    console.log(`message is ${data.message}`);
    let splitCommands = data.message.split(" ");
    if(splitCommands.length >= 3 && splitCommands[0] === '/delay'){
      const time = Number(splitCommands[1]);
        splitCommands.splice(0, 2);
        let msg = splitCommands.join(" ");
    
        setTimeout(() => {
          io.emit('RECEIVE_MESSAGE', {username: data.username, message: msg});
        }, time);
    } else {
      io.emit('RECEIVE_MESSAGE', data); //sends message to front-end      
    }
    
    // console.log('message received');
  });
})