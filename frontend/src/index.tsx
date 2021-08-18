import React from "react";
import ReactDOM from "react-dom";
import { RouterElem } from "./router/RouterElem";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";

ReactDOM.render(
  <React.StrictMode>
    <RouterElem />
  </React.StrictMode>,
  document.getElementById("root"),
);
