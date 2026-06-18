/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ContractLengthOption,
  insuranceTypeOptions,
  insuranceProductsOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Insurance(props) {
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const [startLoader, setStartLoader] = useState(false);
  const { email, contact } = props;
  const currentProps = props;

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Insurance",
      "add"
    );
  }
  if (
    props.serviceDataFromLead &&
    Object.keys(props.serviceDataFromLead).length > 1
  ) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.current_supplier = supplierList.filter((sup) => {
      if (sup.value == leadServiceDataInit.SupplerID) return sup;
    })[0];
    leadServiceDataInit.previous_contract_length = {
      label: leadServiceDataInit.previous_contract_length,
      value: leadServiceDataInit.previous_contract_length,
    };
    leadServiceDataInit.contract_length = {
      label: leadServiceDataInit.contract_length,
      value: leadServiceDataInit.contract_length,
    };

    leadServiceDataInit.insuranceType = {
      label: leadServiceDataInit.insuranceType,
      value: leadServiceDataInit.insuranceType,
    };
    leadServiceDataInit.insuranceProduct = leadServiceDataInit.insuranceProduct.map(
      (product) => {
        return { label: product, value: product };
      }
    );
  }
  const ii: any = {
    saveLeadData: false,
    current_supplier: "",
    previous_contract_length: "",
    previous_contract_start_date: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
    insuranceType: "",
    insuranceProduct: "",
    typeOfBusiness: "",
    email,
    contactNumber: contact,
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        enableReinitialize
        onSubmit={(value) => {
          const qu: any = {};
          let SupplerID = "";
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.insuranceType) qu.insuranceType = value.insuranceType.value;
          if (value.insuranceProduct && value.insuranceProduct.length > 0)
            qu.insuranceProduct = value.insuranceProduct.map(
              (product) => product.value
            );
          if (value.typeOfBusiness) qu.typeOfBusiness = value.typeOfBusiness;
          if (value.email) qu.email = value.email;
          if (value.contactNumber) qu.contactNumber = value.contactNumber;
          if (value.contract_length)
            qu.contract_length = value.contract_length.value;
          if (value.contract_start_date) {
            qu.contract_start_date = new Date(
              value.contract_start_date
            ).getTime();
          } else {
            qu.contract_start_date = new Date().getTime();
          }
          if (value.contract_end_date) {
            qu.contract_end_date = new Date(value.contract_end_date).getTime();
          } else {
            qu.contract_end_date = new Date().getTime();
          }

          if (value.previous_contract_length)
            qu.previous_contract_length = value.previous_contract_length.value;
          if (value.previous_contract_start_date) {
            qu.previous_contract_start_date = new Date(
              value.previous_contract_start_date
            ).getTime();
          } else {
            qu.previous_contract_start_date = new Date().getTime();
          }
         
          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;

            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { insurance: qu },
              service: "insurance",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                insurance: qu,
                Supplier: SupplerID,
              });
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          current_supplier: Yup.string().required("Supplier is required"),
          insuranceType: Yup.string().required("Insurance Type required"),
          insuranceProduct: Yup.array()
            .min(1)
            .required("Insurance Product is required"),
          typeOfBusiness: Yup.string().required("Type Of Business is required"),
          email: Yup.string().required("Email is required"),
          contactNumber: Yup.string().required("Contact Number is required"),
          previous_contract_length: Yup.string().required(
            "Current contract Length is required"
          ),
          previous_contract_start_date: Yup.string().required(
            "Current contract start date is required"
          ),
          contract_length: Yup.string().required(
            "Preferred Contract Length is required"
          ),
          contract_start_date: Yup.string().required(
            "Contract start date is required"
          ),
          contract_end_date: Yup.string().required(
            "Contract end date is required"
          ),
        })}
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
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.current_supplier && touched.current_supplier
                        ? "ErrorColor"
                        : ""
                    }
                    id="current_supplier"
                    name="current_supplier"
                    placeholder="Insurance Broker"
                    value={values.current_supplier}
                    onChange={(e) => {
                      setFieldValue("current_supplier", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={supplierList}
                  />
                  {errors.current_supplier && touched.current_supplier && (
                    <FormHelperText
                      className="errormsg"
                      id="current_supplier-error"
                    >
                      {errors.current_supplier}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.insuranceType && touched.insuranceType
                        ? "ErrorColor"
                        : ""
                    }
                    id="insuranceType"
                    name="insuranceType"
                    label="Insurance type"
                    placeholder="Insurance type"
                    value={values.insuranceType}
                    onChange={(e) => {
                      setFieldValue("insuranceType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="insuranceType-error"
                    options={insuranceTypeOptions}
                  />
                  {errors.insuranceType && touched.insuranceType && (
                    <FormHelperText
                      className="errormsg"
                      id="insuranceType-error"
                    >
                      {errors.insuranceType}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.insuranceProduct && touched.insuranceProduct
                        ? "ErrorColor"
                        : ""
                    }
                    isMulti
                    id="insuranceProduct"
                    name="insuranceProduct"
                    label="Insurance Product"
                    placeholder="Insurance Product"
                    value={values.insuranceProduct}
                    onChange={(e) => {
                      setFieldValue("insuranceProduct", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="insuranceProduct-error"
                    options={insuranceProductsOptions}
                  />
                  {errors.insuranceProduct && touched.insuranceProduct && (
                    <FormHelperText
                      className="errormsg"
                      id="insuranceProduct-error"
                    >
                      {errors.insuranceProduct}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.typeOfBusiness && touched.typeOfBusiness)}
                    name="typeOfBusiness"
                    label="Type Of Business"
                    type="text"
                    value={values.typeOfBusiness}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="typeOfBusiness-error"
                    className="WidhtFull100"
                  />
                  {errors.typeOfBusiness && touched.typeOfBusiness && (
                    <FormHelperText
                      className="errormsg"
                      id="typeOfBusiness-error"
                    >
                      {errors.typeOfBusiness}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.email && touched.email)}
                    name="email"
                    label="Email"
                    type="email"
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
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.contactNumber && touched.contactNumber)}
                    name="contactNumber"
                    label="Contact Number"
                    type="tel"
                    value={values.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contactNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.contactNumber && touched.contactNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="contactNumber-error"
                    >
                      {errors.contactNumber}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.previous_contract_length &&
                      touched.previous_contract_length
                        ? "ErrorColor"
                        : ""
                    }
                    id="previous_contract_length"
                    name="previous_contract_length"
                    placeholder="Current contract length"
                    value={values.previous_contract_length}
                    onChange={(e) => {
                      setFieldValue("previous_contract_length", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="previous_contract_length-error"
                    options={ContractLengthOption}
                  />
                  {errors.previous_contract_length &&
                    touched.previous_contract_length && (
                      <FormHelperText
                        className="errormsg"
                        id="previous_contract_length-error"
                      >
                        {errors.previous_contract_length}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.previous_contract_start_date &&
                          touched.previous_contract_start_date
                            ? true
                            : false
                        }
                        margin="normal"
                        id="previous_contract_start_date"
                        label="Current contract end date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.previous_contract_start_date
                            ? values.previous_contract_start_date
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("previous_contract_start_date", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="previous_contract_start_date-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.previous_contract_start_date &&
                    touched.previous_contract_start_date && (
                      <FormHelperText
                        className="errormsg"
                        id="previous_contract_start_date-error"
                      >
                        {errors.previous_contract_start_date}
                      </FormHelperText>
                    )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.contract_length && touched.contract_length
                        ? "ErrorColor"
                        : ""
                    }
                    id="contract_length"
                    name="contract_length"
                    placeholder="Preferred Contract length"
                    value={values.contract_length}
                    onChange={(e) => {
                      setFieldValue("contract_length", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contract_length-error"
                    options={ContractLengthOption}
                  />
                  {errors.contract_length && touched.contract_length && (
                    <FormHelperText
                      className="errormsg"
                      id="contract_length-error"
                    >
                      {errors.contract_length}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          !!(
                            errors.contract_start_date &&
                            touched.contract_start_date
                          )
                        }
                        margin="normal"
                        id="contract_start_date"
                        name="contract_start_date"
                        label="Preferred Contract Start Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.contract_start_date
                            ? values.contract_start_date
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("contract_start_date", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="contract_start_date-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.contract_start_date && touched.contract_start_date && (
                    <FormHelperText
                      className="errormsg"
                      id="contract_start_date-error"
                    >
                      {errors.contract_start_date}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          !!(
                            errors.contract_end_date &&
                            touched.contract_end_date
                          )
                        }
                        margin="normal"
                        id="contract_end_date"
                        label="Preferred Contract end date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={
                          values.contract_end_date
                            ? values.contract_end_date
                            : null
                        }
                        onChange={(e) => setFieldValue("contract_end_date", e)}
                        className="WidhtFull100"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="contract_end_date-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.contract_end_date && touched.contract_end_date && (
                    <FormHelperText
                      className="errormsg"
                      id="contract_end_date-error"
                    >
                      {errors.contract_end_date}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue("saveLeadData", false);
                    props.submitForm();
                  }}
                  // type="submit"
                  // disabled={isSubmitting}
                >
                  Generate Quote
                </Button>{" "}
                {currentProps.isFromLead && (
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      props.setFieldValue("saveLeadData", true);
                      props.submitForm();
                    }}
                    // disabled={isSubmitting}
                  >
                    Save
                  </Button>
                )}
                {leadState.isSaveLeadLoading && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
