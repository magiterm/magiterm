const React = require('react');
const axios = require('axios');

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);
    console.log('this is props of file browser', props);
    this.socket = io();
    this.state = {
      containerName: this.props.containerName,
      curDir: '/picoShell',
      contents: [],
      hidden: true
    };
    this.doubleClick = this.doubleClick.bind(this);
    this.downloadClick = this.downloadClick.bind(this);
    this.updateFileBrowser = this.updateFileBrowser.bind(this);
  }

  updateFileBrowser(path, containerName) {
    const context = this;
    axios.post('/docker/cmd', { cmd: 'ls ' + path + ' -al', containerName: containerName })
    .then(function(res) {
      const contents = res.data.split('\n');

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
      //remove the last element, which is ''
      //remove the first element, which is '.'
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
    this.setState({
      containerName: nextProps.containerName,
      hidden: nextProps.hidden
    });
    this.updateFileBrowser('/picoShell', nextProps.containerName);
  }

  downloadClick(e, entry) {
    console.log(this.state.curDir, entry);
    const file = this.state.curDir.endsWith('/') ? this.state.curDir + entry : this.state.curDir + '/' + entry;
    console.log(file);
    axios.post('/docker/cmd', {cmd: 'download ' + file, containerName: this.state.containerName})
    .then(function(res) {
      var download = function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      };
      console.log('downloading', res.data.fileContents, 'as', res.data.fileName);
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



  render() {
    const context = this;
    if(!this.state.hidden) {
      return (
          <div>
            {this.state.contents.map(function(entry) {
              if (entry.type === "file") {
                return (
                  <div className="fileBrowser" onDoubleClick={(e) => {context.doubleClick(e, entry.name)}}>
                    <i className="ion-ios-paper-outline">{" " + entry.name}</i>
                    <i onClick={(e) => {context.downloadClick(e, entry.name)}}style={{float: 'right', 'padding-right': '10px'}}className="ion-android-arrow-down">Download</i>
                  </div>
                )
              } else if (entry.type === "folder" && entry.name !== ".") {
                return (
                  <div id={entry.name} className="fileBrowser" onDoubleClick={(e) => {context.doubleClick(e, entry.name)}}>
                    { entry.name === ".." ? <i className="ion-ios-arrow-up">{entry.name}</i> : <i className="ion-ios-arrow-down">{" " + entry.name}</i> }
                  </div>
                )
              }
            })}
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