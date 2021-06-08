import * as React from "react";
import { Route, Switch } from "react-router-dom";


import { Callback } from "../contexts/TwitchContext/callback";
import { Logout } from "../contexts/TwitchContext/logout";
import { LogoutCallback } from "../contexts/TwitchContext/logoutCallback";
import { PrivateRoute } from "./PrivateRoute";
// import { Register } from "../TwitchContext/register";
import { SilentRenew } from "../contexts/TwitchContext/silentRenew";
import Catcher from "../components/Catcher/Catcher"
import MainView from "../pages/MainView";
// import {PrivatePage} from "../components/privatePage"


export const Routes = (
    <Switch>
        <Route exact={true} path="/signin-oidc" component={Callback} />
        <Route exact={true} path="/logout" component={Logout} />
        <Route exact={true} path="/logout/callback" component={LogoutCallback} />
        {/* <Route exact={true} path="/register" component={Register} /> */}
        <Route exact={true} path="/silentrenew" component={SilentRenew} />
        <PrivateRoute path="/" component={MainView} />
    </Switch>
);