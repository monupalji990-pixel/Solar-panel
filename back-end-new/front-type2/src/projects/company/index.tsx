import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { companyReducer, companySaga, sliceKeyCompany } from "./redux/company";

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
  useInjectReducer({ key: sliceKeyCompany, reducer: companyReducer });
  useInjectSaga({ key: sliceKeyCompany, saga: companySaga })

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
            path="/company/admin/view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="normal"
                slug="admin"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/admin/live_view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="live"
                slug="admin"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/management/view"
            render={route => (
              <Common
                {...route}
                companyType="normal"
                slug="management"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/management/live_view"
            render={route => (
              <Common
                {...route}
                companyType="live"
                slug="management"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/partner/view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="normal"
                slug="partner"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/partner/live_view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="live"
                slug="partner"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/sales_rep/view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="normal"
                slug="sales_rep"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/observing_partner/view"
            render={route => (
              <Common
                {...route}
                {...props}
                companyType="normal"
                slug="observing_partner"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/service_partner/view"
            render={route => (
              <Common
                {...route}
                companyType="normal"
                slug="service_partner"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/installer/view"
            render={route => (
              <Common
                {...route}
                companyType="normal"
                slug="installer"
                {...props}
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />
          <Route
            exact
            path="/company/surveyor/view"
            render={route => (
              <Common
                {...route}
                companyType="normal"
                slug="surveyor"
                {...props}
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
