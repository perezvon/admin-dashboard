import React from 'react';
export const Table = ({data}) => {
    //extract header titles
    let headers = [];
    for (let i = 1; i <= 13; i++) {
      let box = 'textBox' + i;
      headers.push(data[0][box]);
    }
    headers = headers.map((item, index) => {
      return <th key={index}>{item}</th>
    })

    //get data
    const tableData = data.map(item => {
      let tempValues = [];
      for (let i = 14; i <= 26; i++) {
        let box = 'textBox' + i;
        tempValues.push(item[box]);
      }
      return <tr>{tempValues.map(val=>{return <td>{val}</td>})}</tr>
    })
    return (
      <table className='table table-responsive table-bordered table-striped'>
          <thead className='thead-default'><tr>{headers}</tr></thead>
          <tbody><tr></tr>{tableData}</tbody>
        </table>
    )
}
