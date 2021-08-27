import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import "../../styles/smallIcon.scss";

type Props = {
  imageUrl: string;
  tooltip: string;
  onClick: () => void;
};

export const SmallIcon = ({ imageUrl, tooltip, onClick }: Props) => {
  return (
    <>
      <Button onClick={onClick} title={tooltip} className={"tooltipbtn"}>
        <img src={imageUrl} />
      </Button>
    </>
  );
};
