const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class NavBar extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			username: this.props.username,
      name: ''
		};	
    // this.handleLogOut = this.handleLogOut.bind(this);
	}
  componentWillMount() {
    var context = this;
      axios.get('/oAuth')
      .then(function(response) {
        if (response.data.username) {
          console.log('navbarrrrrrrrrr', response);
          context.setState({
            name: response.data.username
          });
        } else {
          context.handleLogOut();
        }
      })
        .catch(function(err) {
          console.log(err);
        });
  }
  handleLogOut() {
   localStorage.removeItem('user');
   location.reload(); 
  }
	render() {
		return (
			<div className = "navbar">
  			<ul>
    			<li> <a className="logout" onClick={this.handleLogOut.bind(this)}> Log Out </a> </li>
    			<li> <a href="/"> Home </a> </li>
    			<li> <a href="/linuxcomputer"> Computer </a> </li>
    			<li> <a href="/dashboard"> Dashboard </a> </li>
    			<li className="username">{this.state.name}</li>
  			</ul>
			</div>	
		);
	}
}




module.exports = NavBar;