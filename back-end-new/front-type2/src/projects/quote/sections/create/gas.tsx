import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { func } from "prop-types";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "react-select";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ContractLengthOption,
  MeterTypeOption,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { PasswordMasking } from "../../../../sharedUtils/sharedComponents/passwordMasking";
import { selectLeadState } from "projects/lead/redux/lead";
import { LoadingIndicator } from "sharedUtils/sharedComponents/LoadingIndicator";

export default function Gas(props) {
  let leadServiceDataInit: any = null;

  const currentProps = props;
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [startLoader, setStartLoader] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [RadioToggle, setRadioToggle] = React.useState("");
  const leadState = useSelector(selectLeadState);

  // const { data, localData, supplier } = props.isPriceData

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  const contactEndDate = (props) => {
    var d = new Date(props?.isPriceData?.localData?.contractStartDate);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + Number(props?.isPriceData?.data?.duration), month, day - 1);
    return c;
  }


  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Gas",
      "add"
    );
  }

  if (props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.current_supplier = supplierList.filter((sup) => {
      if (sup.value == leadServiceDataInit.SupplerID)
        return sup
    })[0];
    leadServiceDataInit.previous_contract_length = leadServiceDataInit.previous_contract_length ? { label: leadServiceDataInit.previous_contract_length, value: leadServiceDataInit.previous_contract_length } : null;
    leadServiceDataInit.contract_length = { label: leadServiceDataInit.contract_length, value: leadServiceDataInit.contract_length }
    leadServiceDataInit.meterType = { label: leadServiceDataInit.meterType, value: leadServiceDataInit.meterType };
    leadServiceDataInit.meterNumber = leadServiceDataInit.meterNumber === null ? props.isSiteData?.MPRN : leadServiceDataInit.meterNumber
    leadServiceDataInit.meterSerialNumber = leadServiceDataInit.meterSerialNumber === null ? props.isSiteData?.meterSerialNumber : leadServiceDataInit.meterSerialNumber
  }

  let ii: any = null

  if (props?.isPriceData?.serviceType === "gas" && props?.isPriceData !== undefined && props.isPriceData !== null && props.showingFrom === 'priceModule') {
    ii = { ...props.serviceDataFromLead };
    ii.meterNumber = props?.isPriceData?.localData?.mprn;
    ii.meterSerialNumber = ii.meterSerialNumber || "";
    ii.meterType = { label: ii.meterType, value: ii.meterType };
    ii.postcode = props?.isPriceData?.localData?.postcode;
    ii.current_supplier = props?.isPriceData?.supplier[0];
    ii.previous_contract_length = ii.previous_contract_length ? { label: ii.previous_contract_length, value: ii.previous_contract_length } : null;
    ii.contract_length =
      props?.isPriceData?.data?.duration === "1" ?
        {
          label: props?.isPriceData?.data?.duration.concat(' year'),
          value: props?.isPriceData?.data?.duration.concat(' year')
        } :
        {
          label: props?.isPriceData?.data?.duration.concat(' year'),
          value: props?.isPriceData?.data?.duration.concat(' years')
        };
    ii.contract_start_date = props?.isPriceData?.localData.contractStartDate;
    ii.contract_end_date = props?.isPriceData?.localData?.contractStartDate ? contactEndDate(props) : "";
    ii.dailyCharges = props?.isPriceData?.data?.standingCharge;
    ii.unitRate = props?.isPriceData?.data?.unitRate;
    ii.kWH = props?.isPriceData?.localData?.aq;
    ii.uplift = props?.isPriceData?.data?.uplift;
  }
  else {
    ii = {
      saveLeadData: false,
      meterNumber: props.isSiteData?.MPRN,
      meterNumberTwo: '',
      meterSerialNumber: props.isSiteData?.meterSerialNumber,
      meterType: "",
      COT: "",
      postcode: "",
      current_supplier: '',
      previous_contract_length: "",
      contract_length: null,
      contract_start_date: "",
      contract_end_date: "",
      previous_contract_start_date: "",
      dailyCharges: "",
      unitRate: "",
      kWH: "",
      accountNumber: "",
      uplift: "",
    };
  }

  return (
    <div className="app">
      <Formik
        initialValues={
          (props?.isPriceData?.serviceType === "gas" && props?.isPriceData !== undefined && props?.isPriceData !== null && props.showingFrom === 'priceModule')
            ?
            ii
            : (leadServiceDataInit !== null ? leadServiceDataInit : ii)
        }
        onSubmit={(value) => {
          const qu: any = {};
          let SupplerID = "";
          if (value.meterNumber) qu.meterNumber = value.meterNumber;
          if (value.meterNumberTwo) qu.meterNumberTwo = value.meterNumberTwo;


          if (value.accountNumber) qu.accountNumber = value.accountNumber;
          if (value.onlineAccountUserName)
            qu.onlineAccountUserName = value.onlineAccountUserName;
          if (value.onlineAccountPassword)
            qu.onlineAccountPassword = value.onlineAccountPassword;
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.meterSerialNumber)
            qu.meterSerialNumber = value.meterSerialNumber;
          if (value.COT) qu.COT = value.COT;
          if (value.previous_contract_length)
            qu.previous_contract_length = value.previous_contract_length.value;
          if (value.contract_length)
            qu.contract_length = value.contract_length.value;
          if (value.meterType) qu.meterType = value.meterType.value;
          if (value.dailyCharges) qu.dailyCharges = value.dailyCharges;
          if (value.unitRate) qu.unitRate = value.unitRate;
          if (value.kWH) qu.kWH = value.kWH;

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
          if (value.previous_contract_start_date) {
            qu.previous_contract_start_date = new Date(
              value.previous_contract_start_date
            ).getTime();
          } else {
            qu.previous_contract_start_date = new Date().getTime();
          }

          qu.bill_date_type = RadioToggle;
          qu.postcode = props.SitePostcode;
          if (value.no_of_days) qu.no_of_days = value.no_of_days;
          if (value.bill_start_date)
            qu.bill_start_date = new Date(value.bill_start_date).getTime();
          if (value.bill_end_date)
            qu.bill_end_date = new Date(value.bill_end_date).getTime();
          if (value.uplift) qu.uplift = value.uplift
          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { gas: qu }, service: 'gas' });
          } else {
            console.log("not there");
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                gas: qu,
                Supplier: SupplerID
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          meterNumber: Yup.string().required("MPRN is required"),
          meterSerialNumber: Yup.string().required(
            "Meter Serial Number is required"
          ),
          meterType: Yup.string().required("Meter Type is required"),
          current_supplier: Yup.string().required('Supplier is required'),
          previous_contract_length: Yup.string().required(
            "Current Contract Length is required"
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    autoFocus
                    variant="outlined"
                    error={
                      errors.meterNumber ? true : false
                    }
                    label="MPRN"
                    name="meterNumber"
                    value={values.meterNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="meterNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.meterNumber && (
                    <FormHelperText className="errormsg" id="meterNumber-error">
                      {errors.meterNumber}
                    </FormHelperText>
                  )}
                </Grid>


                <Grid item xs={12} md={4}>
                  <TextField

                    variant="outlined"
                    error={
                      errors.meterNumberTwo ? true : false
                    }
                    label="Second MPRN"
                    name="meterNumberTwo"
                    value={values.meterNumberTwo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="meterNumberTwo-error"
                    className="WidhtFull100"
                  />
                  {errors.meterNumberTwo && (
                    <FormHelperText className="errormsg" id="meterNumberTwo-error">
                      {errors.meterNumberTwo}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.meterSerialNumber
                        ? true
                        : false
                    }
                    name="meterSerialNumber"
                    label="Meter Serial Number"
                    value={values.meterSerialNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="meterSerialNumber-error"
                  />
                  {errors.meterSerialNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="meterSerialNumber-error"
                    >
                      {errors.meterSerialNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.meterType ? "ErrorColor" : ""
                    }
                    id="meterType"
                    name="meterType"
                    placeholder="Select meterType"
                    value={values.meterType}
                    onChange={(e) => {
                      setFieldValue("meterType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={MeterTypeOption}
                  />
                  {errors.meterType && (
                    <FormHelperText className="errormsg" id="meterType-error">
                      {errors.meterType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.COT ? true : false}
                    name="COT"
                    label="COT"
                    value={values.COT}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="COT-error"
                    className="WidhtFull100"
                  />
                  {errors.COT && (
                    <FormHelperText className="errormsg" id="COT-error">
                      {errors.COT}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    disabled
                    variant="outlined"
                    error={errors.postcode ? true : false}
                    name="postcode"
                    label="Postcode"
                    value={postcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="postcode-error"
                  />
                  {errors.postcode && (
                    <FormHelperText className="errormsg" id="postcode-error">
                      {errors.postcode}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.current_supplier
                        ? "ErrorColor"
                        : ""
                    }
                    id="current_supplier"
                    name="current_supplier"
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
                  {errors.current_supplier && (
                    <FormHelperText
                      className="errormsg"
                      id="current_supplier-error"
                    >
                      {errors.current_supplier}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    className={
                      errors.previous_contract_length
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
                    aria-describedby="role-number-error"
                    options={ContractLengthOption}
                  />
                  {errors.previous_contract_length && (
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
                          errors.previous_contract_start_date

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
                  {errors.previous_contract_start_date
                    && (
                      <FormHelperText
                        className="errormsg"
                        id="previous_contract_start_date-error"
                      >
                        {errors.previous_contract_start_date}
                      </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.contract_length
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
                  {errors.contract_length && (
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
                          errors.contract_start_date

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
                  {errors.contract_start_date && (
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
                            errors.contract_end_date
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
                  {errors.contract_end_date && (
                    <FormHelperText
                      className="errormsg"
                      id="contract_end_date-error"
                    >
                      {errors.contract_end_date}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.dailyCharges ? true : false
                    }
                    name="dailyCharges"
                    label="Standing Charge"
                    value={values.dailyCharges}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dailyCharges-error"
                    className="WidhtFull100"
                  />
                  {errors.dailyCharges && (
                    <FormHelperText
                      className="errormsg"
                      id="dailyCharges-error"
                    >
                      {errors.dailyCharges}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.unitRate ? true : false}
                    name="unitRate"
                    label="Unit Rate"
                    value={values.unitRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="number"
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="unitRate-error"
                  />
                  {errors.unitRate && (
                    <FormHelperText className="errormsg" id="unitRate-error">
                      {errors.unitRate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.kWH ? true : false}
                    name="kWH"
                    // label="Unit KWH"
                    label="AQ"
                    value={values.kWH}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="kWH-error"
                  />
                  {errors.kWH && (
                    <FormHelperText className="errormsg" id="kWH-error">
                      {errors.kWH}
                    </FormHelperText>
                  )}
                </Grid>
                {currentProps.showingFrom === 'priceModule' &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={errors.uplift ? true : false}
                      name="uplift"
                      label="Uplift"
                      InputProps={{ inputProps: { min: 0.1, max: 1.5, step: 0.1 } }}
                      value={values.uplift}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="WidhtFull100"
                      margin="normal"
                      aria-describedby="uplift-error"
                    />
                    {errors.uplift && (
                      <FormHelperText className="errormsg" id="uplift-error">
                        {errors.uplift}
                      </FormHelperText>
                    )}
                  </Grid>
                }

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.accountNumber
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.onlineAccountUserName
                        ? true
                        : false
                    }
                    label="Online Account Username"
                    name="onlineAccountUserName"
                    value={values.onlineAccountUserName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.onlineAccountPassword
                        ? true
                        : false
                    }
                    label="Online Account Password"
                    name="onlineAccountPassword"
                    inputProps={{
                      form: {
                        autocomplete: "off",
                      },
                    }}
                    type={currentProps.visible}
                    value={values.onlineAccountPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    InputProps={{ endAdornment: <PasswordMasking /> }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Bill date type</FormLabel>
                    <RadioGroup
                      row
                      aria-label="billdate"
                      name="billdatetype"
                      value={RadioToggle}
                      onChange={handleRadio}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Date Range"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Number Days"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {RadioToggle === "1" && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="space-around">
                        <KeyboardDatePicker
                          variant="dialog"
                          inputVariant="outlined"
                          error={
                            errors.bill_start_date
                              ? true
                              : false
                          }
                          margin="normal"
                          name="bill_start_date"
                          id="bill_start_date"
                          label="Preferred Contract Start Date"
                          allowKeyboardControl
                          className="WidhtFull100"
                          format="dd/MM/yyyy"
                          value={values.bill_start_date}
                          onChange={(e) => setFieldValue("bill_start_date", e)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="bill_start_date-number-error"
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    {errors.bill_start_date && (
                      <FormHelperText
                        className="errormsg"
                        id="bill_start_date-error"
                      >
                        {errors.bill_start_date}
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
                            errors.bill_end_date
                              ? true
                              : false
                          }
                          margin="normal"
                          name="bill_end_date"
                          id="bill_end_date"
                          label="Preferred Contract End Date"
                          allowKeyboardControl
                          className="WidhtFull100"
                          format="dd/MM/yyyy"
                          value={values.bill_end_date}
                          onChange={(e) => setFieldValue("bill_end_date", e)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="bill_end_date-number-error"
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    {errors.bill_end_date && (
                      <FormHelperText
                        className="errormsg"
                        id="bill_end_date-error"
                      >
                        {errors.bill_end_date}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              )}

              {RadioToggle === "2" && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.no_of_days ? true : false
                      }
                      label="Number of days"
                      name="no_of_days"
                      value={values.no_of_days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="no_of_days-error"
                      className="WidhtFull100"
                    />
                    {errors.no_of_days && (
                      <FormHelperText
                        className="errormsg"
                        id="no_of_days-error"
                      >
                        {errors.no_of_days}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              )}

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