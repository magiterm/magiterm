const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const utils = require('../../utils/validationHelpers')

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
      axios.post('/auth/signup', {
         username: this.state.username,
         password: this.state.password,
         firstname: this.state.firstName,
         lastname: this.state.lastName,
         email: this.state.email,
         githubHandle: this.state.github
       })
       .then(function (response) {
         axios.post('/authenticate', {
           username: this.state.username,
           password: this.state.password
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
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-inputs">
            <input 
              onChange={this.changeUserNameInput}
              className="login-input"
              type='text'
              placeholder='username'
              data-type='username'
              />
              {this.state.usernameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeInput}
              className="login-input"
              type='password' 
              placeholder='password'
              data-type='password'
              />
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
             <button type="submit" className="btn btn-success">Sign Up</button>
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