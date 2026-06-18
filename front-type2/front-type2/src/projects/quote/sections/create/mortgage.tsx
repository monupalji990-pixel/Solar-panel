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
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import {
  lifeInsuranceOptions,
  criticalIllnessOptions,
  homeInsuranceOptions,
  funeralPlanOptions,
  MorgageType,
  ContractLengthOption,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Broadband(props) {
  let leadServiceDataInit: any = null;

  if (
    props.serviceDataFromLead &&
    Object.keys(props.serviceDataFromLead).length > 1
  ) {
    leadServiceDataInit = { ...props.serviceDataFromLead };

    leadServiceDataInit.previous_contract_length = {
      label: leadServiceDataInit.previous_contract_length,
      value: leadServiceDataInit.previous_contract_length,
    };
    leadServiceDataInit.contract_length = {
      label: leadServiceDataInit.contract_length,
      value: leadServiceDataInit.contract_length,
    };
    leadServiceDataInit.morgage_type = {
      label: leadServiceDataInit.morgage_type,
      value: leadServiceDataInit.morgage_type,
    };
    leadServiceDataInit.lifeInsurance = lifeInsuranceOptions.filter((li) => {
      if (li.value == leadServiceDataInit.lifeInsurance) return li;
    })[0];
    leadServiceDataInit.criticalIllness = criticalIllnessOptions.filter(
      (ci) => {
        if (ci.value == leadServiceDataInit.criticalIllness) return ci;
      }
    )[0];
    leadServiceDataInit.homeInsurance = homeInsuranceOptions.filter((hi) => {
      if (hi.value == leadServiceDataInit.homeInsurance) return hi;
    })[0];
    leadServiceDataInit.funeralPlan = funeralPlanOptions.filter((fp) => {
      if (fp.value == leadServiceDataInit.funeralPlan) return fp.value;
    })[0];

    leadServiceDataInit.EAcompanyName =
      leadServiceDataInit.estateAgent.EAcompanyName;
    leadServiceDataInit.EAphoneNumber =
      leadServiceDataInit.estateAgent.EAphoneNumber;
    leadServiceDataInit.EAemail = leadServiceDataInit.estateAgent.EAemail;
    leadServiceDataInit.EAnameOfContact =
      leadServiceDataInit.estateAgent.EAnameOfContact;
    delete leadServiceDataInit.estateAgent;

    leadServiceDataInit.ScompanyName =
      leadServiceDataInit.solicitors.ScompanyName;
    leadServiceDataInit.SphoneNumber =
      leadServiceDataInit.solicitors.SphoneNumber;
    leadServiceDataInit.Semail = leadServiceDataInit.solicitors.Semail;
    leadServiceDataInit.SnameOfContact =
      leadServiceDataInit.solicitors.SnameOfContact;
    delete leadServiceDataInit.solicitors;

    leadServiceDataInit.LcompanyName = leadServiceDataInit.lender.LcompanyName;
    leadServiceDataInit.LphoneNumber = leadServiceDataInit.lender.LphoneNumber;
    leadServiceDataInit.Lemail = leadServiceDataInit.lender.Lemail;
    leadServiceDataInit.LnameOfContact =
      leadServiceDataInit.lender.LnameOfContact;
    delete leadServiceDataInit.lender;
  }
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const leadState = useSelector(selectLeadState);
  const [RadioToggle, setRadioToggle] = React.useState("0");

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };
  const ii: any = {
    saveLeadData: false,
    addproperty: "",
    morgage_type: "",
    phone: "",
    companyName: "",
    phoneNumber: "",
    email: "",
    nameOfContact: "",
    propertyValue: "",
    deposit: "",
    loanValue: "",
    creditScore: "",
    valuationDate: "",
    cValuation: "",
    dateOffer: "",
    contract_exchange_date: "",
    completionDate: "",
    lifeInsurance: "",
    criticalIllness: "",
    homeInsurance: "",
    funeralPlan: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          let qu: any = {
            estateAgent: {
              EAcompanyName: value.EAcompanyName,
              EAphoneNumber: value.EAphoneNumber,
              EAemail: value.EAemail,
              EAnameOfContact: value.EAnameOfContact,
            },
            solicitors: {
              ScompanyName: value.ScompanyName,
              SphoneNumber: value.SphoneNumber,
              Semail: value.Semail,
              SnameOfContact: value.SnameOfContact,
            },
            lender: {
              LcompanyName: value.LcompanyName,
              LphoneNumber: value.LphoneNumber,
              Lemail: value.Lemail,
              LnameOfContact: value.LnameOfContact,
            },
          };

          if (value.addproperty) qu.addproperty = value.addproperty;
          if (value.morgage_type) qu.morgage_type = value.morgage_type.value;
          if (value.phone) qu.phone = value.phone;
          if (value.propertyValue) qu.propertyValue = value.propertyValue;
          if (value.deposit) qu.deposit = value.deposit;
          if (value.loanValue) qu.loanValue = value.loanValue;
          if (value.creditScore) qu.creditScore = value.creditScore;
          if (value.valuationDate) qu.valuationDate = value.valuationDate;
          if (value.cValuation) qu.cValuation = value.cValuation;
          if (value.dateOffer) qu.dateOffer = value.dateOffer;
          if (value.contract_exchange_date)
            qu.contract_exchange_date = value.contract_exchange_date;
          if (value.completionDate) qu.completionDate = value.completionDate;
          if (value.lifeInsurance) qu.lifeInsurance = value.lifeInsurance.value;
          if (value.criticalIllness)
            qu.criticalIllness = value.criticalIllness.value;
          if (value.homeInsurance) qu.homeInsurance = value.homeInsurance.value;
          if (value.funeralPlan) qu.funeralPlan = value.funeralPlan.value;
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
            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { mortgage: qu },
              service: "mortgage",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                mortgage: qu,
                Supplier: null,
              });
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, null);
            }
          }
        }}
        validationSchema={Yup.object().shape({
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
            handleReset,
            setFieldValue,
            submitForm,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.addproperty && touched.addproperty ? true : false
                    }
                    name="addproperty"
                    multiline
                    label="Address of Property"
                    value={values.addproperty}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="addproperty-error"
                    className="WidhtFull100"
                  />
                  {errors.addproperty && touched.addproperty && (
                    <FormHelperText className="errormsg" id="addproperty-error">
                      {errors.addproperty}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.morgage_type && touched.morgage_type
                        ? "ErrorColor"
                        : ""
                    }
                    id="morgage_type"
                    name="morgage_type"
                    placeholder="Type of Morgage"
                    value={values.morgage_type}
                    onChange={(e) => {
                      setFieldValue("morgage_type", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={MorgageType}
                  />
                  {errors.morgage_type && touched.morgage_type && (
                    <FormHelperText
                      className="errormsg"
                      id="morgage_type-error"
                    >
                      {errors.morgage_type}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.phone && touched.phone ? true : false}
                    name="phone"
                    label="Phone"
                    type="number"
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
                <Grid item xs={12} md={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="subtitle1">Estate Agents</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.EAcompanyName && touched.EAcompanyName
                        ? true
                        : false
                    }
                    name="EAcompanyName"
                    label="Company Name"
                    value={values.EAcompanyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="EAcompanyName-error"
                    className="WidhtFull100"
                  />
                  {errors.EAcompanyName && touched.EAcompanyName && (
                    <FormHelperText
                      className="errormsg"
                      id="EAcompanyName-error"
                    >
                      {errors.EAcompanyName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.EAphoneNumber && touched.EAphoneNumber
                        ? true
                        : false
                    }
                    name="EAphoneNumber"
                    label="Phone Number"
                    type="number"
                    value={values.EAphoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="EAphoneNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.EAphoneNumber && touched.EAphoneNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="EAphoneNumber-error"
                    >
                      {errors.EAphoneNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.EAemail && touched.EAemail ? true : false}
                    name="EAemail"
                    label="Email Address"
                    type="EAemail"
                    value={values.EAemail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="EAemail-error"
                    className="WidhtFull100"
                  />
                  {errors.EAemail && touched.EAemail && (
                    <FormHelperText className="errormsg" id="EAemail-error">
                      {errors.EAemail}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.EAnameOfContact && touched.EAnameOfContact
                        ? true
                        : false
                    }
                    name="EAnameOfContact"
                    label="Name Of Contact"
                    value={values.EAnameOfContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="EAnameOfContact-error"
                    className="WidhtFull100"
                  />
                  {errors.EAnameOfContact && touched.EAnameOfContact && (
                    <FormHelperText
                      className="errormsg"
                      id="EAnameOfContact-error"
                    >
                      {errors.EAnameOfContact}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="subtitle1">Solicitors</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.ScompanyName && touched.ScompanyName ? true : false
                    }
                    name="ScompanyName"
                    label="Company Name"
                    value={values.ScompanyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ScompanyName-error"
                    className="WidhtFull100"
                  />
                  {errors.ScompanyName && touched.ScompanyName && (
                    <FormHelperText
                      className="errormsg"
                      id="ScompanyName-error"
                    >
                      {errors.ScompanyName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.SphoneNumber && touched.SphoneNumber ? true : false
                    }
                    name="SphoneNumber"
                    label="Phone Number"
                    type="number"
                    value={values.SphoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SphoneNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.SphoneNumber && touched.SphoneNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="SphoneNumber-error"
                    >
                      {errors.SphoneNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.Semail && touched.Semail ? true : false}
                    name="Semail"
                    label="Email Address"
                    type="Semail"
                    value={values.Semail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Semail-error"
                    className="WidhtFull100"
                  />
                  {errors.Semail && touched.Semail && (
                    <FormHelperText className="errormsg" id="Semail-error">
                      {errors.Semail}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.SnameOfContact && touched.SnameOfContact
                        ? true
                        : false
                    }
                    name="SnameOfContact"
                    label="Name Of Contact"
                    value={values.SnameOfContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SnameOfContact-error"
                    className="WidhtFull100"
                  />
                  {errors.SnameOfContact && touched.SnameOfContact && (
                    <FormHelperText
                      className="errormsg"
                      id="SnameOfContact-error"
                    >
                      {errors.SnameOfContact}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="subtitle1">Lender</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.LcompanyName && touched.LcompanyName ? true : false
                    }
                    name="LcompanyName"
                    label="Company Name"
                    value={values.LcompanyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="LcompanyName-error"
                    className="WidhtFull100"
                  />
                  {errors.LcompanyName && touched.LcompanyName && (
                    <FormHelperText
                      className="errormsg"
                      id="LcompanyName-error"
                    >
                      {errors.LcompanyName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.LphoneNumber && touched.LphoneNumber ? true : false
                    }
                    name="LphoneNumber"
                    label="Phone Number"
                    type="number"
                    value={values.LphoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="LphoneNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.LphoneNumber && touched.LphoneNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="LphoneNumber-error"
                    >
                      {errors.LphoneNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.Lemail && touched.Lemail ? true : false}
                    name="Lemail"
                    label="Email Address"
                    type="Lemail"
                    value={values.Lemail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Lemail-error"
                    className="WidhtFull100"
                  />
                  {errors.Lemail && touched.Lemail && (
                    <FormHelperText className="errormsg" id="Lemail-error">
                      {errors.Lemail}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.LnameOfContact && touched.LnameOfContact
                        ? true
                        : false
                    }
                    name="LnameOfContact"
                    label="Name Of Contact"
                    value={values.LnameOfContact}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="LnameOfContact-error"
                    className="WidhtFull100"
                  />
                  {errors.LnameOfContact && touched.LnameOfContact && (
                    <FormHelperText
                      className="errormsg"
                      id="LnameOfContact-error"
                    >
                      {errors.LnameOfContact}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    type="number"
                    error={
                      errors.propertyValue && touched.propertyValue
                        ? true
                        : false
                    }
                    name="propertyValue"
                    label="Value of Property"
                    value={values.propertyValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="propertyValue-error"
                    className="WidhtFull100"
                  />
                  {errors.propertyValue && touched.propertyValue && (
                    <FormHelperText
                      className="errormsg"
                      id="propertyValue-error"
                    >
                      {errors.propertyValue}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    type="number"
                    error={errors.deposit && touched.deposit ? true : false}
                    name="deposit"
                    label="Available Deposit"
                    value={values.deposit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="deposit-error"
                    className="WidhtFull100"
                  />
                  {errors.deposit && touched.deposit && (
                    <FormHelperText className="errormsg" id="deposit-error">
                      {errors.deposit}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    type="number"
                    error={errors.loanValue && touched.loanValue ? true : false}
                    name="loanValue"
                    label="Loan to Value"
                    value={values.loanValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="loanValue-error"
                    className="WidhtFull100"
                  />
                  {errors.loanValue && touched.loanValue && (
                    <FormHelperText className="errormsg" id="loanValue-error">
                      {errors.loanValue}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    type="number"
                    error={
                      errors.creditScore && touched.creditScore ? true : false
                    }
                    name="creditScore"
                    label="Credit Score"
                    value={values.creditScore}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="creditScore-error"
                    className="WidhtFull100"
                  />
                  {errors.creditScore && touched.creditScore && (
                    <FormHelperText className="errormsg" id="creditScore-error">
                      {errors.creditScore}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.valuationDate && touched.valuationDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="valuationDate"
                        label="Valuation Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.valuationDate ? values.valuationDate : null
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "valuationDate",
                            Number(new Date(e).getTime())
                          )
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="valuationDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.valuationDate && touched.valuationDate && (
                    <FormHelperText
                      className="errormsg"
                      id="valuationDate-error"
                    >
                      {errors.valuationDate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    type="number"
                    error={
                      errors.cValuation && touched.cValuation ? true : false
                    }
                    name="cValuation"
                    label="Confirmed Valuation Value"
                    value={values.cValuation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="cValuation-error"
                    className="WidhtFull100"
                  />
                  {errors.cValuation && touched.cValuation && (
                    <FormHelperText className="errormsg" id="cValuation-error">
                      {errors.cValuation}
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
                          errors.dateOffer && touched.dateOffer ? true : false
                        }
                        margin="normal"
                        id="dateOffer"
                        label="Date of Offer"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.dateOffer ? values.dateOffer : null}
                        onChange={(e) =>
                          setFieldValue(
                            "dateOffer",
                            Number(new Date(e).getTime())
                          )
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="dateOffer-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.dateOffer && touched.dateOffer && (
                    <FormHelperText className="errormsg" id="dateOffer-error">
                      {errors.dateOffer}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.contract_exchange_date &&
                          touched.contract_exchange_date
                            ? true
                            : false
                        }
                        margin="normal"
                        id="contract_exchange_date"
                        label="Contract Exchange Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.contract_exchange_date
                            ? values.contract_exchange_date
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "contract_exchange_date",
                            Number(new Date(e).getTime())
                          )
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="contract_exchange_date-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.contract_exchange_date &&
                    touched.contract_exchange_date && (
                      <FormHelperText
                        className="errormsg"
                        id="contract_exchange_date-error"
                      >
                        {errors.contract_exchange_date}
                      </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.completionDate && touched.completionDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="completionDate"
                        label="Completion Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.completionDate ? values.completionDate : null
                        }
                        onChange={(e) =>
                          setFieldValue(
                            "completionDate",
                            Number(new Date(e).getTime())
                          )
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="completionDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.completionDate && touched.completionDate && (
                    <FormHelperText
                      className="errormsg"
                      id="completionDate-error"
                    >
                      {errors.completionDate}
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

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.lifeInsurance && touched.lifeInsurance
                        ? "ErrorColor"
                        : ""
                    }
                    id="lifeInsurance"
                    name="lifeInsurance"
                    placeholder="Life Insurance"
                    value={values.lifeInsurance}
                    onChange={(e) => {
                      setFieldValue("lifeInsurance", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={lifeInsuranceOptions}
                  />
                  {errors.lifeInsurance && touched.lifeInsurance && (
                    <FormHelperText
                      className="errormsg"
                      id="lifeInsurance-error"
                    >
                      {errors.lifeInsurance}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.criticalIllness && touched.criticalIllness
                        ? "ErrorColor"
                        : ""
                    }
                    id="criticalIllness"
                    name="criticalIllness"
                    placeholder="Critical Illness"
                    value={values.criticalIllness}
                    onChange={(e) => {
                      setFieldValue("criticalIllness", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={criticalIllnessOptions}
                  />
                  {errors.criticalIllness && touched.criticalIllness && (
                    <FormHelperText
                      className="errormsg"
                      id="criticalIllness-error"
                    >
                      {errors.criticalIllness}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.homeInsurance && touched.homeInsurance
                        ? "ErrorColor"
                        : ""
                    }
                    id="homeInsurance"
                    name="homeInsurance"
                    placeholder="Home Insurance and Contents"
                    value={values.homeInsurance}
                    onChange={(e) => {
                      setFieldValue("homeInsurance", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={homeInsuranceOptions}
                  />
                  {errors.homeInsurance && touched.homeInsurance && (
                    <FormHelperText
                      className="errormsg"
                      id="homeInsurance-error"
                    >
                      {errors.homeInsurance}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.funeralPlan && touched.funeralPlan
                        ? "ErrorColor"
                        : ""
                    }
                    id="funeralPlan"
                    name="funeralPlan"
                    placeholder="Funeral Plan"
                    value={values.funeralPlan}
                    onChange={(e) => {
                      setFieldValue("funeralPlan", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={funeralPlanOptions}
                  />
                  {errors.funeralPlan && touched.funeralPlan && (
                    <FormHelperText className="errormsg" id="funeralPlan-error">
                      {errors.funeralPlan}
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
