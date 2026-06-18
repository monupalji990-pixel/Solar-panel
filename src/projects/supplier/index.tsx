import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { sliceKeySupplier, supplierReducer, supplierSaga } from "./redux/supplier";
import { sliceKeySupplier_contact, supplier_contactReducer, supplier_contactSaga } from "./sections/contact/redux/supplier_contact";

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
  useInjectReducer({ key: sliceKeySupplier, reducer: supplierReducer });
  useInjectSaga({ key: sliceKeySupplier, saga: supplierSaga })

  useInjectReducer({ key: sliceKeySupplier_contact, reducer: supplier_contactReducer });
  useInjectSaga({ key: sliceKeySupplier_contact, saga: supplier_contactSaga })

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
            path="/supplier/admin/view"
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
            path="/supplier/management/view"
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
            path="/supplier/sales_rep/view"
            render={(route) => (
              <Common
                {...route}
                slug="sales_rep"
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
