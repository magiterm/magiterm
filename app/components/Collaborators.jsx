const React = require('react');
const axios = require('axios');

class Collaborators extends React.Component {
  constructor(props) {
    super(props);

    const context = this;

    this.state = {
      invUsername: '',
      username: this.props.username,
      pendingInvites: [],
      collaborators: [],
      collabWith: []
    };

    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    axios.post('/pendingInvites', {username: this.state.username})
      .then(function(res) {
        const pendingUsernames = res.data.map(function(pending) {
          return pending.requesterUsername;
        });
        context.setState({
          pendingInvites: pendingUsernames
        });
      });
    axios.post('/myCollaborators', {username: this.state.username})
      .then(function(res) {
        const acceptedUsernames = res.data.map(function(accepted) {
          return accepted.requesterUsername;
        });
        context.setState({
          collaborators: acceptedUsernames
        });
      });
    axios.post('/collaboratingWith', {username: this.state.username})
      .then(function(res) {
        const acceptedUsernames = res.data.map(function(accepted) {
          return accepted.recieverUsername;
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
    axios.post('/acceptInvite', {invited: username, accepter: this.state.username})
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
        <div>
          Currently Collaborating With:
          <div>
            {this.state.collabWith.map(function(accepted) {
              return (
                  <div>{accepted}</div>
                );
            })}
          </div>
          Collaborators on Your Computer:
          <div>
            {this.state.collaborators.map(function(accepted) {
              return (
                  <div>{accepted}</div>
                );
            })}
          </div>
          Invite a New Collaborator To Your Computer:
          <div>
            <form onSubmit={function(e) {
              this.handleSubmit(e, this.state.invUsername)
            }.bind(this)}>
              <div className="form-inputs">
                <input 
                  onChange={this.changeUserNameInput}
                  id="inviteUsernameInput"
                  type='text' 
                  placeholder='username'
                  /><br/>
                <div className="submit">
                 <button type="submit" className="btn btn-success">Send Invite</button>
                </div>
              </div>
            </form>
          </div>
          <div>Pending Collaboration Invites:
              {this.state.pendingInvites.map(function(pending) {
                return (
                    <div>{pending} 
                      <span onClick={() => {context.handleAcceptCollab(pending)}}> Accept </span>
                      <span onClick={() => {context.handleRejectCollab(pending)}}> Reject </span>           
                    </div>
                  );
              })}
          </div>
        </div>
      );
  }
}

module.exports = Collaborators;