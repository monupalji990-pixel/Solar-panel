import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
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
import { ContractLengthOption } from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { PasswordMasking } from "../../../../sharedUtils/sharedComponents/passwordMasking";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Electric(props) {
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);

  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [RadioToggle, setRadioToggle] = React.useState("0");

  // const { data, localData, supplier } = props.isPriceData

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Electric",
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
    if (props.isSiteData?.topLine || leadServiceDataInit.topLine && leadServiceDataInit.topLine.length > 0) {
      leadServiceDataInit.MeterNo1 = leadServiceDataInit.topLine === null ? props.isSiteData?.topLine.slice(0, 2) : leadServiceDataInit.topLine.substring(0, 2);
      leadServiceDataInit.MeterNo2 = leadServiceDataInit.topLine === null ? props.isSiteData?.topLine.slice(2, 5) : leadServiceDataInit.topLine.substring(2, 5);
      leadServiceDataInit.MeterNo3 = leadServiceDataInit.topLine === null ? props.isSiteData?.topLine.slice(5, 8) : leadServiceDataInit.topLine.substring(5, 9);

    }

    if (leadServiceDataInit.topLineTwo && leadServiceDataInit.topLineTwo.length > 0) {
      leadServiceDataInit.MeterNo2_1 = leadServiceDataInit.topLineTwo.substring(0, 2);
      leadServiceDataInit.MeterNo2_2 = leadServiceDataInit.topLineTwo.substring(2, 5);
      leadServiceDataInit.MeterNo2_3 = leadServiceDataInit.topLineTwo.substring(5, 9);

    }
    // if(leadServiceDataInit.meterNumber && leadServiceDataInit.meterNumber.length == 13 ){

    leadServiceDataInit.meterSerialNumber = leadServiceDataInit.meterSerialNumber === null ? props.isSiteData?.meterSerialNumber : leadServiceDataInit.meterSerialNumber
    leadServiceDataInit.MeterNo4 = leadServiceDataInit.meterNumber === null ? props.isSiteData?.meterNumber.slice(0, 2) : leadServiceDataInit.meterNumber?.substring(0, 2);
    leadServiceDataInit.MeterNo5 = leadServiceDataInit.meterNumber === null ? props.isSiteData?.meterNumber.slice(2, 6) : leadServiceDataInit.meterNumber?.substring(
      2,
      6
    );
    leadServiceDataInit.MeterNo6 = leadServiceDataInit.meterNumber === null ? props.isSiteData?.meterNumber.slice(6, 10) : leadServiceDataInit.meterNumber?.substring(
      6,
      10
    );
    leadServiceDataInit.MeterNo7 = leadServiceDataInit.meterNumber === null ? props.isSiteData?.meterNumber.slice(10, 13) : leadServiceDataInit.meterNumber?.substring(
      10,
      13
    );
    // }

    if (leadServiceDataInit.meterNumberTwo && leadServiceDataInit.meterNumberTwo.length > 0) {

      leadServiceDataInit.MeterNo2_4 = leadServiceDataInit.meterNumberTwo?.substring(
        0,
        2
      );
      leadServiceDataInit.MeterNo2_5 = leadServiceDataInit.meterNumberTwo?.substring(
        2,
        6
      );
      leadServiceDataInit.MeterNo2_6 = leadServiceDataInit.meterNumberTwo?.substring(
        6,
        10
      );
      leadServiceDataInit.MeterNo2_7 = leadServiceDataInit.meterNumberTwo?.substring(
        10,
        13
      );
    }
  }

  const contactEndDate = (props) => {
    var d = new Date(props?.isPriceData?.localData?.contractStartDate);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + Number(props?.isPriceData?.data?.duration), month, day - 1);
    return c;
  }

  let initialValues: any = null

  if (props?.isPriceData?.serviceType === "electric" && props?.isPriceData !== undefined && props?.isPriceData !== null && props.showingFrom === 'priceModule') {
    initialValues = { ...props.serviceDataFromLead };

    initialValues.MeterNo2_1 = initialValues?.topLineTwo?.substring(0, 2);
    initialValues.MeterNo2_2 = initialValues?.topLineTwo?.substring(2, 5);
    initialValues.MeterNo2_3 = initialValues?.topLineTwo?.substring(5, 9);
    initialValues.MeterNo2_4 = initialValues?.meterNumberTwo?.substring(0, 2);
    initialValues.MeterNo2_5 = initialValues?.meterNumberTwo?.substring(2, 6);
    initialValues.MeterNo2_6 = initialValues?.meterNumberTwo?.substring(6, 10);
    initialValues.MeterNo2_7 = initialValues?.meterNumberTwo?.substring(10, 13);

    initialValues.MeterNo1 = props?.isPriceData?.localData?.MeterNo1;
    initialValues.MeterNo2 = props?.isPriceData?.localData?.MeterNo2;
    initialValues.MeterNo3 = props?.isPriceData?.localData?.MeterNo3;
    initialValues.MeterNo4 = props?.isPriceData?.localData?.MeterNo4;
    initialValues.MeterNo5 = props?.isPriceData?.localData?.MeterNo5;
    initialValues.MeterNo6 = props?.isPriceData?.localData?.MeterNo6;
    initialValues.MeterNo7 = props?.isPriceData?.localData?.MeterNo7;
    initialValues.dailyCharges = props?.isPriceData?.data?.standingCharge;
    initialValues.current_supplier = props?.isPriceData?.supplier[0],
      initialValues.previous_contract_length = initialValues.previous_contract_length = {
        label: initialValues.previous_contract_length,
        value: initialValues.previous_contract_length,
      };
    initialValues.contract_length =
      props?.isPriceData?.data?.duration === "1" ?
        {
          label: props?.isPriceData?.data?.duration.concat(' year'),
          value: props?.isPriceData?.data?.duration.concat(' year')
        } :
        {
          label: props?.isPriceData?.data?.duration.concat(' year'),
          value: props?.isPriceData?.data?.duration.concat(' years')
        };
    initialValues.contract_start_date = props?.isPriceData?.localData?.contractStartDate;
    initialValues.contract_end_date = props?.isPriceData?.localData?.contractStartDate ? contactEndDate(props) : "";

    initialValues.unitDayRate = props?.isPriceData?.localData?.unitrate;
    initialValues.unitDaykWh = props?.isPriceData?.localData?.aq;
    initialValues.unitNightRate = props?.isPriceData?.localData?.night ? props?.isPriceData?.localData?.night : props.serviceDataFromLead?.unitNightRate;
    initialValues.unitNightkWH = props?.isPriceData?.localData?.nightkwh ? props?.isPriceData?.localData?.nightkwh : props.serviceDataFromLead?.unitNightkWH;
    initialValues.unitWkdRate = props?.isPriceData?.localData?.ew ? props?.isPriceData?.localData?.ew : props.serviceDataFromLead?.unitWkdRate;
    initialValues.unitWkdkWh = props?.isPriceData?.localData?.ewkwh ? props?.isPriceData?.localData?.ewkwh : props.serviceDataFromLead?.unitWkdkWh;
    initialValues.uplift = props?.isPriceData?.data?.uplift;


  } else {
    initialValues = {
      saveLeadData: false,
      current_supplier: "",
      previous_contract_length: "",
      contract_length: "",
      contract_start_date: "",
      contract_end_date: "",
      previous_contract_start_date: "",
      MeterNo1: props.isSiteData?.topLine ? props.isSiteData?.topLine.slice(0, 2) : "",
      MeterNo2: props.isSiteData?.topLine ? props.isSiteData?.topLine.slice(2, 5) : "",
      MeterNo3: props.isSiteData?.topLine ? props.isSiteData?.topLine.slice(5, 8) : "",

      MeterNo4: props.isSiteData?.meterNumber ? props.isSiteData?.meterNumber.slice(0, 2) : "",
      MeterNo5: props.isSiteData?.meterNumber ? props.isSiteData?.meterNumber.slice(2, 6) : "",
      MeterNo6: props.isSiteData?.meterNumber ? props.isSiteData?.meterNumber.slice(6, 10) : "",
      MeterNo7: props.isSiteData?.meterNumber ? props.isSiteData?.meterNumber.slice(10, 13) : "",
      meterSerialNumber: props.isSiteData?.meterSerialNumber,
      // topLineTwo:"",
      uplift: ""
      // meterNumberTwo:"",
    };
  }

  return (
    <div className="app">
      <Formik
        initialValues={
          (props?.isPriceData?.serviceType === "electric" && props?.isPriceData !== undefined && props?.isPriceData !== null && props.showingFrom === 'priceModule')
            ?
            initialValues
            : (leadServiceDataInit !== null ? leadServiceDataInit : initialValues)
        }
        onSubmit={(value) => {
          const qu: any = {};
          let SupplerID = "";
          qu.topLine = `${value.MeterNo1}${value.MeterNo2}${value.MeterNo3}`;
          qu.meterNumber = `${value.MeterNo4}${value.MeterNo5}${value.MeterNo6}${value.MeterNo7}`;

          if (value.MeterNo2_1 && value.MeterNo2_2 && value.MeterNo2_3)
            qu.topLineTwo = `${value.MeterNo2_1}${value.MeterNo2_2}${value.MeterNo2_3}`;
          if (value.MeterNo2_4 && value.MeterNo2_5 && value.MeterNo2_6 && value.MeterNo2_7)
            qu.meterNumberTwo = `${value.MeterNo2_4}${value.MeterNo2_5}${value.MeterNo2_6}${value.MeterNo2_7}`;
          if (value.accountNumber) qu.accountNumber = value.accountNumber;
          if (value.onlineAccountUserName)
            qu.onlineAccountUserName = value.onlineAccountUserName;
          if (value.onlineAccountPassword)
            qu.onlineAccountPassword = value.onlineAccountPassword;
          if (value.meterSerialNumber)
            qu.meterSerialNumber = value.meterSerialNumber;
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.COT) qu.COT = value.COT;
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
          if (value.dailyCharges) qu.dailyCharges = value.dailyCharges;
          if (value.unitDayRate) qu.unitDayRate = value.unitDayRate;
          if (value.unitDaykWh) qu.unitDaykWh = value.unitDaykWh;
          if (value.unitNightRate) qu.unitNightRate = value.unitNightRate;
          if (value.unitNightkWH) qu.unitNightkWH = value.unitNightkWH;
          if (value.unitWkdRate) qu.unitWkdRate = value.unitWkdRate;
          if (value.unitWkdkWh) qu.unitWkdkWh = value.unitWkdkWh;
          if (value.unitWinterRate) qu.unitWinterRate = value.unitWinterRate;
          if (value.unitWinterkWH) qu.unitWinterkWH = value.unitWinterkWH;
          qu.bill_date_type = RadioToggle;
          if (value.no_of_days) qu.no_of_days = value.no_of_days;
          if (value.bill_start_date)
            qu.bill_start_date = new Date(value.bill_start_date).getTime();
          if (value.bill_end_date)
            qu.bill_end_date = new Date(value.bill_end_date).getTime();
          if (value.uplift) qu.uplift = value.uplift

          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;

            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { electric: qu },
              service: "electric",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                electric: qu,
                Supplier: SupplerID,
              });
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }
        }
        validationSchema={Yup.object().shape({
          MeterNo1: Yup.string()
            .required("Required")
            .min(2, "Required 2 digits")
            .max(2, "Required 2 digits"),
          MeterNo2: Yup.string()
            .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
          MeterNo3: Yup.string()
            .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
          MeterNo4: Yup.string()
            .required("Required")
            .min(2, "Required 2 digits")
            .max(2, "Required 2 digits"),
          MeterNo5: Yup.string()
            .required("Required")
            .min(4, "Required 4 digits")
            .max(4, "Required 4 digits"),
          MeterNo6: Yup.string()
            .required("Required")
            .min(4, "Required 4 digits")
            .max(4, "Required 4 digits"),
          MeterNo7: Yup.string()
            .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
          MeterNo2_1: Yup.string()
            // .required("Required")
            .min(2, "Required 2 digits")
            .max(2, "Required 2 digits"),
          MeterNo2_2: Yup.string()
            // .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
          MeterNo2_3: Yup.string()
            // .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
          MeterNo2_4: Yup.string()
            // .required("Required")
            .min(2, "Required 2 digits")
            .max(2, "Required 2 digits"),
          MeterNo2_5: Yup.string()
            // .required("Required")
            .min(4, "Required 4 digits")
            .max(4, "Required 4 digits"),
          MeterNo2_6: Yup.string()
            // .required("Required")
            .min(4, "Required 4 digits")
            .max(4, "Required 4 digits"),
          MeterNo2_7: Yup.string()
            // .required("Required")
            .min(3, "Required 3 digits")
            .max(3, "Required 3 digits"),
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
            submitForm,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <strong>MPAN</strong>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo1"
                    error={errors.MeterNo1 && touched.MeterNo1 ? true : false}
                    value={values.MeterNo1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="MeterNo1-error"
                    className="WidhtFull100"
                  />
                  {errors.MeterNo1 && touched.MeterNo1 && (
                    <FormHelperText className="errormsg" id="MeterNo1-error">
                      {errors.MeterNo1}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2"
                    error={errors.MeterNo2 && touched.MeterNo2 ? true : false}
                    value={values.MeterNo2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="MeterNo2-error"
                  />
                  {errors.MeterNo2 && touched.MeterNo2 && (
                    <FormHelperText className="errormsg" id="MeterNo2-error">
                      {errors.MeterNo2}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo3"
                    error={errors.MeterNo3 && touched.MeterNo3 ? true : false}
                    value={values.MeterNo3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="MeterNo3-error"
                  />
                  {errors.MeterNo3 && touched.MeterNo3 && (
                    <FormHelperText className="errormsg" id="MeterNo3-error">
                      {errors.MeterNo3}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo4"
                    error={errors.MeterNo4 && touched.MeterNo4 ? true : false}
                    value={values.MeterNo4}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="MeterNo4-error"
                    className="WidhtFull100"
                  />
                  {errors.MeterNo4 && touched.MeterNo4 && (
                    <FormHelperText className="errormsg" id="MeterNo4-error">
                      {errors.MeterNo4}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo5"
                    error={errors.MeterNo5 && touched.MeterNo5 ? true : false}
                    value={values.MeterNo5}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="MeterNo5-error"
                  />
                  {errors.MeterNo5 && touched.MeterNo5 && (
                    <FormHelperText className="errormsg" id="MeterNo5-error">
                      {errors.MeterNo5}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo6"
                    error={errors.MeterNo6 && touched.MeterNo6 ? true : false}
                    value={values.MeterNo6}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="MeterNo6-error"
                  />
                  {errors.MeterNo6 && touched.MeterNo6 && (
                    <FormHelperText className="errormsg" id="MeterNo6-error">
                      {errors.MeterNo6}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo7"
                    error={errors.MeterNo7 && touched.MeterNo7 ? true : false}
                    value={values.MeterNo7}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby="MeterNo7-error"
                  />
                  {errors.MeterNo7 && touched.MeterNo7 && (
                    <FormHelperText className="errormsg" id="MeterNo7-error">
                      {errors.MeterNo7}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <strong>Second MPAN</strong>
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_1"
                    error={errors.MeterNo2_1 && touched.MeterNo2_1 ? true : false}
                    value={values.MeterNo2_1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby=" MeterNo2_1-error"
                    className="WidhtFull100"
                  />
                  {errors.MeterNo2_1 && touched.MeterNo2_1 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_1-error">
                      {errors.MeterNo2_1}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_2"
                    error={errors.MeterNo2_2 && touched.MeterNo2_2 ? true : false}
                    value={values.MeterNo2_2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby=" MeterNo2_2-error"
                  />
                  {errors.MeterNo2_2 && touched.MeterNo2_2 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_2-error">
                      {errors.MeterNo2_2}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_3"
                    error={errors.MeterNo2_3 && touched.MeterNo2_3 ? true : false}
                    value={values.MeterNo2_3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby=" MeterNo2_3-error"
                  />
                  {errors.MeterNo2_3 && touched.MeterNo2_3 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_3-error">
                      {errors.MeterNo2_3}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_4"
                    error={errors.MeterNo2_4 && touched.MeterNo2_4 ? true : false}
                    value={values.MeterNo2_4}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby=" MeterNo2_4-error"
                    className="WidhtFull100"
                  />
                  {errors.MeterNo2_4 && touched.MeterNo2_4 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_4-error">
                      {errors.MeterNo2_4}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_5"
                    error={errors.MeterNo2_5 && touched.MeterNo2_5 ? true : false}
                    value={values.MeterNo2_5}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby=" MeterNo2_5-error"
                  />
                  {errors.MeterNo2_5 && touched.MeterNo2_5 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_5-error">
                      {errors.MeterNo2_5}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_6"
                    error={errors.MeterNo2_6 && touched.MeterNo2_6 ? true : false}
                    value={values.MeterNo2_6}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby=" MeterNo2_6-error"
                  />
                  {errors.MeterNo2_6 && touched.MeterNo2_6 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_6-error">
                      {errors.MeterNo2_6}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    name="MeterNo2_7"
                    error={errors.MeterNo2_7 && touched.MeterNo2_7 ? true : false}
                    value={values.MeterNo2_7}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    margin="normal"
                    aria-describedby=" MeterNo2_7-error"
                  />
                  {errors.MeterNo2_7 && touched.MeterNo2_7 && (
                    <FormHelperText className="errormsg" id=" MeterNo2_7-error">
                      {errors.MeterNo2_7}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

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
                  <TextField
                    variant="outlined"
                    error={
                      errors.dailyCharges && touched.dailyCharges ? true : false
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
                  {errors.dailyCharges && touched.dailyCharges && (
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
                    error={errors.COT && touched.COT ? true : false}
                    name="COT"
                    label="COT"
                    value={values.COT}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="COT-error"
                    className="WidhtFull100"
                  />
                  {errors.COT && touched.COT && (
                    <FormHelperText className="errormsg" id="COT-error">
                      {errors.COT}
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
                  <TextField
                    variant="outlined"
                    error={
                      errors.onlineAccountUserName &&
                        touched.onlineAccountUserName
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
                      errors.onlineAccountPassword &&
                        touched.onlineAccountPassword
                        ? true
                        : false
                    }
                    label="Online Account Password"
                    name="onlineAccountPassword"
                    type={currentProps.visible}
                    autoComplete="new-password"
                    value={values.onlineAccountPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="WidhtFull100"
                    InputProps={{ endAdornment: <PasswordMasking /> }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.meterSerialNumber && touched.meterSerialNumber
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
                  {errors.meterSerialNumber && touched.meterSerialNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="meterSerialNumber-error"
                    >
                      {errors.meterSerialNumber}
                    </FormHelperText>
                  )}
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
                            errors.bill_start_date && touched.bill_start_date
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
                    {errors.bill_start_date && touched.bill_start_date && (
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
                            errors.bill_end_date && touched.bill_end_date
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
                    {errors.bill_end_date && touched.bill_end_date && (
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
                        errors.no_of_days && touched.no_of_days ? true : false
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
                    {errors.no_of_days && touched.no_of_days && (
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

              <Grid container spacing={2}>
                <Grid container item xs={12} md={3} spacing={2}>
                  <Grid item xs={12} md={12}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      <b>Unit Day Rate</b>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      label="Rate"
                      name="unitDayRate"
                      error={
                        errors.unitDayRate && touched.unitDayRate ? true : false
                      }
                      value={values.unitDayRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitDayRate-error"
                      className="WidhtFull100"
                    />
                    {errors.unitDayRate && touched.unitDayRate && (
                      <FormHelperText
                        className="errormsg"
                        id="unitDayRate-error"
                      >
                        {errors.unitDayRate}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      label="KWH"
                      name="unitDaykWh"
                      error={
                        errors.unitDaykWh && touched.unitDaykWh ? true : false
                      }
                      value={values.unitDaykWh}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitDaykWh-error"
                      className="WidhtFull100"
                    />
                    {errors.unitDaykWh && touched.unitDaykWh && (
                      <FormHelperText
                        className="errormsg"
                        id="unitDaykWh-error"
                      >
                        {errors.unitDaykWh}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container item xs={12} md={3} spacing={2}>
                  <Grid item xs={12} md={12}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      <b>Unit Night Rate</b>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="unitNightRate"
                      error={
                        errors.unitNightRate && touched.unitNightRate
                          ? true
                          : false
                      }
                      value={values.unitNightRate}
                      label="Rate"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitNightRate-error"
                      className="WidhtFull100"
                    />
                    {errors.unitNightRate && touched.unitNightRate && (
                      <FormHelperText
                        className="errormsg"
                        id="unitNightRate-error"
                      >
                        {errors.unitNightRate}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="unitNightkWH"
                      error={
                        errors.unitNightkWH && touched.unitNightkWH
                          ? true
                          : false
                      }
                      value={values.unitNightkWH}
                      label="KWH"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitNightkWH-error"
                      className="WidhtFull100"
                    />
                    {errors.unitNightkWH && touched.unitNightkWH && (
                      <FormHelperText
                        className="errormsg"
                        id="unitNightkWH-error"
                      >
                        {errors.unitNightkWH}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container item xs={12} md={3} spacing={2}>
                  <Grid item xs={12} md={12}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      <b>Eve/Wkd Rate</b>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      name="unitWkdRate"
                      error={
                        errors.unitWkdRate && touched.unitWkdRate ? true : false
                      }
                      value={values.unitWkdRate}
                      label="Rate"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitWkdRate-error"
                      className="WidhtFull100"
                    />
                    {errors.unitWkdRate && touched.unitWkdRate && (
                      <FormHelperText
                        className="errormsg"
                        id="unitWkdRate-error"
                      >
                        {errors.unitWkdRate}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      label="KWH"
                      name="unitWkdkWh"
                      error={
                        errors.unitWkdkWh && touched.unitWkdkWh ? true : false
                      }
                      value={values.unitWkdkWh}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitWkdkWh-error"
                      className="WidhtFull100"
                    />
                    {errors.unitWkdkWh && touched.unitWkdkWh && (
                      <FormHelperText
                        className="errormsg"
                        id="unitWkdkWh-error"
                      >
                        {errors.unitWkdkWh}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <Grid container item xs={12} md={3} spacing={2}>
                  <Grid item xs={12} md={12}>
                    <InputLabel id="demo-simple-select-outlined-label">
                      <b>Winter Rate</b>
                    </InputLabel>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      label="Rate"
                      name="unitWinterRate"
                      error={
                        errors.unitWinterRate && touched.unitWinterRate
                          ? true
                          : false
                      }
                      value={values.unitWinterRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitWinterRate-error"
                      className="WidhtFull100"
                    />
                    {errors.unitWinterRate && touched.unitWinterRate && (
                      <FormHelperText
                        className="errormsg"
                        id="unitWinterRate-error"
                      >
                        {errors.unitWinterRate}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      label="KWH"
                      name="unitWinterkWH"
                      error={
                        errors.unitWinterkWH && touched.unitWinterkWH
                          ? true
                          : false
                      }
                      value={values.unitWinterkWH}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="unitWinterkWH-error"
                      className="WidhtFull100"
                    />
                    {errors.unitWinterkWH && touched.unitWinterkWH && (
                      <FormHelperText
                        className="errormsg"
                        id="unitWinterkWH-error"
                      >
                        {errors.unitWinterkWH}
                      </FormHelperText>
                    )}
                  </Grid>

                  {currentProps.showingFrom === 'priceModule' &&
                    <Grid item xs={12} md={6}>
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
                </Button>{" "}
                {currentProps.isFromLead && (
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log("save called");

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
    </div >
  );
}