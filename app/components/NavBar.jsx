const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class NavBar extends React.Component {
	constructor (props) {
		super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
	}

componentWillRender() {
  if (!localStorage['user']) {
    var context = this;
    axios.get('/auth/oAuth')
    .then(function(response) {
      if (response.data.username) {
        localStorage['user'] = JSON.stringify(response.data);
        console.log('this is the state', this.state);
      } else {
        context.handleLogOut();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  }  
}

handleLogOut() {
	localStorage.removeItem('user');
  axios.get('/logout')
  .then(function(response) {
    console.log('logging them out');
    window.location = '/'; 
  })
  .catch(function(err) {
    console.log(err);
  });
}

	render() {
		return (
  			<div className = "navbar">
          <span className="logo"> <a href="/"><img src="/images/logo.svg"></img></a><a className="logo" href="/">picoShell</a></span>
    			<ul>
      			<li> <a className="logout" onClick={this.handleLogOut}> Log Out </a> </li>
      			<li> <a href="/linuxcomputer"> Computer </a> </li>
      			<li> <a href="/dashboard"> Dashboard </a> </li>
            <li> <a href="/video"> Videos </a> </li>
            <li className="username">{this.props.username}</li>
    			</ul>
  			</div>	
			)
	}
}




module.exports = NavBar;