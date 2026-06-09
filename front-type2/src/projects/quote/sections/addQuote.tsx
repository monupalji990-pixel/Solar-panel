import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { ServiceContainer } from "./ServiceContainer";
import { CircularProgress, FormHelperText } from "@material-ui/core";
import * as Yup from "yup";
import { subServiceMapperObject } from "../../../sharedUtils/globalHelper/constantValues";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
}));

export default function AddQuote(props) {
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewConsumer"].includes(props.showingFrom)
      ? "1100px"
      : "1250px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Quote"
      open={props.open == "addQuoteDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddQuoteLogic {...props} />
    </MyDrawer>
  );
}

function AddQuoteLogic(props) {
  useEffect(() => {
    props._supplierListForDropdown();
  }, []);

  const [QCompanyID, setQCompanyID] = useState("");
  const [QSiteID, setQSiteID] = useState("");
  const [SitePostcode, setSitePostcode] = useState("");
  const [SiteList, setSiteList] = useState([]);
  const [IntroducerList, setIntroducerList] = useState([]);
  const [QIntroducerID, setQIntroducerID] = useState("");
  const [SingleLeadData, setSingleLeadData] = useState(null);
  const [RadioToggle, setRadioToggle] = useState("lead");
  const [selectedTab, setSelectedTab] = React.useState("gas");
  const [IsCreatedFromParams, setIsCreatedFromParams] = useState(false);
  const [CompanyData, setCompanyData] = useState(null);
  const [ConsumerData, setConsumerData] = useState(null);
  const [CurrentErrors, setCurrentErrors] = useState<any>({
    Test: "Test",
    Company: null,
    Consumer: null,
    Site: null,
    Contact: null,
    Lead: null,
  });
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  const checkParentValidation = () => {
    const cp: any = {};
    if (RadioToggle === "lead" && SingleLeadData === "") {
      cp.Lead = "Lead is required";
      setCurrentErrors(cp);
    } else if (
      RadioToggle === "consumer" &&
      Object.keys(ConsumerData).length <= 0
    ) {
      cp.Consumer = "Consumer is required";
      setCurrentErrors(cp);
    } else if (RadioToggle === "company") {
      if (QCompanyID === "") cp.Company = "Company is required";
      if (QSiteID === "") cp.Site = "Site is required";
      if (QIntroducerID === "") cp.Contact = "Contact is required";
      setCurrentErrors(cp);
    } else {
      setCurrentErrors(null);
    }
  };

  const currentProps = props;
  let companyList = [];
  if (props.companies) {
    companyList = props.companies.map((e) => ({
      label: e.businessName,
      value: e._id,
    }));
  }

  let leadList = [];
  if (props.leads) {
    leadList = props.leads.map((e) => ({
      label: `${e.leadId} - ${e.Company ? "Company" : "Consumer"}`,
      value: e._id,
    }));
  }

  let SitesOptions = [];
  let IntroducerOptions = [];
  if (SiteList && SiteList.length > 0) {
    SitesOptions = SiteList.map((v) => ({ label: v.siteName, value: v._id }));
  }

  if (IntroducerList && IntroducerList.length > 0) {
    IntroducerOptions = IntroducerList.map((v) => ({
      label: v.name,
      value: v._id,
      email: v.email,
      mobile: v.mobile,
    }));
  }

  const OnChangeCompany = (e) => {
    const { companies } = props;
    if (e) {
      console.log("in if");
      setQCompanyID(e.value);
      if (CurrentErrors && CurrentErrors.Company) {
        delete CurrentErrors.Company;
      }
      if (CurrentErrors && CurrentErrors.Test) {
        delete CurrentErrors.Test;
      }

      const company = companies.filter((v) => v._id == e.value);
      if (company[0]) {
        setSiteList(company[0].Site);
      }
    }
  };

  const onChangeSite = (e) => {
    if (e) {
      setQSiteID(e.value);
      const sites = SiteList.filter((v) => v._id == e.value);
      if (sites[0]) {
        setIntroducerList(sites[0].User);
        setSitePostcode(sites[0].postcode);
      }
    }

    if (e === undefined || e === null) {
      setQSiteID("");
      setIntroducerList([]);
      setSitePostcode("");
    }
  };

  const onChangeIntroducer = (e) => {
    if (e) {
      setQIntroducerID(e.value);
    }
    if (e === undefined || e === null) {
      setQIntroducerID("");
    }
  };

  const onChangeConsumer = (lead) => {
    const { consumers } = props;
    if (lead) {
      if (!Array.isArray(lead)) {
        const SingleConsumer = consumers.filter((v) => v._id == lead.value);
        setConsumerData(SingleConsumer[0]);
        setSitePostcode(SingleConsumer[0].postcode);
        if (CurrentErrors && CurrentErrors.Consumer) {
          delete CurrentErrors.Consumer;
        }
        if (CurrentErrors && CurrentErrors.Test) {
          delete CurrentErrors.Test;
        }
      }
    }
  };

  const getLeadCompanySiteInfo = () => {
    const DataObject: any = {};
    if (RadioToggle === "lead") {
      if (RadioToggle === "lead") {
        if (SingleLeadData.Company) {
          DataObject.Company = SingleLeadData.Company;
          if (SingleLeadData.Site !== undefined) {
            DataObject.Site = SingleLeadData.Site;
          }
          if (SingleLeadData.Contact !== undefined) {
            DataObject.User = [SingleLeadData.Contact];
          }
        } else {
          DataObject.Consumer = SingleLeadData.Consumer;
        }
      }
    }

    if (RadioToggle === "company") {
      DataObject.Company = QCompanyID;
      DataObject.Site = [QSiteID];
      DataObject.User = [QIntroducerID];
    }

    if (RadioToggle === "consumer") {
      DataObject.Consumer = ConsumerData._id;
      if (ConsumerData.User !== undefined && ConsumerData.User)
        DataObject.User = [ConsumerData.Contact];
    }
    return DataObject;
  };

  const OnChangeLead = (lead) => {
    const { leads } = props;
    if (lead) {
      if (!Array.isArray(lead)) {
        const SingleLead = leads.filter((v) => v.leadId == lead.label);
        if (
          SingleLead[0].Site !== undefined &&
          SingleLead[0].Site &&
          SingleLead[0].Site.postcode !== undefined &&
          SingleLead[0].Site.postcode
        ) {
          setSitePostcode(SingleLead[0].Site.postcode);
        } else {
          setSitePostcode("");
        }
        setSingleLeadData(SingleLead[0]);
        if (CurrentErrors && CurrentErrors.Lead) {
          delete CurrentErrors.Lead;
        }
        if (CurrentErrors && CurrentErrors.Test) {
          delete CurrentErrors.Test;
        }
      }
    }
  };

  const GetServiceData = (obj, sid, service, serviceType) => {
    let DataObject: any = {
      service: {},
    };
    const DataOB = getLeadCompanySiteInfo();
    DataObject = DataOB;
    DataObject.service = {
      [service]: {},
    };
    DataObject.service[service] = obj;
    if (sid) DataObject.Supplier = sid;
    DataObject.serviceType = serviceType;
    // DataObject.Invoiced = ''
    DataObject.isActive = 1;

    if (serviceType=="Eco") {
      let selectedSer = DataObject.service.eco.subservice
      let x = []
      Object.keys(selectedSer).forEach((ele) => {
        x.push(subServiceMapperObject[ele])
      })
      DataObject.subServiceType = x
    }

    CreateQuote(DataObject);
  };

  const CreateQuote = (data) => {
    props._addQuote({ quoteData: data });
  };

  if (props.isCreatedFrom && !IsCreatedFromParams) {
    setIsCreatedFromParams(true);
    if (props.isCreatedFrom === "Company") {
      setCompanyData(props.currentCompany);
      setQCompanyID(props.currentCompany._id);
      if (
        props.currentCompany !== undefined &&
        props.currentCompany &&
        props.currentCompany.Site
      ) {
        setSiteList(props.currentCompany.Site);
      }
      setRadioToggle("company");
    }
  }

  let consumerList = [];

  if (props.isCreatedFrom && !IsCreatedFromParams) {
    setIsCreatedFromParams(true);
    if (props.isCreatedFrom === "Consumer") {
      setConsumerData(props.currentConsumer);
      setSitePostcode(props.currentConsumer.postcode);
      setRadioToggle("consumer");
    }
  } else {
    if (props.consumers) {
      consumerList = props.consumers.map((e) => ({
        label: `${e.firstName} ${e.surName}`,
        value: e._id,
      }));
    }
  }

  return (
    <div className="app">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">Create Quote from</FormLabel>
                <RadioGroup
                  row
                  aria-label="billdate"
                  name="billdatetype"
                  value={RadioToggle}
                  onChange={(event) =>
                    IsCreatedFromParams ? null : handleRadio(event)
                  }
                >
                  <FormControlLabel
                    value="lead"
                    control={
                      <Radio color="primary" disabled={IsCreatedFromParams} />
                    }
                    label="Create From Lead"
                  />
                  <FormControlLabel
                    value="company"
                    control={
                      <Radio color="primary" disabled={IsCreatedFromParams} />
                    }
                    label="Create From Company"
                  />
                  <FormControlLabel
                    value="consumer"
                    control={
                      <Radio color="primary" disabled={IsCreatedFromParams} />
                    }
                    label="Create From Consumer"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {RadioToggle === "lead" && (
            <Formik
              initialValues={{ LeadID: null, otherData: null }}
              onSubmit={(value) => {
                GetServiceData(
                  value.otherData.obj,
                  value.otherData.sid,
                  value.otherData.service,
                  value.otherData.serviceType
                );
              }}
              validationSchema={Yup.object().shape({
                LeadID: Yup.object().required("lead is required").nullable(),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                  submitForm,
                  validateForm,
                } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Select
                          error={errors && errors.LeadID ? true : false}
                          id="LeadID"
                          name="LeadID"
                          className="WidhtFull100"
                          placeholder="Select Lead"
                          value={values.LeadID}
                          onChange={(e) => {
                            OnChangeLead(e);
                            setFieldValue("LeadID", e);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="role-number-error"
                          options={leadList}
                        />
                        <FormHelperText
                          className="errormsg"
                        // id="LeadID"
                        >
                          {errors.LeadID}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                    <ServiceContainer
                      {...currentProps}
                      RadioToggle={RadioToggle}
                      selectedTab={selectedTab}
                      submitForm={submitForm}
                      setFieldValue={setFieldValue}
                      SitePostcode={SitePostcode}
                      CurrentErrors={CurrentErrors}
                      checkParentValidation={checkParentValidation}
                      email={email}
                      contact={contact}
                      tabHandleChange={tabHandleChange}
                      validateForm={validateForm}
                    />
                    <Grid>{isSubmitting && <CircularProgress />}</Grid>
                  </form>
                );
              }}
            </Formik>
          )}

          {RadioToggle === "company" && (
            <Formik
              initialValues={{
                company: null,
                CompanyID: null,
                SiteID: null,
                IntroducerID: null,
                otherData: null,
              }}
              onSubmit={(value) => {
                GetServiceData(
                  value.otherData.obj,
                  value.otherData.sid,
                  value.otherData.service,
                  value.otherData.serviceType
                );
              }}
              validationSchema={Yup.object().shape({
                SiteID: Yup.object().required("Site is required").nullable(),
                IntroducerID: Yup.object()
                  .required("Contact is required")
                  .nullable(),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                  submitForm,
                  validateForm,
                } = props;
                if (
                  CompanyData &&
                  CompanyData.businessName !== undefined &&
                  CompanyData.businessName !== null &&
                  CompanyData.businessName
                ) {
                  // delete CurrentErrors.Test;
                }

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={4} sm={12} xs={12}>
                        {IsCreatedFromParams && (
                          <TextField
                            variant="outlined"
                            disabled
                            error={errors && errors.CompanyID ? true : false}
                            id="CompanyID"
                            name="CompanyID"
                            className="WidhtFull100"
                            label="CompanyID"
                            type="CompanyID"
                            value={CompanyData.businessName}
                            margin="normal"
                            aria-describedby="title-error"
                          />
                        )}
                        {!IsCreatedFromParams && (
                          <Select
                            className={
                              errors && errors.CompanyID ? "ErrorColor" : ""
                            }
                            id="CompanyID"
                            name="CompanyID"
                            placeholder="Select Company"
                            value={values.CompanyID}
                            onChange={(e) => {
                              OnChangeCompany(e);
                              setFieldValue("CompanyID", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={companyList}
                          />
                        )}
                        <FormHelperText className="errormsg" id="company-error">
                          {errors.CompanyID}
                        </FormHelperText>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <Select
                          className={
                            errors && errors.SiteID ? "ErrorColor" : ""
                          }
                          id="SiteID"
                          name="SiteID"
                          placeholder="Select Site"
                          value={values.SiteID}
                          onChange={(e) => {
                            onChangeSite(e);
                            setFieldValue("SiteID", e);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="role-number-error"
                          options={SitesOptions}
                        />

                        <FormHelperText
                          className="errormsg"
                          id="company-error-site"
                        >
                          {errors.SiteID}
                        </FormHelperText>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <Select
                          className={
                            errors && errors.IntroducerID ? "ErrorColor" : ""
                          }
                          id="IntroducerID"
                          name="IntroducerID"
                          placeholder="Select Contact"
                          value={values.IntroducerID}
                          onChange={(e) => {
                            onChangeIntroducer(e);
                            setFieldValue("IntroducerID", e);
                            setEmail(e.email);
                            if (e.mobile !== undefined) setContact(e.mobile);
                            else setContact(e.phone);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="role-number-error"
                          options={IntroducerOptions}
                        />
                        <FormHelperText
                          className="errormsg"
                          id="company-error-contact"
                        >
                          {errors.IntroducerID}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                    <ServiceContainer
                      {...currentProps}
                      RadioToggle={RadioToggle}
                      selectedTab={selectedTab}
                      submitForm={submitForm}
                      setFieldValue={setFieldValue}
                      SitePostcode={SitePostcode}
                      CurrentErrors={CurrentErrors}
                      checkParentValidation={checkParentValidation}
                      email={email}
                      contact={contact}
                      tabHandleChange={tabHandleChange}
                      validateForm={validateForm}
                    />
                    <Grid>{isSubmitting && <CircularProgress />}</Grid>
                  </form>
                );
              }}
            </Formik>
          )}

          {RadioToggle === "consumer" && (
            <Formik
              initialValues={{ Consumer: props.currentConsumer.firstName, otherData: null }}
              onSubmit={(value) => {
                GetServiceData(
                  value.otherData.obj,
                  value.otherData.sid,
                  value.otherData.service,
                  value.otherData.serviceType
                );
              }}

              validationSchema={Yup.object().shape({
                Consumer: Yup.string()
                  .required("consumer is required")
                  .nullable(),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                  submitForm,
                  validateForm,
                } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={6} sm={12} xs={12}>
                        {IsCreatedFromParams && (
                          <TextField
                            variant="outlined"
                            disabled
                            id="Consumer"
                            error={errors && errors.Consumer ? true : false}
                            name="Consumer"
                            label="Consumer"
                            className="WidhtFull100"
                            value={ConsumerData.firstName}
                            margin="normal"
                            aria-describedby="title-error"
                          />
                        )}
                        {!IsCreatedFromParams && (
                          <Select
                            error={errors && errors.Consumer ? true : false}
                            id="Consumer"
                            name="Consumer"
                            placeholder="Select Consumer"
                            value={values.Consumer}
                            onChange={(e) => {
                              onChangeConsumer(e);
                              setFieldValue("Consumer", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={consumerList}
                          />
                        )}
                        <FormHelperText
                          className="errormsg"
                          id="consumer-error"
                        >
                          {errors.Consumer}
                        </FormHelperText>
                      </Grid>
                    </Grid>
                    <ServiceContainer
                      {...currentProps}
                      RadioToggle={RadioToggle}
                      selectedTab={selectedTab}
                      //  GetServiceData={GetServiceData}
                      submitForm={submitForm}
                      setFieldValue={setFieldValue}
                      SitePostcode={SitePostcode}
                      CurrentErrors={CurrentErrors}
                      checkParentValidation={checkParentValidation}
                      email={email}
                      contact={contact}
                      tabHandleChange={tabHandleChange}
                      validateForm={validateForm}
                    />
                    <Grid>{isSubmitting && <CircularProgress />}</Grid>
                  </form>
                );
              }}
            </Formik>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
