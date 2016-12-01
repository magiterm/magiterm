const React = require('react');
const NavBar = require('./NavBar.jsx');

const HomePage = ({username, mostPopularVideos}) => {
	const showInfo = (event) => {	
		event.preventDefault();
		console.log('in here', event.target.className);
		const target0 = 'overlay' + event.target.className;
		const target1 = 'front-layer' + event.target.className;
		document.getElementById(target0).style.visibility='visible';
		document.getElementById(target1).style.visibility='visible';
	};

	const hideInfo = (event) => {
		event.preventDefault();
		console.log('THIS IS THE EVENT TARGET', event.target.id);
		const id = event.target.id.split("front-layer")[1];
		console.log('this is id', event.target.id.split("front-layer"));
		const target0='overlay' + id;
		console.log('this is target0', target0);
		const target1=event.target.id;
		document.getElementById(target0).style.visibility='hidden';
		document.getElementById(target1).style.visibility='hidden';

	// 	const target0 = 'overlay' + event.target.id;
	// 	const target1 = event.target;
	// 	document.getElementById(target0).style.visibility='hidden';
	// 	document.getElementById(target1).style.visibility='hidden';
	// }
}

	return (
		<div className="homepage-container">
		  <div className="header">
		    <NavBar username={username} />
		    <div className="title">
		      <img className="mini-logo" src="/images/whitelogo.svg"></img> <span className="logo-text"></span>
		    </div>
		    <div className="subtitle">
		      What's Hot at picoShell
		    </div>
		    <div className="subsubtitle">
		      Start Coding on picoShell's Top 8
		    </div>
		    <div className="most-popular-videos">
		      {mostPopularVideos.map((video, i) => {
		        return (
		          <div className="video-entry-home-page" key = {i}>
		            <img className={i} onMouseEnter={showInfo} src={video.videoImage}/>
    	          	<div className="overlay" id={'overlay' + i} data-key={i}>
    	          		<a href={'/video/' + video.videoId}><div className="front-layer" id={'front-layer' + i} onMouseOut={hideInfo}>{video.videoTitle}</div></a>
              		</div>
		          </div>
		        )
		      })}
		    </div>
		  </div>
		  <div className="info">
		    <div className="info-header">Javascript Videos</div>
    	</div>
		  <div className="info">
		    <div className="info-header">Python Videos</div>
    	</div>
		  <div className="info">
		    <div className="info-header">Ruby Videos</div>
    	</div>
		  <div className="footer">
		    <div className="footer-column">
		        <p className="footer-header">picoShell</p>
		        <ul>
		          <li><img src="/images/whitelogo.svg"></img>About</li>
		          <li><i className="ion-ios-world-outline"></i>FAQ</li>
		        </ul>
		    </div>
		    <div className="footer-column">
		      <p className="footer-header">Contact Us</p>
		      <ul>
		        <li><i className="ion-ios-email-outline"></i>picoShellTeam@gmail.com</li>
		      </ul>
		  </div>
		</div>
		</div>
	)
}


module.exports = HomePage;