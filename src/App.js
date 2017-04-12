import React from 'react';
import './App.css';
import Papa from 'papaparse'
import {FileUploader} from './FileUploader'
import {Dashboard} from './Dashboard'
import _ from 'underscore'
import {currToNumber} from './global'
import moment from 'moment'

const csv = 'sampledata.csv'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxSpend: 500,
      logo: 'moorheadlogo.png',
      showModal: false,
      activeOrder: 0
    };
  }
  handleUpload = () => {
    const file = document.getElementById('fileUpload').files[0];
    Papa.parse(file, {
      header: true,
      complete: function(results) {
        this.setState({
          data: results.data
        })
      }.bind(this)
    });
  }

  setData = (data) => {
    this.setState({
        data: data
      })
  }

  setActiveOrder = (e) => {
    e.preventDefault();
    const order = e.target.parentNode.attributes.getNamedItem('data-order').value;
    this.setState({
      activeOrder: order,
      showModal: true
    })
  }

  sortTable = (e) => {
    e.preventDefault();
    const sort = e.target.attributes.getNamedItem('data-sort').value;
    console.log(sort)
    switch (sort) {
      case 'Order Date':
        this.setState({
          sort: 'orderDate'
        })
      break;
      default:
        this.setState({
          sort: ''
        })
    }
  }

  openModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  componentWillMount = () => {
    /*
    //currently obtaining token through fetch call does not work. Obtaining token through cURL until I figure this out.
    fetch(url, {
   method: 'post',
   headers: {
     'Authorization': 'Basic '+btoa('q7IqO96zO06o61OK/QfRlw:ab149daa-1784-4aa5-8180-209e4912dcb9'),
     'Content-Type': 'application/x-www-form-urlencoded'
   },
   body: 'A=1&B=2'
 })
  .then(res => {
    console.log(res)
  });
    const url = 'https://api.sellerscommerce.com/api/order/getall';
    const accessToken = 'T4PYUUtbz5XokxhHuUR7sFfnTBrOV9vGqW7Yn61TlrW0Ju0pTj_TAshnxV5aKPdBF3o25ESdDYbb8Ilj-uJM4xDQViucIAqYpM5iIYoUkm9pzkmq1WOzyDLuPqMQzW4ekpLwPLmz8eTdFOwcvCIuorft5waVVc1Y8iy6hWlLUl-h5K1iVpCvYM4N74oJGwoR0HyJS_mgEehda34BPu3xPGLpGfg';
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', 'Bearer ' + accessToken);
    const myInit = {
      method: 'GET',
      headers: headers
    };
    fetch(url, myInit)
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(json => {
        const currentData = json.Results//.filter(x => !!x.OrderNumber);
        this.setData(currentData);
      })*/


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
    let chartData = []
    let tooltipContent;
    let companyName = 'upload a csv file...';
    let companyTotal = 0;
    let totalSpend = '';
    let userData = '';
    let totalOrders = '';
    let productsPurchased = '';
    let orderTotals = [];
    let tableData;
    let headers = [];
    let totalSpendRemaining = 0;
    let spendRemaining;
    let orderData;

    if (data) {
      data = data.filter(item => !!item.textBox14);
      //set company name
      companyName = data[0].textBox30 ? data[0].textBox30 : '[Company Name]';

      //get unique users && create dataset for each
      const uniqueUsers = [...new Set(data.map(item => item.textBox16))];
      let userTotals = [];
      if (!_.last(uniqueUsers)) uniqueUsers.pop();
      totalSpendRemaining = this.state.maxSpend * uniqueUsers.length;
      uniqueUsers.forEach(user => {
        for (let i = 0; i < data.length; i++) {
          if (user === data[i].textBox16 && !_.find(userTotals, u => u.name === user)) {
            const currentTotal = +currToNumber(data[i].textBox26);
            const orderNumber = data[i].textBox14;
            const orderDate = data[i].textBox15;
            const shipping = +currToNumber(data[i].textBox24);
            const tax = +currToNumber(data[i].textBox25);
            const subtotal = +(currentTotal - shipping - tax);
            userTotals.push({
              orderNumber: orderNumber,
              date: moment(orderDate).format('MMMM D, YYYY'),
              name: user,
              subtotal: subtotal,
              shipping: shipping,
              tax: tax,
              total: currentTotal
            })
          }
        }
      });

      //format user orders for table
      headers = ['Order Number', 'Order Date', 'Employee Name', 'Subtotal', 'Shipping', 'Tax', 'Total'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortTable}>{item}</th>);
      tableData = userTotals.map((item, index) => {
        return <tr key={item.orderNumber} data-order={item.orderNumber} onClick={this.setActiveOrder}>{_.map(item, (i, key) => <td key={i}>{+i && key !== 'orderNumber' ? '$'+i.toFixed(2) : i}</td>)}</tr>
      })

      //get unique orders && totals for each
      const uniqueOrders = [...new Set(data.map(item => item.textBox14))];
      if (!_.last(uniqueOrders)) uniqueOrders.pop();
      uniqueOrders.forEach(order => {
        for (let i = 0; i < data.length; i++) {
          if (order === data[i].textBox14 && !_.find(orderTotals, o => o.order === order )) {
            const orderTotal = currToNumber(data[i].textBox26);
            orderTotals.push({
              order: order,
              total: orderTotal
            })
            companyTotal += orderTotal
          }
        }
      })

      //total spend reamaining == num of users * each user's allotment - total already spent by users
      totalSpendRemaining -= companyTotal;

      //number of orders
      totalOrders = <h3>Number of Orders: <span className='green-text'>{orderTotals.length}</span></h3>

      //total products purchased
      productsPurchased = <h3>Total Products Purchased: <span className='green-text'>{data.length}</span> </h3>

      //sort user spend data for display
      userTotals = _.sortBy(userTotals, 'total').reverse();
      //format user spend data for chart
      chartData = userTotals.map(user => {return {'name': user.name,'total': user.total}})
      tooltipContent = chartData.map(item => {return {'name': item.name,'total': '$' + item.total}})
      //update UI
      totalSpend = <h2>Total Spend 2017: <span className='green-text'>${companyTotal.toFixed(2)}</span></h2>
      spendRemaining = <h2>Amount Remaining 2017: <span className='green-text'>${totalSpendRemaining.toFixed(2)}</span></h2>
      userData = userTotals.map((user, index) => {
        const textColor = user.total <= this.state.maxSpend ? 'green-text' : 'red-text';
        return <h3 key={index}>{user.name}: <span className={textColor}>${user.total.toFixed(2)}</span></h3>
      })

/*
      //extract header titles for table
      for (let i = 1; i <= 13; i++) {
        let box = 'textBox' + i;
        headers.push(data[0][box]);
      }
      headers = headers.map((item, index) => {
        return <th key={index}>{item}</th>
      })

      //get data for table
      tableData = data.map(item => {
        let tempValues = [];
        for (let i = 14; i <= 26; i++) {
          let box = 'textBox' + i;
          tempValues.push(item[box]);
        }
        return <tr>{tempValues.map(val=>{return <td>{val}</td>})}</tr>
      })*/

      //get data for current order
      orderData = data.filter(item => {
        return item.textBox14 === this.state.activeOrder
      }).map(item => {
        return <tr><td>{item.textBox19}</td><td>{item.textBox18}</td><td>{item.textBox21}</td><td>{item.textBox22}</td><td>{item.textBox23}</td></tr>
      })
    }
    return (
      <div className='container-fluid'>
        {! this.state.data &&
    <FileUploader handleUpload={this.handleUpload}/>
          }
      <Dashboard logo={this.state.logo} companyName={companyName} totalSpend={totalSpend} spendRemaining={spendRemaining} userData={userData} totalOrders={totalOrders} productsPurchased={productsPurchased} chartData={chartData} tooltipContent={tooltipContent} headers={headers} tableData={tableData} orderNumber={this.state.activeOrder} orderData={orderData} showModal={this.state.showModal} openModal={this.openModal} closeModal={this.closeModal} />
        </div>
    )
  }
}

export default App;
