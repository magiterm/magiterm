const React = require('react');
const ReactDOM = require('react-dom');
const ReactTooltip = require('react-tooltip');
const TimeAgo = require('react-timeago').default;

const Message = ({message, username, counter}) => {
  console.log(message.time);
	return (
	<div className={message.user===username ? "message own" : "message"} id={counter}>

    <div className="message-user"> {message.user===username ? "" : message.user} 
    <a data-tip data-for={"msg-tooltip-"+message.time} className="message-text"> {message.text} </a>
    </div>

    <ReactTooltip id={"msg-tooltip-"+message.time} place='top' type='dark' effect='solid'>
      <span className="message-time">
        <TimeAgo date={message.time}></TimeAgo>
      </span>
    </ReactTooltip>
    
	</div>
	)
}

module.exports = Message;