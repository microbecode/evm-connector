import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

interface Props {
    
  }

export function ChoiceFuncSignature(props : Props) {
  const [funcSignature, setFuncSignature] = useState<string>('');

  return (
    <Row>
        <Col>
        Add function parameter
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
