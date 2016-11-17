const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const { Button } = require('react-bootstrap');


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.handleGitSubmit = this.handleGitSubmit.bind(this);
    this.state = {
      hover: {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
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

  handleGitSubmit(e) {
    window.location = 'github';
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
        window.location = 'dashboard';
      } else {
        alert('Failed Login');
      }
    })
    .catch(function(err) {
      console.log(err);  
    });
  }

  render() {
    var signIn = {
      height: 360,
      width: 220,
      backgroundColor: 'white',
      opacity: .8,
      boxShadow: '0px 0px 10px #888888'
    };
    var flex = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    };
    var divHeader = {
      backgroundColor: '',
      flex: 1,
    };
    var github = {
      background: 'https://octicons.github.com/img/og/mark-github.png'
    }
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
        <a href="/github"> 
          <button className="btn btn-success">Login With Github</button>
         </a>
        <div className="login-query-container">
  				<a
          className="login-query"
  				onClick={this.props.GoToSignUp}>
          Need to signup?
  				</a> <br/>
        </div>
			</div>
		);
  }
}

module.exports = Login;