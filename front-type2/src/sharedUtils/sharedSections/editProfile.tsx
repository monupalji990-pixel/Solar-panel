import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import makeStyles from "@material-ui/core/styles/makeStyles";
import EditHelper2 from "../sharedComponents/editHelper";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AuthApi from "../../projects/authentication/redux/Model/api";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoggedUser,
  authActions,
} from "../../projects/authentication/redux/auth";
import DrawerHelper from "../sharedComponents/drawerHelper";
import {
  changeEditProfileDrawerStatus,
  globalConfigActions,
} from "../sharedRedux/configuration";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import { EditProfilePhoto } from "./editProfilePhoto";

export default function app(props) {
  const editProfileDrawer = useSelector(changeEditProfileDrawerStatus);
  const dispatch = useDispatch();
  return (
    <DrawerHelper
      drawerSize="550px"
      iconName="Profile"
      open={editProfileDrawer}
      onClose={(e) =>
        dispatch(globalConfigActions.changeStatusEditProfileDrawer(false))
      }
    >
      <Grid container>
        <Logout {...props} />
        <Profile {...props} />
      </Grid>
    </DrawerHelper>
  );
}

const useStyles = makeStyles({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    margin: 0,
    width: 150,
    height: 150,
    cursor: "pointer",
    borderRadius: "100%",
    border: "solid 3px #2f3c4e",
  },

  editable: {
    cursor: "pointer",
  },
  fileupload: {
    display: "none",
  },
  logoutIconNew: {
    position: "absolute",
    right: 42,
    top: 30,
    "@media(max-width:480px)": {
      top: 10,
      right: 10,
    },
  },
  outBtn: {
    minWidth: "inherit",
    borderRadius: "100%",
    height: 30,
    width: 30,
    padding: 0,
    borderColor: "#2f3c4e",
  },
  outIcon: {
    fontSize: 18,
  },
  resetbtn: {
    marginRight: 10,
  },
  submitbtn: {
    marginRight: 10,
  },
  tableCell: {
    fontWeight: "bold",
    color: "#000000",
  },
  ChangePassStyle: {
    fontWeight: 700,
    fontFamily: "inherit",
  },
  ProfileBoxSpace: {
    padding: "1rem",
  },

  buttons: {
    margin: "0.1rem",
    width: "100%",
    borderRadius: "20px 20px 23px 20px",
  },
});

const Profile = (props: any) => {
  const myProps: any = props;
  const userData = useSelector(selectLoggedUser);
  const dispatch = useDispatch();

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    AuthApi.updateRegUser(value).then((response: any) => {
      if (response.success) {
        dispatch(authActions.isLogin(props));
        closeEdit("view");
        dispatch(globalConfigActions.enableFeedback('profile updated successfully'));
      } else {
        dispatch(globalConfigActions.enableFeedback('profile update failed'));
      }
      setSubmitting(false);
      dispatch(globalConfigActions.endLoader(props));
    });
  };

  if (myProps.hideSideBar) {
    myProps.onClose();
    myProps._closeSideBar({ status: false, msg: "" });
  }

  const uploadImage = (e, setFieldValue, submitForm) => {
    const data = new FormData();
    data.append("photo", e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      dispatch(globalConfigActions.startLoader(props));
      AuthApi.uploadProfileImage(data).then((response: any) => {
        if (response.success) {
          setFieldValue("avatar", response.file);
          submitForm();
        }
        dispatch(globalConfigActions.enableFeedback(response.message));
        dispatch(globalConfigActions.endLoader(props));
      });
    }
  };

  const uploadImageNew = (e, setFieldValue, submitForm, setStartLoader) => {

    const data = new FormData();
    if (e && e.target.files && e.target.files[0]) {
      data.append("avatar", e.target.files[0]);
    } else {
      data.append("avatar", '');
    }
    if (e === '' || (e && e.target.files && e.target.files[0])) {
      setStartLoader(true);
      dispatch(globalConfigActions.startLoader(props));
      AuthApi.uploadProfileImage(data).then((response: any) => {
        if (response.success) {
          dispatch(authActions.isLogin(props));
          dispatch(globalConfigActions.enableFeedback('profile image updated successfully'));
        } else {
          dispatch(globalConfigActions.enableFeedback('profile image update failed'));
        }
        setStartLoader(false);
        dispatch(globalConfigActions.endLoader(props));
      });
    }
  };

  const simpleEditImage = (value, closeEdit, setSubmitting) => {
    AuthApi.uploadProfileImage(value).then((response: any) => {
      if (response.success) {
        dispatch(authActions.isLogin(props));
        closeEdit("view");
        dispatch(globalConfigActions.enableFeedback('profile updated successfully'));
      } else {
        dispatch(globalConfigActions.enableFeedback('profile update failed'));
      }
      setSubmitting(false);
      dispatch(globalConfigActions.endLoader(props));
    });
  };

  const classes = useStyles();
  return (
    <div className="txt-uppercase">
      <Grid item md={12} xs={12} className={classes.ProfileBoxSpace}>
        <EditProfilePhoto
          id="avatar"
          src={userData.avatar}
          onChangeImg={uploadImageNew}
          onSubmit={simpleEdit}
        />
      </Grid>

      <Grid item md={12} xs={12} className={classes.ProfileBoxSpace}>
        <Paper style={{ padding: "1rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <strong>Name</strong>
            </Grid>
            <Grid item xs={12} md={9}>
              <EditHelper2
                id="name"
                viewType="text"
                editType="textBox"
                value={userData ? userData.name : ""}
                validation={[
                  {
                    status: "required",
                    msg: "Name is required",
                  },
                ]}
                onSubmit={simpleEdit}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <strong>Email</strong>
            </Grid>
            <Grid item xs={12} md={9}>
              <EditHelper2
                id="email"
                viewType="text"
                editType="textBox"
                value={userData ? userData.email : ""}
                validation={[
                  {
                    status: "validEmail",
                    msg: "Email",
                  },
                ]}
                onSubmit={simpleEdit}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <strong>Phone</strong>
            </Grid>
            <Grid item xs={12} md={9}>
              <EditHelper2
                id="mobile"
                viewType="text"
                editType="textBox"
                value={userData ? userData.mobile : ""}
                validation={[
                  {
                    status: "required",
                    msg: "Phone Number number is required",
                  },
                ]}
                onSubmit={simpleEdit}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item md={12} xs={12} className={classes.ProfileBoxSpace}>
        <Paper style={{ padding: "1rem" }}>
          <Typography variant="subtitle1" className={classes.ChangePassStyle}>
            Change Password
          </Typography>

          <ChangePass {...props} />
        </Paper>
      </Grid>
    </div>
  );
};

const ChangePass = (props) => {
  const myProps: any = props;
  const initialPasswords = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  if (myProps.hideSideBar) {
    myProps.onClose();
    myProps._closeSideBar({ status: false, msg: "" });
  }
  const dispatch = useDispatch();
  const [visible, setVisible] = useState("password");
  const [visible1, setVisible1] = useState("password");
  const [visible2, setVisible2] = useState("password");

  const changePassword = (value, setSubmitting, resetForm) => {
    dispatch(authActions.changePassword(value));
    setSubmitting(false);
    resetForm();
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Formik
        initialValues={initialPasswords}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          changePassword(values, setSubmitting, resetForm);
        }}
        validationSchema={Yup.object().shape({
          currentPassword: Yup.string().required(
            "Please Enter the Current Password"
          ),
          newPassword: Yup.string()
            .required("Please Enter The New Password")
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
            ),
          confirmPassword: Yup.string()
            .required("Please Enter Confirm Password")
            .oneOf(
              [Yup.ref("newPassword"), null],
              "New password and confirm Password should match"
            ),
        })}
      >
        {(myProps) => {
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
          } = myProps;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    error={
                      !!(errors.currentPassword && touched.currentPassword)
                    }
                    id="currentPassword"
                    label="Current Password"
                    type={visible}
                    value={values.currentPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <Button
                          className="password__show"
                          onClick={(e) =>
                            visible === "text"
                              ? setVisible("password")
                              : setVisible("text")
                          }
                        >
                          {visible === "text" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      ),
                    }}
                  />
                  {errors.currentPassword && touched.currentPassword && (
                    <FormHelperText
                      className="errormsg"
                      id="currentPassword-error"
                    >
                      {errors.currentPassword}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    error={!!(errors.newPassword && touched.newPassword)}
                    id="newPassword"
                    label="New Password"
                    type={visible2}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <Button
                          className="password__show"
                          onClick={(e) =>
                            visible2 === "text"
                              ? setVisible2("password")
                              : setVisible2("text")
                          }
                        >
                          {visible2 === "text" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      ),
                    }}
                  />

                  {errors.newPassword && touched.newPassword && (
                    <FormHelperText className="errormsg" id="newPassword-error">
                      {errors.newPassword}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    error={
                      !!(errors.confirmPassword && touched.confirmPassword)
                    }
                    id="confirmPassword"
                    label="Confirm Password"
                    type={visible1}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <Button
                          className="password__show"
                          onClick={(e) =>
                            visible1 === "text"
                              ? setVisible1("password")
                              : setVisible1("text")
                          }
                        >
                          {visible1 === "text" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      ),
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
              <Grid container spacing={3} className="TopMargin15">
                <Grid item md={6} sm={12} xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={classes.buttons}
                    style={{ backgroundColor: "#383838" }}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Button
                    className={classes.buttons}
                    variant="contained"
                    size="medium"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};

const Logout = (props) => {
  const dispatch = useDispatch();
  const Logout = () => {
    localStorage.removeItem("token");
    dispatch(authActions.logout(props));
  };
  const classes = useStyles();
  return (
    <div className={classes.logoutIconNew}>
      <Tooltip title="Logout">
        <Button
          onClick={Logout}
          className={classes.outBtn}
          color="primary"
          variant="outlined"
        >
          <ExitToAppIcon className={classes.outIcon} />
        </Button>
      </Tooltip>
    </div>
  );
};
