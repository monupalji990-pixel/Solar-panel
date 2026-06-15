import React, { useRef, useState } from 'react';
import PaymentList from '../sections/paymentList';
import AddCommissionPayment from '../sections/addComission'
import AddSupplierPayment from '../sections/addSupplierPayment'
import ViewPayment from '../sections/viewPayment'
import { useDispatch } from 'react-redux';
import Filter from '../components/setFilter'
import {
    paymentAction,
} from "../redux/payments";
import AddPayments from '../sections/addPayment'
import EditPaymentHistory from '../sections/editPaymentHistory'

export const Common = (props: any) => {

    const [drawerIs, setDrawerIs] = useState(null);
    const [setDrawer, setSetDrawer] = useState(null);
    const [setADrawer, setSetADrawer] = useState(null);
    const [setBDrawer, setSetBDrawer] = useState(null);
    const [setPayDrawer, setSetPayDrawer] = useState(null);
    const [isEditDrawer, setEditDrawer] = useState(null);

    const [otherData, setOtherData] = useState({});

    const getUserTable = useRef(null);
    const dispatch = useDispatch();


    const _filterData = (payload) =>
        dispatch(paymentAction.FilterData(payload));
    const _editPayments = (payload) =>
        dispatch(paymentAction.editPayments(payload));

    function closeDrawer() {
        setSetDrawer(null);
    }

    function closeEditDrawer() {
        setEditDrawer(null);
    }

    function closeAddDrawer() {
        setSetADrawer(null);
    }
    function closeBAddDrawer() {
        setSetBDrawer(null);
    }

    function closePaymentAddDrawer() {
        setSetPayDrawer(null);
    }

    function setAddSuppDrawer() {
        setSetADrawer("addSupplierPayments");
    }
    function setAddCommiDrawer() {
        setSetBDrawer("addCommissionPayments");
    }

    function setAddPaymentDrawer() {
        setSetPayDrawer("addPayment");
    }

    function setViewEditDrawer(data, paymentId, sqId) {
        const x = {
            data: data,
            paymentId: paymentId,
            sqId: sqId,
        }
        setEditDrawer("editPayment");
        setOtherData(x);
    }

    function setViewDrawer(data) {
        setSetDrawer("viewPayments");
        setOtherData(data);
    }

    return (
        <>
            <Filter
                {...props}
                _filterData={_filterData}
            />
            <PaymentList
                {...props}
                getUserTable={getUserTable}
                tableRef={getUserTable}
                onClose={closeDrawer}
                _filterData={_filterData}
                setViewDrawer={setViewDrawer}
                setAddPaymentDrawer={setAddPaymentDrawer}
            />

            <AddPayments
                {...props}
                getUserTable={getUserTable}
                open={setPayDrawer}
                onClose={closePaymentAddDrawer}
            />

            <AddCommissionPayment
                {...props}
                open={setBDrawer}
                onClose={closeBAddDrawer}
                getUserTable={getUserTable}
                data={otherData}
            />

            <AddSupplierPayment
                {...props}
                open={setADrawer}
                onClose={closeAddDrawer}
                getUserTable={getUserTable}
                data={otherData}
            />

            <ViewPayment
                {...props}
                data={otherData}
                open={setDrawer}
                onClose={closeDrawer}
                setAddSuppDrawer={setAddSuppDrawer}
                setAddCommiDrawer={setAddCommiDrawer}
                setViewEditDrawer={setViewEditDrawer}
                getUserTable={getUserTable}
                _editPayments={_editPayments}
            />

            <EditPaymentHistory
                {...props}
                data={otherData}
                open={isEditDrawer}
                onClose={closeEditDrawer}
            />
            {drawerIs}
        </>

    );
};