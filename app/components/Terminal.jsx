const React = require('react');
const jQueryTerminal = require('jquery.terminal');
const axios = require('axios');

class Terminal extends React.Component {
	constructor(props) {
		super(props);
    var context = this;
		this.state = {
			command: null,
      prompt: null,
      containerName: 'juice', // change this to refer to user name when login is done
      curCommand: null
		}
    this.username = sessionStorage['token'];
    this.renderTerminal();
	}

  componentWillMount() {
    this.socket = io();
    const context = this;

    //The 1 will be replaced by container/user ID when we have sessions
    this.socket.on('/TERM/1', function(code) {
      //For some reason code.username keeps resetting itself to 'a'. Not sure why...
      if(code.username !== context.username && code.cmd !== '' && code.username !== 'a') {
        console.log('code.username', code.username);
        console.log('context.username', context.username);
        console.log('SETTING CMD', code.cmd);
        context.terminal.set_command(code.cmd, false);
        context.setState({
          curCommand: code.cmd
        });
      }
    });

    this.socket.on('/TERM/RES/1', function(code) {
      if(code.username !== context.username) {
        context.terminal.echo(context.terminal.get_prompt() + context.terminal.get_command());
        context.terminal.echo(code.res);
        context.terminal.set_command('');
        context.setState({
          curCommand: ''
        });
      }
    });
  }

  renderTerminal() {
    // console.log($);
    // console.log($.terminal);
    var context = this;
    var prompt = this.state.prompt ? this.state.prompt + '>> ' : '>> ';
    var containerName = this.state.containerName;

    $(function($, undefined) {
      $('#terminal').terminal(function(command, term) {
        console.log('command', command);
        if (command !== '') {

          axios.post('/cmd', { cmd: command, containerName: containerName })
            .then(function(res) {
              console.log(res);
              console.log(res.data);
              if(typeof res.data === 'object') {
                if(res.data.fileOpen) {
                  context.socket.emit('/TE/1', {code: res.data.termResponse, username: 'TERMINAL'});
                } else {
                  term.echo(String(JSON.stringify(res.data)));
                  context.socket.emit('/TERM/RES/1', {res: JSON.stringify(res.data), username: context.username});
                }
                context.terminal.set_command('');
                context.setState({
                  curCommand: ''
                });
              } else {
                term.echo(String(res.data));
                context.socket.emit('/TERM/RES/1', {res: res.data, username: context.username});
                context.terminal.set_command('');
                context.setState({
                  curCommand: ''
                });
              }
            })
            .catch(function(err) {
              console.error(err);
              term.echo(String(err));
              context.socket.emit('/TERM/RES/1', {res: err, username: context.username});
            });

            // var result = window.eval(command);
        }
      }, {
          greetings: '',
          name: '',
          height: 500,
          width: 650,
          prompt: prompt,
          onInit: function(term) {
            context.terminal = term;
            console.log('started terminal');
            var command = 'cd /picoShell';
            axios.post('/cmd', { cmd: command, containerName: containerName })
              .then(function(res) {
                console.log(res);
                term.echo(String(res.data));
              })
              .catch(function(err) {
                console.error(err);
                term.echo(String(err));
              });
          },
          onCommandChange: function(command, term) {
            if(command !== context.state.curCommand) {
              context.socket.emit('/TERM/1', {cmd: command, username: context.username});
              context.setState({
                curCommand: command
              });
            }
          }
      });
    });
  }

	render() {
		return (
      <div>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery.terminal/0.11.13/css/jquery.terminal.min.css" rel="stylesheet"></link>
        <div id="terminal"></div><br/>
			</div>
		)
	}
}

module.exports = Terminal;