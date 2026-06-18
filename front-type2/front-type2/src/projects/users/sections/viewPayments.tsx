import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import {
    paymentAction,
    selectPaymentState,
} from "../../payments/redux/payments";
import moment from 'moment';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { paymentReducer, paymentSaga, sliceKeyPayment } from "../../payments/redux/payments";
import { UserPaymentStatus } from '../../../sharedUtils/globalHelper/constantValues'
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Snackbar from '@material-ui/core/Snackbar';
import { Formik } from "formik";
import * as Yup from "yup";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from "@material-ui/core/TablePagination";
import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles(() => ({
    IconSize: {
        fontSize: "1rem",
    },
    CountBtnStyle: {
        minWidth: "200px",
        textAlign: "center",
        "@media(max-width:480px)": {
            minWidth: "auto",
            display: "block",
            padding: 15,
        },
    },
    ViewActionBtn: {
        background: "#193562",
        width: "26px",
        height: "26px",
        borderRadius: 3,
        padding: "3px",
        color: "#ffffff",
        "&:hover": {
            background: "#193562",
        },
        boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
    },
    assigneeDrop: {
        minWidth: '350px',
        margin: '0 0 0 auto',
    },
    fontStyle: {
        fontSize: '21px',
        fontWeight: 500,
        padding: '1rem 0',
        margin: 0,
    },
}));

export default function ViewPaymentLogic(props) {
    useInjectReducer({ key: sliceKeyPayment, reducer: paymentReducer });
    useInjectSaga({ key: sliceKeyPayment, saga: paymentSaga });

    const classes = useStyles();

    const paymentState = useSelector(selectPaymentState);

    const _viewSalesRepPayments = (payload) =>
        dispatch(paymentAction.viewSalesRepPayments(payload));
    const _dropdownQuoteList = (payload) =>
        dispatch(paymentAction.dropdownQuoteList(payload));
    const _editMonthlyPayout = (payload) =>
        dispatch(paymentAction.editMonthlyPayout(payload));

    const _loadingDataAction = (payload) =>
        dispatch(paymentAction.salesRepCommissionHistoryLoaderStart(payload));
    const _basicAction = (payload) =>
        dispatch(paymentAction.historyBasicActions(payload));
    const _nextPage = (payload) =>
        dispatch(paymentAction.salesRepNewPage(payload));
    const _listLimit = (payload) =>
        dispatch(paymentAction.salesRepChangeLimit(payload));

    const {
        comissLoader,
        comissLimit,
        comissPage,
        comissCount,
    } = paymentState

    useEffect(() => {
        if (props.user?._id) {
            _viewSalesRepPayments({ user: props.user?._id });
            _dropdownQuoteList({ user: props.user?._id })
        }
    }, [])

    useEffect(() => {
        if (paymentState.salesrepLoader) {
            setStartLoader(false);
            setSelectedStatus(null);
            setSelectedRows([]);
        }
    }, [paymentState.salesrepLoader])

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    const [open, setOpen] = React.useState(false);
    const [startLoader, setStartLoader] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = React.useState(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState(null);
    const [isQuoteId, setQuoteId] = React.useState(null);
    const [selectOption, setSelectOption] = useState(null);
    const [selectedPaymentStatus, setPaymentStatus] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isShowStatus, setIsShowStatus] = useState(false);

    const dispatch = useDispatch();

    let QuoteOptions = []
    if (paymentState.quoteDropdownList.length > 0) {
        QuoteOptions = paymentState.quoteDropdownList.map((e) => ({
            label: e.QuoteID,
            value: e.QuoteID,
        }))
    }


    const commissionColumns = [
        {
            title: 'Quote ID',
            field: 'quiteId',
            sorting: false,
        },
        {
            title: 'Payment Date',
            field: 'date',
            sorting: false,
        },
        {
            title: 'Total Payable Amount',
            field: 'amount',
            sorting: false,
            render: (data) => (
                data.commissionType === "Commission" ? <span>{data.amount}</span> : <span>-{data.amount}</span>
            )
        },
        {
            title: 'Total Commission',
            field: 'totalCommissionAmount',
            sorting: false,
            render: (data) => (
                <span>{data.totalCommissionAmount}</span>
            )
        },
        {
            title: 'Payment Type',
            field: 'commissionType',
            sorting: false,
        },
        {
            title: 'Split Percentage',
            field: 'percentage',
            sorting: false,
        },
        {
            title: 'Status',
            field: 'paymentType',
            sorting: false,
        },
        {
            title: 'Note',
            field: 'comment',
            sorting: false,
            render: (data) => (
                <span>{data.comment && data.comment.length > 40 ? data.comment.substring(0, 40) + '...' : data.comment}</span>
            )
        },

    ]

    const commissionData = React.useMemo(() =>
        paymentState.salesRepPayments && paymentState.salesRepPayments.map((e) => {
            return {
                _id: e._id,
                paymentHistoryId: e.paymentHistoryId,
                quiteId: e?.quote?.QuoteID,
                commissionType: e.commissionType || '-',
                date: moment(e.date).format('DD-MMM-YYYY') || '-',
                totalCommissionAmount: e.totalCommissionAmount ? `£${e.totalCommissionAmount}` : '-',
                amount: e.amount ? `£${e.amount}` : '-',
                contractStatus: e.contractStatus || '-',
                percentage: e.percentage ? `${e.percentage}%` : '-',
                comment: e.comment,
                paymentType: e.paymentType,
            }
        }), [paymentState.salesRepPayments]);

    commissionData && commissionData.length > 0 && commissionData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const handleChangeStartDate = (date) => {
        setSelectedStartDate(date)
    }

    const handleChangeQuote = (e) => {
        setQuoteId(e)
    }

    const handleChangeEndDate = (date) => {
        setSelectedEndDate(date)
    }
    const handleChangePaymentStatus = (e) => {
        setPaymentStatus(e.value);
    }

    const HandleResetDate = () => {
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setSelectedStatus(null);
        setIsShowStatus(false);
        _viewSalesRepPayments({ user: props.user?._id, search: {} });
    }

    const handleChangeStatus = (value) => {
        setSelectedStatus(value)
    }

    const customStyles = {
        control: styles => ({ ...styles, minHeight: '36px', }),
        placeholder: styles => ({ ...styles }),
        singleValue: (styles, { data }) => ({ ...styles }),
        input: styles => ({ ...styles }),
    }

    const handleClose = () => {
        setOpen(false);
    };

    const {
        totalClawback,
        totalCommission,
        totalPaidCommission,
        totalPendingClawback,
        totalPendingCommission,
        totalReceivedClawback,
    } = paymentState?.salesRepPaymentsDetail


    const initialValues = {
        startDate: null,
        endDate: null,
        quote: null,
        paymentStatus: null,
    };

    function handleSelectChange(rows) {
        setSelectedRows(rows)
    }

    const UpdateStatus = (value, updateAll) => {
        setStartLoader(true);
        const obj: any = {}
        const search: any = {}
        if (isQuoteId) search['quote.QuoteID'] = isQuoteId.value
        if (selectedPaymentStatus) search.paymentType = selectedPaymentStatus
        if (selectedStartDate) search.startDate = new Date(selectedStartDate).toISOString()
        if (selectedEndDate) search.endDate = new Date(selectedEndDate).toISOString()

        obj.updateAll = updateAll
        obj.user = props.user?._id
        obj.type = 'commissionPayment'
        obj.search = search
        if (selectedStatus) obj.paymentType = selectedStatus.value

        if (updateAll === 2) {
            obj.paymentsIds = selectedRows && selectedRows.map((x) => ({
                paymentHistoryId: x.paymentHistoryId,
                paymentId: x._id
            }))
            _editMonthlyPayout(obj);
        }
        else if (updateAll === 1)
            if (selectedStartDate !== null && selectedEndDate !== null) {
                _editMonthlyPayout(obj);
            }
            else {
                setOpen(true);
                setStartLoader(false);
            }
    }

    const handleChangePage = (event, newPage) => {
        const h = { ...paymentState }
        h.comissPage = newPage + 1;
        _loadingDataAction(true);
        _basicAction({ comissCount: -1 });
        _nextPage(h);
    };

    const handleChangeRowsPerPage = (event) => {
        const h = { ...paymentState }
        h.comissLimit = event.target.value;
        _loadingDataAction(true);
        _basicAction({ comissCount: -1 });
        _listLimit(h);
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
                    const search: any = {}
                    if (values.startDate) search.startDate = new Date(values.startDate).toISOString()
                    if (values.endDate) search.endDate = new Date(values.endDate).toISOString()
                    if (values.quote) search['quote.QuoteID'] = values.quote.value
                    if (values.paymentStatus) search.paymentType = values.paymentStatus.value
                    _viewSalesRepPayments({ user: props.user?._id, search: search });
                    setIsShowStatus(true);
                }}
                validationSchema={Yup.object().shape({
                   
                    endDate: Yup.date()
                        .min(
                            Yup.ref('startDate'),
                            'End Date should be greater than start date',
                        ).nullable()
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
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                variant="dialog"
                                                inputVariant="outlined"
                                                margin="normal"
                                                value={values.startDate}
                                                disableFuture
                                                id="startDate"
                                                name="startDate"
                                                error={
                                                    errors.startDate && touched.startDate
                                                        ? true
                                                        : false
                                                }
                                                format="dd/MM/yyyy"
                                                helperText={""}
                                                placeholder="Start Date"
                                                className="WidhtFull100"
                                                onChange={(e) => {
                                                    setFieldValue("startDate", e)
                                                    handleChangeStartDate(e)
                                                }}
                                                onBlur={handleBlur}
                                                size='medium'
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    {errors.startDate && touched.startDate && (
                                        <FormHelperText
                                            className="errormsg"
                                            id="startDate-error"
                                        >
                                            {errors.startDate}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justify="space-around">
                                            <KeyboardDatePicker
                                                variant="dialog"
                                                inputVariant="outlined"
                                                margin="normal"
                                                disableFuture
                                                value={values.endDate}
                                                error={
                                                    errors.endDate && touched.endDate
                                                        ? true
                                                        : false
                                                }
                                                id="endDate"
                                                name="endDate"
                                                format="dd/MM/yyyy"
                                                helperText={""}
                                                placeholder="End Date"
                                                className="WidhtFull100"
                                                onChange={(e) => {
                                                    setFieldValue("endDate", e)
                                                    handleChangeEndDate(e)
                                                }}
                                                onBlur={handleBlur}
                                                size='medium'
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    {errors.endDate && touched.endDate && (
                                        <FormHelperText
                                            className="errormsg"
                                            id="endDate-error"
                                        >
                                            {errors.endDate}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Select
                                        variant="outlined"
                                        id="quote"
                                        value={values.quote}
                                        placeholder="Select Quote"
                                        onChange={(e) => {
                                            setFieldValue("quote", e)
                                            handleChangeQuote(e)
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="quote-error"
                                        name="quote"
                                        options={QuoteOptions}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Select
                                        variant="outlined"
                                        id="paymentStatus"
                                        value={values.paymentStatus}
                                        placeholder="Status"
                                        onChange={(e) => {
                                            setFieldValue("paymentStatus", e)
                                            handleChangePaymentStatus(e)
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="paymentStatus-error"
                                        name="paymentStatus"
                                        options={UserPaymentStatus}
                                    />
                                </Grid>
                            </Grid>

                            <CardActions
                                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                            >
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={() => {
                                        handleReset();
                                        props.resetForm();
                                        HandleResetDate();
                                    }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Filter
                                </Button>
                            </CardActions>
                        </form>
                    );
                }}
            </Formik>

            <Grid container spacing={2} className="txt-uppercase">
                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Commission</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalCommission || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Pending Commission</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalPendingCommission || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Paid Commission</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalPaidCommission || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Clawback</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalClawback || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Pending Clawback</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalPendingClawback || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TableContainer component={Paper}>
                        <Table aria-label="caption table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <strong>Total Paid Clawback</strong>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'right' }}>
                                        <strong>£{totalReceivedClawback || 0}</strong>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            {selectedRows && selectedRows.length <= 0 && isShowStatus &&
                <Grid container spacing={2} className="txt-uppercase" style={{ marginBottom: 20 }}>

                    <Grid item className={classes.assigneeDrop}>
                        <Select
                            styles={customStyles}
                            variant="outlined"
                            id="status"
                            placeholder="Update Status"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            margin="normal"
                            aria-describedby="status-error"
                            name="status"
                            options={UserPaymentStatus}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '10px' }}
                            disabled={selectedStatus === null || selectedStatus === undefined ? true : false}
                            onClick={() => UpdateStatus('commissionPayment', 1)}
                        >
                            Update All
                        </Button>
                        {startLoader && <CircularProgress size={25} style={{ position: 'relative', top: 8, marginLeft: 12 }} />}
                    </Grid>
                </Grid>
            }

            {selectedRows && selectedRows.length > 0 &&
                <Grid container spacing={2} className="txt-uppercase" style={{ marginBottom: 20 }}>

                    <Grid item className={classes.assigneeDrop}>
                        <Select
                            styles={customStyles}
                            variant="outlined"
                            id="status"
                            placeholder="Update Status"
                            onChange={(e) => {
                                handleChangeStatus(e)
                            }}
                            defaultValue={selectedStatus}
                            margin="normal"
                            aria-describedby="status-error"
                            name="status"
                            options={UserPaymentStatus}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginLeft: '10px' }}
                            onClick={() => UpdateStatus('commissionPayment', 2)}
                        >
                            Update
                        </Button>
                        {startLoader && <CircularProgress size={25} style={{ position: 'relative', top: 8, marginLeft: 12 }} />}
                    </Grid>
                </Grid>
            }

            <Grid container spacing={2} className="txt-uppercase">
                <Grid item xs={12} md={12} className="tableCustomStyle">
                    <MaterialTable
                        columns={commissionColumns}
                        title=""
                        isLoading={paymentState.salesrepLoader}
                        data={commissionData}
                        key={comissLimit}
                        options={{
                            emptyRowsWhenPaging: false,
                            exportButton: false,
                            filtering: false,
                            search: false,
                            pageSize: comissLimit,
                            selection: true,
                        }}
                        onSelectionChange={(rows) => handleSelectChange(rows)}
                        components={{
                            Pagination: () => {
                                return (
                                    <div>
                                        <TablePagination
                                            style={{ width: "100%", padding: 0 }}
                                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                            count={comissCount}
                                            rowsPerPage={comissLimit}
                                            page={comissPage - 1}
                                            onChangePage={handleChangePage}
                                            onChangeRowsPerPage={handleChangeRowsPerPage}
                                        />
                                    </div>
                                );
                            },
                        }}
                    />
                </Grid>

            </Grid>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message="Please Select the Start and End Date"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </div>
    );
}
