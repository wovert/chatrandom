const express = require('express');
const socket = require('socket.io');
const {generateMessage} = require('./utils.js');
const app = express();
const port = 3001;
const server = app.listen(port, () => {console.log('Server is running on port 3001!');});

app.get('/', (req,res) => {
  res.send('<h1>This is the server for Socket IO Chat</h1>');
});

const io = socket(server);

const updateUserCount = () => {
  io.emit('connectedUsers', {connectedUsers: Object.keys(io.sockets.sockets)});
}


io.on('connection', (socket) => {
  updateUserCount();

  const userCount = Object.keys(io.sockets.sockets).length;

  socket.emit('receiveMessage', generateMessage('Admin', 'Welcome to the chat app!'));

  if(userCount === 1){
    socket.emit('receiveMessage', generateMessage('Admin', "You're the only one here.  Please wait for others to join."));
  }

  if(userCount > 1){
    socket.broadcast.emit('receiveMessage', generateMessage('Admin', 'User has joined.  Say hello!')); //displays only to the user that entered first suggesting to talk to other user
  }

  socket.on('disconnect', () => {
    updateUserCount();
    io.emit('receiveMessage', generateMessage('Admin', 'User has left.'))
  });
  
  
  socket.on('sendMessage', (data) => {
    let splitCommands = data.message.split(" ");
    if(splitCommands.length >= 3 && splitCommands[0] === '/delay'){ // '/delay' command logic
      const time = Number(splitCommands[1]);
      splitCommands.splice(0, 2);
      let msg = splitCommands.join(" ");

      setTimeout(() => {
        io.emit('receiveMessage', generateMessage(data.author, msg));
      }, time);
      
    } else {
      io.emit('receiveMessage', generateMessage(data.author, data.message));           
    } 
  });
})