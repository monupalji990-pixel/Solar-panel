import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import {
  globalConfigActions,
} from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/common";
import { useDispatch } from "react-redux";
import { appointmentReducer, appointmentSaga, sliceKeyAppointment } from "../appointment/redux/appointment";

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
    // background: '#1A233A',
  },
}));

function DashboardRoutes(props) {
  useInjectReducer({ key: sliceKeyAppointment, reducer: appointmentReducer });
  useInjectSaga({ key: sliceKeyAppointment, saga: appointmentSaga })

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
    <>
      <main className={classes.drawerClose} id="headerSpace">
        <BreadCrumbs showingFor="dashboard" />
        <Switch>
          <Route
            exact
            path="/dashboard/admin"
            render={(route) => (
              <Common
                {...route}
                slug="admin"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/dashboard/management"
            render={(route) => (
              <Common
                {...route}
                slug="management"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/dashboard/partner"
            render={(route) => (
              <Common
                {...route}
                slug="partner"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/dashboard/sales_rep"
            render={(route) => (
              <Common
                {...route}
                slug="sales_rep"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/dashboard/observing_partner"
            render={(route) => (
              <Common {...route} {...props} setBreadCrumbs={setBreadCrumbs} />
            )}
          />
          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </>
  );
}
export default DashboardRoutes;
