import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CardActions, Checkbox, CircularProgress, DialogActions, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar } from "@material-ui/core";
import Select from "react-select";
import { Alert } from "@material-ui/lab";
import { DropzoneArea } from 'material-ui-dropzone';
import Api from '../../quote/redux/model/quote';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { EPCRatingOptions, Title } from "sharedUtils/globalHelper/constantValues";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";
import { consumerAction, selectConsumerState } from "projects/consumer/redux/consumer";

declare const google

const useStyles = makeStyles({
    wrapper: {
        position: 'relative',
    },
    card: {
        maxWidth: 'calc(70vw)',
        padding: 30,
        minWidth: 400,
        margin: 30,
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        borderRadius: 5,
        "@media (max-width: 720px)": {
            minWidth: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            margin: '0'
        }
    },
    media: {
        height: 100,
        backgroundSize: "45%",
    },
    Mainform: {
        display: "flex",
        justifyContent: "center",
        "@media (max-width: 720px)": {
            display: "block",
        }
    },
    MainDivform: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6f7fb",
        "@media (max-width: 720px)": {
            display: "block",
        }
    },
    textField: {
        minWidth: "100%",
        marginTop: 0,
        marginBottom: 18,
    },
    buttons: {
        margin: "0.1rem",
        color: "white",
        width: "100%",
        background: "#FFFFFF 0% 0% no-repeat padding-box",
        // border: "2px solid #0CADCF",
        borderRadius: "20px 20px 23px 20px",
    },
    buttonProgress: {
        color: '#ffffff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

export function MainPage(props) {

    const classes = useStyles();
    const [state, setState] = React.useState({
        open: false,
        successMsg: null,
        errorMsg: null,
        verifyLoader: false,
        submitLoader: false,
        fileUploading: false,
        formSubmitted: false,
        isNewConsumer: false,
    });
    const [startLoader, setStartLoader] = useState(false);
    const [ageCalc, setAgeCalc] = useState(null);
    const [LatitudeLongitude, setLatitudeLongitude] = useState(null);
    const [results, setResults] = React.useState([]);
    const dispatch = useDispatch();
    const consumerState = useSelector(selectConsumerState);

    const _addConsumer = (payload) =>
        dispatch(consumerAction.addConsumer(payload));

    let baseURL;
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8087/api/";
    } else {
        baseURL = "/api/";
    }

    useEffect(() => {
        if (consumerState.success) {
            setStartLoader(false);
            setState({ ...state, isNewConsumer: false})
        }
    }, [consumerState.success]);

    const VerifyCustomerUser = async (data) => {
        if (data.assignee && data.customer) {
            setState({ ...state, verifyLoader: true })

            axios({
                method: "post",
                url: baseURL + 'form/email-check',
                withCredentials: true,
                data: {
                    assignee: data.assignee,
                    consumer: data.customer,
                },
            })
                .then((response) => {
                    if (!response.data.success) {
                        if (response.data.message === 'Consumer Not Found')
                            setState({ ...state, open: true, verifyLoader: false, errorMsg: response.data.message, successMsg: null, isNewConsumer: true })
                        else
                            setState({ ...state, open: true, verifyLoader: false, errorMsg: response.data.message, successMsg: null, isNewConsumer: false })
                    } else {
                        setState({ ...state, open: true, verifyLoader: false, errorMsg: null, successMsg: 'User Verify Successfully.' })
                    }
                })
                .catch((resp) => {
                    console.log("Catch Error----", resp)
                });
        } else {
            setState({ ...state, open: true, errorMsg: 'Please enter Assignee & Customer email to verify.', successMsg: null });
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setState({ ...state, open: false, successMsg: null, errorMsg: null });
    };

    const initialValues = {
        title: null,
        firstName: "",
        surName: "",
        addressOne: "",
        addressTwo: "",
        town: "",
        city: "",
        postcode: "",
        telephoneNumber: "",
        mobile: "",
        email: "",
        dob: "",
        age: ageCalc,
        bankName: "",
        sortCode: "",
        accountNumber: "",
        consumerId: "",
        siteAddress: "",
        EPCrating: null,
        address: null,
        lat: '',
        lon: ''
    };

    const handleChangeAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setAgeCalc(age);
        return age;
    };

    const sessionToken = new google.maps.places.AutocompleteSessionToken();

    const setPossiblePlacesFun = address => {
        var autocompleteService = new google.maps.places.AutocompleteService();

        autocompleteService.getPlacePredictions({
            input: address,
            sessionToken: sessionToken
        },
            displaySuggestions => {
                if (displaySuggestions) {
                    setResults(
                        displaySuggestions.map(e => ({
                            description: e.description,
                            place_id: e.place_id
                        }))
                    )
                }
            }
        )
    }

    let addressList = []
    addressList = results.map(e => ({
        label: e.description,
        value: e.place_id
    }))

    const setLatLongFun = place_id => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId: place_id }, function (results, status) {
            if (status === 'OK') {
                setLatitudeLongitude({
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng(),
                })
            }
        })
    }

    return (
        <article className="login-for-usser login-form1">
            {state.formSubmitted ?
                <React.Fragment>
                    <div className='content thankYouPage'>
                        <div className="wrapper-1">
                            <div className="wrapper-2">
                                <h1>Thank you !</h1>
                                <p>Thanks for submitting form.  </p>
                                <button className="go-home" onClick={() => setState({ ...state, formSubmitted: false })}>
                                    Click here to submit new form
                                </button>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
                :
                <React.Fragment>
                    <Helmet>
                        <title>Survey</title>
                        <meta name="description" content="" />
                    </Helmet>

                    <div style={{ textAlign: 'center', marginTop: 30 }}>
                        <h3>ECO 4 – Initial Contact Triage Questions</h3>
                    </div>

                    <div id="change_pwd" className={classes.MainDivform}>
                        <Formik
                            initialValues={{
                                customer: '',
                                address: '',
                                property: '',
                                EPC: false,
                                whoOwnProperty: '',
                                propertyFurnished: '',
                                loftAccess: '',
                                previosEPC: '',
                                propertyNumberFG: '',
                                benefitsInHouse: '',
                                benefitOptions: null,
                                benefitReceiver: '',
                                relationProperty: '',
                                benefitsLetter: '',
                                proofOfResidency: '',
                                proofOfId: '',
                                propertyCouncil: '',
                                householdIncome: '',
                                prevGovFunding: '',
                                approxFunding: '',
                                heatingSystem: '',
                                loftGotInsulation: '',
                                cavityWallInsulation: '',
                                boilerModal: '',
                                measures: null,
                                assignee: '',
                            }}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                if (values.assignee && values.customer) {
                                    setState({ ...state, submitLoader: true })
                                    const obj = { ...values }
                                    obj.benefitOptions = values.benefitOptions.map((e) => e.label)
                                    obj.measures = values.measures.label

                                    axios({
                                        method: "post",
                                        url: baseURL + 'form',
                                        withCredentials: true,
                                        data: {
                                            assignee: obj.assignee,
                                            consumer: obj.customer,
                                            data: obj
                                        },
                                    })
                                        .then((response) => {
                                            if (!response.data.success) {
                                                setState({ ...state, open: true, verifyLoader: false, errorMsg: response.data.message, successMsg: null, formSubmitted: false })
                                                resetForm()
                                            } else {
                                                setState({ ...state, open: true, verifyLoader: false, errorMsg: null, successMsg: response.data.message, formSubmitted: true })
                                            }
                                        })
                                        .catch((resp) => {
                                            console.log("Catch Error----", resp)
                                        });
                                } else {
                                    setState({ ...state, open: true, errorMsg: 'Please enter Assignee & Customer email to submit form.', successMsg: null, formSubmitted: false });
                                }
                            }}
                            validationSchema={Yup.object().shape({

                            })}
                        >
                            {(props) => {
                                const {
                                    values,
                                    touched,
                                    errors,
                                    isSubmitting,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue
                                } = props;
                                return (
                                    <form
                                        onSubmit={handleSubmit}
                                        id="survey_form"
                                        className={classes.Mainform}
                                    >
                                        <div className={classes.card}>
                                            <Grid container spacing={3}>
                                                <Grid item md={5} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.assignee && touched.assignee ? true : false
                                                        }
                                                        id="assignee"
                                                        label="Assignee"
                                                        type="email"
                                                        value={values.assignee}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Please enter Assignee Email"
                                                    />
                                                    {errors.assignee && touched.assignee && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="assignee-error"
                                                        >
                                                            {errors.assignee}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={5} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.customer && touched.customer ? true : false
                                                        }
                                                        id="customer"
                                                        label="Customer"
                                                        value={values.customer}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Please enter Customer Email/Mobile"
                                                    />
                                                    {errors.customer && touched.customer && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="customer-error"
                                                        >
                                                            {errors.customer}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={2} xs={12}>
                                                    <div className={classes.wrapper}>
                                                        <Button variant="contained" color="primary" onClick={() => VerifyCustomerUser(props.values)}>
                                                            Verify
                                                        </Button>
                                                        {state.verifyLoader && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                    </div>
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.address && touched.address ? true : false
                                                        }
                                                        id="address"
                                                        label="Address"
                                                        value={values.address}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                    {errors.address && touched.address && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="address-error"
                                                        >
                                                            {errors.address}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={7} xs={12}>
                                                    <FormLabel component="legend">Property</FormLabel>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            row
                                                            aria-label="property"
                                                            name="property"
                                                            value={values.property}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        >
                                                            <FormControlLabel
                                                                value="Detached"
                                                                control={<Radio color="primary" />}
                                                                label="Detached"
                                                            />
                                                            <FormControlLabel
                                                                value="Semi"
                                                                control={<Radio color="primary" />}
                                                                label="Semi"
                                                            />
                                                            <FormControlLabel
                                                                value="Mid Terrace"
                                                                control={<Radio color="primary" />}
                                                                label="Mid Terrace"
                                                            />
                                                            <FormControlLabel
                                                                value="End Terrace"
                                                                control={<Radio color="primary" />}
                                                                label="End Terrace"
                                                            />
                                                            <FormControlLabel
                                                                value="Flat"
                                                                control={<Radio color="primary" />}
                                                                label="Flat"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={5} xs={12}>
                                                    <FormLabel component="legend">Is the property fully furnished?</FormLabel>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            row
                                                            aria-label="propertyFurnished"
                                                            name="propertyFurnished"
                                                            value={values.propertyFurnished}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        >
                                                            <FormControlLabel
                                                                value="Yes"
                                                                control={<Radio color="primary" />}
                                                                label="Yes"
                                                            />
                                                            <FormControlLabel
                                                                value="No"
                                                                control={<Radio color="primary" />}
                                                                label="No"
                                                            />
                                                        </RadioGroup>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.whoOwnProperty && touched.whoOwnProperty ? true : false
                                                        }
                                                        id="whoOwnProperty"
                                                        label="Who owns the property?"
                                                        value={values.whoOwnProperty}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.whoOwnProperty && touched.whoOwnProperty && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="whoOwnProperty-error"
                                                        >
                                                            {errors.whoOwnProperty}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.loftAccess && touched.loftAccess ? true : false
                                                        }
                                                        id="loftAccess"
                                                        label="Is there access to the loft?"
                                                        value={values.loftAccess}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.loftAccess && touched.loftAccess && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="loftAccess-error"
                                                        >
                                                            {errors.loftAccess}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.previosEPC && touched.previosEPC ? true : false
                                                        }
                                                        id="previosEPC"
                                                        label="Is there a previous EPC on the property, what is the rating.
                                                Print this ready for discussion with customer"
                                                        value={values.previosEPC}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Check EPC register. Surveyor can door knock when in area."
                                                    />

                                                    {errors.previosEPC && touched.previosEPC && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="previosEPC-error"
                                                        >
                                                            {errors.previosEPC}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.propertyNumberFG && touched.propertyNumberFG ? true : false
                                                        }
                                                        id="propertyNumberFG"
                                                        label="Note down any other property numbers that are F or G"
                                                        value={values.propertyNumberFG}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.propertyNumberFG && touched.propertyNumberFG && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="propertyNumberFG-error"
                                                        >
                                                            {errors.propertyNumberFG}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.benefitsInHouse && touched.benefitsInHouse ? true : false
                                                        }
                                                        id="benefitsInHouse"
                                                        label="What benefits in the house?"
                                                        value={values.benefitsInHouse}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Check Benefit Eligibility Matrix"
                                                    />

                                                    {errors.benefitsInHouse && touched.benefitsInHouse && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="benefitsInHouse-error"
                                                        >
                                                            {errors.benefitsInHouse}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <Select
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        id="benefitOptions"
                                                        placeholder="Select Benefits"
                                                        value={values.benefitOptions}
                                                        onChange={(e) => {
                                                            setFieldValue("benefitOptions", e);
                                                        }}
                                                        onBlur={handleBlur}
                                                        isMulti
                                                        margin="normal"
                                                        aria-describedby="benefitOptions-number-error"
                                                        name="colors"
                                                        options={[
                                                            {
                                                                label: 'Forms Benefits',
                                                                value: 'Forms Benefits',
                                                            },
                                                            {
                                                                label: 'Child Benefits',
                                                                value: 'Child Benefits',
                                                            },
                                                            {
                                                                label: 'LA Flex Low Income',
                                                                value: 'LA Flex Low Income',
                                                            },
                                                            {
                                                                label: 'LA Flew Medical',
                                                                value: 'LA Flew Medical',
                                                            }
                                                        ]}
                                                        styles={{
                                                            control: styles => ({ ...styles, height: '40px' }),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.benefitReceiver && touched.benefitReceiver ? true : false
                                                        }
                                                        id="benefitReceiver"
                                                        label="Who is benefit receiver?"
                                                        value={values.benefitReceiver}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.benefitReceiver && touched.benefitReceiver && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="benefitReceiver-error"
                                                        >
                                                            {errors.benefitReceiver}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.relationProperty && touched.relationProperty ? true : false
                                                        }
                                                        id="relationProperty"
                                                        label="Property owner and benefit receiver relationship"
                                                        value={values.relationProperty}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.relationProperty && touched.relationProperty && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="relationProperty-error"
                                                        >
                                                            {errors.relationProperty}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.benefitsLetter && touched.benefitsLetter ? true : false
                                                        }
                                                        id="benefitsLetter"
                                                        label="Can they get benefits letter for survey?"
                                                        value={values.benefitsLetter}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Benefits App screenshot will also do if they registered"
                                                    />

                                                    {errors.benefitsLetter && touched.benefitsLetter && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="benefitsLetter-error"
                                                        >
                                                            {errors.benefitsLetter}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.proofOfResidency && touched.proofOfResidency ? true : false
                                                        }
                                                        id="proofOfResidency"
                                                        label="Proof of residency (utility bill within 3 months) for survey"
                                                        value={values.proofOfResidency}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Survey will take picture"
                                                    />

                                                    {errors.proofOfResidency && touched.proofOfResidency && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="proofOfResidency-error"
                                                        >
                                                            {errors.proofOfResidency}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.proofOfId && touched.proofOfId ? true : false
                                                        }
                                                        id="proofOfId"
                                                        label="Driving License, Passport for survey"
                                                        value={values.proofOfId}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Survey will take picture"
                                                    />

                                                    {errors.proofOfId && touched.proofOfId && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="proofOfId-error"
                                                        >
                                                            {errors.proofOfId}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.propertyCouncil && touched.propertyCouncil ? true : false
                                                        }
                                                        id="propertyCouncil"
                                                        label="Property comes under what council"
                                                        value={values.propertyCouncil}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Check for Flex Eligibity"
                                                    />

                                                    {errors.propertyCouncil && touched.propertyCouncil && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="propertyCouncil-error"
                                                        >
                                                            {errors.propertyCouncil}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.householdIncome && touched.householdIncome ? true : false
                                                        }
                                                        id="householdIncome"
                                                        label="Estimated total household income"
                                                        value={values.householdIncome}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.householdIncome && touched.householdIncome && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="householdIncome-error"
                                                        >
                                                            {errors.householdIncome}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.prevGovFunding && touched.prevGovFunding ? true : false
                                                        }
                                                        id="prevGovFunding"
                                                        label="Any previous government funding? If yes, list the work done"
                                                        value={values.prevGovFunding}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Previous funding may make it ineligible for ECO4"
                                                    />

                                                    {errors.prevGovFunding && touched.prevGovFunding && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="prevGovFunding-error"
                                                        >
                                                            {errors.prevGovFunding}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.approxFunding && touched.approxFunding ? true : false
                                                        }
                                                        id="approxFunding"
                                                        label="When was the funding done approximately"
                                                        value={values.approxFunding}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                    />

                                                    {errors.approxFunding && touched.approxFunding && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="approxFunding-error"
                                                        >
                                                            {errors.approxFunding}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.heatingSystem && touched.heatingSystem ? true : false
                                                        }
                                                        id="heatingSystem"
                                                        label="Are they happy with removal of old heating systems (Gas Fires, Storage/Panel Heaters)"
                                                        value={values.heatingSystem}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="This is a requirement for FTC customers"
                                                    />

                                                    {errors.heatingSystem && touched.heatingSystem && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="heatingSystem-error"
                                                        >
                                                            {errors.heatingSystem}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.loftGotInsulation && touched.loftGotInsulation ? true : false
                                                        }
                                                        id="loftGotInsulation"
                                                        label="Has loft got insulation? Approx how much and is it boarded?"
                                                        value={values.loftGotInsulation}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="This will help price up the work of LI"
                                                    />

                                                    {errors.loftGotInsulation && touched.loftGotInsulation && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="loftGotInsulation-error"
                                                        >
                                                            {errors.loftGotInsulation}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={6} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.cavityWallInsulation && touched.cavityWallInsulation ? true : false
                                                        }
                                                        id="cavityWallInsulation"
                                                        label="Have they got cavity wall insulation? And when it was done"
                                                        value={values.cavityWallInsulation}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="Need to get them to sign a letter and issue to CWI inspectors to see if a warranty exists"
                                                    />

                                                    {errors.cavityWallInsulation && touched.cavityWallInsulation && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="cavityWallInsulation-error"
                                                        >
                                                            {errors.cavityWallInsulation}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <TextField
                                                        error={
                                                            errors.boilerModal && touched.boilerModal ? true : false
                                                        }
                                                        id="boilerModal"
                                                        label="What make/model is the boiler, how old it is? Under warranty?"
                                                        value={values.boilerModal}
                                                        onChange={handleChange}
                                                        className={classes.textField}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        variant="outlined"
                                                        size="small"
                                                        helperText="This will help identify if the boiler is non condensing"
                                                    />

                                                    {errors.boilerModal && touched.boilerModal && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="boilerModal-error"
                                                        >
                                                            {errors.boilerModal}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item md={12} xs={12}>
                                                    <Select
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        id="measures"
                                                        placeholder="What Measures can we not consider doing  (delete as required)"
                                                        value={values.measures}
                                                        onChange={(e) => {
                                                            setFieldValue("measures", e);
                                                        }}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="measures-number-error"
                                                        name="colors"
                                                        options={[
                                                            {
                                                                label: 'EWI – External Wall',
                                                                value: 'EWI – External Wall',
                                                            },
                                                            {
                                                                label: 'IWI – Internal Wall',
                                                                value: 'IWI – Internal Wall',
                                                            },
                                                            {
                                                                label: 'CWI – Cavity',
                                                                value: 'CWI – Cavity',
                                                            },
                                                            {
                                                                label: 'RIRI – Room in Roof',
                                                                value: 'RIRI – Room in Roof',
                                                            },
                                                            {
                                                                label: 'LI – Loft',
                                                                value: 'LI – Loft',
                                                            },
                                                            {
                                                                label: 'Boiler – Non Condensing Boiler',
                                                                value: 'Boiler – Non Condensing Boiler',
                                                            },
                                                            {
                                                                label: 'FTC – First Time Central heating',
                                                                value: 'FTC – First Time Central heating',
                                                            },
                                                            {
                                                                label: 'UFI – Under Floor Insulation',
                                                                value: 'UFI – Under Floor Insulation',
                                                            },
                                                            {
                                                                label: 'Solar – Solar',
                                                                value: 'Solar – Solar',
                                                            },
                                                            {
                                                                label: 'Air Source Heat Pumps',
                                                                value: 'Air Source Heat Pumps',
                                                            }
                                                        ]}
                                                        styles={{
                                                            control: styles => ({ ...styles, height: '40px' }),
                                                        }}
                                                    />
                                                    <FormHelperText>Check Calculation List to see if job is viable commercially</FormHelperText>
                                                </Grid>

                                                <Grid container alignItems="flex-end" spacing={3} style={{ marginTop: 25 }}>
                                                    <Grid item md={12} xs={12} style={{ paddingBottom: 0 }}>
                                                        <h3>For Benefit - ESTC completely filled ticked, signed and dated</h3>
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Benefit letter (required if DWP comes back Unmatched on Unverified)</h5>
                                                        <Field name="benefitLetter">
                                                            {({ field, form, meta }) => (
                                                                <DropzoneArea
                                                                    filesLimit={1}
                                                                    dropzoneText="Please Upload File From Here"
                                                                    maxFileSize={15000000}
                                                                    {...field}
                                                                    onChange={(files) => {
                                                                        if (files.length > 0) {
                                                                            setState({ ...state, fileUploading: true })

                                                                            const data = new FormData();
                                                                            data.append("image", files[0]);

                                                                            axios({
                                                                                method: "post",
                                                                                url: baseURL + 'upload',
                                                                                data: data,
                                                                                headers: {
                                                                                    Accept: 'application/json',
                                                                                    'Content-Type': 'application/json',
                                                                                },
                                                                            })
                                                                                .then((response) => {
                                                                                    props.setFieldValue('benefitLetter', response.data?.data?.image[0]?.location || '')
                                                                                    setState({ ...state, fileUploading: false })
                                                                                })
                                                                                .catch((resp) => {
                                                                                    setState({ ...state, fileUploading: false })
                                                                                });
                                                                        }
                                                                    }}
                                                                    dropzoneClass="drop-zone-class"
                                                                />
                                                            )}
                                                        </Field>
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Council Tax Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('councilTaxBill', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Utility Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('utilityBill', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid container alignItems="flex-end" spacing={3} style={{ marginTop: 25 }}>
                                                    <Grid item md={12} xs={12} style={{ paddingBottom: 0 }}>
                                                        <h3>For Child Benefit - ESTC completely filled ticked, signed and dated</h3>
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Photo of the child benefit award letter (CBAN)</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('childBenefit', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Evidence: the last 3 months payslips alongside bank statements for the last 3 months from all accounts receiving an income, or the most recent year's P60.</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('evidence', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Council tax letter showing the number of adults residing at the address.</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('councilTaxLetter', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid container alignItems="flex-end" spacing={3} style={{ marginTop: 25 }}>
                                                    <Grid item md={12} xs={12} style={{ paddingBottom: 0 }}>
                                                        <h3>For LA Flex Low Income Route - Application completely filled, route ticked, signed and dated and evidence for that route collected.</h3>
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Benefit letter all pages, where the customer doesn’t have a benefit letter, we can accept a P60 or P45 of all residents over 18 years old living at the property.</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('benefitLetter2', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Bank statements, 3 months consecutive without any missing transactions of all residents over 18 years old living at the property.</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('bankStatements', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Payslips, 3 months for same month as bank statements of all residents over 18 years old living at the property.</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('payslips', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Council Tax Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('councilTaxBill2', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Utility Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('utilityBill2', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid container alignItems="flex-end" spacing={3} style={{ marginTop: 25 }}>
                                                    <Grid item md={12} xs={12} style={{ paddingBottom: 0 }}>
                                                        <h3>For LA Flex NHS Referrals Route - Application completely filled, route ticked, signed and dated and evidence for that route collected.</h3>
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Letter from NHS Trust or GP or NHS Primary Care Trust or Health Board</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('NhsTrustLetter', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Council Tax Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('councilTaxBill3', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12}>
                                                        <h5>Utility Bill</h5>
                                                        <DropzoneArea
                                                            filesLimit={5}
                                                            dropzoneText="Please Upload File From Here"
                                                            maxFileSize={15000000}
                                                            onChange={(files) => {
                                                                if (files.length > 0) {
                                                                    setState({ ...state, fileUploading: true })

                                                                    const data = new FormData();
                                                                    data.append("image", files[0]);

                                                                    axios({
                                                                        method: "post",
                                                                        url: baseURL + 'upload',
                                                                        data: data,
                                                                        headers: {
                                                                            Accept: 'application/json',
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                    })
                                                                        .then((response) => {
                                                                            props.setFieldValue('utilityBill3', response.data?.data?.image[0]?.location || '')
                                                                            setState({ ...state, fileUploading: false })
                                                                        })
                                                                        .catch((resp) => {
                                                                            setState({ ...state, fileUploading: false })
                                                                        });
                                                                }
                                                            }}
                                                            dropzoneClass="drop-zone-class"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Grid item md={12}>
                                                    <p>
                                                        <b>Gas bill required if it’s a FTCH (First Time Central Heating)</b> <br></br>
                                                        Please don't hesitate to ask for further clarification.
                                                    </p>
                                                </Grid>

                                                <Grid item md={12}>
                                                    {state.fileUploading &&
                                                        <LinearProgress />
                                                    }
                                                    <br />
                                                    <div className={classes.wrapper}>
                                                        <Button
                                                            size="large"
                                                            color="primary"
                                                            variant="contained"
                                                            id="add-butn"
                                                            disabled={state.fileUploading}
                                                            type="submit"
                                                            style={{
                                                                width: "100%",
                                                                backgroundColor: "#1665B0",
                                                                borderRadius: "20px",
                                                            }}
                                                        >
                                                            {state.fileUploading ? "Please be patient as the file will be uploading..." : "Submit"}
                                                        </Button>
                                                        {state.submitLoader && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                    </div>
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={3}>
                                                <Grid item md={12} xs={12}>
                                                    <h3>*Important Note:</h3>
                                                </Grid>
                                                <Grid item md={12} xs={12} className="survey_pub_form">
                                                    <h4>Make sure you tell the customer</h4>
                                                    <ul>
                                                        <li>Surveyor is independent</li>
                                                        <li>They will need access to every room</li>
                                                        <li>They will take approx 120 to 150 pics of current energy measures and condition of property.</li>
                                                        <li>No pictures of people or family members will be taken</li>
                                                        <li>They will need access to Gas Meter and Electric Meter</li>
                                                        <li>There will be paperwork to sign, this will be discussed on the survey</li>
                                                    </ul>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </form>
                                );
                            }}
                        </Formik>
                    </div>

                    <Snackbar open={state.open} autoHideDuration={5000} onClose={handleClose}>
                        <Alert severity={state.successMsg ? 'success' : 'error'} variant="filled">
                            {state.successMsg || state.errorMsg}
                        </Alert>
                    </Snackbar>
                </React.Fragment>
            }

            <Dialog
                open={state.isNewConsumer}
                disableBackdropClick={true}
                fullWidth={true}
                maxWidth={'md'}
                onClose={() => setState({ ...state, isNewConsumer: false })}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">Add New Consumer</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(value) => {
                            try {
                                if (value.title) value.title = value.title.value;
                                if (value.city) value.city = value.city
                                if (value.EPCrating) value.EPCrating = value.EPCrating?.value
                                if (ageCalc) value.age = ageCalc;
                                if (LatitudeLongitude?.latitude && LatitudeLongitude?.latitude !== "") value.lat = LatitudeLongitude?.latitude
                                if (LatitudeLongitude?.longitude && LatitudeLongitude?.longitude !== "") value.lon = LatitudeLongitude?.longitude
                                if (value.address?.label && value.address?.label !== undefined && value.address?.label !== null) value.address = value.address?.label
                                setStartLoader(true);
                                _addConsumer({ value })
                                setAgeCalc("");
                            } catch (error) {
                                console.log("error", error);
                            }
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string().nullable().required("Title is required"),
                            firstName: Yup.string().required("First Name is required"),
                            surName: Yup.string().required("Surname is required"),
                            addressOne: Yup.string().required("Address 1 is required"),
                            town: Yup.string().required("Town is required"),
                            city: Yup.string().required("City is required").nullable(),
                            postcode: Yup.string().required("Postcode is required"),
                            siteAddress: Yup.string().required("Site Address is required"),
                            dob: Yup.date().required("DOB is required"),
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
                                        <Grid item xs={12} md={4}>
                                            <Select
                                                className={
                                                    errors.title && touched.title ? "ErrorColor" : ""
                                                }
                                                error={!!(errors.title && touched.title)}
                                                id="title"
                                                placeholder="Select Title"
                                                value={values.title}
                                                onChange={(e) => {
                                                    setFieldValue("title", e);
                                                }}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="title-error"
                                                name="colors"
                                                options={Title}
                                                styles={{
                                                    control: styles => ({ ...styles, height: '40px' }),
                                                }}
                                            />
                                            {errors.title && touched.title && (
                                                <FormHelperText className="errormsg" id="title-error">
                                                    {errors.title}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={!!(errors.firstName && touched.firstName)}
                                                label="First Name"
                                                name="firstName"
                                                className="WidhtFull100"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="firstName-error"
                                                size="small"
                                            />
                                            {errors.firstName && touched.firstName && (
                                                <FormHelperText className="errormsg" id="firstName-error">
                                                    {errors.firstName}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={!!(errors.surName && touched.surName)}
                                                label="Surname"
                                                name="surName"
                                                className="WidhtFull100"
                                                value={values.surName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="surName-error"
                                                size="small"
                                            />
                                            {errors.surName && touched.surName && (
                                                <FormHelperText className="errormsg" id="surName-error">
                                                    {errors.surName}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={12}>
                                            <Select
                                                id="address"
                                                name="address"
                                                placeholder="Search address"
                                                label="Search address"
                                                value={values.address}
                                                onChange={e => {
                                                    setFieldValue('address', e)
                                                    setLatLongFun(e.value)
                                                }}
                                                onBlur={handleBlur}
                                                onInputChange={e => {
                                                    if (e) setPossiblePlacesFun(e)
                                                }}
                                                margin="normal"
                                                aria-describedby="role-number-error"
                                                styles={{
                                                    control: styles => ({ ...styles, height: '40px' }),
                                                }}
                                                options={addressList}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={!!(errors.siteAddress && touched.siteAddress)}
                                                label="Site Address"
                                                name="siteAddress"
                                                size="small"
                                                className="WidhtFull100"
                                                value={values.siteAddress}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="siteAddress-error"
                                            />
                                            {errors.siteAddress && touched.siteAddress && (
                                                <FormHelperText className="errormsg" id="siteAddress-error">
                                                    {errors.siteAddress}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={!!(errors.addressOne && touched.addressOne)}
                                                label="Address 1"
                                                name="addressOne"
                                                className="WidhtFull100"
                                                size="small"
                                                value={values.addressOne}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="addressOne-error"
                                            />
                                            {errors.addressOne && touched.addressOne && (
                                                <FormHelperText
                                                    className="errormsg"
                                                    id="addressOne-error"
                                                >
                                                    {errors.addressOne}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={!!(errors.addressTwo && touched.addressTwo)}
                                                label="Address 2"
                                                name="addressTwo"
                                                className="WidhtFull100"
                                                value={values.addressTwo}
                                                size="small"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="addressTwo-error"
                                            />
                                            {errors.addressTwo && touched.addressTwo && (
                                                <FormHelperText
                                                    className="errormsg"
                                                    id="addressTwo-error"
                                                >
                                                    {errors.addressTwo}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={errors.town && touched.town ? true : false}
                                                label="Town"
                                                name="town"
                                                className="WidhtFull100"
                                                value={values.town}
                                                onChange={handleChange}
                                                size="small"
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="town-error"
                                            />
                                            {errors.town && touched.town && (
                                                <FormHelperText className="errormsg" id="town-error">
                                                    {errors.town}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={errors.city && touched.city ? true : false}
                                                label="City"
                                                name="city"
                                                className="WidhtFull100"
                                                value={values.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="city-error"
                                            />
                                            {errors.city && touched.city && (
                                                <FormHelperText className="errormsg" id="city-error">
                                                    {errors.city}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                error={errors.postcode && touched.postcode ? true : false}
                                                label="Postcode"
                                                name="postcode"
                                                className="WidhtFull100"
                                                value={values.postcode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="postcode-error"
                                            />
                                            {errors.postcode && touched.postcode && (
                                                <FormHelperText className="errormsg" id="postcode-error">
                                                    {errors.postcode}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <Select
                                                className={
                                                    errors.EPCrating && touched.EPCrating ? "ErrorColor" : ""
                                                }
                                                error={!!(errors.EPCrating && touched.EPCrating)}
                                                id="EPCrating"
                                                placeholder="Select EPCrating"
                                                value={values.EPCrating}
                                                onChange={(e) => {
                                                    setFieldValue("EPCrating", e);
                                                }}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="EPCrating-error"
                                                name="EPCrating"
                                                styles={{
                                                    control: styles => ({ ...styles, height: '40px' }),
                                                }}
                                                options={EPCRatingOptions}
                                            />
                                            {errors.EPCrating && touched.EPCrating && (
                                                <FormHelperText className="errormsg" id="EPCrating-error">
                                                    {errors.EPCrating}
                                                </FormHelperText>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                label="Telephone Number"
                                                name="telephoneNumber"
                                                className="WidhtFull100"
                                                value={values.telephoneNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                size="small"
                                                margin="normal"
                                                aria-describedby="telephoneNumber-error"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                label="Mobile"
                                                name="mobile"
                                                className="WidhtFull100"
                                                value={values.mobile}
                                                onChange={handleChange}
                                                size="small"
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="mobile-error"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                label="Email"
                                                name="email"
                                                className="WidhtFull100"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="email-error"
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <Grid container justify="space-around">
                                                    <KeyboardDatePicker
                                                        clearable
                                                        variant="dialog"
                                                        error={!!(errors.dob && touched.dob)}
                                                        disableFuture
                                                        inputVariant="outlined"
                                                        margin="normal"
                                                        className="WidhtFull100"
                                                        placeholder="Date of Birth"
                                                        allowKeyboardControl
                                                        format="dd/MM/yyyy"
                                                        value={values.dob ? values.dob : null}
                                                        onChange={(e) => {
                                                            setFieldValue("dob", e);
                                                            setFieldValue("age", handleChangeAge(e));
                                                        }}
                                                        KeyboardButtonProps={{
                                                            "aria-label": "change date",
                                                        }}
                                                        aria-describedby="dob-error"
                                                        size="small"
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                            {errors.dob && touched.dob && (
                                                <FormHelperText className="errormsg" id="dob-error">
                                                    {errors.dob}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                type="Number"
                                                variant="outlined"
                                                // label="Age"
                                                placeholder="Age"
                                                name="age"
                                                className="WidhtFull100"
                                                value={ageCalc}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                aria-describedby="age-error"
                                                disabled
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                label="Bank Name"
                                                name="bankName"
                                                className="WidhtFull100"
                                                value={values.bankName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="bankName-error"
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                label="Sortcode"
                                                name="sortCode"
                                                type="Number"
                                                className="WidhtFull100"
                                                value={values.sortCode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="sortCode-error"
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                variant="outlined"
                                                name="accountNumber"
                                                label="Account Number"
                                                type="Number"
                                                className="WidhtFull100"
                                                value={values.accountNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin="normal"
                                                size="small"
                                                aria-describedby="accountNumber-error"
                                            />
                                        </Grid>

                                        <CardActions
                                            style={{ paddingLeft: 20, paddingRight: 0, marginTop: 20, marginBottom: 40 }}
                                        >
                                            <Button
                                                size="medium"
                                                variant="contained"
                                                onClick={handleReset}
                                                disabled={!dirty}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                size="medium"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Add Consumer
                                            </Button>
                                            {startLoader && <CircularProgress />}
                                        </CardActions>
                                    </Grid>
                                </form>
                            );
                        }}
                    </Formik>
                </DialogContent>
            </Dialog>
        </article>
    );
}
