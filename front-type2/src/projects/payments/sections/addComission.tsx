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
import {
    selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import { commissionTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import InputAdornment from '@material-ui/core/InputAdornment';
import {
    selectLoggedUser,
} from "../../authentication/redux/auth";
import {
    paymentAction,
    selectPaymentState,
} from "../redux/payments";
import {
    assigneeAction,
    selectAssigneeState,
} from "../../assignee/redux/assignee";

export default function addCommissionPayment(props) {
    const ds = "550px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Split Commission"
            open={props.open == "addCommissionPayments" ? true : false}
            onClose={props.onClose.bind(this)}
            {...props}
        >
            <AddCommiPaymentLogic {...props} />
        </MyDrawer>
    );
}

function AddCommiPaymentLogic(props) {

    const currentProps = props
    const paymentState = useSelector(selectPaymentState);
    const assigneeState = useSelector(selectAssigneeState);

    const _addPayment = (payload) =>
        dispatch(paymentAction.addPayment(payload));
    const _assigneeList = (payload) => dispatch(assigneeAction.list(payload));

    const [startLoader, setStartLoader] = useState(false);

    useEffect(() => {
        _assigneeList({});
    }, [])

    useEffect(() => {
        if (paymentState.isLoadingData && startLoader) {
            setStartLoader(false);
            props.onClose(true);
        }
    }, [paymentState.isLoadingData]);

    const dispatch = useDispatch();

    const initialValues = {
        amount: "",
        comment: "",
        commissionType: null,
    };

    let userList = [];
    if (assigneeState.assigneeListForDropdown) userList = assigneeState.assigneeListForDropdown.map((e) => ({ label: e.name, value: e._id }));

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(value, { resetForm }) => {
                let obj: any = {}
                const supplierId = props?.data?.supplierId
                const quoteId = props?.data?.quoteId

                if (value.amount) obj.amount = value.amount
                if (value.commissionType) obj.commissionType = value.commissionType.value
                if (value.comment) obj.comment = value.comment
                if (supplierId) obj.supplierId = supplierId
                if (quoteId) obj.quoteId = quoteId

                _addPayment(obj);
                setStartLoader(true);
                resetForm();
            }}
            validationSchema={Yup.object().shape({
                amount: Yup.string().required("Amount is required."),
                commissionType: Yup.string().required("Please select the type."),
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
                                    id="supplier"
                                    className="WidhtFull100"
                                    label="Supplier"
                                    value={currentProps.data?.supplier}
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <TextField
                                    variant="outlined"
                                    id="quote"
                                    className="WidhtFull100"
                                    label="Quote"
                                    value={currentProps.data?.ref}
                                    margin="normal"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

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
                                        errors.commissionType && touched.commissionType
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="commissionType"
                                    placeholder="Select Payment Type"
                                    value={values.commissionType}
                                    onChange={(e) => {
                                        setFieldValue("commissionType", e);
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="commissionType-number-error"
                                    name="colors"
                                    options={commissionTypeOptions}
                                />
                                {errors.commissionType && touched.commissionType && (
                                    <FormHelperText className="errormsg" id="commissionType-error">
                                        {errors.commissionType}
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
