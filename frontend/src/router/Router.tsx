import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Dapp } from "../components/Dapp";

export function Router() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Dapp} />
        <Redirect to="/" />
      </Switch>
    </HashRouter>
  );
}
