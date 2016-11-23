const React = require('react');
const axios = require('axios');
const Tabs = require('react-simpletabs');

class Collaborators extends React.Component {
  constructor(props) {
    super(props);

    const context = this;
    this.socket = io();
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.state = {
      invUsername: '',
      username: this.props.username,
      pendingInvites: [],
      collaborators: [],
      collabWith: [],
      allRoles: {}
    };


    axios.post('/users/pendingInvites', {username: this.state.username})
    .then(function(res) {
      const pendingUsernames = res.data.map(function(pending) {
        return pending.requesterUsername;
      });
      context.setState({
        pendingInvites: pendingUsernames
      });
    });

    axios.post('/users/myCollaborators', {username: this.state.username})
    .then(function(res) {
      // const acceptedUsernames = res.data.map(function(accepted) {
      //   return accepted.recieverUsername;
      // });
      const acceptedUsernames = res.data;
      console.log('accepted users', acceptedUsernames);
      context.setState({
        collaborators: acceptedUsernames
      });
    });

    axios.post('/users/collaboratingWith', {username: this.state.username})
    .then(function(res) {
      const acceptedUsernames = res.data.map(function(accepted) {
        return accepted.requesterUsername;
      });
      context.setState({
        collabWith: acceptedUsernames
      });
    });

    axios.get('/users/roles')
    .then(function(res) {
      // console.log('rolesssssssssssssss', res.data);
      const allRoles = {};
      res.data.forEach(function(role) {
        allRoles[role.id] = role.name;
      });
      // console.log(allRoles);
      context.setState({
        allRoles: allRoles
      });
    });

    this.socket.on('/DASH/INVITE/' + this.props.username, function(invite) {
      context.setState({
        pendingInvites: context.state.pendingInvites.concat(invite.sender)
      });
    });

    this.socket.on('/DASH/INVITE/ACCEPT/' + this.props.username, function(invite) {
      console.log('/DASH/INVITE/ACCEPT/', invite);
      context.setState({
        collaborators: context.state.collaborators.concat({
          recieverUsername: invite.accepter,
          requesterUsername: invite.recipient,
          role: 1
        })
      });
    });

    this.socket.on('/DASH/REMOVE/COLLABORATOR/' + this.props.username, function(rejection) {
      var collabs = context.state.collaborators;
      collabs.splice(collabs.indexOf(rejection.remover, 1));
      context.setState({
        collaborators: collabs
      });
    });

    this.socket.on('/DASH/REMOVE/COLLABWITH/' + this.props.username, function(rejection) {
      var collabWith = context.state.collabWith;
      collabWith.splice(collabWith.indexOf(rejection.remover, 1));
      context.setState({
        collabWith: collabWith
      });
    });
  }

  changeUserNameInput(event) {
    this.setState({
      invUsername: event.target.value
    });
  }

  handleSubmit(e, user) {
    if(user.toUpperCase() === this.state.username.toUpperCase()) {
      e.preventDefault();
      alert('Sorry, but you cannot collaborate with yourself! Sad but true.');
      document.getElementById('inviteUsernameInput').value = '';
    }
    else {
      const context = this;
      e.preventDefault();
      document.getElementById('inviteUsernameInput').value = '';
      axios.post('/users/sendInvite', {usernameToInvite: user, username: context.state.username})
      .then(function(res) {
        if(res.data.fail) {
          alert(res.data.fail);
        } else if (res.data.success) {
          context.socket.emit('/DASH/INVITE/', {recipient: user, sender: context.state.username});
          alert(res.data.success);
        }
      })
      .catch(function(err) {
        alert('Username not found!');
      });
    }
  }

  handleAcceptCollab(username) {
    const context = this;
    axios.post('/users/acceptInvite', {invited: username, accepter: this.state.username})
    .then(function(res) {
      var pending = context.state.pendingInvites;
      pending.splice(pending.indexOf(username), 1);
      var collabs = context.state.collabWith;
      collabs.push(username);
      context.setState({
        pendingInvites: pending,
        collabWith: collabs
      });
      context.socket.emit('/DASH/INVITE/ACCEPT/', {recipient: username, accepter: context.state.username});
    });
  }

  handleRejectCollab(username) {
    const context = this;
    axios.post('/users/rejectInvite', {invited: username, rejecter: this.state.username})
    .then(function(res) {
      var pending = context.state.pendingInvites;
      pending.splice(pending.indexOf(username), 1);
      context.setState({
        pendingInvites: pending
      });
    });
  }

  handleRemoveCollabWith(username) {
    const context = this;
    axios.post('/users/removeCollabWith', {collaborator: username, remover: this.state.username})
    .then(function(res) {
      var collabWith = context.state.collabWith;
      collabWith.splice(collabWith.indexOf(username), 1);
      context.setState({
        collabWith: collabWith
      });
      context.socket.emit('/DASH/REMOVE/COLLABORATOR/', {recipient: username, remover: context.state.username});
    });
  }

  handleRemoveCollaborator(username) {
    const context = this;
    axios.post('/users/removeCollaborator', {collaborator: username, remover: this.state.username})
    .then(function(res) {
      var collaborators = context.state.collaborators;
      collaborators.splice(collaborators.indexOf(username), 1);
      context.setState({
        collaborators: collaborators
      });
      context.socket.emit('/DASH/REMOVE/COLLABWITH/', {recipient: username, remover: context.state.username});
    });
  }

  handleSelectRoleChange(event, username) {
    axios.post('/users/changeRole', {collaborator: username, host: this.state.username, newRole: event.target.value})
      .then(function(res) {
        console.log('changed role', res);
      });
  }

  render() {
    var context = this;
    console.log('render collab');
    return (
      <div className = "card-container">
        <div className="header">
          COLLABORATORS
        </div>
        <div className="information">
          <Tabs>
            <Tabs.Panel title='Collaborators'>
              <div className="row">
               <div className="col-md-4 col-md-offset-2 collab-card-top">
                 <div className="left">
                   <div className="title">
                      Your Collaboraters
                   </div>
                   <div>
                   {this.state.collabWith.length ? this.state.collabWith.map(function(accepted, i) {
                    return (
                      <div className="collaborators" key={i}>
                        {accepted}
                        <span onClick={() => { context.handleRemoveCollabWith(accepted)}} key={i}>
                          <i className="ion-trash-a"></i>
                        </span>
                      </div>);
                  }) : <div className="none"> None </div>}
                  </div>
                </div>
                </div>
                <div className="col-md-4 collab-card-top">
                  <div className="right">
                  <div className="title">
                    Collaborators on Your Computer
                  </div>
                  <div>
                  {this.state.collaborators.length ? this.state.collaborators.map(function(collaboration, i) {
                    console.log('collaboration', collaboration);
                    return (
                      <div className="collaborators" key={i}>
                        {collaboration.recieverUsername}
                        <select onChange={(e) => { context.handleSelectRoleChange(e, collaboration.recieverUsername); }}>
                          <option> {context.state.allRoles[collaboration.role]} </option>
                          { Object.keys(context.state.allRoles).map(function(key, i) {
                            if (key !== collaboration.role + '') {
                              return <option key={key} > {context.state.allRoles[key]} </option>;
                            }
                          })}
                        </select>
                        <span onClick={() => { context.handleRemoveCollaborator(collaboration.recieverUsername); }}>
                          <i className="ion-trash-a"></i>
                        </span>
                      </div>);
                  }) : <div className="none"> None </div>}
                  </div>
                  </div>
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel title='Invitations'>
              <div className="row">            
                 <div className="col-md-4 col-md-offset-2 collab-card-bottom">
                   <div className="left">
                     <div className="title">
                     Invite People to Collaborate
                     </div>
                     <div className="row">
                      <form  onSubmit={
                        function(e) {
                          this.handleSubmit(e, this.state.invUsername);
                        }.bind(this)}>
                        <div className="col-md-12">
                          <div className="form-inputs">
                            <input 
                            onChange={this.changeUserNameInput}
                            id="inviteUsernameInput"
                            type='text' 
                            placeholder='username'
                            className="invitation"
                            />
                            <input 
                              type='submit'
                              className='iSubmit'
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 collab-card-bottom">
                  <div className="right">
                    <div className="title">
                    Pending Invites
                    </div>
                    {
                      this.state.pendingInvites.length ? this.state.pendingInvites.map(function(pending) {
                      return (
                        <div className="collaborator">{pending} 
                        <span onClick={() => { context.handleAcceptCollab(pending); }}> Accept </span>
                        <span onClick={() => { context.handleRejectCollab(pending); }}> Reject </span>           
                        </div>
                        );
                      }) : 
                      <div className="none"> None </div>
                    }
                  </div>
                </div>
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    );
  }
}

module.exports = Collaborators;
          
