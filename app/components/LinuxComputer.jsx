
const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')
const axios = require('axios');
const NavBar = require('./NavBar.jsx');


class LinuxComputer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      containerName: ''
    }
  }


 componentWillMount() {
   var context = this;
   const token = localStorage['jwtToken'];

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
     });
   }
 } 

	render() {
    if (this.state.containerName.length) {
         return (
            <div>
              <NavBar username={this.state.username} />
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
    )
   }
	}
}


module.exports = LinuxComputer;