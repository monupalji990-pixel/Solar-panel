import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";

import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

const useStyles = makeStyles(() => ({
    Spacing: {
        marginTop: "3px",
        marginBottom: "10px",
    },
    HeaderStyle: {
        position: "absolute",
        top: 10,
        display: "flex",
        justifyContent: "center",
        width: "81%",
        marginLeft: "6%",
        "@media(max-width:480px)": {
            width: "36%",
            top: "14px",
            right: 0,
        },
    },
}));

export default function AddLead(props) {
    const ds = "550px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Add Payment"
            open={props.open === "addPaymentDrawer"}
            onClose={props.onClose.bind(this)}
        >
            <AddPaymentLogic {...props} />
        </MyDrawer>
    );
}

function AddPaymentLogic(props) {

    useEffect(() => {
        if (props.loadingState) {
            props.onClose();
            setStartLoader(false);
            props._isLoadingData(true, props.type);
            props._slugUpdate(props);
            props._viewSingleQuote({ quoteId: props.currentQuote._id });
        }
    }, [props.loadingState]);

    const [startLoader, setStartLoader] = useState(false);

    const initialValues = {
        title: "",
        paymentDueDate: null,
        amount: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().nullable().required("Title is Required"),
        amount: Yup.string().nullable().required("Amount is Required"),
        paymentDueDate: Yup.string().nullable().required("Payment Due Date is Required"),
    });

    return (
        <div className="app">
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            const quoteId = props.currentQuote?._id
                            const payment: any = {};
                            if (values.title) payment.title = values.title
                            if (values.amount) payment.amount = values.amount
                            if (values.paymentDueDate) payment.paymentDueDate = values.paymentDueDate

                            const obj = {
                                quoteId: quoteId,
                                payment: payment
                            }
                            setStartLoader(true);
                            props._addQuotePayment(obj);
                        }}
                        validationSchema={validationSchema}
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
                                        <Grid item md={12} sm={12} xs={12}>
                                            <TextField
                                                variant="outlined"
                                                error={errors.title && touched.title ? true : false}
                                                id="title"
                                                className="WidhtFull100"
                                                label="Title"
                                                type="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="title-error"
                                            />
                                            {errors.title && touched.title && (
                                                <FormHelperText className="errormsg" id="title-error">
                                                    {errors.title}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={12} sm={12}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    clearable
                                                    variant="dialog"
                                                    inputVariant="outlined"
                                                    error={
                                                        errors.paymentDueDate && touched.paymentDueDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    id="paymentDueDate"
                                                    className="WidhtFull100"
                                                    placeholder="Payment Due Date"
                                                    allowKeyboardControl
                                                    format="dd/MM/yyyy"
                                                    value={values.paymentDueDate ? values.paymentDueDate : null}
                                                    onChange={(e) => setFieldValue("paymentDueDate", e)}
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="paymentDueDate-number-error"
                                                />
                                            </MuiPickersUtilsProvider>
                                            {errors.paymentDueDate && touched.paymentDueDate && (
                                                <FormHelperText
                                                    className="errormsg"
                                                    id="paymentDueDate-error"
                                                >
                                                    {errors.paymentDueDate}
                                                </FormHelperText>
                                            )}
                                        </Grid>


                                        <Grid item md={12} sm={12} xs={12}>
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
                                                margin="normal"
                                                aria-describedby="amount-error"
                                            />
                                            {errors.amount && touched.amount && (
                                                <FormHelperText className="errormsg" id="amount-error">
                                                    {errors.amount}
                                                </FormHelperText>
                                            )}
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
                </Grid>
            </Grid>
        </div>
    );
}
