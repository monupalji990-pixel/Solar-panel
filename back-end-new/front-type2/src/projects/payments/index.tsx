import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { paymentReducer, paymentSaga, sliceKeyPayment } from "./redux/payments";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import { taskReducer, taskSaga, sliceKeyTask } from "projects/task/redux/task";

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
    useInjectReducer({ key: sliceKeyPayment, reducer: paymentReducer });
    useInjectSaga({ key: sliceKeyPayment, saga: paymentSaga }); 
    
    useInjectReducer({ key: sliceKeyTask, reducer: taskReducer });
    useInjectSaga({ key: sliceKeyTask, saga: taskSaga })


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
            <Switch>
                <Route
                    exact
                    path="/payments/admin/view"
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
                    path="/payments/management/view"
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
                    path="/payments/partner/view"
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
                    path="/payments/sales_rep/view"
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
    );
}
export default DashboardRoutes;
