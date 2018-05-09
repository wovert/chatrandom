import React, {Component} from 'react';

class Chat extends Component {
  constructor(){
    super();
  }
  render(){
    return (
      <div className="chat-main">
        <div className="messages"></div>
        <div className="chat-control">
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Message" />
          <button>Send</button>
        </div>
      </div>
    )
  }

}
export default Chat;