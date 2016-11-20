const React = require('react');
const axios = require('axios');
import { defaults } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
const Chart = require('chartjs');  

class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.mostUsedCommands = this.mostUsedCommands(this.props.commandHistory);

    this.state = {
      commandHistory: this.props.commandHistory,
      mostUsedCommands: this.mostUsedCommands,
      containerName: this.props.containerName,
      usage: -1,
    }
  }

  componentWillMount() {
    this.getStats();
  }

  getStats() {
    const context = this;
    console.log(this.state);
    axios.post('/docker/cmd', { cmd: 'df -h', containerName: this.state.containerName })
      .then(function(res) {
        const data = "`" + res.data + "`";
        const usage = parseInt(data.split("\n")[1].split('G')[3].split('%')[0].trim());
        context.setState({
          usage: usage
        });
      })
      .catch(function(err) {
        console.log(err);
      })
    }

  mostUsedCommands(commandHistory) {
    const set = {};
    const arr = [];

    commandHistory.forEach(command => {
      if (set.hasOwnProperty(command)) {
        set[command] += 1;
      } else {
        set[command] = 1;
      }
    });

    for (var key in set) {
      arr.push([key, set[key]]);
    }
    console.log(set);

    arr.sort(function(a, b) {
      return b[1] - a[1];
    });

    return arr;
  }



  render() {
    if (this.state.usage >= 0) {
      const used = this.state.usage;
      const free = 100 - this.state.usage;

      var data = {
          labels: [
              "Used",
              "Free"
          ],
          datasets: [
              {
                  data: [used, free],
                  backgroundColor: [
                      "rgba(225,91,105,0.8)",
                      "rgba(113,86,251,0.8)"
                  ],
                  hoverBackgroundColor: [
                      "rgba(225,91,105,0.8)",
                      "rgba(113,86,251,0.8)",
                  ],
                  borderColor: [
                    "rgba(255, 255, 255, 0.4)",
                    "rgba(255, 255, 255, 0.4)"
                  ],
                  borderWidth: 1
              }]
      };

      var options = {
          animateRotate:true
      }
      return (
          <div>
            <div className="card-container">
              <div className="header">
                STATS
              </div>
              <div className="information">
                <div className="center">
                  Usage
                </div>
                <div className="info">
                  <Pie data={data} />
                </div>
              </div>
            </div>
          </div>
        );
    } else {
      return (<div> Loading...</div>)
    }
  }
}

module.exports = Stats;