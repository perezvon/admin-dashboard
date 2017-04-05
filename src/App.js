import React from 'react';
import './App.css';
import Papa from 'papaparse'
import {FileUploader} from './FileUploader'
import {Dashboard} from './Dashboard'

const csv = 'sampledata.csv'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '[Company Name]',
      maxSpend: 500
    };
  }
  handleUpload = () => {
    let file = document.getElementById('fileUpload').files[0];
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        this.setState({
          data: results.data
        })
      }.bind(this)
    });
  }

  componentDidMount = () => {
    Papa.parse(csv, {
      download: true,
      header: true,
      complete: function(results) {
        this.setState({
          data: results.data
        })
      }.bind(this)
    });
  }
  render() {
    return (
      <div className='container-fluid'>
        {! this.state.data &&
    <FileUploader handleUpload={this.handleUpload}/>
          }
      <Dashboard company={this.state.company} data={this.state.data} maxSpend={this.state.maxSpend}/>
        </div>
    )
  }
}

export default App;
