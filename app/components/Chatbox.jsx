const React = require('react');
const Messages = require('./Messages.jsx');
const axios = require('axios');

class Chatbox extends React.Component {

  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      username: this.props.username,
      containerName: this.props.containerName,
      active: false,
      messages: []
    };
    this.changeMessageInput = this.changeMessageInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.curMessage = '';
    this.updateMessages();

  }

  componentDidUpdate() {
    this.updateScroll();
  }

  componentWillReceiveProps(nextProps) {
    const context = this;
    this.socket.off('/CHAT/' + this.state.containerName);
    this.setState({
      containerName: nextProps.containerName
    });

    console.log('get chats for ', nextProps.containerName);
    this.updateMessages();
  }

  changeMessageInput(event) {
    this.curMessage = event.target.value;
  }

  handleSubmit(e, message) {
    e.preventDefault();

    if(!message || !message.trim()){
      // empty message
      return;
    }

    this.setState({ curMessage: '' });

    const messageToSend = {
      user: this.state.username,
      text: message,
      time: new Date().toString()
    };
    console.log(messageToSend);


    document.getElementById('messageText').value = '';
    const messageArray = this.state.messages.slice();
    messageArray.push(messageToSend);

    this.setState({
      messages: messageArray
    });

    axios.post('/messages', 
      { username: messageToSend.user,
        containerName: this.state.containerName,
        message: messageToSend.text
      }).then(function(res) {
        console.log('Successfully saved message to the database');
      }).catch(function(err){
        console.error('Failed to save message to database', err);
      });

    this.socket.emit('/CHAT/', {msg: messageToSend, containerName: this.state.containerName});
  }

  updateScroll() {
    const element = document.getElementById("chatText");
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }

  updateMessages() {
    const context = this;

    axios.get('/messages', {params: {containerName: this.props.containerName}})
      .then(function(res) {
        let arr = [];

        for (var i = res.data.length - 1; i >= 0; i--) {
          var msgObj = {
            user: res.data[i].userID,
            text: res.data[i].message,
            time: res.data[i].createdAt
          };

          console.log(msgObj);
          arr.push(msgObj);
        }

        context.setState({
          messages: arr
        });
      })
      .catch(function(err) {
        console.log(err);
      });

    this.socket.on('/CHAT/' + this.props.containerName, function(msg) {
      console.log('received chat', msg);

      if(context.state.username !== msg.msg.user) {
        const messageArray = context.state.messages.slice();
        messageArray.push(msg.msg);

        context.setState({
          messages: messageArray,
          active: true
        });
      }
    });
  }

  handleChangeActive(e) {
    e.preventDefault();
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    if (this.state.active) {
      return (
          <div className="chat-box-container">
            <div className="minimize" ><i className="ion-minus" onClick={this.handleChangeActive.bind(this)}></i></div>
            <Messages messages={this.state.messages} username={this.state.username}/>
            <form onSubmit={
              function(e) {
                this.handleSubmit(e, this.curMessage)
              }.bind(this)}>
                <div className="form-inputs">
                  <input 
                  onChange={this.changeMessageInput}
                  autoComplete="off"
                  id="messageText"
                  type='text' 
                  placeholder='message'
                  className="collaborators-input"
                  />
              </div>
            </form>
          </div>
        );
    } else {
      return (
        <div className="chat-box-mini" onClick={this.handleChangeActive.bind(this)}>
          Group Chat
        </div>
      )
    }
  }
}

module.exports = Chatbox;