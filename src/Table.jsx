import React from 'react';
export const Table = ({headers, tableData}) => (
      <table className='table table-responsive table-hover table-bordered table-striped'>
          <thead className='thead-default'><tr>{headers}</tr></thead>
          <tbody><tr></tr>{tableData}</tbody>
        </table>
    )
