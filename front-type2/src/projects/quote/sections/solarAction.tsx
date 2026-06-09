import React, { useState, Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CommonSimple as AddAppointment } from '../../appointment/loadable/CommonSimple';
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { quoteAction } from "../../quote/redux/quote";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    Spacing: {
        marginTop: "10px",
        marginBottom: "10px",
    },
    TypoSpace: {
        marginBottom: 25,
    },
    PaddingSpace: {
        padding: "10px",
    },
}));


export default function SolarAction(props) {

    const classes = useStyles();
    const currentProps = props
    const dispatch = useDispatch();

    const _isLoadingData = (payload, type) => {
        dispatch(quoteAction.setIsLoadingData(payload));
    };
    const [startLoader, setStartLoader] = useState(false);
    const [isShowAddAppointment, setIsShowAddAppointment] = useState('');
    const [status, setStatus] = useState([]);
    const [disable, setDisable] = useState(false);
    const [isBtnText, setBtnText] = useState('');

    if (props.isActionDone && startLoader) {
        props._isActionDone(false);
        setStartLoader(false);
    }

    const initialValues = {
        quoteStatus: null,
        Notes: '',
        depositDate: null,
        depositAmount: '',
    }

    const openAppointmentDrawer = () => {
        setIsShowAddAppointment('addAppointmentDrawer');
    }

    const statusFilter = () => {
        const quoteStatus: any = props.currentQuote.quoteStatus;
        switch (quoteStatus) {
            case 1000:
                setStatus([
                    {
                        label: 'EPC Checked',
                        value: 1034
                    }
                ])
                break;
            case 1034:
                setStatus([
                    {
                        label: 'Phone Vetted',
                        value: 1035
                    }
                ])
                break;
            case 1035:
                setStatus([
                    {
                        label: 'Data Matched',
                        value: 1036,
                    }
                ])
                break;
            case 1036:
                setStatus([
                    {
                        label: 'LA Flex sent',
                        value: 1037,
                    }
                ])
                break;
            case 1037:
                setStatus([
                    {
                        label: 'LA Flex accepted',
                        value: 1038,
                    }
                ])
                break;
            case 1038:
                setStatus([
                    {
                        label: 'Post EPR',
                        value: 1039,
                    }
                ])
                break;
            case 1039:
                setStatus([
                    {
                        label: 'Survey Booked',
                        value: 1015,
                    }
                ])
                break;
            case 1015:
                setStatus([
                    {
                        label: 'Survey Docs and Picture',
                        value: 1040,
                    }
                ])
                break;
            case 1040:
                setStatus([
                    {
                        label: 'Job Rejected',
                        value: 1041,
                    },
                    {
                        label: 'Job Accepted',
                        value: 1042,
                    }
                ])
                break;
            case 1042:
                setStatus([
                    {
                        label: 'RC Assigned',
                        value: 1043,
                    }
                ])
                break;
            case 1043:
                setStatus([
                    {
                        label: 'RC Completed',
                        value: 1044,
                    }
                ])
                break;
            case 1044:
                setStatus([
                    {
                        label: 'Tech Survey',
                        value: 1045,
                    }
                ])
                break;
            case 1045:
                setStatus([
                    {
                        label: 'Insulation Booked',
                        value: 1046,
                    }
                ])
                break;
            case 1046:
                setStatus([
                    {
                        label: 'Ventilation Booked',
                        value: 1047,
                    }
                ])
                break;
            case 1047:
                setStatus([
                    {
                        label: 'Heating Booked',
                        value: 1048,
                    }
                ])
                break;
            case 1048:
                setStatus([
                    {
                        label: 'Solar Renewables Booked',
                        value: 1049,
                    }
                ])
                break;
            case 1049:
                setStatus([
                    {
                        label: 'Install Complete',
                        value: 1023
                    }
                ])
                break;
            case 1023:
                setStatus([
                    {
                        label: 'Trust Mark',
                        value: 1050
                    }
                ])
                break;
            case 1050:
                setStatus([
                    {
                        label: 'Submissions Started',
                        value: 1051
                    }
                ])
                break;
            case 1051:
                setStatus([
                    {
                        label: 'Submitted to Funders',
                        value: 1052
                    }
                ])
                break;
            case 1052:
                setStatus([
                    {
                        label: 'Funder Quiries',
                        value: 1053
                    }
                ])
                break;
            case 1053:
                setStatus([
                    {
                        label: 'Funded Approved',
                        value: 1054
                    }
                ])
                break;
            case 1054:
                setStatus([
                    {
                        label: 'Payment Received',
                        value: 1055
                    }
                ])
                break;
            case 1055:
                setStatus([
                    {
                        label: 'Job Completed',
                        value: 1026
                    }
                ])
                break;
            default:
                setStatus([]);
                break;
        }
    }

    const appointmentBtnText = () => {
        if (props.currentQuote.quoteStatus === 1000 || props.currentQuote.quoteStatus === 1015) {
            if (props.currentQuote?.service?.eco?.surveyAppoinment?._id) {
                setDisable(true);
                setBtnText('Survey Appointment Booked')
            } else {
                setBtnText('Create Survey Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1027 || props.currentQuote.quoteStatus === 1019) {
            if (props.currentQuote?.service?.eco?.scaffoldingAppoinment?._id) {
                setDisable(true);
                setBtnText('Scaffolding Appointment Booked')
            } else {
                setBtnText('Create Scaffolding Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1021) {
            if (props.currentQuote?.service?.eco?.installationAppoinment?._id) {
                setDisable(true);
                setBtnText('Installation Appointment Booked')
            } else {
                setBtnText('Create Installation Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1046) {
            if (props.currentQuote?.service?.eco?.insulationAppoinment?._id) {
                setDisable(true);
                setBtnText('Insulation Appointment Booked')
            } else {
                setBtnText('Create Insulation Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1047) {
            if (props.currentQuote?.service?.eco?.ventilationAppoinment?._id) {
                setDisable(true);
                setBtnText('Ventilation Appointment Booked')
            } else {
                setBtnText('Create Ventilation Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1048) {
            if (props.currentQuote?.service?.eco?.heatingAppoinment?._id) {
                setDisable(true);
                setBtnText('Heating Appointment Booked')
            } else {
                setBtnText('Create Heating Appointment')
            }
        } else if (props.currentQuote.quoteStatus === 1049) {
            if (props.currentQuote?.service?.eco?.solarRenewablesAppoinment?._id) {
                setDisable(true);
                setBtnText('Solar Renewables Appointment Booked')
            } else {
                setBtnText('Create Solar Renewables Appointment')
            }
        }
    }

    React.useEffect(() => {
        statusFilter()
        appointmentBtnText()
    }, []);

    return (
        <React.Fragment>
            <Grid container spacing={3} className={classes.PaddingSpace}>
                <Grid item xs={12} md={12}>
                    {[1000, 1027, 1019, 1021, 1046, 1047, 1048, 1049].includes(props.currentQuote.quoteStatus) &&
                        <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: 20, marginTop: '-10px' }}
                            onClick={openAppointmentDrawer}
                            disabled={disable}
                        >
                            {isBtnText}
                        </Button>
                    }

                    {props.currentQuote.quoteStatus !== 1026 &&
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            onSubmit={(value) => {
                                let negotiation: any = {
                                    service: {
                                        eco: {
                                            subservice: {
                                                solar: {
                                                    depositDate: value.depositDate || null,
                                                    depositAmount: value.depositAmount || null
                                                }
                                            }
                                        }
                                    }
                                }

                                const quoteId = props.currentQuote._id;
                                negotiation.QuoteID = quoteId;
                                negotiation.quoteStatus = value.quoteStatus.value
                                negotiation.notes = value.Notes;
                                negotiation.Notes = value.Notes;
                                setStartLoader(true);

                                _isLoadingData(true, 'quote');
                                props._quoteActions(negotiation, 'solar');
                            }}
                            validationSchema={Yup.object().shape({
                                // surveyNote: Yup.string().required('Previous contract start date is required'),
                            })}
                        >
                            {props => {
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
                                    submitForm
                                } = props;

                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={3}>
                                            {currentProps.currentQuote.quoteStatus == 1018 &&
                                                <Grid item md={6} sm={12} xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        error={!!(errors.depositAmount && touched.depositAmount)}
                                                        id="depositAmount"
                                                        className="WidhtFull100"
                                                        label="Deposit Amount"
                                                        name="depositAmount"
                                                        value={values.depositAmount}
                                                        type="number"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        margin="normal"
                                                        aria-describedby="depositAmount-error"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    £
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                    {errors.depositAmount && touched.depositAmount && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="depositAmount-error"
                                                        >
                                                            {errors.depositAmount}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>
                                            }

                                            {currentProps.currentQuote.quoteStatus == 1018 &&
                                                <Grid item md={6} sm={12} xs={12}>
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                variant="dialog"
                                                                inputVariant="outlined"
                                                                margin="normal"
                                                                id="depositDate"
                                                                name="depositDate"
                                                                label="Deposit Date"
                                                                allowKeyboardControl
                                                                className="WidhtFull100"
                                                                helperText=''
                                                                format="dd/MM/yyyy"
                                                                value={values.depositDate}
                                                                onChange={(e) =>
                                                                    setFieldValue("depositDate", e)
                                                                }
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="depositDate-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                    {errors.depositDate && touched.depositDate && (
                                                        <FormHelperText
                                                            className="errormsg"
                                                            id="depositDate-error"
                                                        >
                                                            {errors.depositDate}
                                                        </FormHelperText>
                                                    )}
                                                </Grid>
                                            }

                                            <Grid item md={12} sm={12} xs={12}>
                                                <TextField
                                                    variant="outlined"
                                                    error={!!(errors.Notes && touched.Notes)}
                                                    id="Notes"
                                                    className="WidhtFull100"
                                                    label="Notes"
                                                    name="Notes"
                                                    value={values.Notes}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    margin="normal"
                                                    aria-describedby="Notes-error"
                                                    multiline
                                                    rows={4}
                                                />
                                                {errors.Notes && touched.Notes && (
                                                    <FormHelperText
                                                        className="errormsg"
                                                        id="Notes-error"
                                                    >
                                                        {errors.Notes}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <Select
                                                    className={errors.quoteStatus && touched.quoteStatus ? 'ErrorColor' : ''}
                                                    id="quoteStatus"
                                                    name="quoteStatus"
                                                    placeholder="Quote Status"
                                                    value={values.quoteStatus}
                                                    onChange={e => { setFieldValue('quoteStatus', e) }}
                                                    onBlur={handleBlur}
                                                    margin="normal"
                                                    aria-describedby="role-number-error"
                                                    options={status}
                                                />
                                                {errors.quoteStatus && touched.quoteStatus && (
                                                    <FormHelperText className="errormsg" id="quoteStatus-error">
                                                        {errors.quoteStatus}
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                        </Grid>

                                        <CardActions
                                            style={{
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                marginTop: 20,
                                            }}
                                        >
                                            <Button
                                                size="medium"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Update Status
                                            </Button>

                                            {startLoader && <CircularProgress />}
                                        </CardActions>
                                    </form>
                                );
                            }}
                        </Formik>
                    }
                </Grid>
            </Grid>

            {isShowAddAppointment &&
                <Suspense fallback={<>Loading...</>}>
                    <AddAppointment
                        {...props}
                        showingFrom="Quote"
                        isCloseAppointment={() => { setIsShowAddAppointment('') }}
                    >
                    </AddAppointment>
                </Suspense>
            }
        </React.Fragment>
    );
}