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
  typeOfBusinessRatesWorkOptions,
  yesAndNoOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function BusinessRates(props) {

  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const [startLoader, setStartLoader] = useState(false);
  const currentProps = props;

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "BusinessRates",
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
    leadServiceDataInit.typeOfBusinessRatesWork = leadServiceDataInit.typeOfBusinessRatesWork.map(
      (i) => {
        return { label: i, value: i };
      }
    );
    leadServiceDataInit.businessRatesBill = {
      label: leadServiceDataInit.businessRatesBill,
      value: leadServiceDataInit.businessRatesBill,
    };
    leadServiceDataInit.ratesReliefCompletedForm = {
      label: leadServiceDataInit.ratesReliefCompletedForm,
      value: leadServiceDataInit.ratesReliefCompletedForm,
    };
    leadServiceDataInit.britishPassport = {
      label: leadServiceDataInit.britishPassport,
      value: leadServiceDataInit.britishPassport,
    };
    leadServiceDataInit.homeProof = {
      label: leadServiceDataInit.homeProof,
      value: leadServiceDataInit.homeProof,
    };
    leadServiceDataInit.propertyLayoutDiagram = {
      label: leadServiceDataInit.propertyLayoutDiagram,
      value: leadServiceDataInit.propertyLayoutDiagram,
    };
    leadServiceDataInit.sitePhotos = {
      label: leadServiceDataInit.sitePhotos,
      value: leadServiceDataInit.sitePhotos,
    };
    leadServiceDataInit.lease = {
      label: leadServiceDataInit.lease,
      value: leadServiceDataInit.lease,
    };
    leadServiceDataInit.directorStatement = {
      label: leadServiceDataInit.directorStatement,
      value: leadServiceDataInit.directorStatement,
    };
  }
  const ii: any = {
    saveLeadData: false,
    current_supplier: "",
    previous_contract_length: "",
    previous_contract_start_date: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
    insurance: "",
    passportNumber: "",
    typeOfBusinessRatesWork: "",
    localAuthorityRefNumber: "",
    businessRatesAccountNo: "",
    businessRatesBill: "",
    ratesReliefCompletedForm: "",
    britishPassport: "",
    homeProof: "",
    propertyLayoutDiagram: "",
    sitePhotos: "",
    lease: "",
    directorStatement: "",
    directorDetails: "",
    currentRateableValue: "",
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        enableReinitialize
        onSubmit={(value) => {
          try {
            const qu: any = {};
            let SupplerID = "";
            if (value.current_supplier)
              SupplerID = value.current_supplier.value;
            if (value.insurance) qu.insurance = value.insurance;
            if (value.passportNumber) qu.passportNumber = value.passportNumber;
            if (
              value.typeOfBusinessRatesWork &&
              value.typeOfBusinessRatesWork.length > 0
            )
              qu.typeOfBusinessRatesWork = value.typeOfBusinessRatesWork.map(
                (product) => product.value
              );
            if (value.localAuthorityRefNumber)
              qu.localAuthorityRefNumber = value.localAuthorityRefNumber;
            if (value.businessRatesAccountNo)
              qu.businessRatesAccountNo = value.businessRatesAccountNo;
            if (value.directorDetails)
              qu.directorDetails = value.directorDetails;
            if (value.currentRateableValue)
              qu.currentRateableValue = value.currentRateableValue;

            if (
              value.businessRatesBill &&
              value.businessRatesBill.label &&
              value.businessRatesBill.value
            ) {
              qu.businessRatesBill = value.businessRatesBill.value;
            }
            if (
              value.ratesReliefCompletedForm &&
              value.ratesReliefCompletedForm.label &&
              value.ratesReliefCompletedForm.value
            ) {
              qu.ratesReliefCompletedForm =
                value.ratesReliefCompletedForm.value;
            }
            if (
              value.britishPassport &&
              value.britishPassport.label &&
              value.britishPassport.value
            ) {
              qu.britishPassport = value.britishPassport.value;
            }
            if (
              value.homeProof &&
              value.homeProof.label &&
              value.homeProof.value
            ) {
              qu.homeProof = value.homeProof.value;
            }
            if (
              value.propertyLayoutDiagram &&
              value.propertyLayoutDiagram.label &&
              value.propertyLayoutDiagram.value
            ) {
              qu.propertyLayoutDiagram = value.propertyLayoutDiagram.value;
            }
            if (
              value.sitePhotos &&
              value.sitePhotos.label &&
              value.sitePhotos.value
            ) {
              qu.sitePhotos = value.sitePhotos.value;
            }
            if (value.lease && value.lease.label && value.lease.value) {
              qu.lease = value.lease.value;
            }
            if (
              value.directorStatement &&
              value.directorStatement.label &&
              value.directorStatement.value
            ) {
              qu.directorStatement = value.directorStatement.value;
            }

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
              qu.contract_end_date = new Date(
                value.contract_end_date
              ).getTime();
            } else {
              qu.contract_end_date = new Date().getTime();
            }

            if (value.previous_contract_length)
              qu.previous_contract_length =
                value.previous_contract_length.value;
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
                serviceData: { businessrates: qu },
                service: "businessrates",
              });
            } else {
              if (currentProps.isFromLead) {
                currentProps.setFieldValue("otherdata", {
                  businessrates: qu,
                  Supplier: SupplerID,
                });
                currentProps.submitForm();
              } else {
                props.GetServiceData(qu, SupplerID);
              }
            }
          } catch (e) {
            console.log(e);
          }
        }}
        validationSchema={Yup.object().shape({
          current_supplier: Yup.string().required("Supplier is required"),
          insurance: Yup.string().required("Insurance  required"),
          passportNumber: Yup.string().required("Passport Number is required"),
          typeOfBusinessRatesWork: Yup.array()
            .min(1)
            .required("Type Of Business Rates Work is required"),
          localAuthorityRefNumber: Yup.number().required(
            "Local Authority Ref Number is required"
          ),
          businessRatesAccountNo: Yup.string().required(
            "Business Rates Account No is required"
          ),
          businessRatesBill: Yup.string().required(
            "Business Rates Bill is required"
          ),
          ratesReliefCompletedForm: Yup.string().required(
            "Rates Relief Completed Form is required"
          ),
          britishPassport: Yup.string().required(
            "British Passport is required"
          ),
          homeProof: Yup.string().required("Home Proof is required"),
          propertyLayoutDiagram: Yup.string().required(
            "Property Layout Diagram is required"
          ),
          sitePhotos: Yup.string().required("Site Photos is required"),
          lease: Yup.string().required("Lease is required"),
          directorStatement: Yup.string().required(
            "Director Statement is required"
          ),
          directorDetails: Yup.string().required(
            "Director Details is required"
          ),
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
                    placeholder="Local Authority"
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
                  <TextField
                    variant="outlined"
                    error={!!(errors.insurance && touched.insurance)}
                    name="insurance"
                    label="Ni Insurance"
                    type="text"
                    value={values.insurance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="typeOfBusiness-error"
                    className="WidhtFull100"
                  />
                  {errors.insurance && touched.insurance && (
                    <FormHelperText
                      className="errormsg"
                      id="typeOfBusiness-error"
                    >
                      {errors.insurance}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.passportNumber && touched.passportNumber)}
                    name="passportNumber"
                    label="Passport Number"
                    type="text"
                    value={values.passportNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="passportNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.passportNumber && touched.passportNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="passportNumber-error"
                    >
                      {errors.passportNumber}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.typeOfBusinessRatesWork &&
                        touched.typeOfBusinessRatesWork
                        ? "ErrorColor"
                        : ""
                    }
                    isMulti
                    id="typeOfBusinessRatesWork"
                    name="typeOfBusinessRatesWork"
                    label="Type Of Business Rates Work"
                    placeholder="Type Of Business Rates Work"
                    value={values.typeOfBusinessRatesWork}
                    onChange={(e) => {
                      setFieldValue("typeOfBusinessRatesWork", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="typeOfBusinessRatesWork-error"
                    options={typeOfBusinessRatesWorkOptions}
                  />
                  {errors.typeOfBusinessRatesWork &&
                    touched.typeOfBusinessRatesWork && (
                      <FormHelperText
                        className="errormsg"
                        id="typeOfBusinessRatesWork-error"
                      >
                        {errors.typeOfBusinessRatesWork}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(
                        errors.localAuthorityRefNumber &&
                        touched.localAuthorityRefNumber
                      )
                    }
                    name="localAuthorityRefNumber"
                    label="Local Authority Ref Number"
                    type="number"
                    value={values.localAuthorityRefNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="localAuthorityRefNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.localAuthorityRefNumber &&
                    touched.localAuthorityRefNumber && (
                      <FormHelperText
                        className="errormsg"
                        id="localAuthorityRefNumber-error"
                      >
                        {errors.localAuthorityRefNumber}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(
                        errors.businessRatesAccountNo &&
                        touched.businessRatesAccountNo
                      )
                    }
                    name="businessRatesAccountNo"
                    label="Business Rates Account No"
                    type="number"
                    value={values.businessRatesAccountNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="businessRatesAccountNo-error"
                    className="WidhtFull100"
                  />
                  {errors.businessRatesAccountNo &&
                    touched.businessRatesAccountNo && (
                      <FormHelperText
                        className="errormsg"
                        id="businessRatesAccountNo-error"
                      >
                        {errors.businessRatesAccountNo}
                      </FormHelperText>
                    )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.businessRatesBill && touched.businessRatesBill
                        ? "ErrorColor"
                        : ""
                    }
                    id="businessRatesBill"
                    name="businessRatesBill"
                    placeholder="Business Rates Bill"
                    value={values.businessRatesBill}
                    onChange={(e) => {
                      setFieldValue("businessRatesBill", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="businessRatesBill-error"
                    options={yesAndNoOptions}
                  />
                  {errors.businessRatesBill && touched.businessRatesBill && (
                    <FormHelperText
                      className="errormsg"
                      id="businessRatesBill-error"
                    >
                      {errors.businessRatesBill}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.ratesReliefCompletedForm &&
                        touched.ratesReliefCompletedForm
                        ? "ErrorColor"
                        : ""
                    }
                    id="ratesReliefCompletedForm"
                    name="ratesReliefCompletedForm"
                    placeholder="Rates Relief Completed Form"
                    value={values.ratesReliefCompletedForm}
                    onChange={(e) => {
                      setFieldValue("ratesReliefCompletedForm", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ratesReliefCompletedForm-error"
                    options={yesAndNoOptions}
                  />
                  {errors.ratesReliefCompletedForm &&
                    touched.ratesReliefCompletedForm && (
                      <FormHelperText
                        className="errormsg"
                        id="ratesReliefCompletedForm-error"
                      >
                        {errors.ratesReliefCompletedForm}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.britishPassport && touched.britishPassport
                        ? "ErrorColor"
                        : ""
                    }
                    id="britishPassport"
                    name="britishPassport"
                    placeholder="British Passport"
                    value={values.britishPassport}
                    onChange={(e) => {
                      setFieldValue("britishPassport", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="britishPassport-error"
                    options={yesAndNoOptions}
                  />
                  {errors.britishPassport && touched.britishPassport && (
                    <FormHelperText
                      className="errormsg"
                      id="britishPassport-error"
                    >
                      {errors.britishPassport}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.homeProof && touched.homeProof ? "ErrorColor" : ""
                    }
                    id="homeProof"
                    name="homeProof"
                    placeholder="Home Proof"
                    value={values.homeProof}
                    onChange={(e) => {
                      setFieldValue("homeProof", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="homeProof-error"
                    options={yesAndNoOptions}
                  />
                  {errors.homeProof && touched.homeProof && (
                    <FormHelperText className="errormsg" id="homeProof-error">
                      {errors.homeProof}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.propertyLayoutDiagram &&
                        touched.propertyLayoutDiagram
                        ? "ErrorColor"
                        : ""
                    }
                    id="propertyLayoutDiagram"
                    name="propertyLayoutDiagram"
                    placeholder="Property Layout Diagram"
                    value={values.propertyLayoutDiagram}
                    onChange={(e) => {
                      setFieldValue("propertyLayoutDiagram", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="propertyLayoutDiagram-error"
                    options={yesAndNoOptions}
                  />
                  {errors.propertyLayoutDiagram &&
                    touched.propertyLayoutDiagram && (
                      <FormHelperText
                        className="errormsg"
                        id="propertyLayoutDiagram-error"
                      >
                        {errors.propertyLayoutDiagram}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.sitePhotos && touched.sitePhotos
                        ? "ErrorColor"
                        : ""
                    }
                    id="sitePhotos"
                    name="sitePhotos"
                    placeholder="Site Photos"
                    value={values.sitePhotos}
                    onChange={(e) => {
                      setFieldValue("sitePhotos", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="sitePhotos-error"
                    options={yesAndNoOptions}
                  />
                  {errors.sitePhotos && touched.sitePhotos && (
                    <FormHelperText className="errormsg" id="sitePhotos-error">
                      {errors.sitePhotos}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.lease && touched.lease ? "ErrorColor" : ""
                    }
                    id="lease"
                    name="lease"
                    placeholder="Lease"
                    value={values.lease}
                    onChange={(e) => {
                      setFieldValue("lease", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="lease-error"
                    options={yesAndNoOptions}
                  />
                  {errors.lease && touched.lease && (
                    <FormHelperText className="errormsg" id="lease-error">
                      {errors.lease}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.directorStatement && touched.directorStatement
                        ? "ErrorColor"
                        : ""
                    }
                    id="directorStatement"
                    name="directorStatement"
                    placeholder="Director Statement"
                    value={values.directorStatement}
                    onChange={(e) => {
                      setFieldValue("directorStatement", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="directorStatement-error"
                    options={yesAndNoOptions}
                  />
                  {errors.directorStatement && touched.directorStatement && (
                    <FormHelperText
                      className="errormsg"
                      id="directorStatement-error"
                    >
                      {errors.directorStatement}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(errors.directorDetails && touched.directorDetails)
                    }
                    name="directorDetails"
                    label="Director Details"
                    type="text"
                    value={values.directorDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="directorDetails-error"
                    className="WidhtFull100"
                  />
                  {errors.directorDetails && touched.directorDetails && (
                    <FormHelperText
                      className="errormsg"
                      id="directorDetails-error"
                    >
                      {errors.directorDetails}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(
                        errors.currentRateableValue &&
                        touched.currentRateableValue
                      )
                    }
                    name="currentRateableValue"
                    label="Current Rateable value (GDP Pound)"
                    type="number"
                    value={values.currentRateableValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="currentRateableValue-error"
                    className="WidhtFull100"
                  />
                  {errors.currentRateableValue && touched.currentRateableValue && (
                    <FormHelperText
                      className="errormsg"
                      id="currentRateableValue-error"
                    >
                      {errors.currentRateableValue}
                    </FormHelperText>
                  )}
                </Grid>
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
                >
                  Generate Quote
                </Button>
                {currentProps.isFromLead && (
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      props.setFieldValue("saveLeadData", true);
                      props.submitForm();
                    }}
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
