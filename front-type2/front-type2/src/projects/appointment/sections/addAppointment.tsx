import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  DateTimePicker
} from "@material-ui/pickers";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AppointmentStatusOptions, AppointmentServices, appointmentTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import { selectAppointmentState } from "../redux/appointment";
import { InputAdornment, IconButton } from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {
  selectLoggedUser,
} from "../../authentication/redux/auth";

export default function AddAppointment(props) {

  const ds = "550px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Appointment"
      open={props.open === "addAppointmentDrawer" ? true : false}
      onClose={props.onClose.bind(this)}
    >
      <AddAppointmentLogic {...props} />
    </MyDrawer>
  );
}

function AddAppointmentLogic(props) {

  const appointmentState = useSelector(selectAppointmentState);
  const userData = useSelector(selectLoggedUser);

  const [startLoader, setStartLoader] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [isStartDate, setIsStartDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isAssigneeFetch, setIsAssigneeFetch] = useState(true);
  const [CreateRadioToggle, setCreateRadioToggle] = React.useState("");
  const [appointmentSubType, setAppointmentType] = useState([])

  useEffect(() => {
    props._slugUpdate(props);
  }, []);

  useEffect(() => {
    if (props.isLoadingData && !open && !open2) {
      setIsAssigneeFetch(false);
    }
  }, [props.isLoadingData])

  useEffect(() => {
    if (props.isLoadingData2 && startLoader) {
      setStartLoader(false)
      props._closeSideBar(true);
      props.onClose();
    }
  }, [props.isLoadingData2])

  const initialValues: any = {
    Assignee: userData.role.roleName == 'Installer' ? {
      label: userData.name,
      value: userData._id
    } : '',
    Assignee2: userData.role.roleName == 'Installer' ? {
      label: userData.name,
      value: userData._id
    } : '',
    startTime: null,
    endTime: null,
    appointmentStatus: "",
    // startDate: null,
    // endDate: null,
    Company: null,
    Consumer: null,
    services: null,
    // leadAdministrator: null
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
    if (action === "company" && appointmentState.companies.length <= 50)
      props._companyListForDropdown({
        searchText: CurrentSearchText,
        limit: appointmentState.companies.length + 10,
      });
    if (action === "consumer" && appointmentState.consumers.length <= 50)
      props._consumerDropList({
        searchText: CurrentSearchText,
        limit: appointmentState.consumers.length + 10,
      });
  };

  const debounceOnChangeCompany = React.useCallback(
    helperMethods.debounce(searchInDataCompany, 400),
    []
  );

  const handleChangeDate = (d) => {
    const SD = (isStartDate).toString()
    const ED = (d.endTime).toString()

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

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  }

  const handleChaneAppointmentType = (e) => {
    setAppointmentType(e.type)
  }

  const getLabelOfAssignee = (values) => {
    if (values.appointmentType?.value == "Eco Surveys" || values.appointmentType?.value == "Solar Survey")
      return "Select Surveryor"
    else if (values.appointmentType?.value == "Solar Installs")
      return "Select Roof Installer"
    else if (values.appointmentType?.value == "Scaffolding Installs")
      return "Select Installer"
    else if (values.appointmentType?.value == "ECO Installs")
      return `Select ${values.appointmentSubType?.value || ''} Installer`
    else
      return "Select Assignee"
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(value) => {
          const data: any = {}
          setStartLoader(true);
          if (value.Assignee) data.Assignee = value.Assignee.value
          if (value.Assignee2) data.Assignee2 = value.Assignee2.value
          if (value.appointmentStatus?.value) data.status = value.appointmentStatus.value
          if (value.appointmentType?.value) data.appointmentType = value.appointmentType.value
          if (value.appointmentSubType?.value) data.appointmentSubType = value.appointmentSubType.value
          if (value.services?.value) data.service = value.services.value
          // if (value.leadAdministrator?.value) data.leadAdministrator = value.leadAdministrator.value

          if (CreateRadioToggle == "Company" && value.company) {
            data.Company = value.company?.value;
          }
          if (CreateRadioToggle == "Consumer" && value.Consumer) {
            data.Consumer = value.Consumer?.value;
          }

          if (value.startTime) data.startTime = value.startTime
          if (value.endTime) data.endTime = value.endTime

          props._addAppointment(data);
        }}
        validationSchema={Yup.object().shape({
          Assignee: Yup.string().required("Assignee is required").nullable(),
          // startDate: Yup.date().required("Start Date is required").nullable(),
          // endDate: Yup.date().required("End Date is required").nullable(),
          startTime: Yup.date().required("Start Date & Time is required").nullable(),
          endTime: Yup.date().required("End Date & Time is required").nullable(),
          // leadAdministrator: Yup.string().required("Lead Administrator is requried").nullable(),
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DateTimePicker
                        variant="dialog"
                        inputVariant="outlined"
                        disablePast
                        error={errors.startTime && touched.startTime ? true : false}
                        margin="normal"
                        id="startTime"
                        name="startTime"
                        label="Start Date & Time"
                        placeholder="Start Date"
                        className="WidhtFull100"
                        helperText={''}
                        value={values.startTime}
                        onChange={(e) => {
                          setFieldValue("startTime", e)
                          setIsStartDate(e);
                        }}
                        aria-describedby="startTime-number-error"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AccessTimeIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <DateTimePicker
                        variant="dialog"
                        inputVariant="outlined"
                        disablePast
                        error={errors.endTime && touched.endTime ? true : false}
                        margin="normal"
                        id="endTime"
                        name="endTime"
                        label="End Date & Time"
                        placeholder="End Date"
                        className="WidhtFull100"
                        helperText={''}
                        value={values.endTime}
                        onChange={(e) => {
                          setFieldValue("endTime", e)
                          if (userData.role.roleName !== 'Installer')
                            handleChangeDate({ endTime: e });
                        }}
                        aria-describedby="endTime-number-error"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AccessTimeIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                        label="Start Time"
                        value={values.startTime}
                        ampm={false}
                        onChange={(e) => {
                          setFieldValue("startTime", e)
                          setIsStartTime(e)
                        }}
                        helperText={''}
                        inputVariant="outlined"
                        className="WidhtFull100"
                        variant="dialog"
                        error={errors.startTime && touched.startTime ? true : false}
                        name="startTime"
                        placeholder="Start Time"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AccessTimeIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                        label="End Time"
                        value={values.endTime}
                        onChange={(e) => {
                          setFieldValue("endTime", e)
                          handleChangeDate({ endTime: e })
                        }}
                        helperText={''}
                        inputVariant="outlined"
                        className="WidhtFull100"
                        ampm={false}
                        variant="dialog"
                        error={errors.endTime && touched.endTime ? true : false}
                        name="endTime"
                        placeholder="Start Time"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <AccessTimeIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.endTime && touched.endTime && (
                    <FormHelperText className="errormsg" id="endTime-error">
                      {errors.endTime}
                    </FormHelperText>
                  )}
                </Grid> */}

                {/* <Grid item xs={12} md={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDateTimePicker
                        variant="dialog"
                        inputVariant="outlined"
                        disablePast
                        error={errors.endTime && touched.endTime ? true : false}
                        margin="normal"
                        id="endTime"
                        name="endTime"
                        placeholder="End Date & Time"
                        helperText={''}
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy hh:mm a"
                        value={values.endTime ? values.endTime : ""}
                        onChange={(e) => {
                          setFieldValue("endTime", e)
                          handleChangeDate({ endDate: e })
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
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
                </Grid> */}

                <Grid item xs={12} md={12}>
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

                {appointmentSubType.length > 0 &&
                  <Grid item xs={12} md={12}>
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
                      options={appointmentSubType}
                    />
                    {errors.appointmentSubType && touched.appointmentSubType && (
                      <FormHelperText className="errormsg" id="appointmentSubType-error">
                        {errors.appointmentSubType}
                      </FormHelperText>
                    )}
                  </Grid>
                }
{/* 
                <Grid item xs={12} md={12}>
                  <Select
                    className={
                      errors.leadAdministrator && touched.leadAdministrator ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="leadAdministrator"
                    placeholder="Lead Administrator"
                    value={values.leadAdministrator}
                    margin="normal"
                    onChange={(e) => {
                      setFieldValue("leadAdministrator", e);
                    }}
                    onBlur={handleBlur}
                    name="leadAdministrator"
                    isClearable={true}
                    options={assigneeOptions}
                  />
                  {errors.leadAdministrator && touched.leadAdministrator && (
                    <FormHelperText className="errormsg" id="leadAdministrator-error">
                      {errors.leadAdministrator}
                    </FormHelperText>
                  )}
                </Grid> */}

                <Grid item xs={12} md={12}>
                  <Select
                    className={
                      errors.Assignee && touched.Assignee ? "ErrorColor" : ""
                    }
                    variant="outlined"
                    id="Assignee"
                    placeholder={getLabelOfAssignee(values)}
                    value={values.Assignee}
                    isDisabled={userData.role.roleName == 'Installer' ? true : isAssigneeFetch}
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
                    <Select
                      className={
                        errors.Assignee2 && touched.Assignee2 ? "ErrorColor" : ""
                      }
                      variant="outlined"
                      id="Assignee2"
                      placeholder={"Select Electric Installer"}
                      value={values.Assignee2}
                      isDisabled={userData.role.roleName == 'Installer' ? true : isAssigneeFetch}
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

                <Grid item xs={12} md={12}>
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

                <Grid item xs={12} md={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="position"
                      name="position"
                      value={CreateRadioToggle}
                      onChange={(event) =>
                        setCreateRadioToggle(event.target.value)
                      }
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="Company"
                        control={
                          <Radio color="primary" />
                        }
                        label="Company"
                      />
                      <FormControlLabel
                        value="Consumer"
                        control={
                          <Radio color="primary" />
                        }
                        label="Consumer"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {CreateRadioToggle === "Company" && (
                  <Grid item xs={12} md={12}>
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
                          appointmentState.companies?.length % 10 === 0;
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
                )}

                {CreateRadioToggle === "Consumer" && (
                  <Grid item xs={12} md={12}>
                    <Select
                      error={
                        errors.Consumer && touched.Consumer ? true : false
                      }
                      id="Consumer"
                      name="Consumer"
                      placeholder="Search Consumer"
                      value={values.Consumer}
                      onChange={(e) => {
                        setFieldValue("Consumer", e);
                      }}
                      isLoading={isLoadingData}
                      onInputChange={(e) => {
                        setIsLoadingData(true);
                        debounceOnChangeCompany(e, "consumer");
                      }}
                      onMenuScrollToBottom={(e) => {
                        const isCallNewOne =
                          appointmentState.consumers?.length % 10 === 0;
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
                )}

                {/* <Grid item xs={12} md={12}>
                  <Select
                    variant="outlined"
                    id="surveyfor"
                    placeholder="Survey For"
                    value={values.surveyfor}
                    margin="normal"
                    isMulti
                    onChange={(e) => {
                      setFieldValue("surveyfor", e);
                    }}
                    onBlur={handleBlur}
                    name="surveyfor"
                    isClearable={true}
                    options={SurveyforOptions}
                  />
                </Grid> */}

                {/* <Grid item xs={12} md={12}>
                  <Select
                    variant="outlined"
                    id="installerFor"
                    placeholder="Installer For"
                    value={values.installerFor}
                    margin="normal"
                    isMulti
                    onChange={(e) => {
                      setFieldValue("installerFor", e);
                    }}
                    onBlur={handleBlur}
                    name="installerFor"
                    isClearable={true}
                    options={SurveyforOptions}
                  />
                </Grid> */}

                {/* <Grid item xs={12} md={12}>
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
                </Grid>*/}
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={startLoader}
                >
                  Create
                </Button>
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