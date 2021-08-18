import { useRef, useState } from "react";
import { Button, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../../styles/smallIcon.scss";
import { SmallIcon } from "./SmallIcon";
import CopyImg from "../../images/copy.png";

type Props = {
  textToCopy: string;
};

export const CopyToClipboard = ({ textToCopy }: Props) => {
  const onClick = () => {
    navigator.clipboard.writeText(textToCopy);
  };
  return (
    <>
      <SmallIcon
        imageUrl={CopyImg}
        tooltip={"Copy to clipboard"}
        onClick={onClick}
      ></SmallIcon>
    </>
  );
};
