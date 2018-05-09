import React, {Component} from 'react';
import io from 'socket.io-client';

class Chat extends Component {
  constructor(){
    super();

    this.state = {
      username: '',
      message: '',
      messages: []
    }

    // binding event handlers
    this.sendMessage = this.sendMessage.bind(this);

    // watches for running server on port 3001
    this.socket = io('localhost:3001');

    this.socket.on('RECEIVE_MESSAGE', (message) => {
      this.addMessage(message);
    });

    // const addMessage = (data) => {
    //   console.log(data, 'data from addMessage func');
    //   this.setState({
    //     messages: this.state.messages.concat([data]) 
    //   });
    //   console.log(`These are the messages: ${this.state.messages}`);
    // }
  }

  addMessage(data) {
    console.log(data, 'data from addMessage func');
    this.setState({
      messages: this.state.messages.concat([data]) 
    });
    console.log(`These are the messages: ${this.state.messages}`);
  }

  sendMessage(e) {
    e.preventDefault();
    debugger;
    this.socket.emit('SEND_MESSAGE', {
      author: this.state.username,
      message: this.state.message
    });
    this.setState({message: ''});
  }


  render(){
    const chatMessages = this.state.messages.map(message => {
      return (
        <div>{message.author}: {message.message}</div>
      )
    })
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
          <div className="messages">
            {chatMessages}
          </div>
        </div>
      </div>
    )
  }

}
export default Chat;