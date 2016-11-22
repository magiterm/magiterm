const React = require('react');
const ReactDOM = require('react-dom');
const Message = require('./Message.jsx')


const Messages = ({messages}) => {
	console.log('these are the messages: ', messages);
	return (
		<div className="chatText" id="chatText">
		{
			messages.map(message =>  <Message message={message} />)
		}
	</div>)
}

module.exports = Messages;