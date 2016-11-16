const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
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

  handleSubmit(e, user, pass) {
    const context = this;
    e.preventDefault();
    axios.post('/authenticate', {
      username: user,
      password: pass
    })
    .then(function(response) {
      if (response.data.token) {
        localStorage['jwtToken'] = response.data.token;
        window.location = window.location + 'dashboard';
      } else {
        alert('Failed Login');
      }
    })
    .catch(function(err) {
      console.log(err);  
    });
  }

  render() {
    return (
			<div>
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password);
        }.bind(this)}>
          <div className="form-inputs">
  					<input 
              onChange={this.changeUserNameInput}
              className="login-input"
              type='text' 
              placeholder='username'
              value={this.state.username}
              /><br/>
  					<input 
              onChange={this.changePasswordInput}
              className="login-input"
              type='password' 
              placeholder='password'
              />
            <div className="submit">
             <button type="submit" className="btn btn-success">Login</button>
            </div>
          </div>
				</form>
        <div className="login-query-container">
  				<a href="#"
          className="login-query"
  				onClick={this.props.GoToSignUp}>
          Need to signup?
  				</a>
        </div>
			</div>
		);
  }
}

module.exports = Login;