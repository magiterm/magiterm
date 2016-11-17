const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class Signup extends React.Component {
  constructor (props) {
    super (props);
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.changeFirstNameInput = this.changeFirstNameInput.bind(this);
    this.changeLastNameInput = this.changeLastNameInput.bind(this);
    this.changeEmailInput = this.changeEmailInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        usernameExists: false
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

  changeFirstNameInput(event) {
    this.setState({
      firstname: event.target.value
    });
  }

  changeLastNameInput(event) {
    this.setState({
      lastname: event.target.value
    })
  }

  changeEmailInput(event) {
    this.setState({
      email: event.target.value
    })
  }

  handleSubmit(e, user, pass, firstname, lastname, email) {
    const context = this;
    e.preventDefault();
    if (this.state.usernameValid && this.state.firstnameValid && this.state.lastnameValid && this.state.emailValid && this.state.passwordValid) {
      axios.post('/auth/signup', {
         username: user,
         password: pass,
         firstname: firstname,
         lastname: lastname,
         email: email
       })
       .then(function (response) {
         axios.post('/authenticate', {
           username: user,
           password: pass
         })
         .then(function(response) {
            if (response.data.username) {
              localStorage['user'] = response.data.username;
              window.location = window.location + 'dashboard';
            } else {
              alert('Failed Login');
            }
          })
          .catch(function(err) {
            console.log(err);  
          });
       })
       .catch(function (error) {
         console.log('Error: ', error);
       });
    } else {
        ReactDOM.render(
          <div> Please make sure all entries are valid</div>,
          document.getElementById('error')
        );
    }
  }
  render() {
    return (
			<div>
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password, this.state.firstname, this.state.lastname, this.state.email);
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
            <input 
              onChange={this.changeFirstNameInput}
              className="login-input"
              type='text' 
              placeholder='first name'
              />
            <input 
              onChange={this.changeLastNameInput}
              className="login-input"
              type='text' 
              placeholder='last name'
              />
            <input 
              onChange={this.changeEmailInput}
              className="login-input"
              type='first name' 
              placeholder='email'
              />
            <div className="submit">
             <button type="submit" className="btn btn-success">Sign Up</button>
            </div>
          </div>
        </form>
        {this.state.usernameExists ? <div> Username exists. Please choose a different username. </div> : null}
        <div className="login-query-container">
          <a
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