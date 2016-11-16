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
				<div>Login</div>
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password);
        }.bind(this)}>
          <div className="form-inputs">
  					<input 
              onChange={this.changeUserNameInput}
              type='text' 
              placeholder='username'
              value={this.state.username}
              /><br/>
  					<input 
              onChange={this.changePasswordInput}
              type='password' 
              placeholder='password'
              />
            <div className="submit">
             <button type="submit" className="btn btn-success">Submit</button>
            </div>
          </div>
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