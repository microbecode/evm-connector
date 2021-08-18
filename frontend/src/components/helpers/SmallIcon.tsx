import { useRef, useState } from "react";
import { Button, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../styles/smallIcon.scss";

type Props = {
  imageUrl: string;
  tooltip: string;
  onClick: () => void;
};

export const SmallIcon = ({ imageUrl, tooltip, onClick }: Props) => {
  const placement = "right";
  return (
    <>
      <OverlayTrigger
        key={placement}
        placement={placement}
        overlay={<Tooltip id={`tooltip-${placement}`}>{tooltip}</Tooltip>}
      >
        <img src={imageUrl} onClick={onClick} />
      </OverlayTrigger>
    </>
  );
};
