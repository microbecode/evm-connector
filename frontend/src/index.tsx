import React from "react";
import ReactDOM from "react-dom";
import { Router } from "./router/Router";

import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root"),
);
