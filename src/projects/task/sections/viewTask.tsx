import React, { useEffect, useState, Suspense } from "react";
import * as Yup from "yup";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { DropzoneArea } from "material-ui-dropzone";
import { Formik } from "formik";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Switch from "@material-ui/core/Switch";
import DateFnsUtils from "@date-io/date-fns";
import { TaskValueToStatus } from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  TaskStatusInEdit,
  PriorityOption,
  ReminderTypeOption,
  AMPS,
  MP,
} from "../../../sharedUtils/globalHelper/constantValues";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { CommonSimple as ViewSimpleCompany } from "../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from "../../consumer/loadable/CommonSimple";
import { Common as HistoryTable } from "../../history/loadable/Common";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Documents from './document';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
  },
  FileUploadSize: {
    minHeight: 200,
  },
  Spacing: {
    marginTop: "20px",
  },
}));

export default function ViewTask(props) {
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewLead", "viewQuote", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "1250px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Task"
      isOutSideClick={props.isOutSideClick !== undefined}
      open={props.open == "manageTaskDrawer" ? true : false}
      onClose={props.onClose.bind(this)}
      {...props}
    >
      <ViewTaskLogic {...props} />
    </MyDrawer>
  );
}

function ViewTaskLogic(props) {
  const [dummyOne, setDummyOne] = useState("hello");
  const currentProps = props;

  useEffect(() => {
    props._isLoadingData(true);
    props._basicAction({ isShowDrawer: "hide" });
    props._viewTaskId(props.task._id);
    props._viewTask();
    setDummyOne("changedAgain");
  }, [props.task]);

  if (!props.companies) {
    props._companyListForDropdown();
  }

  const classes = useStyles();
  const [selectedTab, setSelectedTab] = React.useState("general");
  const [startLoader, setStartLoader] = useState(false);
  const [showActions, setShowActions] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [reminder, setReminder] = useState([
    {
      Before: "",
      AccordingTo: "",
      timestamps: new Date().getTime(),
    },
  ]);
  const [ReminderBefore, setReminderBefore] = useState([]);
  const [ReminderType, setReminderType] = useState([]);
  const [newStatusId, setNewStatusId] = useState("");
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentTask.isDelete === 1
  );
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [defaultSS, setDefaultSS] = useState([]);
  const [selectedObservers, setSelectedObservers] = useState([]);
  const [isShowCompany, setIsShowCompany] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});
  const [isShowConsumer, setIsShowConsumer] = React.useState(false);
  const [consumerData, setConsumerData] = React.useState({});
  const [TimeValue, setTimeValue] = React.useState<any>("");
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("comment");

  if (props.notHideSideBar && startLoader) {
    props._notCloseSideBar(false);
    setStartLoader(false);
    setShowActions("");
  }

  const simpleEdit = (data) => {
    const updateObject: any = {};
    updateObject.TaskID = props.currentTask._id;
    if (data.Title) updateObject.Title = data.Title;
    if (data.Priority) updateObject.Priority = data.Priority;
    if (data.DueDate) updateObject.DueDate = data.DueDate;
    if (data.Time) updateObject.Time = new Date(data.Time).getTime();
    if (data.Company) updateObject.Company = data.Company;
    if (newStatusId) updateObject.Status = newStatusId;
    if (data.AssigneeName) updateObject.Assignee = selectedAssigneeId;
    if (data.Description) updateObject.Description = data.Description;
    if (data.Observer)
      updateObject.Observer = selectedObservers.map((v) => v.id);
    if (data.isDelete) updateObject.isDelete = isDeleteCheck ? 1 : 2;
    updateObject.slugUser = props.slug;
    setStartLoader(true);
    props._isLoadingData(true);
    props._updateTask(updateObject);
  };

  const {
    Title,
    Priority,
    DueDate,
    Time,
    Status,
    Company,
    Consumer,
    Assignee,
    Description,
    Observer,
    Attachments,
    createdAt,
    isDelete,
    customTaskId,
  } = props.currentTask;

  const AssigneeName = Assignee !== undefined && Assignee ? Assignee.name : "";

  let assigneeList = [];
  if (Boolean(Company) && Boolean(Company.Assignee)) {
    Company.Assignee.filter((e) => {
      if (e.isActive !== 0)
        assigneeList.push({
          label: e.name,
          value: e.name,
          id: e._id,
        })
    });
  }
  if (Boolean(Consumer) && Boolean(Consumer.Assignee)) {
    Consumer.Assignee.filter((e) => {
      if (e.isActive !== 0)
        assigneeList.push({
          label: e.name,
          value: e.name,
          id: e._id,
        })
    });
  }

  if (
    !props.isLoadingData &&
    Observer !== undefined &&
    Observer &&
    dummyOne === "changedAgain"
  ) {
    const defaultObserver = Observer.map((e) => ({
      label: e.name,
      value: e.name,
      id: e._id,
    }));
    setDefaultSS(defaultObserver);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  if (
    !props.isLoadingData &&
    isDelete !== undefined &&
    dummyOne === "changedAgain"
  ) {
    setIsDelete(Number(isDelete) === 1);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  if (
    !props.isLoadingData &&
    Time !== undefined &&
    dummyOne === "changedAgain"
  ) {
    setTimeValue(Time);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const AddNewReminder = () => {
    const r = reminder;
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
    const r = reminder;
    r.splice(i, 1);
    setReminder(r);
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

  const AddReminder = () => {
    const taskId = props.currentTask._id;
    const task: any = {};
    task.TaskID = taskId;
    task.Reminder = [...props.currentTask.Reminder];
    reminder.map((v, i) => {
      const OB = {
        ReminderType: ReminderType[i],
        ReminderBefore: ReminderBefore[i],
        IsSent: false,
        timestamps: new Date().getTime(),
      };
      return task.Reminder.push(OB);
    });
    setStartLoader(true);
    setReminder([
      {
        Before: "",
        AccordingTo: "",
        timestamps: new Date().getTime(),
      },
    ]);
    props._updateTask(task);
  };

  const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
    const taskId = props.currentTask._id;
    props._isLoadingData(true);
    if (isDeleteCheck) {
      const data = {
        TaskID: taskId,
        isDelete: true,
      };
      props._sendRequest(data);
    } else {
      const data = {
        TaskID: taskId,
        isDelete: 0,
      };
      props._updateTask(data);
    }
    props.toast(
      `Delete request ${isDeleteCheck ? "sent" : "cancelled"} successfully`
    );
    closeEdit(null);
    setSubmitting(false);
  };

  const viewCompany = (data) => {
    setIsShowCompany(true);
    setCompanyData(data);
  };

  const viewConsumer = (data) => {
    setIsShowConsumer(true);
    setConsumerData(data);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };

  const addNotes = (data, v) => {
    data.append("TaskID", currentProps.currentTask._id);
    props._addNotes(data);
  };

  if (props.isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="txt-uppercase app">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="General" value="general" />
              <Tab label="History" value="history" />
              <Tab label="Documents" value="documents" />
            </Tabs>
          </Paper>
        </Grid>
        {selectedTab === "general" && (
          <>
            <Grid item md={6} xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="caption table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>TASK ID</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {customTaskId ? customTaskId : 'N/A'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Title"
                            value={Title}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Title: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <TextField
                                  error={
                                    props.errors.Title && props.touched.Title
                                      ? true
                                      : false
                                  }
                                  className="profile-pic"
                                  name="Title"
                                  value={props.values.Title}
                                  onChange={props.handleChange}
                                  helperText={!props.errors.Title}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {Title}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {" "}
                        <strong>Priority</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Priority"
                            value={Priority}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Priority: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <Select
                                  error={
                                    props.errors.Priority &&
                                      props.touched.Priority
                                      ? true
                                      : false
                                  }
                                  className="basic-multi-select WidhtFull100"
                                  name="Priority"
                                  value={{
                                    label: props.values.Priority,
                                    value: props.values.Priority,
                                  }}
                                  options={PriorityOption}
                                  helperText={!props.errors.Priority}
                                  onChange={(e) =>
                                    props.setFieldValue("Priority", e.value)
                                  }
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {Priority}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Due Date</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">

                          <OnTextEditInput
                            name="DueDate"
                            className={helperMethods.ColorForDate(DueDate)}
                            value={
                              DueDate !== undefined && DueDate
                                // ? `${helperMethods.ConvertDate(DueDate)}`
                                ? DueDate
                                : ""
                            }
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              DueDate: Yup.string().required("Required"),
                            })}
                            isShowDate={true}
                          >
                            {(props) => {
                              return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      disablePast
                                      variant="dialog"
                                      inputVariant="outlined"
                                      error={
                                        props.errors.DueDate &&
                                          props.touched.DueDate
                                          ? true
                                          : false
                                      }
                                      margin="normal"
                                      id="DueDate_date"
                                      name="DueDate"
                                      allowKeyboardControl
                                      format="dd/MM/yyyy"
                                      value={props.values.DueDate}
                                      onChange={(e) =>
                                        props.setFieldValue("DueDate", e)
                                      }
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                      aria-describedby="DueDate-number-error"
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {DueDate !== undefined && DueDate
                            ? `${helperMethods.ConvertDate(DueDate)}`
                            : ""}
                        </TableCell>
                      )}
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Time</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Time"
                            className={helperMethods.ColorForDate(Time)}
                            value={
                              Time !== undefined && Time
                                ? `${helperMethods.getTimeFromDate(Time)}`
                                : ""
                            }
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Time: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardTimePicker
                                      variant="dialog"
                                      inputVariant="outlined"
                                      error={
                                        props.errors.Time && props.touched.Time
                                          ? true
                                          : false
                                      }
                                      margin="normal"
                                      id="time-picker"
                                      label="Time"
                                      name="Time"
                                      value={TimeValue}
                                      onChange={(e) => {
                                        props.setFieldValue("Time", e);
                                        setTimeValue(e);
                                      }}
                                      KeyboardButtonProps={{
                                        "aria-label": "change Time",
                                      }}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {Time !== undefined && Time
                            ? `${helperMethods.getTimeFromDate(Time)}`
                            : ""}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Status"
                            value={TaskValueToStatus[Status]}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Status: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <Select
                                  error={
                                    props.errors.Status && props.touched.Status
                                      ? true
                                      : false
                                  }
                                  className="basic-multi-select WidhtFull100"
                                  name="Status"
                                  value={{
                                    label: props.values.Status,
                                    value: props.values.Status,
                                  }}
                                  options={TaskStatusInEdit}
                                  helperText={!props.errors.Status}
                                  onChange={(e) => {
                                    props.setFieldValue("Status", e.value);
                                    setNewStatusId(e.id);
                                  }}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {TaskValueToStatus[Status]}
                        </TableCell>
                      )}
                    </TableRow>
                    {Company && (
                      <TableRow>
                        <TableCell>
                          <strong>Company</strong>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => viewCompany(Company)}
                          onMouseOver={(e) => {
                            (e.target as HTMLElement).style.textDecoration =
                              "underline";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.textDecoration =
                              "none";
                          }}
                        >
                          {Company !== undefined &&
                            Company !== undefined &&
                            Company
                            ? Company.businessName
                            : ""}{" "}
                        </TableCell>
                      </TableRow>
                    )}
                    {Consumer && (
                      <TableRow>
                        <TableCell>
                          <strong>Consumer</strong>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => viewConsumer(Consumer)}
                          onMouseOver={(e) => {
                            (e.target as HTMLElement).style.textDecoration =
                              "underline";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.textDecoration =
                              "none";
                          }}
                        >
                          {Consumer
                            ? `${Consumer.firstName} ${Consumer.surName}`
                            : ""}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>
                        <strong>Assignee</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="AssigneeName"
                            value={AssigneeName}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              AssigneeName: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <Select
                                  error={
                                    props.errors.AssigneeName &&
                                      props.touched.AssigneeName
                                      ? true
                                      : false
                                  }
                                  className="basic-multi-select WidhtFull100"
                                  name="AssigneeName"
                                  value={{
                                    label: props.values.AssigneeName,
                                    value: props.values.AssigneeName,
                                  }}
                                  options={assigneeList}
                                  helperText={!props.errors.AssigneeName}
                                  onChange={(e) => {
                                    props.setFieldValue(
                                      "AssigneeName",
                                      e.value
                                    );
                                    setSelectedAssigneeId(e.id);
                                  }}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {AssigneeName}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Observers</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Observer"
                            value={
                              Observer !== undefined && Observer
                                ? helperMethods.formatObjectToString(
                                  Observer,
                                  "name"
                                )
                                : ""
                            }
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Observer: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <Select
                                  error={
                                    props.errors.Observer &&
                                      props.touched.Observer
                                      ? true
                                      : false
                                  }
                                  className="basic-multi-select WidhtFull100"
                                  name="Observer"
                                  isMulti
                                  onChange={(e) => {
                                    setDefaultSS(
                                      e.map((v) => ({
                                        label: v.label,
                                        value: v.value,
                                        id: v.id,
                                      }))
                                    );
                                    setSelectedObservers(e);
                                    props.setFieldValue("Observer", e);
                                  }}
                                  value={defaultSS}
                                  options={assigneeList}
                                  helperText={!props.errors.Observer}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {Observer !== undefined
                            ? helperMethods.formatObjectToString(
                              Observer,
                              "name"
                            )
                            : ""}
                        </TableCell>
                      )}
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Created</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {helperMethods.ConvertDateAndTime(createdAt)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                      {AMPS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="Description"
                            value={Description}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              Description: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <TextField
                                  error={
                                    props.errors.Description &&
                                      props.touched.Description
                                      ? true
                                      : false
                                  }
                                  className="profile-pic"
                                  name="Description"
                                  multiline
                                  rows={5}
                                  value={props.values.Description}
                                  onChange={props.handleChange}
                                  helperText={!props.errors.Description}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {Description}
                        </TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Attachments</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Suspense fallback={<></>}>
                          <ViewFile
                            commentFor="admin"
                            attachments={Attachments}
                          ></ViewFile>
                        </Suspense>
                      </TableCell>
                    </TableRow>
                    {["management", "partner", 'sales_rep', 'Sales Rep'].includes(currentProps.slug) && (
                      <TableRow>
                        <TableCell>
                          <strong>Delete Request</strong>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="isDelete"
                            value={
                              Number(isDelete) === 1
                                ? "Delete request sent"
                                : "Send delete request"
                            }
                            onSubmit={sentDeleteRequest}
                            validateIt={Yup.object().shape({
                              isDelete: Yup.string().required("Required"),
                            })}
                          >
                            {(props) => {
                              return (
                                <Switch
                                  checked={isDeleteCheck}
                                  onChange={(event) => {
                                    setIsDelete(event.target.checked);
                                  }}
                                  value={props.values.isDelete}
                                  name="isDelete"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Formik
                initialValues={{
                  ReminderBefore: null,
                  ReminderType: null,
                }}
                onSubmit={() => {
                  const data = new FormData();
                  const taskId = props.currentTask._id;
                  data.set("TaskID", taskId);
                  for (let x = 0; x < fileUpload.length; x++) {
                    data.append("Attachments", fileUpload[x]);
                  }
                  setStartLoader(true);
                  props._updateTask(data);
                }}
              /*                 validationSchema={{}} */
              >
                {(props) => {
                  const {
                    touched,
                    errors,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                  } = props;

                  return (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        {AMPS.includes(currentProps.slug) && (
                          <Grid
                            item
                            xs={12}
                            md={12}
                            className={classes.Spacing}
                          >
                            <CardActions
                              style={{
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 5,
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  setShowActions("reminder");
                                  setFileUpload(null);
                                }}
                              >
                                Add Reminder
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => setShowActions("attachment")}
                              >
                                Add Attachment
                              </Button>
                            </CardActions>
                          </Grid>
                        )}
                        {showActions === "attachment" && (
                          <Grid container spacing={3}>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              className={classes.Spacing}
                            >
                              <DropzoneArea
                                filesLimit={50}
                                dropzoneText="Please Upload File From Here"
                                useChipsForPreview
                                maxFileSize={10000000}
                                onChange={(e: any) => setFileUpload(e)}
                              />
                            </Grid>
                            <CardActions
                              style={{
                                paddingLeft: 20,
                                paddingRight: 0,
                                marginTop: 20,
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                type="submit"
                              >
                                Add New Attachment
                              </Button>
                              {startLoader && <CircularProgress />}
                            </CardActions>
                          </Grid>
                        )}
                      </Grid>

                      {showActions === "reminder" && (
                        <Grid>
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
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => RemoveReminder(i)}
                                >
                                  <HighlightOffIcon />
                                </span>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  required
                                  variant="outlined"
                                  error={
                                    errors.ReminderBefore &&
                                      touched.ReminderBefore
                                      ? true
                                      : false
                                  }
                                  id="ReminderBefore"
                                  className="WidhtFull100"
                                  label="Reminder Before"
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
                                {errors.ReminderBefore &&
                                  touched.ReminderBefore && (
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
                                  variant="outlined"
                                  className={
                                    errors.ReminderType && touched.ReminderType
                                      ? "ErrorColor"
                                      : ""
                                  }
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

                          <CardActions
                            style={{
                              paddingLeft: 0,
                              paddingRight: 0,
                              marginTop: 20,
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => AddNewReminder()}
                            >
                              + Reminder
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              type="submit"
                              onClick={() => AddReminder()}
                            >
                              Add Reminder
                            </Button>{" "}
                            {startLoader && <CircularProgress />}
                          </CardActions>
                        </Grid>
                      )}
                    </form>
                  );
                }}
              </Formik>
            </Grid>

            <Grid item md={6} xs={12}>
              <Paper>
                <Tabs
                  className="notesTabStyle"
                  variant="scrollable"
                  scrollButtons="auto"
                  value={selectedNoteTabs}
                  onChange={tabHandleChangeNote}
                  aria-label="simple tabs example"
                >
                  <Tab label="Comment" value="comment" />
                </Tabs>
              </Paper>
              {selectedNoteTabs === "comment" && (
                <Suspense fallback={<>Loading...</>}>
                  <Notes
                    addNotes={(e, v) => addNotes(e, v)}
                    notesComment={currentProps.currentTask.Comments}
                    isShowStatus
                    Status={currentProps.currentTask.Status}
                  ></Notes>
                </Suspense>
              )}
            </Grid>
          </>
        )}
      </Grid>
      {isShowCompany && (
        <ViewSimpleCompany
          {...props}
          companyData={companyData}
          isCloseCompany={() => {
            setIsShowCompany(false);
          }}
        >
        </ViewSimpleCompany>
      )}
      {isShowConsumer && (
        <ViewSimpleConsumer
          {...props}
          consumerData={consumerData}
          isCloseConsumer={() => {
            setIsShowConsumer(false);
          }}
        >
        </ViewSimpleConsumer>
      )}

      {selectedTab === "history" && (
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Suspense fallback={<></>}>
              <HistoryTable {...props} historyFor="Task" />
            </Suspense>
          </Grid>
        </Grid>
      )}

      {selectedTab === "documents" && (
        <Suspense fallback={<>Loading...</>}>
          <Documents {...props} />
        </Suspense>
      )}
    </div>
  );
}
