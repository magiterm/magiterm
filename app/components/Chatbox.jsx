const React = require('react');

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      username: this.props.username,
      curMessage: '',
      containerName: this.props.containerName
    };
    this.changeMessageInput = this.changeMessageInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const context = this;
    this.socket.off('/CHAT/' + this.state.containerName);
    this.setState({
      containerName: nextProps.containerName
    });
    this.socket.on('/CHAT/' + nextProps.containerName, function(msg) {
      if(context.state.username !== msg.sender) {
        if(!msg.joined) {
          document.getElementById('chatText').value = msg.sender + ': ' + msg.msg + '\n' + document.getElementById('chatText').value;
        } else {
          document.getElementById('chatText').value = msg.msg + document.getElementById('chatText').value;
        }
      }
    });

    document.getElementById('chatText').value = '---' + this.props.username + ' Joined /' + nextProps.containerName + '---\n' + document.getElementById('chatText').value;
    this.socket.emit('/CHAT/', {joined: true, sender: this.props.username, msg: '---' + this.props.username + ' Joined /' + nextProps.containerName + '---\n', containerName: nextProps.containerName});
  }

  changeMessageInput(event) {
    this.setState({
      curMessage: event.target.value
    });
  }

  handleSubmit(e, message) {
    e.preventDefault();
    document.getElementById('chatText').value = this.state.username + ': ' + message + '\n' + document.getElementById('chatText').value;
    document.getElementById('messageText').value = '';
    this.socket.emit('/CHAT/', {msg: message, sender: this.state.username, containerName: this.state.containerName});
  }

  render() {
    return (
        <div>
          <textarea readOnly="true" id="chatText" rows="10" cols="50"></textarea>
          <form onSubmit={
            function(e) {
              this.handleSubmit(e, this.state.curMessage)
            }.bind(this)}>
            <div className="col-md-12">
              <div className="form-inputs">
                <input 
                onChange={this.changeMessageInput}
                id="messageText"
                type='text' 
                placeholder='message'
                className="collaborators-input"
                />
                <button type="submit">Send</button>
              </div>
            </div>
          </form>
        </div>
      );
  }
}

module.exports = Chatbox;