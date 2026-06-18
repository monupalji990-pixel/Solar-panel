import React, { useState } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import {
  supplier_contactAction,
  selectSupplier_contactState,
} from "../redux/supplier_contact";

export default function addContact() {
  const supplier_contactState = useSelector(selectSupplier_contactState);

  const { supplierId } = { ...supplier_contactState };

  const dispatch = useDispatch();

  const _addContact = (payload) =>
    dispatch(supplier_contactAction.addSupplier_contact(payload));

  const [startLoader, setStartLoader] = useState(false);

  const initialValues = {
    ContactPersonName: "",
    TelephoneNumber: "",
    Email: "",
    Department: "",
    jobTitle: "",
    Address: "",
  };

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const contactObject: any = {
            supplierId: supplierId,
            editData: {},
          };
          contactObject.editData.ContactPersonName = values.ContactPersonName;
          contactObject.editData.TelephoneNumber = values.TelephoneNumber;
          contactObject.editData.Email = values.Email;
          contactObject.editData.Department = values.Department;
          contactObject.editData.jobTitle = values.jobTitle;
          contactObject.editData.Address = values.Address;
          contactObject.editData.timestamps = new Date().getTime();
          setStartLoader(true);
          _addContact(contactObject);
        }}
        validationSchema={Yup.object().shape({
          ContactPersonName: Yup.string().required("Contact name is required"),
          TelephoneNumber: Yup.string().required(
            "Telephone Number is required"
          ),
          Email: Yup.string().required("Email is required"),
          Department: Yup.string().required("Department is required"),
          jobTitle: Yup.string().required("Job title is required"),
          Address: Yup.string().required("Address is required"),
        })}
      >
        {(props) => {
          const {
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Add Contact
                  </Typography>
                </Grid>
              </Grid>
              <Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.ContactPersonName && touched.ContactPersonName
                          ? true
                          : false
                      }
                      name="ContactPersonName"
                      label="Contact Person Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="ContactPersonName-error"
                    />
                    {errors.ContactPersonName && touched.ContactPersonName && (
                      <FormHelperText
                        className="errormsg"
                        id="ContactPersonName-error"
                      >
                        {errors.ContactPersonName}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.TelephoneNumber && touched.TelephoneNumber
                          ? true
                          : false
                      }
                      name="TelephoneNumber"
                      label="Telephone Number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="TelephoneNumber-error"
                    />
                    {errors.TelephoneNumber && touched.TelephoneNumber && (
                      <FormHelperText
                        className="errormsg"
                        id="TelephoneNumber-error"
                      >
                        {errors.TelephoneNumber}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={errors.Email && touched.Email ? true : false}
                      name="Email"
                      label="Email"
                      type="Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="Email-error"
                    />
                    {errors.Email && touched.Email && (
                      <FormHelperText className="errormsg" id="Email-error">
                        {errors.Email}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.Department && touched.Department ? true : false
                      }
                      name="Department"
                      label="Department"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="Department-error"
                    />
                    {errors.Department && touched.Department && (
                      <FormHelperText
                        className="errormsg"
                        id="Department-error"
                      >
                        {errors.Department}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={errors.jobTitle && touched.jobTitle ? true : false}
                      name="jobTitle"
                      label="Job Title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="jobTitle-error"
                    />
                    {errors.jobTitle && touched.jobTitle && (
                      <FormHelperText className="errormsg" id="jobTitle-error">
                        {errors.jobTitle}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={errors.Address && touched.Address ? true : false}
                      name="Address"
                      label="Address"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="Address-error"
                    />
                    {errors.Address && touched.Address && (
                      <FormHelperText className="errormsg" id="Address-error">
                        {errors.Address}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Create Contact
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
