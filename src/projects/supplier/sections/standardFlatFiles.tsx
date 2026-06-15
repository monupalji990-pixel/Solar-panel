import { useEffect } from 'react';
import { Grid, FormHelperText, CardActions, Button, CircularProgress } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from "yup";
import Select from "react-select";
import { flatFileServiceOption, gasHeaders, electricHeaders } from "../../../sharedUtils/globalHelper/constantValues";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { supplierAction, selectSupplierState } from "../redux/supplier";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function standardFlatFiles(props) {

    const dispatch = useDispatch();

    const supplierState = useSelector(selectSupplierState);

    const _getHeaders = (payload) =>
        dispatch(supplierAction.standardFlatFile(payload));
    const _generateStandardFlatFile = (payload) =>
        dispatch(supplierAction.generateStandardFlatFile(payload));
    const _basicActions = (payload) =>
        dispatch(supplierAction.supplierBasicActions(payload));
    const _uploadStandardFile = (payload) =>
        dispatch(supplierAction.uploadStandardFile(payload));
    const _updateSupplier = (payload) =>
        dispatch(supplierAction.updateSupplier(payload));
    const _resetAllData = (payload) =>
        dispatch(supplierAction.clearAllStateData(payload));

    const [startLoader, setStartLoader] = useState(false);
    const [secondLoader, setSecondLoader] = useState(false);

    const [isLoader, setIsLoader] = useState(false);
    const [fileUpload, setFileUpload] = useState([]);
    const [textValue, setTextValue] = useState({});
    const [fieldError, setFieldError]: any = useState([]);
    const [selectedValue, setSelectedValue]: any = useState({});
    const [isService, setService] = useState('');
    const [selectedField, setSelectedField] = useState([]);
    const [isStatus, setIsStaus] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isServiceError, setIsServiceError] = useState(false);

    const initialValues: any = {};

    const initialValues2: any = {
        services: "",
        textValue: textValue,
        saveMapper: false,
    }

    useEffect(() => {
        if (supplierState.isLoadingData3 && startLoader) {
            setStartLoader(false);
        }
    }, [supplierState.isLoadingData3]);

    useEffect(() => {
        if (supplierState.isLoadingData2 && secondLoader)
            setSecondLoader(false)
    }, [supplierState.isLoadingData2]);


    useEffect(() => {
        if (props.open === null) {
            _basicActions({ hideSection: false });
        }
    }, [props.open]);

    useEffect(() => {
        if (supplierState.flatFileData && supplierState.flatFileData.length > 0) {
            const gasMap = props.supplier?.e?.gas_mapper;
            const electricMap = props.supplier?.e?.electric_mapper;

            let newObj = {}

            if (isService === "gas" && props.supplier?.e?.gas_mapper) {
                supplierState?.flatFileData?.forEach(key => {
                    newObj = { ...newObj, [key]: null }
                })
                Object.keys(newObj).forEach(key => {
                    if (gasMap[key] !== null)
                        newObj[key] = gasMap[key]
                    else
                        newObj[key] = null
                })
            }
            else if (isService === "electric" && props.supplier?.e?.electric_mapper) {
                supplierState?.flatFileData?.forEach(key => {
                    newObj = { ...newObj, [key]: null }
                })
                Object.keys(newObj).forEach(key => {
                    if (electricMap[key] !== null)
                        newObj[key] = electricMap[key]
                    else
                        newObj[key] = null
                })
            }
            else {
                supplierState?.flatFileData?.forEach(key => {
                    newObj = { ...newObj, [key]: null }
                })
            }
            setTextValue(newObj);
        }
    }, [isService, supplierState.flatFileData])

    const resetMapper = () => {
        if (supplierState.flatFileData && supplierState.flatFileData.length > 0) {
            let newObj = {}
            supplierState?.flatFileData?.forEach(key => {
                newObj = { ...newObj, [key]: null }
            })
            setTextValue(newObj);
        }
    }

    useEffect(() => {
        let NotRequired: any = []

        // SSE
        if (["5e1df93ea7f1b06e99acd7f3", "60d9923075ab2f001457354f"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "priceFor", label: "priceFor" },
                { value: "maxAQ", label: "maxAQ" },
            ];
        }

        // CORONA
        else if (["5dd6c441b3425e2ec2cc6706", "610a62fbab260912486c384f"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // UTILITA
        else if (["6109291881abee7ec82941d6", "5dde62060b27c84569ed4007"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "minAQ", label: "minAQ" },
                { value: "maxAQ", label: "maxAQ" },
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }
        else if (["6109291881abee7ec82941d6", "5dde62060b27c84569ed4007"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "minAQ", label: "minAQ" },
                { value: "maxAQ", label: "maxAQ" },
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // SCOTTISH POWER
        else if (["5ddd518d0b27c84569ed4005", "60f52f8bb0b9e95d972936d0"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
            ];
        }

        // CNG
        else if (["60d9929475ab2f0014573555", "5dd2e52fb3425e2ec2cc66f0"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // D-ENERGI
        else if (["5fa2c63fbaca937da344c27f", "60d9926675ab2f0014573553"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "priceFor", label: "priceFor" },
            ];
        }
        else if (["5fa2c63fbaca937da344c27f", "60d9926675ab2f0014573553"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // UGP UNITED GAS AND POWER
        else if (["5fa2c63fbaca937da344c27f", "60d9926675ab2f0014573553"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }
        else if (["5fa2c63fbaca937da344c27f", "60d9926675ab2f0014573553"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "dayUnitRate", label: "dayUnitRate" },
                { value: "nightUnitRate", label: "nightUnitRate" },
                { value: "eveningAndWeekendUnitRate", label: "eveningAndWeekendUnitRate" },
                { value: "minAQ", label: "minAQ" },
                { value: "maxAQ", label: "maxAQ" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // GAZPROM
        else if (["5e20343da7f1b06e99acd802", "60d9921875ab2f001457354d"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
                { value: "standingCharge", label: "standingCharge" },
                { value: "priceFor", label: "priceFor" },
            ];
        }
        else if (["5e20343da7f1b06e99acd802", "60d9921875ab2f001457354d"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "minAQ", label: "minAQ" },
                { value: "maxAQ", label: "maxAQ" },
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // SMARTEST ENERGY
        else if (["5dcea842b3425e2ec2cc66d9", "60d991e675ab2f001457354b"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "minAQ", label: "minAQ" },
                { value: "maxAQ", label: "maxAQ" },
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // AVANTI GAS
        else if (["5dd2d491b3425e2ec2cc66ee", "60d9908f75ab2f0014573549"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "priceFor", label: "priceFor" },
            ];
        }

        // EDF ENERGY GAS
        else if (["5ef1dce61a8ca62860e0a578", "618a2a83b7a0417b1926c99e"].includes(props.supplier._id) && isService === "gas") {
            NotRequired = [
                { value: "priceFor", label: "priceFor" },
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
            ];
        }

        // EDF ENERGY ELECTRIC
        else if (["5ef1dce61a8ca62860e0a578", "618a2a83b7a0417b1926c99e"].includes(props.supplier._id) && isService === "electric") {
            NotRequired = [
                { value: "meterType", label: "meterType" },
                { value: "startDate", label: "startDate" },
                { value: "endDate", label: "endDate" },
                { value: "priceFor", label: "priceFor" },
                { value: "profileClass", label: "profileClass" },
            ];
        }

        let result = selectOption.filter((v) => (
            selectedField && !selectedField.some((e) => {
                if (e !== null && e !== undefined)
                    return v.value === e.value
            })
        ))

        let FR = result && result.filter((x) => (
            NotRequired && !NotRequired.some(s => {
                if (s !== null && s !== undefined)
                    return x.value === s.value
            })
        ))
        setFieldError(FR);
    }, [selectedField]);


    useEffect(() => {
        if (supplierState?.confirmPopup)
            setOpenModal(true);
    }, [supplierState?.confirmPopup])

    useEffect(() => {
        if (supplierState.sendRequest) {
            setIsLoader(false)
            setOpenModal(false);
        }
    }, [supplierState.sendRequest])

    const flatFileData = () => {
        const gasMap = props.supplier?.e?.gas_mapper;

        let newObj = {}

        supplierState?.flatFileData?.forEach(key => {
            newObj = { ...newObj, [key]: null }
        })

        Object.keys(newObj).forEach(key => {
            if (gasMap[key] !== null)
                newObj[key] = gasMap[key]
        })

        return newObj;
    }

    let selectOption = []
    // electricHeaders
    if (isService === 'gas') {
        gasHeaders.forEach((v) => {
            selectOption.push({ label: v.label, value: v.value })
        })
    }
    else {
        electricHeaders.forEach((v) => {
            selectOption.push({ label: v.label, value: v.value })
        })
    }

    const handleAddFile = (newFiles) => {
        newFiles = newFiles.filter(file => !fileUpload.find(f => f.data === file.data));
        setFileUpload([...fileUpload, ...newFiles]);
    }

    const handleRemoveFile = () => {
        setFileUpload([]);
    }

    const setFiledRequired = (value, txtValue) => {
        setSelectedField([...selectedField, value]);
    }

    const handleClose = () => {
        setOpenModal(false);
        _basicActions({ confirmPopup: false });
    }

    const sendFlatFileReq = () => {
        setIsLoader(true)
        let x = {
            supplierId: props.supplier._id,
            file: supplierState.flatfileStr?.file?.newFile,
            totalRows: supplierState.flatfileStr?.file?.totalRows,
        }
        let Obj = {
            value: isService,
            data: x
        }
        if (Obj !== undefined)
            _uploadStandardFile(Obj);

    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(value) => {
                            const data = new FormData();
                            for (var x = 0; x < fileUpload.length; x++) {
                                data.append("upload", fileUpload[x].file);
                            }
                            setStartLoader(true);
                            _getHeaders(data);
                        }}

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
                                            {/* <DropzoneArea
                                                filesLimit={1}
                                                acceptedFiles={['.xlsx', '.ods']}
                                                dropzoneText="Please Upload File From Here"
                                                useChipsForPreview
                                                onChange={(e) => setFileUpload(e)}
                                            /> */}

                                            <DropzoneAreaBase
                                                fileObjects={fileUpload}
                                                useChipsForPreview
                                                filesLimit={1}
                                                acceptedFiles={['.xlsx', '.ods']}
                                                dropzoneText="Please Upload File From Here"
                                                onAdd={handleAddFile}
                                                onDelete={handleRemoveFile}
                                                maxFileSize={(5 * 10000000)}
                                            />
                                        </Grid>

                                    </Grid>
                                    {supplierState?.hideSection !== true &&
                                        <CardActions
                                            style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                                        >
                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            // disabled={isSubmitting}
                                            >
                                                Submit
                                            </Button>
                                            {startLoader && <CircularProgress />}
                                        </CardActions>
                                    }
                                </form>
                            );
                        }}
                    </Formik>
                </Grid>

                {supplierState?.hideSection === true &&
                    <Grid item xs={12} md={6}>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues2}
                            onSubmit={(value, { setSubmitting, resetForm }) => {
                                try {
                                    let newObj = {}
                                    Object.keys(value.textValue).forEach((key) => {
                                        if (value.textValue[key])
                                            newObj = { ...newObj, [key]: value.textValue[key] }
                                        else
                                            newObj = { ...newObj, [key]: null }
                                    })

                                    const data: any = new FormData();
                                    // for (var x = 0; x < fileUpload.length; x++) {
                                    //     data.append("upload", fileUpload[x].file);
                                    // }
                                    data.set("file", supplierState.flatFileURL)
                                    data.set("mapper", JSON.stringify(newObj));
                                    data.set("supplier", props.supplier._id);
                                    value.service = isService
                                    let obj = {
                                        value: value.service,
                                        data: data
                                    }

                                    const supplier: any = {};
                                    supplier.supplier_id = props?.supplier?._id;
                                    supplier.supplierName = props?.supplier?.supplierName;
                                    if (isService === "gas") {
                                        supplier.gas_mapper = newObj;
                                    }
                                    else if (isService === "electric") {
                                        supplier.electric_mapper = newObj;
                                    }

                                    if (value.saveMapper) {
                                        setSecondLoader(true);
                                        _updateSupplier({ supplier });
                                    }
                                    else {
                                        if (isService === null || isService === undefined || isService === '') {
                                            setIsServiceError(true);
                                        }
                                        else {
                                            setSecondLoader(true);
                                            setIsStaus(false);
                                            _generateStandardFlatFile(obj);

                                            resetForm();
                                            setFileUpload([]);
                                        }
                                    }
                                }
                                catch (error) {
                                    console.log("error in supplier mapper ----------", error)
                                }
                            }}
                            validationSchema={Yup.object().shape({
                                // services: Yup.string().required("Please select the service"),
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
                                        <Grid container spacing={3} alignItems="center">

                                            <Grid item xs={12} md={12}>
                                                <label style={{ margin: "10px 0", display: "block", color: "#606060", fontSize: "0.9rem" }}>Select Service</label>
                                                <Select
                                                    // className={
                                                    //     errors.services && touched.services ? "ErrorColor" : ""
                                                    // }
                                                    variant="outlined"
                                                    id="services"
                                                    name="services"
                                                    label="Select Service"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setFieldValue("services", e);
                                                        setService(e.value);
                                                    }}
                                                    value={{
                                                        label: isService.toUpperCase(),
                                                        value: isService
                                                    }}
                                                    margin="normal"
                                                    aria-describedby="services-error"
                                                    options={flatFileServiceOption}
                                                />
                                                {isServiceError && (
                                                    <FormHelperText style={{ color: 'red' }} className="errormsg" id="services-error">
                                                        Please select the service
                                                    </FormHelperText>
                                                )}
                                            </Grid>
                                            {Object.keys(values.textValue).map((key) => (
                                                <>
                                                    <Grid item md={6} xs={12}>
                                                        {key}
                                                    </Grid>
                                                    <Grid item md={6} xs={12}>
                                                        <Select
                                                            // className={
                                                            //     errors.textValue[key] && touched.textValue[key] ? "ErrorColor" : ""
                                                            // }
                                                            variant="outlined"
                                                            id={`textValue.${key}`}
                                                            name={`textValue.${key}`}
                                                            // isClearable
                                                            size="small"
                                                            placeholder="Select one option"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                setFieldValue(`textValue.${key}`, e.value),
                                                                    setSelectedValue(e),
                                                                    setFiledRequired(e, `textValue.${key}`)
                                                            }}
                                                            value={{
                                                                label: values?.textValue[key],
                                                                value: values?.textValue[key]
                                                            }}
                                                            margin="normal"
                                                            aria-describedby="textValue[key]-error"
                                                            options={selectOption}
                                                            classNamePrefix="select"
                                                        />
                                                    </Grid>
                                                </>
                                            ))}

                                            {/* {["gas", "electric"].includes(isService) && isStatus && fieldError.length > 0 && fieldError !== null &&
                                                <FormHelperText className="errorLayout" id="textValue[key]-error">
                                                    Please select the
                                                    <strong>{fieldError.map((e) => (' ' + e.value + ','))} </strong>
                                                    from dropdown.
                                                </FormHelperText>
                                            } */}

                                        </Grid>

                                        <CardActions
                                            style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                                        >
                                            {secondLoader && <CircularProgress />}
                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    props.setFieldValue('saveMapper', false);
                                                    props.submitForm();
                                                }}
                                            >
                                                Submit
                                            </Button>

                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    props.setFieldValue('saveMapper', true);
                                                    props.submitForm();
                                                }}
                                            >
                                                Save Mapper
                                            </Button>

                                            <Button
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    props.resetForm();
                                                    resetMapper()
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </CardActions>
                                    </form>
                                );
                            }}
                        </Formik>
                    </Grid>
                }
            </Grid>

            <Dialog
                open={openModal}
                disableBackdropClick={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{"Standard Flat File Generated Successfully."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please check and send request if file data is correct else you can cancel it and re-generate file.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={sendFlatFileReq} color="primary">
                        Send {isLoader && <CircularProgress style={{ marginLeft: '10px' }} size="1.5rem" />}
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
