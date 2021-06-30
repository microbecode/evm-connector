import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import "../styles/progress.scss";

type Props = {
  isProcessing?: boolean;
};

export function Progress({ isProcessing }: Props) {
  if (!isProcessing) return null;

  return (
    <div className="progress-container">
      <ProgressBar animated={true} now={100} title="Processing" />
      <span className="text-center progress-container progress-text">
        Processing...
      </span>
    </div>
  );
}
