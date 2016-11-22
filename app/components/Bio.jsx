const React = require('react');
const axios = require('axios');
import InlineEdit from 'react-edit-inline';

class Bio extends React.Component {
	constructor(props) {
    super(props);

    this.style = {
      minWidth: 300,
      fontFamily: 'Dosis',
      display: 'inline-block',
      margin: 0,
      padding: 0,
      fontSize: 15,
      outline: 0,
      border: 0
    }

    this.dataChanged = this.dataChanged.bind(this);

    this.state = {
      bio: this.props.bio,
      username: this.props.username
    }
  }

  dataChanged(data) {
      this.setState({
        bio: data.bio
      });

      const toUpdate = {
        bio: data.bio
      }

      axios.post('/users/updateUser', { username: this.state.username, toUpdate: toUpdate})
        .then(function(res) {
          console.log(res);
        })
        .catch(function(err) {
          console.log(err);
        });
  }

  render() {
    return (
        <div>
          <div className="card-container">
            <div className="header">
              ABOUT ME
            </div>
            <div className="information">
              <div className="info center">
                <InlineEdit
                  activeClassName="editing"
                  className="inline-edit"
                  text={this.state.bio ? this.state.bio : 'Tell others about yourself!'}
                  paramName="bio"
                  change={this.dataChanged}
                  style = {this.style}
                />
              </div>
            </div>
          </div>
        </div>
      )
  }
}

module.exports = Bio;