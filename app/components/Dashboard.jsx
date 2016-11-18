const React = require('react');
const Stats = require('./Stats.jsx');
const Bio = require('./Bio.jsx');
const Collaborators = require('./Collaborators.jsx');
const UserInfo = require('./UserInfo.jsx');
const NavBar = require('./NavBar.jsx');
const ProfilePicture = require('./ProfilePicture.jsx');
const axios = require('axios');


class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      containerName: '',
      firstName: '',
      lastName: '',
      email: '',
      createdAt: null,
      github: '',
      commandHistory: [],
      profilePictureUrl: '',
      bio: ''
    };
  }

  componentWillMount() {
    axios.get('/oAuth').then(response => {
      localStorage['user'] = response.data.username;
    });
    var context = this;
    const user = localStorage['user'];
    const history = JSON.parse(localStorage['0_commands']);
    axios.get('/oAuth')
    .then(function(response) {
      console.log('1111111111111111',response);
      const user = response.data;
      context.setState({
        containerName: user.username,
        username: user.username
      });
      axios.get('/infodashboard', {
        params: {
          username: user.username
        }
      })
      .then(function(response) {
        console.log('222222222222222222',response);
        const user = response.data;
        context.setState({
          bio:user.bio,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          commandHistory: history,
          profilePictureUrl: user.profilePicture,
          github: user.githubHandle,
          bio: user.bio
        });
      });
    })
  }
  render() {
   if (localStorage['user'] && localStorage['user'].length) {
      return (
         <div>
          <NavBar username={this.state.username} />
          <div className="dashboard-container">
            <div className="row">
              <div className="col-md-4 contain">
                <div className="card">
                  <ProfilePicture profilePicture={this.state.profilePictureUrl} username={this.state.username}/>
                </div>
              </div>
              <div className="col-md-4 contain">
                <div className="card">
                  <UserInfo username={this.state.username} email={this.state.email} github={this.state.github}/>
                </div>
              </div>
              <div className="col-md-4 contain">
                <div className="card">
                  <Bio username={this.state.username} bio={this.state.bio}/>
                {console.log('44444444444444444444444', this.state)}
                <div className="card">                                
                  <Bio firstName={this.state.firstName} lastName={this.state.lastName}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-7 contain">
                <div className="card">
                  <Collaborators curCollab="Hobo Jim" collabWith={["Mr. Cool", "Some Guy"]} username={this.state.username}/>
                </div>
              </div>
              <div className="col-md-5 contain">
                <div className="card">
                  <Stats containerName={this.state.username} commandHistory={this.state.commandHistory} username={this.state.username} email={this.state.email} github="somegithub"/>
                </div>
              </div> 
            </div>
           </div>
         </div>
        </div>
       );
    } else {
      return(
        <div>
          Loading...
        </div>
      )
    }
  }
}

module.exports = Dashboard;