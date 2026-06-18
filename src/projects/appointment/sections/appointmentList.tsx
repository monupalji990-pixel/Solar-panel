import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "react-select";
import { selectLoggedUser } from "projects/authentication/redux/auth";
import { useSelector } from "react-redux";
import { appointmentTypeOptions } from "sharedUtils/globalHelper/constantValues";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(() => ({
  activeBtn: {
    background: "#193562 !important",
    color: "#ffffff !important",
    borderColor: "#193562 !important",
  },
}));

export default function AppointmentCalendar(props) {
  const CurrentProps = props;
  const classes = useStyles();
  const userData = useSelector(selectLoggedUser);

  const [selectedAssignee, setSelectedAssignee]: any = useState(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState([]);
  const [clearAssignee, setClearAssignee] = useState(false);
  const [clearAppointmentType, setClearAppointmentType] = useState(false);

  var date = new Date();
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth();

  var firstDay = new Date(year, month, 1);
  var lastDay = new Date(year, month + 1, 0, 23, 59);

  useEffect(() => {
    if (props.isLoadingData2 && selectedAssignee) {
      setSelectedAssignee(null);
      setClearAssignee(false);
    }
  }, [props.isLoadingData2]);

  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._appointmentList({
      startTime: firstDay,
      endTime: lastDay,
    });
    props._assigneeList(null);
  }, []);

  useEffect(() => {
    if (clearAssignee || clearAppointmentType) {
      props._loadingDataAction(false);
      props._slugUpdate(props);
      props._appointmentList({
        startTime: firstDay,
        endTime: lastDay,
      });
    }
  }, [clearAssignee, clearAppointmentType]);

  const [state, setState] = useState({
    viewState: "month",
  });
  const [dateChange, setDateChange] = useState(null);

  useEffect(() => {
    if (dateChange !== null) {
      let year = new Date(dateChange).getFullYear();
      let month = new Date(dateChange).getMonth();
      let fd = new Date(year, month, 1);
      let ld = new Date(year, month + 1, 0, 23, 59);
      props._appointmentList({
        startTime: fd,
        endTime: ld,
        Assignee: selectedAssignee?.value || null,
      });
    }
  }, [dateChange]);

  useEffect(() => {
    if (selectedAssignee !== null && selectedAssignee !== undefined) {
      props._appointmentList({
        startTime: firstDay,
        endTime: lastDay,
        Assignee: selectedAssignee.value,
      });
    }

    if (selectedAppointmentType?.length > 0) {
      props._appointmentList({
        startTime: firstDay,
        endTime: lastDay,
        appointmentType: selectedAppointmentType,
      });
    }
  }, [selectedAssignee, selectedAppointmentType]);

  let assigneeOptions = [];
  if (props.assigneeList) {
    assigneeOptions = props.assigneeList.map((e) => ({
      label: e.name,
      value: e._id,
      color: e.color || "#193562",
    }));
  }

  const getCustomToolbar = (toolbar) => {
    let toolbarDate = toolbar.date;

    const goToAgenda = () => {
      toolbar.onView("agenda");
      setState({ viewState: "agenda" });
    };
    const goToWeekView = () => {
      toolbar.onView("week");
      setState({ viewState: "week" });
    };
    const goToMonthView = () => {
      toolbar.onView("month");
      setState({ viewState: "month" });
    };

    const goToBack = () => {
      let view = state.viewState;
      let mDate = toolbar.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() - 7,
          1
        );
      } else {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
      }
      toolbar.onNavigate("prev", newDate);
      setDateChange(newDate);
    };

    const goToNext = () => {
      let view = state.viewState;
      let mDate = toolbar.date;
      let newDate;
      if (view === "month") {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
      } else if (view === "week") {
        newDate = new Date(
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate() + 7,
          1
        );
      } else {
        newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
      }
      toolbar.onNavigate("next", newDate);
      setDateChange(newDate);
    };

    const goToToday = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.date.setDate(now.getDate());
      toolbar.onNavigate("current");
      toolbar.onView("day");
      setState({ viewState: "day" });
    };

    const month = () => {
      const date = moment(toolbar.date);
      let month = date.format("MMMM");

      return <span className="rbc-toolbar-label">{month}</span>;
    };

    const day = () => {
      let view = state.viewState;
      const date = moment(toolbar.date);
      let day;
      if (view === "day") {
        day = date.format("ddd") + " " + date.format("Do");
      }
      return <span className="rbc-toolbar-label">{day}</span>;
    };

    const handleChangeAssignee = (options) => {
      setSelectedAssignee(options);
    };

    const handleChangeAppointmentType = (options) => {
      setSelectedAppointmentType(options);
    };

    const customStyles = {
      control: (styles) => ({
        ...styles,
        color: "#000000",
        width: 250,
        marginRight: 15,
      }),
      placeholder: (styles) => ({ ...styles, color: "#000000" }),
      singleValue: (styles) => ({ ...styles, color: "#000000" }),
      input: (styles) => ({ ...styles, color: "#000000" }),
      option: (provided, state) => ({
        ...provided,
        background: state.data.color,
        color: "#ffffff",
      }),
    };

    return (
      <>
        <div className="rbc-toolbar">
          <span className="rbc-btn-group">
            <button type="button" onClick={goToBack}>
              <span className="prev-icon">&#8249;</span>
            </button>
            <button type="button" disabled>
              {month()}
            </button>
            <button type="button" onClick={goToNext}>
              <span className="next-icon">&#8250;</span>
            </button>
          </span>
          {/* {year()} */}
          {day()}

          <span>
            <Select
              id="appointmentType"
              style={{ width: 250 }}
              placeholder="Appointment Type"
              value={selectedAppointmentType}
              styles={{
                control: (styles) => ({
                  ...styles,
                  width: 250,
                  marginRight: 15,
                }),
                placeholder: (styles) => ({ ...styles }),
                singleValue: (styles) => ({ ...styles }),
                input: (styles) => ({ ...styles }),
                option: (provided, state) => ({
                  ...provided,
                }),
              }}
              isMulti
              margin="normal"
              aria-describedby="appointmentType-number-error"
              onChange={(selectedOption, triggeredAction) => {
                if (triggeredAction.action === "clear") {
                  setClearAppointmentType(true);
                  setSelectedAppointmentType(null);
                } else {
                  setClearAppointmentType(false);
                  handleChangeAppointmentType(selectedOption);
                }
              }}
              name="appointmentType"
              isClearable={true}
              options={appointmentTypeOptions}
            />
          </span>

          <span>
            <Select
              id="assignee"
              style={{ width: 250 }}
              placeholder="Select Assignee"
              value={selectedAssignee}
              styles={customStyles}
              margin="normal"
              aria-describedby="assignee-number-error"
              onChange={(selectedOption, triggeredAction) => {
                if (triggeredAction.action === "clear") {
                  setClearAssignee(true);
                  setSelectedAssignee(null);
                } else {
                  setClearAssignee(false);
                  handleChangeAssignee(selectedOption);
                }
              }}
              name="assignee"
              isClearable={true}
              options={assigneeOptions}
            />
          </span>

          <span className="rbc-btn-group">
            <button
              className={state.viewState === "month" ? classes.activeBtn : ""}
              onClick={goToMonthView}
            >
              <span className="label-filter-off">Month</span>
            </button>
            <button
              type="button"
              className={state.viewState === "day" ? classes.activeBtn : ""}
              onClick={goToToday}
            >
              <span className="next-icon">Today</span>
            </button>
            <button
              className={state.viewState === "week" ? classes.activeBtn : ""}
              onClick={goToWeekView}
            >
              <span className="label-filter-off">Week</span>
            </button>
          </span>

          <span className="rbc-btn-group">
            <button
              className={state.viewState === "agenda" ? classes.activeBtn : ""}
              onClick={goToAgenda}
            >
              <span className="label-filter-off">View All</span>
            </button>
          </span>

          <span className="rbc-btn-group">
            <button
              className={classes.activeBtn}
              onClick={props.setAddDrawer}
              style={{ cursor: "pointer" }}
            >
              <span className="label-filter-off">ADD APPOINTMENT</span>
            </button>
          </span>
          {props.loadingCal && (
            <span className="rbc-btn-group">
              <CircularProgress size={25} />
            </span>
          )}
        </div>
      </>
    );
  };

  const handleSelectedEvent = (event) => {
    if (props.slug !== "partner") {
      props.setEditDrawer(event);
    }
  };

  function getContrastColor(color) {
    var R = parseInt(color?.slice(1, 3), 16),
      G = parseInt(color?.slice(3, 5), 16),
      B = parseInt(color?.slice(5, 7), 16),
      A = 0.7;

    const brightness = R * 0.299 + G * 0.587 + B * 0.114 + (1 - A) * 255;

    return brightness > 186 ? "#000000" : "#FFFFFF";
  }

  let appointments = props?.appointmentList.map((x) => ({
    ...x,
    color: getContrastColor(x.assignee?.color),
    backgroundColor: x.assignee2?.name
      ? `-webkit-linear-gradient(left, ${x.assignee2?.color} 50%, ${x.assignee?.color} 50%)`
      : x.assignee?.color, // -webkit-linear-gradient(left, grey, grey 30%, white 30%, white)
  }));

  if (props.slug === "partner") {
    appointments = appointments.filter(
      (e) => userData._id === e.booker?._id && e
    );
  }

  return (
    <div className="app">
      <div style={{ height: "100vh" }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className="appoint_calendar"
        >
          <Calendar
            // defaultDate={moment().toDate()}
            localizer={localizer}
            selectable
            events={appointments}
            defaultView="month"
            onSelectEvent={handleSelectedEvent}
            components={{
              toolbar: getCustomToolbar,
            }}
            eventPropGetter={(myEventsList) => {
              const background = myEventsList.backgroundColor
                ? myEventsList.backgroundColor
                : "#193562";
              const color = myEventsList.color ? myEventsList.color : "#ffffff";
              return { style: { background, color } };
            }}
          />
        </div>
      </div>
    </div>
  );
}
