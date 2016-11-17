const React = require('react');
const Stats = require('./Stats.jsx');
const Bio = require('./Bio.jsx');
const Collaborators = require('./Collaborators.jsx');
const UserInfo = require('./UserInfo.jsx');
const NavBar = require('./NavBar.jsx');
const axios = require('axios');


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const context = this;
    this.state = {
      username: '',
      containerName: '',
      firstName: '',
      lastName: '',
      email: '',
      createdAt: null,
      github: '',
      commandHistory: []
    }
  }

  componentWillMount() {
    var context = this;
    const token = localStorage['jwtToken'];
    //const history = JSON.parse(localStorage['0_commands']);
    const history = [];
    if (token) {
      axios.get('/decode', {
        params: {
          token: token
        }
      })
      .then (function(response) {
        const user = response.data;
        console.log('setting state!');
        context.setState({
          containerName: user.username,
          username: user.username
       });
        axios.get('/infodashboard', {
          params: {
            username: user.username
          }
        })
        .then(function(response){
          console.log(response);
          const user = response.data;
          context.setState({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
            commandHistory: history
          })
        })
      });
    }
  } 


  render() {
   if (this.state.lastName.length) {
      return (
         <div>
          <NavBar username={this.state.username} />
          <div className="dashboard-container">
            <div className="row">
              <div className="col-md-4 contain">
                <div className="card">
                </div>
              </div>
              <div className="col-md-4 contain">
                <div className="card">
                  <UserInfo username={this.state.username} email={this.state.email} github={this.state.github}/>
                </div>
              </div>
              <div className="col-md-4 contain">
                <div className="card">
                  <Bio firstName={this.state.firstName} lastName={this.state.lastName}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 contain">
                <div className="card">
                  <Collaborators curCollab="Hobo Jim" collabWith={["Mr. Cool", "Some Guy"]} username={this.state.username}/>
                </div>
              </div>
              <div className="col-md-4 contain">
                <div className="card">
                  <Stats commandHistory={this.state.commandHistory} username={this.state.username} email={this.state.email} github="somegithub"/>
                </div>
              </div> 
            </div>
           </div>
         </div>
       );
    } else {
     return (
       <div>
         Loading...
       </div>
     )
    }
  }
}

module.exports = Dashboard;