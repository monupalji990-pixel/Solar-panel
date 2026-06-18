import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import NotFoundPage from "../../sharedUtils/sharedSections/404";
import BreadCrumbs from "../../sharedUtils/sharedComponents/breadcrunmbs";
import { globalConfigActions } from "../../sharedUtils/sharedRedux/configuration";
import { Common } from "./loadable/Common";
import { useDispatch } from "react-redux";
import { appointmentReducer, appointmentSaga, sliceKeyAppointment } from "./redux/appointment";
import { taskReducer, taskSaga, sliceKeyTask } from "../task/redux/task";

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

function AppointmentRouters(props) {
    useInjectReducer({ key: sliceKeyAppointment, reducer: appointmentReducer });
    useInjectSaga({ key: sliceKeyAppointment, saga: appointmentSaga })
    useInjectReducer({ key: sliceKeyTask, reducer: taskReducer });
    useInjectSaga({ key: sliceKeyTask, saga: taskSaga })

    let classes = styles();
    const dispatch = useDispatch();

    return (
        <>
            <main className={classes.drawerClose} id="headerSpace">
                <Switch>
                    <Route
                        exact
                        path="/appointment/admin/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="admin"
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/appointment/management/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="management"
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/appointment/partner/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="partner"
                                {...props}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/appointment/sales_rep/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="sales_rep"
                                {...props}
                            />
                        )}
                    />

                    <Route
                        exact
                        path="/appointment/surveyor/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="surveyor"
                                {...props}
                            />
                        )}
                    />

                    <Route
                        exact
                        path="/appointment/installer/view"
                        render={route => (
                            <Common
                                {...route}
                                slug="installer"
                                {...props}
                            />
                        )}
                    />
                    <Route component={NotFoundPage} />
                </Switch>
            </main>
        </>
    );
}
export default AppointmentRouters;
