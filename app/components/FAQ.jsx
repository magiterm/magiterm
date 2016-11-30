const React = require('react');
const NavBar = require('./NavBar.jsx');
let bar;

class FAQ extends React.Component {
  componentWillMount() {
    if (localStorage['user'] !== undefined) {
      console.log('localStorage');
      var myUser = JSON.parse(localStorage['user']).username;
      bar = <NavBar username={myUser}/>;
    }
  }
  render() {
    return (
      <div>
        {bar}
        <div className="homepage-container">
          <div className="header">
            <div className="title">
              <img className="mini-logo" src="/images/whitelogo.svg"></img> <span className="logo-text"></span>
            </div>
            <div className="subtitle">
              Frequently Asked Questions
            </div>
          </div>
          <div className='content'>
            <div className='cContainer'>
              <div className='question'>
              Q: How do I start my computer?
              </div>
              <div className='answer'>
              A: 
              </div>
              <div className='question'>
              Q: How do I run Code?
              </div>
              <div className='answer'>
              A: 
              </div>
              <div className='question'>
              Q: How do I upload files?
              </div>
              <div className='answer'>
              A: 
              </div>
              <div className='question'>
              Q: How do I upload files?
              </div>
              <div className='answer'>
              A: 
              </div>
              <div className='question'>
              Q: How do I download files?
              </div>
              <div className='answer'>
              A: Hello I have an answer
              </div>
              <div className='question'>
              Q: How do I collaborate with friends?
              </div>
              <div className='answer'>
              A: Hello I have an answer
              </div>
              <div className='question'>
              Q: Is the terminal fully functional? What can't I do with it?
              </div>
              <div className='answer'>
              A: Hello I have an answer
              </div>
            </div>
            <div className='cContainer'>
              
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
}

module.exports = FAQ;