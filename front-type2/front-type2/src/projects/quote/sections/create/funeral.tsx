import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  FuneralTypes,
  FuneralPaymentTypes,
  MonthlyPaymentPlans,
  FuneralProviderOptions,
  ContractLengthOption,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Broadband(props) {
  console.log(props.serviceDataFromLead);
  let leadServiceDataInit: any = null;

  if (props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.contract_length = { label: leadServiceDataInit.contract_length, value: leadServiceDataInit.contract_length }
    leadServiceDataInit.funeralProvider = FuneralProviderOptions.filter((fp) => {
      if (fp.value == leadServiceDataInit.funeralProvider)
        return fp;
    })[0];
    leadServiceDataInit.paymentType = FuneralPaymentTypes.filter((fp) => {
      if (fp.value == leadServiceDataInit.paymentType)
        return fp;
    })[0];
    leadServiceDataInit.PaymentPlan = MonthlyPaymentPlans.filter((p) => {
      if (p.age == leadServiceDataInit.age) {
        return p;
      }
    })[0]
  }

  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const leadState = useSelector(selectLeadState);

  let filterMonthlyPaymentPlans = [];
  const filterPlan = (e) => {
    filterMonthlyPaymentPlans = MonthlyPaymentPlans.filter(
      (s) => Number(s.age) === Number(e.target.value)
    );
  };
  const ii: any = {
    saveLeadData: false,
    funeralProvider: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    funeralType: "",
    planType: "",
    paymentType: "",
    PaymentPlan: "",
    specialRequest: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          const qu: any = {};
          if (value.funeralProvider)
            qu.funeralProvider = value.funeralProvider.value;
          if (value.name) qu.name = value.name;
          if (value.phone) qu.phone = value.phone;
          if (value.email) qu.email = value.email;
          if (value.age) qu.age = value.age;
          if (value.address) qu.address = value.address;
          if (value.funeralType) qu.funeralType = value.funeralType.value;
          if (value.planType) qu.planType = value.planType.value;
          if (value.paymentType) qu.paymentType = value.paymentType.value;
          if (value.specialRequest) qu.specialRequest = value.specialRequest;
          if (value.PaymentPlan) qu.PaymentPlan = value.PaymentPlan.value;
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
          }
          if (value.saveLeadData) {
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { funeral: qu }, service: 'funeral' });
          } else {
            console.log("not there");
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                funeral: qu,
                Supplier: null
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, null);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          age: Yup.number()
            .required("Age is required")
            .min(50, "Age must be a 50 - 75!")
            .max(75, "Age must be a 50 - 75!"),
          funeralProvider: Yup.string().required(
            "Funeral Provider is required"
          ),
          name: Yup.string().required("Name is required"),
          phone: Yup.string().required("Phone is required"),
          email: Yup.string().required("Email is required"),
          address: Yup.string().required("Address is required"),
          funeralType: Yup.string().required("Funeral Type is required"),
          paymentType: Yup.string().required("Payment Type is required"),
          specialRequest: Yup.string().required("Special Request is required"),
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
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            submitForm
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.funeralProvider && touched.funeralProvider
                        ? "ErrorColor"
                        : ""
                    }
                    id="funeralProvider"
                    name="funeralProvider"
                    placeholder="Funeral Provider"
                    value={values.funeralProvider}
                    onChange={(e) => {
                      setFieldValue("funeralProvider", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={FuneralProviderOptions}
                  />
                  {errors.funeralProvider && touched.funeralProvider && (
                    <FormHelperText
                      className="errormsg"
                      id="funeralProvider-error"
                    >
                      {errors.funeralProvider}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.name && touched.name ? true : false}
                    name="name"
                    label="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="name-error"
                    className="WidhtFull100"
                  />
                  {errors.name && touched.name && (
                    <FormHelperText className="errormsg" id="name-error">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.phone && touched.phone ? true : false}
                    name="phone"
                    label="Phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="phone-error"
                    className="WidhtFull100"
                  />
                  {errors.phone && touched.phone && (
                    <FormHelperText className="errormsg" id="phone-error">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.email && touched.email ? true : false}
                    name="email"
                    label="Email"
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
                    error={!!(errors.address && touched.address)}
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="address-error"
                    className="WidhtFull100"
                  />
                  {errors.address && touched.address && (
                    <FormHelperText className="errormsg" id="address-error">
                      {errors.address}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.funeralType && touched.funeralType
                        ? "ErrorColor"
                        : ""
                    }
                    id="funeralType"
                    name="funeralType"
                    placeholder="Funeral Type"
                    value={values.funeralType}
                    onChange={(e) => {
                      setFieldValue("funeralType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={FuneralTypes}
                  />
                  {errors.funeralType && touched.funeralType && (
                    <FormHelperText className="errormsg" id="funeralType-error">
                      {errors.funeralType}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.paymentType && touched.paymentType
                        ? "ErrorColor"
                        : ""
                    }
                    id="paymentType"
                    name="paymentType"
                    placeholder="Payment Type"
                    value={values.paymentType}
                    onChange={(e) => {
                      setFieldValue("paymentType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={FuneralPaymentTypes}
                  />
                  {errors.paymentType && touched.paymentType && (
                    <FormHelperText className="errormsg" id="paymentType-error">
                      {errors.paymentType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.age ? true : false}
                    name="age"
                    id="age"
                    label="Age"
                    value={values.age}
                    onChange={(e) => {
                      filterPlan(e);
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="age-error"
                    className="WidhtFull100"
                  />
                  {errors.age && (
                    <FormHelperText className="errormsg" id="age-error">
                      {errors.age}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.PaymentPlan && touched.PaymentPlan
                        ? "ErrorColor"
                        : ""
                    }
                    id="PaymentPlan"
                    name="PaymentPlan"
                    placeholder="Over 50s Payment Plan"
                    value={values.PaymentPlan}
                    onChange={(e) => {
                      setFieldValue("PaymentPlan", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={filterMonthlyPaymentPlans}
                  />
                  {errors.PaymentPlan && touched.PaymentPlan && (
                    <FormHelperText className="errormsg" id="PaymentPlan-error">
                      {errors.PaymentPlan}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.specialRequest && touched.specialRequest
                        ? true
                        : false
                    }
                    name="specialRequest"
                    type="specialRequest"
                    label="Special Request Field"
                    value={values.specialRequest}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="specialRequest-error"
                    className="WidhtFull100"
                  />
                  {errors.specialRequest && touched.specialRequest && (
                    <FormHelperText
                      className="errormsg"
                      id="specialRequest-error"
                    >
                      {errors.specialRequest}
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
                    props.setFieldValue('saveLeadData', false);
                    props.submitForm();
                  }}
                >
                  Generate Quote
                </Button>{" "}
                {currentProps.isFromLead && <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', true);
                    props.submitForm();
                  }}
                >
                  Save
                </Button>}
                {leadState.isSaveLeadLoading && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
