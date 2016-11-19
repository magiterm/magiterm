const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const utils = require('../../utils/validationHelpers');

class Signup extends React.Component {
  constructor (props) {
    super (props);
    
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeInput = this.changeInput.bind(this);

    this.state = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        github: '',
        usernameExists: false,
        usernameValid: false,
        passwordValid: false,
        firstNameValid: false,
        lastNameValid: false,
        githubValid: false,
        emailValid: false
    };
  }

  changeUserNameInput(event) {
    const context = this; 

    this.setState({
      username: event.target.value
    });

    utils.isValidUsername(event.target.value, function(err, res) {
      if (err) {
        console.error(err);
      } else {
        if (res === 'valid username') {
          context.setState({
            usernameValid: true,
            usernameExists: false
          });
        } else if (res === 'found user') {
          context.setState({
            usernameValid: false,
            usernameExists: true
          });
        } else {
          context.setState({
            usernameValid: false
          })
        }
      }
    });
  }

  changeInput(event) {
    const context = this;
    const type = event.target.dataset.type;
    const valid = type + 'Valid';
    const value = event.target.value;
    let func;

    this.setState({
      [type]: value
    });

    if (type === 'email') {
      console.log('type is email!');
      func = utils.isValidEmail;
    } else if (type === 'username') {
      func = utils.isValidUsername;
    } else if (type === 'password') {
      func = utils.isValidPassword;
    } else if (type === 'firstName' || type === 'lastName' || type === 'github') {
      func = utils.isValidName;
    }

    if (func(value)) {
      console.log(type, value);
      this.setState({
        [valid]: true
      });
    } else {
      console.log('is not a valid email!!!');
      this.setState({
        [valid]: false
      });
    }
  }

  handleSubmit(e) {
    const context = this;
    e.preventDefault();
    console.log('submitting', github);
    if (this.state.usernameValid && this.state.firstNameValid && this.state.githubValid && this.state.lastNameValid && this.state.emailValid && this.state.passwordValid) {
      var username = this.state.username;
      var password = this.state.password;
      axios.post('/auth/signup', {
         username: context.state.username,
         password: context.state.password,
         firstname: context.state.firstName,
         lastname: context.state.lastName,
         email: context.state.email,
         githubHandle: context.state.github
       })
       .then(function (response) {
         axios.post('/auth/authenticate', {
           username: username,
           password: password
         })
         .then(function(response) {
           if (response.data) {
             localStorage['user'] = JSON.stringify(response.data);
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
      <div className="signup-container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-inputs">
            <input 
              onChange={this.changeUserNameInput}
              className="login-input"
              type='text'
              placeholder='username'
              data-type='username'
              />
              <span id="username"></span>
              {this.state.usernameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeInput}
              className="login-input"
              type='password' 
              placeholder='password'
              data-type='password'
              />
              <span id="password"></span>
              {this.state.passwordValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeInput}
              className="login-input"
              type='text' 
              placeholder='first name'
              data-type='firstName'
              />
              <span id="firstname"></span>
              {this.state.firstNameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeInput}
              className="login-input"
              type='text' 
              placeholder='last name'
              data-type='lastName'
              />
              <span id="lastname"></span>
              {this.state.lastNameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
              <input 
                onChange={this.changeInput}
                className="login-input"
                type='text' 
                placeholder='github'
                data-type='github'
                />
                <span id="github"></span>
                {this.state.githubValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeInput}
              className="login-input"
              type='text' 
              placeholder='email'
              data-type='email'
              />
              <span id="email"></span>
              {this.state.emailValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <div className="submit">
             <button id="submit" type="submit" className="btn btn-success">Sign Up</button>
            </div>
          </div>
        </form>
        <div id="error">
        </div>
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