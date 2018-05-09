import React, {Component} from 'react';
import io from 'socket.io-client';
import moment from 'moment';

class Chat extends Component {
  constructor(){
    super();

    this.state = {
      username: '',
      message: '',
      messages: [],
      userCount: null
    }

    // binding event handlers
    this.sendMessage = this.sendMessage.bind(this);

    // watches for running server on port 3001
    this.socket = io('localhost:3001');

    this.socket.on('RECEIVE_MESSAGE', (message) => {
      this.addMessage(message);
    });

    this.socket.on('connectedUsers', (users) => {
      console.log(users, 'this is users');
      console.log('this is the number of connected users: ' + users.connectedUsers.length);
      this.setState({ userCount: users.connectedUsers.length });
    })
  }

  addMessage(data) {
    console.log(data, 'data from addMessage func');
    this.setState({
      messages: this.state.messages.concat([data]) 
    });
  }

  sendMessage(e) {
    e.preventDefault();
    this.socket.emit('SEND_MESSAGE', {
      username: this.state.username,
      message: this.state.message,
      timeStamp: new Date()
    });
    this.setState({message: ''});
  }


  render(){
    const messageLog = this.state.messages.map((message, index) => {
      const timestamp = moment(message.timeStamp).format('LT');
      return (
        <div key={index}>[{timestamp}]{message.username}: {message.message}</div>
      )
    });

    return (
      <div className="chat-main">
        
        <div className="chat-control">
          <input 
            type="text" 
            placeholder="Username" 
            value={this.state.username} 
            onChange={(e) => this.setState({username: e.target.value}) }/>
            <br/>
          <input 
            type="text" 
            placeholder="Message" 
            value={this.state.message}
            onChange={(e) => this.setState({message: e.target.value})} />
            <br/>
          <button onClick={this.sendMessage}>Send</button>
          <div className="generic-message">
            {this.state.userCount > 1 ? (
              <p>Someone has joined! Go talk to your new online friend.</p>
            ):(
              <p>You're the only one here.  Sit tight...</p>
            )}
          </div>
          <div className="messages">
            {messageLog}
          </div>
        </div>
      </div>
    )
  }

}
export default Chat;