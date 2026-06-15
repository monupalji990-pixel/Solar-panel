import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";

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
                        path="/import-export/admin"
                        render={route => (
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
                        path="/import-export/management"
                        render={route => (
                            <Common
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
