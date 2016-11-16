const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class Signup extends React.Component {
  constructor (props) {
    super (props);
    this.hoverOver = this.hoverOver.bind(this);
    this.hoverOut = this.hoverOut.bind(this);
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      hover: {
        textDecoration: 'none',
        color: 'white',
        username: '',
        password: '',
        usernameExists: false
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
    console.log('submitting a new user', user);
    axios.post('/auth/signup', {
      username: user,
      password: pass
    })
    .then(function (response) {
      console.log(response, response.data);
      if (response.data === 'User already exists') {
        console.log('User already exists. Please choose a different username');
        context.setState({
          usernameExists : true
        });
      } else {
          context.setState({
            password: '',
            username: ''
          });
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
    })
    .catch(function (error) {
      console.log('Error: ', error);
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
             <button type="submit" className="btn btn-success">Sign Up</button>
            </div>
          </div>
        </form>
        <div className="login-query-container">
          <a href="#"
          className="login-query"
          onClick={this.props.GoToLogin}>
          Already have an Account?
          </a>
        </div>
			</div>
		);
  }
}

module.exports = Signup;	