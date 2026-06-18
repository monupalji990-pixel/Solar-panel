import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { taskReducer, taskSaga, sliceKeyTask } from "../task/redux/task";
import './assets/taskBoard.css';

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
    useInjectReducer({ key: sliceKeyTask, reducer: taskReducer });
    useInjectSaga({ key: sliceKeyTask, saga: taskSaga })

    let classes = styles();
    const dispatch = useDispatch();

    return (
        <>
            <main className={classes.drawerClose}>
                <Switch>
                    <Route
                        exact
                        path="/task-board/admin/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="admin"

                                {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/task-board/management/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="management"

                                {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/task-board/partner/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="partner"

                                {...props} />
                        )}
                    />
                    <Route
                        exact
                        path="/task-board/sales_rep/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="sales_rep"

                                {...props} />
                        )}
                    />
                    <Route component={NotFoundPage} />
                </Switch>
            </main>
        </>
    );
}
export default DashboardRoutes;
