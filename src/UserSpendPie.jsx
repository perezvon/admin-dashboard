import React from 'react';

export const UserSpendPie = ({data}) => {
    let mappedData = data.map(item => <li>{item.textBox23}</li>);
    return (
      <div><ul>
     {mappedData}
      </ul>
     </div>
    )
}
