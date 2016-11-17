const React = require('react');
const ReactDOM = require('react-dom');

class NavBar extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			username: this.props.username
		};	
	}

  componentWillMount() {
    var name = localStorage['user']
    console.log('name', name)
    if (name === 'undefined') {
      this.handleLogOut();
      // window.location = '/';
    }
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
    			<li className="username">{name}</li>
  			</ul>
			</div>	
		)
	}
}




module.exports = NavBar;