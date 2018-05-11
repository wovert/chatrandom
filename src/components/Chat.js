import React, {Component} from 'react';
import io from 'socket.io-client';
import moment from 'moment';

// |---MATERIAL UI COMPONENTS---|
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

const PORT = 3001;


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
    this.socket = io(`localhost:${PORT}`);

    this.socket.on('receiveMessage', (message) => {
      this.addMessage(message);
    });

    this.socket.on('connectedUsers', (users) => {
      this.setState({ userCount: users.connectedUsers.length });
    });
  }

  addMessage(data) {
    this.setState({
      messages: this.state.messages.concat([data]) 
    });
  }

  sendMessage(e) {
    e.preventDefault();
    const hasUsername = this.state.username.length > 0;
    const hasMessage = this.state.message.length > 0;

    if(!hasUsername && !hasMessage){ //validation for blank username/msg input field
      alert("Username and Message fields can't be blank.");
    } else if(!hasUsername){
      alert("Username field can't be blank.")
    } else if(!hasMessage) {
      alert("Message field can't be blank.")
    } else {
      this.socket.emit('sendMessage', {
        author: this.state.username,
        message: this.state.message,
        timeStamp: new Date()
      });
      this.setState({message: ''});
    }
  }

  render(){
    let currentUserMsg;
    const messageLog = this.state.messages.map((message, index) => {
      return (
        <ListItem 
          className={message.author.toLowerCase() === 'admin' ? 'admin-msg':'user-msg'} 
          key={index}
          disabled={true}
          primaryText={message.author}
          secondaryText={message.message}
          rightIcon={<span style={{'fontSize': '12px', width: '55px'}}>{message.timeStamp}</span>}

        />
      )
    });

    if(this.state.userCount === 2){ //displays user count (not including yourself)
      currentUserMsg = <p>{this.state.userCount - 1} other user online</p>
    } else if(this.state.userCount > 2 || this.state.userCount === 1){
      currentUserMsg = <p>{this.state.userCount - 1} other users online</p>
    } 

    return (
      <div className="chat-main">
        <Subheader>{currentUserMsg}</Subheader>
        <div className="message-log">
          <List>
            {messageLog}
          </List>
        </div>
        
        <div className="chat-control">
          <TextField 
            hintText="Username"
            value={this.state.username}
            onChange={(e) => this.setState({username: e.target.value}) }
          /><br/>
          <TextField 
            hintText="Message"
            value={this.state.message}
            onChange={(e) => this.setState({message: e.target.value})}
          /><br/>
          <RaisedButton 
            label="Send"
            onClick={this.sendMessage}
            style={{'display':'block'}}
          />
        </div>
      </div>
    )
  }

}
export default Chat;