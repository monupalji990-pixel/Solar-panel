import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { consumerReducer, consumerSaga, sliceKeyConsumer } from "./redux/consumer";
import {
  sliceKeyUserAdmin,
  UserAdminReducer,
  userAdminSaga,
} from "../users/redux/userAdmin";

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
  useInjectReducer({ key: sliceKeyConsumer, reducer: consumerReducer });
  useInjectSaga({ key: sliceKeyConsumer, saga: consumerSaga })

  useInjectReducer({ key: sliceKeyUserAdmin, reducer: UserAdminReducer });
  useInjectSaga({ key: sliceKeyUserAdmin, saga: userAdminSaga });

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
        <BreadCrumbs />
        <Switch>
          <Route
            exact
            path="/consumer/admin/view"
            render={route => (
              <Common
                {...route}
                toast={null}
                type="consumer"
                slug="admin"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/partner/view"
            render={route => (
              <Common
                {...route}
                {...props}
                consumerType="normal"
                slug="partner"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/management/view"
            render={route => (
              <Common
                {...route}
                consumerType="normal"
                slug="management"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/sales_rep/view"
            render={route => (
              <Common
                {...route}
                {...props}
                consumerType="normal"
                slug="sales_rep"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/observing_partner/view"
            render={route => (
              <Common
                {...route}
                {...props}
                consumerType="normal"
                slug="observing_partner"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/installer/view"
            render={route => (
              <Common
                {...route}
                {...props}
                consumerType="normal"
                slug="installer"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/consumer/surveyor/view"
            render={route => (
              <Common
                {...route}
                {...props}
                consumerType="normal"
                slug="surveyor"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route component={NotFoundPage} />
        </Switch>
      </main>
    </>
  );
}
export default DashboardRoutes;
