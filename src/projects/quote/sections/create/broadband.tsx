import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  ContractLengthOption,
  BroadbandConnectionOptions,
  ProductsOptions,
  WholeSaleProviderOptions,
  broadbandStatusOptions,
  BroadbandRouterPriceOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import _ from "lodash";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Broadband(props) {

  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [visible, setVisible] = React.useState("password");
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

  if (
    props.serviceDataFromLead &&
    Object.keys(props.serviceDataFromLead).length > 1
  ) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.current_supplier = supplierList.filter((sup) => {
      if (sup.value == leadServiceDataInit.SupplerID) return sup;
    })[0];
    console.log(leadServiceDataInit.current_supplier);
    leadServiceDataInit.previous_contract_length = {
      label: leadServiceDataInit.previous_contract_length,
      value: leadServiceDataInit.previous_contract_length,
    };
    leadServiceDataInit.contract_length = {
      label: leadServiceDataInit.contract_length,
      value: leadServiceDataInit.contract_length,
    };
    leadServiceDataInit.Products = {
      label: leadServiceDataInit.Products,
      value: leadServiceDataInit.Products,
    };
    leadServiceDataInit.ConnectionCharges = BroadbandConnectionOptions.filter(
      (connection) => {
        if (leadServiceDataInit.ConnectionCharges === connection.value)
          return connection;
      }
    )[0];
    leadServiceDataInit.RouterPrice = BroadbandRouterPriceOptions.filter(
      (price) => {
        if (leadServiceDataInit.RouterPrice === price.value) return price;
      }
    )[0];
    leadServiceDataInit.WholeSaleProvider = {
      label: leadServiceDataInit.WholeSaleProvider,
      value: leadServiceDataInit.WholeSaleProvider,
    };
    leadServiceDataInit.status = {
      label: leadServiceDataInit.status,
      value: leadServiceDataInit.status,
    };
  }

  const initial: any = {
    saveLeadData: false,
    current_supplier: "",
    previous_contract_length: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
    previous_contract_start_date: "",
    Products: null,
  };
  return (
    <div className="app">
      <Formik
        initialValues={
          leadServiceDataInit !== null ? leadServiceDataInit : initial
        }
        onSubmit={(value) => {
          const qu: any = {};
          let SupplerID = "";
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.Products) qu.Products = value.Products.value;
          if (value.Rental) qu.Rental = value.Rental;
          if (value.ConnectionCharges)
            qu.ConnectionCharges = value.ConnectionCharges.value;
          if (value.RouterPrice) qu.RouterPrice = value.RouterPrice.value;
          if (value.status) qu.status = value.status.value;
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
          if (value.UserName) qu.UserName = value.UserName;
          if (value.Password) qu.Password = value.Password;
          if (value.IPAddress) qu.IPAddress = value.IPAddress;
          if (value.RouterModel) qu.RouterModel = value.RouterModel;
          if (value.SerialNumber) qu.SerialNumber = value.SerialNumber;
          if (value.ProgrammedDate)
            qu.ProgrammedDate = new Date(value.ProgrammedDate).getTime();
          if (value.BroadbandPostageProof)
            qu.BroadbandPostageProof = value.BroadbandPostageProof;
          if (value.BroadbandLiveDate)
            qu.BroadbandLiveDate = new Date(value.BroadbandLiveDate).getTime();
          if (value.BroadbandRenewalDate)
            qu.BroadbandRenewalDate = new Date(
              value.BroadbandRenewalDate
            ).getTime();
          if (value.accountNumber) qu.accountNumber = value.accountNumber;

          if (value.wifi_name) qu.wifi_name = value.wifi_name;
          if (value.wifi_password) qu.wifi_password = value.wifi_password;

          if (value.WholeSaleProvider)
            qu.WholeSaleProvider = value.WholeSaleProvider.value;

          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            console.log(SupplerID);
            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { broadband: qu },
              service: "broadband",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                broadband: qu,
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
                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.Products && touched.Products ? "ErrorColor" : ""
                    }
                    id="Products"
                    name="Products"
                    placeholder="Select Products & Packages"
                    value={values.Products}
                    onChange={(e) => {
                      setFieldValue("Products", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ProductsOptions}
                  />
                  {errors.Products && touched.Products && (
                    <FormHelperText className="errormsg" id="Products-error">
                      {errors.Products}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={errors.Rental && touched.Rental ? true : false}
                    name="Rental"
                    label="Broadband Rental"
                    value={values.Rental}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Rental-error"
                    className="WidhtFull100"
                  />
                  {errors.Rental && touched.Rental && (
                    <FormHelperText className="errormsg" id="Rental-error">
                      {errors.Rental}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={5}>
                  <Select
                    className={
                      errors.ConnectionCharges && touched.ConnectionCharges
                        ? "ErrorColor"
                        : ""
                    }
                    id="ConnectionCharges"
                    name="ConnectionCharges"
                    placeholder="Connection Charges and Packages"
                    value={values.ConnectionCharges}
                    onChange={(e) => {
                      setFieldValue("ConnectionCharges", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={BroadbandConnectionOptions}
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
                <Grid item xs={12} md={2}>
                  <Select
                    className={
                      errors.RouterPrice && touched.RouterPrice
                        ? "ErrorColor"
                        : ""
                    }
                    id="RouterPrice"
                    name="RouterPrice"
                    placeholder="Router Price"
                    value={values.RouterPrice}
                    onChange={(e) => {
                      setFieldValue("RouterPrice", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={BroadbandRouterPriceOptions}
                  />
                  {errors.RouterPrice && touched.RouterPrice && (
                    <FormHelperText className="errormsg" id="RouterPrice-error">
                      {errors.RouterPrice}
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
                    error={errors.UserName && touched.UserName ? true : false}
                    name="UserName"
                    label="User Name"
                    value={values.UserName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="UserName-error"
                    className="WidhtFull100"
                  />
                  {errors.UserName && touched.UserName && (
                    <FormHelperText className="errormsg" id="UserName-error">
                      {errors.UserName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.Password && touched.Password ? true : false}
                    name="Password"
                    label="Password"
                    type={visible}
                    value={values.Password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <Button
                          className="password__show"
                          onClick={() =>
                            visible === "text"
                              ? setVisible("password")
                              : setVisible("text")
                          }
                        >
                          {visible === "text" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      ),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Password-error"
                    className="WidhtFull100"
                  />
                  {errors.Password && touched.Password && (
                    <FormHelperText className="errormsg" id="Password-error">
                      {errors.Password}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.IPAddress && touched.IPAddress ? true : false}
                    name="IPAddress"
                    label="IP Address"
                    value={values.IPAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="IPAddress-error"
                    className="WidhtFull100"
                  />
                  {errors.IPAddress && touched.IPAddress && (
                    <FormHelperText className="errormsg" id="IPAddress-error">
                      {errors.IPAddress}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.RouterModel && touched.RouterModel ? true : false
                    }
                    name="RouterModel"
                    label="Router model"
                    value={values.RouterModel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="RouterModel-error"
                    className="WidhtFull100"
                  />
                  {errors.RouterModel && touched.RouterModel && (
                    <FormHelperText className="errormsg" id="RouterModel-error">
                      {errors.RouterModel}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.SerialNumber && touched.SerialNumber ? true : false
                    }
                    name="SerialNumber"
                    label="Serial number"
                    value={values.SerialNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SerialNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.SerialNumber && touched.SerialNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="SerialNumber-error"
                    >
                      {errors.SerialNumber}
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
                          errors.ProgrammedDate && touched.ProgrammedDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="ProgrammedDate"
                        name="ProgrammedDate"
                        label="Telecoms live date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.ProgrammedDate ? values.ProgrammedDate : null
                        }
                        onChange={(e) => setFieldValue("ProgrammedDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="ProgrammedDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.ProgrammedDate && touched.ProgrammedDate && (
                    <FormHelperText
                      className="errormsg"
                      id="ProgrammedDate-error"
                    >
                      {errors.ProgrammedDate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.BroadbandPostageProof &&
                        touched.BroadbandPostageProof
                        ? true
                        : false
                    }
                    name="BroadbandPostageProof"
                    label="Broadband postage proof"
                    value={values.BroadbandPostageProof}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="BroadbandPostageProof-error"
                    className="WidhtFull100"
                  />
                  {errors.BroadbandPostageProof &&
                    touched.BroadbandPostageProof && (
                      <FormHelperText
                        className="errormsg"
                        id="BroadbandPostageProof-error"
                      >
                        {errors.BroadbandPostageProof}
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
                          errors.BroadbandLiveDate && touched.BroadbandLiveDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="BroadbandLiveDate"
                        name="BroadbandLiveDate"
                        label="Broadband live date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.BroadbandLiveDate
                            ? values.BroadbandLiveDate
                            : null
                        }
                        onChange={(e) => setFieldValue("BroadbandLiveDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="BroadbandLiveDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.BroadbandLiveDate && touched.BroadbandLiveDate && (
                    <FormHelperText
                      className="errormsg"
                      id="BroadbandLiveDate-error"
                    >
                      {errors.BroadbandLiveDate}
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
                          errors.BroadbandRenewalDate &&
                            touched.BroadbandRenewalDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="BroadbandRenewalDate"
                        name="BroadbandRenewalDate"
                        label="Broadband renewal date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.BroadbandRenewalDate
                            ? values.BroadbandRenewalDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("BroadbandRenewalDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="BroadbandRenewalDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.BroadbandRenewalDate && touched.BroadbandRenewalDate && (
                    <FormHelperText
                      className="errormsg"
                      id="BroadbandRenewalDate-error"
                    >
                      {errors.BroadbandRenewalDate}
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
                    options={broadbandStatusOptions}
                  />
                  {errors.status && touched.status && (
                    <FormHelperText className="errormsg" id="status-error">
                      {errors.status}
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
                    label="Broadband provider"
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
                    error={errors.wifi_name && touched.wifi_name ? true : false}
                    name="wifi_name"
                    label="Wifi Name"
                    value={values.wifi_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="wifi_name-error"
                    className="WidhtFull100"
                  />
                  {errors.wifi_name && touched.wifi_name && (
                    <FormHelperText className="errormsg" id="wifi_name-error">
                      {errors.wifi_name}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.wifi_password && touched.wifi_password ? true : false}
                    name="wifi_password"
                    label="Wifi Password"
                    type={visible}
                    value={values.wifi_password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <Button
                          className="password__show"
                          onClick={() =>
                            visible === "text"
                              ? setVisible("password")
                              : setVisible("text")
                          }
                        >
                          {visible === "text" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Button>
                      ),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="wifi_password-error"
                    className="WidhtFull100"
                  />
                  {errors.wifi_password && touched.wifi_password && (
                    <FormHelperText className="errormsg" id="wifi_password-error">
                      {errors.wifi_password}
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
    </div>
  );
}
