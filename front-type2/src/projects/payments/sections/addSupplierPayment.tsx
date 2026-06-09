import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { commissionTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import InputAdornment from '@material-ui/core/InputAdornment';
import {
    paymentAction,
    selectPaymentState,
} from "../redux/payments";

export default function addSupplierPayment(props) {
    const ds = "550px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Supplier Payment"
            open={props.open == "addSupplierPayments" ? true : false}
            onClose={props.onClose.bind(this)}
            {...props}
        >
            <AddSuppPaymentLogic {...props} />
        </MyDrawer>
    );
}

function AddSuppPaymentLogic(props) {

    const paymentState = useSelector(selectPaymentState);

    const _addSupplierPayment = (payload) =>
        dispatch(paymentAction.addSupplierPayment(payload));
    const _closeSidebarFun = (payload) =>
        dispatch(paymentAction.closeSidebarFun(payload));

    const [startLoader, setStartLoader] = useState(false);

    useEffect(() => {
        if (paymentState.addLoader) {
            setStartLoader(false);
        }
    }, [paymentState.addLoader]);

    useEffect(() => {
        if (paymentState.hideSidebar) {
            props.onClose();
            _closeSidebarFun(false);
        }
    }, [paymentState.hideSidebar]);

    const dispatch = useDispatch();

    const initialValues = {
        amount: "",
        paymentType: null,
        comment: "",
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(value, { resetForm }) => {
                let obj: any = {}
                const supplierId = props?.data?.supplierId
                const quoteId = props?.data?.quoteId

                if (value.amount) obj.amount = value.amount
                if (value.paymentType) obj.commissionType = value.paymentType.value
                if (value.comment) obj.comment = value.comment
                if (supplierId) obj.supplierId = supplierId
                if (quoteId) obj.quoteId = quoteId

                _addSupplierPayment(obj);
                setStartLoader(true);
                resetForm();
            }}
            validationSchema={Yup.object().shape({
                amount: Yup.string().required("Amount is required"),
                paymentType: Yup.string().required("Please select payment type!"),
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
                            <Grid item xs={12} md={12}>
                                <TextField
                                    variant="outlined"
                                    error={errors.amount && touched.amount ? true : false}
                                    id="amount"
                                    className="WidhtFull100"
                                    label="Amount"
                                    type="number"
                                    value={values.amount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <p>£</p>
                                            </InputAdornment>
                                        ),
                                    }}
                                    margin="normal"
                                    aria-describedby="amount-error"
                                />
                                {errors.amount && touched.amount && (
                                    <FormHelperText className="errormsg" id="amount-error">
                                        {errors.amount}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Select
                                    className={
                                        errors.paymentType && touched.paymentType
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="paymentType"
                                    placeholder="Select Payment Type"
                                    value={values.paymentType}
                                    onChange={(e) => {
                                        setFieldValue("paymentType", e);
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="paymentType-number-error"
                                    name="colors"
                                    options={commissionTypeOptions}
                                />
                                {errors.paymentType && touched.paymentType && (
                                    <FormHelperText className="errormsg" id="paymentType-error">
                                        {errors.paymentType}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <TextField
                                    variant="outlined"
                                    id="comment"
                                    className="WidhtFull100"
                                    label="Comment"
                                    type="text"
                                    value={values.comment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    rows={4}
                                    margin="normal"
                                    aria-describedby="comment-error"
                                />
                            </Grid>
                        </Grid>

                        <CardActions
                            style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                        >
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={handleReset}
                                disabled={!dirty || isSubmitting}
                            >
                                Reset
                            </Button>
                            <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Add Payment
                            </Button>
                            {startLoader && <CircularProgress />}
                        </CardActions>
                    </form>
                );
            }}
        </Formik>
    );
}
