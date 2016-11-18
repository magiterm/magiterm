const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const utils = require('../../utils/validationHelpers')

class Signup extends React.Component {
  constructor (props) {
    super (props);
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.changeFirstNameInput = this.changeFirstNameInput.bind(this);
    this.changeLastNameInput = this.changeLastNameInput.bind(this);
    this.changeEmailInput = this.changeEmailInput.bind(this);
    this.changeGithubInput = this.changeGithubInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        github: '',
        usernameExists: false,
        usernameValid: false,
        passwordValid: false,
        firstnameValid: false,
        lastnameValid: false,
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
  changePasswordInput(event) {
    this.setState({
      password: event.target.value
    });

    if (utils.isValidPassword(event.target.value)) {
      this.setState({
        passwordValid: true
      })
    } else {
      this.setState({
        passwordValid: false
      });
    }
  }

  changeFirstNameInput(event) {
    this.setState({
      firstname: event.target.value
    });


    if (utils.isValidName(event.target.value)) {
      this.setState({
        firstnameValid: true
      });
    } else {
      this.setState({
        firstnameValid: false
      });
    }
  }

  changeLastNameInput(event) {
    this.setState({
      lastname: event.target.value
    });

    if (utils.isValidName(event.target.value)) {
      this.setState({
        lastnameValid: true
      });
    } else {
      this.setState({
        lastnameValid: false
      });
    }
  }

  changeGithubInput(event) {
    this.setState({
      github: event.target.value
    });

    console.log(this.state.github);

    if (utils.isValidName(event.target.value)) {
      this.setState({
        githubValid: true
      });
    } else {
      this.setState({
        githubValid: false
      });
    }
  }

  changeEmailInput(event) {
    this.setState({
      email: event.target.value
    });

    if (utils.isValidEmail(event.target.value)) {
      this.setState({
        emailValid: true
      });
    } else {
      this.setState({
        emailValid: false
      });
    }
  }

  handleSubmit(e, user, pass, firstname, lastname, email, github) {
    const context = this;
    e.preventDefault();

    console.log('submitting', github);

    if (this.state.usernameValid && this.state.firstnameValid && this.state.githubValid && this.state.lastnameValid && this.state.emailValid && this.state.passwordValid) {
      axios.post('/auth/signup', {
         username: user,
         password: pass,
         firstname: firstname,
         lastname: lastname,
         email: email,
         githubHandle: github
       })
       .then(function (response) {
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
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password, this.state.firstname, this.state.lastname, this.state.email, this.state.github);
        }.bind(this)}>
          <div className="form-inputs">
            <input 
              onChange={this.changeUserNameInput}
              className="login-input"
              type='text' 
              placeholder='username'
              value={this.state.username}
              />
              {this.state.usernameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changePasswordInput}
              className="login-input"
              type='password' 
              placeholder='password'
              />
              {this.state.passwordValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeFirstNameInput}
              className="login-input"
              type='text' 
              placeholder='first name'
              />
              <span id="firstname"></span>
              {this.state.firstnameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeLastNameInput}
              className="login-input"
              type='text' 
              placeholder='last name'
              />
              <span id="lastname"></span>
              {this.state.lastnameValid ? <i className="glyphicon glyphicon-ok"></i> : null}
              <input 
                onChange={this.changeGithubInput}
                className="login-input"
                type='text' 
                placeholder='github'
                />
                <span id="github"></span>
                {this.state.githubValid ? <i className="glyphicon glyphicon-ok"></i> : null}
            <input 
              onChange={this.changeEmailInput}
              className="login-input"
              type='email' 
              placeholder='email'
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