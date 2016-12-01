const React = require('react');
const ReactDOM = require('react-dom');
const DropzoneComponent = require('react-dropzone');
const request = require('superagent');

var Dropzone = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    console.log('DZ PROPS', nextProps);
    this.socket = io();
    this.setState({
      curDir: nextProps.curDir,
      containerName: nextProps.containerName
    });
  },

  render: function() {
    return (
      <div>
        <DropzoneComponent className="dropzone" disableClick={false} multiple={false} onDrop={this.dropHandler} style={{display:"block"}}>
        </DropzoneComponent>
      </div>
    );
  },

  dropHandler: function(file, filerej) {
    if(file.length === 0) return;
    if(file[0].size > 2000000) {
      alert('Sorry, but the maximum file upload size is 2 MB. Cloning a git repository does not have this limit.');
      return;
    }
    const context = this;
    var fileData = new FormData();
    var options = JSON.stringify({fileName: file[0].name, containerName: this.state.containerName, curDir: this.state.curDir});
    fileData.append('file', file[0]);
    fileData.append('opts', options);

    request.post('/uploadHandler')
      .send(fileData)
      .end(function(err, resp) {
        if(err) {console.error(err);}
        console.log(resp);
        context.socket.emit('/FB/REFRESH/', {path: context.state.curDir, containerName: context.state.containerName});
        return resp;
      });
  }
});

module.exports = Dropzone;