import {
  Avatar,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
} from "@material-ui/core";
import { ErrorMessage, Formik } from "formik";
import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  profilePicStyle: {
    height: 140,
    width: 140,
    border: "10px solid rgb(204 204 204 / 20%)",
  },
  DarkBtnStyle: {
    background: "#193562",
    color: "#ffffff",
    "&:hover": {
      background: "#193562",
    },
    padding: "0.5rem 1rem",
    marginRight: "10px",
    cursor: "pointer",
    borderRadius: 3,
    textTransform: "uppercase",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  RemoveBtnStyle: {
    background: "#e24336",
    color: "#ffffff",
    "&:hover": {
      background: "#e24336",
    },
    padding: "0.26rem 1rem",
    cursor: "pointer",
    borderRadius: 3,
    textTransform: "uppercase",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
});

export const EditProfilePhoto = ({ id, src, onChangeImg, onSubmit }) => {
  const initialValues = { [id]: src ? src : "" };

  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
          const modifiedValue = { ...values };
          onSubmit(values, (x) => { }, setSubmitting);
        }}
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
            submitForm,
          } = props;

          return (
            <>
              <form onSubmit={handleSubmit}>
                <Grid container item md={12} xs={12} spacing={2}>
                  <Grid
                    container
                    item
                    md={12}
                    xs={12}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item md={5} xs={12}>
                      <Avatar
                        alt="Remy Sharp"
                        src={values[id]}
                        className={classes.profilePicStyle}
                      />
                      <input
                        style={{
                          display: "none",
                        }}
                        type="file"
                        onChange={(e) => {
                          onChangeImg(e, setFieldValue, submitForm, setStartLoader);
                        }}
                        id={id}
                        accept=".jpg, .jpeg, .png"
                      />
                    </Grid>
                    <Grid item md={7} xs={12}>
                      <label className={classes.DarkBtnStyle} htmlFor={id}>
                        Change Avatar
                      </label>

                      <Button
                        onClick={() => {
                          onChangeImg('', setFieldValue, submitForm, setStartLoader);
                        }}
                        className={classes.RemoveBtnStyle}
                      >
                        Remove
                      </Button>
                      {startLoader && <CircularProgress />}

                      <FormHelperText className="errormsg" id="name-error">
                        <ErrorMessage name={id} component="div" />
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </>
          );
        }}
      </Formik>
    </>
  );
};
