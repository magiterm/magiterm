import { Router, Route, Link, browserHistory } from 'react-router';
const React = require('react');
const ReactDOM = require('react-dom');
const LinuxComputer = require('./LinuxComputer.jsx');
const SignUp = require('./Signup.jsx');
const Login = require('./Login.jsx');
const axios = require('axios');

let authenticate;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.GoToLogin = this.GoToLogin.bind(this);
    this.GoToSignUp = this.GoToSignUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      authenticate: 'login'
    };
  }
  handleSubmit(e, user, pass) {
    event.preventDefault();
    if (this.state.authenticate === 'login') {
      console.log('login', user, pass);
      axios.get('/user', {
        params: {
          username: user,
          password: pass
        }
      }).then(function(response) {
        console.log(response);
      }).catch(function(err) {
        console.log('err', err);
      });
    } else {
      axios.post('/user', {
        username: user,
        password: pass
      })
      .then(function (response) {
        console.log(response);
        console.log('signup', user, pass);
      })
      .catch(function (error) {
        console.log('error', error);
      });
    }
  }
  GoToLogin() {
    this.setState({
      authenticate: 'login'
    });
  }
  GoToSignUp() {
    this.setState({
      authenticate: 'signup'
    });
  }
  render() {
    this.state.authenticate === 'login' ? authenticate = <Login handleSubmit={this.handleSubmit} GoToSignUp={this.GoToSignUp}/> : authenticate = <SignUp handleSubmit={this.handleSubmit} GoToLogin={this.GoToLogin}/>;
    return (
      <div>        
        <div className="homepage-container">
          <div className="header">
            <div className="overlay">
              <div className="row">
                <div className="col-md-6">
                  <div className="logo-container">
                    <div className="title"> picoShell</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="logo-container">
                    <div className="login">
                     {authenticate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render((
  <Router>
    <Route path="/" component={App}></Route>
    <Route path="/linuxcomputer" component={LinuxComputer}></Route>
  </Router>
), document.getElementById('app'))