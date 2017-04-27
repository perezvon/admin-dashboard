import React from 'react';
import './App.css';
import Papa from 'papaparse'
import {FileUploader} from './FileUploader'
import {Dashboard} from './Dashboard'
import _ from 'underscore'
import {currToNumber, sortCollection} from './global'
import moment from 'moment'
const customerFile = 'customers.json'
const orderFile = 'orders.json'
//const csv = 'sampledata.csv'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //need to set first four params dynamically based on logged-in user's group
      maxSpend: 500,
      logo: 'moorheadlogo.png',
      companyName: 'Moorhead Fire',
      CustomerGroupID: 1,
      showModal: false,
      activeOrder: 0,
      activeUser: '',
      reverse: true
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
      activeUser: '',
      showModal: true
    })
  }

  setActiveUser = (e) => {
    e.preventDefault();
    const user = e.target.parentNode.attributes.getNamedItem('data-user').value;
    this.setState({
      activeUser: user,
      activeOrder: 0,
      showModal: true
    })
  }

  sortFactor = (e) => {
    e.preventDefault();
    const sort = e.target.attributes.getNamedItem('data-sort').value;
    let reverseValue = this.state.reverse;
    switch (sort) {
      case 'Order Number':
        this.setState({
          lastSort: this.state.sort,
          sort: 'orderNumber',
          reverse: !reverseValue
        })
      break;
      case 'Order Date':
        this.setState({
          lastSort: this.state.sort,
          sort: 'date',
          reverse: !reverseValue
        })
      break;
      case 'Employee Name':
        this.setState({
          lastSort: this.state.sort,
          sort: 'name',
          reverse: !reverseValue
        })
      break;
      case 'Subtotal':
        this.setState({
          lastSort: this.state.sort,
          sort: 'subtotal',
          reverse: !reverseValue
        })
      break;
      case 'Tax':
        this.setState({
          lastSort: this.state.sort,
          sort: 'tax',
          reverse: !reverseValue
        })
      break;
      case 'Total':
        this.setState({
          lastSort: this.state.sort,
          sort: 'total',
          reverse: !reverseValue
        })
      break;
      case 'Shipping':
        this.setState({
          lastSort: this.state.sort,
          sort: 'shipping',
          reverse: !reverseValue
        })
      break;
      default:
        this.setState({
          lastSort: this.state.sort,
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
    const customersUrl = 'https://apirest.3dcart.com/3dCartWebAPI/v1/Orders';
    const accessToken = process.env.TOKEN ? process.env.TOKEN : '87dcb88f1619747fd8398aa6731cac15';
    const privateKey = process.env.KEY ? process.env.KEY : 'be6a6060c5b8d34baff6fef2d5902529';
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
    headers.append('SecureUrl', 'https://717418968211.3dcart.net');
    headers.append('PrivateKey', privateKey);
    headers.append('Token', accessToken);
    headers.append('cache-control', 'no-cache');
    console.log(headers.get('PrivateKey'))
    console.log(headers.get('Token'))
    let myInit = {
      method: 'GET',
      credentials: 'include',
      headers: headers,
    };
    fetch(customersUrl, myInit)
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(json => {
        return json.filter(item=>item.CustomerGroupID === this.state.CustomerGroupID)
      })
      .then(groupCustomers => {
      })
      .catch(err => {
        console.log(err)
        fetch(customerFile)
          .then(res => res.json())
          .then(json => {
            let groupCustomers = json.filter(item=>item.CustomerGroupID === this.state.CustomerGroupID).map(item=>item.CustomerID)
            this.setState({customersArray: groupCustomers});
          });
        fetch(orderFile)
          .then(res => res.json())
          .then(json => {
            let orderData = json.filter(item => this.state.customersArray.indexOf(item.CustomerID) !== -1)
            this.setData(orderData)
          })
        /*Papa.parse(csv, {
          download: true,
          header: true,
          complete: function(results) {
            this.setState({
              data: results.data
            })
          }.bind(this)
        });*/
      })



  }

  render() {
    console.log(this.state.customersArray)
    let data = this.state.data;
    console.log(data);
    let chartData = []
    let tooltipContent;
    let companyName = 'upload a csv file...';
    let companyTotal = 0;
    let totalSpend = '';
    let userData = '';
    let userHeaders, userSpendData;
    let totalOrders = '';
    let totalProductCount = 0;
    let productsPurchased = '';
    let orderTotals = [];
    let tableData;
    let headers = [];
    let totalSpendRemaining = 0;
    let spendRemaining;
    let modalData, modalTitle, orderData, userOrderData;
    let userTotals = [];
    let userDetails = [];

    if (data) {
      data = data.filter(item => !!item.textBox14).filter(item => item.textBox30 === this.state.companyName);
      //set company name
      companyName = this.state.companyName;

      //get unique orders && totals for each
      const uniqueOrders = [...new Set(data.map(item => item.textBox14))];
      if (!_.last(uniqueOrders)) uniqueOrders.pop();
      uniqueOrders.forEach(order => {
        for (let i = 0; i < data.length; i++) {
          if (order === data[i].textBox14 && !_.find(orderTotals, o => o.orderNumber === order )) {
            const orderTotal = currToNumber(data[i].textBox26);
            const orderNumber = data[i].textBox14;
            const orderDate = data[i].textBox15;
            const name = data[i].textBox16;
            const shipping = +currToNumber(data[i].textBox24);
            const tax = +currToNumber(data[i].textBox25);
            const subtotal = +(orderTotal - shipping - tax);
            orderTotals.push({
              orderNumber: orderNumber,
              date: moment(orderDate).format('MMMM D, YYYY'),
              name: name,
              subtotal: subtotal,
              shipping: shipping,
              tax: tax,
              total: orderTotal
            })
          }
        }
      })

      //get unique users && create dataset for each
      const uniqueUsers = [...new Set(data.map(item => item.textBox16))];
      if (!_.last(uniqueUsers)) uniqueUsers.pop();

      totalSpendRemaining = this.state.maxSpend * uniqueUsers.length;

      uniqueUsers.forEach(user => {
        let currentTotal = 0;
        let numOfOrders = 0;
        for (let i = 0; i < orderTotals.length; i++) {
          if (user === orderTotals[i].name) {
            numOfOrders++;
            currentTotal += orderTotals[i].total;
          }
        }

        if (currentTotal > this.state.maxSpend) currentTotal = this.state.maxSpend;
        companyTotal += currentTotal;
        totalSpendRemaining -= currentTotal;

        userTotals.push({
          name: user,
          orders: numOfOrders,
          total: currentTotal,
          spendRemaining: this.state.maxSpend - currentTotal
        })
      });

      let sortedOrders = sortCollection(orderTotals, this.state.sort, this.state.reverse);

      //format orders for order table
      headers = ['Order Number', 'Order Date', 'Employee Name', 'Subtotal', 'Shipping', 'Tax', 'Total'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
      tableData = sortedOrders.map((item, index) => {
        return <tr key={item.orderNumber} data-order={item.orderNumber} onClick={this.setActiveOrder}>{_.map(item, (i, key) => <td key={i}>{+i && key !== 'orderNumber' ? '$'+i.toFixed(2) : i}</td>)}</tr>
      })
      //format users for user spend table
      userHeaders = ['Name'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
      userSpendData = _.uniq(orderTotals, 'name').map((item, index) => {
        return <tr key={item.name} data-user={item.name} onClick={this.setActiveUser}>{_.map(item, (i, key) => {return key === 'name' ? <td key={i}>{i}</td> : null})}</tr>
      })

      //number of orders
      totalOrders = <h3>Number of Orders: <span className='green-text'>{orderTotals.length}</span></h3>

      //total products purchased
      totalProductCount = data.map(i => i.textBox22).reduce((a,b) => +a + +b);
      productsPurchased = <h3>Total Products Purchased: <span className='green-text'>{totalProductCount}</span> </h3>

      //sort user spend data for display
      userTotals = _.sortBy(userTotals, 'total').reverse();
      //format user spend data for chart
      chartData = userTotals.map(user => {return {'name': user.name,'total': user.total}})
      tooltipContent = chartData.map(item => {return {'name': item.name,'total': '$' + item.total.toFixed(2)}})
      //update UI
      totalSpend = <h2>Total Spend 2017: <span className='green-text'>${companyTotal.toFixed(2)}</span></h2>
      spendRemaining = <h2>Amount Remaining 2017: <span className='green-text'>${totalSpendRemaining.toFixed(2)}</span></h2>
      userData = userTotals.map((user, index) => {
        const textColor = user.total <= this.state.maxSpend ? 'green-text' : 'red-text';
        return <h3 key={index}>{user.name}: <span className={textColor}>${user.total.toFixed(2)}</span></h3>
      })

      //get data for current order
      orderData = data.filter(item => {
        return item.textBox14 === this.state.activeOrder
      }).map((item, index) => {
        return <tr key={index}><td>{item.textBox19}</td><td>{item.textBox18}</td><td>{item.textBox21}</td><td>{item.textBox22}</td><td>{item.textBox23}</td></tr>
      })

      userOrderData = data.filter(item => {
        return item.textBox16 === this.state.activeUser
      }).map((item, index) => {
        return <tr key={index}><td>{item.textBox19}</td><td>{item.textBox18}</td><td>{item.textBox21}</td><td>{item.textBox22}</td><td>{item.textBox23}</td></tr>
      })
      userDetails = _.first(userTotals.filter(item => item.name === this.state.activeUser));

      modalData = this.state.activeOrder !== 0 ? orderData : userOrderData;
      modalTitle = this.state.activeOrder !== 0 ? 'Order #' + this.state.activeOrder : 'Shopper Profile for ' + this.state.activeUser;

    }

    return (
      <div className='container-fluid'>
        {! this.state.data &&
    <FileUploader handleUpload={this.handleUpload}/>
          }
      <Dashboard logo={this.state.logo} companyName={companyName} totalSpend={totalSpend} spendRemaining={spendRemaining} userData={userData} userHeaders={userHeaders} userSpendData={userSpendData} totalOrders={totalOrders} productsPurchased={productsPurchased} chartData={chartData} tooltipContent={tooltipContent} headers={headers} tableData={tableData} modalTitle={modalTitle} modalData={modalData} userDetails={userDetails} showModal={this.state.showModal} openModal={this.openModal} closeModal={this.closeModal} />
        </div>
    )
  }
}

export default App;
