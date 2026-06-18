import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { connect, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  PasswordMasking,
  PasswordMaskingSame,
} from "../../../sharedUtils/sharedComponents/passwordMasking";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectUsersState, userAdminAction } from "../redux/userAdmin";
import { selectGlobalConfig } from "sharedUtils/sharedRedux/configuration";
import { makeStyles } from "@material-ui/core";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { InstallerTypeOptions } from "sharedUtils/globalHelper/constantValues";

const useStyles = makeStyles(() => ({
  HeaderStyle: {
    position: "absolute",
    top: 30,
    display: "flex",
    justifyContent: "center",
    width: "57%",
    marginLeft: "17%",
    "@media(max-width:480px)": {
      right: 0,
      width: "34%",
      top: 12,
    },
  },
}));

export default function AddUser(props) {
  return (
    <MyDrawer
      drawerSize="600px"
      iconName="User"
      open={props.open == "addUserDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddUserLogic {...props} />
    </MyDrawer>
  );
}

function AddUserLogic(props) {
  const classes = useStyles();

  const userState = useSelector(selectUsersState);
  const globalConfig = useSelector(selectGlobalConfig);
  const { hideSideBar, role } = userState;
  const { visible, visibleSame } = globalConfig;
  const dispatch = useDispatch();

  const _addUser = (payload) => dispatch(userAdminAction.addUser(payload));
  const _closeSideBar = (payload) =>
    dispatch(userAdminAction.userCloseSideBar(payload));
  const _fetchRoles = (payload) => dispatch(userAdminAction.roleList(payload));
  const _cityListForDropdown = (payload) => dispatch(userAdminAction.cityListForDropdown(payload));

  const currentProps = props;

  useEffect(() => {
    if (props.slug !== "partner") _fetchRoles(props.slug);
  }, []);

  const [changeRole, setChangeRole] = useState("");
  const [startLoader, setStartLoader] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");

  const initialValues = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: null,
    jobTitle: '',
    companyId: null,
    sites: null,
    percentageCommission: '',
    city_list: null,
    phone: '',
    mobile: '',
    address: '',
    color: '',
    installerType: null,
  };

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  let roleOptions = [];
  if (role) {
    roleOptions = role.map((e) => ({ label: e.roleName, value: e._id }));
  }

  const handleChangeRole = (event) => {
    setChangeRole(event.label);
  };

  let dynamicValidation = {};

  if (props.slug === "partner") {
    dynamicValidation = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is a required")
        .test(
          "passwords-match",
          "Password and confirm password should match",
          function (value) {
            return this.parent.password === value;
          }
        ),
    });
  } else {
    dynamicValidation = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email().required("Email is required"),
      role: Yup.object().required("Role is required").nullable(),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .required("Confirm password is a required")
        .test(
          "passwords-match",
          "Password and confirm password should match",
          function (value) {
            return this.parent.password === value;
          }
        ),
    });
  }

  let citiesList = [];

  if (userState.cities)
    citiesList = userState.cities.map((e) => ({
      label: e.city,
      value: e._id,
    }));

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);

    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);

    if (event.length >= 0) {
      if (action === "city_list")
        _cityListForDropdown({
          searchText: event,
          limit: userState.cities.length + 10,
        });
    }
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const lazyLoadAPI = (event, action) => {
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);

    if (action === "city_list" && userState.cities.length <= 50)
      _cityListForDropdown({
        searchText: CurrentSearchText,
        limit: userState.cities.length + 10,
      });
  };

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const obj: any = { ...values }
          if (props.slug !== "partner") {
            obj.role = values.role.value;
          }
          if (values.city_list) obj.city_list = values.city_list.map(e => e.label)
          if (values.installerType) obj.installerType = values.installerType.map(e => e.label)
                   
          setStartLoader(true);
          _addUser(obj);
          setTimeout(() => {
            setStartLoader(false);
          }, 3000);
        }}
        validationSchema={dynamicValidation}
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
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={3}>
                <div className={classes.HeaderStyle}>
                  <h1 style={{ fontSize: 22 }}>
                    Add {currentProps.slug === "partner" ? "Sales Rep" : "User"}{" "}
                  </h1>
                </div>
                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.name && touched.name)}
                    id="name"
                    className="WidhtFull100"
                    label="Name"
                    type="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="name-error"
                  />
                  {errors.name && touched.name && (
                    <FormHelperText className="errormsg" id="name-error">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.email && touched.email)}
                    id="email"
                    name="email"
                    label="Email"
                    className="WidhtFull100"
                    type="email"
                    value={values.email}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="email-error"
                  />
                  {errors.email && touched.email && (
                    <FormHelperText className="errormsg" id="email-error">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    className="WidhtFull100"
                    type="number"
                    value={values.mobile}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="mobile-error"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    className="WidhtFull100"
                    type="number"
                    value={values.phone}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="phone-error"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    id="address"
                    name="address"
                    label="Address"
                    multiline
                    rows={3}
                    className="WidhtFull100"
                    type="text"
                    value={values.address}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="address-error"
                  />
                </Grid>

                {String(currentProps.slug) !== "partner" ? (
                  <Grid item md={12} xs={12}>
                    <Select
                      className={
                        errors.role && touched.role ? "ErrorColor" : ""
                      }
                      id="role"
                      placeholder="Select Role"
                      value={values.role}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      isClearable
                      onChange={(e) => {
                        if (e) {
                          handleChangeRole(e);
                          setFieldValue("role", e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="role-number-error"
                      name="colors"
                      options={roleOptions}
                    />
                    {errors.role && touched.role && (
                      <FormHelperText className="errormsg" id="role-error">
                        {errors.role}
                      </FormHelperText>
                    )}
                  </Grid>
                ) : null}

                {changeRole === 'Installer' &&
                  <Grid item md={12} xs={12}>
                    <Select
                      id="installerType"
                      placeholder="Select Installer Type"
                      value={values.installerType}
                      inputProps={{
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      isClearable
                      isMulti
                      onChange={(e) => {
                        if (e) {
                          setFieldValue("installerType", e);
                        }
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="installerType-number-error"
                      name="installerType"
                      options={InstallerTypeOptions}
                    />
                  </Grid>
                }

                <Grid item xs={12} md={12}>
                  <Select
                    className={
                      errors && errors.city_list ? "ErrorColor" : ""
                    }
                    id="city_list"
                    name="city_list"
                    placeholder="Search City"
                    value={values.city_list}
                    onChange={(e) => {
                      setFieldValue("city_list", e);
                    }}
                    onBlur={handleBlur}
                    isLoading={isLoadingData}
                    onInputChange={(e) => {
                      setIsLoadingData(true);
                      debounceOnChange(e, "city_list");
                    }}
                    isMulti
                    onMenuScrollToBottom={(e) => {
                      const isCallNewOne = userState.cities.length % 10 === 0;
                      if (isCallNewOne) {
                        setIsLoadingData(true);
                        lazyLoadAPI(e, "city_list");
                      }
                    }}
                    components={{
                      LoadingIndicator() {
                        return <CircularProgress />;
                      },
                    }}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={citiesList}
                  />
                  <FormHelperText className="errormsg" id="city_list-error">
                    {errors.city_list}
                  </FormHelperText>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    id="color"
                    name="color"
                    label="Appointment Color"
                    className="WidhtFull100"
                    type="color"
                    value={values.color}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    inputProps={{
                      className: 'colorInputStyle',
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="color-error"
                  />
                </Grid>

                {changeRole === "Sales Rep" ? (
                  <Grid item xs={12} md={12}>
                    <TextField
                      variant="outlined"
                      error={!!(errors.jobTitle && touched.jobTitle)}
                      id="jobTitle"
                      className="WidhtFull100"
                      label="Job Title"
                      type="jobTitle"
                      value={values.jobTitle}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="name-error"
                    />
                    {errors.jobTitle && touched.jobTitle && (
                      <FormHelperText className="errormsg" id="name-error">
                        {errors.jobTitle}
                      </FormHelperText>
                    )}
                  </Grid>
                ) : null}

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={errors.password && touched.password}
                    label="Password"
                    name="password"
                    autoComplete="new-password"
                    type={visible}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    InputProps={{
                      endAdornment: <PasswordMasking />,
                    }}
                  />
                  {errors.password && touched.password && (
                    <FormHelperText className="errormsg" id="password-error">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    error={errors.confirmPassword && touched.confirmPassword}
                    InputProps={{ endAdornment: <PasswordMaskingSame /> }}
                    variant="outlined"
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    className="WidhtFull100"
                    type={visibleSame}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="confirm-pass-error"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <FormHelperText
                      className="errormsg"
                      id="confirmPassword-error"
                    >
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>

              </Grid>

              {String(currentProps.slug) === "admin" ? (
                <Grid container spacing={3}>
                  <div style={{ padding: 12, marginTop: 20 }}>
                    <h3 style={{ fontSize: 18 }}>
                      Add Commission
                    </h3>
                  </div>

                  <Grid item xs={12} md={12}>
                    <label style={{ paddingBottom: 5 }}>Percentage</label>
                    <TextField
                      InputProps={{ endAdornment: '%' }}
                      variant="outlined"
                      error={!!(errors.percentageCommission && touched.percentageCommission)}
                      id="percentageCommission"
                      className="WidhtFull100"
                      value={values.percentageCommission}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="percentageCommission-error"
                    />
                    {errors.percentageCommission && touched.percentageCommission && (
                      <FormHelperText className="errormsg" id="percentageCommission-error">
                        {errors.percentageCommission}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              ) : null}

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Add User
                </Button>
                {startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
