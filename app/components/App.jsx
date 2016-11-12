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
      authenticate: 'login'
    };
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
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}></Route>
    <Route path="/linuxcomputer" component={LinuxComputer}></Route>
    <Route path="/dashboard" component={Dashboard}></Route>
  </Router>
), document.getElementById('app'))