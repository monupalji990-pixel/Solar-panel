import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { DropzoneArea } from "material-ui-dropzone";
import {
  TaskStatus,
  PriorityOption,
  ReminderTypeOption,
  SearchLength,
  A,
} from "../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectGlobalConfig } from "sharedUtils/sharedRedux/configuration";

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

export default function AddTask(props) {

  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "1250px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Task"
      open={props.open === "addTaskDrawer" ? true : false}
      onClose={props.onClose.bind(this)}
    >
      <AddTaskLogic {...props} />
    </MyDrawer>
  );
}

function AddTaskLogic(props) {

  const consumersDrop = useSelector(selectGlobalConfig).consumersDrop;
  const selectedConsumer = useSelector(selectGlobalConfig).selectedConsumer;

  useEffect(() => {
    if (props.slotInfo && props.slotInfo !== undefined && props.slotInfo !== null)
      setIsSlotInfo(props.slotInfo);
  }, [props.slotInfo]);

  useEffect(() => {
    props._basicAction({ selectedCompany: [] });
  }, []);

  useEffect(() => {
    if (props.taskState.isLoadingData == false) {
      if (startLoader) {
        setStartLoader(false)
        props._closeSideBar(true);
      }
      //  
    }
  }, [props.taskState])

  const classes = useStyles();
  const currentProps = props;
  const [reminder, setReminder] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [startLoader, setStartLoader] = useState(false);
  const [assigneeList, setAssigneeList] = useState([]);
  const [quoteList, setQuoteList] = useState([]);
  const [leadList, setLeadList] = useState([]);
  const [CreateRadioToggle, setCreateRadioToggle] = React.useState("");
  const [RadioToggle, setRadioToggle] = React.useState("");
  const [ReminderBefore, setReminderBefore] = useState([]);
  const [ReminderType, setReminderType] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);
  const [dummyOne, setDummyOne] = useState("hello");
  const [IsCreatedFromParams, setIsCreatedFromParams] = useState(false);
  const [CreatorID, setCreatorID] = useState("");
  const [CompanyData, setCompanyData] = useState<any>({});
  const [ConsumerData, setConsumerData] = useState<any>({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isModifyData, setIsModifyData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [isSlotInfo, setIsSlotInfo]: any = useState("");

  const initialValues: any = {
    title: "",
    priority: null,
    description: "",
    DueDate: isSlotInfo.start,
    Time: isSlotInfo.start,
    status: "",
    assignee: "",
    observers: "",
    // taskType:""
  };

  let consumerList = [];
  const onChangeAction = (event, actionFor) => {
    if (event.value) {
      if (actionFor === "Company") {
        setIsModifyData(true);
        props._singleCompanyDetail({ companyID: event.value });
      } else if (actionFor === "Consumer") {
        setIsModifyData(true);
        props._singleConsumerDetail({ consumerID: event.value });
      }
    }
  };

  if (
    props.selectedCompany !== undefined &&
    props.selectedCompany &&
    Object.keys(props.selectedCompany).length > 0 &&
    isModifyData
  ) {
    let QO = [];
    let LO = [];
    const data = [];
    if (props.selectedCompany && props.selectedCompany[0].Assignee) {
      props.selectedCompany[0].Assignee.forEach((el) => {
        if (el.isActive !== 0)
          data.push({ label: el.name, value: el._id });
      });
      setAssigneeList(data);
    }
    setIsModifyData(false);

    if (props.selectedCompany && props.selectedCompany[0].Lead) {
      props.selectedCompany[0].Lead.forEach((v) => {
        LO.push({ label: v.leadId, value: v._id });
      });
      setLeadList(LO);
      if (props.isCreatedFrom && props.isCreatedFrom === "Lead") {
        setIsCreatedFromParams(true);
        setRadioToggle("Lead");
        setCreatorID(props.lead.lead);
      }
    }
    if (props.selectedCompany && props.selectedCompany[0].Quote) {
      props.selectedCompany[0].Quote.forEach((v) => {
        QO.push({ label: v.QuoteID, value: v._id });
      });
      setQuoteList(QO);
    }
  }

  if (
    selectedConsumer !== undefined &&
    selectedConsumer &&
    Object.keys(selectedConsumer).length > 0 &&
    isModifyData
  ) {
    let QO = [];
    let LO = [];
    const data = [];
    if (selectedConsumer && selectedConsumer[0].Assignee) {
      selectedConsumer[0].Assignee.forEach((el) => {
        data.push({ label: el.name, value: el._id });
      });
      setAssigneeList(data);
    }
    if (selectedConsumer && selectedConsumer[0].Lead) {
      selectedConsumer[0].Lead.forEach((v) => {
        LO.push({ label: v.leadId, value: v._id });
      });
      setLeadList(LO);
      if (props.isCreatedFrom && props.isCreatedFrom === "Lead") {
        setIsCreatedFromParams(true);
        setRadioToggle("Lead");
        setCreatorID(props.lead.lead);
      }
    }
    if (selectedConsumer && selectedConsumer[0].Quote) {
      selectedConsumer[0].Quote.forEach((v) => {
        QO.push({ label: v.QuoteID, value: v._id });
      });
      setQuoteList(QO);
    }
    setIsModifyData(false);
  }

  const AddNewReminder = () => {
    let r = reminder;
    const ob = {
      Before: "",
      AccordingTo: "",
      timestamps: new Date().getTime(),
    };
    r.push(ob);
    setReminder(r);
    setDummyOne(Math.random().toString(36).substring(7));
  };

  const RemoveReminder = (i) => {
    const Rem = [];
    reminder.map((v, j) => {
      const OB = {
        ReminderBefore: ReminderBefore[j],
        ReminderType: ReminderType[j],
        timestamps: new Date().getTime(),
      };
      return Rem.push(OB);
    });
    let Reminder = Rem;
    Reminder.splice(i, 1);
    setReminder([]);
    setReminder(Reminder);
    setDummyOne(Math.random().toString(36).substring(7));
  };

  const onChangeContact = (e, index, type) => {
    let previousOne = [];
    if (type === "ReminderType") {
      previousOne = ReminderType;
      previousOne[index] = e.value;
      setReminderType(previousOne);
    }
    if (type === "ReminderBefore") {
      previousOne = ReminderBefore;
      previousOne[index] = e.target.value;
      setReminderBefore(previousOne);
    }
  };

  if (props.isCreatedFrom && !IsCreatedFromParams) {
    setIsCreatedFromParams(true);
    if (props.isCreatedFrom === "Lead") {
      if (
        props.singleLead !== undefined &&
        props.singleLead.Company &&
        props.singleLead.Company.Assignee
      ) {
        const data = [];
        props.singleLead.Company.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
        setCompanyData(props.singleLead.Company);
        setCreateRadioToggle("Company");
      }
      if (
        props.singleLead !== undefined &&
        props.singleLead.Consumer &&
        props.singleLead.Consumer.Assignee
      ) {
        const data = [];
        props.singleLead.Consumer.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
        setConsumerData(props.singleLead.Consumer);
        setCreateRadioToggle("Consumer");
      }
      setRadioToggle("Lead");
      setCreatorID(props.singleLead.leadId);
    } else if (props.isCreatedFrom === "Quote") {
      if (
        props.currentQuote !== undefined &&
        props.currentQuote.Company &&
        props.currentQuote.Company.Assignee
      ) {
        const data = [];
        props.currentQuote.Company.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
        setCompanyData(props.currentQuote.Company);
        setCreateRadioToggle("Company");
      }
      if (
        props.currentQuote !== undefined &&
        props.currentQuote.Consumer &&
        props.currentQuote.Consumer.Assignee
      ) {
        const data = [];
        props.currentQuote.Consumer.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
        setConsumerData(props.currentQuote.Consumer);
        setCreateRadioToggle("Consumer");
      }
      setRadioToggle("Quote");
      setCreatorID(props.currentQuote.QuoteID);
    } else if (props.isCreatedFrom === "Company") {
      setCompanyData(props.currentCompany);
      if (
        props.currentCompany !== undefined &&
        props.currentCompany &&
        props.currentCompany.Assignee
      ) {
        const data = [];
        props.currentCompany.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
      }
      setRadioToggle("Company");
      setCreateRadioToggle("Company");
      setCreatorID(props.currentCompany.companyID);
    } else if (props.isCreatedFrom === "Consumer") {
      setConsumerData(props.currentConsumer);
      if (
        props.currentConsumer !== undefined &&
        props.currentConsumer &&
        props.currentConsumer.Assignee
      ) {
        const data = [];
        props.currentConsumer.Assignee.forEach((ele) => {
          data.push({ label: ele.name, value: ele._id });
        });
        setAssigneeList(data);
      }
      setRadioToggle("Consumer");
      setCreateRadioToggle("Consumer");
      setCreatorID(props.currentConsumer._id);
    }
  } else {
    if (props.companies) {
      const data = props.companies.map((e) => ({
        label: e.businessName,
        value: e._id,
      }));

      if (companyList.length !== data.length) {
        setCompanyList(data);
      }
    }
    if (consumersDrop) {
      consumerList = consumersDrop.map((e) => ({
        label: `${e.firstName} ${e.surName}`,
        value: e._id,
      }));
    }
  }

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (event.length >= SearchLength) {
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
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(value) => {
        const data = new FormData();
        data.set("Title", value.title);
        data.set("Priority", value.priority.value);
        data.set("Description", value.description);
        if (value.DueDate) {
          data.set("DueDate", String(new Date(value.DueDate).getTime()));
        } else {
          data.set("DueDate", String(new Date().getTime()));
        }
        if (value.Time) {
          data.set("Time", String(new Date(value.Time).getTime()));
        } else {
          data.set("Time", String(new Date().getTime()));
        }
        data.set("Status", value.status.value);
        // data.set('TaskSepType',value.taskType.value);
        data.set("Assignee", value.assignee.value);
        if (value.observers) {
          value.observers.map((v) => {
            data.append("Observer[]", v.value);
          });
        }
        data.set("TaskOn", RadioToggle);
        if (IsCreatedFromParams) {
          if (props.isCreatedFrom === "Lead") {
            if (CreateRadioToggle === "Company")
              data.set("Company", CompanyData._id);
            if (CreateRadioToggle === "Consumer")
              data.set("Consumer", ConsumerData._id);
            data.set("Lead", props.lead._id);
          } else if (props.isCreatedFrom === "Quote") {
            if (CreateRadioToggle === "Company")
              data.set("Company", CompanyData._id);
            if (CreateRadioToggle === "Consumer")
              data.set("Consumer", ConsumerData._id);
            data.set("Quote", props.currentQuote._id);
          } else if (props.isCreatedFrom === "Company") {
            data.set("Company", CompanyData._id);
          } else if (props.isCreatedFrom === "Consumer") {
            data.set("Consumer", ConsumerData._id);
          }
        }
        if (value.company) data.set("Company", value.company.value);
        if (value.consumer) data.set("Consumer", value.consumer.value);
        if (value.lead) data.set("Lead", value.lead.value);
        if (value.quote) data.set("Quote", value.quote.value);
        const Reminder = [];
        reminder.map((v, i) => {
          const OB = {
            ReminderType: ReminderType[i],
            ReminderBefore: ReminderBefore[i],
            IsSent: false,
            timestamps: new Date().getTime(),
          };
          return Reminder.push(OB);
        });
        for (var x = 0; x < Reminder.length; x++) {
          data.append("Reminder", Reminder[x]);
        }
        for (var x = 0; x < fileUpload.length; x++) {
          data.append("Attachments", fileUpload[x]);
        }
        setStartLoader(true);
        props._addTask(data);
      }}
      validationSchema={Yup.object().shape({
        title: Yup.string().required("Title is required"),
        priority: Yup.string().required("Priority is required"),
        description: Yup.string().required("Description is required"),
        DueDate: Yup.date().required("Due Date is required"),
        status: Yup.string().required("Status is required"),
        assignee: Yup.string().required("Assignee is required"),
        observers: Yup.string().required("Observers is required"),
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
        } = props;

        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <TextField
                  variant="outlined"
                  error={errors.title && touched.title ? true : false}
                  id="title"
                  name="title"
                  className="WidhtFull100"
                  label="Title"
                  type="title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="title-error"
                />
                {errors.title && touched.title && (
                  <FormHelperText className="errormsg" id="title-error">
                    {errors.title}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <Select
                  className={
                    errors.priority && touched.priority ? "ErrorColor" : ""
                  }
                  variant="outlined"
                  id="priority"
                  name="priority"
                  placeholder="Priority"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("priority", e);
                  }}
                  value={values.priority}
                  margin="normal"
                  aria-describedby="priority-error"
                  options={PriorityOption}
                />
                {errors.priority && touched.priority && (
                  <FormHelperText className="errormsg" id="priority-error">
                    {errors.priority}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      variant="dialog"
                      inputVariant="outlined"
                      disablePast
                      error={errors.DueDate && touched.DueDate ? true : false}
                      margin="normal"
                      id="DueDate"
                      // label="DueDate"
                      name="DueDate"
                      placeholder="DueDate"
                      helperText={''}
                      allowKeyboardControl
                      className="WidhtFull100"
                      format="dd/MM/yyyy"
                      value={values.DueDate ? values.DueDate : ""}
                      onChange={(e) => setFieldValue("DueDate", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                      aria-describedby="DueDate-number-error"
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                {errors.DueDate && touched.DueDate && (
                  <FormHelperText className="errormsg" id="DueDate-error">
                    {errors.DueDate}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={3}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardTimePicker
                      variant="dialog"
                      inputVariant="outlined"
                      margin="normal"
                      className="WidhtFull100"
                      id="time-picker"
                      // label="Time"
                      name="Time"
                      helperText={''}
                      placeholder="Time"
                      value={values.Time ? values.Time : ""}
                      onChange={(e) => setFieldValue("Time", e)}
                      KeyboardButtonProps={{
                        "aria-label": "change Time",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
                {errors.Time && touched.Time && (
                  <FormHelperText className="errormsg" id="Time-error">
                    {errors.Time}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Select
                  className={
                    errors.status && touched.status ? "ErrorColor" : ""
                  }
                  variant="outlined"
                  id="status"
                  placeholder="Status"
                  onChange={(e) => {
                    setFieldValue("status", e);
                  }}
                  value={values.status}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="status-error"
                  name="status"
                  options={TaskStatus}
                />
                {errors.status && touched.status && (
                  <FormHelperText className="errormsg" id="status-error">
                    {errors.status}
                  </FormHelperText>
                )}
              </Grid>

              {!(A.includes(currentProps.slug)) &&
                <Grid item>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => currentProps.setViewCalDrawer()}
                  >
                    Select Slot
                  </Button>
                </Grid>
              }

              <Grid item xs={12} md={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Task Created from</FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={CreateRadioToggle}
                    onChange={(event) =>
                      IsCreatedFromParams
                        ? null
                        : setCreateRadioToggle(event.target.value)
                    }
                    defaultValue="top"
                  >
                    <FormControlLabel
                      value="Company"
                      control={
                        <Radio color="primary" disabled={IsCreatedFromParams} />
                      }
                      label="Create For Company"
                    />
                    <FormControlLabel
                      value="Consumer"
                      control={
                        <Radio color="primary" disabled={IsCreatedFromParams} />
                      }
                      label="Create For Consumer"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                {CreateRadioToggle === "Company" && IsCreatedFromParams && (
                  <TextField
                    variant="outlined"
                    disabled
                    error={errors.company && touched.company ? true : false}
                    id="company"
                    name="company"
                    className="WidhtFull100"
                    label="company"
                    type="company"
                    value={CompanyData.businessName}
                    margin="normal"
                    aria-describedby="title-error"
                  />
                )}
                {CreateRadioToggle === "Company" && !IsCreatedFromParams && (
                  <React.Fragment>
                    <Select
                      className={
                        errors.company && touched.company ? "ErrorColor" : ""
                      }
                      variant="outlined"
                      id="company"
                      placeholder="Search Company"
                      onChange={(e) => {
                        onChangeAction(e, "Company");
                        setFieldValue("company", e);
                      }}
                      isLoading={isLoadingData}
                      onInputChange={(e) => {
                        setIsLoadingData(true);
                        debounceOnChange(e, "company");
                        setFieldValue("assignee", "");
                        setFieldValue("observers", "");
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
                      options={companyList}
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
                  </React.Fragment>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {CreateRadioToggle === "Consumer" && IsCreatedFromParams && (
                  <TextField
                    variant="outlined"
                    disabled
                    error={errors.consumer && touched.consumer ? true : false}
                    id="consumer"
                    name="consumer"
                    className="WidhtFull100"
                    label="consumer"
                    type="consumer"
                    value={ConsumerData.firstName}
                    margin="normal"
                    aria-describedby="title-error"
                  />
                )}
                {CreateRadioToggle === "Consumer" && !IsCreatedFromParams && (
                  <React.Fragment>
                    <Select
                      className={
                        errors.consumer && touched.consumer ? "ErrorColor" : ""
                      }
                      variant="outlined"
                      id="consumer"
                      placeholder="Search Consumer"
                      onChange={(e) => {
                        onChangeAction(e, "Consumer");
                        setFieldValue("consumer", e);
                      }}
                      isLoading={isLoadingData}
                      onInputChange={(e) => {
                        setIsLoadingData(true);
                        debounceOnChange(e, "consumer");
                        setFieldValue("assignee", "");
                        setFieldValue("observers", "");
                      }}
                      onMenuScrollToBottom={(e) => {
                        const isCallNewOne = consumersDrop.length % 10 === 0;
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
                      value={values.consumer}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="consumer-error"
                      name="consumer"
                      options={consumerList}
                    />
                    {errors.consumer && touched.consumer && (
                      <FormHelperText className="errormsg" id="consumer-error">
                        {errors.consumer}
                      </FormHelperText>
                    )}
                  </React.Fragment>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Select
                  className={
                    errors.assignee && touched.assignee ? "ErrorColor" : ""
                  }
                  variant="outlined"
                  id="assignee"
                  placeholder="Assignee"
                  onChange={(e) => {
                    setFieldValue("assignee", e);
                  }}
                  value={values.assignee}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="assignee-error"
                  name="assignee"
                  options={assigneeList}
                />
                {errors.assignee && touched.assignee && (
                  <FormHelperText className="errormsg" id="assignee-error">
                    {errors.assignee}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Select
                  className={
                    errors.observers && touched.observers ? "ErrorColor" : ""
                  }
                  variant="outlined"
                  id="observers"
                  placeholder="Observers"
                  isMulti
                  onChange={(e) => {
                    setFieldValue("observers", e);
                  }}
                  value={values.observers}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="observers-error"
                  name="observers"
                  options={assigneeList}
                />
                {errors.observers && touched.observers && (
                  <FormHelperText className="errormsg" id="observers-error">
                    {errors.observers}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Task For</FormLabel>
                      <RadioGroup
                        row
                        aria-label="position"
                        name="position"
                        value={RadioToggle}
                        onChange={(event) =>
                          IsCreatedFromParams
                            ? null
                            : setRadioToggle(event.target.value)
                        }
                        defaultValue="top"
                      >
                        <FormControlLabel
                          value="Lead"
                          control={
                            <Radio
                              color="primary"
                              disabled={IsCreatedFromParams}
                            />
                          }
                          label="Create For Lead"
                        />
                        <FormControlLabel
                          value="Quote"
                          control={
                            <Radio
                              color="primary"
                              disabled={IsCreatedFromParams}
                            />
                          }
                          label="Create For Quote"
                        />
                        <FormControlLabel
                          value="Company"
                          control={
                            <Radio
                              color="primary"
                              disabled={IsCreatedFromParams}
                            />
                          }
                          label="Create For Company"
                        />
                        <FormControlLabel
                          value="Consumer"
                          control={
                            <Radio
                              color="primary"
                              disabled={IsCreatedFromParams}
                            />
                          }
                          label="Create For Consumer"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                {RadioToggle === "Lead" && IsCreatedFromParams && (
                  <Grid container spacing={3} className={classes.TopBotSpace}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        disabled
                        error={errors.lead && touched.lead ? true : false}
                        id="lead"
                        name="lead"
                        className="WidhtFull100"
                        label="lead"
                        type="lead"
                        value={CreatorID}
                        margin="normal"
                        aria-describedby="title-error"
                      />
                    </Grid>
                  </Grid>
                )}

                {RadioToggle === "Lead" && !IsCreatedFromParams && (
                  <Grid container spacing={3} className={classes.TopBotSpace}>
                    <Grid item xs={12} md={12}>
                      <Select
                        variant="outlined"
                        error={errors.lead && touched.lead ? true : false}
                        id="lead"
                        className="WidhtFull100"
                        placeholder="Choose Lead"
                        onChange={(e) => {
                          setFieldValue("lead", e);
                        }}
                        value={values.lead}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="choose-lead-error"
                        name="lead"
                        options={leadList}
                        // className="basic-multi-select"
                        classNamePrefix="select"
                      />
                      {errors.lead && touched.lead && (
                        <FormHelperText className="errormsg" id="lead-error">
                          {errors.lead}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                )}

                {RadioToggle === "Quote" && IsCreatedFromParams && (
                  <Grid container spacing={3} className={classes.TopBotSpace}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        disabled
                        error={errors.quote && touched.quote ? true : false}
                        id="quote"
                        name="quote"
                        className="WidhtFull100"
                        label="quote"
                        type="quote"
                        value={CreatorID}
                        margin="normal"
                        aria-describedby="title-error"
                      />
                    </Grid>
                  </Grid>
                )}

                {RadioToggle === "Quote" && !IsCreatedFromParams && (
                  <Grid container spacing={3} className={classes.TopBotSpace}>
                    <Grid item xs={12} md={12}>
                      <Select
                        variant="outlined"
                        error={errors.quote && touched.quote ? true : false}
                        id="quote"
                        className="WidhtFull100"
                        placeholder="Choose Quote"
                        value={values.quote}
                        onChange={(e) => {
                          setFieldValue("quote", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="quote-error"
                        name="quote"
                        options={quoteList}
                        //     className="basic-multi-select"
                        classNamePrefix="select"
                      />
                      {errors.quote && touched.quote && (
                        <FormHelperText className="errormsg" id="quote-error">
                          {errors.quote}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12} md={12} style={{ zIndex: 0 }}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.description && touched.description ? true : false
                    }
                    id="description"
                    className="WidhtFull100"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="description-error"
                  />
                  {errors.description && touched.description && (
                    <FormHelperText className="errormsg" id="description-error">
                      {errors.description}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <DropzoneArea
                  filesLimit={50}
                  dropzoneText="Please Upload File From Here"
                  useChipsForPreview
                  maxFileSize={10000000}
                  onChange={(e) => setFileUpload(e)}
                />
                {errors.file_upload && touched.file_upload && (
                  <FormHelperText className="errormsg" id="file_upload-error">
                    {errors.file_upload}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3}></Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {reminder.map((v, i) => (
                  <Grid container spacing={3}>
                    <Grid
                      container
                      item
                      direction="row"
                      justify="flex-end"
                      md={12}
                      xs={12}
                      className={classes.Spacing}
                    >
                      <span onClick={() => RemoveReminder(i)}>
                        <HighlightOffIcon />
                      </span>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        required
                        error={
                          errors.ReminderBefore && touched.ReminderBefore
                            ? true
                            : false
                        }
                        id="ReminderBefore"
                        className="WidhtFull100"
                        label="Reminder before"
                        name="ReminderBefore"
                        multiline
                        type="number"
                        onChange={(e) => {
                          onChangeContact(e, i, "ReminderBefore");
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="ReminderBefore-error"
                      />
                      {errors.ReminderBefore && touched.ReminderBefore && (
                        <FormHelperText
                          className="errormsg"
                          id="ReminderBefore-error"
                        >
                          {errors.ReminderBefore}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Select
                        required
                        className={
                          errors.ReminderType && touched.ReminderType
                            ? "ErrorColor"
                            : ""
                        }
                        variant="outlined"
                        id="ReminderType"
                        placeholder="Hours/Days/Week"
                        onChange={(e) => {
                          onChangeContact(e, i, "ReminderType");
                          setFieldValue("ReminderType", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="ReminderType-error"
                        name="ReminderType"
                        options={ReminderTypeOption}
                      />
                      {errors.ReminderType && touched.ReminderType && (
                        <FormHelperText
                          className="errormsg"
                          id="ReminderType-error"
                        >
                          {errors.ReminderType}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <CardActions
              style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
            >
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => AddNewReminder()}
              >
                Add Reminder
              </Button>
            </CardActions>

            <CardActions
              style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
            >
              <Button
                size="large"
                variant="contained"
                color="primary"
                type="submit"
              >
                Create Task
              </Button>
              {startLoader && <CircularProgress />}
            </CardActions>
          </form>
        );
      }}
    </Formik>
  );
}