import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
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
  PDQFinanceStatusOptions,
  ConnectionTypeOptions,
  MachineTypeOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { PasswordMasking } from "../../../../sharedUtils/sharedComponents/passwordMasking";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { selectLeadState } from "projects/lead/redux/lead";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function ChipAndPin(props) {
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const [startLoader, setStartLoader] = useState(false);
  const [isVisible, setVisible] = useState("password");
  const [TIDNumber, setTIDNumber] = useState(props.serviceDataFromLead?.tidNumber || []);

  const currentProps = props;

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Chip and Pin",
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
    leadServiceDataInit.MachineType = {
      label: leadServiceDataInit.MachineType,
      value: leadServiceDataInit.MachineType,
    };
    leadServiceDataInit.PDQFinanceStatus = {
      label: leadServiceDataInit.PDQFinanceStatus,
      value: leadServiceDataInit.PDQFinanceStatus,
    };
    leadServiceDataInit.ConnectionType = {
      label: leadServiceDataInit.ConnectionType,
      value: leadServiceDataInit.ConnectionType,
    };
    leadServiceDataInit.ProviderRefNumber = leadServiceDataInit.ProviderRefNumber === null ? props.isSiteData?.ProviderRefNumber : leadServiceDataInit.ProviderRefNumber
    leadServiceDataInit.midNumber = leadServiceDataInit.midNumber === null ? props.isSiteData?.midNumber : leadServiceDataInit.midNumber
  }

  const initial: any = {
    saveLeadData: false,
    current_supplier: "",
    previous_contract_length: "",
    contract_length: "",
    contract_start_date: "",
    contract_end_date: "",
    previous_contract_start_date: "",
    ProviderRefNumber: props.isSiteData?.ProviderRefNumber,
    midNumber: props.isSiteData?.midNumber,
  };

  const AddNewTIDNumber = () => {
    //  TIDNumber
    const ob = '';
    setTIDNumber([...TIDNumber, ob]);
  };

  const RemoveTIDNumber = (i) => {
    const rows = [...TIDNumber];
    rows.splice(i, 1);
    setTIDNumber(rows);
  }

  const handleChangeTIDNumber = (i, e) => {
    let newNumber = [...TIDNumber];
    newNumber[i] = e.target.value;
    setTIDNumber(newNumber);
  }

  return (
    <div className="app">
      <Formik
        initialValues={
          leadServiceDataInit !== null ? leadServiceDataInit : initial
        }
        onSubmit={(value) => {
          let qu: any = {};
          let SupplerID = "";
          if (value.MachineType) qu.MachineType = value.MachineType.value;
          if (value.PDQFinanceStatus)
            qu.PDQFinanceStatus = value.PDQFinanceStatus.value;
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.NumberTerminals) qu.NumberTerminals = value.NumberTerminals;
          if (value.ProviderRefNumber)
            qu.ProviderRefNumber = value.ProviderRefNumber;
          if (value.MerchantRental) qu.MerchantRental = value.MerchantRental;
          if (value.Package) qu.Package = value.Package;
          if (value.AnalyticsCost) qu.AnalyticsCost = value.AnalyticsCost;
          if (value.CreditCardRate) qu.CreditCardRate = value.CreditCardRate;
          if (value.DebitCardRate) qu.DebitCardRate = value.DebitCardRate;
          if (value.BusinessCardRate)
            qu.BusinessCardRate = value.BusinessCardRate;
          if (value.DeploymentCost) qu.DeploymentCost = value.DeploymentCost;
          if (value.AuthorizationFee)
            qu.AuthorizationFee = value.AuthorizationFee;
          if (value.PCIDSSCharge) qu.PCIDSSCharge = value.PCIDSSCharge;
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
          if (value.ConnectionType)
            qu.ConnectionType = value.ConnectionType.value;
          if (value.DeliveryDate)
            qu.DeliveryDate = new Date(value.DeliveryDate).getTime();
          if (value.FirstTransactionDate)
            qu.FirstTransactionDate = new Date(
              value.FirstTransactionDate
            ).getTime();
          if (value.RenewalDate)
            qu.RenewalDate = new Date(value.RenewalDate).getTime();
          if (value.PCIDSSUserName) qu.PCIDSSUserName = value.PCIDSSUserName;
          if (value.PCIDSSPassword) qu.PCIDSSPassword = value.PCIDSSPassword;
          if (value.PCIComplaintDate)
            qu.PCIComplaintDate = new Date(value.PCIComplaintDate).getTime();
          if (value.midNumber) qu.midNumber = value.midNumber;
          if (value.accountNumber) qu.accountNumber = value.accountNumber;
          if (TIDNumber.length > 0) qu.tidNumber = TIDNumber

          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { chipAndPin: qu },
              service: "chipAndPin",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                chipAndPin: qu,
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
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.MachineType && touched.MachineType
                        ? "ErrorColor"
                        : ""
                    }
                    id="MachineType"
                    name="MachineType"
                    placeholder="Select Machine type"
                    value={values.MachineType}
                    onChange={(e) => {
                      setFieldValue("MachineType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={MachineTypeOptions}
                  />
                  {errors.MachineType && touched.MachineType && (
                    <FormHelperText className="errormsg" id="MachineType-error">
                      {errors.MachineType}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.PDQFinanceStatus && touched.PDQFinanceStatus
                        ? "ErrorColor"
                        : ""
                    }
                    id="PDQFinanceStatus"
                    name="PDQFinanceStatus"
                    placeholder="Payment Type"
                    value={values.PDQFinanceStatus}
                    onChange={(e) => {
                      setFieldValue("PDQFinanceStatus", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={PDQFinanceStatusOptions}
                  />
                  {errors.PDQFinanceStatus && touched.PDQFinanceStatus && (
                    <FormHelperText
                      className="errormsg"
                      id="PDQFinanceStatus-error"
                    >
                      {errors.PDQFinanceStatus}
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

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.NumberTerminals && touched.NumberTerminals
                        ? true
                        : false
                    }
                    name="NumberTerminals"
                    label="Number of terminals"
                    value={values.NumberTerminals}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="NumberTerminals-error"
                    className="WidhtFull100"
                  />
                  {errors.NumberTerminals && touched.NumberTerminals && (
                    <FormHelperText
                      className="errormsg"
                      id="NumberTerminals-error"
                    >
                      {errors.NumberTerminals}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.ProviderRefNumber && touched.ProviderRefNumber
                        ? true
                        : false
                    }
                    name="ProviderRefNumber"
                    label="Provider Ref. number"
                    value={values.ProviderRefNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ProviderRefNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.ProviderRefNumber && touched.ProviderRefNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="ProviderRefNumber-error"
                    >
                      {errors.ProviderRefNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.MerchantRental && touched.MerchantRental
                        ? true
                        : false
                    }
                    name="MerchantRental"
                    label="Merchant rental"
                    value={values.MerchantRental}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="MerchantRental-error"
                    className="WidhtFull100"
                  />
                  {errors.MerchantRental && touched.MerchantRental && (
                    <FormHelperText
                      className="errormsg"
                      id="MerchantRental-error"
                    >
                      {errors.MerchantRental}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.Package && touched.Package ? true : false}
                    name="Package"
                    label="Package"
                    value={values.Package}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Package-error"
                    className="WidhtFull100"
                  />
                  {errors.Package && touched.Package && (
                    <FormHelperText className="errormsg" id="Package-error">
                      {errors.Package}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.AnalyticsCost && touched.AnalyticsCost
                        ? true
                        : false
                    }
                    name="AnalyticsCost"
                    label="Analytics cost"
                    value={values.AnalyticsCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="AnalyticsCost-error"
                    className="WidhtFull100"
                  />
                  {errors.AnalyticsCost && touched.AnalyticsCost && (
                    <FormHelperText
                      className="errormsg"
                      id="AnalyticsCost-error"
                    >
                      {errors.AnalyticsCost}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.CreditCardRate && touched.CreditCardRate
                        ? true
                        : false
                    }
                    name="CreditCardRate"
                    label="Credit card rates"
                    value={values.CreditCardRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="CreditCardRate-error"
                    className="WidhtFull100"
                  />
                  {errors.CreditCardRate && touched.CreditCardRate && (
                    <FormHelperText
                      className="errormsg"
                      id="CreditCardRate-error"
                    >
                      {errors.CreditCardRate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.DebitCardRate && touched.DebitCardRate
                        ? true
                        : false
                    }
                    name="DebitCardRate"
                    label="Debit card rates"
                    value={values.DebitCardRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="DebitCardRate-error"
                    className="WidhtFull100"
                  />
                  {errors.DebitCardRate && touched.DebitCardRate && (
                    <FormHelperText
                      className="errormsg"
                      id="DebitCardRate-error"
                    >
                      {errors.DebitCardRate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.BusinessCardRate && touched.BusinessCardRate
                        ? true
                        : false
                    }
                    name="BusinessCardRate"
                    label="Business card rates"
                    value={values.BusinessCardRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="BusinessCardRate-error"
                    className="WidhtFull100"
                  />
                  {errors.BusinessCardRate && touched.BusinessCardRate && (
                    <FormHelperText
                      className="errormsg"
                      id="BusinessCardRate-error"
                    >
                      {errors.BusinessCardRate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.DeploymentCost && touched.DeploymentCost
                        ? true
                        : false
                    }
                    name="DeploymentCost"
                    label="Deployment cost"
                    value={values.DeploymentCost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="DeploymentCost-error"
                    className="WidhtFull100"
                  />
                  {errors.DeploymentCost && touched.DeploymentCost && (
                    <FormHelperText
                      className="errormsg"
                      id="DeploymentCost-error"
                    >
                      {errors.DeploymentCost}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.AuthorizationFee && touched.AuthorizationFee
                        ? true
                        : false
                    }
                    name="AuthorizationFee"
                    label="Authorization fee"
                    value={values.AuthorizationFee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="AuthorizationFee-error"
                    className="WidhtFull100"
                  />
                  {errors.AuthorizationFee && touched.AuthorizationFee && (
                    <FormHelperText
                      className="errormsg"
                      id="AuthorizationFee-error"
                    >
                      {errors.AuthorizationFee}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.PCIDSSCharge && touched.PCIDSSCharge ? true : false
                    }
                    name="PCIDSSCharge"
                    label="PCI DSS charge"
                    value={values.PCIDSSCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PCIDSSCharge-error"
                    className="WidhtFull100"
                  />
                  {errors.PCIDSSCharge && touched.PCIDSSCharge && (
                    <FormHelperText
                      className="errormsg"
                      id="PCIDSSCharge-error"
                    >
                      {errors.PCIDSSCharge}
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
                <Grid item xs={12} md={6}>
                  <Select
                    className={
                      errors.ConnectionType && touched.ConnectionType
                        ? "ErrorColor"
                        : ""
                    }
                    id="ConnectionType"
                    name="ConnectionType"
                    placeholder="Select Connection Type"
                    value={values.ConnectionType}
                    onChange={(e) => {
                      setFieldValue("ConnectionType", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ConnectionTypeOptions}
                  />
                  {errors.ConnectionType && touched.ConnectionType && (
                    <FormHelperText
                      className="errormsg"
                      id="ConnectionType-error"
                    >
                      {errors.ConnectionType}
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
                          errors.DeliveryDate && touched.DeliveryDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="DeliveryDate"
                        name="DeliveryDate"
                        label="Delivery date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.DeliveryDate ? values.DeliveryDate : null}
                        onChange={(e) => setFieldValue("DeliveryDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="DeliveryDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.DeliveryDate && touched.DeliveryDate && (
                    <FormHelperText
                      className="errormsg"
                      id="DeliveryDate-error"
                    >
                      {errors.DeliveryDate}
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
                        style={{ zIndex: 0 }}
                        inputVariant="outlined"
                        error={
                          errors.FirstTransactionDate &&
                            touched.FirstTransactionDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="FirstTransactionDate"
                        name="FirstTransactionDate"
                        label="First transaction date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.FirstTransactionDate
                            ? values.FirstTransactionDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("FirstTransactionDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="FirstTransactionDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.FirstTransactionDate && touched.FirstTransactionDate && (
                    <FormHelperText
                      className="errormsg"
                      id="FirstTransactionDate-error"
                    >
                      {errors.FirstTransactionDate}
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
                          errors.RenewalDate && touched.RenewalDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="RenewalDate"
                        name="RenewalDate"
                        label="Renewal date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.RenewalDate ? values.RenewalDate : null}
                        onChange={(e) => setFieldValue("RenewalDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="RenewalDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.RenewalDate && touched.RenewalDate && (
                    <FormHelperText className="errormsg" id="RenewalDate-error">
                      {errors.RenewalDate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.PCIDSSUserName && touched.PCIDSSUserName
                        ? true
                        : false
                    }
                    name="PCIDSSUserName"
                    label="PCI DSS user name"
                    value={values.PCIDSSUserName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PCIDSSUserName-error"
                    className="WidhtFull100"
                  />
                  {errors.PCIDSSUserName && touched.PCIDSSUserName && (
                    <FormHelperText
                      className="errormsg"
                      id="PCIDSSUserName-error"
                    >
                      {errors.PCIDSSUserName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.PCIDSSPassword && touched.PCIDSSPassword
                        ? true
                        : false
                    }
                    name="PCIDSSPassword"
                    type={currentProps.visible}
                    label="PCI DSS password"
                    value={values.PCIDSSPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PCIDSSPassword-error"
                    className="WidhtFull100"
                    InputProps={{ endAdornment: <PasswordMasking /> }}
                  />
                  {errors.PCIDSSPassword && touched.PCIDSSPassword && (
                    <FormHelperText
                      className="errormsg"
                      id="PCIDSSPassword-error"
                    >
                      {errors.PCIDSSPassword}
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
                          errors.PCIComplaintDate && touched.PCIComplaintDate
                            ? true
                            : false
                        }
                        margin="normal"
                        id="PCIComplaintDate"
                        name="PCIComplaintDate"
                        label="PCI complaint date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.PCIComplaintDate
                            ? values.PCIComplaintDate
                            : null
                        }
                        onChange={(e) => setFieldValue("PCIComplaintDate", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="PCIComplaintDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.PCIComplaintDate && touched.PCIComplaintDate && (
                    <FormHelperText
                      className="errormsg"
                      id="PCIComplaintDate-error"
                    >
                      {errors.PCIComplaintDate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.midNumber && touched.midNumber ? true : false}
                    label="MID Number"
                    name="midNumber"
                    value={values.midNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="midNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.midNumber && touched.midNumber && (
                    <FormHelperText className="errormsg" id="midNumber-error">
                      {errors.midNumber}
                    </FormHelperText>
                  )}
                </Grid>

                {TIDNumber.map((v, i) => (
                  <Grid item xs={12} md={4}>

                    <div className="tidNumber_style">
                      <span className="remove_field" onClick={() => RemoveTIDNumber(i)}>
                        <HighlightOffIcon />
                      </span>
                      <TextField
                        variant="outlined"
                        label={`TID Number ${i + 1}`}
                        // type="number"
                        name="tidNumber"
                        value={v}
                        onChange={(e) => handleChangeTIDNumber(i, e)}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="tidNumber-error"
                        className="WidhtFull100"
                      />
                      {errors.tidNumber && touched.tidNumber && (
                        <FormHelperText className="errormsg" id="tidNumber-error">
                          {errors.tidNumber}
                        </FormHelperText>
                      )}
                    </div>
                  </Grid>
                ))}

                <Grid item xs={12} md={4}>
                  <Button
                    color="primary"
                    aria-label="Add"
                    onClick={() => AddNewTIDNumber()}
                    startIcon={<AddBoxIcon />}
                  >
                    <span>Add TID Number</span>
                  </Button>
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