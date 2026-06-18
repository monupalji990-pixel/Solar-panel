import React, { useEffect, useState, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MaterialTable from "material-table";
import Avatar from "@material-ui/core/Avatar";
import { CircularProgress, DialogActions, DialogContent, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { appointmentAction, selectAppointmentState } from "../../appointment/redux/appointment";
import TablePagination from "@material-ui/core/TablePagination";
import Button from '@material-ui/core/Button';
import { CommonSimple as AddAppointment } from '../../appointment/loadable/CommonSimple';
import { ViewCommonSimple as ViewAppointment } from '../../appointment/loadable/ViewCommonSimple';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import moment from 'moment';
import Select from "react-select";
import { assigneeAction, selectAssigneeState } from 'projects/assignee/redux/assignee';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import RefreshIcon from "@material-ui/icons/Refresh";
import API from "../../appointment/redux/model/appointment";
import { globalConfigActions } from 'sharedUtils/sharedRedux/configuration';

const useStyles = makeStyles({
    UserFieldStyle: {
        display: "flex",
        alignItems: "center",
    },
    fontStyle: {
        fontSize: '21px',
        fontWeight: 500,
        padding: '1rem 0',
        margin: 0,
    },
    assigneeDrop: {
        minWidth: '300px',
        margin: '0 0 0 auto',
    },
    btnStyle: {
        margin: 10,
        border: '1px solid #fff'
    }
});

export default function AppointmentMatrix(props) {

    const classes = useStyles();
    const dispatch = useDispatch();

    const appointmentState = useSelector(selectAppointmentState);
    const assigneeState = useSelector(selectAssigneeState);

    const {
        appointmentMatrixList,
        appointmentMatrixIsNext,
        limitMatrix,
        remote,
        pageMatrix,
        count,
        hideSideBar,
        sort,
        sortType,
        loadingCal,
    } = appointmentState;
    const _appointmentList = (payload) => dispatch(appointmentAction.AppointmentMatrixList(payload));
    const _slugUpdate = (payload) => dispatch(appointmentAction.SlugUpdate(payload));
    const _loadingDataAction = (payload) => dispatch(appointmentAction.LoaderStart(payload));
    const _nextPage = (payload) => dispatch(appointmentAction.NewPageMatrix(payload));
    const _listLimit = (payload) => dispatch(appointmentAction.ChangeLimitMatrix(payload));
    const _searchInData = (payload) => dispatch(appointmentAction.Search(payload));
    const _assigneeListSalesRep = (payload) => dispatch(assigneeAction.listSalesRep(payload));
    const _addAppointment = (payload) => dispatch(appointmentAction.addAppointment(payload));

    const [isShowAddAppointment, setIsShowAddAppointment] = useState('');
    const [isViewAddAppointment, setIsViewAddAppointment] = useState('');
    const [rowData, setRowData] = useState(null);
    const [weekFirstDay, setWeekFirstDay] = useState(null);
    const [weekLastDay, setWeekLastDay] = useState(null);
    const [selectOption, setSelectOption] = useState(null);
    const [appointmentDialog, setAppointmentDialog] = useState(false);
    const [appointmentRow, setAppointmentRow] = useState(null);
    const [isUnAvailable, setIsUnAvailable] = useState(false);
    const [slotPos, setSlotPos] = useState(null);
    const [slotPosDate, setSlotPosDate] = useState(null);
    const [startLoader, setStartLoader] = useState(false);

    useEffect(() => {
        let curr = new Date; // get current date
        let first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstday = new Date(curr.setDate(first)).toUTCString();
        let lastday = new Date(curr.setDate(last)).toUTCString();

        setWeekFirstDay(firstday)
        setWeekLastDay(lastday)

        _loadingDataAction(false);
        _slugUpdate(props);
        _appointmentList({
            startTime: new Date(weekFirstDay || new Date(new Date(firstday).setHours(0, 0, 0))),
            endTime: new Date(weekLastDay || new Date(lastday).setHours(24, 59, 59))
        });

        _assigneeListSalesRep({ role: '5d5b92031c9d440000c99912' });

    }, [])

    useEffect(() => {
        if (weekFirstDay || weekLastDay)
            _appointmentList({
                startTime: new Date(new Date(weekFirstDay).setHours(0, 0, 0)),
                endTime: new Date(new Date(weekLastDay).setHours(24, 59, 59)),
                assigneeId: selectOption?.value,
            });
    }, [weekFirstDay, weekLastDay]);

    const handleChangePage = (event, newPage) => {
        const h = { ...appointmentState };
        h.page = newPage + 1;
        _loadingDataAction(false);
        _nextPage(h);
    };

    const handleChangeRowsPerPage = (event) => {
        const h = { ...appointmentState };
        h.limit = event.target.value;
        _loadingDataAction(false);
        _listLimit(h);
    };

    var weekStart = moment(weekFirstDay).clone().startOf('isoWeek');
    var week = [];

    for (var i = 0; i <= 6; i++) {
        week.push(moment(weekStart).add(i, 'days').format("DD-MM-YYYY"));
    }

    const columns: any = [
        {
            title: "User",
            field: "user",
            sorting: false,
            cellStyle: { minWidth: "200px", maxWidth: '200px' },
            headerStyle: { minWidth: "200px", maxWidth: '200px' },
            render: (rowData) => (
                <div className={classes.UserFieldStyle}>
                    <Avatar src={rowData.avatar}>
                        {rowData.avatar === undefined &&
                            rowData.name &&
                            rowData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                        style={{ marginLeft: 10 }}
                        variant="body2"
                        display="inline"
                    >
                        {rowData.name}
                    </Typography>
                </div>
            ),
        },
        // {
        //     title: "Appointments",
        //     field: "appointments",
        //     sorting: false,
        //     render: (rowData) => (
        //         <div>
        //             {rowData.list.map((e) => (
        //                 <React.Fragment>
        //                     <span>{e.service.join()}</span>
        //                 </React.Fragment>
        //             ))}
        //         </div>
        //     )
        // }
    ]

    const openAppointmentDrawer = () => {
        setIsUnAvailable(false);
        setIsShowAddAppointment('addAppointmentDrawer');
        setAppointmentDialog(false);
    }

    const openViewAppointmentDrawer = (data) => {
        setIsViewAddAppointment('viewAppointmentDrawer');
        setRowData(data)
    }

    const handleChangeWeek = (value) => {
        if (value === 'prev') {
            let curr = new Date(weekFirstDay); // get current date
            let first = curr.getDate() - curr.getDay() - 6; // First day is the day of the month - the day of the week
            let last = first + 7; // last day is the first day + 6
            let firstday = new Date(curr.setDate(first)).toUTCString();
            let lastday = new Date(curr.setDate(last)).toUTCString();
            setWeekFirstDay(firstday)
            setWeekLastDay(lastday)
        }
        if (value == 'next') {
            let curr = new Date(weekFirstDay); // get current date
            let first = curr.getDate() - curr.getDay() + 8; // First day is the day of the month - the day of the week
            let last = first + 6; // last day is the first day + 6
            let firstday = new Date(curr.setDate(first)).toUTCString();
            let lastday = new Date(curr.setDate(last)).toUTCString();
            setWeekFirstDay(firstday)
            setWeekLastDay(lastday)
        }
    }

    const openDialog = (data, index, x) => {
        setSlotPos(index);
        setAppointmentDialog(true);
        setAppointmentRow(data)
        setSlotPosDate(x);
    }

    let newArray = week.map((x, index) => ({
        title: x,
        field: x,
        sorting: false,
        // width: "25%",
        cellStyle: { minWidth: "300px", maxWidth: '300px' },
        headerStyle: { minWidth: "300px", maxWidth: '300px' },
        render: (rowData) => (
            <Grid container spacing={1}>
                {Object.keys(rowData.list).map((key) => key === x && (
                    <React.Fragment>
                        {rowData.list[key].map((f, index) => (
                            <Grid item>
                                {props.slug === "partner" ?
                                    <Button
                                        className={(f._id && f.status !== '-123') ? 'appointment_booked' : ((f.Company === null && f.status === '-123') ? 'appointment_unAvailable' : '')}
                                        variant={(f._id || f.status === '-123') ? "contained" : "outlined"} size='small'
                                        style={{
                                            fontSize: 10,
                                        }}
                                        color={"primary"}
                                        >
                                        {(f._id && f.status !== '-123') ? 'Booked' : ((f.Company === null && f.status === '-123') ? 'UnAvailable' : 'Available')}
                                    </Button>
                                    :
                                    <Button
                                        className={(f._id && f.status !== '-123') ? 'appointment_booked' : ((f.Company === null && f.status === '-123') ? 'appointment_unAvailable' : '')}
                                        variant={(f._id || f.status === '-123') ? "contained" : "outlined"} size='small'
                                        style={{
                                            fontSize: 10,
                                        }}
                                        color={"primary"}
                                        onClick={() => f._id ? openViewAppointmentDrawer(f) : openDialog(rowData, index, x)}>
                                        {(f._id && f.status !== '-123') ? 'Booked' : ((f.Company === null && f.status === '-123') ? 'UnAvailable' : 'Available')}
                                    </Button>
                                }
                            </Grid>
                        ))}
                    </React.Fragment>
                ))}
            </Grid>
            // filter
        )
    }))

    columns.push(...newArray)

    function sameDateCollection(result, item) {
        const date = moment(item.startTime).format('DD-MM-YYYY')

        let groupList = result[date];
        if (!groupList) {
            groupList = result[date] = [];
        }
        groupList.push(item)
        return result;
    }

    const fieldsData = (data) => {
        Object.keys(data).forEach((ele) => {
            if (data[ele]?.length < 3) {
                for (let i = 0; i <= 3 - data[ele]?.length; i++) {
                    data[ele].push({});
                }
            }
        })
        return data;
    }

    const addRemainingDate = (data) => {
        week.forEach((ele) => {
            if (!data.hasOwnProperty(ele)) {
                data[ele] = [{}, {}, {}]
            }
        })
        return data;
    }

    const data = appointmentMatrixList && appointmentMatrixList.map((x, index) => ({
        avatar: x.avatar !== "" ? x.avatar : undefined,
        name: x.name,
        list: addRemainingDate(fieldsData(x.list.reduce(sameDateCollection, {}))),
        // list: x.list,
        _id: x._id
    }))

    let AssigneeList = []
    if (assigneeState?.assigneeListSalesRepForDropdown) {
        AssigneeList = assigneeState?.assigneeListSalesRepForDropdown.map(e => ({ label: e.name, value: e._id }));
    }

    const customStyles = {
        control: styles => ({ ...styles, height: '40px' }),
        placeholder: styles => ({ ...styles }),
        singleValue: (styles, { data }) => ({ ...styles }),
        input: styles => ({ ...styles }),
    }

    const handleChangeAssignee = (e) => {
        setSelectOption({ label: e?.label, value: e?.value })
        _appointmentList({
            startTime: new Date(weekFirstDay),
            endTime: new Date(weekLastDay),
            assigneeId: e.value
        });
    }

    const ClearSelectValues = () => {
        setSelectOption(null);
        _appointmentList({
            startTime: new Date(weekFirstDay),
            endTime: new Date(weekLastDay),
            assigneeId: null
        });
    }

    const handleCloseDialog = () => {
        setAppointmentDialog(false);
        setIsUnAvailable(false);
    }

    const UnAvailableAppointmentCreate = () => {
        // setIsUnAvailable(true);
        // setIsShowAddAppointment('addAppointmentDrawer');
        // setAppointmentDialog(false);

        try {
            const data: any = {}
            setStartLoader(true);

            data.weekFirstDay = weekFirstDay
            data.weekLastDay = weekLastDay
            data.Assignee = appointmentRow?._id
            data.status = '-123'
            data.Company = null

            var parts = slotPosDate.split('-')
            var sDate = new Date(parts[2], parts[1] - 1, parts[0])
            var eDate = new Date(parts[2], parts[1] - 1, parts[0])

            if (slotPos == 0) {
                eDate.setHours(11)
                sDate.setHours(9)
            } else if (slotPos == 1) {
                eDate.setHours(13)
                sDate.setHours(11)

            } else if (slotPos == 2) {
                eDate.setHours(17)
                sDate.setHours(13)
            }

            data.startTime = sDate
            data.endTime = eDate

            API.addAppointmentAPI(data).then((response: any) => {
                if (response.success) {
                    dispatch(globalConfigActions.enableFeedback(response.message));
                    _appointmentList({
                        startTime: new Date(new Date(weekFirstDay).setHours(0, 0, 0)),
                        endTime: new Date(new Date(weekLastDay).setHours(24, 59, 59)),
                        assigneeId: selectOption?.value || '',
                    });
                    setAppointmentDialog(false);
                    setStartLoader(false)
                } else {
                    dispatch(globalConfigActions.enableFeedback(response.message));
                    setAppointmentDialog(false);
                    setStartLoader(false)
                }
            })
        } catch (error) {
            console.log("error", error);
        }

        // props._addAppointment(data);
    }

    const RefreshList = () => {
        let curr = new Date; // get current date
        let first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        let last = first + 6; // last day is the first day + 6
        let firstday = new Date(curr.setDate(first)).toUTCString();
        let lastday = new Date(curr.setDate(last)).toUTCString();

        setWeekFirstDay(firstday)
        setWeekLastDay(lastday)

        _loadingDataAction(false);
        _slugUpdate(props);
        _appointmentList({
            startTime: new Date(weekFirstDay || new Date(new Date(firstday).setHours(0, 0, 0))),
            endTime: new Date(weekLastDay || new Date(lastday).setHours(24, 59, 59))
        });

    }

    return (
        <Grid container style={{ marginTop: 10 }} component={Paper}>
            <Grid item xs={12} className="darkTableStyle TableScrolling">
                <MaterialTable
                    title="Appointments"
                    columns={columns}
                    data={data}
                    isLoading={loadingCal}
                    options={{
                        pageSize: limitMatrix,
                        emptyRowsWhenPaging: false,
                        exportButton: false,
                        filtering: false,
                        search: false,
                    }}
                    onOrderChange={(sort, sortType) => {
                        let h = { ...props };
                        if (sort === -1) {
                            h.sort = "createdAt";
                            h.sortType = "desc";
                        } else {
                            h.sort = columns[sort].field;
                            h.sortType = sortType;
                        }
                    }}
                    key={limitMatrix}
                    components={{
                        Pagination: () => {
                            return (
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    count={count}
                                    rowsPerPage={limitMatrix}
                                    page={pageMatrix - 1}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            );
                        },
                        Toolbar: props => (
                            <Grid container
                                style={{ padding: '0 15px', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <Grid item>
                                    <h6 className={classes.fontStyle}>Appointments</h6>
                                </Grid>
                                <Grid item className={classes.assigneeDrop}>
                                    <Select
                                        styles={customStyles}
                                        variant="outlined"
                                        id="assignee"
                                        placeholder="Select Sales Rep"
                                        onChange={(e) => {
                                            handleChangeAssignee(e)
                                        }}
                                        defaultValue={selectOption}
                                        margin="normal"
                                        aria-describedby="assignee-error"
                                        name="assignee"
                                        options={AssigneeList}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.btnStyle}
                                        onClick={ClearSelectValues}
                                        disabled={!selectOption}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => handleChangeWeek('prev')}>
                                        <ArrowBackIosRoundedIcon />
                                    </Button>
                                    <span>
                                        {moment(weekFirstDay).format('MMM Do YY')} - {moment(weekLastDay).format('MMM Do YY')}
                                    </span>
                                    <Button onClick={() => handleChangeWeek('next')}>
                                        <ArrowForwardIosRoundedIcon />
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.btnStyle}
                                        onClick={RefreshList}
                                    >
                                        <RefreshIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                        ),
                    }}
                />
            </Grid>
            {isShowAddAppointment &&
                <Suspense fallback={<>Loading...</>}>
                    <AddAppointment
                        {...props}
                        rowData={appointmentRow}
                        isUnAvailable={isUnAvailable}
                        slotPosition={slotPos}
                        slotPosDate={slotPosDate}
                        showingFrom="Dashboard"
                        isCloseAppointment={() => { setIsShowAddAppointment('') }}
                        weekFirstDay={weekFirstDay}
                        weekLastDay={weekLastDay}
                    >
                    </AddAppointment>
                </Suspense>
            }

            {isViewAddAppointment &&
                <Suspense fallback={<>Loading...</>}>
                    <ViewAppointment
                        {...props}
                        rowData={rowData}
                        showingFrom="Dashboard"
                        isCloseAppointment={() => { setIsViewAddAppointment('') }}
                    >
                    </ViewAppointment>
                </Suspense>
            }

            <Dialog
                fullWidth={true}
                maxWidth={'sm'}
                onClose={handleCloseDialog}
                aria-labelledby="simple-dialog-title"
                open={appointmentDialog}
                style={{ textAlign: 'center' }}
            >
                <DialogTitle style={{ paddingTop: '30px' }} id="simple-dialog-title">Select one Appointment option</DialogTitle>
                <DialogActions style={{ justifyContent: "center", paddingBottom: '30px' }}>
                    <Button color="primary" onClick={openAppointmentDrawer} variant="contained" type='button'>
                        Available
                        {/* {<CircularProgress style={{ marginRight: '20px' }} />} */}
                    </Button>
                    <Button color="secondary" onClick={UnAvailableAppointmentCreate} variant="contained" type='button'>
                        UnAvailable
                    </Button>{startLoader && <CircularProgress />}
                </DialogActions>
            </Dialog>

        </Grid>
    );
}