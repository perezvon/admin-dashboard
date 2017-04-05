import React from 'react';
import rd3 from 'react-d3';
import './Dashboard.css';
import {Table} from './Table'


let PieChart = rd3.PieChart;

export const Dashboard = ({data, companyName, totalSpend, userData, pieData}) => (
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
