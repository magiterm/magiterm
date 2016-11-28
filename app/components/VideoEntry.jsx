const React = require('react');
import { Router, Route, Link, browserHistory } from 'react-router'

const VideoEntry = ({video}) => {
	console.log(video.videoImage);
	if (video.videoImage) {
		return (
			<div className="col-md-4">
				<Link to={`/video/${video.videoId}`} >
					<div className="video-entry-image">
					<img 
						src={video.videoImage}
					/>
					</div>
				</Link>
			</div>
		)
	} else {
		return (
			<div className="col-md-4">
				<Link to={`/video/${video.videoId}`} >
					<div className="video-entry-image">
					<img 
						src='/images/noVideoImage.svg'
					/>
					</div>
				</Link>
			</div>
		)
	}

}

module.exports = VideoEntry;