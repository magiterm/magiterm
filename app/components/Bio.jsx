const React = require('react');
const axios = require('axios');
import InlineEdit from 'react-edit-inline';

class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.style = {
      backgroundColor: '#191919',
      minWidth: 300,
      fontFamily: 'Roboto-Regular',
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
    console.log('5555555555555555555555555', this.props)
  }

  dataChanged(data) {
      this.setState({
        bio: data.bio
      });

      const toUpdate = {
        bio: data.bio
      }

      axios.post('/updateUser', { username: this.state.username, toUpdate: toUpdate})
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
            <div className="title">
              Bio
            </div>
            <div className="info">
              <InlineEdit
                activeClassName="editing"
                text={this.state.bio ? this.state.bio : 'Tell others about yourself!'}
                paramName="bio"
                change={this.dataChanged}
                style = {this.style}
              />
              {console.log('66666666666666666666',this.state)}
              {this.props.firstName + ' ' + this.props.lastName}
            </div>
          </div>
        </div>
      )
  }
}

module.exports = Bio;