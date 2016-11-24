const React = require('react');
var ReactDOM = require ('react-dom');
const utils = require('../../utils/videoHelpers.js');
const VideoPlayer = require('./VideoPlayer.jsx');
const CodeEditor = require('./CodeEditor.jsx');
const Terminal = require('./Terminal.jsx');
const NavBar = require('./NavBar.jsx');
const SplitPane = require('react-split-pane');

class VideoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentVideo: null,
      username: '',
      containerName: ''
    };
  }

  componentWillMount() {
  	var context = this;
  	const user = JSON.parse(localStorage['user']);
  	context.setState({
     containerName: user.username,
     username: user.username
   });
    this.checkVideoIdInDB = 
    $.ajax({
      url: '/videos/checkVideoIdInDB',
      data: {videoId: this.props.params.videoId},
      success: function(video) {
       this.setState({
        currentVideo: video
      })
     }.bind(this),
     error: function(err) {
       console.log('not in db', err);
     }.bind(this)
   });
  }

  render() {
  	if (this.state.currentVideo === null || !this.state.containerName.length) {
  		return null;
  	} else {
      return (
       <div>
       <NavBar username={this.state.username} />
         <div className="video-page-container">
          <div className="title">
           {this.state.currentVideo.videoTitle}
          </div>
          <div className="body-container">
            <div className="video-player-container">
              <VideoPlayer video={this.state.currentVideo} />  
              <Terminal username={this.state.username} containerName={this.state.containerName}/>
            </div>
            <div className="split-pane">
               <CodeEditor username={this.state.username} containerName={this.state.containerName}/>
            </div>
            </div>
          </div>
       </div>
       )
    }
  }

}
module.exports = VideoPage;


          // <div className="split-pane">
          //    <SplitPane split="horizontal" defaultSize='50%'>
          //    <CodeEditor username={this.state.username} containerName={this.state.containerName}/>
          //    <Terminal username={this.state.username} containerName={this.state.containerName}/>
          //   </SplitPane>
          // </div>