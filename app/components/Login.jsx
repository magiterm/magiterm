const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.hoverOver = this.hoverOver.bind(this);
    this.hoverOut = this.hoverOut.bind(this);
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.state = {
      hover: {
        textDecoration: 'none',
        color: 'white',
        username: '',
        password: ''
      }
    };
  }
  changeUserNameInput(event) {
    this.setState({
      username: event.target.value
    });
  }
  changePasswordInput(event) {
    this.setState({
      password: event.target.value
    });
  }
  hoverOver() {
    this.setState({
      hover: {
        textDecoration: 'underline', 
        color: 'black'
      }
    });
  }
  hoverOut() {
    this.setState({
      hover: {
        textDecoration: 'none',
        color: 'white'
      }
    });
  }

  handleSubmit(e, user, pass) {
    e.preventDefault();
    var context = this;
    axios.post('/auth/authenticate', {
      params: {
        username: user, 
        password: pass
      }
    })
    .then(function(response) {
      if (response) {
        localStorage['jwtToken'] = response.data.token;
        window.location = '/linuxcomputer'
      } else {
        alert("authentication failed");
      }
    });
  }

  render() {
    return (
			<div>
				<div>Login</div>
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password);
        }.bind(this)}>
					<input 
            onChange={this.changeUserNameInput}
            type='text' 
            placeholder='username'
            value={this.state.username}
            />
					<input 
            onChange={this.changePasswordInput}
            type='password' 
            placeholder='password'
            />
					<input type='submit'/>
				</form>
				<div 
				style={this.state.hover} 
				onMouseOver={this.hoverOver}
				onMouseOut={this.hoverOut} 
				onClick={this.props.GoToSignUp}>Need to signup?
				</div>
			</div>
		);
  }
}

module.exports = Login;