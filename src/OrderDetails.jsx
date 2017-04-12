import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

export const OrderDetails = ({orderNumber, orderData, showModal, openModal, closeModal}) => (
  <Modal show={showModal} onHide={closeModal} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Order #{orderNumber}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                {orderData}
              </tbody>
            </table>
          </Modal.Body>
       <Modal.Footer>
         <Button onClick={closeModal}>Close</Button>
       </Modal.Footer>
     </Modal>
)
