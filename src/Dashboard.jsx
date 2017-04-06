import React from 'react';
import './Dashboard.css';
import {Table} from './Table'
import {UserSpendChart} from './UserSpendChart'

export const Dashboard = ({companyName, totalSpend, userData, chartData, tooltipContent, headers, tableData}) => (
      <div>
          <div className='row'>
           <div className='col-md-12'>
          <h1>{companyName}</h1>
            </div>
          </div>
          {userData &&
            <div>
            <div className='row'>
              <div className='col-md-6'>
                {totalSpend}
                {userData}
                </div>
              <div className='col-md-6'>
                <UserSpendChart chartData={chartData} />
              </div>
            </div>
           <Table headers={headers} tableData={tableData} tooltipContent={tooltipContent} />
            </div>
           }
      </div>
    )
