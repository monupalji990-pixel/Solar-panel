import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  CompanyServiceTypes,
  ConsumerServiceTypes,
  leadOptions,
  SubServiceOptions,
  SearchLength,
  sourceOptions,
  leadTypes,
  consumerLeadTypes,
  ecoLeadStatus,
  paidSolarLeadStatus,
  B2BConsumerServices,
  B2BCompanyServices,
  LeadJobTypeOptions,
} from "../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "3px",
    marginBottom: "10px",
  },
  HeaderStyle: {
    position: "absolute",
    top: 10,
    display: "flex",
    justifyContent: "center",
    width: "81%",
    marginLeft: "6%",
    "@media(max-width:480px)": {
      width: "36%",
      top: "14px",
      right: 0,
    },
  },
}));

export default function AddLead(props) {
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewConsumer"].includes(props.showingFrom)
      ? "1100px"
      : "1250px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Lead"
      open={props.open == "addLeadDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddLeadLogic {...props} />
    </MyDrawer>
  );
}

function AddLeadLogic(props) {
  useEffect(() => {
    props._basicAction({ slug: props.slug });
  }, []);

  const validationSchema = Yup.object().shape({
    serviceType: Yup.string().nullable().required("Service is Required"),
    status: Yup.string().nullable().required("Status is Required"),
    leadType: Yup.string().nullable().required("Lead Type is Required"),
  });

  const currentProps = props;
  const classes = useStyles();
  const [siteList, setSiteList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [startLoader, setStartLoader] = useState(false);
  const [IsCreatedFromParams, setIsCreatedFromParams] = useState(false);
  const [CompanyData, setCompanyData] = useState(null);
  const [ConsumerData, setConsumerData] = useState(null);
  const [RadioToggle, setRadioToggle] = React.useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isModifyData, setIsModifyData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState('');
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    props._assigneeList();
    props._assigneeListInstaller({ role: '62b02a8fda27b400c8b8cf1e' });
    props._assigneeListSurveyor({ role: '62a8266b193c318de458db58' });
  }, []);

  const initialValues = {
    Company: null,
    Consumer: null,
    Contact: null,
    jobType: null,
    serviceType: null,
    subServiceType: null,
    actionDate: "",
    status: null,
    Site: null,
    notes: "",
    historyStatus: "",
    source: null,
    Assignee: null,
    LeadGenerator: null,
    SystemDesigner: null,
    Installer: null,
    salesRep: null,
    leadType: null,
  };

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  const handleChangeCompany = (e) => {
    const { companies } = props;
    if (e) {
      setIsModifyData(true);
      props._singleCompanyDetailWithSite({ companyID: e.value });
    }

    if (e) {
      if (!Array.isArray(e)) {
        const SingleCompany = companies.filter((v) => v._id == e.value);
        setCompanyData(SingleCompany[0]);
      }
    }
  };

  useEffect(() => {
    if (
      props.selectedCompanyWithSite !== undefined &&
      props.selectedCompanyWithSite &&
      Object.keys(props.selectedCompanyWithSite).length > 0 &&
      isModifyData
    ) {
      if (
        props.selectedCompanyWithSite &&
        props.selectedCompanyWithSite[0].Contact
      ) {
        const companyContactData = [];
        props.selectedCompanyWithSite[0].Contact.forEach((el) => {
          companyContactData.push({ label: el.name, value: el._id });
        });
        setContactList(companyContactData);
      }


      if (
        props.selectedCompanyWithSite &&
        props.selectedCompanyWithSite[0].Site
      ) {
        const companySiteData = [];
        props.selectedCompanyWithSite[0].Site.forEach((el) => {
          companySiteData.push({ label: el.siteName, value: el._id });
        });
        setSiteList(companySiteData);
      }
      setIsModifyData(false);
    }
  }, [props.selectedCompanyWithSite]);

  // if (
  //   props.selectedCompanyWithSite !== undefined &&
  //   props.selectedCompanyWithSite &&
  //   Object.keys(props.selectedCompanyWithSite).length > 0 &&
  //   isModifyData
  // ) {
  //   if (
  //     props.selectedCompanyWithSite &&
  //     props.selectedCompanyWithSite[0].Contact
  //   ) {
  //     const companyContactData = [];
  //     props.selectedCompanyWithSite[0].Contact.forEach((el) => {
  //       companyContactData.push({ label: el.name, value: el._id });
  //     });
  //     setContactList(companyContactData);
  //   }

  //   if (
  //     props.selectedCompanyWithSite &&
  //     props.selectedCompanyWithSite[0].Site
  //   ) {
  //     const companySiteData = [];
  //     props.selectedCompanyWithSite[0].Site.forEach((el) => {
  //       companySiteData.push({ label: el.siteName, value: el._id });
  //     });
  //     setSiteList(companySiteData);
  //   }
  //   setIsModifyData(false);
  // }

  let consumerList = [];

  if (props.isCreatedFrom && !IsCreatedFromParams) {
    setIsCreatedFromParams(true);
    if (props.isCreatedFrom === "Consumer") {
      setConsumerData(props.currentConsumer);
      setRadioToggle("1");
    }
  } else {
    if (props.consumersDrop)
      consumerList = props.consumersDrop.map((e) => ({
        label: `${e.firstName} ${e.surName}`,
        value: e._id,
      }));
  }

  let companyOptions = [];

  useEffect(() => { }, []);
  if (props.isCreatedFrom && !IsCreatedFromParams) {
    setIsCreatedFromParams(true);
    if (props.isCreatedFrom === "Company") {
      setCompanyData(props.currentCompany);
      setRadioToggle("2");
      if (
        props.currentCompany !== undefined &&
        props.currentCompany &&
        props.currentCompany.Contact
      ) {
        const companyContactData = [];
        props.currentCompany.Contact.forEach((ele) => {
          companyContactData.push({ label: ele.name, value: ele._id });
        });
        setContactList(companyContactData);
      }
      if (
        props.currentCompany !== undefined &&
        props.currentCompany &&
        props.currentCompany.Site
      ) {
        const companySiteData = [];
        props.currentCompany.Site.forEach((ele) => {
          companySiteData.push({ label: ele.siteName, value: ele._id });
        });
        setSiteList(companySiteData);
      }
    }
  } else {
    if (props.companies)
      companyOptions = props.companies.map((e) => ({
        label: e.businessName,
        value: e._id,
      }));
  }

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (event.length >= SearchLength) {
      if (action === "company")
        props._companyListForDropdown({ searchText: event, limit: 10 });
      if (action === "consumer")
        props._consumerDropList({ searchText: event, limit: 10 });
    }
  };

  const lazyLoadAPI = (event, action) => {
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (action === "company" && props.companies.length <= 50)
      props._companyListForDropdown({
        searchText: CurrentSearchText,
        limit: props.companies.length + 10,
      });
    if (action === "consumer" && props.consumersDrop.length <= 50)
      props._consumerDropList({
        searchText: CurrentSearchText,
        limit: props.consumersDrop.length + 10,
      });
  };
  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const onChangeConsumer = (consumer) => {
    const { consumersDrop } = props;
    if (consumer) {
      if (!Array.isArray(consumer)) {
        const SingleConsumer = consumersDrop.filter(
          (v) => v._id == consumer.value
        );
        setConsumerData(SingleConsumer[0]);
      }
    }
  };

  let DropServiceTypes = [];
  if (RadioToggle === "2") DropServiceTypes = CompanyServiceTypes;
  if (RadioToggle === "1") DropServiceTypes = ConsumerServiceTypes;

  let leadTypeOptions = RadioToggle === "1" ? consumerLeadTypes : leadTypes;

  let EcoSalesService = [
    {
      label: "Eco",
      value: "Eco",
    }
  ];

  useEffect(() => {
    switch (selectedLeadType) {
      case 'B2B Sales':
        if (RadioToggle === "1") {
          setServicesList(B2BConsumerServices);
        } else {
          setServicesList(B2BCompanyServices);
        }
        break;
      case 'Paid Solar':
        setServicesList([
          {
            label: "Paid Solar",
            value: "PaidSolar",
          },
        ]);
        break;
      case 'Eco':
        setServicesList(EcoSalesService);
        break;
      case 'Scaffolding':
      case 'Telecoms':
      case 'ASHP':
        setServicesList([
          {
            label: selectedLeadType,
            value: selectedLeadType,
          },
        ]);
        break;
      default:
        setServicesList([]);
        break;
    }
  }, [selectedLeadType]);

  let statusOptions = [];

  switch (selectedLeadType) {
    case 'B2B Sales':
      statusOptions = leadOptions;
      break;
    case 'Paid Solar':
      statusOptions = paidSolarLeadStatus;
      break;
    case 'Eco':
      statusOptions = ecoLeadStatus;
      break;
    default:
      statusOptions = leadOptions;
      break;
  }

  const getStatusOptions = (currentStatus) => {
    if (selectedLeadType !== 'Paid Solar') return statusOptions;

    const workflow = paidSolarLeadStatus.map((item) => item.value);
    const currentValue = currentStatus?.value || currentStatus || "";
    const currentIndex = workflow.indexOf(currentValue);

    return statusOptions.map((option) => {
      const optionIndex = workflow.indexOf(option.value);
      const disabled = currentIndex >= 0 ? optionIndex > currentIndex + 1 : false;
      return { ...option, isDisabled: disabled };
    });
  };

  let allPl = [];
  if (props.assigneeState.assigneeListForDropdown) {
    allPl = props.assigneeState.assigneeListForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  let allInstaller = [];
  if (props.assigneeState.assigneeListInstallerForDropdown) {
    allInstaller = props.assigneeState.assigneeListInstallerForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  let allSalesRep = [];
  if (props.assigneeState.assigneeListForDropdown) {
    allSalesRep = props.assigneeState.assigneeListForDropdown.filter((e) => {
      return e.role?.roleName === 'Sales Rep'
    })
  }

  let allSurveyor = [];
  if (props.assigneeState.assigneeListSurveyorForDropdown) {
    allSurveyor = props.assigneeState.assigneeListSurveyorForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  const fetchUsersList = (option) => {
    if (props.assigneeState.assigneeListForDropdown.length > 0) {
      let userList = props.assigneeState.assigneeListForDropdown
      switch (option) {
        case 'Scaffolders': {
          let sca = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              sca.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return sca;
        }
        case 'Roofers': {
          let roof = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              roof.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return roof;
        }
        case 'Electricians': {
          let elec = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              elec.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return elec;
        }
        case 'GasEngineers': {
          let gasEng = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              gasEng.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return gasEng;
        }
        case 'CavityWallInstaller': {
          let cwI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              cwI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return cwI;
        }
        case 'UnderFloorInstaller': {
          let ufI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              ufI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return ufI;
        }
        case 'LoftInstaller': {
          let LI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              LI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return LI;
        }
        case 'VentilationInstaller': {
          let VI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              VI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return VI;
        }
        case 'InternalWallInsulation': {
          let IWI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              IWI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return IWI;
        }
        case 'ExternalWallInsulation': {
          let EWI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              EWI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return EWI;
        }
        case 'RoomInRoofInstaller': {
          let RRI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              RRI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return RRI;
        }
        case 'ASHPInstaller': {
          let ASHPI = []
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              ASHPI.push({
                label: f.name,
                value: f._id
              })
            }
          })
          return ASHPI;
        }
      }
    }
  }

  return (
    <div className="app">
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={3} className={classes.Spacing}>
            <Grid item xs={12} md={12}>
              <Card>
                <CardContent>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Create Lead From</FormLabel>
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
                        value="2"
                        control={
                          <Radio
                            color="primary"
                            disabled={IsCreatedFromParams}
                          />
                        }
                        label="Create From Company"
                      />
                      <FormControlLabel
                        value="1"
                        control={
                          <Radio
                            color="primary"
                            disabled={IsCreatedFromParams}
                          />
                        }
                        label="Create From Consumer"
                      />
                    </RadioGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              const lo: any = {};
              if (
                (IsCreatedFromParams && props.isCreatedFrom === "Company") ||
                RadioToggle == "2"
              ) {
                lo.Company = CompanyData._id;
                delete lo.Consumer;
              } else if (
                (IsCreatedFromParams && props.isCreatedFrom === "Consumer") ||
                RadioToggle == "1"
              ) {
                lo.Consumer = ConsumerData._id;
                delete lo.Company;
              }
              if (RadioToggle == "2" && values.Company) {
                lo.Company = values.Company?.value;
              } else if (RadioToggle == "1" && values.Consumer) {
                lo.Consumer = values.Consumer?.value;
              }

              if (values.Contact) lo.Contact = values.Contact.value;
              if (values.Site) lo.Site = values.Site.value;
              lo.notes = values.notes;

              if (values.serviceType) {
                lo.serviceType = values.serviceType.map((v) => v.value);
              }

              if (RadioToggle == "2") {
                lo.subServiceType = ["Solar"];
              }

              if (values.jobType?.value) lo.jobType = values.jobType?.value

              if (RadioToggle == "1") {
                if (values.subServiceType) {
                  lo.subServiceType = values.subServiceType.map((v) => v.value);
                }
              }
              if (values.salesRep?.value) lo.salesRep = values.salesRep.value
              if (values.leadType) lo.leadType = values.leadType.value
              if (values.source) {
                lo.source = values.source.value;
              }
              if (values.Assignee) {
                lo.appoinmentBooker = values.Assignee.value;
              }
              if (values.LeadGenerator) {
                lo.LeadGenerator = values.LeadGenerator.value;
              }
              if (values.Installer) {
                lo.Installer = values.Installer.value;
              }
              if (values.SystemDesigner) {
                lo.SystemDesigner = values.SystemDesigner.value;
              }
              lo.status = values.status.value;
              lo.historyStatus = values.historyStatus;
              lo.actionDate = new Date(values.actionDate).getTime();

              setStartLoader(true);
              props._addLead(lo);
            }}
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
              } = props;

              return (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <div className={classes.HeaderStyle}>
                      <h1 style={{ fontSize: 22 }}> Add Lead </h1>
                    </div>
                  </Grid>

                  {RadioToggle === "1" && (
                    <Grid container className={classes.Spacing} spacing={5}>
                      <Grid item md={6} sm={12} xs={12}>
                        {IsCreatedFromParams && (
                          <TextField
                            variant="outlined"
                            disabled
                            error={
                              errors.Consumer && touched.Consumer ? true : false
                            }
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
                            error={
                              errors.Consumer && touched.Consumer ? true : false
                            }
                            id="Consumer"
                            name="Consumer"
                            placeholder="Search Consumer"
                            value={values.Consumer}
                            onChange={(e) => {
                              onChangeConsumer(e);
                              setFieldValue("Consumer", e);
                            }}
                            isLoading={isLoadingData}
                            onInputChange={(e) => {
                              setIsLoadingData(true);
                              debounceOnChange(e, "consumer");
                            }}
                            onMenuScrollToBottom={(e) => {
                              const isCallNewOne =
                                currentProps.consumersDrop.length % 10 === 0;
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
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={consumerList}
                          />
                        )}
                      </Grid>
                    </Grid>
                  )}
                  {RadioToggle === "2" && (
                    <Grid container className={classes.Spacing} spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        {IsCreatedFromParams && (
                          <TextField
                            variant="outlined"
                            disabled
                            error={
                              errors.Company && touched.Company ? true : false
                            }
                            id="Company"
                            name="Company"
                            className="WidhtFull100"
                            label="Company"
                            type="Company"
                            value={CompanyData.businessName}
                            margin="normal"
                            aria-describedby="title-error"
                          />
                        )}
                        {!IsCreatedFromParams && (
                          <React.Fragment>
                            <Select
                              className={
                                errors.Company && touched.Company
                                  ? "ErrorColor"
                                  : ""
                              }
                              id="Company"
                              placeholder="Search Company"
                              value={values.Company}
                              onChange={(e) => {
                                handleChangeCompany(e);
                                setFieldValue("Company", e);
                              }}
                              onBlur={handleBlur}
                              margin="normal"
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
                              aria-describedby="role-number-error"
                              name="colors"
                              options={companyOptions}
                            />

                            {errors.Company && touched.Company && (
                              <FormHelperText
                                className="errormsg"
                                id="Company-error"
                              >
                                {errors.Company}
                              </FormHelperText>
                            )}
                          </React.Fragment>
                        )}
                      </Grid>
                      <Grid item md={6} sm={12} xs={12}>
                        <Select
                          className={
                            errors.Site && touched.Site ? "ErrorColor" : ""
                          }
                          id="Site"
                          placeholder="Select Site"
                          value={values.Site}
                          onChange={(e) => {
                            setFieldValue("Site", e);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          name="colors"
                          options={siteList}
                        />
                        {errors.Site && touched.Site && (
                          <FormHelperText className="errormsg" id="Site-error">
                            {errors.Site}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Select
                          className={
                            errors.Contact && touched.Contact
                              ? "ErrorColor"
                              : ""
                          }
                          id="Contact"
                          placeholder="Select Contact"
                          value={values.Contact}
                          onChange={(e) => {
                            setFieldValue("Contact", e);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="Contact-number-error"
                          name="colors"
                          options={contactList}
                        />
                        {errors.Contact && touched.Contact && (
                          <FormHelperText
                            className="errormsg"
                            id="Contact-error"
                          >
                            {errors.Contact}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <Select
                        className={
                          errors.leadType && touched.leadType
                            ? "ErrorColor"
                            : ""
                        }
                        id="leadType"
                        placeholder="Select Lead Type"
                        value={values.leadType}
                        onChange={(e) => {
                          setFieldValue("leadType", e);
                          setSelectedLeadType(e.value);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="leadType-number-error"
                        name="colors"
                        options={leadTypeOptions}
                      />
                      {errors.leadType && touched.leadType && (
                        <FormHelperText
                          className="errormsg"
                          id="leadType-error"
                        >
                          {errors.leadType}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <Select
                        className={
                          errors.serviceType && touched.serviceType
                            ? "ErrorColor"
                            : ""
                        }
                        id="serviceType"
                        isMulti
                        placeholder="Select Services That Lead Might Be Interested"
                        value={values.serviceType}
                        onChange={(e) => {
                          setFieldValue("serviceType", e);
                          setSelectedSubServices(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="serviceType-number-error"
                        name="colors"
                        options={servicesList}
                      />
                      {errors.serviceType && touched.serviceType && (
                        <FormHelperText
                          className="errormsg"
                          id="serviceType-error"
                        >
                          {errors.serviceType}
                        </FormHelperText>
                      )}
                    </Grid>

                    {selectedSubServices && selectedSubServices.some((item) => item.label == "Eco") && (
                      <Grid item md={4} sm={12} xs={12}>
                        <Select
                          className={
                            errors.jobType && touched.jobType
                              ? "ErrorColor"
                              : ""
                          }
                          id="jobType"
                          placeholder="Select Job Type"
                          value={values.jobType}
                          onChange={(e) => {
                            setFieldValue("jobType", e);
                          }}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="jobType-number-error"
                          name="jobType"
                          options={LeadJobTypeOptions}
                        />
                        {errors.jobType && touched.jobType && (
                          <FormHelperText
                            className="errormsg"
                            id="jobType-error"
                          >
                            {errors.jobType}
                          </FormHelperText>
                        )}
                      </Grid>
                    )}

                    {RadioToggle === "2" &&
                      selectedSubServices && selectedSubServices.some((item) => item.label == "Eco") && (
                        <Grid item md={4} sm={12} xs={12}>
                          <Select
                            className={
                              errors.subServiceType && touched.subServiceType
                                ? "ErrorColor"
                                : ""
                            }
                            id="subServiceType"
                            isMulti
                            placeholder="Select Sub Services"
                            defaultValue={{
                              value: "Solar",
                              label: "COMMERCIAL SOLAR",
                            }}
                            isDisabled={true}
                            // value={values.subServiceType}
                            onChange={(e) => {
                              setFieldValue("subServiceType", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="subServiceType-number-error"
                            name="colors"
                            options={SubServiceOptions}
                          />
                          {errors.subServiceType && touched.subServiceType && (
                            <FormHelperText
                              className="errormsg"
                              id="subServiceType-error"
                            >
                              {errors.subServiceType}
                            </FormHelperText>
                          )}
                        </Grid>
                      )}

                    {RadioToggle === "1" &&
                      selectedSubServices.some((item) => item.label == "Eco") && (
                        <Grid item md={4} sm={12} xs={12}>
                          <Select
                            className={
                              errors.subServiceType && touched.subServiceType
                                ? "ErrorColor"
                                : ""
                            }
                            id="subServiceType"
                            isMulti
                            placeholder="Select Sub Services"
                            // defaultValue={{
                            //   value: "Solar",
                            //   label: "COMMERCIAL SOLAR"
                            // }}
                            value={values.subServiceType}
                            onChange={(e) => {
                              setFieldValue("subServiceType", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="subServiceType-number-error"
                            name="colors"
                            options={SubServiceOptions}
                          />
                          {errors.subServiceType && touched.subServiceType && (
                            <FormHelperText
                              className="errormsg"
                              id="subServiceType-error"
                            >
                              {errors.subServiceType}
                            </FormHelperText>
                          )}
                        </Grid>
                      )}
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={3} sm={12} xs={12}>
                      <Select
                        className={
                          errors.source && touched.source ? "ErrorColor" : ""
                        }
                        id="source"
                        placeholder="Source"
                        value={values.source}
                        onChange={(e) => {
                          setFieldValue("source", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="source-number-error"
                        name="colors"
                        options={sourceOptions}
                      />
                      {errors.source && touched.source && (
                        <FormHelperText className="errormsg" id="source-error">
                          {errors.source}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Select
                        className={
                          errors.Assignee && touched.Assignee
                            ? "ErrorColor"
                            : ""
                        }
                        id="Assignee"
                        placeholder="Select Appoinment Booker"
                        value={values.Assignee}
                        onChange={(e) => {
                          setFieldValue("Assignee", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="Assignee-number-error"
                        options={allPl}
                      />
                      {errors.Assignee && touched.Assignee && (
                        <FormHelperText
                          className="errormsg"
                          id="Assignee-error"
                        >
                          {errors.Assignee}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <Select
                        className={
                          errors.LeadGenerator && touched.LeadGenerator
                            ? "ErrorColor"
                            : ""
                        }
                        id="LeadGenerator"
                        placeholder="Select Lead Generator"
                        value={values.LeadGenerator}
                        onChange={(e) => {
                          setFieldValue("LeadGenerator", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="LeadGenerator-number-error"
                        options={allPl}
                      />
                      {errors.LeadGenerator && touched.LeadGenerator && (
                        <FormHelperText
                          className="errormsg"
                          id="LeadGenerator-error"
                        >
                          {errors.LeadGenerator}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>

                      {RadioToggle === "2" && (
                      <>
                        <Grid item md={3} sm={12} xs={12}>
                          <Select
                            className={
                              errors.salesRep && touched.salesRep ? "ErrorColor" : ""
                            }
                            id="salesRep"
                            placeholder="Select Sales Rep"
                            value={values.salesRep}
                            onChange={(e) => {
                              setFieldValue("salesRep", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="salesRep-number-error"
                            options={allSalesRep.map((x) => ({
                              label: x.name,
                              value: x._id,
                            }))}
                          />
                          {errors.salesRep && touched.salesRep && (
                            <FormHelperText className="errormsg" id="salesRep-error">
                              {errors.salesRep}
                            </FormHelperText>
                          )}
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <Select
                            className={
                              errors.SystemDesigner && touched.SystemDesigner ? "ErrorColor" : ""
                            }
                            id="SystemDesigner"
                            placeholder="Select System Designer"
                            value={values.SystemDesigner}
                            onChange={(e) => {
                              setFieldValue("SystemDesigner", e);
                            }}
                            onBlur={handleBlur}
                            margin="normal"
                            aria-describedby="SystemDesigner-number-error"
                            options={allPl}
                          />
                          {errors.SystemDesigner && touched.SystemDesigner && (
                            <FormHelperText className="errormsg" id="SystemDesigner-error">
                              {errors.SystemDesigner}
                            </FormHelperText>
                          )}
                        </Grid>
                      </>
                    )}

                    {/* <Grid item md={6} sm={12} xs={12}>
                      <Select
                        className={
                          errors.Installer && touched.Installer ? "ErrorColor" : ""
                        }
                        id="Installer"
                        placeholder="Select Installer"
                        value={values.Installer}
                        onChange={(e) => {
                          setFieldValue("Installer", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="Installer-number-error"
                        options={allInstaller}
                      />
                      {errors.Installer && touched.Installer && (
                        <FormHelperText className="errormsg" id="Installer-error">
                          {errors.Installer}
                        </FormHelperText>
                      )}
                    </Grid> */}
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} sm={12}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          clearable
                          variant="dialog"
                          inputVariant="outlined"
                          label="Lead Contacted On"
                          error={
                            errors.actionDate && touched.actionDate
                              ? true
                              : false
                          }
                          margin="normal"
                          id="actionDate"
                          className="WidhtFull100"
                          placeholder="Lead Contacted On"
                          allowKeyboardControl
                          format="dd/MM/yyyy"
                          value={values.actionDate ? values.actionDate : null}
                          onChange={(e) => setFieldValue("actionDate", e)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="actionDate-number-error"
                        />
                      </MuiPickersUtilsProvider>
                      {errors.actionDate && touched.actionDate && (
                        <FormHelperText
                          className="errormsg"
                          id="actionDate-error"
                        >
                          {errors.actionDate}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <Select
                        className={
                          errors.status && touched.status ? "ErrorColor" : ""
                        }
                        id="status"
                        placeholder="Status"
                        value={values.status}
                        onChange={(e) => {
                          setFieldValue("status", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="status-number-error"
                        name="colors"
                        options={getStatusOptions(values.status)}
                        isOptionDisabled={(option) => option.isDisabled}
                      />
                      {errors.status && touched.status && (
                        <FormHelperText className="errormsg" id="status-error">
                          {errors.status}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextField
                        variant="outlined"
                        error={errors.notes && touched.notes ? true : false}
                        id="notes"
                        className="WidhtFull100"
                        label="Lead Notes"
                        type="notes"
                        value={values.notes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        rows={4}
                        aria-describedby="notes-error"
                        multiline
                      />
                      {errors.notes && touched.notes && (
                        <FormHelperText className="errormsg" id="notes-error">
                          {errors.notes}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={handleReset}
                      disabled={!dirty || isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Add Lead
                    </Button>
                    {startLoader && <CircularProgress />}
                  </CardActions>
                </form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </div>
  );
}
