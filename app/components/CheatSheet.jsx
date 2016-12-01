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