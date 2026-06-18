import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from '@material-ui/core/InputAdornment';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import { flatFileServiceOption, meterTypeOptions, durationOptions } from "../../../sharedUtils/globalHelper/constantValues";
import Select from "react-select";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { selectPriceCommission, sliceKeyPriceCommission, priceCommissionReducer, priceCommissionSaga, priceCommissionAction } from "../redux/price_commission";
import API from '../redux/modal/price_commission'

const useStyles = makeStyles(() => ({
    iconStyle: {
        background: '#193562',
        color: '#ffffff',
        padding: '20px 14px',
        position: 'absolute',
        right: 0,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    }
}));

const ldzArray = [];

export default function PriceCommission(props) {

    const dispatch = useDispatch();
    const classes = useStyles();

    const _localData = (payload) => dispatch(priceCommissionAction.setLocalData(payload));
    const priceState: any = useSelector(selectPriceCommission);

    const [IsDetails, setIsDetails] = useState(false);
    const [serviceOpt, setServiceOpt] = useState('');
    const [startLoader, setStartLoader] = useState(priceState.loaderFirst);
    const [currentSupplierId, setCurrentSupplier] = useState("");
    const [profileClass, setProfileClass] = useState("");
    const [isLdzRequired, setIsLdzRequired] = useState(false);
    const [isPostcode, setIsPostcode] = useState([]);

    const decNum = /^[0-9]\d{0,9}(\.\d{1,5})?%?$/
    const onlyNum = /^[0-9]*$/
    const allowtwoNumber = /^\s*|[0-9][0-2]*/

    let supplierList = [];
    if (props.suppliers) {
        props.suppliers.filter((e) => {
            supplierList.push({
                _id: e._id,
                label: e.supplierName,
                value: e.supplierName,
            })
        })
    }

    let ldzList = [];
    if (priceState.ldz) {
        priceState.ldz.filter((e) => {
            ldzList.push({
                label: e,
                value: e,
            })
        })
    }

    useEffect(() => {
        if (priceState && priceState.ldz && priceState.ldz.length > 0) {
            _localData(priceState.ldz);
        }
    }, [priceState.ldz])

    let initialValues = {
        unitrate: "",
        standingCharge: "",
        day: "",
        night: "",
        kva: "",
        ew: "",
        winter: "",
        daykwh: "",
        nightkwh: "",
        ewkwh: "",
        winterkwh: "",
        serviceType: null,
        meterType: null,
        // ldz: { value: 'eee', label: 'eee' },
        ldz: null,
        duration: null,
        currentSupplier: null,
        contract_start_end: "",
        mprn: props.singleLead.Site && props.singleLead.Site.gas && props.singleLead.Site.gas ? props.singleLead.Site.gas.MPRN : "",
        mpan1: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.topLine.substring(0, 2) : "",
        mpan2: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.topLine.substring(2, 5) : "",
        mpan3: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.topLine.substring(5, 9) : "",
        mpan4: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.meterNumber.substring(0, 2) : "",
        mpan5: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.meterNumber.substring(2, 6) : "",
        mpan6: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.meterNumber.substring(6, 10) : "",
        mpan7: props.singleLead.Site && props.singleLead.Site.electric && props.singleLead.Site.electric ? props.singleLead.Site.electric.meterNumber.substring(10, 13) : "",
        aq: "",
        postcode: props.singleLead.Site && props.singleLead.Site.postcode ? props.singleLead.Site.postcode : '',
        ccl: "0.46500",
        vat: "20",
        // minAQ: "",
    };

    const resetAPIData = () => {
        props.ClearAPIData({});
        dispatch(priceCommissionAction.BasicActions({ isStatus: true }));
    }

    return (
        <div className="quick-quote">
            <div style={{ marginBottom: 10 }}>
                {!IsDetails && <Button onClick={() => setIsDetails(true)} variant="contained" color="primary">Hide Details <ArrowDropDownIcon /></Button>}
                {IsDetails && <Button onClick={() => setIsDetails(false)} variant="contained" color="primary">Show Details <ArrowDropDownIcon /></Button>}
            </div>
            {!IsDetails &&
                <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                    <Formik
                        // enableReinitialize
                        initialValues={
                            initialValues
                        }
                        onSubmit={(value) => {
                            try {
                                const obj: any = {}
                                if (value.ccl) obj.ccl = value.ccl
                                if (value.vat) obj.vat = value.vat
                                if (value.night) obj.night = value.night
                                if (value.nightkwh) obj.nightkwh = value.nightkwh
                                if (value.ew) obj.ew = value.ew
                                if (value.ewkwh) obj.ewkwh = value.ewkwh
                                if (value.winter) obj.winter = value.winter
                                if (value.winterkwh) obj.winterkwh = value.winterkwh
                                // if (value.day) obj.day = value.day
                                if (value.aq) obj.aq = value.aq
                                if (value.unitrate) obj.unitrate = value.unitrate
                                if (value.standingCharge) obj.standingCharge = value.standingCharge
                                if (value.serviceType) obj.serviceType = value.serviceType.value
                                if (value.meterType) obj.meterType = value.meterType.value
                                if (value.postcode) obj.postcode = value.postcode
                                // const mpan = "" + value.mpan1 + value.mpan2 + value.mpan3 + value.mpan4 + value.mpan5 + value.mpan6 + value.mpan7;
                                // if (mpan) obj.mpan = mpan
                                if (value.mpan1) obj.MeterNo1 = Number(value.mpan1)
                                if (value.mpan2) obj.MeterNo2 = Number(value.mpan2)
                                if (value.mpan3) obj.MeterNo3 = String(value.mpan3)
                                if (value.mpan4) obj.MeterNo4 = Number(value.mpan4)
                                if (value.mpan5) obj.MeterNo5 = Number(value.mpan5)
                                if (value.mpan6) obj.MeterNo6 = Number(value.mpan6)
                                if (value.mpan7) obj.MeterNo7 = String(value.mpan7)

                                if (value.mprn) obj.mprn = value.mprn
                                if (value.contract_start_end) obj.contractStartDate = value.contract_start_end

                                if (value.duration) obj.duration = value.duration.value
                                if (value.currentSupplier) obj.currentSupplier = value.currentSupplier
                                if (Number(value.mpan1) >= 0) obj.profileClass = value.mpan1
                                if (value.mpan4) obj.distId = value.mpan4
                                if (value.mpan2) obj.mtc = value.mpan2

                                if (value.ldz) obj.ldz = value.ldz.value

                                if (obj.MeterNo3) obj.isLineCross = true;
                                // else if (ldzList) {
                                //     obj.ldz = ldzList
                                // }
                                // if (value.kva) obj.kva = value.kva
                                if (value.serviceType?.value === 'gas') obj.filter = {
                                    currentSupplier: currentSupplierId,
                                    ldz: obj.ldz,
                                    // duration: obj.duration,
                                    AQ: value.aq,
                                    // meterType: obj.meterType,
                                    contractStartDate: obj.contractStartDate
                                }
                                else if (value.serviceType?.value === 'electric') obj.filter = {
                                    currentSupplier: currentSupplierId,
                                    // ldz: obj.ldz,
                                    // duration: obj.duration,
                                    AQ: value.aq,
                                    distId: obj.distId,
                                    profileClass: obj.profileClass,
                                    mtc: obj.mtc,
                                    isLineCross: obj.isLineCross !== undefined ? obj.isLineCross : false,
                                    // kva: obj.kva,
                                    // meterType: obj.meterType,
                                    contractStartDate: obj.contractStartDate
                                }
                                // if (filter) obj.filter = filter
                                // setStartLoader(true);
                                if (value.serviceType?.value === 'gas') {
                                    props._getPostcode({ postcode: obj.postcode })
                                    setIsLdzRequired(false);
                                    setTimeout(function () {
                                        props.getPriceList(obj);
                                    }, 1000);
                                }
                                else {
                                    setIsLdzRequired(true);
                                }

                                if (value.serviceType?.value === 'electric') {
                                    props.getPriceList(obj);
                                }
                            }
                            catch (error) {
                                console.log("error", error);
                            }
                        }}
                        validationSchema={Yup.object().shape({
                            contract_start_end: Yup.string().required("Please select the Contract Start Date."),
                            currentSupplier: Yup.string().required("Please select the Current Supplier.").nullable(true),
                            serviceType: Yup.string().required("Meter Type is required.").nullable(true),
                            unitrate: Yup.string().required("Number of Days is required.").matches(decNum, 'Allow only number and decimal'),
                            standingCharge: Yup.string().required("Standing Charge is required.").matches(decNum, 'Allow only number and decimal'),
                            aq: Yup.string().required("AQ is required."),
                            duration: Yup.string().required("Duration is required."),
                            night: Yup.string().matches(decNum, 'Allow only number and decimal'),
                            ew: Yup.string().matches(decNum, 'Allow only number and decimal'),
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
                                        <Grid item md={6} xs={12}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle1" gutterBottom>Service type</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Select
                                                        className={
                                                            errors.serviceType && touched.serviceType ? "ErrorColor" : ""
                                                        }
                                                        variant="outlined"
                                                        id="serviceType"
                                                        name="serviceType"
                                                        placeholder="Select Service"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            setFieldValue("serviceType", e);
                                                            setServiceOpt(e.label);
                                                        }}
                                                        value={values.serviceType}
                                                        margin="normal"
                                                        aria-describedby="serviceType-error"
                                                        options={flatFileServiceOption}
                                                    />
                                                    {errors.serviceType && touched.serviceType && (
                                                        <FormHelperText className="errormsg" id="serviceType-error">
                                                            {errors.serviceType}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {serviceOpt === 'Electric' &&
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>MPAN</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={8}>
                                                        <div className="mpan-field">
                                                            <Typography variant="subtitle1">S</Typography>
                                                            <div>
                                                                <div className="mpanTop-fields">
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan1 && touched.mpan1 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        type="number"
                                                                        // value={MPAN.slice(0, 2)}
                                                                        value={values.mpan1}
                                                                        name="mpan1"
                                                                        id="mpan1"
                                                                        onChange={(e) => {
                                                                            handleChange(e)
                                                                            setProfileClass(e.target.value)
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                    // disabled
                                                                    />
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan2 && touched.mpan2 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        // value={MPAN.slice(2, 5)}
                                                                        value={values.mpan2}
                                                                        name="mpan2"
                                                                        id="mpan2"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                        // disabled
                                                                        type="number"

                                                                    />
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan3 && touched.mpan3 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        // value={MPAN.slice(5, 8)}
                                                                        value={values.mpan3}
                                                                        // disabled
                                                                        name="mpan3"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                        id="mpan3"
                                                                    />
                                                                </div>
                                                                <div className="mpanBottom-fields">
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan4 && touched.mpan4 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        name="mpan4"
                                                                        id="mpan4"
                                                                        size="small"
                                                                        type="number"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                        // value={MPAN.slice(8, 10)}
                                                                        value={values.mpan4}
                                                                    // disabled
                                                                    />
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan5 && touched.mpan5 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        type="number"
                                                                        // value={MPAN.slice(10, 14)}
                                                                        value={values.mpan5}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                        name="mpan5"
                                                                        id="mpan5"
                                                                    // disabled
                                                                    />
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan6 && touched.mpan6 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        type="number"
                                                                        value={values.mpan6}
                                                                        // value={MPAN.slice(14, 18)}
                                                                        name="mpan6"
                                                                        id="mpan6"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                    // disabled
                                                                    />
                                                                    <TextField
                                                                        error={
                                                                            errors.mpan7 && touched.mpan7 ? true : false
                                                                        }
                                                                        variant="outlined"
                                                                        className="WidhtFull100"
                                                                        size="small"
                                                                        name="mpan7"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        margin="normal"
                                                                        id="mpan7"
                                                                        value={values.mpan7}
                                                                    // value={MPAN.slice(18, 21)}
                                                                    // disabled
                                                                    />

                                                                </div>

                                                            </div>
                                                        </div>
                                                        {errors.mpan1 && touched.mpan1 && (
                                                            <FormHelperText className="errormsg" id="mpan1-error">
                                                                {errors.mpan1}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            }

                                            {serviceOpt === 'Gas' &&
                                                <>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="subtitle1" gutterBottom>MPRN</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={8}>
                                                            <TextField
                                                                error={
                                                                    errors.mprn && touched.mprn ? true : false
                                                                }
                                                                variant="outlined"
                                                                id="mprn"
                                                                className="WidhtFull100"
                                                                value={values.mprn}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                name="mprn"
                                                                margin="normal"
                                                                aria-describedby="mprn-error"
                                                                size="small"
                                                            />
                                                            {errors.mprn && touched.mprn && (
                                                                <FormHelperText className="errormsg" id="mprn-error">
                                                                    {errors.mprn}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} md={4}>
                                                            <Typography variant="subtitle1" gutterBottom>Postcode</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={8}>
                                                            <TextField
                                                                error={
                                                                    errors.postcode && touched.postcode ? true : false
                                                                }
                                                                variant="outlined"
                                                                id="postcode"
                                                                className="WidhtFull100"
                                                                value={values.postcode}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                name="postcode"
                                                                margin="normal"
                                                                aria-describedby="postcode-error"
                                                                size="small"
                                                            />
                                                            {errors.postcode && touched.postcode && (
                                                                <FormHelperText className="errormsg" id="postcode-error">
                                                                    {errors.postcode}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    </Grid>

                                                    {ldzList.length > 1 &&
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} md={4}>
                                                                <Typography variant="subtitle1" gutterBottom>Ldz</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={8}>
                                                                <Select
                                                                    // className={
                                                                    //     errors.ldz && touched.ldz ? "ErrorColor" : ""
                                                                    // }
                                                                    variant="outlined"
                                                                    id="ldz"
                                                                    name="ldz"
                                                                    placeholder="Select Ldz"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        setFieldValue("ldz", e);
                                                                    }}
                                                                    value={values.ldz}
                                                                    margin="normal"
                                                                    aria-describedby="ldz-error"
                                                                    options={ldzList}
                                                                />
                                                                {isLdzRequired &&
                                                                    <FormHelperText className="errormsg" id="ldz-error">
                                                                        Please select Local Distribute Zone
                                                                    </FormHelperText>
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </>
                                            }

                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle1" gutterBottom>Current Supplier</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Select
                                                        className={
                                                            errors.currentSupplier && touched.currentSupplier ? "ErrorColor" : ""
                                                        }
                                                        variant="outlined"
                                                        id="currentSupplier"
                                                        name="currentSupplier"
                                                        placeholder="Select Supplier"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            setFieldValue("currentSupplier", e);
                                                            setCurrentSupplier(e._id);
                                                        }}
                                                        value={values.currentSupplier}
                                                        margin="normal"
                                                        aria-describedby="currentSupplier-error"
                                                        options={supplierList}
                                                    />
                                                    {errors.currentSupplier && touched.currentSupplier && (
                                                        <FormHelperText className="errormsg" id="currentSupplier-error">
                                                            {errors.currentSupplier}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <Typography variant="subtitle1" gutterBottom>Contract Start Date</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                variant="dialog"
                                                                error={
                                                                    errors.contract_start_end && touched.contract_start_end ? true : false
                                                                }
                                                                inputVariant="outlined"
                                                                margin="normal"
                                                                id="contract_start_end"
                                                                label="Contract Start Date"
                                                                allowKeyboardControl
                                                                disablePast
                                                                format="dd/MM/yyyy"
                                                                value={
                                                                    values.contract_start_end
                                                                        ? values.contract_start_end
                                                                        : null
                                                                }
                                                                onChange={(e) => setFieldValue("contract_start_end", e)}
                                                                className="WidhtFull100"
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="contract_start_end-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>

                                                    {errors.contract_start_end && touched.contract_start_end && (
                                                        <FormHelperText className="errormsg" id="contract_start_end-error">
                                                            {errors.contract_start_end}
                                                        </FormHelperText>
                                                    )}

                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item md={6} xs={12}>
                                            <Grid container spacing={3}>
                                                {/* {serviceOpt === 'Electric' &&
                                                    <>
                                                        <Grid item xs={12} md={12}>
                                                            <Select
                                                                className={
                                                                    errors.meterType && touched.meterType ? "ErrorColor" : ""
                                                                }
                                                                variant="outlined"
                                                                id="meterType"
                                                                name="meterType"
                                                                placeholder="Meter Type"
                                                                onBlur={handleBlur}
                                                                onChange={(e) => {
                                                                    setFieldValue("meterType", e);
                                                                }}
                                                                value={values.meterType}
                                                                margin="normal"
                                                                aria-describedby="meterType-error"
                                                                options={meterTypeOptions}
                                                            />
                                                            {errors.meterType && touched.meterType && (
                                                                <FormHelperText className="errormsg" id="meterType-error">
                                                                    {errors.meterType}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    </>
                                                } */}

                                                {serviceOpt === 'Electric' && ["0", "00", "000"].includes(profileClass) &&
                                                    <Grid item xs={12} md={12}>
                                                        <TextField
                                                            variant="outlined"
                                                            error={
                                                                errors.kva && touched.kva ? true : false
                                                            }
                                                            id="kva"
                                                            className="WidhtFull100"
                                                            label="KVA"
                                                            inputProps={{ min: 0 }}
                                                            value={values.kva}
                                                            type="number"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            margin="normal"
                                                            aria-describedby="kva-error"
                                                            size="small"
                                                        />
                                                        {errors.kva && touched.kva && (
                                                            <FormHelperText className="errormsg" id="kva-error">
                                                                {errors.kva}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>
                                                }


                                                <Grid item xs={12} md={6}>
                                                    <Select
                                                        className={
                                                            errors.duration && touched.duration ? "ErrorColor" : ""
                                                        }
                                                        variant="outlined"
                                                        id="duration"
                                                        name="duration"
                                                        placeholder="Duration"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            setFieldValue("duration", e);
                                                        }}
                                                        value={values.duration}
                                                        margin="normal"
                                                        aria-describedby="duration-error"
                                                        options={durationOptions}
                                                    />
                                                    {errors.duration && touched.duration && (
                                                        <FormHelperText className="errormsg" id="duration-error">
                                                            {errors.duration}
                                                        </FormHelperText>
                                                    )}
                                                    {/* <TextField
                                                        variant="outlined"
                                                        error={
                                                            errors.duration && touched.duration ? true : false
                                                        }
                                                        id="duration"
                                                        className="WidhtFull100"
                                                        label="Duration"
                                                        name="duration"
                                                        value={values.duration}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="duration-error"
                                                        size="small"
                                                    />
                                                    {errors.duration && touched.duration && (
                                                        <FormHelperText className="errormsg" id="duration-error">
                                                            {errors.duration}
                                                        </FormHelperText>
                                                    )} */}
                                                </Grid>


                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        error={
                                                            errors.standingCharge && touched.standingCharge ? true : false
                                                        }
                                                        id="standingCharge"
                                                        className="WidhtFull100"
                                                        label="Current Standing Charge"
                                                        inputProps={{ min: 0 }}
                                                        value={values.standingCharge}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="standingCharge-error"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment className={classes.iconStyle} style={{ padding: "27px 14px" }} position="end">
                                                                    <p>P</p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {errors.standingCharge && touched.standingCharge && (
                                                        <FormHelperText className="errormsg" id="standingCharge-error">
                                                            {errors.standingCharge}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>


                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        error={
                                                            errors.unitrate && touched.unitrate ? true : false
                                                        }
                                                        id="unitrate"
                                                        className="WidhtFull100"
                                                        label="Day"
                                                        inputProps={{ min: 0 }}
                                                        value={values.unitrate}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="unitrate-error"
                                                        size="small"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment className={classes.iconStyle} position="end">
                                                                    <p>P</p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {errors.unitrate && touched.unitrate && (
                                                        <FormHelperText className="errormsg" id="unitrate-error">
                                                            {errors.unitrate}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        error={
                                                            errors.aq && touched.aq ? true : false
                                                        }
                                                        id="aq"
                                                        className="WidhtFull100"
                                                        label="AQ"
                                                        inputProps={{ min: 0 }}
                                                        value={values.aq}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        type="number"
                                                        margin="normal"
                                                        aria-describedby="aq-error"
                                                        size="small"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment className={classes.iconStyle} position="end">
                                                                    <p>Kwh</p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    {errors.aq && touched.aq && (
                                                        <FormHelperText className="errormsg" id="aq-error">
                                                            {errors.aq}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>


                                                {serviceOpt === 'Electric' &&
                                                    <>
                                                        {/* <Grid item xs={12} md={3}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.day && touched.day ? true : false
                                                                }
                                                                id="day"
                                                                className="WidhtFull100"
                                                                label="Day"
                                                                inputProps={{ min: 0 }}
                                                                value={values.day}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                margin="normal"
                                                                aria-describedby="day-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>P</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.day && touched.day && (
                                                                <FormHelperText className="errormsg" id="day-error">
                                                                    {errors.day}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>

                                                        <Grid item xs={12} md={3}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.daykwh && touched.daykwh ? true : false
                                                                }
                                                                id="daykwh"
                                                                className="WidhtFull100"
                                                                inputProps={{ min: 0 }}
                                                                value={values.daykwh}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                margin="normal"
                                                                aria-describedby="daykwh-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>kwh</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.daykwh && touched.daykwh && (
                                                                <FormHelperText className="errormsg" id="daykwh-error">
                                                                    {errors.daykwh}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid> */}


                                                        <Grid item xs={12} md={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.night && touched.night ? true : false
                                                                }
                                                                id="night"
                                                                className="WidhtFull100"
                                                                label="Night"
                                                                inputProps={{ min: 0 }}
                                                                value={values.night}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                margin="normal"
                                                                aria-describedby="night-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>P</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.night && touched.night && (
                                                                <FormHelperText className="errormsg" id="night-error">
                                                                    {errors.night}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.nightkwh && touched.nightkwh ? true : false
                                                                }
                                                                id="nightkwh"
                                                                className="WidhtFull100"
                                                                inputProps={{ min: 0 }}
                                                                value={values.nightkwh}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                type="number"
                                                                margin="normal"
                                                                aria-describedby="nightkwh-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>kwh</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.nightkwh && touched.nightkwh && (
                                                                <FormHelperText className="errormsg" id="nightkwh-error">
                                                                    {errors.nightkwh}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.ew && touched.ew ? true : false
                                                                }
                                                                id="ew"
                                                                className="WidhtFull100"
                                                                label="EW"
                                                                inputProps={{ min: 0 }}
                                                                value={values.ew}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                margin="normal"
                                                                aria-describedby="ew-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>P</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.ew && touched.ew && (
                                                                <FormHelperText className="errormsg" id="ew-error">
                                                                    {errors.ew}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <TextField
                                                                variant="outlined"
                                                                error={
                                                                    errors.ewkwh && touched.ewkwh ? true : false
                                                                }
                                                                id="ewkwh"
                                                                className="WidhtFull100"
                                                                inputProps={{ min: 0 }}
                                                                type="number"
                                                                value={values.ewkwh}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                margin="normal"
                                                                aria-describedby="ewkwh-error"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment className={classes.iconStyle} position="end">
                                                                            <p>kwh</p>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                            {errors.ewkwh && touched.ewkwh && (
                                                                <FormHelperText className="errormsg" id="ewkwh-error">
                                                                    {errors.ewkwh}
                                                                </FormHelperText>
                                                            )}
                                                        </Grid>
                                                    </>
                                                }

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        id="ccl"
                                                        className="WidhtFull100"
                                                        label="CCL"
                                                        inputProps={{ min: 0 }}
                                                        value={values.ccl}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="ccl-error"
                                                        size="small"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment className={classes.iconStyle} position="end">
                                                                    <p>P</p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        id="vat"
                                                        className="WidhtFull100"
                                                        label="VAT"
                                                        inputProps={{ min: 0 }}
                                                        value={values.vat}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="vat-error"
                                                        size="small"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment className={classes.iconStyle} position="end">
                                                                    <p>%</p>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>


                                            </Grid>
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
                                                resetAPIData()
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
                                            Get Quote
                                        </Button>
                                        {/* {console.log("priceState.loaderFirst", priceState.loaderFirst)} */}
                                        {priceState.loaderFirst && <CircularProgress />}
                                    </CardActions>
                                </form>
                            );
                        }}
                    </Formik>
                </Paper>
            }
        </div >
    );
}
