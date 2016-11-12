const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class Signup extends React.Component {
  constructor (props) {
    super (props);
    this.hoverOver = this.hoverOver.bind(this);
    this.hoverOut = this.hoverOut.bind(this);
    this.changeUserNameInput = this.changeUserNameInput.bind(this);
    this.changePasswordInput = this.changePasswordInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      hover: {
        textDecoration: 'none',
        color: 'white',
        username: '',
        password: ''
      }
    };
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
  hoverOver() {
    this.setState({
      hover: {
        textDecoration: 'underline', 
        color: 'black'
      }
    });
  }
  hoverOut() {
    this.setState({
      hover: {
        textDecoration: 'none',
        color: 'white'
      }
    });
  }

  handleSubmit(e, user, pass) {
    const context = this;
    e.preventDefault();
    console.log('submitting a new user', user);
    axios.post('/signup', {
      username: user,
      password: pass
    })
    .then(function (response) {
      console.log(response.data);
      if (response.data === 'User already exists') {
        console.log('User already exists. Please choose a different username');
      }
      context.setState({
        password: '',
        username: ''
      });
    })
    .catch(function (error) {
      console.log('Error: ', error);
    });
  }

  render() {
    return (
			<div>
				<div>Signup</div>
				<form onSubmit={function(e) {
          this.handleSubmit(e, this.state.username, this.state.password);
        }.bind(this)}>
					<input 
            onChange={this.changeUserNameInput}
            type='text' 
            placeholder='username'
            value={this.state.username}
            />
          <input 
            onChange={this.changePasswordInput}
            type='text' 
            placeholder='password'
            value={this.state.password}
            />					
          <input type='submit'/>
        </form>
				<div 
					style={this.state.hover} 
					onMouseOver={this.hoverOver}
					onMouseOut={this.hoverOut} 
					onClick={this.props.GoToLogin}
					>
					Already have an account?</div>
			</div>
		);
  }
}

module.exports = Signup;	