const React = require('react');
const ReactDOM = require('react-dom');
const NewVideoForm = require('./NewVideoForm.jsx');
const VideoTable = require('./VideoTable.jsx');
const VideoPage = require('./VideoPage.jsx');
const utils = require('../../utils/videoHelpers.js');
const bootstrap = require('bootstrap');
const API_KEY = require('../../utils/keys');
const NavBar = require('./NavBar.jsx');

class VideoHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoList: []
    };
  }

  componentWillMount() {
    var context = this;
    const user = JSON.parse(localStorage['user']);
    context.setState({
      containerName: user.username,
      username: user.username
    });
  }

  componentDidMount() {
    this.getAllVideos = $.get('/videos/getVideos', function(data) {
      console.log('these are the videos', data);
      const videos = utils.getAllVideoObjects(data);
      this.setState({
        videoList: videos,
      });
    }.bind(this));
  }

  render() {
    return (
      <div className="video-home-page">
        <NavBar username={this.state.username}/>
        <div className="video-homepage-container">
          <div className="homepage-landing">
            <div className="overlay">
              <div className="row">
                <div className="col-md-12 logo-container">
                  <a href="/" className="title"> CODEABLE </a>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-md-offset-4 description-container">
                  <span>Ready to conquer the programming world?</span><br/>
                  <span>Join Codeable, your one place to learn how to program</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-md-offset-4 homepage-form">
                  <NewVideoForm handleNewVideoSubmit ={this.handleNewVideoSubmit.bind(this)}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="video-table-container">
          <div className="container">
            <VideoTable videos={this.state.videoList}/>
          </div>
        </div>
      </div>
    );
  }

  //handlers
  handleNewVideoSubmit(e) {
    if (e.key === 'Enter') {
      const input = e.target.value;

      const iFrameSrc = utils.createIFrameSrc(utils.getVideoId(input));
      const videoId = utils.getVideoId(input);

      if (utils.isValidUrl(input)) {
        $.post('/videos/submitVideo', {videoId: videoId, videoUrl: input}, function() {
          location.reload();
        });
      } else {
        console.log('Please enter a valid url');
      }
    }
  }
}

module.exports = VideoHome;
