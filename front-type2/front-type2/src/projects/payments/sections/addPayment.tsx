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
    globalConfigActions,
    selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import { flatFileServiceOption } from "../../../sharedUtils/globalHelper/constantValues";
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
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { taskAction, selectTaskState } from "../../task/redux/task";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
    iconStyle: {
        background: '#193562',
        color: '#ffffff',
        padding: '28px 16px',
        position: 'absolute',
        right: 0,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    }
}));

export default function AddNewPayment(props) {
    const ds = "1000px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Add Payment"
            open={props.open == "addPayment" ? true : false}
            onClose={props.onClose.bind(this)}
            {...props}
        >
            <AddNewPaymentLogic {...props} />
        </MyDrawer>
    );
}

function AddNewPaymentLogic(props) {
    const classes = useStyles();

    const globalState = useSelector(selectGlobalConfig);
    const userData = useSelector(selectLoggedUser);
    const paymentState = useSelector(selectPaymentState);
    const assigneeState = useSelector(selectAssigneeState);
    const taskState = useSelector(selectTaskState);

    const _addInternalPayment = (payload) =>
        dispatch(paymentAction.addInternalPayment(payload));
    const _assigneeList = (payload) => dispatch(assigneeAction.list(payload));
    const _supplierList = (payload) =>
        dispatch(globalConfigActions.supplierList(payload));
    const _dropdownQuoteList = (payload) =>
        dispatch(paymentAction.dropdownQuoteList(payload));
    const _companyListForDropdown = (payload) =>
        dispatch(taskAction.dropdownCompanyList(payload));
    const _singleCompanyDetail = (payload) =>
        dispatch(taskAction.singleCompany(payload));
    const _closeSidebarFun = (payload) =>
        dispatch(paymentAction.closeSidebarFun(payload));

    useEffect(() => {
        _supplierList(props);
    }, []);

    useEffect(() => {
        if (paymentState.addLoader)
            setStartLoader(false);
    }, [paymentState.addLoader])

    useEffect(() => {
        if (paymentState.hideSidebar) {
            props.onClose();
            _closeSidebarFun(false);
        }
    }, [paymentState.hideSidebar]);

    const [startLoader, setStartLoader] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [CurrentSearchText, setCurrentSearchText] = useState("");
    const [companyList, setCompanyList] = useState([]);
    const [quoteList, setQuoteList] = useState([]);
    const [isModifyData, setIsModifyData] = useState(false);
    const [isServiceType, setIsServiceType] = useState('');

    const dispatch = useDispatch();

    const initialValues = {
        supplier: null,
        quote: null,
        paymentType: null,
        company: null,
        uplift: "",
        service: null,
        unitDayRate: '',
        unitDaykWh: '',
        unitNightRate: '',
        unitNightkWH: '',
        unitWkdRate: '',
        unitWkdkWh: '',
        gasAq: '',
        gasUnitRate: '',
        contractAcceptDate: '',
    };

    let supplierList = [];

    if (globalState?.suppliers) {
        supplierList = globalState.suppliers.map((e: any) => ({
            label: e.supplierName,
            value: e.supplierName,
            id: e._id,
        })
        )
    }

    if (taskState.companies) {
        const data = taskState.companies.map((e) => ({
            label: e.businessName,
            value: e._id,
        }));

        if (companyList.length !== data.length) {
            setCompanyList(data);
        }
    }

    const searchInData = (event, action) => {
        if (event) setCurrentSearchText(event);
        setTimeout(function () {
            setIsLoadingData(false);
        }, 1000);
        if (event.length >= 0) {
            if (action === "company")
                _companyListForDropdown({
                    searchText: event,
                    limit: taskState.companies.length + 10,
                });
        }
    };

    const debounceOnChange = React.useCallback(
        helperMethods.debounce(searchInData, 400),
        []
    );

    const lazyLoadAPI = (event, action) => {
        setTimeout(function () {
            setIsLoadingData(false);
        }, 1000);
        if (action === "company" && taskState.companies.length <= 50)
            _companyListForDropdown({
                searchText: CurrentSearchText,
                limit: taskState.companies.length + 10,
            });
    };

    const onChangeAction = (event, actionFor) => {
        if (event.value) {
            if (actionFor === "Company") {
                setIsModifyData(true);
                _singleCompanyDetail({ companyID: event.value });
            }
        }
    };

    if (taskState.selectedCompany !== undefined &&
        taskState.selectedCompany &&
        Object.keys(taskState.selectedCompany).length > 0 &&
        isModifyData) {
        let QO = [];

        setIsModifyData(false);

        if (taskState.selectedCompany && taskState.selectedCompany[0].Quote) {
            taskState.selectedCompany[0].Quote.forEach((v) => {
                QO.push({ label: v.QuoteID, value: v._id });
            });
            setQuoteList(QO);
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(value, { setSubmitting, resetForm, setErrors }) => {
                let obj: any = {}

                if (value.supplier) obj.supplierId = value.supplier.id
                if (value.company) obj.companyId = value.company.value
                if (value.quote) obj.quoteId = value.quote.value
                if (value.service) obj.service = value.service.label
                if (value.contractAcceptDate) obj.contractAcceptDate = value.contractAcceptDate
                if (value.uplift) obj.uplift = value.uplift
                if (value.unitDayRate) obj.unitDayRate = value.unitDayRate
                if (value.unitDaykWh) obj.unitDaykWh = value.unitDaykWh
                if (value.unitNightRate) obj.unitNightRate = value.unitNightRate
                if (value.unitNightkWH) obj.unitNightkWH = value.unitNightkWH
                if (value.unitWkdRate) obj.unitWkdRate = value.unitWkdRate
                if (value.unitWkdkWh) obj.unitWkdkWh = value.unitWkdkWh
                if (value.gasUnitRate) obj.gasUnitRate = value.gasUnitRate
                if (value.gasAq) obj.gasAq = value.gasAq

                _addInternalPayment(obj);
                setStartLoader(true);
                resetForm();
            }}
            validationSchema={Yup.object().shape({
                quote: Yup.string().required("Please select the Quote.").nullable(),
                supplier: Yup.string().required("Please select the Supplier.").nullable(),
                company: Yup.string().required("Please select the Company.").nullable(),
                service: Yup.string().required("Please select the Service.").nullable(),
                contractAcceptDate: Yup.string().required("Please select the Contract Date."),
                uplift: Yup.string().required("Please enter the Uplift."),
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
                            <Grid item xs={12} md={6}>
                                <Select
                                    className={
                                        errors.supplier && touched.supplier
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="supplier"
                                    placeholder="Select Supplier"
                                    value={values.supplier}
                                    onChange={(e) => {
                                        setFieldValue("supplier", e);
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="supplier-number-error"
                                    name="colors"
                                    options={supplierList}
                                />
                                {errors.supplier && touched.supplier && (
                                    <FormHelperText className="errormsg" id="supplier-error">
                                        {errors.supplier}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Select
                                    className={
                                        errors.company && touched.company
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="company"
                                    placeholder="Search Company"
                                    value={values.company}
                                    onChange={(e) => {
                                        onChangeAction(e, "Company");
                                        setFieldValue("company", e);
                                    }}
                                    onInputChange={(e) => {
                                        setIsLoadingData(true);
                                        debounceOnChange(e, "company");
                                    }}
                                    onMenuScrollToBottom={(e) => {
                                        const isCallNewOne =
                                            taskState.companies.length % 10 === 0;
                                        if (isCallNewOne) {
                                            setIsLoadingData(true);
                                            lazyLoadAPI(e, "company");
                                        }
                                    }}
                                    isLoading={isLoadingData}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="company-number-error"
                                    name="colors"
                                    components={{
                                        LoadingIndicator() {
                                            return <CircularProgress />;
                                        },
                                    }}
                                    options={companyList}
                                />
                                {errors.company && touched.company && (
                                    <FormHelperText className="errormsg" id="company-error">
                                        {errors.company}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Select
                                    className={
                                        errors.quote && touched.quote
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="quote"
                                    placeholder="Search Quote"
                                    value={values.quote}
                                    onChange={(e) => {
                                        setFieldValue("quote", e);
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="quote-number-error"
                                    name="colors"
                                    options={quoteList}
                                />
                                {errors.quote && touched.quote && (
                                    <FormHelperText className="errormsg" id="quote-error">
                                        {errors.quote}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    error={errors.uplift && touched.uplift ? true : false}
                                    id="uplift"
                                    className="WidhtFull100"
                                    label="Uplift"
                                    type="number"
                                    value={values.uplift}
                                    InputProps={{ inputProps: { min: 0.1, max: 1.5, step: 0.1 } }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="uplift-error"
                                />
                                {errors.uplift && touched.uplift && (
                                    <FormHelperText className="errormsg" id="uplift-error">
                                        {errors.uplift}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Select
                                    className={
                                        errors.service && touched.service
                                            ? "ErrorColor"
                                            : ""
                                    }
                                    variant="outlined"
                                    id="service"
                                    placeholder="Select Service"
                                    value={values.service}
                                    onChange={(e) => {
                                        setFieldValue("service", e);
                                        setIsServiceType(e.value);
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    aria-describedby="service-number-error"
                                    name="colors"
                                    options={flatFileServiceOption}
                                />
                                {errors.service && touched.service && (
                                    <FormHelperText className="errormsg" id="service-error">
                                        {errors.service}
                                    </FormHelperText>
                                )}
                            </Grid>

                            {isServiceType === "gas" &&
                                <Grid container spacing={3} style={{ padding: 12 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.gasUnitRate && touched.gasUnitRate ? true : false}
                                            id="gasUnitRate"
                                            className="WidhtFull100"
                                            label="Day"
                                            type="number"
                                            value={values.gasUnitRate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="gasUnitRate-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>P</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.gasUnitRate && touched.gasUnitRate && (
                                            <FormHelperText className="errormsg" id="gasUnitRate-error">
                                                {errors.gasUnitRate}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.gasAq && touched.gasAq ? true : false}
                                            id="gasAq"
                                            className="WidhtFull100"
                                            label="Kwh"
                                            type="number"
                                            value={values.gasAq}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="gasAq-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>Kwh</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.gasAq && touched.gasAq && (
                                            <FormHelperText className="errormsg" id="gasAq-error">
                                                {errors.gasAq}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            }

                            {isServiceType === "electric" &&
                                <Grid container spacing={3} style={{ padding: 12 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitDayRate && touched.unitDayRate ? true : false}
                                            id="unitDayRate"
                                            className="WidhtFull100"
                                            label="Day"
                                            type="number"
                                            value={values.unitDayRate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitDayRate-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>P</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitDayRate && touched.unitDayRate && (
                                            <FormHelperText className="errormsg" id="unitDayRate-error">
                                                {errors.unitDayRate}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitDaykWh && touched.unitDaykWh ? true : false}
                                            id="unitDaykWh"
                                            className="WidhtFull100"
                                            label="Kwh"
                                            type="number"
                                            value={values.unitDaykWh}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitDaykWh-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>Kwh</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitDaykWh && touched.unitDaykWh && (
                                            <FormHelperText className="errormsg" id="unitDaykWh-error">
                                                {errors.unitDaykWh}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitNightRate && touched.unitNightRate ? true : false}
                                            id="unitNightRate"
                                            className="WidhtFull100"
                                            label="Night"
                                            type="number"
                                            value={values.unitNightRate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitNightRate-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>P</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitNightRate && touched.unitNightRate && (
                                            <FormHelperText className="errormsg" id="unitNightRate-error">
                                                {errors.unitNightRate}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitNightkWH && touched.unitNightkWH ? true : false}
                                            id="unitNightkWH"
                                            className="WidhtFull100"
                                            label="Kwh"
                                            type="number"
                                            value={values.unitNightkWH}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitNightkWH-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>Kwh</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitNightkWH && touched.unitNightkWH && (
                                            <FormHelperText className="errormsg" id="unitNightkWH-error">
                                                {errors.unitNightkWH}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitWkdRate && touched.unitWkdRate ? true : false}
                                            id="unitWkdRate"
                                            className="WidhtFull100"
                                            label="EW"
                                            type="number"
                                            value={values.unitWkdRate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitWkdRate-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>P</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitWkdRate && touched.unitWkdRate && (
                                            <FormHelperText className="errormsg" id="unitWkdRate-error">
                                                {errors.unitWkdRate}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.unitWkdkWh && touched.unitWkdkWh ? true : false}
                                            id="unitWkdkWh"
                                            className="WidhtFull100"
                                            label="Kwh"
                                            type="number"
                                            value={values.unitWkdkWh}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="unitWkdkWh-error"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment className={classes.iconStyle} position="end">
                                                        <p>Kwh</p>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {errors.unitWkdkWh && touched.unitWkdkWh && (
                                            <FormHelperText className="errormsg" id="unitWkdkWh-error">
                                                {errors.unitWkdkWh}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            }

                            <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            variant="dialog"
                                            inputVariant="outlined"
                                            disablePast
                                            error={errors.contractAcceptDate && touched.contractAcceptDate ? true : false}
                                            margin="normal"
                                            id="contractAcceptDate"
                                            // label="contractAcceptDate"
                                            name="contractAcceptDate"
                                            placeholder="Contract Date"
                                            helperText={''}
                                            allowKeyboardControl
                                            className="WidhtFull100"
                                            format="dd/MM/yyyy"
                                            value={values.contractAcceptDate ? values.contractAcceptDate : ""}
                                            onChange={(e) => setFieldValue("contractAcceptDate", e)}
                                            KeyboardButtonProps={{
                                                "aria-label": "change date",
                                            }}
                                            aria-describedby="contractAcceptDate-number-error"
                                        />
                                    </Grid>
                                </MuiPickersUtilsProvider>
                                {errors.contractAcceptDate && touched.contractAcceptDate && (
                                    <FormHelperText className="errormsg" id="contractAcceptDate-error">
                                        {errors.contractAcceptDate}
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
    );
}
