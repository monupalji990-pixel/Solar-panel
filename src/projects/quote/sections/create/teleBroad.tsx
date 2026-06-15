import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import { selectLeadState } from 'projects/lead/redux/lead';
import {
  TeleBroadPhoneSystem,
  combinedPackgeOptions,
  TeleBroadProviderOptions,
  DivertsCostOptions,
  ContractLengthOption,
} from "../../../../sharedUtils/globalHelper/constantValues";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles(() => ({
  accordionTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
  },
}));

export default function TeleBroad(props) {
  let leadServiceDataInit: any = null;
  const classes = useStyles();

  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [RadioToggleMultiline, setRadioToggleMultiline] = useState("0");
  const [RadioToggleMultilineExtra, setRadioToggleMultilineExtra] = useState("0");
  const [RadioToggleRouter, setRadioToggleRouter] = useState("0");
  const [visible, setVisible] = React.useState("password");
  const [phoneSystemOption, setPhoneSystemOption] = useState('');
  const [selectPackage, setSelectPackage] = useState('');
  const [handsetNumbers, setHandsetNumbers]: any = useState(0);

  const leadState = useSelector(selectLeadState);

  const handleToggleRouter = (event) => {
    setRadioToggleRouter(event.target.value);
  };

  const handleToggleMultiline = (event) => {
    setRadioToggleMultiline(event.target.value);
  };

  const handleToggleMultilineExtra = (event) => {
    setRadioToggleMultilineExtra(event.target.value);
  };

  if (props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.contract_length = { label: leadServiceDataInit.contract_length, value: leadServiceDataInit.contract_length };

    leadServiceDataInit.products = {
      label: leadServiceDataInit.products,
      value: leadServiceDataInit.products,
    };

    leadServiceDataInit.provider = {
      label: leadServiceDataInit.provider,
      value: leadServiceDataInit.provider,
    };

    leadServiceDataInit.phoneSystem = {
      label: leadServiceDataInit.phoneSystem,
      value: leadServiceDataInit.phoneSystem,
    };
    leadServiceDataInit.divertsCost = {
      label: leadServiceDataInit.divertsCost,
      value: leadServiceDataInit.divertsCost,
    };
  }

  React.useEffect(() => {
    if (leadServiceDataInit) {
      if (leadServiceDataInit.router)
        setRadioToggleRouter(leadServiceDataInit.router)
      if (leadServiceDataInit.multiline)
        setRadioToggleMultiline(leadServiceDataInit.multiline)
      if (leadServiceDataInit.extraMultiLine)
        setRadioToggleMultilineExtra(leadServiceDataInit.extraMultiLine)
    }
  }, []);

  let isBroadbandNumber = false;
  if (selectPackage.split(" ")[0] === "SOGEA" || selectPackage.split(" ")[0] === "FTTP") {
    isBroadbandNumber = true;
  }
  else {
    isBroadbandNumber = false;
  }

  const ii: any = {
    contract_end_date: "",
    saveLeadData: false,
    contract_length: "",
    contract_start_date: "",
    PhoneNumber: "",
    phoneSystem: "",
    provider: "",
    divertsCost: "",
    products: "",
  }

  return (
    <div className="app">
      <Formik
        // enableReinitialize
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          let qu: any = {};
          try {
            if (value.PhoneNumber) qu.PhoneNumber = value.PhoneNumber
            if (value.phoneSystem) qu.phoneSystem = value.phoneSystem.value;
            if (value.provider) qu.provider = value.provider.value;
            if (value.products) qu.products = value.products.value;
            if (value.number_of_handset) qu.number_of_handset = value.number_of_handset
            if (value.additional_handsets) qu.additional_handsets = value.additional_handsets
            if (value.broadband_number) qu.broadband_number = value.broadband_number
            qu.router = RadioToggleRouter
            if (value.UserName) qu.UserName = value.UserName
            if (value.Password) qu.Password = value.Password
            if (value.IPAddress) qu.IPAddress = value.IPAddress
            if (value.contract_length) qu.contract_length = value.contract_length.value;

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

            qu.multiline = RadioToggleMultiline
            if (value.Multiline_PhoneNumber) qu.Multiline_PhoneNumber = value.Multiline_PhoneNumber
            if (value.multilineCost) qu.multilineCost = value.multilineCost

            qu.extraMultiLine = RadioToggleMultilineExtra
            if (value.divertsCost) qu.divertsCost = value.divertsCost.value;

            if (value.overall_customer_cost) qu.overall_customer_cost = value.overall_customer_cost
            if (value.oneOffCharge) qu.oneOffCharge = value.oneOffCharge
            if (value.costOfExtras) qu.costOfExtras = value.costOfExtras
            if (value.noOfRouter) qu.noOfRouter = value.noOfRouter
          }
          catch (error) {
            console.log("error on submit telecom & broadband ===>>>>", error)
          }
          if (value.saveLeadData) {
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { telecomandbroadband: qu }, service: 'telecomandbroadband' });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                telecomandbroadband: qu,
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu);
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
          PhoneNumber: Yup.string().required(
            "Phone Number is required"
          ),
          phoneSystem: Yup.string().required(
            "Please Select the Type of Phone System"
          ),
          provider: Yup.string().required(
            "Provider is required"
          ),
          products: Yup.string().required(
            "Please Select the Package"
          ),
        })}
      >
        {props => {
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
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.PhoneNumber && touched.PhoneNumber ? true : false
                    }
                    name="PhoneNumber"
                    label="Phone Number"
                    value={values.PhoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="PhoneNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.PhoneNumber && touched.PhoneNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="PhoneNumber-error"
                    >
                      {errors.PhoneNumber}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.phoneSystem && touched.phoneSystem
                        ? "ErrorColor"
                        : ""
                    }
                    isClearable={true}
                    id="phoneSystem"
                    variant="outlined"
                    name="phoneSystem"
                    placeholder="Type of Phone System"
                    value={values.phoneSystem}
                    onChange={(e) => {
                      setFieldValue("phoneSystem", e)
                      if (e && e.value)
                        setPhoneSystemOption(e.value)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={TeleBroadPhoneSystem}
                  />
                  {errors.phoneSystem && touched.phoneSystem && (
                    <FormHelperText
                      className="errormsg"
                      id="phoneSystem-error"
                    >
                      {errors.phoneSystem}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <Select
                    className={
                      errors.provider && touched.provider
                        ? "ErrorColor"
                        : ""
                    }
                    isClearable={true}
                    id="provider"
                    variant="outlined"
                    name="provider"
                    placeholder="Provider"
                    value={values.provider}
                    onChange={(e) => {
                      setFieldValue("provider", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={TeleBroadProviderOptions}
                  />
                  {errors.provider && touched.provider && (
                    <FormHelperText
                      className="errormsg"
                      id="provider-error"
                    >
                      {errors.provider}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.oneOffCharge && touched.oneOffCharge ? true : false
                    }
                    type="number"
                    name="oneOffCharge"
                    label="One Off Charge"
                    value={values.oneOffCharge}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="oneOffCharge-error"
                    className="WidhtFull100"
                  />
                  {errors.oneOffCharge && touched.oneOffCharge && (
                    <FormHelperText
                      className="errormsg"
                      id="oneOffCharge-error"
                    >
                      {errors.oneOffCharge}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={
                      errors.products && touched.products
                        ? "ErrorColor"
                        : ""
                    }
                    id="products"
                    name="products"
                    isClearable={true}
                    placeholder="Select Packages"
                    value={values.products}
                    onChange={(e) => {
                      setFieldValue("products", e)
                      if (e && e.value)
                        setSelectPackage(e.value)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={combinedPackgeOptions}
                  />
                  {errors.products && touched.products && (
                    <FormHelperText
                      className="errormsg"
                      id="products-error"
                    >
                      {errors.products}
                    </FormHelperText>
                  )}
                </Grid>

                {phoneSystemOption === "VOIP" &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.number_of_handset && touched.number_of_handset
                          ? true
                          : false
                      }
                      type="number"
                      label="Number of Handsets"
                      name="number_of_handset"
                      value={values.number_of_handset}
                      onChange={(e) => {
                        handleChange(e)
                        setHandsetNumbers(e.target.value)
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="number_of_handset-error"
                      className="WidhtFull100"
                    />
                    {errors.number_of_handset && touched.number_of_handset && (
                      <FormHelperText
                        className="errormsg"
                        id="number_of_handset-error"
                      >
                        {errors.number_of_handset}
                      </FormHelperText>
                    )}
                  </Grid>
                }

                {(handsetNumbers >= 3) &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.additional_handsets && touched.additional_handsets
                          ? true
                          : false
                      }
                      type="number"
                      label="Additional Handsets £10 Per Handsests"
                      name="additional_handsets"
                      value={values.additional_handsets}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="additional_handsets-error"
                      className="WidhtFull100"
                    />
                    {errors.additional_handsets && touched.additional_handsets && (
                      <FormHelperText
                        className="errormsg"
                        id="additional_handsets-error"
                      >
                        {errors.additional_handsets}
                      </FormHelperText>
                    )}
                  </Grid>
                }
              </Grid>

              <Grid container spacing={3}>
                {isBroadbandNumber &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.broadband_number && touched.broadband_number
                          ? true
                          : false
                      }
                      label="Broadband Number"
                      name="broadband_number"
                      helperText={"BROADBAND NUMBER STARTING WITH BBEU"}
                      value={values.broadband_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="broadband_number-error"
                      className="WidhtFull100"
                    />
                    {errors.broadband_number && touched.broadband_number && (
                      <FormHelperText
                        className="errormsg"
                        id="broadband_number-error"
                      >
                        {errors.broadband_number}
                      </FormHelperText>
                    )}
                  </Grid>
                }
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Customer got our Router</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="router"
                      onChange={handleToggleRouter}
                      value={RadioToggleRouter}
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

                {RadioToggleRouter === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={errors.noOfRouter && touched.noOfRouter ? true : false}
                      name="noOfRouter"
                      type="number"
                      label="Number of Routers"
                      value={values.noOfRouter}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="noOfRouter-error"
                      className="WidhtFull100"
                    />
                    {errors.noOfRouter && touched.noOfRouter && (
                      <FormHelperText className="errormsg" id="noOfRouter-error">
                        {errors.noOfRouter}
                      </FormHelperText>
                    )}
                  </Grid>
                }
              </Grid>

              <Grid container spacing={3}>
                {RadioToggleRouter === "Yes" &&
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
                }
                {RadioToggleRouter === "Yes" &&
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
                }
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
                  <Select
                    className={
                      errors.contract_length &&
                        touched.contract_length
                        ? "ErrorColor"
                        : ""
                    }
                    id="contract_length"
                    variant="outlined"
                    isClearable={true}
                    name="contract_length"
                    placeholder="Contract length"
                    value={values.contract_length}
                    onChange={(e) => {
                      setFieldValue("contract_length", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ContractLengthOption}
                  />
                  {errors.contract_length &&
                    touched.contract_length && (
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
                        label="Contract Start Date"
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
                          errors.contract_end_date &&
                            touched.contract_end_date
                            ? true
                            : false
                        }
                        margin="normal"
                        id="contract_end_date"
                        name="contract_end_date"
                        label="Contract End Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.contract_end_date
                            ? values.contract_end_date
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("contract_end_date", e)
                        }
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
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Multi Line</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="multiline"
                      onChange={handleToggleMultiline}
                      value={RadioToggleMultiline}
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
                {RadioToggleMultiline === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      type="number"
                      error={
                        errors.Multiline_PhoneNumber && touched.Multiline_PhoneNumber ? true : false
                      }
                      name="Multiline_PhoneNumber"
                      label="Phone Number"
                      value={values.Multiline_PhoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="Multiline_PhoneNumber-error"
                      className="WidhtFull100"
                    />
                    {errors.Multiline_PhoneNumber && touched.Multiline_PhoneNumber && (
                      <FormHelperText
                        className="errormsg"
                        id="Multiline_PhoneNumber-error"
                      >
                        {errors.Multiline_PhoneNumber}
                      </FormHelperText>
                    )}
                  </Grid>
                }
                {RadioToggleMultiline === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      type="number"
                      error={
                        errors.multilineCost && touched.multilineCost ? true : false
                      }
                      name="multilineCost"
                      label="Cost For Multi Line"
                      value={values.multilineCost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="multilineCost-error"
                      className="WidhtFull100"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            £
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors.multilineCost && touched.multilineCost && (
                      <FormHelperText
                        className="errormsg"
                        id="multilineCost-error"
                      >
                        {errors.multilineCost}
                      </FormHelperText>
                    )}
                  </Grid>
                }
              </Grid>

              <Grid container spacing={3}>
                {RadioToggleMultiline === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Extra on Multi Line</FormLabel>
                      <RadioGroup
                        row
                        aria-label="position"
                        name="extraMultiLine"
                        onChange={handleToggleMultilineExtra}
                        value={RadioToggleMultilineExtra}
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
                }
                {RadioToggleMultilineExtra === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <Select
                      className={
                        errors.divertsCost && touched.divertsCost
                          ? "ErrorColor"
                          : ""
                      }
                      isClearable={true}
                      id="divertsCost"
                      variant="outlined"
                      name="divertsCost"
                      placeholder="Type of Extras"
                      value={values.divertsCost}
                      onChange={(e) => {
                        setFieldValue("divertsCost", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="role-number-error"
                      options={DivertsCostOptions}
                    />
                    {errors.divertsCost && touched.divertsCost && (
                      <FormHelperText
                        className="errormsg"
                        id="divertsCost-error"
                      >
                        {errors.divertsCost}
                      </FormHelperText>
                    )}
                  </Grid>
                }
                {RadioToggleMultilineExtra === "Yes" &&
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      type="number"
                      error={
                        errors.costOfExtras && touched.costOfExtras ? true : false
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            £
                          </InputAdornment>
                        ),
                      }}
                      name="costOfExtras"
                      label="Cost of Extras"
                      value={values.costOfExtras}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="costOfExtras-error"
                      className="WidhtFull100"
                    />
                    {errors.costOfExtras && touched.costOfExtras && (
                      <FormHelperText
                        className="errormsg"
                        id="costOfExtras-error"
                      >
                        {errors.costOfExtras}
                      </FormHelperText>
                    )}
                  </Grid>
                }
              </Grid>

              <Grid container spacing={3} style={{ marginTop: 15 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    type="number"
                    error={
                      errors.overall_customer_cost && touched.overall_customer_cost ? true : false
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          £
                        </InputAdornment>
                      ),
                    }}
                    name="overall_customer_cost"
                    label="Overall Cost to Customer"
                    value={values.overall_customer_cost}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="overall_customer_cost-error"
                    className="WidhtFull100"
                  />
                  {errors.overall_customer_cost && touched.overall_customer_cost && (
                    <FormHelperText
                      className="errormsg"
                      id="overall_customer_cost-error"
                    >
                      {errors.overall_customer_cost}
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
    </div >
  );
};