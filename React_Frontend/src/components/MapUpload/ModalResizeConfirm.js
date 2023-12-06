// ConfirmationModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onClose, onConfirm }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Resize</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>The dimensions of the original and reproduced images are different.</p>
      <p>Do you want to resize the images to match?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        Resize and Proceed
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmationModal;
