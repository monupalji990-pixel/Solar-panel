import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { paymentReducer, paymentSaga, sliceKeyPayment } from "../../payments/redux/payments";
import Grid from "@material-ui/core/Grid";
import {
    selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MaterialTable from "material-table";
import {
    paymentAction,
    selectPaymentState,
} from "../../payments/redux/payments";
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment'

export default function viewPaymentHistory(props) {

    useInjectReducer({ key: sliceKeyPayment, reducer: paymentReducer });
    useInjectSaga({ key: sliceKeyPayment, saga: paymentSaga });

    const globalState = useSelector(selectGlobalConfig);
    const paymentState = useSelector(selectPaymentState);

    const _viewPayments = (payload) =>
        dispatch(paymentAction.viewPayments(payload));

    useEffect(() => {
        const obj = {
            quoteId: props?.quote?._id,
        }
        _viewPayments(obj);
    }, [props?.quote?._id])

    const [startLoader, setStartLoader] = useState(false);
    const [selectedTab, setSelectedTab] = React.useState("supplier");

    const dispatch = useDispatch();

    const tabHandleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const supplierColumns = [
        {
            title: 'Amount',
            field: 'amount',
            sorting: false,
            render: (data) => (
                <span>£{data.amount}</span>
            )
        },
        {
            title: 'Payment Type',
            field: 'paymentType',
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
        },
    ]

    const supplierData = paymentState?.getPayments
        && paymentState?.getPayments?.supplierPayments
        && paymentState?.getPayments?.supplierPayments.map((e) => {
            return {
                _id: e._id,
                amount: e.amount || '-',
                paymentType: e.paymentType || '-',
                date: moment(e.date).format('DD-MMM-YYYY') || '-',
                comment: e.comment || '-'
            }
        })

    const commissionColumns = [
        {
            title: 'Amount',
            field: 'amount',
            sorting: false,
            render: (data) => (
                <span>£{data.amount}</span>
            )
        },
        {
            title: 'Payment Type',
            field: 'paymentType',
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
        },
    ]

    const commissionData = paymentState?.getPayments
        && paymentState?.getPayments?.commissionPayments
        && paymentState?.getPayments?.commissionPayments.map((e) => {
            return {
                _id: e._id,
                amount: e.amount || '-',
                paymentType: e.paymentType || '-',
                date: moment(e.date).format('DD-MMM-YYYY') || '-',
                comment: e.comment || '-'
            }
        })

    if (paymentState.viewLoader) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

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
                            <Tab label="Supplier Payments" value="supplier" />
                            <Tab label="Commission Payments" value="commission" />
                        </Tabs>
                    </Paper>
                </Grid>

                {selectedTab === 'supplier' &&
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
                            }}
                        />
                    </Grid>
                }
                {selectedTab === 'commission' &&
                    <Grid item xs={12} md={12} className="tableCustomStyle">
                        <MaterialTable
                            columns={commissionColumns}
                            title=""
                            data={commissionData}
                            options={{
                                emptyRowsWhenPaging: false,
                                exportButton: false,
                                filtering: false,
                                search: false,
                            }}
                        />
                    </Grid>
                }
            </Grid>
        </div>
    );
}
