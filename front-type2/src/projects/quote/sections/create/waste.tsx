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
  wasteTypeOptions,
  wasteContainerTypeOptions,
  wasteMonthlyDDOptions,
  wasteServiceFrequency,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { selectLeadState } from "projects/lead/redux/lead";
import { useSelector } from "react-redux";

export default function Waste(props) {
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);

  const [startLoader, setStartLoader] = useState(false);
  const currentProps = props;
  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Waste",
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
    leadServiceDataInit.wasteType = {
      label: leadServiceDataInit.wasteType,
      value: leadServiceDataInit.wasteType,
    };
    leadServiceDataInit.containerType = {
      label: leadServiceDataInit.containerType,
      value: leadServiceDataInit.containerType,
    };
    leadServiceDataInit.monthlyDD = {
      label: leadServiceDataInit.monthlyDD,
      value: leadServiceDataInit.monthlyDD,
    };
    leadServiceDataInit.serviceFrequency = {
      label: leadServiceDataInit.serviceFrequency,
      value: leadServiceDataInit.serviceFrequency,
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
    wasteType: "",
    EwcCode: "",
    containerType: "",
    monthlyDD: "",
    numberOfContainers: "",
    chargePerLift: "",
    dailyRental: "",
    serviceFrequency: "",
    deliveryCharge: "",
    WasteTransferNoteComplainceCharge: "",
    assumedWeight: "",
    totalMonthlyCost: "",
  };
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          const qu: any = {};
          let SupplerID = "";
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.wasteType) qu.wasteType = value.wasteType.value;
          if (value.EwcCode) qu.EwcCode = value.EwcCode;
          if (value.containerType) qu.containerType = value.containerType.value;
          if (value.monthlyDD) qu.monthlyDD = value.monthlyDD.value;
          if (value.numberOfContainers)
            qu.numberOfContainers = value.numberOfContainers;
          if (value.chargePerLift) qu.chargePerLift = value.chargePerLift;
          if (value.dailyRental) qu.dailyRental = value.dailyRental;
          if (value.serviceFrequency)
            qu.serviceFrequency = value.serviceFrequency.value;
          if (value.deliveryCharge) qu.deliveryCharge = value.deliveryCharge;
          if (value.WasteTransferNoteComplainceCharge)
            qu.WasteTransferNoteComplainceCharge =
              value.WasteTransferNoteComplainceCharge;
          if (value.assumedWeight) qu.assumedWeight = value.assumedWeight;
          if (value.totalMonthlyCost)
            qu.totalMonthlyCost = value.totalMonthlyCost;
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
              serviceData: { waste: qu },
              service: "waste",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                waste: qu,
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
          wasteType: Yup.string().required("Waste type is required "),
          EwcCode: Yup.number().required("EWC code is required"),
          containerType: Yup.string().required("Container type is required"),
          monthlyDD: Yup.string().required("Monthly DD is required"),
          numberOfContainers: Yup.number()
            .positive("Charge per lift must be positive")
            .required("Number of containers is required"),
          chargePerLift: Yup.number()
            .positive("Charge per lift must be positive")
            .required("Charge per lift is required"),
          dailyRental: Yup.number()
            .positive("Daily rental must be positive")
            .required("Daily rental is required"),
          serviceFrequency: Yup.string().required(
            "Service frequency is required"
          ),
          deliveryCharge: Yup.number()
            .positive("Delivery charge must be positive")
            .required("Delivery charge is required"),
          WasteTransferNoteComplainceCharge: Yup.number()
            .positive("Waste Transfer Note Complaince Charge must be positive")
            .required("Waste Transfer Note Complaince Charge is required"),
          assumedWeight: Yup.number()
            .positive("Assumed weight must be positive")
            .required("Assumed weight is required"),
          totalMonthlyCost: Yup.number()
            .positive("Total monthly cost must be positive")
            .required("Total monthly cost is required"),
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
          // preferred_contract_length: Yup.string().required('Preferred contract length is required'),
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
                    label="Waste provider"
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
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.wasteType && touched.wasteType ? "ErrorColor" : ""
                    }
                    id="wasteType"
                    name="wasteType"
                    label="Waste type"
                    placeholder="Waste type"
                    value={values.wasteType}
                    onChange={(e) => {
                      setFieldValue("wasteType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="wasteType-error"
                    options={wasteTypeOptions}
                  />
                  {errors.wasteType && touched.wasteType && (
                    <FormHelperText className="errormsg" id="wasteType-error">
                      {errors.wasteType}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.EwcCode && touched.EwcCode)}
                    name="EwcCode"
                    label="EWC code"
                    type="number"
                    value={values.EwcCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="EwcCode-error"
                    className="WidhtFull100"
                  />
                  {errors.EwcCode && touched.EwcCode && (
                    <FormHelperText className="errormsg" id="EwcCode-error">
                      {errors.EwcCode}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    variant="outlined"
                    error={
                      errors.containerType && touched.containerType
                        ? true
                        : false
                    }
                    name="containerType"
                    label="Container Type"
                    placeholder="Container Type"
                    value={values.containerType}
                    onChange={(e) => {
                      setFieldValue("containerType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="containerType-error"
                    className={
                      errors.containerType && touched.containerType
                        ? "ErrorColor"
                        : ""
                    }
                    options={wasteContainerTypeOptions}
                  />
                  {errors.containerType && touched.containerType && (
                    <FormHelperText
                      className="errormsg"
                      id="containerType-error"
                    >
                      {errors.containerType}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    variant="outlined"
                    error={errors.monthlyDD && touched.monthlyDD ? true : false}
                    name="monthlyDD"
                    placeholder="Monthly DD"
                    value={values.monthlyDD}
                    onChange={(e) => {
                      setFieldValue("monthlyDD", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="monthlyDD-error"
                    className={
                      errors.monthlyDD && touched.monthlyDD ? "ErrorColor" : ""
                    }
                    options={wasteMonthlyDDOptions}
                  />
                  {errors.monthlyDD && touched.monthlyDD && (
                    <FormHelperText className="errormsg" id="monthlyDD-error">
                      {errors.monthlyDD}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(
                        errors.numberOfContainers && touched.numberOfContainers
                      )
                    }
                    name="numberOfContainers"
                    label="Number of containers"
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    value={values.numberOfContainers}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="numberOfContainers-error"
                    className="WidhtFull100"
                  />
                  {errors.numberOfContainers && touched.numberOfContainers && (
                    <FormHelperText
                      className="errormsg"
                      id="numberOfContainers-error"
                    >
                      {errors.numberOfContainers}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.chargePerLift && touched.chargePerLift)}
                    name="chargePerLift"
                    label="Charge per lift"
                    type="number"
                    value={values.chargePerLift}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="chargePerLift-error"
                    className="WidhtFull100"
                  />
                  {errors.chargePerLift && touched.chargePerLift && (
                    <FormHelperText
                      className="errormsg"
                      id="chargePerLift-error"
                    >
                      {errors.chargePerLift}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.dailyRental && touched.dailyRental)}
                    name="dailyRental"
                    label="Daily rental"
                    type="number"
                    value={values.dailyRental}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dailyRental-error"
                    className="WidhtFull100"
                  />
                  {errors.dailyRental && touched.dailyRental && (
                    <FormHelperText className="errormsg" id="dailyRental-error">
                      {errors.dailyRental}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.serviceFrequency && touched.serviceFrequency
                        ? "ErrorColor"
                        : ""
                    }
                    id="serviceFrequency"
                    name="serviceFrequency"
                    placeholder="Service frequency"
                    value={values.serviceFrequency}
                    onChange={(e) => {
                      setFieldValue("serviceFrequency", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="serviceFrequency-error"
                    options={wasteServiceFrequency}
                  />
                  {errors.serviceFrequency && touched.serviceFrequency && (
                    <FormHelperText
                      className="errormsg"
                      id="serviceFrequency-error"
                    >
                      {errors.serviceFrequency}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.deliveryCharge && touched.deliveryCharge)}
                    name="deliveryCharge"
                    label="Delivery Charge"
                    type="number"
                    value={values.deliveryCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="deliveryCharge-error"
                    className="WidhtFull100"
                  />
                  {errors.deliveryCharge && touched.deliveryCharge && (
                    <FormHelperText
                      className="errormsg"
                      id="deliveryCharge-error"
                    >
                      {errors.deliveryCharge}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(
                        errors.WasteTransferNoteComplainceCharge &&
                        touched.WasteTransferNoteComplainceCharge
                      )
                    }
                    name="WasteTransferNoteComplainceCharge"
                    label="WTN Complaince Charge"
                    type="number"
                    value={values.WasteTransferNoteComplainceCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="WasteTransferNoteComplainceCharge-error"
                    className="WidhtFull100"
                  />
                  {errors.WasteTransferNoteComplainceCharge &&
                    touched.WasteTransferNoteComplainceCharge && (
                      <FormHelperText
                        className="errormsg"
                        id="WasteTransferNoteComplainceCharge-error"
                      >
                        {errors.WasteTransferNoteComplainceCharge}
                      </FormHelperText>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.assumedWeight && touched.assumedWeight)}
                    name="assumedWeight"
                    label="Assumed weight"
                    type="number"
                    value={values.assumedWeight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="assumedWeight-error"
                    className="WidhtFull100"
                  />
                  {errors.assumedWeight && touched.assumedWeight && (
                    <FormHelperText
                      className="errormsg"
                      id="assumedWeight-error"
                    >
                      {errors.assumedWeight}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      !!(errors.totalMonthlyCost && touched.totalMonthlyCost)
                    }
                    name="totalMonthlyCost"
                    label="Total monthly cost"
                    type="number"
                    value={values.totalMonthlyCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="totalMonthlyCost-error"
                    className="WidhtFull100"
                  />
                  {errors.totalMonthlyCost && touched.totalMonthlyCost && (
                    <FormHelperText
                      className="errormsg"
                      id="totalMonthlyCost-error"
                    >
                      {errors.totalMonthlyCost}
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
