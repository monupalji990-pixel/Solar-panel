import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { renewalReducer, renewalSaga, sliceKeyRenewal } from "./Redux/renewal";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import NotFoundPage from "../../sharedUtils/sharedSections/404";

const styles = makeStyles((theme) => ({
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    marginBottom: "4rem",
  },
  drawerOpen: {
    marginLeft: "240px",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
  },
  drawerClose: {
    marginLeft: theme.spacing(7) + 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.standard,
    }),
  },
}));

function DashboardRoutes(props) {
  useInjectReducer({ key: sliceKeyRenewal, reducer: renewalReducer });
  useInjectSaga({ key: sliceKeyRenewal, saga: renewalSaga });

  let classes = styles();
  const dispatch = useDispatch();
  const [breadCrumbsOpt, setBreadCrumbsOpt] = useState([{ name: "/" }]);
  const setBreadCrumbs = (array) => {
    if (JSON.stringify(array) != JSON.stringify(breadCrumbsOpt)) {
      setBreadCrumbsOpt(array);
      dispatch(globalConfigActions.changeBreadCrumbs(array));
    }
  };
  return (
    <main className={classes.drawerClose} id="headerSpace">
      <BreadCrumbs />

      <Switch>
        <Route
          exact
          path="/renewal/admin/view"
          render={(route) => (
            <Common
              {...route}
              type="renewal"
              slug="admin"
              {...props}
              setBreadCrumbs={setBreadCrumbs}
            />
          )}
        />
        <Route
          exact
          path="/renewal/management/view"
          render={(route) => (
            <Common
              {...route}
              type="renewal"
              slug="management"
              {...props}
              setBreadCrumbs={setBreadCrumbs}
            />
          )}
        />
        <Route
          exact
          path="/renewal/partner/view"
          render={(route) => (
            <Common
              {...route}
              type="renewal"
              slug="partner"
              {...props}
              setBreadCrumbs={setBreadCrumbs}
            />
          )}
        />
        <Route
          exact
          path="/renewal/sales_rep/view"
          render={(route) => (
            <Common
              {...route}
              type="renewal"
              slug="sales_rep"
              {...props}
              setBreadCrumbs={setBreadCrumbs}
            />
          )}
        />

        <Route component={NotFoundPage} />
      </Switch>
    </main>
  );
}
export default DashboardRoutes;
