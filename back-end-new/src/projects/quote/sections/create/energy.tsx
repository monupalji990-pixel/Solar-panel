import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import { ContractLengthOption } from "../../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { useSelector } from "react-redux";
import { selectLeadState } from "projects/lead/redux/lead";

export default function Energy(props) {
  console.log(props.serviceDataFromLead);
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);

  const [RadioToggle, setRadioToggle] = React.useState("0");
  const [RadioToggleEleAnnual, setRadioToggleEleAnnual] = React.useState("0");
  const [RadioToggleEconomy, setRadioToggleEconomy] = React.useState("0");
  const [RadioTogglesecond, setRadioTogglesecond] = React.useState("0");
  const [RadioToggleDiscount, setRadioToggleDiscount] = React.useState("0");
  const [state, setState] = React.useState(null);

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  const handleRadioEleAnnual = (event) => {
    setRadioToggleEleAnnual(event.target.value);
  };

  const handleRadioEconomy = (event) => {
    setRadioToggleEconomy(event.target.value);
  };

  const handleRadioDiscount = (event) => {
    setRadioToggleDiscount(event.target.value);
  };

  const handleRadioChange = (event) => {
    setRadioTogglesecond(event.target.value);
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Gas",
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
    leadServiceDataInit.contract_length = {
      label: leadServiceDataInit.contract_length,
      value: leadServiceDataInit.contract_length,
    };
  }
  useEffect(() => {
    if (leadServiceDataInit) {
      if (leadServiceDataInit.economy)
        setRadioToggleEconomy(leadServiceDataInit.economy);
      if (leadServiceDataInit.paymentOption)
        setRadioToggle(leadServiceDataInit.paymentOption);
      if (leadServiceDataInit.warmHomeDiscount)
        setRadioToggleDiscount(leadServiceDataInit.warmHomeDiscount);
    }
  }, []);
  const initialValues: any = {
    saveLeadData: false,
    current_supplier: "",
    currentTariff: "",
    pcode: "",
    newSupplier: "",
    contract_length: "",
    newTariff: "",
    EMonthlyCost: "",
    contract_start_date: "",
    contract_end_date: "",
    contractReviewOption: "",
    EAnnualCost: "",
    GMonthlyCost: "",
    GAnnualCost: "",
    warmHomeDiscount: "",
  };
  return (
    <div className="app">
      <Formik
        initialValues={
          leadServiceDataInit !== null ? leadServiceDataInit : initialValues
        }
        onSubmit={(value) => {
          let qu: any = {};
          let SupplerID = "";
          if (value.current_supplier) SupplerID = value.current_supplier.value;
          if (value.currentTariff) qu.currentTariff = value.currentTariff;

          qu.economy = RadioToggleEconomy;
          if (value.economy) qu.economy = value.economy;

          qu.electricAnnual = RadioToggleEleAnnual;
          qu.gasAnnual = RadioTogglesecond;

          qu.paymentOption = RadioToggle;
          if (value.paymentOption) qu.paymentOption = value.paymentOption;

          qu.warmHomeDiscount = RadioToggleDiscount;
          if (value.warmHomeDiscount)
            qu.warmHomeDiscount = value.warmHomeDiscount;

          if (value.newSupplier) qu.newSupplier = value.newSupplier.value;
          if (value.newTariff) qu.newTariff = value.newTariff;
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

          if (value.pcode) qu.pcode = value.pcode;

          if (value.contractReviewOption)
            qu.contractReviewOption = value.contractReviewOption?.value;

          if (value.EMonthlyCost) qu.EMonthlyCost = value.EMonthlyCost;
          if (value.EAnnualCost) qu.EAnnualCost = value.EAnnualCost;
          if (value.GMonthlyCost) qu.GMonthlyCost = value.GMonthlyCost;
          if (value.GAnnualCost) qu.GAnnualCost = value.GAnnualCost;
         
          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;

            currentProps._saveServiceData({
              id: currentProps.leadId,
              serviceData: { energy: qu },
              service: "energy",
            });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue("otherdata", {
                energy: qu,
                Supplier: SupplerID,
              });
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          current_supplier: Yup.string().required(
            "Current Supplier is required"
          ),
          currentTariff: Yup.string().required("Current Staff is required"),
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
                      errors.currentTariff && touched.currentTariff
                        ? true
                        : false
                    }
                    name="currentTariff"
                    label="Current Tariff"
                    value={values.currentTariff}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="currentTariff-error"
                    className="WidhtFull100"
                  />
                  {errors.currentTariff && touched.currentTariff && (
                    <FormHelperText
                      className="errormsg"
                      id="currentTariff-error"
                    >
                      {errors.currentTariff}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Economy 7</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="economy"
                      onChange={handleRadioEconomy}
                      value={RadioToggleEconomy}
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      Electric Annual Usage
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="electricAnnual"
                      defaultValue="top"
                      value={RadioToggleEleAnnual}
                      onChange={handleRadioEleAnnual}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio color="primary" />}
                        label="Monthly"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio color="primary" />}
                        label="Annual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gas Annual Usage</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="gasAnnual"
                      defaultValue="top"
                      value={RadioTogglesecond}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value="3"
                        control={<Radio color="primary" />}
                        label="Monthly"
                      />
                      <FormControlLabel
                        value="4"
                        control={<Radio color="primary" />}
                        label="Annual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                {RadioToggleEleAnnual === "1" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.EMonthlyCost && touched.EMonthlyCost
                          ? true
                          : false
                      }
                      name="EMonthlyCost"
                      label="Monthly Cost"
                      value={values.EMonthlyCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="EMonthlyCost-error"
                      className="WidhtFull100"
                    />
                    {errors.EMonthlyCost && touched.EMonthlyCost && (
                      <FormHelperText
                        className="errormsg"
                        id="EMonthlyCost-error"
                      >
                        {errors.EMonthlyCost}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                {RadioToggleEleAnnual === "2" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.EAnnualCost && touched.EAnnualCost ? true : false
                      }
                      name="EAnnualCost"
                      label="Annual Cost"
                      value={values.EAnnualCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="EAnnualCost-error"
                      className="WidhtFull100"
                    />
                    {errors.EAnnualCost && touched.EAnnualCost && (
                      <FormHelperText
                        className="errormsg"
                        id="EAnnualCost-error"
                      >
                        {errors.EAnnualCost}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                {RadioTogglesecond === "3" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.GMonthlyCost && touched.GMonthlyCost
                          ? true
                          : false
                      }
                      name="GMonthlyCost"
                      label="Monthly Cost"
                      value={values.GMonthlyCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="GMonthlyCost-error"
                      className="WidhtFull100"
                    />
                    {errors.GMonthlyCost && touched.GMonthlyCost && (
                      <FormHelperText
                        className="errormsg"
                        id="GMonthlyCost-error"
                      >
                        {errors.GMonthlyCost}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                {RadioTogglesecond === "4" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.GAnnualCost && touched.GAnnualCost ? true : false
                      }
                      name="GAnnualCost"
                      label="Annual Cost"
                      value={values.GAnnualCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="GAnnualCost-error"
                      className="WidhtFull100"
                    />
                    {errors.GAnnualCost && touched.GAnnualCost && (
                      <FormHelperText
                        className="errormsg"
                        id="GAnnualCost-error"
                      >
                        {errors.GAnnualCost}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Payment Option</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="paymentOption"
                      onChange={handleRadio}
                      value={RadioToggle}
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="DD"
                        control={<Radio color="primary" />}
                        label="DD"
                      />
                      <FormControlLabel
                        value="PREPAYMENT"
                        control={<Radio color="primary" />}
                        label="PREPAYMENT"
                      />
                      <FormControlLabel
                        value="QUARTERLY"
                        control={<Radio color="primary" />}
                        label="QUARTERLY"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">
                      Qualify for Warm Home Discount
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="warmHomeDiscount"
                      defaultValue="top"
                      value={RadioToggleDiscount}
                      onChange={handleRadioDiscount}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {RadioToggleDiscount === "Yes" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="outlined"
                      error={errors.pcode && touched.pcode ? true : false}
                      name="pcode"
                      label="Promotion Code"
                      value={values.pcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="pcode-error"
                      className="WidhtFull100"
                    />
                    {errors.pcode && touched.pcode && (
                      <FormHelperText className="errormsg" id="pcode-error">
                        {errors.pcode}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.newSupplier && touched.newSupplier
                        ? "ErrorColor"
                        : ""
                    }
                    id="newSupplier"
                    name="newSupplier"
                    placeholder="New Supplier Name"
                    value={values.newSupplier}
                    onChange={(e) => {
                      setFieldValue("newSupplier", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={supplierList}
                  />
                  {errors.newSupplier && touched.newSupplier && (
                    <FormHelperText className="errormsg" id="newSupplier-error">
                      {errors.newSupplier}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.newTariff && touched.newTariff ? true : false}
                    name="newTariff"
                    label="New Supplier Tariff"
                    value={values.newTariff}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="newTariff-error"
                    className="WidhtFull100"
                  />
                  {errors.newTariff && touched.newTariff && (
                    <FormHelperText className="errormsg" id="newTariff-error">
                      {errors.newTariff}
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
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={
                          errors.contract_end_date && touched.contract_end_date
                            ? true
                            : false
                        }
                        margin="normal"
                        id="contract_end_date"
                        name="contract_end_date"
                        label="Preferred Contract End Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.contract_end_date
                            ? values.contract_end_date
                            : null
                        }
                        onChange={(e) => setFieldValue("contract_end_date", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="contract_end_date-number-error"
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
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>

                <Select
                      className={
                        errors.contractReviewOption && touched.contractReviewOption
                          ? "ErrorColor"
                          : ""
                      }
                      id="contractReviewOption"
                      name="contractReviewOption"
                      placeholder="Contract Review"
                      value={values.contractReviewOption}
                      onChange={(e) => {
                        setFieldValue("contractReviewOption", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="contractReviewOption-error"
                      options={[{ value: '3 Months', label: '3 Months' }, { value: '11 Months', label: '11 Months' }]}
                    />
                    {errors.contractReviewOption && touched.contractReviewOption && (
                      <FormHelperText
                        className="errormsg"
                        id="contractReviewOption-error"
                      >
                        {errors.contractReviewOption}
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
                  >
                    Save
                  </Button>
                )}{" "}
                {leadState.isSaveLeadLoading && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
