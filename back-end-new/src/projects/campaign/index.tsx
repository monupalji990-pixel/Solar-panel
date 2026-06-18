import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
//import { sliceKeyUserAdmin, UserAdminReducer, userAdminSaga } from "./redux/userAdmin";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
/* import { AdminDashboard } from "./loadable/dashboardForAdmin";
import { ManagementDashboard } from "./loadable/dashboardForManagement";
import { SalesRepDashboard } from "./loadable/dashboardForSalesRep";
import { PartnerDashboard } from "./loadable/dashboardForPartner"; */
import { ManageCampaign as Common } from "./loadable/manageCampaign";
import { Combine as Common2 } from './pages/combine';
import { useDispatch } from "react-redux";
import { campaignReducer, campaignSaga, sliceKeyCampaign } from "./redux/campaign";



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
  useInjectReducer({ key: sliceKeyCampaign, reducer: campaignReducer });
  useInjectSaga({ key: sliceKeyCampaign, saga: campaignSaga })

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
        {/*     <div className={classes.toolbar} />  */}
        <BreadCrumbs />
        <Switch>
          <Route
            exact
            path="/campaign/admin/view"
            render={route => (
              <Common2
                {...route}
                {...props}

                slug="admin"
                setBreadCrumbs={setBreadCrumbs}
              />
            )}
          />

          <Route
            exact
            path="/campaign/management/view"
            render={route => (
              <Common2
                {...route}
                slug="management"
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
