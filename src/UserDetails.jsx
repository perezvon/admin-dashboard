import React from 'react'

export const UserDetails = ({userDetails}) => (
  <div>
    <h2>Total Spend: <span className='green-text'>${userDetails.total.toFixed(2)}</span></h2>
    <h2>Spend Remaining: <span className='green-text'>${userDetails.spendRemaining.toFixed(2)}</span></h2>
    <h2>Number of Orders: <span className='green-text'>{userDetails.orders}</span></h2>
  </div>
)
