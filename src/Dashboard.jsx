import React from 'react';
import './Dashboard.css';
import {Table} from './Table'
import {UserSpendChart} from './UserSpendChart'
import {Logo} from './Logo'
import {OrderDetails} from './OrderDetails'

export const Dashboard = ({logo, companyName, totalSpend, spendRemaining, userData, totalOrders, productsPurchased, chartData, tooltipContent, headers, tableData, orderNumber, orderData, showModal, openModal, closeModal}) => (
      <div>
          <div className='row'>
           <div className='col-md-12'>
          <h1><Logo logo={logo}/> {companyName}</h1>

            </div>
          </div>
          {userData &&
            <div>
            <div className='row'>
              <div className='col-md-6'>
                {totalSpend}
                {spendRemaining}
                {totalOrders}
                {productsPurchased}
                </div>
              <div className='col-md-6'>
                <UserSpendChart chartData={chartData} />
              </div>
            </div>
           <Table headers={headers} tableData={tableData} tooltipContent={tooltipContent} />
           <OrderDetails orderNumber={orderNumber} orderData={orderData} showModal={showModal} openModal={openModal} closeModal={closeModal} />
            </div>
           }
      </div>
    )
