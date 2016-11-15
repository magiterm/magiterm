const React = require('react');
const ReactDOM = require('react-dom');
const CodeEditor = require('./CodeEditor.jsx')
const Terminal = require('./Terminal.jsx')


class LinuxComputer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

     return (
  			<div>
  				<CodeEditor />
  				<Terminal />
  			</div>
  		);
	}
}


module.exports = LinuxComputer;