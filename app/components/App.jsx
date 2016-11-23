import { Router, Route, Link, browserHistory } from 'react-router';
const React = require('react');
const ReactDOM = require('react-dom');
const LinuxComputer = require('./LinuxComputer.jsx');
const SignUp = require('./SignUp.jsx');
const Login = require('./Login.jsx');
const Dashboard = require('./Dashboard.jsx');
const NavBar = require('./NavBar.jsx');
const axios = require('axios');
const Modal = require('react-modal');
const customStyles = {

  content : {
    right                 : 'auto',
    bottom                : 'auto',
    marginLeft          : '26%',
    marginTop: 200,
    height: 300,
    width: 600,
    backgroundColor:'rgba(72,72,72,0.55)',
    alignItems: 'center',
    justifyContent: 'center'
  },
};
 
let authenticate;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.GoToLogin = this.GoToLogin.bind(this);
    this.GoToSignUp = this.GoToSignUp.bind(this);
    this.OpenModal = this.OpenModal.bind(this);
    this.SendEmail = this.SendEmail.bind(this);
    this.CloseModal = this.CloseModal.bind(this);
    this.changeEmailInput = this.changeEmailInput.bind(this);
    this.state = {
      authenticate: 'login',
      authenticated: false,
      username: '',
      containerName: '',
      render: false,
      modalIsOpen: false,
      email: '',
      successMessage: 'displayNone',
      failureMessage: 'displayNone'
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
  OpenModal() {
    this.setState({
      modalIsOpen: true
    });
  }
  CloseModal() {
    this.setState({
      modalIsOpen: false
    });
  }
  SendEmail(e) {
    e.preventDefault();
    var context = this;
    context.setState({
      diplayMessage: 'displayNone',
      failureMessage: 'displayNone'
    });
    var email = this.state.email;
    console.log('emial', this.state.email, 'nonstate', email, this.state);
    axios.post('/email', {
      email: email
    })
    .then(function(response) {
      if (response.data.id) {
        context.setState({
          email: '',
          successMessage: 'displaySuccess'
        });
      } else {
        context.setState({
          email: '',
          failureMessage: 'displayFailure'
        });
      }
      
      console.log(response);
    })
    .catch(function(err) {
      context.setState({
          email: '',
          displayNone: 'displayFailure'
        });
      console.log(err);
    });
  }
  changeEmailInput(e) {
    this.setState({email: e.target.value});
  }
  render() {
    if (!this.state.authenticated) {

      this.state.authenticate === 'login' ? authenticate = <Login OpenModal={this.OpenModal} GoToSignUp={this.GoToSignUp}/> : authenticate = <SignUp OpenModal={this.OpenModal} GoToLogin={this.GoToLogin}/>;
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
                <Modal
                  isOpen={this.state.modalIsOpen}
                  style={customStyles}
                  contentLabel="Example Modal"
                  >  
                  <div className='modalDiv'>
                    <form className='modalDiv' onSubmit={this.SendEmail}>
                      <div style={{color: 'white', fontSize: 20}}>Enter Your Email to Reset your Password</div>
                      <input style={{width: 400, marginTop: 15, marginBottom: 15}} onChange={this.changeEmailInput} className="login-input" placeholder='Email' value={this.state.email}/>
                      <div className="submit">
                       <button type="submit" className="btn">Submit</button>
                      </div>
                    </form>
                    <button style={{marginTop: 15, marginBottom: 15}} className="btn" onClick={this.CloseModal}>Close Modal</button>
                    <div className={this.state.successMessage}>Your password was sent to your email!</div>
                    <div className={this.state.failureMessage}>Failed to send, please check your email and try again</div>
                  </div>
                </Modal> 
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
        <div className="homepage-container">
          <div className="header">
            <NavBar username={this.state.username}/>
            <div className="subtitle">
              Coding Made Simple
            </div>
            <div className="subsubtitle">
              Sign Up Today to Simplify the Programming Process
            </div>
            <div className="logo-container">
              <img src="/images/logo.svg"></img>
            </div>
            <div className="header">
              <div className="overlay">
                <div className="row">
                  <div className="col-xs-12">
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