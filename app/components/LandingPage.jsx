const React = require('react');
const Slider = require('react-slick');
const Modal = require('react-modal');

const LandingPage = ({authenticate, email, modalIsOpen, mostPopularVideos, handleChangeEmailInput, handleGoToSignUp, handleGoToLogin, handleSendEmail, handleCloseModal, handleOpenModal}) => {
	return (
	  <div> 
	      <div className="homepage-container">
	        <div className="header">
	          <div className="title">
	            <img className="mini-logo" src="/images/whitelogo.svg"></img> <span className="logo-text"></span>
	          </div>
	          <div className="subtitle">
	            Coding Made Simple
	          </div>
	          <div className="subsubtitle">
	            Sign Up Today to Simplify the Programming Process
	          </div>
	          <div className="start-button">
	            <div className="btn btn-success" onClick={handleGoToLogin.bind(this)}>Start Now</div>
	          </div>
	          <div className="logo-container">
	            <img src="/images/header.gif"></img>
	          </div>
	          <Modal
	            isOpen={modalIsOpen}
	            style={customStyles}
	            contentLabel="Example Modal"
	            >  
	            <div className='modalDiv'>
	              <form className='modalDiv' onSubmit={handleSendEmail.bind(this)}>
	                <div style={{color: 'white', fontSize: 20}}>Enter Your Email to Reset your Password</div>
	                <input style={{width: 400, marginTop: 15, marginBottom: 15}} onChange={handleChangeEmailInput.bind(this)} className="login-input" placeholder='Email' value={email}/>
	                <div className="submit">
	                 <button type="submit" className="btn">Submit</button>
	                </div>
	              </form>
	              <button style={{marginTop: 15, marginBottom: 15}} className="btn" onClick={handleCloseModal.bind(this)}>Close Modal</button>
	            </div>
	          </Modal> 
	        </div>
	        <div className="login-container" id="login">
	          <div className="login-container-container">
	            <div className="login-header">
	              <div className="login">
	                Reinvent Programming Today
	              </div>
	            </div>
	            <div className="login-box">
	              <div className="login">
	                {authenticate}
	              </div>
	            </div>
	          </div>
	        </div>
	        <div className="info">
	          <div className="dark">
	          Current Most Popular Videos <br/>
	            <div className="slider-container">
	              <Slider {...sliderSettings} >
	              {mostPopularVideos.map((video, i) => {
	                return (
	                  <div className="video-entry-home-page" key = {i}>
	                      <a href="#login"><img src={video.videoImage}/></a>
	                  </div>
	                )
	              })}
	              </Slider>
	            </div>
	          </div>
	        </div>
	        <div className="info">
	          <div className="info-header">Who Uses picoShell?</div>
	          <div className="sub-header">
	            picoShell is for educators, students, developers, and interviewers who want to collaborate through code remotely
	          </div>
	          <div className="info-container">
	            <img src="/images/header.gif"></img>
	            <div className="description-left">
	              <span className="title">Powerful</span><br/>
	              Gain full access to your own linux terminal emulator and code editor with ruby, node, python, gcc, git, and more installed
	            </div>
	          </div>
	          <div className="info-container">
	            <div className="description-right">
	            <span className="title" id="educational">Educational</span><br/>
	            Add videos from YouTube to picoShell and instantly code alongside of it. 
	            picoShell remembers the file you create with each video, so you can always pick up
	            where you left off
	            </div>
	            <img src="/images/codeable.gif"></img>
	          </div>
	          <div className="info-container">
	            <img src="/images/header.gif"></img>
	            <div className="description-left">
	              <span className="title">Collaborative</span><br/>
	                Easily give read or write access to your computer to work on projects, assignments,
	                or to conduct interviews
	            </div>
	          </div>
	          <div className="info-container">
	            <div className="description-right">
	            <span className="title">Convenient</span><br/>
	              You could just push your code up to git...or you could use picoShell's download button
	              to export all your files to your local filesystem
	            </div>
	            <img src="/images/codeable.gif"></img>
	          </div>
	        </div>
	        <div className="footer">
	          <div className="footer-column">
	              <p className="footer-header">picoShell</p>
	              <ul>
	                <li><img src="/images/whitelogo.svg"></img><a href="/about">About</a></li>
	                <li><i className="ion-ios-world-outline"></i><a href='/faq'>FAQ</a></li>
	                <li><i className="ion-ios-home-outline"></i><a href='/'>Home</a></li>
	              </ul>
	          </div>
	          <div className="footer-column">
	            <p className="footer-header">Contact Us</p>
	            <ul>
	              <li><i className="ion-ios-email-outline"></i>bianca.subion@gmail.com</li>
	            </ul>
	        </div>
	      </div>
	    </div>
	  </div>
	);
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    height: 300,
    width: 600,
    backgroundColor:'rgba(72,72,72,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    mostPopularVideos: null
  },
};

const sliderSettings = {
  lazyLoad: 'ondemand',
  slidesToShow: 4,
  slidesToScroll: 4
}


module.exports = LandingPage;