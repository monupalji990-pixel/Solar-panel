import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import { useDispatch, useSelector } from "react-redux";
import {
  InstallerTypeOptions,
  LeadJobTypeOptions,
  leadOptions,
  leadTypes,
  sourceOptions,
} from "../../../sharedUtils/globalHelper/constantValues";
import { DataOfList } from "../../../sharedUtils/globalHelper/status";
import { selectLeadState } from "../redux/lead";
import {
  assigneeAction,
  selectAssigneeState,
} from "projects/assignee/redux/assignee";
import { Checkbox } from "@material-ui/core";
import { selectLoggedUser } from "projects/authentication/redux/auth";

export default function Filter(props) {
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectLoggedUser);

  let baseURL;
  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8087/api/";
  } else {
    baseURL = "/api/";
  }

  useEffect(() => {
    dispatch(assigneeAction.list(null));
    dispatch(
      assigneeAction.listInstaller({ role: "62b02a8fda27b400c8b8cf1e" })
    );
    dispatch(assigneeAction.listSurveyor({ role: "62a8266b193c318de458db58" }));
    props._partnerList(null);
  }, []);

  const [defaultSS, setDefaultSS] = useState([]);
  const [isSet, setIsSet] = useState(true);
  const [selectedLeadType, setSelectedLeadType] = useState("");

  const currentProps = props;
  let PartnerList = [];
  let initPl = [];
  let initDataOf = [];

  const leadState = useSelector(selectLeadState);
  const partnerListForDropdown = leadState.partnerListForDropdown;

  if (partnerListForDropdown) {
    PartnerList = partnerListForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  if (props.filterData.PartnerArray !== undefined) {
    initPl = PartnerList.filter((partner) => {
      return props.filterData.PartnerArray.findIndex((p) => {
        return p === partner.value;
      }) !== -1
        ? true
        : false;
    });
  }

  if (props.filterData.DataOfArray !== undefined) {
    initDataOf = DataOfList.filter((data) => {
      return props.filterData.DataOfArray.includes(data.value);
    });
  }

  if (
    currentProps.filterData !== undefined &&
    currentProps.filterData.StatusArray &&
    isSet
  ) {
    setDefaultSS(
      currentProps.filterData.StatusArray.map((v) => ({
        label: v,
        value: v,
      }))
    );
    setIsSet(false);
  }

  const assigneeState = useSelector(selectAssigneeState);

  let allPl = [];
  if (assigneeState.assigneeListForDropdown)
    allPl = assigneeState.assigneeListForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));

  let allInstaller = [];
  if (assigneeState.assigneeListInstallerForDropdown) {
    allInstaller = assigneeState.assigneeListInstallerForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  let allSurveyor = [];
  if (assigneeState.assigneeListSurveyorForDropdown) {
    allSurveyor = assigneeState.assigneeListSurveyorForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  const serviceOptions = [
    {
      value: "gas",
      label: "Gas",
    },
    {
      value: "electric",
      label: "Electric",
    },
    {
      value: "debt",
      label: "Debt",
    },
    {
      label: "Telecoms & Broadband",
      value: "telecomandbroadband",
    },
    {
      value: "water",
      label: "Water",
    },
    {
      value: "paidsolar",
      label: "Paid Solar",
    },
    {
      value: "chipAndPin",
      label: "Chip And Pin",
    },
    {
      value: "telecoms",
      label: "Telecoms",
    },
    {
      value: "broadband",
      label: "Broadband",
    },
    {
      value: "energy",
      label: "Energy",
    },
    {
      value: "funeral",
      label: "Funeral",
    },
    { value: "Mortgage", label: "Mortgage" },
    { value: "Waste", label: "Waste" },
    { value: "Insurance", label: "Insurance" },
    { value: "Businessrates", label: "Businessrates" },
    // { value: 'eco', label: 'Eco' },
    { value: "boilers", label: "ECO-BOILERS" },
    { value: "ufiunderfloor", label: "ECO-UFI UNDERFLOOR" },
    { value: "cavitywall", label: "ECO-CAVITY WALL" },
    { value: "esh", label: "ECO-ESH" },
    { value: "ftch", label: "ECO-FTCH" },
    { value: "ewi", label: "ECO-EWI" },
    { value: "iwi", label: "ECO-IWI" },
    { value: "roominaroof", label: "ECO-ROOM IN A ROOF" },
    { value: "loftinsulation", label: "ECO-LOFT INSULATION" },
    { value: "solar", label: "ECO-SOLAR" },
    { value: "batterystorage", label: "ECO-BATTERY STORAGE" },
    { value: "invertor", label: "ECO-INVERTOR" },
  ];

  return (
    <div className="app">
      <Formik
        initialValues={{
          dataOf:
            props.filterData.DataOfArray !== undefined &&
            props.filterData.DataOfArray.length > 0
              ? initDataOf
              : null,
          partner:
            props.filterData.PartnerArray !== undefined &&
            props.filterData.PartnerArray.length > 0
              ? initPl
              : null,
          status:
            currentProps.filterData.StatusArray !== undefined &&
            defaultSS.length > 0
              ? defaultSS
              : null,
          Assignee:
            props.filterData.Assignee !== undefined
              ? props.filterData.Assignee
              : null,
          appoinmentBooker:
            props.filterData.appoinmentBooker !== undefined
              ? props.filterData.appoinmentBooker
              : null,
          LeadGenerator:
            props.filterData.LeadGenerator !== undefined
              ? props.filterData.LeadGenerator
              : null,
          leadAdministrator:
            props.filterData.leadAdministrator !== undefined
              ? props.filterData.leadAdministrator
              : null,
          Installer:
            props.filterData.Installer !== undefined
              ? props.filterData.Installer
              : null,
          Surveyor:
            props.filterData.Surveyor !== undefined
              ? props.filterData.Surveyor
              : null,
          SystemDesigner:
            props.filterData.SystemDesigner !== undefined
              ? props.filterData.SystemDesigner
              : null,
          selfCheck: props.filterData?.selfCheck
            ? props.filterData?.selfCheck
            : false,
          serviceData:
            props.filterData.serviceData !== undefined
              ? props.filterData.serviceData
              : null,
          source:
            props.filterData.source !== undefined
              ? props.filterData.source
              : null,
          installerType:
            props.filterData.installerType !== undefined
              ? props.filterData.installerType
              : null,
          leadType:
            props.filterData.leadType !== undefined
              ? props.filterData.leadType
              : null,
          jobType:
            props.filterData.jobType !== undefined
              ? props.filterData.jobType
              : null,
          dialer:
            props.filterData.dialer !== undefined
              ? props.filterData.dialer
              : null,
        }}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = {};
          if (values.dataOf)
            filterObject.DataOfArray = values.dataOf.map((v) => v.value);
          if (values.partner)
            filterObject.PartnerArray = values.partner.map((v) => v.value);
          if (values.status)
            filterObject.StatusArray = values.status.map((v) => v.value);
          if (values.Assignee) filterObject.Assignee = values.Assignee;
          if (values.appoinmentBooker)
            filterObject.appoinmentBooker = values.appoinmentBooker;
          if (values.LeadGenerator) {
            filterObject.LeadGenerator = values.LeadGenerator;
            filterObject.digitalDashboardStats = true;
          }
          if (values.leadAdministrator)
            filterObject.leadAdministrator = values.leadAdministrator;
          if (values.Installer) filterObject.Installer = values.Installer;
          if (values.Surveyor) filterObject.Surveyor = values.Surveyor;
          if (values.SystemDesigner)
            filterObject.SystemDesigner = values.SystemDesigner;
          if (values.installerType)
            filterObject.installerType = values.installerType.map(
              (v) => v.value
            );

          if (values.dialer) filterObject.dialer = values.dialer;
          if (values.leadType) filterObject.leadType = values.leadType?.value;
          if (values.jobType) filterObject.jobType = values.jobType?.value;
          if (values.source) filterObject.source = values.source;

          let mainService = [];
          if (values.serviceData) {
            values.serviceData.map((x) => {
              if (!x.label.includes("ECO-")) {
                mainService.push(x);
              }
            });
          }
          // if (values.serviceData) filterObject.serviceData = values.serviceData
          let subservice = [];
          if (values.serviceData) {
            values.serviceData.map((e) => {
              if (e.label.includes("ECO-")) {
                subservice.push(e);
                mainService.push({ value: "eco", label: "Eco" });
              }
            });
          }

          if (mainService) filterObject.serviceData = mainService;
          if (subservice) filterObject.subservice = subservice;
          filterObject.selfCheck = values.selfCheck;
          props._loadingDataAction(false);
          props._filterData(filterObject);
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;
          function handleSelfCheck(event) {
            setFieldValue("selfCheck", event.target.checked);
            if (event.target.checked)
              setFieldValue("Assignee", {
                value: loggedUser._id,
                label: loggedUser.name,
              });
            else setFieldValue("Assignee", null);
          }
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.dataOf && touched.dataOf ? true : false}
                    id="dataOf"
                    className="WidhtFull100"
                    placeholder="Search Data of"
                    value={values.dataOf}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dataOf-number-error"
                    onChange={(e) => setFieldValue("dataOf", e)}
                    isMulti
                    name="dataOf"
                    options={DataOfList}
                    classNamePrefix="select"
                  />
                </Grid>

                {!["service_partner"].includes(currentProps.slug) ? (
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.partner && touched.partner}
                      id="role"
                      isMulti
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Partner List"
                      value={values.partner}
                      margin="normal"
                      aria-describedby="partner-number-error"
                      onChange={(e) => setFieldValue("partner", e)}
                      onBlur={handleBlur}
                      name="partner"
                      options={PartnerList}
                      classNamePrefix="select"
                    />
                  </Grid>
                ) : null}

                {!["service_partner"].includes(currentProps.slug) ? (
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.Assignee && touched.Assignee}
                      id="Assignee"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Assignee"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        props.setFieldValue("Assignee", e);
                      }}
                      value={values.Assignee}
                      margin="normal"
                      aria-describedby="Assignee-number-error"
                      isMulti={false}
                      name="Assignee"
                      options={allPl}
                      classNamePrefix="select"
                    />
                  </Grid>
                ) : null}
                {["management"].includes(currentProps.slug) ? (
                  <Grid item xs={12}>
                    <Checkbox
                      checked={values.selfCheck}
                      onChange={handleSelfCheck}
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                    Assigned leads
                  </Grid>
                ) : null}

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.leadType && touched.leadType ? true : false}
                    id="leadType"
                    className="WidhtFull100"
                    placeholder="Lead Type"
                    value={values.leadType}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="leadType-number-error"
                    onChange={(e) => {
                      setSelectedLeadType(e.value);
                      setFieldValue("leadType", e);
                    }}
                    name="leadType"
                    options={leadTypes}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.jobType && touched.jobType ? true : false}
                    id="jobType"
                    className="WidhtFull100"
                    placeholder="Job Type"
                    value={values.jobType}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="jobType-number-error"
                    onChange={(e) => {
                      setFieldValue("jobType", e);
                    }}
                    name="jobType"
                    options={LeadJobTypeOptions}
                    classNamePrefix="select"
                  />
                </Grid>

                {!["service_partner"].includes(currentProps.slug) ? (
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.serviceData && touched.serviceData}
                      id="serviceData"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Select Service"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        props.setFieldValue("serviceData", e);
                      }}
                      value={values.serviceData}
                      margin="normal"
                      aria-describedby="serviceData-number-error"
                      isMulti={true}
                      name="serviceData"
                      options={serviceOptions}
                      classNamePrefix="select"
                    />
                  </Grid>
                ) : null}

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.status && touched.status}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Lead Status"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      if (e) {
                        setDefaultSS(
                          e.map((v) => ({
                            label: v.value,
                            value: v.value,
                          }))
                        );
                      } else {
                        setDefaultSS([]);
                      }
                      props.setFieldValue("status", e);
                    }}
                    value={defaultSS}
                    margin="normal"
                    aria-describedby="status-number-error"
                    isMulti
                    name="status"
                    options={leadOptions}
                    classNamePrefix="select"
                  />
                </Grid>

                {!["service_partner"].includes(currentProps.slug) ? (
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.source && touched.source}
                      id="source"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Select Source"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        props.setFieldValue("source", e);
                      }}
                      value={values.source}
                      margin="normal"
                      aria-describedby="source-number-error"
                      // isMulti={true}
                      name="source"
                      options={sourceOptions}
                      classNamePrefix="select"
                    />
                  </Grid>
                ) : null}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
                      id="appoinmentBooker"
                      placeholder="Select Appoinment Booker"
                      value={values.appoinmentBooker}
                      onChange={(e) => {
                        setFieldValue("appoinmentBooker", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="appoinmentBooker-number-error"
                      options={allPl}
                    />
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
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
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
                      id="leadAdministrator"
                      placeholder="Select Lead Administrator"
                      value={values.leadAdministrator}
                      onChange={(e) => {
                        setFieldValue("leadAdministrator", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="leadAdministrator-number-error"
                      options={allPl}
                    />
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
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
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
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
                  </Grid>
                )}
                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item xs={12} md={12}>
                    <Select
                      id="installerType"
                      className="WidhtFull100"
                      placeholder="Select Installer Type"
                      value={values.installerType}
                      onBlur={handleBlur}
                      margin="normal"
                      onChange={(e) => setFieldValue("installerType", e)}
                      isMulti
                      name="installerType"
                      options={InstallerTypeOptions}
                      classNamePrefix="select"
                    />
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
                      id="Surveyor"
                      placeholder="Select Surveyor"
                      value={values.Surveyor}
                      onChange={(e) => {
                        setFieldValue("Surveyor", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="Surveyor-number-error"
                      options={allSurveyor}
                    />
                  </Grid>
                )}

                {!["service_partner"].includes(currentProps.slug) && (
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
                      id="dialer"
                      placeholder="Select Lead Dialer"
                      value={values.dialer}
                      onChange={(e) => {
                        setFieldValue("dialer", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="dialer-number-error"
                      options={allPl}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => {
                        handleReset();
                        props.resetForm();
                        currentProps._loadingDataAction(false);
                        currentProps._filterData({});
                        setDefaultSS([]);
                      }}
                    >
                      <Icon className="fa fa-refresh" />
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Icon className="fa fa-filter" />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
