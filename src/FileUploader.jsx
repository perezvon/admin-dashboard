import React from 'react';
export const FileUploader = ({handleUpload}) => (
      <div className='row'><div className='col-md-12'><input id='fileUpload' type='file' onChange={handleUpload}></input></div></div>
)
