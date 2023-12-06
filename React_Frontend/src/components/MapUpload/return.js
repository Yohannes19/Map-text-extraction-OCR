import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

const ReturnHomeButton = ({ onClick }) => (
  <Button variant="primary" onClick={onClick}>
   <ArrowLeft/> Return to Home
  </Button>
);

export default ReturnHomeButton;
