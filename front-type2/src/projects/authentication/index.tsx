import React from "react";
import { Switch, Route } from "react-router-dom";
import { Login } from "./loadable/login";
import { ChangePass } from "./loadable/changePass";
import { ForgotPass } from "./loadable/forgotPass";
export default function Index(props) {
  return (
    <Switch>
      <Route path="/auth/change-pass" component={ChangePass} />
      <Route path="/auth/forgot-pass" component={ForgotPass} />
      <Route path="/auth/login" component={Login} />
    </Switch>
  );
}
