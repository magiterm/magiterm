const React = require('react');
const axios = require('axios');

class Collaborators extends React.Component {
  constructor(props) {
    super(props);

    const context = this;

    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.state = {
      invUsername: '',
      username: this.props.username,
      pendingInvites: [],
      collaborators: [],
      collabWith: []
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
      const acceptedUsernames = res.data.map(function(accepted) {
        return accepted.recieverUsername;
      });
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
  }

  changeUserNameInput(event) {
    this.setState({
      invUsername: event.target.value
    });
  }

  handleSubmit(e, user) {
    if(user.toUpperCase() === this.state.username.toUpperCase()) {
      alert('Sorry, but you cannot collaborate with yourself! Sad but true.');
    }
    else {
      const context = this;
      e.preventDefault();
      document.getElementById('inviteUsernameInput').value = '';
      axios.post('/sendInvite', {usernameToInvite: user, username: context.state.username})
      .then(function(res) {
        if(res.data.fail) {
          alert(res.data.fail);
        } else if (res.data.success) {
          alert(res.data.success);
        }
      })
      .catch(function(err) {
        alert('Username not found!');
      });
    }
  }

  handleAcceptCollab(username) {
    axios.post('/users/acceptInvite', {invited: username, accepter: this.state.username})
    .then(function(res) {
      console.log(res);
    });
  }

  handleRejectCollab(username) {
    //remove row from DB
  }

  render() {
    var context = this;
    return (
      <div className = "card-container">
        <div className="header">
          Collaborators
        </div>
        <div className="information">
          <div className="title">
            Currently Collaborating With
          </div>
          <div>
            {this.state.collabWith.length ? this.state.collabWith.map(function(accepted) {
              return (<div className="collaborators">{accepted}</div>)
            }) : <div className="none"> None </div>}
          </div>
          <div className="title">
            Collaborators on Your Computer
          </div>
          <div>
            {this.state.collaborators.length ? this.state.collaborators.map(function(accepted) {
              return (<div className="collaborators">{accepted}</div>)
            }) : <div className="none"> None </div>}
          </div>
          <div className="title">
          Invite a New Collaborator To Your Computer
          </div>
        <div className="row">
          <form onSubmit={
            function(e) {
              this.handleSubmit(e, this.state.invUsername)
            }.bind(this)}>
            <div className="form-inputs col-md-8">
              <input 
              onChange={this.changeUserNameInput}
              id="inviteUsernameInput"
              type='text' 
              placeholder='username'
              className="collaborators-input"
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-success">Send Invite</button>
            </div>
          </form>
        </div>
        <div>
          <div className="title">
          Pending Collaboration Invites
          </div>
          {
            this.state.pendingInvites.length ? this.state.pendingInvites.map(function(pending) {
            return (
              <div className="collaborator">{pending} 
              <span onClick={() => {context.handleAcceptCollab(pending)}}> Accept </span>
              <span onClick={() => {context.handleRejectCollab(pending)}}> Reject </span>           
              </div>
              );
          }) : 
            <div className="none"> None </div>
          }
        </div>
      </div>
    </div>
    );
  }
}

module.exports = Collaborators;