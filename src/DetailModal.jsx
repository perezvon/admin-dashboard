import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import {UserDetails} from './UserDetails';

export const DetailModal = ({modalTitle, modalData, showModal, openModal, closeModal, userDetails}) => (
  <Modal show={showModal} onHide={closeModal} bsSize='large' aria-labelledby='contained-modal-title-lg'>
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-lg' className='h2'>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userDetails &&
            <UserDetails userDetails={userDetails} />
            }
            <table className='table table-responsive table-bordered table-striped'>
              <thead className='thead-default'>
                <tr>
                  <th>Product Number</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>QTY</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {modalData}
              </tbody>
            </table>
          </Modal.Body>
       <Modal.Footer>
         <Button onClick={closeModal}>Close</Button>
       </Modal.Footer>
     </Modal>
)
