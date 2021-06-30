import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

export function NFTDisclaimer(props: any) {
  return (
    <Modal {...props} size="lg" aria-labelledby="modal-nft" centered>
      <Modal.Header closeButton>
        <Modal.Title id="modal-nft" className="text-uppercase">
          Disclaimer
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Disclaimer

PLEASE READ

TODO</p>
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
