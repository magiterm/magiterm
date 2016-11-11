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
      var code = editor.getValue();
      var textArea = document.getElementById("code-editor");
      textArea.value = code;
      context.handleCodeChange();
    });
  }

  componentWillMount() {
    this.socket = io();
    const context = this;

    //The 1 will be replaced by container/user ID when we have sessions
    this.socket.on('/TE/1', function(code) {
      context.setState({
        codeValue: code
      });
      //Not sure why setState isn't redrawing, so I forced it to re-render. Need to fix.
      document.getElementById('code-editor').value = code;
    });
  }


  handleCodeChange() {
      var code = document.getElementById('code-editor').value;
      console.log(code);
      this.socket.emit('/TE/1', code);
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