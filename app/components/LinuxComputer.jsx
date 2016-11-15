
const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')
const axios = require('axios');


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
              <CodeEditor username={this.state.username} containerName={this.state.containerName}/>
              <Terminal username={this.state.username} containerName={this.state.containerName}/>
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