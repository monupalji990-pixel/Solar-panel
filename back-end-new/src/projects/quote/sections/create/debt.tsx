import React, { useState } from "react";
import { useSelector } from "react-redux";
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
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { selectLeadState } from "projects/lead/redux/lead";
import { DebtServiceTypes } from "../../../../sharedUtils/globalHelper/constantValues"

export default function Debt(props) {
  let leadServiceDataInit: any = null;
  const leadState = useSelector(selectLeadState);
  const { singleLead } = leadState
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [postcode, setPostcode] = useState("");

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Debt",
      "add"
    );
  }

  if (
    props.serviceDataFromLead &&
    Object.keys(props.serviceDataFromLead).length > 1
  ) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.fullName = leadServiceDataInit.full_name
    leadServiceDataInit.typeOfDebt = { label: leadServiceDataInit.typeOfDebt, value: leadServiceDataInit.typeOfDebt }
    leadServiceDataInit.businessName = leadServiceDataInit.businessName ? leadServiceDataInit.businessName : singleLead?.Company?.businessName
    leadServiceDataInit.businessAddress = leadServiceDataInit.businessAddress ? leadServiceDataInit.businessAddress : (singleLead.Company.firstLine + ", " + singleLead.Company.secondLine)
  }

  let initialValues: any = null

  if (props.type === "quote")
    initialValues = {
      fullName: '',
      address: '',
      dob: '',
      saveLeadData: false,
      businessName: '',
      businessAddress: '',
      typeOfDebt: '',
      postcode: props.SitePostcode,
    };

  else if ((singleLead.Consumer !== undefined || singleLead.Company !== undefined) && props.isFromLead)
    initialValues = {
      fullName: singleLead.Consumer ?
        singleLead.Consumer.firstName + singleLead.Consumer.surName
        : singleLead.Contact && singleLead.Contact.jobTitle && singleLead.Contact.jobTitle.toLowerCase() === "director" ?
        singleLead.Contact && singleLead.Contact.name : "",
      address: singleLead.Consumer ? singleLead.Consumer.addressOne + singleLead.Consumer.addressTwo
        : singleLead.Contact && singleLead.Contact.jobTitle && singleLead.Contact.jobTitle.toLowerCase() === "director" ? 
        singleLead.Contact && singleLead?.Contact?.homeAddress : "",
      dob: singleLead.Consumer ? singleLead.Consumer.DOB
        : singleLead.Contact && singleLead.Contact.jobTitle && singleLead.Contact.jobTitle.toLowerCase() === "director" ? 
        singleLead.Contact && singleLead.Contact.DOB : "",
      saveLeadData: false,
      businessName: singleLead?.Company ? singleLead?.Company?.businessName : "",
      businessAddress: singleLead.Company ? (singleLead.Company.firstLine + ", " + singleLead.Company.secondLine) : "",
      typeOfDebt: '',
      postcode: props.SitePostcode,
    };
  else
    initialValues = {
      fullName: '',
      address: '',
      dob: '',
      saveLeadData: false,
      businessName: '',
      businessAddress: '',
      typeOfDebt: '',
      postcode: props.SitePostcode,
    };

  let validationSchema: any = null;

  if (props.RadioToggle === "company" && (singleLead.Company !== undefined
    && ["Sole trader", "Limited company"].includes(singleLead.Company && singleLead.Company?.businessType))) {
    validationSchema = Yup.object().shape({
      typeOfDebt: Yup.string().required('Please select the Type of Debt'),
      businessAddress: Yup.string().required('Business Address is required'),
      businessName: Yup.string().required('Business Name is required'),
      fullName: Yup.string().required('Full Name is required'),
      dob: Yup.string().required('DOB is required'),
      address: Yup.string().required('Address is required'),
    })
  }
  else if (props.RadioToggle === "company" || singleLead.Company !== undefined) {
    validationSchema = Yup.object().shape({
      typeOfDebt: Yup.string().required('Please select the Type of Debt'),
      fullName: Yup.string().required('Full Name is required'),
      dob: Yup.string().required('DOB is required'),
      address: Yup.string().required('Address is required'),
    })
  } else {
    validationSchema = Yup.object().shape({
      typeOfDebt: Yup.string().required('Please select the Type of Debt'),
      fullName: Yup.string().required('Full Name is required'),
      dob: Yup.string().required('DOB is required'),
      address: Yup.string().required('Address is required'),
    })
  }

  return (
    <div className="app">
      <Formik
        enableReinitialize
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : initialValues}
        onSubmit={
          (value) => {
            const qu: any = {};
            if (value.typeOfDebt) qu.typeOfDebt = value.typeOfDebt.value;
            if (value.fullName) qu.full_name = value.fullName;
            if (value.dob) qu.dob = value.dob;
            if (value.address) qu.address = value.address;
            if (["Sole trader", "Limited company"].includes(singleLead.Company && singleLead.Company?.businessType)) {
              qu.businessName = value.businessName;
              qu.businessAddress = value.businessAddress;
              qu.postcode = props.SitePostcode;
            }

            if (value.saveLeadData) {
              // qu.SupplerID = SupplerID;
              currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { debt: qu }, service: 'debt' });
            } else {
              if (currentProps.isFromLead) {
                currentProps.setFieldValue('otherdata', {
                  debt: qu,
                })
                currentProps.submitForm();
              } else {
                props.GetServiceData(qu);
              }
            }
          }
        }
        validationSchema={validationSchema}
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
                  <TextField
                    variant="outlined"
                    name="fullName"
                    label="Full Name"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="fullName-error"
                    className="WidhtFull100"
                  />
                  {errors.fullName && (
                    <FormHelperText className="errormsg" id="fullName-error">
                      {errors.fullName}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="dob"
                        name="dob"
                        label="Date of Birth"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        disableFuture
                        value={
                          values.dob
                            ? values.dob
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("dob", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="dob-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.dob && (
                    <FormHelperText
                      className="errormsg"
                      id="dob-error"
                    >
                      {errors.dob}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="address-error"
                    className="WidhtFull100"
                  />
                  {errors.address && (
                    <FormHelperText className="errormsg" id="address-error">
                      {errors.address}
                    </FormHelperText>
                  )}
                </Grid>

                {currentProps.RadioToggle === "company"
                  && (currentProps?.selectedCompany && ["Sole trader", "Limited company"].includes(currentProps?.selectedCompany?.businessType)) &&
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.postcode ? true : false
                        }
                        name="postcode"
                        id="postcode"
                        label="Postcode"
                        value={postcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="postcode-error"
                        className="WidhtFull100"
                      />
                      {errors.postcode && (
                        <FormHelperText className="errormsg" id="postcode-error">
                          {errors.postcode}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="businessName"
                        label="Business Name"
                        value={values.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessName-error"
                        className="WidhtFull100"
                      />
                      {errors.businessName && (
                        <FormHelperText className="errormsg" id="businessName-error">
                          {errors.businessName}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="businessAddress"
                        label="Business Address"
                        value={values.businessAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessAddress-error"
                        className="WidhtFull100"
                      />
                      {errors.businessAddress && (
                        <FormHelperText className="errormsg" id="businessAddress-error">
                          {errors.businessAddress}
                        </FormHelperText>
                      )}
                    </Grid>
                  </>
                }

                {currentProps.isFromLead &&
                  (singleLead.Company !== undefined && ["Sole trader", "Limited company"].includes(singleLead.Company.businessType)) &&
                  <>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.postcode ? true : false
                        }
                        name="postcode"
                        id="postcode"
                        label="Postcode"
                        value={postcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="postcode-error"
                        className="WidhtFull100"
                      />
                      {errors.postcode && (
                        <FormHelperText className="errormsg" id="postcode-error">
                          {errors.postcode}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="businessName"
                        label="Business Name"
                        value={values.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessName-error"
                        className="WidhtFull100"
                      />
                      {errors.businessName && (
                        <FormHelperText className="errormsg" id="businessName-error">
                          {errors.businessName}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="businessAddress"
                        label="Business Address"
                        value={values.businessAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessAddress-error"
                        className="WidhtFull100"
                      />
                      {errors.businessAddress && (
                        <FormHelperText className="errormsg" id="businessAddress-error">
                          {errors.businessAddress}
                        </FormHelperText>
                      )}
                    </Grid>
                  </>
                }
                <Grid item xs={12} md={4}>
                  <Select
                    id="typeOfDebt"
                    name="typeOfDebt"
                    placeholder="Types of Debt"
                    label="Types of Debt"
                    value={values.typeOfDebt}
                    onChange={(e) => {
                      setFieldValue("typeOfDebt", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={DebtServiceTypes}
                  />
                  {errors.typeOfDebt && (
                    <FormHelperText
                      className="errormsg"
                      id="typeOfDebt-error"
                    >
                      {errors.typeOfDebt}
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