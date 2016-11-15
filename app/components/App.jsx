import { Router, Route, Link, browserHistory } from 'react-router';
const React = require('react');
const ReactDOM = require('react-dom');
const LinuxComputer = require('./LinuxComputer.jsx');
const SignUp = require('./Signup.jsx');
const Login = require('./Login.jsx');
const Dashboard = require('./Dashboard.jsx');
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
      username: ''
    };
  }

  componentDidMount() {
    const token = localStorage['jwtToken'];
    const context = this;

    if (token) {
      axios.get('/auth/decode', {
        params: {
          token: token
        }
      })
      .then (function(response) {
        const user = response.data;

        context.setState({
         authenticated: true,
         username: user.username  
       });
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

  handleLogOut() {
    localStorage.removeItem('jwtToken');
    location.reload();
  }

  render() {
    if (!this.state.authenticated) {
      this.state.authenticate === 'login' ? authenticate = <Login GoToSignUp={this.GoToSignUp}/> : authenticate = <SignUp GoToLogin={this.GoToLogin}/>;
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
                  <Link to={`/linuxcomputer`} >
                    <div>
                      Linux Computer
                    </div>
                  </Link>
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
                      Welcome to picoShell {this.state.username}
                    </div>
                  </div>
                  <Link to={`/linuxcomputer`} >
                    <div>
                      Linux Computer
                    </div>
                  </Link>
                  <div>
                    <button onClick = {this.handleLogOut.bind(this)}> Logout </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

function requireAuth(nextState, replace) {
  const token = localStorage['jwtToken'];

  if (token) {
    axios.get('/auth/decode', {
      params: {
        token: token
      }
    })
    .then(function(response) {
      if (!response) {
        replace('/');
      } 
    })
    .catch(function(err) {
      console.log(err)
    })
  } else {
    window.location = '/';
  }
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/linuxcomputer" component = {LinuxComputer} onEnter={requireAuth}></Route>
    <Route path="/dashboard" component={Dashboard} onEnter={requireAuth}></Route>
  </Router>
), document.getElementById('app'))