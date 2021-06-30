import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export function PrivacyPolicy(props: any) {
  return (
    <Modal {...props} size="lg" aria-labelledby="modal-pp" centered>
      <Modal.Header closeButton>
        <Modal.Title id="modal-pp" className="text-uppercase">
          Privacy Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Some text here...</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          variant="primary-outline"
          className="d-block"
        >
          I Understand
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
