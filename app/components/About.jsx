const React = require('react');

class About extends React.Component {
  render() {
    return (
      <div className="homepage-container">
        <div className="header">
          <div className="title">
            <img className="mini-logo" src="/images/whitelogo.svg"></img> <span className="logo-text"></span>
          </div>
          <div className="subtitle">
            Who We Are
          </div>
        </div>
        <div className='content'>
          <div className='cContainer'>
            <div className="cSubtitle">
              Mission
            </div>
            <div className='cText'>
               SOMETHING CREATIVE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam magna in massa dapibus, eget malesuada dui accumsan. Nullam sodales congue condimentum. Aenean gravida, dolor ut iaculis iaculis, massa tortor aliquet metus, id tincidunt orci orci nec ex. Nunc molestie, ante mollis consectetur porttitor, mi turpis tempus nisl, vel commodo velit tellus quis massa. In semper justo a quam efficitur facilisis. Proin quis risus in sapien pellentesque placerat quis eu risus. Nullam eu pellentesque mauris. Nam varius mollis augue, at commodo mauris dictum sed. Aenean iaculis feugiat molestie. Sed in libero commodo, fermentum leo ut, malesuada eros. Nulla sit amet lectus non lorem tristique volutpat a in nunc.
            </div>
          </div>
          <div className='cContainer'>
            <div className="cSubtitle">
              Team
            </div>
            <div>
              <div className='teamRow'>
                <img className='pic' src="/images/BS.jpg"></img>
                <div className='tText'>
                  SOMETHING CREATIVE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam magna in massa dapibus, eget malesuada dui accumsan. Nullam sodales congue condimentum. Aenean gravida, dolor ut iaculis iaculis, massa tortor aliquet metus, id tincidunt orci orci nec ex. Nunc molestie, ante mollis consectetur porttitor, mi turpis tempus nisl, vel commodo velit tellus quis massa. In semper justo a quam efficitur facilisis. Proin quis risus in sapien pellentesque placerat quis eu risus. Nullam eu pellentesque mauris. Nam varius mollis augue, at commodo mauris dictum sed. Aenean iaculis feugiat molestie. Sed in libero commodo, fermentum leo ut, malesuada eros. Nulla sit amet lectus non lorem tristique volutpat a in nunc.
                </div>
              </div>
              <div className='teamRow'>
                <img className='pic' src="/images/JC.jpg"></img>
                <div className='tText'>
                  SOMETHING CREATIVE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam magna in massa dapibus, eget malesuada dui accumsan. Nullam sodales congue condimentum. Aenean gravida, dolor ut iaculis iaculis, massa tortor aliquet metus, id tincidunt orci orci nec ex. Nunc molestie, ante mollis consectetur porttitor, mi turpis tempus nisl, vel commodo velit tellus quis massa. In semper justo a quam efficitur facilisis. Proin quis risus in sapien pellentesque placerat quis eu risus. Nullam eu pellentesque mauris. Nam varius mollis augue, at commodo mauris dictum sed. Aenean iaculis feugiat molestie. Sed in libero commodo, fermentum leo ut, malesuada eros. Nulla sit amet lectus non lorem tristique volutpat a in nunc.
                </div>
              </div>
              <div className='teamRow'>
                <img className='pic' src="/images/SZ.jpg"></img>
                <div className='tText'>
                  SOMETHING CREATIVE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam magna in massa dapibus, eget malesuada dui accumsan. Nullam sodales congue condimentum. Aenean gravida, dolor ut iaculis iaculis, massa tortor aliquet metus, id tincidunt orci orci nec ex. Nunc molestie, ante mollis consectetur porttitor, mi turpis tempus nisl, vel commodo velit tellus quis massa. In semper justo a quam efficitur facilisis. Proin quis risus in sapien pellentesque placerat quis eu risus. Nullam eu pellentesque mauris. Nam varius mollis augue, at commodo mauris dictum sed. Aenean iaculis feugiat molestie. Sed in libero commodo, fermentum leo ut, malesuada eros. Nulla sit amet lectus non lorem tristique volutpat a in nunc.
                </div>
              </div>
              <div className='teamRow'>
                <img className='pic' src="/images/LB.jpg"></img>
                <div className='tText'>
                  SOMETHING CREATIVE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi aliquam magna in massa dapibus, eget malesuada dui accumsan. Nullam sodales congue condimentum. Aenean gravida, dolor ut iaculis iaculis, massa tortor aliquet metus, id tincidunt orci orci nec ex. Nunc molestie, ante mollis consectetur porttitor, mi turpis tempus nisl, vel commodo velit tellus quis massa. In semper justo a quam efficitur facilisis. Proin quis risus in sapien pellentesque placerat quis eu risus. Nullam eu pellentesque mauris. Nam varius mollis augue, at commodo mauris dictum sed. Aenean iaculis feugiat molestie. Sed in libero commodo, fermentum leo ut, malesuada eros. Nulla sit amet lectus non lorem tristique volutpat a in nunc.
                </div>
              </div>
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
    );
  }
}

module.exports = About;