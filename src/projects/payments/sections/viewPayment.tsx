import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MaterialTable, { MTableToolbar } from "material-table";
import {
    paymentAction,
    selectPaymentState,
} from "../redux/payments";
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import ContractInformation from "../sections/contractInformation"
import PaymentDetails from "../sections/paymentDetail"
import makeStyles from "@material-ui/core/styles/makeStyles";
import SplitCommission from "../sections/split_commission"

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

export default function viewPayment(props) {
    const ds = "1300px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Payment"
            open={props.open == "viewPayments" ? true : false}
            onClose={props.onClose.bind(this)}
            {...props}
        >
            <ViewPaymentLogic {...props} />
        </MyDrawer>
    );
}

function ViewPaymentLogic(props) {

    const paymentState = useSelector(selectPaymentState);
    const [selectOption, setSelectOption] = useState(null);

    const _viewPayments = (payload) =>
        dispatch(paymentAction.viewPayments(payload));
    const _updateStatus = (payload) =>
        dispatch(paymentAction.updateStatus(payload));

    useEffect(() => {
        const obj = {
            supplierId: props?.data?.supplierId,
            quoteId: props?.data?.quoteId,
        }
        _viewPayments(obj);
    }, [])

    const [startLoader, setStartLoader] = useState(false);
    const [selectedTab, setSelectedTab] = React.useState("contract_info");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const dispatch = useDispatch();

    const tabHandleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const sqId = {
        supplierId: props?.data?.supplierId,
        quoteId: props?.data?.quoteId,
    }

    const supplierColumns = [
        {
            title: 'Amount',
            field: 'amount',
            sorting: false,
            render: (data) => (
                data.commissionType === "Commission" ? <span>£{data.amount}</span> : <span>-£{data.amount}</span>
            )
        },
        {
            title: 'Commission Type',
            field: 'commissionType',
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
    ]

    const supplierData = React.useMemo(() =>
        paymentState.supplierPayments && paymentState.supplierPayments.map((e) => {
            return {
                _id: e._id,
                amount: e.amount || '-',
                commissionType: e.commissionType || '-',
                date: moment(e.date).format('DD-MMM-YYYY') || '-',
                comment: e.comment || '-'
            }
        }), [paymentState.supplierPayments]);

    supplierData && supplierData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (paymentState.viewLoader) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

    let tableActionSupplier: any = [
        {
            icon: 'add',
            tooltip: "Add Payment",
            isFreeAction: true,
            onClick: props.setAddSuppDrawer,
        }
    ];

    return (
        <div>
            <Grid container spacing={2} className="txt-uppercase">
                <Grid item xs={12} md={12}>
                    <Paper>
                        <Tabs
                            variant="scrollable"
                            value={selectedTab}
                            scrollButtons="auto"
                            onChange={tabHandleChange}
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab label="Contract Information" value="contract_info" />
                            <Tab label="Payment Details" value="payment_detail" />
                            <Tab label="Supplier Payments" value="supplier" />
                            <Tab label="Split Commission" value="commission" />
                        </Tabs>
                    </Paper>
                </Grid>

                {selectedTab === 'contract_info' &&
                    <ContractInformation {...props} detail={paymentState.getPayments} />
                }

                {selectedTab === 'payment_detail' &&
                    <PaymentDetails {...props} data={paymentState.getPaymentsAllData} detail={paymentState.getPayments} />
                }

                {selectedTab === 'supplier' &&
                    <>
                        <Grid container spacing={2} className="txt-uppercase">
                            <Grid item md={12} xs={12} className="tableCustomStyle">
                                <MaterialTable
                                    columns={supplierColumns}
                                    title=""
                                    data={supplierData}
                                    options={{
                                        emptyRowsWhenPaging: false,
                                        exportButton: false,
                                        filtering: false,
                                        search: false,
                                        pageSize: 10,
                                        selection: false,
                                        pageSizeOptions: [5, 10, 25, 50, 100]
                                    }}
                                    actions={tableActionSupplier}
                                    components={{
                                        Toolbar: props => (
                                            <div style={{ position: "relative" }}>
                                                <MTableToolbar {...props} />
                                                <div style={{ padding: '0px 10px', position: "absolute", top: "22px", left: "8px", zIndex: 0 }}>
                                                    <span style={{ textTransform: "uppercase", fontWeight: 600, letterSpacing: "1px" }}>UpLift: {paymentState?.getPayments?.uplift}</span>
                                                </div>
                                            </div>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>
                }
                {selectedTab === 'commission' &&
                    <SplitCommission {...props} />
                }

            </Grid>
        </div>
    );
}
