import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import queryString from "query-string";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useSelector, useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  AuthSlickKey,
  authReducer,
  authActions,
  authFormSaga,
  selectLogged,
  selectLoggedUser,
  selectLoggedReq,
} from "../redux/auth";

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    padding: 30,
    minWidth: 350,
  },
  media: {
    height: 100,
    backgroundSize: "45%",
  },
  Mainform: {
    display: "flex",
    justifyContent: "center",
  },
  MainDivform: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center",
    background: "#f6f7fb",
  },
  textField: {
    minWidth: "100%",
    marginTop: 0,
    marginBottom: 18,
  },
  buttons: {
    margin: "0.1rem",
    color: "white",
    width: "100%",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    // border: "2px solid #0CADCF",
    borderRadius: "20px 20px 23px 20px",
  },
});

export function changePass(props: RouteComponentProps) {
  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);
  useInjectReducer({ key: AuthSlickKey, reducer: authReducer });
  useInjectSaga({ key: AuthSlickKey, saga: authFormSaga });
  const dispatch = useDispatch();

  const [visible, setVisible] = useState("password");
  const [visible1, setVisible1] = useState("password");

  const [value, setValue] = useState(false);
  const data = queryString.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const history = useHistory();
  return (
    <article className="login-for-usser login-form1">
      <Helmet>
        <title>Change password</title>
        <meta name="description" content="" />
      </Helmet>

      <div id="change_pwd" className={classes.MainDivform}>
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setStartLoader(true);
            dispatch(
              authActions.resetPass({
                d: data.resetId,
                data: { password: values.password },
                history: history,
              })
            );
          }}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .required("Required")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
              ),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords must match")
              .required("Confirm Password is a required field"),
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
              <form
                onSubmit={handleSubmit}
                id="chnage_pass"
                className={classes.Mainform}
              >
                <Card className={classes.card}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={
                          errors.password && touched.password ? true : false
                        }
                        id="password"
                        label="Password"
                        type={visible}
                        value={values.password}
                        onChange={handleChange}
                        className={classes.textField}
                        onBlur={handleBlur}
                        margin="normal"
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
                          errors.confirmPassword && touched.confirmPassword
                            ? true
                            : false
                        }
                        id="confirmPassword"
                        label="Confirm Password"
                        type={visible1}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        className={classes.textField}
                        onBlur={handleBlur}
                        margin="normal"
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
                   
                    <Grid item md={12}>
                      <Button
                        disabled={isSubmitting}
                        size="large"
                        color="primary"
                        variant="contained"
                        id="add-butn"
                        type="submit"
                        style={{
                          width: "100%",
                          backgroundColor: "#1665B0",
                          borderRadius: "20px",
                        }}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Button
                        size="large"
                        className={classes.buttons}
                        style={{ backgroundColor: "#F26874" }}
                        variant="contained"
                        onClick={() => {
                          history.push("/auth/login");
                        }}
                      >
                        Log in
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </form>
            );
          }}
        </Formik>
      </div>
    </article>
  );
}
