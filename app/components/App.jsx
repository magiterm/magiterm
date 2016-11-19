import { Router, Route, Link, browserHistory } from 'react-router';
const React = require('react');
const ReactDOM = require('react-dom');
const LinuxComputer = require('./LinuxComputer.jsx');
const SignUp = require('./SignUp.jsx');
const Login = require('./Login.jsx');
const Dashboard = require('./Dashboard.jsx');
const NavBar = require('./NavBar.jsx');
const axios = require('axios');

let authenticate;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.GoToLogin = this.GoToLogin.bind(this);
    this.GoToSignUp = this.GoToSignUp.bind(this);
    this.state = {
      authenticate: 'login',
      authenticated: false,
      username: '',
      containerName: '',
      render: false
    };
  }

  componentWillMount() {
    const context = this;
    axios.get('/auth/oAuth', {
    })
    .then(function(response) {
      if (response.data) {
        var myUser = response.data;
        localStorage['user'] = JSON.stringify(myUser);
        if (myUser) {
          context.setState({
            authenticated: true,
            username: myUser.username,
            containerName: myUser.containerName,
          });
          console.log('state in app', context.state);
        }
      }
    })
    .catch(function(err) {
      console.log('no user');
      console.log(err);
    });
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
    if (!this.state.authenticated) {

      this.state.authenticate === 'login' ? authenticate = <Login GoToSignUp={this.GoToSignUp}/> : authenticate = <SignUp GoToLogin={this.GoToLogin}/>;
      return (
        <div>        
          <div className="homepage-container">
            <div className="logo">
              <a href="/"><img src="/images/logo.svg"></img></a>
              <a href="/">picoShell</a>
            </div>
            <div className="header">
                    <div className="subtitle">
                      Coding Made Simple
                    </div>
                    <div className="subsubtitle">
                      Sign Up Today to Simplify the Programming Process
                    </div>
                    <div className="logo-container">
                      <img src="/images/logo.svg"></img>
                    </div>
            </div>
                <div className="login-container">
                  <div className="login-header">
                    <div className="login">
                      Reinvent Programming Today
                    </div>
                  </div>
                  <div className="login-box">
                    <div className="login">
                     {authenticate}
                </div>
             </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>        
          <div className="homepage-container">
          <div>
            <NavBar username={this.state.username}/>
            <div className="header">
              <div className="overlay">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="logo-container">
                      <div className="title"> picoShell</div>
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
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/linuxcomputer" component = {LinuxComputer} ></Route>
    <Route path="/dashboard" component={Dashboard} ></Route>
  </Router>
), document.getElementById('app'))