const React = require('react');
const axios = require('axios');
const FileSaver = require('file-saver');
const FileHelpers = require('../../utils/FileHelpers.js');
const Dropzone = require('./Dropzone.jsx');

let counter = 0;

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    console.log('this is props of file browser', props);
    const context = this;
    this.socket = io();
    this.state = {
      containerName: this.props.containerName,
      curDir: '/picoShell',
      contents: [],
      hidden: true,
      permissions: this.props.permissions
    };
    this.doubleClick = this.doubleClick.bind(this);
    this.downloadClick = this.downloadClick.bind(this);
    this.updateFileBrowser = this.updateFileBrowser.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
  }

  updateFileBrowser(path, containerName) {
    const context = this;
    axios.post('/docker/cmd', { cmd: 'ls ' + path + ' -al', containerName: containerName, curDir: context.state.curDir })
    .then(function(res) {
      const contents = res.data.split('\n');
      context.socket.emit('/TERM/CD/', {dir: path, username: context.state.containerName, containerName: context.state.containerName});
      let contentsArr = [];

      for (var i = 0; i < contents.length; i++) {
        const arr = contents[i].split(" ");
        let type;
        if (arr[0].substring(0, 1) === "d") {
          type = "folder"
        } else if (arr[0].substring(0, 2) === "-r") {
          type = "file"
        }
        const name = arr[arr.length - 1];
        if(name !== '.pico') contentsArr.push({type: type, name: name});
      }
      contentsArr.shift();
      contentsArr.pop();
      context.setState({
        contents: contentsArr,
        curDir: path
      });
    });
  }

  componentWillMount() {
    const context = this;
    this.setState({
      containerName: this.state.containerName
    });
    this.updateFileBrowser('/picoShell', this.state.containerName);
  }


  componentWillReceiveProps(nextProps) {
    const context = this;
    console.log('FB GOT PROPS', nextProps);
    this.socket.off('/FB/REFRESH/' + this.state.containerName);
    this.setState({
      containerName: nextProps.containerName,
      hidden: nextProps.hidden,
      curDir: nextProps.curDir,
      permissions: nextProps.permissions
    });
    this.socket.on('/FB/REFRESH/' + this.props.containerName, function(ref) {
      console.log('FBREFRESH', ref);
      const dropzone = document.getElementById("dropzone-area");
      dropzone.style.backgroundColor="transparent";
      dropzone.style.borderColor="transparent";
      const target = document.getElementById("file-browser-yay");
      dropzone.style.zIndex="0";
      target.className = "file-browser-yay";
      context.updateFileBrowser(ref.path, context.props.containerName);

    });
    this.updateFileBrowser(nextProps.curDir, nextProps.containerName);
  }

  isPermitted() {
    if(this.state.permissions === 'read') {
      return false;
    }
    return true;
  }

  downloadClick(e, entry) {
    console.log(entry);
    const file = this.state.curDir.endsWith('/') ? this.state.curDir + entry : this.state.curDir + '/' + entry;
    console.log(file);
    axios.post('/docker/cmd', {cmd: 'download ' + file, containerName: this.state.containerName, curDir: this.state.curDir})
    .then(function(res) {
      var str2bytes = function(str) {
        var bytes = new Uint8Array(str.length);
        for (var i=0; i<str.length; i++) {
          bytes[i] = str.charCodeAt(i);
        }
        return bytes;
      }
      var download = function(filename, text) {
        console.log(filename, text);
        text = text.replace(/\n/g, '');
        var blob = new Blob(text.split(' ').map(function(txt) { return str2bytes(FileHelpers.hex2a(txt)); }), {type: ""});
        FileSaver.saveAs(blob, filename);
      }
      download(entry, res.data.fileContents);
    });
  }

  doubleClick(e, entry) {
    const context = this;
    axios.post('/docker/handleFileBrowserChange', {containerName: this.state.containerName, dir: this.state.curDir, entry: entry})
    .then(function(resp) {
      if(resp.data.type === 'dir') {
        if(resp.data.newDir === '..') {
          const newDir = context.state.curDir;
          var sliced;
          if(newDir.indexOf('/') !== newDir.lastIndexOf('/')) {
            sliced = newDir.slice(0, newDir.lastIndexOf('/'));
          } else {
            sliced = '/';
          }
          console.log('newDir', newDir);
          console.log('sliced', sliced);
          context.updateFileBrowser(sliced, context.state.containerName);
        } else {
          var newDir = context.state.curDir + '/' + resp.data.newDir;
          if(newDir.startsWith('//')) newDir = newDir.slice(1);
          context.updateFileBrowser(newDir, context.state.containerName);
        }
      } else if (resp.data.type === 'file') {
        //alert(resp.data.fileContents);
        var newCode = resp.data.fileContents;
        if(newCode.endsWith('\n')) newCode = newCode.slice(0, newCode.length - 1);
        context.socket.emit('/TE/', {filePath: context.state.curDir, fileName: entry, fileOpen: true, containerName: context.state.containerName, username: 'FILEBROWSER', code: newCode});
      }
    });
  }

  deleteClick(e, entry, isFolder) {
    const context = this;

    if(!context.isPermitted) return;
    var confirmed;
    if(!isFolder) confirmed = confirm('You are about to delete "' + entry + '". Continue?');
    else confirmed = confirm('You are about to delete the folder "' + entry + '". Continue?');

    if(confirmed) {
      axios.post('/docker/deleteFile', {isFolder: isFolder, containerName: this.state.containerName, curDir: this.state.curDir, entry: entry})
      .then(function(resp) {
        console.log(resp);
        context.updateFileBrowser(context.state.curDir, context.state.containerName);
      });
    }

  }

  handleDragEnter(event) {
    event.stopPropagation();
    event.preventDefault();    
    const target = document.getElementById("file-browser-yay");
    const dropzone = document.getElementById("dropzone-area");
    dropzone.style.zIndex="4";
    dropzone.style.border="1px dashed white"
    dropzone.style.backgroundColor = "rgba(255,255,255,0.1)"
    target.className += " onDrag";
  }

  handleDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    const dropzone = document.getElementById("dropzone-area");
    dropzone.style.backgroundColor="transparent";
    dropzone.style.borderColor="transparent";
    const target = document.getElementById("file-browser-yay");
    dropzone.style.zIndex="0";
    target.className = "file-browser-yay";
  }



  render() {
    const context = this;
    if(!this.state.hidden) {
      return (
          <div className="file-and-dropzone">
            <div id="file-browser-yay" className="file-browser-yay">
            <div id="file-browser" className="file-browser" onDragEnter={this.handleDragEnter.bind(this)}>
              {this.state.contents.map(function(entry, i) {
                if (entry.type === "file") {
                  return (
                    <div className="fileBrowser" onDoubleClick={(e) => {context.doubleClick(e, entry.name)}}>
                      {context.state.permissions !== 'read' 
                          ? <i onClick={(e) => {context.deleteClick(e, entry.name, false)}} style={{paddingRight: '10px'}} className="ion-ios-close-outline"></i>
                          : <div></div>}
                      
                      <i className="ion-ios-paper-outline">{" " + entry.name}</i>
                      <i onClick={(e) => {context.downloadClick(e, entry.name)}} style={{float: 'right', 'paddingRight': '10px'}}className="ion-ios-download-outline">Download</i>
                    </div>
                  )
                } else if (entry.type === "folder" && entry.name !== ".") {
                  return (
                    <div id={entry.name + i} className="fileBrowser" onDoubleClick={(e) => {context.doubleClick(e, entry.name)}}>
                      { entry.name === ".." ? <i className="ion-ios-arrow-up">{entry.name}</i> : 
                      <div>
                      {((context.state.curDir !== '/') && (context.state.permissions !== 'read')) ? <i onClick={(e) => {context.deleteClick(e, entry.name, true)}} style={{paddingRight: '10px'}} className="ion-ios-close-outline">  </i> : null }
                      <i className="ion-ios-arrow-down">{" " + entry.name}</i> 
                      {context.state.curDir !== '/' ? <i onClick={(e) => {context.downloadClick(e, entry.name)}} style={{float: 'right', 'paddingRight': '15px'}} className="ion-ios-download-outline">Download Zip</i> : null}
                      </div>
                      }
                    </div>
                  )
                }
              })}
              </div>
              </div>
              { context.state.permissions !== 'read'
                  ? <div className="dropzone-area" id="dropzone-area" onDragLeave={this.handleDragLeave.bind(this)}>
                      <Dropzone containerName={this.state.containerName}
                              curDir={this.state.curDir}/>
                    </div>
                  : <div></div>
              }
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

module.exports = FileBrowser;