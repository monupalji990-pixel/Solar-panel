import {
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { Formik } from "formik";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectContactOptions,
  selectSendinblueContactState,
  contactAction,
} from "../redux/sendinblueContact";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CardActions from "@material-ui/core/CardActions";

import * as Yup from "yup";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "3px",
    marginBottom: "10px",
  },
  HeaderStyle: {
    position: "absolute",
    top: 10,
    display: "flex",
    justifyContent: "center",
    width: "81%",
    marginLeft: "6%",
    "@media(max-width:480px)": {
      width: "36%",
      top: "14px",
      right: 0,
    },
  },
}));

export default function AddContact(props) {
  const templateOptions = useSelector(selectContactOptions);
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(contactAction.changeAddTemplateDrawerStatus(false));
  }

  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "960px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Sendinblue Contact"
      open={templateOptions.openAddContactDrawer}
      onClose={handleClose}
    >
      <AddTemplateLogic {...props} />
    </MyDrawer>
  );
}

function AddTemplateLogic(props) {
  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);

  useEffect(() => {
    props._getlistOfContactList();
  }, []);

  let options = [];
  if (props?.contactState?.listContactList?.lists?.length > 0) {
    options = props.contactState.listContactList.lists.map((e) => {
      return { label: e.name, value: e.id };
    })
  }

  return (
    <>
      <Grid>
        <Formik
          enableReinitialize
          initialValues={{ email: "", firstName: "", lastName: "", listIds: [], sms: "" }}
          onSubmit={(values) => {
            console.log(values);
            let obj: any = {};
            obj.email = values.email;

            obj.attributes = {
              FIRSTNAME: values.firstName,
              LASTNAME: values.lastName
            }
            if (values.sms) {
              obj.attributes.SMS = values.sms;
            }
            obj.listIds = values.listIds.map(e => e.value);
            console.log(obj);
            props._addContact(obj);
            setStartLoader(true);

          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().nullable().email().required("Email is Required"),
            firstName: Yup.string().nullable().required("First name is Required"),
          })}
        >
          {(pprops) => {
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
            } = pprops;
            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <div className={classes.HeaderStyle}>
                    <h1 style={{ fontSize: 22 }}> Add Sendinblue Contacts </h1>
                  </div>
                </Grid>
                <Grid container className={classes.Spacing} spacing={5}>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      variant="outlined"
                      error={
                        (errors.email && touched.email) ? true : false
                      }
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="email-error"
                      className="WidhtFull100"
                    />
                    {errors.email && touched.email && (
                      <FormHelperText className="errormsg" id="email-error">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      variant="outlined"
                      error={
                        errors.firstName && touched.firstName ? true : false
                      }
                      label="First Name"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="firstName-error"
                      className="WidhtFull100"
                    />
                    {errors.firstName && touched.firstName && (
                      <FormHelperText className="errormsg" id="firstName-error">
                        {errors.firstName}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      variant="outlined"
                      error={
                        errors.lastName && touched.lastName ? true : false
                      }
                      label="Last Name"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="lastName-error"
                      className="WidhtFull100"
                    />
                    {errors.lastName && touched.lastName && (
                      <FormHelperText className="errormsg" id="lastName-error">
                        {errors.lastName}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      autoFocus
                      variant="outlined"
                      error={
                        errors.sms && touched.sms ? true : false
                      }
                      label="SMS (with country code)"
                      name="sms"
                      value={values.sms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="sms-error"
                      className="WidhtFull100"
                    />
                    {errors.sms && touched.sms && (
                      <FormHelperText className="errormsg" id="sms-error">
                        {errors.sms}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item alignContent='center' md={12} sm={12} xs={8}>
                    <Select
                      placeholder="Select Contact List"
                      options={options}
                      isMulti
                      className="WidhtFull100 basic-multi-select"
                      onChange={(obj, action) => {
                        console.log(action)
                        setFieldValue('listIds', obj);
                      }}
                      value={values.listIds}
                    />
                  </Grid>
                </Grid>
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
                    Add Contact
                  </Button>
                  {startLoader && <CircularProgress />}
                </CardActions>
              </form>
            )
          }}
        </Formik>
      </Grid>
    </>
  )
}
