import {
  HashRouter,
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { Dapp } from "../components/Dapp";

export function RouterElem() {
  return (
    <Router>
      <Switch>
        <Route path="/view/:contract" component={Dapp} />
        <Route path="/*" component={Dapp} />

        {/* <Route path="/parsed" children={<Dapp />} /> */}
      </Switch>

      {/*   <Switch>
        <Route exact path="/" component={Dapp} />
        <Redirect to="/" />
      </Switch> */}
    </Router>
  );
}
