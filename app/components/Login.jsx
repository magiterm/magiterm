const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');
const { Button } = require('react-bootstrap');


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.socket = io();
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.state = {
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
        username: '',
        password: ''
    };
  }
  componentWillMount() {
    // if (localStorage['user']) {
    //   axios.get('/oAuth')
    //   .then(function(response) {
    //     console.log(response);
    //     localStorage['user'] = response.data
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
    // }
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

  handleSubmit(e, user, pass) {
    const context = this;
    e.preventDefault();
    axios.post('/authenticate', {
      username: this.state.username,
      password: this.state.password
    })
    .then(function(response) {
      console.log('we have a response');
      if (response.data.username) {
        console.log('1srt storage', localStorage['user']);
        localStorage['user'] = JSON.stringify(response.data);
        window.location = 'dashboard';
      } else {  
        alert('Failed Login');
      }
    })
    .catch(function(err) {
      console.log(err);  
    });
  }

  render() {
    return (
  		<div>
  			<form onSubmit={this.handleSubmit}>
          <div className="form-inputs">
  					<input onChange={this.changeUserNameInput} className="login-input" type='text' placeholder='username'value={this.state.username}/><br/>
  					<input onChange={this.changePasswordInput} className="login-input" type='password' placeholder='password'/>
            <div className="submit">
             <button type="submit" className="btn btn-success">Login</button>
            </div>
          </div>
  			</form>
        <a href="/github"> 
          <Button>Login With Github</Button>
        </a>
        <div className="login-query-container">
  				<a className="login-query" onClick={this.props.GoToSignUp}> Need to signup?</a><br/>
        </div>
  		</div>
  	);
  }
}

module.exports = Login;