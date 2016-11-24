const React = require('react');
const axios = require('axios');

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    var context = this;
    let obj;

    if (localStorage[window.location]) {
       obj = JSON.parse(localStorage[window.location]);      
    } else {
       obj = {};
    }

    this.state = {
      codeValue: '',
      containerName: this.props.containerName,
      username: this.props.username,
      fileName: obj.fileName || '',
      filePath: obj.filePath || '',
      codeSaved: true
    }
    this.recievedCEChange = this.recievedCEChange.bind(this);
    this.username = JSON.parse(localStorage['user']).username;
    this.handleFileRun = this.handleFileRun.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('CE GOT PROPS', nextProps);
    console.log(this.state);
    const context = this;
    this.socket.off('/TE/' + this.state.containerName);
    this.socket.off('/TE/JOIN/' + this.state.containerName);
    if(nextProps.containerName === this.state.containerName) {
      this.setState({
        fileName: this.state.fileName,
        filePath: this.state.filePath,
        codeValue: this.state.codeValue
      });
    } else {
      this.setState({
        containerName: nextProps.containerName,
        fileName: '',
        filePath: '',
        codeValue: ''
      });

      this.editor.getDoc().setValue('');
      this.socket.emit('/TE/JOIN/', {containerName: nextProps.containerName, username: this.username});
    }
    
    this.socket.on('/TE/' + nextProps.containerName, function(code) {
      context.recievedCEChange(code);
    });
    this.socket.on('/TE/JOIN/' + nextProps.containerName, function(code) {
      if(context.username !== code.username) {
        var code = document.getElementById('code-editor').value;
        context.socket.emit('/TE/', {join: true, code: code, username: context.username, containerName: nextProps.containerName, fileName: context.state.fileName, filePath: context.state.filePath});
      }
    });

  }

  recievedCEChange(code) {
    const fileName = code.fileName;
    const filePath = code.filePath;
    const codeValue = code.code;
    console.log('this is recievedCEChange', code);
    if(code.fileOpen) {
      this.setState({
        codeSaved: true
      });
    } else {
      this.setState({
        codeSaved: false
      });
    }
    if(code.fileOpen || code.username !== this.username) {
      this.setState({
        codeValue: codeValue,
        fileName: fileName,
        filePath: filePath
      });
      //Must place the cursor back where it was after replacing contents. Otherwise weird things happen.
      this.cursorPos = this.editor.doc.getCursor();
      this.editor.getDoc().setValue(code.code);
      this.editor.doc.setCursor(this.cursorPos);
    }
  }
  
  componentDidMount() {
    $(".code-editor-container").resizable({
      handleSelector: ".splitter",
      resizeHeight: false
    });
    const context = this;
    var codeEditor = document.getElementById("code-editor")
    var editor = CodeMirror.fromTextArea(codeEditor, {
      lineNumbers: true,
      theme: 'abcdef',
      styleActiveLine: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      indent: true,
    });

    editor.on('changes', function(editor, e){
      //context.cursorPos = context.editor.doc.getCursor();
      if(Date.now() - context.lastUpdate < 100) {
        return;
      }
      var code = editor.getValue();
      var textArea = document.getElementById("code-editor");
      textArea.value = code;
      //Need this to prevent an infinite loop. Calling .getDoc().setValue() triggers 'changes'
      if(context.state.codeValue !== code)
      {
        context.handleCodeChange();
      }
    });

    editor.on('cursorActivity', function(editor, e) {
      //context.cursorPos = context.editor.doc.getCursor();
    });

    this.editor = editor;
    this.lastUpdate = Date.now();
    this.socket.emit('/TE/JOIN/', {containerName: this.state.containerName, username: this.username});


  }

  componentWillMount() {
    this.socket = io();
    const context = this;

    this.socket.on('/TE/' + this.props.containerName, function(code) {
      console.log(code);
      context.recievedCEChange(code);
    });
  }

  handleFileRun() {
    const context = this;
    if(!this.state.fileName) {
      alert('Please select a file before attempting to run.');
    } else {
      // context.socket.emit('/TERM/SHOW/', {containerName: context.state.containerName});
      axios.post('/docker/executeFile', {code: document.getElementById('code-editor').value, containerName: this.state.containerName, fileName: this.state.fileName, filePath: this.state.filePath})
      .then(function(resp) {
        const exResponse = resp.data.res;
        console.log('this is the response', resp);
        var filePath = context.state.filePath.endsWith('/') ? context.state.filePath + context.state.fileName : context.state.filePath + '/' + context.state.fileName;
        context.socket.emit('/TERM/RES/', {cmd: resp.data.cmd + ' ' + filePath, res: exResponse, username: 'FILEBROWSER', containerName: context.state.containerName});
        context.setState({
          codeSaved: true
        });
      })
      .catch(function(err) {
        alert(err.response.data.msg);
      });
    }
  }

  handleOnKeyDown(e) {
    const context = this;
    if((e.ctrlKey && e.key === 'Enter') || (e.metaKey && e.key === 'Enter')) {
      this.handleFileRun();
    }

    if(!e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey) {
      this.setState({ codeSaved: false });
    }

    if((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
      e.preventDefault();
      console.log('save file');
      this.handleCodeSave(e);
    }

    if(e.key === 'Backspace') {
      if(document.getElementById('code-editor').value.length === 0) {
        this.handleCodeChange(true);
      }
    }
  }

  handleCodeChange(sendBlank) {
    var code = document.getElementById('code-editor').value;
    if(code !== '' || sendBlank) {
      this.socket.emit('/TE/', {code: code, username: this.username, containerName: this.state.containerName, fileName: this.state.fileName, filePath: this.state.filePath});
    }
    if (window.location !== '/linuxComputer') {
      this.handleCodeSaveIfVideo();
    }
  }

  handleCodeSaveIfVideo() {
    console.log('in handle code video save');
    const key = window.location;
    const code = document.getElementById('code-editor').value;
    window.localStorage.setItem(window.location, JSON.stringify({codeValue: code, fileName: this.state.fileName, filePath: this.state.filePath}));
  }

  handleCodeSave(e) {
    var context = this;
    var code = document.getElementById('code-editor').value;
    const fileName = this.state.fileName;
    console.log('filename is: ', fileName);
    const containerName = this.state.containerName;
    if(!fileName.length || !this.state.filePath.length) {
      alert('Must specify a filename first!');
      return;
    }
    axios.post('/docker/handleCodeSave', {
      codeValue: code,
      fileName: fileName,
      containerName: containerName,
      filePath: this.state.filePath
    })
    .then(function(response) {
      console.log('Successfully saved file', response);
      context.setState({ codeSaved: true })
    })
    .catch(function(err) {
      console.error(err);
    });
  }

   render() {
    if (this.state.fileName) {
      return (
        <div className="code-editor-container" onKeyDown={this.handleOnKeyDown.bind(this)}>
          <div className="code-editor-menu">
              <i className="ion-ios-play-outline" onClick={this.handleFileRun}></i>
          </div>
          <textarea id="code-editor" >{this.state.codeValue}</textarea>
          <span className={this.state.codeSaved ? "code-saved-indicator" : "code-modified-indicator"}>
            {this.state.codeSaved  ? "Saved" : "Modified"}
          </span>
          <span className="current-file">
            {this.state.filePath + '/' + this.state.fileName}
          </span>
        </div>
      )
    } else {
      return (
        <div className="code-editor-container" onKeyDown={this.handleOnKeyDown.bind(this)}>
          <div className="code-editor-menu">
              <i className="ion-ios-play-outline" onClick={this.handleFileRun}></i>
          </div>
          <textarea id="code-editor" >{this.state.codeValue}</textarea>
          <span className="current-file">
             <span> No File </span>
          </span> 
        </div>
      )
    }
 
  }
}

module.exports = CodeEditor;