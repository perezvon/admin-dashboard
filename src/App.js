import React from 'react';
import './App.css';
import {Dashboard} from './Dashboard'
import Loading from 'react-loading'
import _ from 'underscore'
import Auth0Lock from 'auth0-lock'
import {sortCollection, getCompanyInfo, getCustomerGroupID} from './global'
import moment from 'moment'

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_KEY,
  'perezvon.auth0.com',
  {
    allowedConnections: ['Username-Password-Authentication'],
    languageDictionary: {
      usernameOrEmailInputPlaceholder: 'username',
      title: 'Quartermaster Dashboard'
    }
  }
);

lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) {
      console.log(error)
      return;
    }
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('username', profile.username);
  });
});

const token = localStorage.getItem('accessToken');
const username = localStorage.getItem('username');
const currentId = getCustomerGroupID(username);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      activeOrder: 0,
      activeUser: '',
      reverse: true
    };
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

  logout = () => {
    lock.logout();
  }

  componentDidMount = () => {
    if (token) {
          fetch('/api/orders/' + currentId)
            .then(res => res.json())
            .then(json => {
              console.log(json)
              let orderData = json.filter(item => {console.log(item);
                return item.OrderStatusID !== 7})
              this.setData(orderData)
              this.setState(getCompanyInfo(currentId))
            })
        .catch(err => {
          console.log(err)
        })
      }
  }

  render() {
    if (token) {
    let data = this.state.data;
    let chartData = []
    let tooltipContent;
    let companyName = this.state.companyName;
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
    if (data && data !== []) {
      //populate orders array
      data.forEach(i => {
        let orderNumber = i.InvoiceNumberPrefix + i.InvoiceNumber;
        let date = moment(i.OrderDate).format('MMMM DD, YYYY');
        let username = i.BillingFirstName + ' ' + i.BillingLastName;
        let shipping = i.ShipmentList[0].ShipmentCost;
        let tax = i.SalesTax;
        let total = i.OrderAmount;
        let subtotal = total - shipping - tax;
        orderTotals.push({
          orderNumber: orderNumber,
          date:date,
          name: username,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total
        })
      });

      //get unique users && create dataset for each
      const uniqueUsers = [...new Set(data.map(item => item.CustomerID))];
      totalSpendRemaining = this.state.maxSpend * uniqueUsers.length;

      uniqueUsers.forEach(user => {
        let userName = data.filter(i=>i.CustomerID === user);
        userName = userName ? userName[0].BillingFirstName + ' ' + userName[0].BillingLastName : ''
        let currentTotal = 0;
        let numOfOrders = 0;
        for (let i = 0; i < data.length; i++) {
          if (user === data[i].CustomerID) {
            numOfOrders++;
            currentTotal += data[i].OrderAmount;
          }
        }

        if (currentTotal > this.state.maxSpend) currentTotal = this.state.maxSpend;
        companyTotal += currentTotal;
        totalSpendRemaining -= currentTotal;

        userTotals.push({
          name: userName,
          orders: numOfOrders,
          total: currentTotal,
          spendRemaining: this.state.maxSpend - currentTotal
        })
      });

      let sortedOrders = sortCollection(orderTotals, this.state.sort, this.state.reverse);

      //format orders for order table
      headers = ['Order Number', 'Order Date', 'Employee Name', 'Subtotal', 'Shipping', 'Tax', 'Total'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
      tableData = sortedOrders.map((item, index) => {
        return <tr key={item.orderNumber} data-order={item.orderNumber} onClick={this.setActiveOrder}>{_.map(item, (i, key) => <td key={key}>{+i ? '$'+i.toFixed(2) : i}</td>)}</tr>
      })
      //format users for user spend table
      userHeaders = ['Name'].map((item, index) => <th key={index} data-sort={item} onClick={this.sortFactor}>{item}</th>);
      userSpendData = _.uniq(orderTotals, 'name').map((item, index) => {
        return <tr key={item.name} data-user={item.name} onClick={this.setActiveUser}>{_.map(item, (i, key) => {return key === 'name' ? <td key={i}>{i}</td> : null})}</tr>
      })

      //number of orders
      totalOrders = <h3>Number of Orders: <span className='green-text'>{data.length}</span></h3>

      //total products purchased
      totalProductCount = _.flatten(data.map(i => i.OrderItemList)).map(i => i.ItemQuantity).reduce((a,b) => a + b);
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
      if (this.state.activeOrder !== 0) {
        orderData = data.filter(item => {
          return item.InvoiceNumber === +this.state.activeOrder.slice(3,7);
        }).map(item => item.OrderItemList)
          orderData = _.flatten(orderData).map((item, index) => {
            //strip html and options from item description
            let description = item.ItemDescription.split('<', 1)[0];
          return <tr key={index}><td>{item.ItemID}</td><td>{description}</td><td>${item.ItemUnitPrice.toFixed(2)}</td><td>{item.ItemQuantity}</td><td>${(item.ItemUnitPrice * item.ItemQuantity).toFixed(2)}</td></tr>
        })
    }

      //get data for current customer
      if (this.state.activeUser) {
        userOrderData = data.filter(item => {
          return item.BillingFirstName + ' ' + item.BillingLastName === this.state.activeUser
        }).map(item => item.OrderItemList)
          userOrderData = _.flatten(userOrderData).map((item, index) => {
            let description = item.ItemDescription.split('<', 1)[0];
            return <tr key={index}><td>{item.ItemID}</td><td>{description}</td><td>${item.ItemUnitPrice.toFixed(2)}</td><td>{item.ItemQuantity}</td><td>${(item.ItemUnitPrice * item.ItemQuantity).toFixed(2)}</td></tr>
          })
    }
      userDetails = _.first(userTotals.filter(item => item.name === this.state.activeUser));

      modalData = this.state.activeOrder !== 0 ? orderData : userOrderData;
      modalTitle = this.state.activeOrder !== 0 ? 'Order #' + this.state.activeOrder : 'Shopper Profile for ' + this.state.activeUser;

    return (
      <div className='container-fluid'>
        <Dashboard
          logo={this.state.logo}
          companyName={companyName}
          totalSpend={totalSpend}
          spendRemaining={spendRemaining}
          userData={userData}
          userHeaders={userHeaders}
          userSpendData={userSpendData}
          totalOrders={totalOrders}
          productsPurchased={productsPurchased}
          chartData={chartData}
          tooltipContent={tooltipContent}
          headers={headers}
          tableData={tableData}
          modalTitle={modalTitle}
          modalData={modalData}
          userDetails={userDetails}
          showModal={this.state.showModal}
          openModal={this.openModal}
          closeModal={this.closeModal}
        />
      </div>
    )
    } else {
      return (
        <div className='container-fluid'>
          <Loading type='cylon'/>
      </div>
    )}

  } else {
    lock.show()
  }
}
}

export default App;
