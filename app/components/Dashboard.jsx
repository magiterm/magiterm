const React = require('react');
const Stats = require('./Stats.jsx');
const Bio = require('./Bio.jsx');
const Collaborators = require('./Collaborators.jsx');
const UserInfo = require('./UserInfo.jsx');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const context = this;
    this.state = {
      authorized: 'pending'
    }
    this.socket = io();
    if(sessionStorage['token']) {
      this.setState({
        authorized: 'pending'
      });
      console.log('TOKEN', sessionStorage['token']);
      this.socket.emit('/userDecrypt', {encrypted: sessionStorage['token']});
      this.socket.on('/auth/' + sessionStorage['token'], function(response) {
        console.log('AUTH', response);
        context.setState({
          authorized: response
        });
      });
    }
  }

  render() {
    if (this.state.authorized === 'pending') {
      return (
          <div>
            Authorizing user...
          </div>
        );
    } else if (this.state.authorized === false) {
      window.location = '/';

      return(
        <div className="error"> 
          You are not logged in! Returning back to Login Page...
        </div>
      )
    } else if (this.state.authorized === true) {
      return (
          <div>
            Dashboard!
            <Stats username="username" email="email@email.com" github="somegithub"/>
            <Bio bioInfo="Bio Info!"/>
            <Collaborators curCollab="Hobo Jim" collabWith={["Mr. Cool", "Some Guy"]}/>
            <UserInfo />
          </div>
        );
    }
  }
}

module.exports = Dashboard;