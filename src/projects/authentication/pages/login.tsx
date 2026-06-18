import React, {  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import logo from "../images/PowerPortalLogo.png";
import { PasswordMasking } from "../../../sharedUtils/sharedComponents/passwordMasking";
import LoginImage from "../images/login-background.jpeg";
import {
  authActions,
  selectLogged,
  selectLoggedUser,
  selectAuthState,
} from "../redux/auth";
import {
  globalConfigActions,
  selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import { LoadingIndicator } from "sharedUtils/sharedComponents/LoadingIndicator";

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
    padding: 30,
    minWidth: 500,
    "@media(max-width:767px)": {
      maxWidth: "100%",
      minWidth: "100%",
      boxSizing: "border-box",
    },
  },
  media: {
    height: 100,
    backgroundSize: "55%",
  },
  Mainform: {
    display: "flex",
    justifyContent: "center",
    fontFamily: ' "Roboto", sans-serif;',
  },
  MainDivform: {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center",
    width: "100%",
    backgroundImage: `url(${LoginImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  textField: {
    minWidth: "100%",
    marginTop: 0,
    marginBottom: 18,
  },
  buttonProgress: {},
});

export function Login(props) {
  const mediaClasses = useStyles();
  const logged = useSelector(selectLogged);
  const userData = useSelector(selectLoggedUser);
  const authState = useSelector(selectAuthState);
  const globalConfig = useSelector(selectGlobalConfig);

  const { visible } = globalConfig;
  const dispatch = useDispatch();

  if (props.message) {
    dispatch(globalConfigActions.enableFeedback(props.message));
  }

  if (
    props.logged === "pass" &&
    props.userData.role !== "" &&
    props.userData.role.configurations.afterLoginPage !== ""
  ) {
    props.history.push(
      `${props.userData.role.configurations.afterLoginPage}?due=true`
    );
    location.reload();
  }
  if (
    logged === "pass" &&
    userData.role &&
    userData.role.configurations.afterLoginPage !== ""
  ) {
    props.history.push(
      `${userData.role.configurations.afterLoginPage}?due=true`
    );
    location.reload();
  }

  return (
    <article className="login-for-usser login-form1">
      <div className={`login-form ${mediaClasses.MainDivform}`}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values) => {
            dispatch(authActions.authReq(values));
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required("Email Required"),
            password: Yup.string().required("Password Required"),
          })}
        >
          {(props) => {
            const {
              touched,
              errors,
              handleChange,
              handleSubmit,
            } = props;
            return (
              <form
                onSubmit={handleSubmit}
                id="loginMainForm"
                className={mediaClasses.Mainform}
              >
                <Card className={mediaClasses.card}>
                  <CardMedia
                    className={mediaClasses.media}
                    image={logo}
                    title="Edan Power"
                  />
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={errors.email && touched.email ? true : false}
                        placeholder="Email"
                        label="Email"
                        variant="outlined"
                        id="outlined-uncontrolled"
                        className={mediaClasses.textField}
                        margin="normal"
                        onChange={handleChange}
                        name="email"
                        required
                      />{" "}
                      {errors.email && touched.email && (
                        <div className="input-feedback">{errors.email}</div>
                      )}
                    </Grid>
                    <Grid item xs={12} md={12} id="MinWidth">
                      <TextField
                        error={
                          errors.password && touched.password ? true : false
                        }
                        required
                        variant="outlined"
                        type={visible}
                        InputProps={{ endAdornment: <PasswordMasking /> }}
                        label="Password"
                        placeholder="Password"
                        id="outlined-required"
                        className={mediaClasses.textField}
                        margin="normal"
                        onChange={handleChange}
                        name="password"
                      />
                      {errors.password && touched.password && (
                        <div className="input-feedback">{errors.password}</div>
                      )}
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <CardActions
                        style={{
                          paddingLeft: 0,
                          paddingRight: 0,
                          marginTop: 0,
                          paddingTop: 0,
                          margin: 0,
                          display: "block",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          size="large"
                          color="primary"
                          variant="contained"
                          disabled={authState.isLoginResponse}
                          id="add-butn"
                          type="submit"
                          style={{ width: "100%" }}
                        >
                          Login{" "}
                          {authState.isLoadingData ? (
                            <LoadingIndicator small />
                          ) : (
                            ""
                          )}
                        </Button>
                      </CardActions>
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
