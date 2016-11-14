const React = require('react');
const axios = require('axios');
// const CodeMirror = require('react-codemirror');
// import '../../node_modules/codemirror/mode/javascript/javascript';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    var context = this;
    this.state = {
      codeValue: ''
    }
    this.username = sessionStorage['username'];
  }

  componentDidMount() {
    var context = this;
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
    this.socket.on('/TE/1', function(code) {
      if(code.username !== context.username) {
        context.setState({
          codeValue: code.code
        });
        //Must place the cursor back where it was after replacing contents. Otherwise weird things happen.
        console.log(code.code);
        context.cursorPos = context.editor.doc.getCursor();
        context.editor.getDoc().setValue(code.code);
        context.editor.doc.setCursor(context.cursorPos);
      }
    });
  }


  handleCodeChange() {
      var code = document.getElementById('code-editor').value;
      this.socket.emit('/TE/1', {code: code, username: this.username});
  }

  handleCodeSave(e) {
    var code = document.getElementById('code-editor').value;
    axios.post('/handleCodeSave', {
      codeValue: code
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
      <div>
        <textarea id="code-editor">
          {this.state.codeValue}
        </textarea><br/>
        <button onClick={this.handleCodeSave.bind(this)}> Save </button>
      </div>
    )
  }
}

module.exports = CodeEditor;