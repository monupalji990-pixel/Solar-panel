import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { selectLoggedUser } from "../../authentication/redux/auth";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
    activeBtn: {
        background: '#193562 !important',
        color: '#ffffff !important',
        borderColor: '#193562 !important'
    }
}));

export default function Calender(props) {
    const ds = "1230px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Calendar"
            open={props.open == "manageCalender" ? true : false}
            onClose={props.onClose.bind(this)}
            {...props}
        >
            <ViewCalenderLogic {...props} />
        </MyDrawer>
    );
}


const localizer = momentLocalizer(moment); // or globalizeLocalizer

function ViewCalenderLogic(props) {

    const classes = useStyles();

    const D = new Date()
    const CurrentYear = D.getFullYear();
    const CurrentMonth = D.getMonth();
    const CurrentDate = D.getDate();
    const MonthIndex = D.getMonth();

    const userData = useSelector(selectLoggedUser);

    const [viewState, setViewState] = useState(props.showingFrom === "appBar" ? "month" : "day");
    const [isYear, setIsYear] = useState(CurrentYear);
    const [isMonth, setIsMonth] = useState(MonthIndex);
    const [isCheck, setIsCheck] = useState(false);

    useEffect(() => {
        const getUserId = userData._id;
        const timeFilter = {
            type: 'year',
            year: isYear,
        }
        if (userData?.role?.roleName === 'Admin') {
            props._taskCalendarData({
                timeFilter: timeFilter
            });
        } else {
            props._taskCalendarData({
                user: getUserId,
                timeFilter: timeFilter
            });
        }
    }, []);

    const getYearDate = (date) => {
        const getUserId = userData._id;
        let Y: any = new Date(date).getFullYear();
        setIsYear(Y);
        const timeFilter = {
            type: 'year',
            year: Y,
        }
        props._taskCalendarData({
            user: getUserId,
            timeFilter: timeFilter
        });
    }

    const getCustomToolbar = (toolbar) => {

        let toolbarDate: any = toolbar.date;

        const goToAgenda = () => {
            toolbar.onView("agenda");
            setViewState("agenda");
        }
        const goToMonthView = () => {
            toolbar.onView("month");
            setViewState("month");
        };
        const goToBack = () => {
            let view = viewState;
            let mDate = toolbarDate;
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
                newDate = new Date(
                    mDate.getFullYear(),
                    mDate.getMonth(),
                    mDate.getDate() - 1,
                    1
                );
            }
            toolbar.onNavigate("prev", newDate);
        };

        const goToNext = () => {
            let view = viewState;
            let mDate = toolbarDate;
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
                newDate = new Date(
                    mDate.getFullYear(),
                    mDate.getMonth(),
                    mDate.getDate() + 1,
                    1
                );
            }
            toolbar.onNavigate("next", newDate);
        };

        const goToToday = () => {
            const now = new Date();
            toolbarDate.setMonth(now.getMonth());
            toolbarDate.setDate(now.getDate());
            toolbarDate.setYear(now.getFullYear());
            toolbar.onNavigate("current");
            // getYearDate(now);
            toolbar.onView("day");
            setViewState("day");
        };

        const goToBackYear = () => {
            let mDate = toolbarDate;
            let newDate = new Date(mDate.getFullYear() - 1, 1);
            toolbar.onNavigate("prev", newDate);
            getYearDate(newDate);
        };

        const goToNextYear = () => {
            let mDate = toolbarDate;
            let newDate = new Date(mDate.getFullYear() + 1, 1);
            toolbar.onNavigate("next", newDate);
            getYearDate(newDate);
        };

        const month = () => {
            const date = moment(toolbarDate);
            let month: any = date.format("MMMM");
            let getMonthIndex = new Date('1 ' + month + ' 1999');
            let MonthIndex = getMonthIndex.getMonth();
            setIsMonth(MonthIndex);
            return <span className="rbc-toolbar-label">{month}</span>;
        };

        const year = () => {
            const date = moment(toolbarDate);
            let year: any = date.format("YYYY");
            setIsYear(year);
            return (
                <>
                    <span className="rbc-btn-group">
                        {viewState === "month" && (
                            <button type="button" onClick={goToBackYear}>
                                <span className="prev-icon">&#8249;&#8249;</span>
                            </button>
                        )}
                        <span className="rbc-toolbar-label">{props?.localCalendarData?.timeFilter?.year}</span>
                        {viewState === "month" && (
                            <button type="button" onClick={goToNextYear}>
                                <span className="prev-icon">&#8250;&#8250;</span>
                            </button>
                        )}
                    </span>

                </>
            );
        };

        const day = () => {
            let view = viewState;
            const date = moment(toolbarDate);
            let day;

            if (view === "day") {
                day = date.format("ddd") + " " + date.format("Do");
            }
            else {
                day = date.format("ddd") + " " + date.format("Do");
            }
            return <span className="rbc-toolbar-label">{day}</span>;
        };

        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={goToBack} disabled={toolbarDate.getMonth() === 0 ? true : false}>
                        <span className="prev-icon">&#8249;</span>
                    </button>
                    <button type="button" disabled>
                        {month()}
                    </button>
                    <button type="button" onClick={goToNext} disabled={toolbarDate.getMonth() === 11 ? true : false}>
                        <span className="next-icon">&#8250;</span>
                    </button>
                </span>

                {year()}
                {day()}

                <span className="rbc-btn-group">
                    <button className={viewState === 'month' ? classes.activeBtn : ''} onClick={goToMonthView}>
                        <span className="label-filter-off">Month</span>
                    </button>
                    {/* <button type="button" onClick={goToToday}>
                        <span className="next-icon">Today</span>
                    </button> */}
                    <button className={viewState === 'day' ? classes.activeBtn : ''} onClick={goToToday}>
                        <span className="label-filter-off">Today</span>
                    </button>
                    {/* <button className="" onClick={goToWeekView}>
                        <span className="label-filter-off">Week</span>
                    </button> */}
                </span>

                <span className="rbc-btn-group">
                    <button className={viewState === 'agenda' ? classes.activeBtn : ''} onClick={goToAgenda}>
                        <span className="label-filter-off">View All</span>
                    </button>
                </span>
            </div>
        );
    }

    const createEvent = (event) => {
        if (props.showingFrom === "taskView") {
            props._taskSlotInfo(event);
            props.onClose(true);
        }
    }

    const handleSelectEvent = (event) => {
        if (props.showingFrom !== "taskView") {
            props.taskClickEvent({
                isDashboard: true,
                ...event,
            })
        }
    }

    let formats = {
        timeGutterFormat: 'HH:mm',
    }

    if (props.isLoadingForCalTask) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <div className="app">
            <div style={{ height: "100vh" }}>
                <div style={{ height: "100%", width: "100%" }}>
                    <Calendar
                        onSelectSlot={createEvent}
                        onSelectEvent={handleSelectEvent}
                        selectable={true}
                        localizer={localizer}
                        events={props.calendarData}
                        step={5}
                        formats={formats}
                        timeslots={2}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView={viewState}
                        defaultDate={new Date(isYear, CurrentMonth, CurrentDate, 10, 0)}
                        components={{
                            toolbar: getCustomToolbar,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}