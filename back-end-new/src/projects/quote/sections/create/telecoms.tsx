import React, { useState } from "react";
import { Field, FieldArray, Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import _ from "lodash";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ContractLengthOption,
  ConnectionOptions,
  LineRentalOptions,
  AddExtrasOptions,
  ExtrasOptions,
  WholeSaleProviderOptions,
  telecomStatusOptions,
  TelecomConnectionOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Telecoms(props) {
  let leadServiceDataInit: any = {};
  const leadState = useSelector(selectLeadState)
  const currentProps = props;

  let supplierList = [];
  if (props.suppliers) {
    let voipList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "VOIP",
      "add"
    );
    let mobileList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Mobile",
      "add"
    );
    let phoneLineList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Phone Line",
      "add"
    );
    supplierList = _.unionBy(voipList, mobileList, phoneLineList, "value");
  }

  if (props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.current_supplier = supplierList?.filter((sup) => {
      if (sup.value == leadServiceDataInit.SupplerID)
        return sup
    })[0];
    leadServiceDataInit.previous_contract_length = { label: leadServiceDataInit.previous_contract_length, value: leadServiceDataInit.previous_contract_length };
    leadServiceDataInit.contract_length = { label: leadServiceDataInit.contract_length, value: leadServiceDataInit.contract_length }
    leadServiceDataInit.AddExtras = AddExtrasOptions?.filter(extra => {
      if (extra?.value == leadServiceDataInit?.AddExtras)
        return extra;
    })[0];
    leadServiceDataInit.connectionType = { label: leadServiceDataInit.connectionType, value: leadServiceDataInit.connectionType };
    leadServiceDataInit.LineRental = { label: leadServiceDataInit.LineRental, value: leadServiceDataInit.LineRental };
    leadServiceDataInit.ConnectionCharges = ConnectionOptions?.filter(charge => {
      if (charge?.value == leadServiceDataInit?.ConnectionCharges)
        return charge;
    })[0];
    leadServiceDataInit.WholeSaleProvider = { label: leadServiceDataInit.WholeSaleProvider, value: leadServiceDataInit.WholeSaleProvider };
    leadServiceDataInit.status = { label: leadServiceDataInit.status, value: leadServiceDataInit.status };
    leadServiceDataInit.phoneNumbers = []
  }

  const ii: any = {
    saveLeadData: false,
    current_supplier: "",
    previous_contract_length: "",
    contract_length: "",
    contract_start_date: "",
    previous_contract_start_date: "",
    phoneNumbers: [{}],
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          let SupplerID = "";
          const qu: any = {};
          if (value.lineRentalPackageName) qu.lineRentalPackageName = value.lineRentalPackageName
          if (value.lineRental) qu.lineRental = value.lineRental
          if (value.ExtraServiceName) qu.ExtraServiceName = value.ExtraServiceName
          if (value.ExtraServiceCharges) qu.ExtraServiceCharges = value.ExtraServiceCharges
          if (value.phoneNumbers.length > 0) qu.phoneNumbers = value.phoneNumbers
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.status) qu.status = value.status.value;
          if (value.connectionType)
            qu.connectionType = value.connectionType.value;
          if (value.ConnectionCharges)
            qu.ConnectionCharges = value.ConnectionCharges.value;
          if (value.CashAmount) qu.CashAmount = value.CashAmount;
          if (value.cust_id) qu.cust_id = value.cust_id;
          if (value.AddExtras) qu.AddExtras = value.AddExtras.value;
          if (value.previous_contract_length)
            qu.previous_contract_length = value.previous_contract_length.value;
          if (value.contract_length)
            qu.contract_length = value.contract_length.value;
          if (value.contract_start_date) {
            qu.contract_start_date = new Date(
              value.contract_start_date
            ).getTime();
          } else {
            qu.contract_start_date = new Date().getTime();
          }
          if (value.previous_contract_start_date) {
            qu.previous_contract_start_date = new Date(
              value.previous_contract_start_date
            ).getTime();
          } else {
            qu.previous_contract_start_date = new Date().getTime();
          }
          if (value.TelecomsLiveDate)
            qu.TelecomsLiveDate = new Date(value.TelecomsLiveDate).getTime();
          if (value.TelecomsRenewalDate)
            qu.TelecomsRenewalDate = new Date(
              value.TelecomsRenewalDate
            ).getTime();
          if (value.accountNumber) qu.accountNumber = value.accountNumber;
          if (value.WholeSaleProvider)
            qu.WholeSaleProvider = value.WholeSaleProvider.value;
          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { telecoms: qu }, service: 'telecoms' });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                telecoms: qu,
                Supplier: SupplerID
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          current_supplier: Yup.string().required("Supplier is required"),
          previous_contract_length: Yup.string().required(
            "Current Contract Length is required"
          ),
          contract_length: Yup.string().required(
            "Preferred Contract Length is required"
          ),
          contract_start_date: Yup.string().required(
            "Contract start date is required"
          ),
          previous_contract_start_date: Yup.string().required(
            "Previous contract start date is required"
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
            submitForm
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <FieldArray name="phoneNumbers">
                {({ push, remove }) => (
                  <div>
                    <Grid container spacing={3}>
                      {values.phoneNumbers && values.phoneNumbers.map((item, index) => (
                        <Grid item xs={12} md={3} key={index}>
                          <Field name={`phoneNumbers.${index}`}>
                            {({ field }) => (
                              <TextField
                                {...field}
                                label={`Phone Number ${index + 1}`}
                                variant="outlined"
                                fullWidth
                                type="number"
                              />
                            )}
                          </Field>
                          {index === values?.phoneNumbers?.length - 1 && (
                            <Button type="button" color="primary" variant="outlined" size="small" onClick={() => remove(index)}>Remove</Button>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                    <Button style={{
                      marginTop: '40px',
                      marginBottom: '20px'
                    }} type="button" color="primary" variant="outlined" size="small" onClick={() => push('')}>Add Phone Number</Button>
                  </div>
                )}
              </FieldArray>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.connectionType && touched.connectionType
                        ? "ErrorColor"
                        : ""
                    }
                    id="connectionType"
                    variant="outlined"
                    name="connectionType"
                    placeholder="Connection Type"
                    value={values.connectionType}
                    onChange={(e) => {
                      setFieldValue("connectionType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={TelecomConnectionOptions}
                  />
                  {errors.connectionType && touched.connectionType && (
                    <FormHelperText
                      className="errormsg"
                      id="connectionType-error"
                    >
                      {errors.connectionType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    type="text"
                    error={
                      errors.lineRentalPackageName && touched.lineRentalPackageName ? true : false
                    }
                    name="lineRentalPackageName"
                    label="Enter Package Name"
                    value={values.lineRentalPackageName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="lineRentalPackageName-error"
                    className="WidhtFull100"
                  />
                  {errors.lineRentalPackageName && touched.lineRentalPackageName && (
                    <FormHelperText className="errormsg" id="lineRentalPackageName-error">
                      {errors.lineRentalPackageName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.lineRental && touched.lineRental ? true : false
                    }
                    name="lineRental"
                    label="Enter Line Rental"
                    value={values.lineRental}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="lineRental-error"
                    className="WidhtFull100"
                  />
                  {errors.lineRental && touched.lineRental && (
                    <FormHelperText className="errormsg" id="lineRental-error">
                      {errors.lineRental}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.ConnectionCharges && touched.ConnectionCharges
                        ? "ErrorColor"
                        : ""
                    }
                    id="ConnectionCharges"
                    name="ConnectionCharges"
                    placeholder="Connection charges"
                    value={values.ConnectionCharges}
                    onChange={(e) => {
                      setFieldValue("ConnectionCharges", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ConnectionOptions}
                  />
                  {errors.ConnectionCharges && touched.ConnectionCharges && (
                    <FormHelperText
                      className="errormsg"
                      id="ConnectionCharges-error"
                    >
                      {errors.ConnectionCharges}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="text"
                    error={
                      errors.ExtraServiceName && touched.ExtraServiceName ? true : false
                    }
                    name="ExtraServiceName"
                    label="Enter Extra Service Name"
                    value={values.ExtraServiceName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ExtraServiceName-error"
                    className="WidhtFull100"
                  />
                  {errors.ExtraServiceName && touched.ExtraServiceName && (
                    <FormHelperText className="errormsg" id="ExtraServiceName-error">
                      {errors.ExtraServiceName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.ExtraServiceCharges && touched.ExtraServiceCharges ? true : false
                    }
                    name="ExtraServiceCharges"
                    label="Enter Extra Service Charge"
                    value={values.ExtraServiceCharges}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ExtraServiceCharges-error"
                    className="WidhtFull100"
                  />
                  {errors.ExtraServiceCharges && touched.ExtraServiceCharges && (
                    <FormHelperText className="errormsg" id="ExtraServiceCharges-error">
                      {errors.ExtraServiceCharges}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.CashAmount && touched.CashAmount ? true : false
                    }
                    name="CashAmount"
                    label="Enter Cash Amount"
                    value={values.CashAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="CashAmount-error"
                    className="WidhtFull100"
                  />
                  {errors.CashAmount && touched.CashAmount && (
                    <FormHelperText className="errormsg" id="CashAmount-error">
                      {errors.CashAmount}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              {/* BACS/CUST ID NO */}

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="text"
                    error={
                      errors.cust_id && touched.cust_id ? true : false
                    }
                    name="cust_id"
                    label="BACS/CUST ID NO"
                    value={values.cust_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="cust_id-error"
                    className="WidhtFull100"
                  />
                  {errors.cust_id && touched.cust_id && (
                    <FormHelperText className="errormsg" id="cust_id-error">
                      {errors.cust_id}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Select
                    className={
                      errors.previous_contract_length &&
                        touched.previous_contract_length
                        ? "ErrorColor"
                        : ""
                    }
                    id="previous_contract_length"
                    variant="outlined"
                    name="previous_contract_length"
                    placeholder="Current contract length"
                    value={values.previous_contract_length}
                    onChange={(e) => {
                      setFieldValue("previous_contract_length", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
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

                <Grid item xs={12} md={6}>
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
                        label="Current Contract End Date"
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
                        aria-describedby="previous_contract_start_date-number-error"
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
                    placeholder="Preferred contract length"
                    value={values.contract_length}
                    onChange={(e) => {
                      setFieldValue("contract_length", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
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
                          errors.contract_start_date &&
                            touched.contract_start_date
                            ? true
                            : false
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
                        aria-describedby="contract_start_date-number-error"
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
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.TelecomsLiveDate && touched.TelecomsLiveDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="TelecomsLiveDate"
                        name="TelecomsLiveDate"
                        label="Telecoms live date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.TelecomsLiveDate
                            ? values.TelecomsLiveDate
                            : null
                        }
                        onChange={(e) => setFieldValue("TelecomsLiveDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="TelecomsLiveDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.TelecomsLiveDate && touched.TelecomsLiveDate && (
                    <FormHelperText
                      className="errormsg"
                      id="TelecomsLiveDate-error"
                    >
                      {errors.TelecomsLiveDate}
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
                          errors.TelecomsRenewalDate &&
                            touched.TelecomsRenewalDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="TelecomsRenewalDate"
                        name="TelecomsRenewalDate"
                        label="Telecoms renewal date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.TelecomsRenewalDate
                            ? values.TelecomsRenewalDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("TelecomsRenewalDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="TelecomsRenewalDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.TelecomsRenewalDate && touched.TelecomsRenewalDate && (
                    <FormHelperText
                      className="errormsg"
                      id="TelecomsRenewalDate-error"
                    >
                      {errors.TelecomsRenewalDate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.accountNumber && touched.accountNumber
                        ? true
                        : false
                    }
                    label="Account Number"
                    name="accountNumber"
                    value={values.accountNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="accountNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.accountNumber && touched.accountNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="accountNumber-error"
                    >
                      {errors.accountNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.WholeSaleProvider && touched.WholeSaleProvider
                        ? "ErrorColor"
                        : ""
                    }
                    id="WholeSaleProvider"
                    variant="outlined"
                    name="WholeSaleProvider"
                    placeholder="Wholesale Provider"
                    value={values.WholeSaleProvider}
                    onChange={(e) => {
                      setFieldValue("WholeSaleProvider", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={WholeSaleProviderOptions}
                  />
                  {errors.WholeSaleProvider && touched.WholeSaleProvider && (
                    <FormHelperText
                      className="errormsg"
                      id="WholeSaleProvider-error"
                    >
                      {errors.WholeSaleProvider}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.status && touched.status ? "ErrorColor" : ""
                    }
                    id="status"
                    variant="outlined"
                    name="status"
                    placeholder="Status"
                    value={values.status}
                    onChange={(e) => {
                      setFieldValue("status", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={telecomStatusOptions}
                  />
                  {errors.status && touched.status && (
                    <FormHelperText className="errormsg" id="status-error">
                      {errors.status}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.current_supplier && touched.current_supplier
                        ? "ErrorColor"
                        : ""
                    }
                    id="current_supplier"
                    name="current_supplier"
                    label="Telecom provider"
                    placeholder="Current Supplier"
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
                // type="submit"
                // disabled={isSubmitting}
                >
                  Generate Quote
                </Button>
                {currentProps.isFromLead && <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', true);
                    props.submitForm();
                  }}
                // disabled={isSubmitting}
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
