const React = require('react');
const ReactDOM = require('react-dom');

const Message = ({message}) => {
	return (
	<div className="message">
		{message}
	</div>
	)
}

module.exports = Message;