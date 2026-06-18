import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import {
    paymentAction,
    selectPaymentState,
} from "../redux/payments";
import { UserPaymentStatus } from '../../../sharedUtils/globalHelper/constantValues'
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import TablePagination from "@material-ui/core/TablePagination";
import { Formik } from "formik";
import * as Yup from "yup";
import CardActions from "@material-ui/core/CardActions";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
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

export default function SupplierCommissions(props) {

    const classes = useStyles();

    const paymentState = useSelector(selectPaymentState);
    const [selectOption, setSelectOption] = useState(null);
    const paymentId = props?.data?._id;

    const {
        splitPage,
        splitLimit,
        splitCount,
    } = paymentState

    const _splitCommission = (payload) =>
        dispatch(paymentAction.splitCommission(payload));
    const _updateStatus = (payload) =>
        dispatch(paymentAction.updateStatus(payload));
    const _loadingDataAction = (payload) =>
        dispatch(paymentAction.splitHistoryLoaderStart(payload));
    const _basicAction = (payload) =>
        dispatch(paymentAction.historyBasicActions(payload));
    const _nextPage = (payload) =>
        dispatch(paymentAction.splitNewPage(payload));
    const _listLimit = (payload) =>
        dispatch(paymentAction.splitChangeLimit(payload));

    useEffect(() => {
        _splitCommission({
            paymentHistoryId: props.data._id,
            user: 'All'
        });
    }, [])

    const [startLoader, setStartLoader] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const dispatch = useDispatch();

    const sqId = {
        supplierId: props?.data?.supplierId,
        quoteId: props?.data?.quoteId,
    }

    const commissionColumns = [
        {
            title: 'Amount',
            field: 'amount',
            sorting: false,
            render: (data) => (
                data.commissionType === "Commission" ? <span>{data.amount}</span> : <span>-{data.amount}</span>
            )
        },
        {
            title: 'Commision Type',
            field: 'commissionType',
            sorting: false,
        },
        {
            title: 'Status',
            field: 'paymentType',
            sorting: false,
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
            title: 'Percentage',
            field: 'percentage',
            sorting: false,
        },
        {
            title: 'User',
            field: 'user',
            sorting: false,
        },
        {
            title: 'Payment Date',
            field: 'date',
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
        {
            width: "10%",
            cellStyle: { width: "10%" },
            headerStyle: { width: "10%" },
            sorting: false,
            render: (rowData) => (
                <Tooltip title="View">
                    <IconButton
                        className={classes.ViewActionBtn}
                        aria-label="view"
                        onClick={() => props.setViewEditDrawer(rowData, paymentId, sqId)}
                    >
                        <VisibilityIcon className={classes.IconSize} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    const commissionData = React.useMemo(() =>
        paymentState.splitCommission && paymentState.splitCommission.map((e) => {
            return {
                _id: e._id,
                amount: e.amount ? `£${e.amount}` : '-',
                paymentType: e.paymentType || '-',
                date: moment(e.date).format('DD-MMM-YYYY') || '-',
                comment: e.comment || '-',
                commissionType: e.commissionType || '-',
                totalCommissionAmount: e.totalCommissionAmount ? `£${e.totalCommissionAmount}` : '-',
                user: (e.user && e.user?.name) || 'Edan Power',
                percentage: e.percentage ? `${e.percentage}%` : '-',
            }
        }), [paymentState.splitCommission]);

    commissionData && commissionData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (paymentState.viewLoader) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

    let tableActionCommission: any = [
        {
            icon: 'add',
            tooltip: "Add Payment",
            isFreeAction: true,
            onClick: props.setAddCommiDrawer,
        }
    ];

    const customStyles = {
        control: styles => ({ ...styles, minHeight: '36px', }),
        placeholder: styles => ({ ...styles }),
        singleValue: (styles) => ({ ...styles }),
        input: styles => ({ ...styles }),
    }

    const UpdateStatus = (value) => {
        const obj: any = {};
        if (selectedStatus) obj.paymentType = selectedStatus
        if (selectedRows) obj.paymentIds = selectedRows.map((e) => e._id)
        obj.type = value
        if (props.data?._id) obj.paymentHistoryId = props.data?._id

        const newObj = {
            obj: obj,
            sqId: sqId
        }
        _updateStatus(newObj)
    }

    function handleSelectChange(rows) {
        setSelectedRows(rows)
    }

    const handleChangeStatus = (e) => {
        setSelectedStatus(e.value)
    }

    const handleChangePage = (event, newPage) => {
        const h = { ...paymentState }
        h.splitPage = newPage + 1;
        _loadingDataAction(true);
        _basicAction({ splitCount: -1 });
        _nextPage(h);
    };

    const handleChangeRowsPerPage = (event) => {
        const h = { ...paymentState }
        h.splitLimit = event.target.value;
        _loadingDataAction(true);
        _basicAction({ splitCount: -1 });
        _listLimit(h);
    };

    const handleResetData = () => {
        _splitCommission({
            paymentHistoryId: props.data._id,
            user: 'All'
        });
    }


    const userList = [
        {
            label: 'ALL',
            value: 'All',
        },
        {
            label: 'EP',
            value: 'EP',
        },

    ]

    if (paymentState.getPayments && paymentState.getPayments?.quoteId?.Assignee) {
        userList.push(
            {
                label: paymentState.getPayments?.quoteId?.Assignee?.name,
                value: paymentState.getPayments?.quoteId?.Assignee?._id,
            }
        )
    }

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    padding: 10,
                    boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
                    margin: '20px 0px',
                    borderRadius: 5
                }}>
                <Formik
                    initialValues={{
                        startDate: null,
                        endDate: null,
                        user: null
                    }}
                    onSubmit={(values) => {
                        const search: any = {}
                        if (values.startDate) search.startDate = new Date(values.startDate).toISOString()
                        if (values.endDate) search.endDate = new Date(values.endDate).toISOString()
                        _splitCommission({
                            paymentHistoryId: props.data._id,
                            user: values.user.value,
                            search: search
                        });
                    }}
                    validationSchema={Yup.object().shape({
                        endDate: Yup.date()
                            .min(
                                Yup.ref('startDate'),
                                'End Date should be greater than start date',
                            )
                    })}
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
                                                    id="startDate"
                                                    disableFuture
                                                    name="startDate"
                                                    error={
                                                        errors.startDate && touched.startDate
                                                            ? true
                                                            : false
                                                    }
                                                    helperText={""}
                                                    placeholder="Start Date"
                                                    className="WidhtFull100"
                                                    format="dd/MM/yyyy"
                                                    onChange={(e) => {
                                                        setFieldValue("startDate", e)
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
                                                    value={values.endDate}
                                                    id="endDate"
                                                    name="endDate"
                                                    disableFuture
                                                    helperText={""}
                                                    error={
                                                        errors.endDate && touched.endDate
                                                            ? true
                                                            : false
                                                    }
                                                    placeholder="End Date"
                                                    className="WidhtFull100"
                                                    format="dd/MM/yyyy"
                                                    onChange={(e) => {
                                                        setFieldValue("endDate", e)
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
                                            id="user"
                                            value={values.user}
                                            placeholder="Select User"
                                            onChange={(e) => {
                                                setFieldValue("user", e)
                                            }}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="user-error"
                                            name="user"
                                            options={userList}
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
                                            handleResetData();
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
            </div>

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
                            onClick={() => UpdateStatus('commissionPayment')}
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
            }

            <Grid container spacing={2} className="txt-uppercase">
                <Grid item xs={12} md={12} className="tableCustomStyle">
                    <MaterialTable
                        columns={commissionColumns}
                        title=""
                        key={splitLimit}
                        tableRef={props.tableRef}
                        isLoading={paymentState.splitLoader}
                        data={commissionData}
                        options={{
                            emptyRowsWhenPaging: false,
                            exportButton: false,
                            filtering: false,
                            search: false,
                            pageSize: splitLimit,
                            selection: true,
                        }}
                        actions={tableActionCommission}
                        onSelectionChange={(rows) => handleSelectChange(rows)}
                        components={{
                            Pagination: () => {
                                return (
                                    <div>
                                        <TablePagination
                                            style={{ width: "100%", padding: 0 }}
                                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                            count={splitCount}
                                            rowsPerPage={splitLimit}
                                            page={splitPage - 1}
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
        </div >
    );
}
