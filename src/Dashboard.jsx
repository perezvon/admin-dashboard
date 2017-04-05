import React from 'react';
import rd3 from 'react-d3';
import './Dashboard.css';
import {currToNumber} from './global'
import {Table} from './Table'
import _ from 'underscore'

let PieChart = rd3.PieChart;

export const Dashboard = ({data, maxSpend}) => {
    let pieData = []
    let companyName = 'upload a csv file...';
    let total = 0;
    let totalSpend = '';
    let userTotals = [],
      userData = '';
    if (data) {
      //set company name
      companyName = data[0].textBox30;

      //get unique users and total the spend of each
      const uniqueUsers = [...new Set(data.map(item => item.textBox16))];
      uniqueUsers.forEach(user => {
        let currentTotal = 0;
        for (let i = 0; i < data.length; i++) {
          if (user && user === data[i].textBox16) currentTotal += currToNumber(data[i].textBox23);
        }
        if (user) userTotals.push({
          name: user,
          amount: currentTotal
        });
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
              'order': order,
              'total': orderTotal
            })
            total += orderTotal
          }
        }
      })



      //format user spend data for chart
      pieData = userTotals.map(item => {return {'label': item.name,'value': (item.amount / total * 100).toFixed(2)}})
      //update UI
      totalSpend = <h2>Total Spend 2017: <span className='green-text'>${total.toFixed(2)}</span></h2>
      userData = userTotals.map((user, index) => {
        const textColor = user.amount <= maxSpend ? 'green-text' : 'red-text';
        return <h3 key={index}>{user.name}: <span className={textColor}>${user.amount.toFixed(2)}</span></h3>
      })
    }
    return (
      <div>
          <div className='row'>
           <div className='col-md-12'>
          <h1>{companyName}</h1>
            </div>
          </div>
          {data &&
            <div>
            <div className='row'>
              <div className='col-md-6'>
                {totalSpend}
                {userData}
                </div>
              <div className='col-md-6'>
                <PieChart
                  data={pieData}
                  width={400}
                  height={400}
                  radius={100}
                  innerRadius={20}
                  sectorBorderColor="white"
                  title="User Spend"
                />
              </div>
            </div>
           <Table data={data} />
            </div>
           }
      </div>
    )
}
