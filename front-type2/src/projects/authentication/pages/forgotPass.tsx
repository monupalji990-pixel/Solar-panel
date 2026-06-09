import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  AuthSlickKey,
  authReducer,
  authActions,
  authFormSaga,
} from "../redux/auth";
import { InputAdornment } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
    padding: 30,
    minWidth: 500,
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

export function ForgotPass() {
  const [startLoader, setStartLoader] = useState(false);
  const classes = useStyles();
  useInjectReducer({ key: AuthSlickKey, reducer: authReducer });
  useInjectSaga({ key: AuthSlickKey, saga: authFormSaga });
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <article className="login-for-usser login-form1">
      <Helmet>
        <title>Forgot password</title>
        <meta name="description" content="" />
      </Helmet>

      <div className={classes.MainDivform}>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setStartLoader(true);
            dispatch(authActions.forgetPass(values));
            setSubmitting(false);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required("Registered Email Required"),
          })}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleSubmit,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <Card className={classes.card}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <Typography
                        component="h2"
                        style={{
                          color: "#0CADCF",
                          marginBottom: 10,
                        }}
                      >
                        Forgot Password
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <TextField
                        error={errors.email && touched.email ? true : false}
                        placeholder="Registered Email"
                        label="Registered Email"
                        id="email"
                        value={values.email}
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        onChange={handleChange}
                        name="email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineIcon />
                            </InputAdornment>
                          ),
                        }}
                      />{" "}
                      {errors.email && touched.email && (
                        <FormHelperText id="component-error-text">
                          {errors.email}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item md={12} xs={12}>
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
