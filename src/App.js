import React from 'react';
import './App.css';
import Papa from 'papaparse'
import {FileUploader} from './FileUploader'
import {Dashboard} from './Dashboard'
import * as csv from './SalesOrderReport.csv'

const data = Papa.parse(csv, {
  header: true,
  complete: function(results) {
    this.setState({
      data: results.data
    })
  }.bind(this)
});
console.log(data);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '[Company Name]'
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
  render() {
    return (
      <div className='container-fluid'>
        {! this.state.data &&
    <FileUploader handleUpload={this.handleUpload}/>
          }
      <Dashboard company={this.state.company} data={this.state.data}/>
        </div>
    )
  }
}

export default App;
