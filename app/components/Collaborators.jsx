const React = require('react');
const axios = require('axios');

class Collaborators extends React.Component {
  constructor(props) {
    super(props);

    const context = this;

    this.state = {
      invUsername: '',
      username: this.props.username,
      pendingInvites: []
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

  render() {
    return (
        <div>
          Currently Collaborating With:
          <div>(Users whose containers you can access)</div>
          Collaborators on Your Computer:
          <div>(Users who can access your container)</div>
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
            <list>
              {this.state.pendingInvites.map(function(pending) {
                return (
                    <ul>{pending}</ul>
                  );
              })}
            </list>
          </div>
        </div>
      );
  }
}

module.exports = Collaborators;