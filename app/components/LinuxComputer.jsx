const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')
const axios = require('axios');
const NavBar = require('./NavBar.jsx');
const Chatbox = require('./Chatbox.jsx');
const CheatSheet = require('./CheatSheet.jsx');
const FileBrowser = require('./FileBrowser.jsx');
const SplitPane = require('react-split-pane');
const Dropzone = require('./Dropzone.jsx');

class LinuxComputer extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      username: '',
      containerName: '',
      collabWith: [],
      toggle: "terminal-icon",
      permissions: '',
      curDir: '/picoShell'
    }

    this.selectChange = this.selectChange.bind(this);
  }


  componentWillMount() {
    var context = this;
    const user = JSON.parse(localStorage['user']);
    context.setState({
      containerName: user.username,
      username: user.username,
      collabWith: [],
      permissions: 'admin'
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

    this.socket.on('/TERM/SHOW/' + user.username, function(show) {
      console.log('SHOWING');
      context.setState({
        toggle: false
      });
    });

    this.socket.on('/TERM/CD/' + user.username, function(code) {
      if(code.dir === context.state.curDir) return;
      context.setState({
        curDir: code.dir
      });
    });

    this.socket.on('/DASH/UPDATE/COLLABROLE/' + user.username, function(roleUpdate) {
      console.log('received /DASH/UPDATE/COLLABROLE/', roleUpdate);
      context.setState({ permissions: roleUpdate.newRole})
    });

  }

  selectChange(event) {
    const context = this;
    this.socket.off('/TERM/SHOW/' + this.state.containerName);
    this.socket.off('/TERM/CD/' + this.state.containerName);
    if(event.target.value === this.state.username) {
      this.setState({ permissions: 'admin' })
    } else {
      axios.get('/users/role', 
        { params: { host: event.target.value, collaborator: this.state.username } })
        .then(function(res) {
          return axios.get('/users/roleById', { params: { id: res.data.role } } )
        })
        .then(function(role) {
          context.setState({ permissions: role.data.name });
        });    
    }

    axios.post('/docker/restart', {containerName: event.target.value})
    .then(function(resp) {
      console.log(resp);
    });

    this.setState({
      containerName: event.target.value,
      curDir: '/picoShell'
    });

    
    this.socket.on('/TERM/SHOW/' + event.target.value, function(show) {
      console.log('SHOWING1');
      context.setState({
        toggle: false
      });
    });

    this.socket.on('/TERM/CD/' + event.target.value, function(code) {
      console.log('LC CD', code);
      if(code.dir === context.state.curDir) return;
      context.setState({
        curDir: code.dir
      });
    });

  }

  handleToggle() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  handleMenuClick(e) {
    const value = e.target.id;
    this.setState({
      toggle: value
    });
  }

    render() {
      const context = this;
      console.log(this.state.toggle);
      if (this.state.containerName.length) {
           return (
            <div className="linux-computer-container">
              <NavBar username={this.state.username} />
              <div className="collaborator-bar">
                <div className="collaborators-select">
                  <i className="ion-ios-monitor-outline"></i>
                  <select id="thisSelect" className="form-control" onChange={this.selectChange}>
                    <optgroup label="Collaborators">
                    <option value={this.state.username}>{this.state.username}</option>
                    {
                      this.state.collabWith.map(function(user, i) {
                      return (
                          <option value={user} key={i}>{user}</option>  
                        );
                    })}
                    </optgroup>
                  </select>
                  <div className="role">{'|   ' + this.state.permissions}</div>
                </div>
              </div>

              <div className="row">
                <SplitPane split="vertical" defaultSize='50%'>
                  <CodeEditor username={this.state.username} 
                    containerName={this.state.containerName}
                    permissions={this.state.permissions} />
                    <div className="file-browser-container">
                      <div className="terminal-menu">
                       <i className="ion-ios-folder-outline" id="file-browser" onClick={this.handleMenuClick.bind(this)}></i>
                       <i className="ion-ios-monitor-outline" id="terminal-icon" onClick={this.handleMenuClick.bind(this)}></i>
                      </div>
                      <FileBrowser containerName={this.state.containerName} 
                        hidden={this.state.toggle === "terminal-icon" || this.state.toggle === "dropzone"}
                        permissions={this.state.permissions} 
                        curDir={this.state.curDir}/>
                      <Terminal username={this.state.username} containerName={this.state.containerName} 
                        hidden={this.state.toggle === "file-browser" || this.state.toggle === "dropzone"} permissions={this.state.permissions}
                        curDir={this.state.curDir}/>
                    </div>
                </SplitPane>
              </div>
                <Chatbox username={this.state.username} containerName={this.state.containerName}/>
                <CheatSheet />
              <footer></footer>
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