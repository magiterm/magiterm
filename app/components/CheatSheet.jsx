const React = require('react');

class CheatSheet extends React.Component {

  constructor(props) {
  	super(props);
    this.state = {
      active: false
    };
  }

  handleChangeActive(e) {
    e.preventDefault();
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    if (this.state.active) {
      return (
          <div className="cheat-sheet-container">
            <div className="minimize" ><i className="ion-minus" onClick={this.handleChangeActive.bind(this)}></i></div>
	        	<div className="cheat-container">
	        		<div className="command-container">
			        	<span className="title">
			        		New File and Open Code Editor
			        	</span>
			        	<span className="info">
			        		{'pico' + ' <FileName>'}
			        	</span>
		        	</div>
              <div className="command-container">
                <span className="title">
                  Download File / Folder
                </span>
                <span className="info">
                  {'download' + ' <FileName/FolderName>'}
                </span>
              </div>
              <div className="command-container">
                <span className="title">
                  Change Directory
                </span>
                <span className="info">
                  {'cd' + '<directory>'}
                </span>
              </div>
              <div className="command-container">
                <span className="title">
                  Show Files and Directories
                </span>
                <span className="info">
                  {'ls'}
                </span>
              </div>
              <div className="command-container">
                <span className="title">
                  Show Current Directory
                </span>
                <span className="info">
                  {'pwd'}
                </span>
              </div>
              <div className="command-container">
                <span className="title">
                  Open File
                </span>
                <span className="info">
                  {'open <FileName>'}
                </span>
              </div>
              <div className="command-container">
                <span className="title">
                  Clone Repository
                </span>
                <span className="info">
                  {'git clone <repository>'}
                </span>
              </div>
	        	</div>
          </div>
        );
    } else {
      return (
        <div className="cheat-sheet-mini" onClick={this.handleChangeActive.bind(this)}>
          Cheat Sheet
        </div>
      )
    }
  }
}

module.exports = CheatSheet;