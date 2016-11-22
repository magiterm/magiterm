const React = require('react');
const ReactDOM = require('react-dom');
const Message = require('./Message.jsx')


class Messages extends React.Component {
	constructor(props) {
		super(props);
	}


	componentWillUpdate() {
		const node = this.getElementById("chatText");
		node.scrollTop = node.scrollHeight;
	}

	render() {
		return (
			<div className="chatText" id="chatText">
			{
				this.props.messages.map(message =>  <Message message={message} />)
			}
		</div>
		)
	}
}

module.exports = Messages;