const React = require('react');
const jQueryTerminal = require('jquery.terminal');
const axios = require('axios');
const FileSaver = require('file-saver');
const FileHelpers = require('../../utils/FileHelpers.js');

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      command: null,
      prompt: '/picoShell >> ',
      containerName: this.props.containerName, // change this to refer to user name when login is done
      curCommand: null,
      curDir: '/picoShell',
      username: this.props.username,
      response: '',
      hidden: false,
      permissions: this.props.permissions
    }
    this.renderTerminal();
    this.recievedTermInput = this.recievedTermInput.bind(this);
    this.recievedTermResponse = this.recievedTermResponse.bind(this);
    this.recievedTermCD = this.recievedTermCD.bind(this);
    this.updateScroll();
	}

  componentWillReceiveProps(nextProps) {
    const context = this;
    this.socket.off('/TERM/' + this.state.containerName);
    this.socket.off('/TERM/RES/' + this.state.containerName);
    this.socket.off('/TERM/CD/' + this.state.containerName);
    this.setState({
      containerName: nextProps.containerName,
      hidden: nextProps.hidden,
      permissions: nextProps.permissions,
      curDir: nextProps.curDir
    })

    if(nextProps.containerName !== this.props.containerName) {
      this.terminal.clear();
      this.terminal.echo('Welcome to ' + (nextProps.containerName===context.state.username ? 'your computer.' : nextProps.containerName + '\'s computer.'));
    }
    this.socket.on('/TERM/' + nextProps.containerName, function(code) {
      context.recievedTermInput(code);
    });

    this.socket.on('/TERM/RES/' + nextProps.containerName, function(code) {
      context.recievedTermResponse(code);
    });

    this.socket.on('/TERM/CD/' + nextProps.containerName, function(path) {
      context.recievedTermCD(path);
    });
    this.renderTerminal();
    this.terminal.focus();
  }

  recievedTermInput(code) {
    if (code) {
      if(code.username !== this.state.username) {
        this.terminal.set_command(code.cmd, false);
        this.setState({
          curCommand: code.cmd
        });
      }
    }
  }

  recievedTermResponse(code) {
    //console.log('TR', code);
    console.log('this is code', code);
    if(code.username !== this.state.username) {
      console.log('in term response', code);
      this.terminal.echo(this.terminal.get_prompt() + code.cmd);
      this.terminal.echo(code.res);
      this.terminal.set_command('');
      this.setState({
        curCommand: ''
      });
    }
  }

  recievedTermCD(path) {
    if(path.username !== this.state.username) {
      console.log('REMOTE DIR', path.dir);
      this.setState({
        curDir: path.dir,
        prompt: path.dir + ' >> '
      });
      this.terminal.set_prompt(path.dir + ' >> ');
    }
  }

  componentWillMount() {
    this.socket = io();
    const context = this;

    if (localStorage[window.location]) {
       let obj = JSON.parse(localStorage[window.location]);
       const command = 'open ' + obj.fileName;
       axios.post('/docker/cmd', {cmd: command, containerName: context.state.containerName, curDir: context.state.curDir})
        .then(function(res) {
          context.socket.emit('/TE/', {filePath: obj.filePath, fileOpen:true, fileName: obj.fileName, code: res.data.termResponse,username: context.state.username, containerName: context.state.containerName});
        })
        .catch(function(err) {
          console.error(err);
        })
       
    }
    //The 1 will be replaced by container/user ID when we have sessions
    this.socket.on('/TERM/' + this.props.containerName, function(code) {
      context.recievedTermInput();
    });

    this.socket.on('/TERM/RES/' + this.props.containerName, function(code) {
      context.recievedTermResponse(code);
    });

    this.socket.on('/TERM/CD/' + this.props.containerName, function(path) {
      context.recievedTermCD();
    });

    this.socket.on('/CMD/' + this.props.containerName, function(res) {
      const term = context.terminal;
      const command = context.state.curCommand;

      if(typeof res === 'object') {
        console.log(res.newFile);
        if(res.fileOpen) {
          console.log(res);
          context.socket.emit('/TE/', {filePath: res.filePath, fileOpen: res.fileOpen, fileName: res.fileName, code: res.termResponse, username: context.state.username, containerName: context.state.containerName});
          context.socket.emit('/TERM/RES/', {cmd: command, res: '', username: context.state.username, containerName: context.state.containerName});
        } else if(res.pwd) {
          console.log('CD', res.pwd);
          if (res.pwd[res.pwd.length - 1] === '\n') res.pwd = res.pwd.slice(0, res.pwd.length - 1);
          context.setState({
            curDir: res.pwd,
            prompt: res.pwd + ' >> '
          });
          context.terminal.set_prompt(res.pwd + ' >> ');
          console.log('PROMPT', context.terminal.get_prompt());
          context.socket.emit('/TERM/CD/', {dir: res.pwd, username: context.state.username, containerName: context.state.containerName});
          context.socket.emit('/TERM/RES/', {cmd: command, res: res.res, username: context.state.username, containerName: context.state.containerName});
        } else if(res.newFile === true) {
          console.log('NEWFILE', res);
          context.socket.emit('/TE/', {filePath: res.filePath, fileOpen: res.newFile, fileName: res.fileName, containerName: context.state.containerName, username: context.state.username});
        } else {
          term.echo(String(JSON.stringify(res)));
          context.socket.emit('/TERM/RES/', {cmd: command, res: JSON.stringify(res), username: context.state.username, containerName: context.state.containerName});
        }
        context.terminal.set_command('', false);
        context.setState({
          curCommand: ''
        });
      } else {
        term.echo(String(res));

        context.socket.emit('/TERM/RES/', {cmd: command, res: res, username: context.state.username, containerName: context.state.containerName});
        context.terminal.set_command('', false);
        context.setState({
          curCommand: ''
        });
      }
    });
  }

  updateScroll() {
    const ele = document.getElementById("terminal-container");
   if (ele) {
     ele.scrollTop = ele.scrollHeight;
   }
  }

  renderTerminal() {
    var context = this;
    var prompt = this.state.prompt;
    var containerName = this.state.containerName;
    this.updateScroll();

    $(function($, undefined) {
      $('#terminal').terminal(function(command, term) {
        if (command !== '') {
          if(context.state.permissions === 'read') {
            term.echo('Sorry, you have no permission to run commands on this user\'s terminal.');
            return;
          }
          // context.setState({
          //   curCommand: command
          // })
          // context.socket.emit('/ANALYZE/', {command: command, containerName: context.state.containerName});
            axios.post('/docker/cmd', { cmd: command, containerName: context.state.containerName, curDir: context.state.curDir })
              .then(function(res) {
                if(typeof res.data === 'object') {
                  if(res.data.fileOpen) {
                    console.log(res.data);
                    var newCode = res.data.termResponse;
                    if(newCode.endsWith('\n')) newCode = newCode.slice(0, newCode.length - 1);
                    context.socket.emit('/TE/', {filePath: res.data.filePath, fileOpen: res.data.fileOpen, fileName: res.data.fileName, code: newCode, username: context.state.username, containerName: context.state.containerName});
                    context.socket.emit('/TERM/RES/', {cmd: command, res: '', username: context.state.username, containerName: context.state.containerName});
                  } else if(res.data.pwd) {
                    console.log('CD', res.data.pwd);
                    if (res.data.pwd[res.data.pwd.length - 1] === '\n') res.data.pwd = res.data.pwd.slice(0, res.data.pwd.length - 1);
                    context.setState({
                      curDir: res.data.pwd,
                      prompt: res.data.pwd + ' >> '
                    });
                    context.terminal.set_prompt(res.data.pwd + ' >> ');
                    console.log('PROMPT', context.terminal.get_prompt());
                    context.socket.emit('/TERM/CD/', {dir: res.data.pwd, username: context.state.username, containerName: context.state.containerName});
                    context.socket.emit('/TERM/RES/', {cmd: command, res: res.data.res, username: context.state.username, containerName: context.state.containerName});
                  } else if (res.data.download) {
                    var str2bytes = function(str) {
                      var bytes = new Uint8Array(str.length);
                      for (var i=0; i<str.length; i++) {
                        bytes[i] = str.charCodeAt(i);
                      }
                      return bytes;
                    }
                    var download = function(filename, text) {
                      text = text.replace(/\n/g, '');
                      var blob = new Blob(text.split(' ').map(function(txt) { return str2bytes(FileHelpers.hex2a(txt)); }), {type: "application/zip"});
                      FileSaver.saveAs(blob, filename);
                    }
                    console.log('downloading', res.data.fileContents, 'as', res.data.fileName);
                    console.log(res.data);
                    download(res.data.fileName, res.data.fileContents);
                  } else {
                    console.log('DATA', res.data);
                    term.echo(String(JSON.stringify(res.data)));
                    context.socket.emit('/TERM/RES/', {cmd: command, res: JSON.stringify(res.data), username: context.state.username, containerName: context.state.containerName});
                  }
                  context.terminal.set_command('', false);
                  context.setState({
                    curCommand: ''
                  });
                } else {
                  term.echo(String(res.data));
                  context.socket.emit('/TERM/RES/', {cmd: command, res: res.data, username: context.state.username, containerName: context.state.containerName});
                  context.terminal.set_command('', false);
                  context.setState({
                    curCommand: ''
                  });
                }
              })
              .catch(function(err) {
                console.error('RUN ERR', err);
                term.echo(String(err));
                context.socket.emit('/TERM/RES/', {cmd: command, res: err, username: context.state.username, containerName: context.state.containerName});
              });

              // var result = window.eval(command);
              context.updateScroll();
          }
      }, {
          greetings: 'Welcome to ' + (context.state.containerName===context.state.username ? 'your computer.' : context.state.containerName + '\'s computer.'),
          name: '',
          prompt: prompt,
          tabcompletion: true,
          completion: function(terminal, command, callback) {
            axios.post('/docker/cmd', { cmd: 'ls', containerName: context.state.containerName, curDir: context.state.curDir })
              .then(function(res) {
                const possibilities = (res.data.split('\n'));
                callback(possibilities);
              });
          },
          onInit: function(term) {
            context.terminal = term;
            context.updateScroll();
            var command = 'cd ' + context.state.curDir;
            term.set_prompt(context.state.curDir + ' >> ');
            // context.socket.emit('/ANALYZE/', {command: command, containerName: context.state.containerName});
            axios.post('/docker/cmd', { cmd: command, containerName: containerName, curDir: context.state.curDir })
              .then(function(res) {
                term.echo(String(res.data.res));
              })
              .catch(function(err) {
                console.error(err);
                term.echo(String(err));
              });
          },
          onCommandChange: function(command, term) {
            context.updateScroll();
            if(command !== context.state.curCommand) {
              context.socket.emit('/TERM/', {cmd: command, username: context.state.username, containerName: context.state.containerName});
              context.setState({
                curCommand: command
              });
            }
          },
          keydown: function(event, term) {
            context.updateScroll();
            if(event.key === 'Backspace') {
              setTimeout(function() {
                context.socket.emit('/TERM/', {cmd: term.get_command(), username: context.state.username, containerName: context.state.containerName});
              }, 10);
            }
          },
      });
    });
  }
  render() {
    if(!this.state.hidden) {
      return (
        <div>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery.terminal/0.11.13/css/jquery.terminal.min.css" rel="stylesheet"></link>
          <div className="terminal-container" id="terminal-container">
            <div id="terminal"></div><br/>
          </div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
        );
    }
	}

}

module.exports = Terminal;