const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')
const axios = require('axios');
const NavBar = require('./NavBar.jsx');


class LinuxComputer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      username: '',
      containerName: '',
      collabWith: []
    }

    this.selectChange = this.selectChange.bind(this);
  }


componentWillMount() {
  var context = this;
  const user = JSON.parse(localStorage['user']);
  context.setState({
    containerName: user.username,
    username: user.username,
    collabWith: []
  });
  axios.post('/users/collaboratingWith', {username: user.username})
  .then(function(res) {
    const acceptedUsernames = res.data.map(function(accepted) {
    return accepted.requesterUsername;
    });
    context.setState({
      collabWith: acceptedUsernames
    });
  });
  this.socket.on('/DASH/REMOVE/COLLABWITH/' + user.username, function(rejection) {
    if(rejection.remover === context.state.containerName) {
      window.location.reload();
    } else {
      var collabWith = context.state.collabWith;
      collabWith.splice(collabWith.indexOf(rejection.remover), 1);
      context.setState({
        collabWith: collabWith
      });
    }
  });
} 

  selectChange(event) {
    //alert(event.target.value);
    this.setState({
      containerName: event.target.value
    });
  }

    render() {
      if (this.state.containerName.length) {
           return (
            <div>
              <NavBar username={this.state.username} />
              <select onChange={this.selectChange}>
                <option value={this.state.username}>{this.state.username}</option>
                {this.state.collabWith.map(function(user) {
                  return (
                      <option value={user}>{user}</option>
                    );
                })}
              </select>
              <div className="row">
                <div className="col-md-8 card-container">
                   <CodeEditor username={this.state.username} containerName={this.state.containerName}/>
                </div>
                <div className="col-md-4 card-container">
                  <Terminal username={this.state.username} containerName={this.state.containerName}/>
                </div>
              </div>
            </div>
          );
   } else {
    return (
      <div>
        Loading...
      </div>
    );
	}
}
}


module.exports = LinuxComputer;