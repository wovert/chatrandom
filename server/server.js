const express = require('express');
const socket = require('socket.io');
const {generateMessage} = require('./utils.js');
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

  let userCount = Object.keys(io.sockets.sockets).length;

  if(userCount > 1){
    io.emit('RECEIVE_MESSAGE', generateMessage('Admin', 'User has joined.'));    
  } else {
    io.emit('RECEIVE_MESSAGE', generateMessage('Admin', 'welcome to the chat app! You\'re the only one here, sit tight and wait for another user to join.'));      
  }

    

  socket.on('disconnect', () => {
    console.log('user has disconnected');
    updateUserCount();
    io.emit('RECEIVE_MESSAGE', generateMessage('Admin', 'User has left.'))
  });
  
  socket.on('SEND_MESSAGE', (data) => {
    console.log(`message is ${data.timeStamp}`);
    let splitCommands = data.message.split(" ");
    if(splitCommands.length >= 3 && splitCommands[0] === '/delay'){
      const time = Number(splitCommands[1]);
      splitCommands.splice(0, 2);
      let msg = splitCommands.join(" ");

      setTimeout(() => {
        io.emit('RECEIVE_MESSAGE', generateMessage(data.author, msg));
      }, time);
      
    } else {
      io.emit('RECEIVE_MESSAGE', generateMessage(data.author, data.message)); //sends message to front-end      
    }
    
    // console.log('message received');
  });
})