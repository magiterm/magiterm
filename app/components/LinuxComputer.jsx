const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')


class LinuxComputer extends React.Component {
	constructor(props) {
		super(props);
    const context = this;
    this.state = {
      authorized: 'pending'
    };
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
    } else {
      this.setState({
        authorized: false
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
     );
   } else if (this.state.authorized === true) {
     return (
  			<div>
  				<CodeEditor />
  				<Terminal />
  			</div>
  		);
    }
	}
}


module.exports = LinuxComputer;