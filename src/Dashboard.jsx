import React from 'react';
import {Button} from 'react-bootstrap'
import './Dashboard.css';
import {Table} from './Table'
import {UserSpendChart} from './UserSpendChart'
import {Logo} from './Logo'
import {DetailModal} from './DetailModal'
import {FilterDropdown} from './FilterDropdown'

export const Dashboard = ({logo, companyName, totalSpend, spendRemaining, userData, userHeaders, userSpendData, totalOrders, productsPurchased, chartData, tooltipContent, headers, tableData, modalTitle, modalData, userDetails, showModal, openModal, closeModal, filter, dropdownItems, handleFilter, logout}) => (
      <div>
          <div className='row'>
           <div className='col-md-10'>
          <h1><Logo logo={logo}/> {companyName}</h1>
            </div>
            <div className='col-md-2'>
            <Button bsStyle='warning' onClick={logout}>Logout</Button>
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
                <UserSpendChart chartData={chartData} tooltipContent={tooltipContent} />
              </div>
            </div>
            {/*<FilterDropdown filter={filter} dropdownItems={dropdownItems} handleFilter={handleFilter}/>*/}
            <div className='col-md-6'>
            <Table headers={userHeaders} tableData={userSpendData} />
            </div>
           <Table headers={headers} tableData={tableData} />
           <DetailModal modalTitle={modalTitle} modalData={modalData} userDetails={userDetails} showModal={showModal} openModal={openModal} closeModal={closeModal} />
            </div>
           }
      </div>
    )
