import React from "react";
import { Card } from "react-bootstrap";

import "../../styles/helperItem.scss";

type Props = {
  title: string;
  desc: string;
  img: string;
};

export function HelperItem({ title, desc, img }: Props) {
  return (
    <Card className="helper-item-container mx-0 mb-5 border-0">
      <div className="img-container">
        <Card.Img variant="top" src={img} />
      </div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}
