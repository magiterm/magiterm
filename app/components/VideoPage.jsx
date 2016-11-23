const React = require('react');
var ReactDOM = require ('react-dom');
const utils = require('../../utils/videoHelpers.js');
const VideoPlayer = require('./VideoPlayer.jsx');
const CodeEditor = require('./CodeEditor.jsx');
const Terminal = require('./Terminal.jsx');
const NavBar = require('./NavBar.jsx');

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
  	  			<div className="row">
  	  				<div className="col-md-12 title">
  	  					{this.state.currentVideo.videoTitle}
    					</div>
  				  </div>
  	  			<div className="row">
              <div className="col-md-6">
  	  			      <VideoPlayer video={this.state.currentVideo} />
              </div>
              <div className="col-md-6">
                <CodeEditor username={this.state.username} containerName={this.state.containerName}/>
              </div>
            <div className="col-md-4">
              <Terminal username={this.state.username} containerName={this.state.containerName}/>
            </div>
          </div>
			</div>
			</div>
	  	)
  	}
  }

}
module.exports = VideoPage;