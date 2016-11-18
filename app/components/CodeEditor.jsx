const React = require('react');
const axios = require('axios');
// const CodeMirror = require('react-codemirror');
// import '../../node_modules/codemirror/mode/javascript/javascript';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    var context = this;
    this.state = {
      codeValue: '',
      containerName: this.props.containerName,
      username: this.props.username,
      fileName: '',
      fileNamePath: ''
    }
    this.recievedCEChange = this.recievedCEChange.bind(this);
    this.username = localStorage['user'];
  }

  componentWillReceiveProps(nextProps) {
    const context = this;
    this.socket.off('/TE/' + this.state.containerName);
    this.setState({
      containerName: nextProps.containerName
    })
    this.socket.on('/TE/' + nextProps.containerName, function(code) {
      context.recievedCEChange(code);
    });
  }

  recievedCEChange(code) {
    const fileName = code.fileName;
    const filePath = code.filePath;
    const codeValue = code.code;
    if(code.fileOpen) {
      this.setState({
        fileName: fileName,
        filePath: filePath
      });
    }
    if(code.username !== this.username) {
      this.setState({
        codeValue: codeValue
      });
      //Must place the cursor back where it was after replacing contents. Otherwise weird things happen.
      this.cursorPos = this.editor.doc.getCursor();
      this.editor.getDoc().setValue(code.code);
      this.editor.doc.setCursor(this.cursorPos);
    }
  }
  
  componentDidMount() {
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
  }

  componentWillMount() {
    this.socket = io();
    const context = this;

    //The 1 will be replaced by container/user ID when we have sessions
    this.socket.on('/TE/' + this.props.containerName, function(code) {
      recievedCEChange(code);
    });
  }


  handleCodeChange() {
      var code = document.getElementById('code-editor').value;
      this.socket.emit('/TE/', {code: code, username: this.username, containerName: this.state.containerName});
  }

  handleCodeSave(e) {
    var code = document.getElementById('code-editor').value;
    const fileName = this.state.fileName;
    console.log('filename is: ', fileName);
    const containerName = this.state.containerName;
    axios.post('/handleCodeSave', {
      codeValue: code,
      fileName: fileName,
      containerName: containerName
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.error(err);
    });
  }

  render() {
    return (
      <div className="code-editor-container">
        <textarea id="code-editor">
          {this.state.codeValue}
          </textarea><br/>
          <div className="row">
            <div className="col-md-6">
              <button onClick={this.handleCodeSave.bind(this)}> Save </button>
          </div>
          <div className="col-md-6 current-file">
            {this.state.fileName ? this.state.filePath + '/' + this.state.fileName : <p> No File </p>}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = CodeEditor;