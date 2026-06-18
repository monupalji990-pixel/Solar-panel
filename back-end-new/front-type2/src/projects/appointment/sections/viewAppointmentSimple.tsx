import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  TimePicker,
  DateTimePicker
} from "@material-ui/pickers";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AppointmentStatusOptions, AppointmentServices, appointmentTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import { AppointmentStatus } from "../../../sharedUtils/globalHelper/status";
import Snackbar from '@material-ui/core/Snackbar';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { appointmentAction, selectAppointmentState } from "../redux/appointment";
import { Accordion, AccordionSummary, Typography, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(() => ({
  Spacing: {
    padding: "10px",
  },
  cursorShow: {
    cursor: "pointer",
  },
  TopBotSpace: {
    marginTop: "10px",
    marginBottom: "10px",
  },
}));

export default function ViewAppointmentLogic(props) {

  const currentProps = props;
  const appointmentState = useSelector(selectAppointmentState);

  const [startLoader, setStartLoader] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [isStartDate, setIsStartDate] = useState(null);
  const [isStartTime, setIsStartTime] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [appmntSubType, setAppointmentType] = useState([])

  useEffect(() => {
    props._slugUpdate(props);
    if (props.appointmentData?.id) {
      props._singleAppointmentDetails({
        id: props.appointmentData?.id
      })
    }
    if (props.showingFrom == 'Dashboard') {
      props._singleAppointmentDetails({
        id: props.rowData?._id
      })
    }
  }, []);

  useEffect(() => {
    if (props.editLoading && startLoader) {
      setStartLoader(false)
      props._closeSideBar(true);
      props.onClose();
    }
  }, [props.editLoading])

  const { Assignee, Assignee2, Booker, Company, Consumer, startTime, endTime, _id, status, service, appointmentSubType, appointmentType } = props.viewAppointment
  const appointmentId = _id;

  useEffect(() => {
    const obj = {
      startTime: startTime,
      endTime: endTime
    }
    if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
      props._userListAppointment(obj);
    }
  }, [startTime, endTime])

  const initialValues: any = {
    Assignee: {
      label: Assignee?.name,
      value: Assignee?._id
    } || '',
    Assignee2: {
      label: Assignee2?.name,
      value: Assignee2?._id
    } || '',
    startTime: startTime || '',
    endTime: endTime || '',
    appointmentStatus: {
      label: AppointmentStatus[status],
      value: status,
    } || '',
    services: {
      label: service && service[0],
      value: service && service[0],
    },
    // LeadID: {
    //   label: leadId?.leadId,
    //   value: leadId?._id,
    // } || '',
    date: startTime || '',
    company: {
      label: Company?.businessName || null,
      value: Company?._id || null,
    },
    consumer: {
      label: Consumer?.firstName || null,
      value: Consumer?._id || null,
    },
    // surveyFor: surveyFor && surveyFor.map((e) => ({
    //   label: e,
    //   value: e,
    // })),
    // installerFor: installerFor && installerFor.map((e) => ({
    //   label: e,
    //   value: e,
    // })),
    appointmentType: {
      label: appointmentType,
      value: appointmentType
    },
    appointmentSubType: {
      label: appointmentSubType,
      value: appointmentSubType
    }
  };

  let assigneeOptions = []
  let leadList = [];
  let companyOptions = [];
  let consumerList = [];

  if (props.leads)
    leadList = props.leads.map((e) => ({
      label: `${e.leadId} - ${e.Company ? "Company" : "Consumer"}`,
      value: e._id,
    }));

  if (appointmentState.companies)
    companyOptions = appointmentState.companies.map((e) => ({
      label: e.businessName,
      value: e._id,
    }));

  if (appointmentState.consumers)
    consumerList = appointmentState.consumers.map((e) => ({
      label: `${e.firstName} ${e.surName}`,
      value: e._id,
    }));


  if (props.availableUsers) {
    assigneeOptions = props.availableUsers.map(e => ({ label: e.name, value: e._id }));
  }

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (event.length >= 0) {
      if (action === "lead")
        props._leadListForDropdown({
          searchText: event,
          limit: props.leads.length + 10,
        });
    }
  };

  const handleChangeDate = (d) => {
    const startDate = new Date(isStartDate).toDateString();
    const startTime = new Date(isStartTime).toTimeString();
    const endTime = new Date(d.endTime).toTimeString();

    const SD = (startDate + ' ' + startTime).toString()
    const ED = (startDate + ' ' + endTime).toString()

    const obj = {
      startTime: SD,
      endTime: ED
    }
    if ((Date.parse(ED) <= Date.parse(SD))) {
      setOpen2(true);
    } else if (SD !== undefined && SD !== null && ED !== undefined && ED !== null) {
      props._userListAppointment(obj);
    } else {
      setOpen(true);
    }
  }

  const deleteAppointment = () => {
    if (appointmentId) {
      setStartLoader(true)
      props._deleteAppointment(appointmentId);
    }
  }
  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  }


  const searchInDataCompany = (event, action) => {
    if (event) setCurrentSearchText(event);
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (event.length >= 0) {
      if (action === "company")
        props._companyListForDropdown({ searchText: event, limit: 10 });
      if (action === "consumer")
        props._consumerDropList({ searchText: event, limit: 10 });
    }
  };

  const lazyLoadAPICompany = (event, action) => {
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

  const debounceOnChangeCompany = React.useCallback(
    helperMethods.debounce(searchInDataCompany, 400),
    []
  );

  const handleChaneAppointmentType = (e) => {
    setAppointmentType(e.type)
  }

  const getLabelOfAssignee = (values) => {
    if (values.appointmentType?.value == "Eco Surveys" || values.appointmentType?.value == "Solar Survey")
      return "Surveryor"
    else if (values.appointmentType?.value == "Solar Installs")
      return "Roof Installer"
    else if (values.appointmentType?.value == "Scaffolding Installs")
      return "Select Installer"
    else if (values.appointmentType?.value == "ECO Installs")
      return `Select ${values.appointmentSubType?.value || ''} Installer`
    else
      return "Assignee"
  }

  if (props.viewLoading) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(value) => {
          const data: any = {}
          setStartLoader(true);

          if (value.Assignee) data.Assignee = value.Assignee.value
          if (value.Assignee2) data.Assignee2 = value.Assignee2.value
          // if (value.LeadID) data.leadId = value.LeadID.value
          if (value.appointmentStatus) data.status = value.appointmentStatus.value
          // if (value.surveyFor) data.surveyFor = value.surveyFor.map((x) => x.value)
          // if (value.installerFor) data.installerFor = value.installerFor.map((x) => x.value)
          if (value.services) data.service = value.services.value
          if (value.appointmentType) data.appointmentType = value.appointmentType.value
          if (value.appointmentSubType) data.appointmentSubType = value.appointmentSubType.value

          if (value.company?.value) {
            data.Company = value.company?.value;
          }
          else if (value.consumer?.value) {
            data.Consumer = value.consumer?.value;
          }
          // const startDate = new Date(value.date).toDateString();
          // const startTime = new Date(value.startTime).toTimeString();
          // const endDate = new Date(value.endTime).toDateString();
          // const endTime = new Date(value.endTime).toTimeString();

          // const SD = (startDate + ' ' + startTime).toString()
          // const ED = (endDate + ' ' + endTime).toString()

          if (value.startTime) data.startTime = value.startTime
          if (value.endTime) data.endTime = value.endTime

          data.id = appointmentId;
          props._editAppointment(data);
        }}
        validationSchema={Yup.object().shape({
          Assignee: Yup.string().required("Assignee is required").nullable(),
          date: Yup.date().required("Start Date is required").nullable(),
          startTime: Yup.date().required("Start Time is required").nullable(),
          endTime: Yup.date().required("End Time is required").nullable(),
          appointmentStatus: Yup.string().required("Appointment Status is required").nullable(),
          // LeadID: Yup.string().required("Lead Ref. is required").nullable(),
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
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableBody>
                        {/* {leadId?.Consumer &&
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Consumer
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {leadId.Consumer?.firstName}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Consumer Address
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {leadId.Consumer?.addressOne + ' ' + leadId.Consumer?.addressTwo}
                              </TableCell>
                            </TableRow>
                          </>
                        }

                        {leadId?.Company &&
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Company
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {leadId.Company?.businessName}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Company Address
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {leadId.Company?.firstLine + ' ' + leadId.Company?.secondLine}
                              </TableCell>
                            </TableRow>
                          </>
                        }

                        {leadId?.serviceType && leadId.serviceType.length > 0 &&
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Services
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <div style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '10px'
                                }}>
                                  {leadId.serviceType.map((x) => <span style={{ background: 'rgb(230 240 255)', borderRadius: '5px', padding: '5px 10px' }}>{x}</span>)}
                                </div>
                              </TableCell>
                            </TableRow>

                            {leadId?.subServiceType && leadId.subServiceType.length > 0 &&
                              <TableRow>
                                <TableCell>
                                  <strong>
                                    Sub Services
                                  </strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px'
                                  }}>
                                    {leadId.subServiceType.map((x) => <span style={{ background: 'rgb(230 240 255)', borderRadius: '5px', padding: '5px 10px' }}>{x}</span>)}
                                  </div>
                                </TableCell>
                              </TableRow>
                            }
                          </>
                        } */}

                        {Booker &&
                          <>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Booked By
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Booker?.name}
                              </TableCell>
                            </TableRow>
                          </>
                        }

                        <TableRow>
                          <TableCell><strong>Assignee</strong></TableCell>
                          <TableCell>{Assignee?.name} ({AppointmentStatus[status]})</TableCell>
                        </TableRow>

                        {Company?.businessName && (
                          <React.Fragment>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Company
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Company?.businessName}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Postcode
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Company?.postcode}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Address
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Company?.firstLine} {Company?.secondLine}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Company Contact:
                                </strong>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        )}

                        {Consumer?.firstName && (
                          <React.Fragment>
                            <TableRow>
                              <TableCell>
                                <strong>
                                  Consumer
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Consumer?.firstName || ''} {Consumer?.lastName || ''} {Consumer?.surName || ''}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Postcode
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Consumer?.postcode}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Address
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Consumer?.addressOne} {Consumer?.addressTwo}
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell>
                                <strong>
                                  Mobile
                                </strong>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {Consumer?.mobile}
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {Company?.businessName && (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>
                          Click To Expand
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container>
                          <Grid item xs={12}>
                            <Table>
                              {Company && Company.contact && (
                                <>
                                  <TableBody
                                    style={{
                                      borderBottom: "2px solid #000",
                                    }}
                                  >
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell>
                                        {Company.contact?.name}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        Email
                                      </TableCell>
                                      <TableCell>{Company.contact?.email}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Mobile</TableCell>
                                      <TableCell>
                                        {Company.contact?.mobile}
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>
                                        Office Number
                                      </TableCell>
                                      <TableCell>
                                        {Company.contact?.phone}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </>
                              )}
                            </Table>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Start Date & Time</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DateTimePicker
                        variant="dialog"
                        inputVariant="outlined"
                        // disablePast
                        error={errors.startTime && touched.startTime ? true : false}
                        margin="normal"
                        id="startTime"
                        name="startTime"
                        placeholder="Start Date & Time"
                        helperText={''}
                        allowKeyboardControl
                        className="WidhtFull100"
                        value={values.startTime}
                        onChange={(e) => {
                          setFieldValue("startTime", e)
                          setIsStartDate(e);
                        }}
                        aria-describedby="startTime-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.startTime && touched.startTime && (
                    <FormHelperText className="errormsg" id="startTime-error">
                      {errors.startTime}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>End Date & Time</label>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DateTimePicker
                        variant="dialog"
                        inputVariant="outlined"
                        // disablePast
                        error={errors.endTime && touched.endTime ? true : false}
                        margin="normal"
                        id="endTime"
                        name="endTime"
                        placeholder="End Date & Time"
                        helperText={''}
                        allowKeyboardControl
                        className="WidhtFull100"
                        value={values.endTime}
                        onChange={(e) => {
                          setFieldValue("endTime", e)
                          handleChangeDate({ endTime: e })
                        }}
                        aria-describedby="endTime-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.endTime && touched.endTime && (
                    <FormHelperText className="errormsg" id="endTime-error">
                      {errors.endTime}
                    </FormHelperText>
                  )}
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <TimePicker
                        autoOk
                        label="Start"
                        value={values.startTime}
                        onChange={(e) => {
                          setFieldValue("startTime", e)
                          setIsStartTime(e)
                        }}
                        helperText={''}
                        ampm={false}
                        inputVariant="outlined"
                        variant="dialog"
                        error={errors.startTime && touched.startTime ? true : false}
                        name="startTime"
                        placeholder="Start Time"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.startTime && touched.startTime && (
                    <FormHelperText className="errormsg" id="startTime-error">
                      {errors.startTime}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <TimePicker
                        autoOk
                        label="End"
                        value={values.endTime}
                        onChange={(e) => {
                          setFieldValue("endTime", e)
                          handleChangeDate({ endTime: e })
                        }}
                        helperText={''}
                        ampm={false}
                        inputVariant="outlined"
                        variant="dialog"
                        error={errors.endTime && touched.endTime ? true : false}
                        name="endTime"
                        placeholder="Start Time"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.endTime && touched.endTime && (
                    <FormHelperText className="errormsg" id="endTime-error">
                      {errors.endTime}
                    </FormHelperText>
                  )}
                </Grid> */}

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Appointment Type</label>

                  <Select
                    className={
                      errors.appointmentType && touched.appointmentType ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="appointmentType"
                    placeholder="Select Appointment Type"
                    value={values.appointmentType}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("appointmentType", e);
                      handleChaneAppointmentType(e)
                    }}
                    onBlur={handleBlur}
                    name="appointmentType"
                    isClearable={true}
                    options={appointmentTypeOptions}
                  />
                  {errors.appointmentType && touched.appointmentType && (
                    <FormHelperText className="errormsg" id="appointmentType-error">
                      {errors.appointmentType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Appointment SubType</label>
                  <Select
                    className={
                      errors.appointmentSubType && touched.appointmentSubType ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="appointmentSubType"
                    placeholder="Select Appointment SubType"
                    value={values.appointmentSubType}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("appointmentSubType", e);
                    }}
                    onBlur={handleBlur}
                    name="appointmentSubType"
                    isClearable={true}
                    options={appmntSubType}
                  />
                  {errors.appointmentSubType && touched.appointmentSubType && (
                    <FormHelperText className="errormsg" id="appointmentSubType-error">
                      {errors.appointmentSubType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>{getLabelOfAssignee(values)}</label>
                  <Select
                    className={
                      errors.Assignee && touched.Assignee ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="Assignee"
                    placeholder={getLabelOfAssignee(values)}
                    value={values.Assignee}
                    isDisabled={currentProps.slug == 'sales_rep' ? true : false}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("Assignee", e);
                    }}
                    onBlur={handleBlur}
                    name="Assignee"
                    isClearable={true}
                    options={assigneeOptions}
                  />
                  {errors.Assignee && touched.Assignee && (
                    <FormHelperText className="errormsg" id="Assignee-error">
                      {errors.Assignee}
                    </FormHelperText>
                  )}
                </Grid>

                {values.appointmentType?.value == "Solar Installs" &&
                  <Grid item xs={12} md={12}>
                    <label style={{ paddingBottom: 10, display: 'block' }}>Electric Installer</label>
                    <Select
                      className={
                        errors.Assignee2 && touched.Assignee2 ? "ErrorColor" : ""
                      }
                      variant="outlined"
                      id="Assignee2"
                      placeholder={"Select Electric Installer"}
                      value={values.Assignee2}
                      isDisabled={currentProps.slug == 'sales_rep' ? true : false}
                      margin="normal"
                      onChange={(e) => {
                        setFieldValue("Assignee2", e);
                      }}
                      onBlur={handleBlur}
                      name="Assignee2"
                      isClearable={true}
                      options={assigneeOptions}
                    />
                    {errors.Assignee2 && touched.Assignee2 && (
                      <FormHelperText className="errormsg" id="Assignee2-error">
                        {errors.Assignee2}
                      </FormHelperText>
                    )}
                  </Grid>
                }

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Appointment Status</label>
                  <Select
                    className={
                      errors.appointmentStatus && touched.appointmentStatus ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="appointmentStatus"
                    placeholder="Select Appointment Status"
                    value={values.appointmentStatus}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("appointmentStatus", e);
                    }}
                    onBlur={handleBlur}
                    name="appointmentStatus"
                    isClearable={true}
                    options={AppointmentStatusOptions}
                  />
                  {errors.appointmentStatus && touched.appointmentStatus && (
                    <FormHelperText className="errormsg" id="appointmentStatus-error">
                      {errors.appointmentStatus}
                    </FormHelperText>
                  )}
                </Grid>

                {/* <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Survey For</label>
                  <Select
                    className={
                      errors.surveyFor && touched.surveyFor ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="surveyFor"
                    placeholder="Survey For"
                    value={values.surveyFor}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("surveyFor", e);
                    }}
                    isMulti
                    onBlur={handleBlur}
                    name="surveyFor"
                    isClearable={true}
                    options={SurveyforOptions}
                  />
                  {errors.surveyFor && touched.surveyFor && (
                    <FormHelperText className="errormsg" id="surveyFor-error">
                      {errors.surveyFor}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Installer For</label>
                  <Select
                    className={
                      errors.installerFor && touched.installerFor ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="installerFor"
                    placeholder="Installer For"
                    value={values.installerFor}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("installerFor", e);
                    }}
                    isMulti
                    onBlur={handleBlur}
                    name="installerFor"
                    isClearable={true}
                    options={SurveyforOptions}
                  />
                  {errors.installerFor && touched.installerFor && (
                    <FormHelperText className="errormsg" id="installerFor-error">
                      {errors.installerFor}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Lead</label>
                  <Select
                    className={
                      errors && errors.LeadID ? "ErrorColor" : ""
                    }
                    name="LeadID"
                    placeholder="Search Lead"
                    value={values.LeadID}
                    onChange={(e) => {
                      setFieldValue("LeadID", e);
                    }}
                    isDisabled={true}
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
                </Grid> */}

                <Grid item xs={12} md={12}>
                  <label style={{ paddingBottom: 10, display: 'block' }}>Service</label>
                  <Select
                    className={
                      errors.services && touched.services ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="services"
                    placeholder="Service"
                    value={values.services}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("services", e);
                    }}
                    onBlur={handleBlur}
                    name="services"
                    isClearable={true}
                    options={AppointmentServices}
                  />
                  {errors.services && touched.services && (
                    <FormHelperText className="errormsg" id="services-error">
                      {errors.services}
                    </FormHelperText>
                  )}
                </Grid>

                {Company?.businessName && (
                  <React.Fragment>
                    <Grid item xs={12} md={12}>
                      <label style={{ paddingBottom: 10, display: 'block' }}>Company</label>
                      <Select
                        className={
                          errors.company && touched.company ? "ErrorColor" : ""
                        }
                        variant="outlined"
                        id="company"
                        placeholder="Search Company"
                        onChange={(e) => {
                          setFieldValue("company", e);
                        }}
                        isLoading={isLoadingData}
                        onInputChange={(e) => {
                          setIsLoadingData(true);
                          debounceOnChangeCompany(e, "company");
                        }}
                        onMenuScrollToBottom={(e) => {
                          const isCallNewOne =
                            currentProps.companies.length % 10 === 0;
                          if (isCallNewOne) {
                            setIsLoadingData(true);
                            lazyLoadAPICompany(e, "company");
                          }
                        }}
                        components={{
                          LoadingIndicator() {
                            return <CircularProgress />;
                          },
                        }}
                        options={companyOptions}
                        value={values.company}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="company-error"
                        name="company"
                      />
                      {errors.company && touched.company && (
                        <FormHelperText className="errormsg" id="company-error">
                          {errors.company}
                        </FormHelperText>
                      )}
                    </Grid>

                  </React.Fragment>
                )}

                {Consumer?.firstName && (
                  <React.Fragment>
                    <Grid item xs={12} md={12}>
                      <label style={{ paddingBottom: 10, display: 'block' }}>Consumer</label>
                      <Select
                        error={
                          errors.consumer && touched.consumer ? true : false
                        }
                        id="consumer"
                        name="consumer"
                        placeholder="Search Consumer"
                        value={values.consumer}
                        onChange={(e) => {
                          setFieldValue("consumer", e);
                        }}
                        isLoading={isLoadingData}
                        onInputChange={(e) => {
                          setIsLoadingData(true);
                          debounceOnChangeCompany(e, "consumer");
                        }}
                        onMenuScrollToBottom={(e) => {
                          const isCallNewOne =
                            currentProps.consumersDrop.length % 10 === 0;
                          if (isCallNewOne) {
                            setIsLoadingData(true);
                            lazyLoadAPICompany(e, "consumer");
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
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Update
                </Button>

                {currentProps.slug.includes('admin', 'Admin') &&
                  <Button
                    size="medium"
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteAppointment()}
                  >
                    Delete
                  </Button>
                }

                {startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={5000}
        open={open}
        onClose={handleClose}
        message="Start or End Date is not valid! Please select valid Dates"
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={5000}
        open={open2}
        onClose={handleClose}
        message="End date should be greater than Start date"
      />
    </div>
  );
}