import React from 'react';
import './App.css';
import Papa from 'papaparse'
import {FileUploader} from './FileUploader'
import {Dashboard} from './Dashboard'
import _ from 'underscore'
import {currToNumber} from './global'
const csv = 'sampledata.csv'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentWillMount = () => {
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
    let data = this.state.data;
    let pieData = []
    let companyName = 'upload a csv file...';
    let total = 0;
    let totalSpend = '';
    let userData = '';
    if (data) {
      data = data.filter(item => !!item.textBox14);
      //set company name
      companyName = data[0].textBox30 ? data[0].textBox30 : '[Company Name]';

      //get unique users && total spend of each
      const uniqueUsers = [...new Set(data.map(item => item.textBox16))];
      let userTotals = [];
      if (!_.last(uniqueUsers)) uniqueUsers.pop();
      uniqueUsers.forEach(user => {
        for (let i = 0; i < data.length; i++) {
          if (user === data[i].textBox16 && !_.find(userTotals, u => u.name === user)) {
            const currentTotal = currToNumber(data[i].textBox26);
            userTotals.push({
              name: user,
              amount: currentTotal
            })
          }
        }
      });

      //get unique orders && totals for each
      const uniqueOrders = [...new Set(data.map(item => item.textBox14))];
      let orderTotals = [];
      if (!_.last(uniqueOrders)) uniqueOrders.pop();
      uniqueOrders.forEach(order => {
        for (let i = 0; i < data.length; i++) {
          if (order === data[i].textBox14 && !_.find(orderTotals, o => o.order === order )) {
            const orderTotal = currToNumber(data[i].textBox26);
            orderTotals.push({
              order: order,
              total: orderTotal
            })
            total += orderTotal
          }
        }
      })

      //format user spend data for chart
      pieData = userTotals.map(item => {return {'label': item.name,'value': (item.amount / total * 100).toFixed(2)}})

      //sort user spend data for display
      userTotals = _.sortBy(userTotals, 'amount').reverse();
      //update UI
      totalSpend = <h2>Total Spend 2017: <span className='green-text'>${total.toFixed(2)}</span></h2>
      userData = userTotals.map((user, index) => {
        const textColor = user.amount <= this.state.maxSpend ? 'green-text' : 'red-text';
        return <h3 key={index}>{user.name}: <span className={textColor}>${user.amount.toFixed(2)}</span></h3>
      })
    }
    return (
      <div className='container-fluid'>
        {! this.state.data &&
    <FileUploader handleUpload={this.handleUpload}/>
          }
      <Dashboard data={data} companyName={companyName} totalSpend={totalSpend} userData={userData} pieData={pieData} />
        </div>
    )
  }
}

export default App;
