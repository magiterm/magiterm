const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')


class LinuxComputer extends React.Component {
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
  	}	else {return (
  			<div>
  				<CodeEditor />
  				<Terminal />
  			</div>
  		)
    }
	}
}


module.exports = LinuxComputer;