const React = require('react');
const Stats = require('./Stats.jsx');
const Bio = require('./Bio.jsx');
const Collaborators = require('./Collaborators.jsx');
const UserInfo = require('./UserInfo.jsx');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!sessionStorage['username']) {
      window.location = '/';

      return(
        <div className="error"> 
          You are not logged in! Returning back to Login Page...
        </div>
      )
    } else {
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