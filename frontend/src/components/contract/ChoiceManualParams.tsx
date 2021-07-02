import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

interface Props {
    
  }

export function ChoiceManualParams(props : Props) {
  const [funcSignature, setFuncSignature] = useState<string>('');

  return (
    <Row>
        <Col>
        Function signature to call:
        </Col>
        <Col>
            <Form.Control
            type="text"
            required
            value={funcSignature}
            onChange={e => { setFuncSignature(e.target.value) }}
            placeholder="Enter function signature"
            />              
        </Col>
    </Row>
  );
}
