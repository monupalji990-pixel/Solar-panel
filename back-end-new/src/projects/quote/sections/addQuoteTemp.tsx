/* eslint-disable no-unneeded-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */

import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { SearchLength } from "../../../sharedUtils/globalHelper/constantValues";
import * as Yup from "yup";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectGlobalConfig } from "sharedUtils/sharedRedux/configuration";
import { ServiceContainer } from "./ServiceContainer";
import { subServiceMapperObject } from "../../../sharedUtils/globalHelper/constantValues";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "20px",
    marginBottom: "20px",
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
      open={props.open == "addQuoteTempDrawer"}
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
  const [selectedSite, setSelectedSite] = useState("");
  const [SiteList, setSiteList] = useState([]);
  const [IntroducerList, setIntroducerList] = useState([]);
  const [QIntroducerID, setQIntroducerID] = useState("");
  const [SingleLeadData, setSingleLeadData] = useState(null);
  const [RadioToggle, setRadioToggle] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("gas");
  const [IsCreatedFromParams, setIsCreatedFromParams] = useState(false);
  const [ConsumerData, setConsumerData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isModifyData, setIsModifyData] = useState(false);
  const [isModifyLeadData, setIsModifyLeadData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const globalConfigState = useSelector(selectGlobalConfig);
  const consumersDrop = globalConfigState.consumersDrop;
  const selectedLead = globalConfigState.selectedLead;

  const currentProps = props;
  const classes = useStyles();

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
      //   props.toast(props.message);
    }
  }, [props.hideSideBar]);
  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };
  interface ErrorObj {
    Test?: string;
    Company?: string;
    Consumer?: string;
    Site?: string;
    Contact?: string;
    Lead?: string;
  }
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

  let companyList = [];
  let consumerList = [];
  let leadList = [];
  let SitesOptions = [];
  let IntroducerOptions = [];

  if (props.companies)
    companyList = props.companies.map((e) => ({
      label: e.businessName,
      value: e._id,
    }));
  if (consumersDrop)
    consumerList = consumersDrop.map((e) => ({
      label: `${e.firstName} ${e.surName}`,
      value: e._id,
    }));
  if (props.leads)
    leadList = props.leads.map((e) => ({
      label: `${e.leadId} - ${e.Company ? "Company" : "Consumer"}`,
      value: e._id,
    }));
  if (SiteList && SiteList.length > 0)
    SitesOptions = SiteList.map((v) => ({ label: v.siteName, value: v._id }));

  if (IntroducerList && IntroducerList.length > 0)
    IntroducerOptions = IntroducerList.map((v) => ({
      label: v.name,
      value: v._id,
      email: v.email,
      mobile: v.mobile,
    }));

  const OnChangeCompany = (e: any) => {
    if (e) {
      setQCompanyID(e.value);

      if (CurrentErrors && CurrentErrors.Company) {
        delete CurrentErrors.Company;
      }
      if (CurrentErrors && CurrentErrors.Test) {
        delete CurrentErrors.Test;
      }

      setIsModifyData(true);

      props.companies.filter((c) => {
        if (e.value === c._id) {
          setSiteList(c.Site);
          setSelectedCompany(c);
        }
      });
    }
  };

  const onChangeConsumer = (consumer) => {
    const { consumersDrop } = props;
    if (consumer) {
      if (!Array.isArray(consumer)) {
        const SingleConsumer = consumersDrop.filter(
          (v) => v._id == consumer.value
        );
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

  const OnChangeLead = (lead) => {
    if (lead) {
      if (!Array.isArray(lead)) {
        setIsModifyLeadData(true);
        props._singleLeadDetailWithSite({ leadId: lead.value });
        if (CurrentErrors && CurrentErrors.Lead) {
          delete CurrentErrors.Lead;
        }
        if (CurrentErrors && CurrentErrors.Test) {
          delete CurrentErrors.Test;
        }
      }
    }
  };

  if (
    props.selectedCompanyWithSite !== undefined &&
    props.selectedCompanyWithSite &&
    Object.keys(props.selectedCompanyWithSite).length > 0 &&
    isModifyData
  ) {
    if (
      props.selectedCompanyWithSite &&
      props.selectedCompanyWithSite[0].Site
    ) {
      setSiteList(props.selectedCompanyWithSite[0].Site);
    }
    setIsModifyData(false);
  }

  if (
    selectedLead !== undefined &&
    selectedLead &&
    Object.keys(selectedLead).length > 0 &&
    isModifyLeadData
  ) {
    const SingleLead = selectedLead;
    if (
      SingleLead.Site !== undefined &&
      SingleLead.Site &&
      SingleLead.Site.postcode !== undefined &&
      SingleLead.Site.postcode
    ) {
      setSitePostcode(SingleLead.Site.postcode);
    } else {
      setSitePostcode("");
    }
    if (selectedLead && selectedLead.Site) {
      setSiteList(props.leads.Site);
    }
    setSingleLeadData(SingleLead);
    if (RadioToggle === "lead") setCurrentErrors(null);
    setIsModifyLeadData(false);
  }

  const onChangeSite = (e) => {
    if (e) {
      setQSiteID(e.value);
      const sites = SiteList.filter((v) => v._id == e.value);
      if (sites[0]) {
        if (CurrentErrors && CurrentErrors.Site) {
          delete CurrentErrors.Site;
        }
        setIntroducerList(sites[0].User);
        setSitePostcode(sites[0].postcode);
        setSelectedSite(sites[0])
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
      if (CurrentErrors && CurrentErrors.Contact) {
        delete CurrentErrors.Contact;
      }
      setQIntroducerID(e.value);
    }
    if (e === undefined || e === null) {
      setQIntroducerID("");
    }
  };

  const getLeadCompanySiteInfo = () => {
    const DataObject: any = {};
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

    if (RadioToggle === "company") {
      DataObject.Company = QCompanyID;
      DataObject.Site = QSiteID;
      DataObject.User = [QIntroducerID];
    }

    if (RadioToggle === "consumer") {
      DataObject.Consumer = ConsumerData._id;
      if (ConsumerData.User !== undefined && ConsumerData.User)
        DataObject.User = [ConsumerData.Contact];
    }
    return DataObject;
  };

  const CreateQuote = (data) => {
    props._addQuote({ quoteData: data });
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
    DataObject.Invoiced = "";
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

  const searchInData = (event, action) => {
    console.log("Event-Action", event, action);

    if (event) setCurrentSearchText(event);
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (event.length >= SearchLength) {
      if (action === "lead")
        props._leadListForDropdown({
          searchText: event,
          limit: props.leads.length + 10,
        });
      if (action === "company")
        props._companyListForDropdown({
          searchText: event,
          limit: props.companies.length + 10,
        });
      if (action === "consumer")
        props._consumerDropList({
          searchText: event,
          limit: consumersDrop.length + 10,
        });
    }
  };

  const lazyLoadAPI = (event, action) => {
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (action === "lead" && props.leads.length <= 50)
      props._leadListForDropdown({
        searchText: CurrentSearchText,
        limit: props.leads.length + 10,
      });
    if (action === "company" && props.companies.length <= 50)
      props._companyListForDropdown({
        searchText: CurrentSearchText,
        limit: props.companies.length + 10,
      });
    if (action === "consumer" && consumersDrop.length <= 50)
      props._consumerDropList({
        searchText: CurrentSearchText,
        limit: consumersDrop.length + 10,
      });
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );


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
              initialValues={{
                LeadID: null,
                otherData: null,
              }}
              onSubmit={(value) => {
                //  props._addUser(values);
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
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                  setFieldValue,
                  submitForm,
                  validateForm,
                } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Select
                          className={
                            errors && errors.LeadID ? "ErrorColor" : ""
                          }
                          name="LeadID"
                          placeholder="Search Lead"
                          value={values.LeadID}
                          onChange={(e) => {
                            OnChangeLead(e);
                            setFieldValue("LeadID", e);
                          }}
                          onBlur={handleBlur}
                          isLoading={isLoadingData}
                          onInputChange={(e) => {
                            setIsLoadingData(true);
                            debounceOnChange(e, "lead");
                          }}
                          onMenuScrollToBottom={(e) => {
                            const isCallNewOne =
                              currentProps.leads.length % 10 === 0;
                            if (isCallNewOne) {
                              setIsLoadingData(true);
                              lazyLoadAPI(e, "lead");
                            }
                          }}
                          components={{
                            LoadingIndicator() {
                              return <CircularProgress />;
                            },
                          }}
                          options={leadList}
                        />

                        <FormHelperText
                          className="errormsg"
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
                      handleBlur={handleBlur}
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
                //    props._addUser(values);
              }}
              validationSchema={Yup.object().shape({
                CompanyID: Yup.object()
                  .required("Company is required")
                  .nullable(),
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
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                  setFieldValue,
                  submitForm,
                  validateForm,
                } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={4} sm={12} xs={12}>
                        {!IsCreatedFromParams && (
                          <Select
                            className={
                              errors && errors.CompanyID ? "ErrorColor" : ""
                            }
                            id="CompanyID"
                            name="CompanyID"
                            placeholder="Search Company"
                            value={values.CompanyID}
                            onChange={(e) => {
                              OnChangeCompany(e);
                              setFieldValue("CompanyID", e);
                            }}
                            onBlur={handleBlur}
                            isLoading={isLoadingData}
                            onInputChange={(e) => {
                              setIsLoadingData(true);
                              debounceOnChange(e, "company");
                              setFieldValue("Site", "");
                              setFieldValue("Contact", "");
                            }}
                            onMenuScrollToBottom={(e) => {
                              const isCallNewOne =
                                currentProps.companies.length % 10 === 0;
                              if (isCallNewOne) {
                                setIsLoadingData(true);
                                lazyLoadAPI(e, "company");
                              }
                            }}
                            components={{
                              LoadingIndicator() {
                                return <CircularProgress />;
                              },
                            }}
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
                      selectedCompany={selectedCompany}
                      SitePostcode={SitePostcode}
                      CurrentErrors={CurrentErrors}
                      checkParentValidation={checkParentValidation}
                      email={email}
                      contact={contact}
                      IntroducerList={IntroducerList}
                      selectedSite={selectedSite}
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
              initialValues={{ Consumer: null, otherData: null }}
              onSubmit={(value) => {
                GetServiceData(
                  value.otherData.obj,
                  value.otherData.sid,
                  value.otherData.service,
                  value.otherData.serviceType
                );
              }}
              validationSchema={Yup.object().shape({
                Consumer: Yup.object()
                  .required("Consumer is required")
                  .nullable(),
              })}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  isSubmitting,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  submitForm,
                  validateForm,
                } = props;

                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3} className={classes.Spacing}>
                      <Grid item md={6} sm={12} xs={12}>
                        {!IsCreatedFromParams && (
                          <Select
                            className={
                              errors && errors.Consumer ? "ErrorColor" : ""
                            }
                            id="Consumer"
                            name="Consumer"
                            placeholder="Search Consumer"
                            value={values.Consumer}
                            onChange={(e) => {
                              onChangeConsumer(e);
                              setFieldValue("Consumer", e);
                            }}
                            onBlur={handleBlur}
                            isLoading={isLoadingData}
                            onInputChange={(e) => {
                              setIsLoadingData(true);
                              debounceOnChange(e, "consumer");
                            }}
                            onMenuScrollToBottom={(e) => {
                              const isCallNewOne =
                                consumersDrop.length % 10 === 0;
                              if (isCallNewOne) {
                                setIsLoadingData(true);
                                lazyLoadAPI(e, "consumer");
                              }
                            }}
                            components={{
                              LoadingIndicator() {
                                return <CircularProgress />;
                              },
                            }}
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
                      submitForm={submitForm}
                      setFieldValue={setFieldValue}
                      SitePostcode={SitePostcode}
                      ConsumerData={ConsumerData}
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
