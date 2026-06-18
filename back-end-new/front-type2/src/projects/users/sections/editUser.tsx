// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { selectUsersState, userAdminAction } from "../redux/userAdmin";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import OnTextEditInputForColor from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelperForColor";
import {
  PasswordMasking,
  PasswordMaskingSame,
} from "../../../sharedUtils/sharedComponents/passwordMasking";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectGlobalConfig } from "sharedUtils/sharedRedux/configuration";
import DeleteUser from "./deleteUser";
import { Common as HistoryTable } from "../../history/loadable/Common";
import SelectCity from '../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectForCity';
import PaymentHistory from '../sections/viewPayments'
import { AMS, InstallerTypeOptions } from "sharedUtils/globalHelper/constantValues";
import Select from "react-select";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export default function EditUser(props) {
  return (
    <MyDrawer
      drawerSize="1250px"
      iconName="User"
      open={props.open === "manageUserDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <EditUserLogic {...props} />
    </MyDrawer>
  );
}

function EditUserLogic(props) {
  const userState = useSelector(selectUsersState);
  const globalConfig = useSelector(selectGlobalConfig);
  const { hideSideBar, currentUser, message, isLoadingData } = userState;
  const { visible, visibleSame } = globalConfig;
  const dispatch = useDispatch();

  const _editUser = (payload) => dispatch(userAdminAction.editUser(payload));
  const _isLoadingData = (payload) =>
    dispatch(userAdminAction.userLoaderAction(payload));
  const _changePassword = (payload) =>
    dispatch(userAdminAction.changePassword(payload));
  const _sendRequest = (payload) =>
    dispatch(userAdminAction.sendRequest(payload));
  const _viewUser = (payload) => dispatch(userAdminAction.viewUserReq(payload));
  const _cityListForDropdown = (payload) => dispatch(userAdminAction.cityListForDropdown(payload));

  useEffect(() => {
    _isLoadingData(true);
    _viewUser(props);
  }, []);

  const currentProps = props;

  const [changeRole, setChangeRole] = useState(props.user.role);
  const [startLoader, setStartLoader] = useState(false);
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [defaultSubSer, setDefaultSubSer] = useState([]);

  const [isChecked, setIsChecked] = useState(props.user.status === "Active");
  const [isDeleteCheck, setIsDelete] = useState(
    currentUser && currentUser.isDelete
  );
  const [selectedMainTab, setSelectedMainTab] = React.useState("general");
  const [selectedTab, setSelectedTab] = React.useState("updatePass");

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const { name, email, mobile, phone, addressOne, color, jobTitle, city_list, isDelete, percentageCommission, fixCommission, installerType } = currentUser;

  useEffect(() => {
    if (installerType !== undefined && installerType) {
      setDefaultSubSer(
        installerType?.map((v: any) => ({
          label: v,
          value: v,
        }))
      );
    }
  }, [installerType]);

  const citiesValue = city_list && city_list.map((e) => ({
    label: e,
    value: e,
  }));


  const userStatus =
    Number(currentUser && currentUser.isActive) === 1 ? "Active" : "Block";

  const simpleEdit = (data) => {
    const updateObject = {
      userId: currentUser._id,
      updation: {
        email: currentUser.email,
        name: currentUser.name,
        color: currentUser.color,
        jobTitle: currentUser.jobTitle,
        status: currentUser.isActive,
        mobile: currentUser.mobile,
        phone: currentUser.phone,
        address: currentUser.address,
        percentageCommission: currentUser.percentageCommission,
        city_list: currentUser.city_list,
      },
    };

    if (data.installerType) updateObject.updation.installerType = data?.installerType.map((x) => x.value)
    if (data.name) updateObject.updation.name = data.name;
    if (data.color) updateObject.updation.color = data.color;
    if (data.mobile) updateObject.updation.mobile = data.mobile;
    if (data.phone) updateObject.updation.phone = data.phone;
    if (data.address) updateObject.updation.address = data.address;
    if (data.percentageCommission) updateObject.updation.percentageCommission = data.percentageCommission;
    if (data.email) updateObject.updation.email = data.email;
    if (data.city_list) updateObject.updation.city_list = data.city_list.map(e => e.label);
    if (data.jobTitle) updateObject.updation.jobTitle = data.jobTitle;
    if (data.checkedA) updateObject.updation.status = isChecked ? 1 : 2;

    _isLoadingData(true);
    _editUser(updateObject);
  };

  const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
    const id = currentUser._id;
    if (isDeleteCheck) {
      const data = {
        id,
        isDelete: true,
      };
      _sendRequest(data);
    } else {
      const data = {
        userId: id,
        updation: {
          isDelete: false,
        },
      };
      _editUser(data);
    }
    _isLoadingData(true);
    closeEdit(null);
    setSubmitting(false);
  };

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabHandleMainChange = (event, newValue) => {
    setSelectedMainTab(newValue);
  };

  let citiesList = [];

  if (userState.cities)
    citiesList = userState.cities.map((e) => ({
      label: e.city,
      value: e._id,
    }));

  if (isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="txt-uppercase">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedMainTab}
              onChange={tabHandleMainChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="General" value="general" />
              <Tab label="History" value="history" />
              {["sales_rep", "Sales Rep"].includes(props.user?.role) &&
                <Tab label="Payment History" value="paymentHistory" />
              }
            </Tabs>
          </Paper>
        </Grid>
      </Grid>
      {selectedMainTab === "general" && (
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="name"
                        value={name}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          name: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.name && props.touched.name)
                              }
                              className="profile-pic"
                              name="name"
                              value={props.values.name}
                              onChange={props.handleChange}
                              helperText={!props.errors.name}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Mobile</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="mobile"
                        value={mobile}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          mobile: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.mobile && props.touched.mobile)
                              }
                              className="profile-pic"
                              name="mobile"
                              value={props.values.mobile}
                              onChange={props.handleChange}
                              helperText={!props.errors.mobile}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="phone"
                        value={phone}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          phone: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.phone && props.touched.phone)
                              }
                              className="profile-pic"
                              name="phone"
                              value={props.values.phone}
                              onChange={props.handleChange}
                              helperText={!props.errors.phone}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="address"
                        value={addressOne}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          address: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.address && props.touched.address)
                              }
                              className="profile-pic"
                              name="address"
                              value={props.values.address}
                              onChange={props.handleChange}
                              helperText={!props.errors.address}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="email"
                        value={email}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          email: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.email && props.touched.email)
                              }
                              className="profile-pic"
                              name="email"
                              value={props.values.email}
                              onChange={props.handleChange}
                              helperText={!props.errors.email}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Role</strong>
                    </TableCell>
                    <TableCell>{props.user.role}</TableCell>
                  </TableRow>

                  {props.user.role === "Installer" &&
                    <TableRow>
                      <TableCell>
                        <strong>Installer Type</strong>
                      </TableCell>
                      {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="installerType"
                            value={installerType !== undefined &&
                              installerType !== undefined &&
                              installerType
                              ? helperMethods.arrayToString(
                                installerType
                              )
                              : null}
                            onSubmit={simpleEdit}
                          >
                            {(props) => (
                              <Grid className="RatingInfo">
                                <Select
                                  error={
                                    props.errors.installerType &&
                                    props.touched.installerType
                                  }
                                  className="WidhtFull100 basic-multi-select"
                                  isMulti
                                  onChange={(e: any) => {
                                    try {
                                      if (e) {
                                        setDefaultSubSer(
                                          e.map((v) => ({
                                            label: v.label,
                                            value: v.value,
                                          }))
                                        );
                                      } else {
                                        setDefaultSubSer([]);
                                      }
                                      props.setFieldValue("installerType", e);
                                    } catch (error) {
                                      console.log("error", error);
                                    }
                                  }}
                                  value={defaultSubSer}
                                  onBlur={props.handleBlur}
                                  options={InstallerTypeOptions}
                                  classNamePrefix="select"
                                />
                              </Grid>
                            )
                            }
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {installerType.join(' | ') || "N/A"}
                        </TableCell>
                      )}
                    </TableRow>
                  }

                  <TableRow>
                    <TableCell>
                      <strong>Active</strong>
                    </TableCell>
                    {["admin"].includes(props.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="checkedA"
                          value={userStatus || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            checkedA: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Switch
                                checked={isChecked}
                                onChange={(event) => {
                                  setIsChecked(event.target.checked);
                                }}
                                value={props.values.status}
                                name="checkedA"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{userStatus}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>City</strong>
                    </TableCell>

                    {["admin"].includes(props.slug) ? (
                      <TableCell component="th" scope="row">

                        <SelectCity
                          clickable={false}
                          reactSelect={true}
                          name="city_list"
                          value={citiesValue}
                          onSubmit={simpleEdit}
                          options={citiesList}
                          data={userState}
                          isSearchable={true}
                          isMulti={true}
                          _cityListForDropdown={_cityListForDropdown}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>{city_list && city_list.map((x) =>
                        <span style={{
                          background: '#e0e0e0',
                          borderRadius: 16,
                          marginRight: 15,
                          padding: '8px 12px'
                        }}>{x}</span>
                      )}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Color</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <OnTextEditInputForColor
                        name="color"
                        value={color}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          color: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(props.errors.color && props.touched.color)
                              }
                              className="profile-pic"
                              name="color"
                              type="color"
                              value={props.values.color}
                              inputProps={{
                                className: 'colorInputStyleEdit',
                              }}
                              onChange={props.handleChange}
                              helperText={!props.errors.color}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInputForColor>
                    </TableCell>
                  </TableRow>

                  {changeRole === "Sales Rep" ? (
                    <TableRow>
                      <TableCell>
                        <strong>Job Title</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="jobTitle"
                          value={jobTitle || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            jobTitle: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.jobTitle &&
                                    props.touched.jobTitle
                                  )
                                }
                                className="profile-pic"
                                name="jobTitle"
                                value={props.values.jobTitle}
                                onChange={props.handleChange}
                                helperText={!props.errors.jobTitle}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>
                  ) : null}

                  {["management", "partner", 'sales_rep', 'Sales Rep'].includes(currentProps.slug) && (
                    <TableRow>
                      <TableCell>
                        <strong>Delete Request</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="isDelete"
                          value={
                            isDelete
                              ? "Delete request sent"
                              : "Send delete request"
                          }
                          onSubmit={sentDeleteRequest}
                          validateIt={Yup.object().shape({
                            isDelete: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Switch
                                checked={isDeleteCheck}
                                onChange={(event) => {
                                  setIsDelete(event.target.checked);
                                }}
                                value={props.values.isDelete}
                                name="isDelete"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {currentProps.slug === "admin" && (
              <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table aria-label="caption table">
                  <h3 style={{ padding: 20 }}>Commission</h3>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Percentage (%)</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="percentageCommission"
                          value={percentageCommission || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            percentageCommission: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.percentageCommission &&
                                    props.touched.percentageCommission
                                  )
                                }
                                name="percentageCommission"
                                value={props.values.percentageCommission}
                                onChange={props.handleChange}
                                helperText={!props.errors.percentageCommission}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>

          {currentProps.slug === "admin" && props.user.role === "Sales Rep" && (
            <Grid item xs={12} md={12}>
              <Paper>
                <Tabs
                  value={selectedTab}
                  onChange={tabHandleChange}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab label="Update Password" value="updatePass" />
                  <Tab label="Delete Sales Rep" value="deleteUser" />
                </Tabs>
              </Paper>
            </Grid>
          )}

          {selectedTab === "updatePass" && (
            <Grid item md={12} xs={12}>
              {currentProps.slug === "admin" && (
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values, { resetForm }) => {
                    const PassObject = {
                      UserID: props.user._id,
                      password: values.password,
                      confirmPassword: values.confirmPassword,
                    };
                    setStartLoader(true);
                    _changePassword(PassObject);
                    resetForm();
                    setTimeout(function () {
                      setStartLoader(false);
                    }, 2000);
                  }}
                  validationSchema={Yup.object().shape({
                    password: Yup.string().required(
                      "Password is a required field"
                    ),
                    confirmPassword: Yup.string()
                      .required("Confirm Password is a required field")
                      .test(
                        "passwords-match",
                        "Password and confirm Password should match",
                        function (value) {
                          return this.parent.password === value;
                        }
                      ),
                  })}
                >
                  {(props) => {
                    const {
                      values,
                      touched,
                      errors,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    } = props;
                    return (
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12}>
                            <TextField
                              error={!!(errors.password && touched.password)}
                              id="password"
                              className="WidhtFull100"
                              label="Password"
                              type={visible}
                              variant="outlined"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="password-error"
                              InputProps={{ endAdornment: <PasswordMasking /> }}
                            />
                            {errors.password && touched.password && (
                              <FormHelperText
                                className="errormsg"
                                id="password-error"
                              >
                                {errors.password}
                              </FormHelperText>
                            )}
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <TextField
                              error={
                                !!(
                                  errors.confirmPassword &&
                                  touched.confirmPassword
                                )
                              }
                              id="confirmPassword"
                              variant="outlined"
                              label="Confirm Password"
                              className="WidhtFull100"
                              type={visibleSame}
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="confirm-pass-error"
                              InputProps={{
                                endAdornment: <PasswordMaskingSame />,
                              }}
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
                        <CardActions
                          style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            marginTop: 20,
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Submit
                          </Button>
                          {startLoader && <CircularProgress />}
                        </CardActions>
                      </form>
                    );
                  }}
                </Formik>
              )}
            </Grid>
          )}

          {selectedTab === "deleteUser" && (
            <Grid item md={12} xs={12}>
              {currentProps.slug === "admin" &&
                props.user.role === "Sales Rep" && (
                  <DeleteUser {...props}></DeleteUser>
                )}
            </Grid>
          )}
        </Grid>
      )}

      {selectedMainTab === "history" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <HistoryTable {...props} historyFor="User" />
          </Grid>
        </Grid>
      )}

      {selectedMainTab === "paymentHistory" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <PaymentHistory {...props} showingFrom="User" />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
