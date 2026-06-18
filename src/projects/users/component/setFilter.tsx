import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import { useDispatch, useSelector } from "react-redux";
import { selectUsersState, userAdminAction } from "../redux/userAdmin";
import {
  listOfStatusOfUsers,
  listOfRoles,
} from "../../../sharedUtils/globalHelper/status";

export default function Filter(props) {
  const userState = useSelector(selectUsersState);
  const userFilter = userState.filter;
  const dispatch = useDispatch();

  const _loadingDataAction = (payload) =>
    dispatch(userAdminAction.userLoaderStart(payload));
  const _filterData = (payload) => dispatch(userAdminAction.userList(payload));
  const _addFilter = (payload) =>
    dispatch(userAdminAction.userAddFilter(payload));
  const _clearFilter = (payload) =>
    dispatch(userAdminAction.userClearFilter(null));

  return (
    <div className="app">
      <Formik
        enableReinitialize
        initialValues={{
          role:
            userFilter.role
              ? listOfRoles.filter((role) =>
                userFilter.role.includes(role.value)
              )
              : null,
          status:
            userFilter.status ? listOfStatusOfUsers.find(
              (user) => user.value === userFilter.status
            )
              : null,
        }}
        onSubmit={(values) => {
          const filterObject: any = {};
          if (values.role) filterObject.role = values.role.map((v) => v.value);
          if (values.status) filterObject.status = values.status.value;
          _addFilter(filterObject);
          _loadingDataAction(false);
          _filterData(null);
        }}
        validationSchema={Yup.object().shape({})}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.role && touched.role ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Role"
                    value={values.role}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dataOf-number-error"
                    onChange={(e) => setFieldValue("role", e)}
                    isMulti
                    name="role"
                    options={listOfRoles}
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.status && touched.status ? true : false}
                    id="status"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Status"
                    value={values.status}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="services-number-error"
                    onChange={(e) => {
                      setFieldValue("status", e);
                    }}
                    name="status"
                    options={listOfStatusOfUsers}
                    classNamePrefix="select"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => {
                        _clearFilter(null);
                        handleReset();
                        props.resetForm();
                        _loadingDataAction(false);
                        _filterData({});
                      }}
                    >
                      <Icon className="fa fa-refresh" />
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Icon className="fa fa-filter" />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
