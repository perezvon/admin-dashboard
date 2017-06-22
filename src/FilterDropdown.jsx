import React from 'react'
import {DropdownButton, MenuItem} from 'react-bootstrap'

export const FilterDropdown = ({filter, dropdownItems, handleFilter}) => (
  <div>
    <DropdownButton bsSize='large' title={filter} id='filterBy' onSelect={handleFilter}>
      <MenuItem eventKey='all'>All</MenuItem>
      <MenuItem divider />
      {dropdownItems}
    </DropdownButton>
  </div>
)
