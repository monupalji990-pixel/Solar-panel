import React, { lazy } from "react";
import NotAuthorized from "../sharedComponents/notAuthorize";
import WaitAuthorizing from "../sharedComponents/wailAuthorize";
import {
  selectLogged,
  selectLoggedUser,
} from "../../projects/authentication/redux/auth";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "../sharedComponents/loader";

export default function AuthorizedRoute(props) {
  const logged = useSelector(selectLogged);
  const userData = useSelector(selectLoggedUser);
  if (logged == "pass") {
    const container = userData.role.containers,
      path = location.pathname;
    if (container.filter((v) => path.indexOf(v.container) >= 0).length > 0) {
      const routings: any = [];
      if (props.dashboard) {
        routings.push(<Route component={Loader} />);
      }

      routings.push(<Route path={props.path} component={props.component} />);

      return routings.map((v) => v);
    } else {
      return (
        <Route path={props.path}>
          <NotAuthorized />
        </Route>
      );
    }

  } else if (logged == "wait") {
    return (
      <Route path={props.path}>
        <WaitAuthorizing />
      </Route>
    );
  } else if (logged == "fail") {
    location.replace("/auth/login");
    return (
      <Route path={props.path}>
        <WaitAuthorizing />
      </Route>
    );
  } else {
    return (
      <Route path={props.path}>
        <NotAuthorized />
      </Route>
    );
  }
}
AuthorizedRoute.prototype = {
  path: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired,
  dashboard: PropTypes.bool.isRequired,
};
