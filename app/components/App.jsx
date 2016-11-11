import { Router, Route, Link, browserHistory } from 'react-router'
const React = require('react');
const ReactDOM = require('react-dom');
const LinuxComputer = require('./LinuxComputer.jsx');
const SignUp = require('./Signup.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="homepage-container">
          <div className="header">
            <div className="overlay">
              <div className="row">
                <div className="col-md-6">
                  <div className="logo-container">
                    <div className="title"> picoShell </div>
                  </div>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render((
  <Router>
    <Route path="/" component={App}></Route>
    <Route path="/linuxcomputer" component={LinuxComputer}></Route>
  </Router>
), document.getElementById('app'))