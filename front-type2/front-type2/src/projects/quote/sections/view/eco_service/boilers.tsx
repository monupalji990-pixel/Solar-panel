import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from '../../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';
import { CustomerTypeOptions, CoverTypesOptions, EconomyOptions, RoofStructureOptions, AMS, ManufacturerOptions } from '../../../../../sharedUtils/globalHelper/constantValues'
import Grid from '@material-ui/core/Grid';
import { helperMethods } from "../../../../../sharedUtils/globalHelper/helperMethod";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function Boilers(props) {

    const { service } = props.currentQuote;
    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);

    let Boilers: any = {}
    if (service && service.eco.subservice.boilers) {
        Boilers = { ...service.eco.subservice.boilers }
    }
    const [manufacturerModel, setManufacturerModel] = useState([]);
    const [manufacturerModelNewBoiler, setManufacturerModelNewBoiler] = useState([]);

    useEffect(() => {
        ManufacturerOptions.map((e) => {
            if (e.label === Boilers.manufacturer){
                setManufacturerModel(e.models)
            }
        })

        ManufacturerOptions.map((e) => {
            if (e.label === Boilers.manufacturer1){
                setManufacturerModelNewBoiler(e.models)
            }
        })
    },[])

    const handleChangeManufacturer = (data) => {
        setManufacturerModel(data.models)
    }

    const handleChangeManufacturerNewBoiler = (data) => {
        setManufacturerModelNewBoiler(data.models)
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = Boilers;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        // Old Boilers
        if (value.combiBoiler) qu.combiBoiler = value.combiBoiler;
        if (value.manufacturer) qu.manufacturer = value.manufacturer;
        if (value.model) qu.model = value.model;
        if (value.model_qualifier) qu.model_qualifier = value.model_qualifier;
        if (value.gcNumber) qu.gcNumber = value.gcNumber;
        if (value.numberOfPreTRV) qu.numberOfPreTRV = value.numberOfPreTRV;
        if (value.numberofRads) qu.numberofRads = value.numberofRads;
        if (value.serialNumber) qu.serialNumber = value.serialNumber;
        if (value.boilerEfficiency) qu.boilerEfficiency = value.boilerEfficiency;
        if (value.yearOfOriginalCommissioning) qu.yearOfOriginalCommissioning = value.yearOfOriginalCommissioning;
        if (value.ageOfBoiler) qu.ageOfBoiler = value.ageOfBoiler;
        if (value.pcdbIndex) qu.pcdbIndex = value.pcdbIndex;

        // New Boilers
        if (value.combiBoiler1) qu.combiBoiler1 = value.combiBoiler1;
        if (value.manufacturer1) qu.manufacturer1 = value.manufacturer1;
        if (value.model1) qu.model1 = value.model1;
        if (value.model_qualifier1) qu.model_qualifier1 = value.model_qualifier1;
        if (value.gcNumber1) qu.gcNumber1 = value.gcNumber1;
        if (value.numberOfPreTRV1) qu.numberOfPreTRV1 = value.numberOfPreTRV1;
        if (value.serialNumber1) qu.serialNumber1 = value.serialNumber1;
        if (value.boilerEfficiency1) qu.boilerEfficiency1 = value.boilerEfficiency1;
        if (value.pcdbIndex1) qu.pcdbIndex1 = value.pcdbIndex1;

        if (value.newHeatingControl) qu.newHeatingControl = value.newHeatingControl;
        if (value.heating_control) qu.heating_control = value.heating_control;
        if (value.installer_name) qu.installer_name = value.installer_name;
        if (value.installerGasLicNo) qu.installerGasLicNo = value.installerGasLicNo;
        if (value.dataOfInstall) qu.dataOfInstall = value.dataOfInstall;
        if (value.handoverDate) qu.handoverDate = value.handoverDate;
        if (value.replacement_cost) qu.replacement_cost = value.replacement_cost;
        if (value.contributionAmount) qu.contributionAmount = value.contributionAmount;
        if (value.paymentMethod) qu.paymentMethod = value.paymentMethod;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'eco',
            service: {
                eco: {
                    subservice: {
                        ...service.eco.subservice,
                        boilers: qu
                    }
                }
            }
        }

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)

        closeEdit(null);
        setSubmitting(false);
    };

    return (
        <Grid container spacing={3} className="eco_service_table">
            <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>

                <Grid item xs={12} md={12} style={{ marginTop: 20 }}>
                    <h3>Older Boiler</h3>
                </Grid>

                <TableRow>
                    <TableCell>
                        <strong>Combi Boilers</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="combiBoiler"
                                value={Boilers.combiBoiler}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    combiBoiler: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.combiBoiler && props.touched.combiBoiler
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="combiBoiler"
                                            value={{
                                                label: props.values.combiBoiler,
                                                value: props.values.combiBoiler,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.combiBoiler}
                                            onChange={(e) => {
                                                props.setFieldValue("combiBoiler", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.combiBoiler}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Manufacturer</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="manufacturer"
                                value={Boilers.manufacturer}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    manufacturer: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                !!(props.errors.manufacturer && props.touched.manufacturer)
                                            }
                                            className="profile-pic"
                                            value={{
                                                label: props.values.manufacturer,
                                                value: props.values.manufacturer,
                                            }}
                                            onChange={(e) => {
                                                props.setFieldValue("manufacturer", e.value);
                                                handleChangeManufacturer(e)
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                            options={ManufacturerOptions}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.manufacturer}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Model</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="model"
                                value={Boilers.model}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    model: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                !!(props.errors.model && props.touched.model)
                                            }
                                            className="profile-pic"
                                            value={{
                                                label: props.values.model,
                                                value: props.values.model,
                                            }}
                                            onChange={(e) => {
                                                props.setFieldValue("model", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                            options={manufacturerModel}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.model}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Model Qualifier</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="model_qualifier"
                                value={Boilers.model_qualifier}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    model_qualifier: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.model_qualifier &&
                                                    props.touched.model_qualifier
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="model_qualifier"
                                            type='number'
                                            value={props.values.model_qualifier}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.model_qualifier}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.model_qualifier}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>GC Number</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="gcNumber"
                                value={Boilers.gcNumber}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    gcNumber: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.gcNumber &&
                                                    props.touched.gcNumber
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="gcNumber"
                                            type='number'
                                            value={props.values.gcNumber}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.gcNumber}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.gcNumber}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Number of Rad's</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="numberofRads"
                                value={Boilers.numberofRads || "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    numberofRads: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.numberofRads &&
                                                    props.touched.numberofRads
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="numberofRads"
                                            value={props.values.numberofRads}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.numberofRads}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.numberofRads}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Number of Pre TRV's</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="numberOfPreTRV"
                                value={Boilers.numberOfPreTRV}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    numberOfPreTRV: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.numberOfPreTRV &&
                                                    props.touched.numberOfPreTRV
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="numberOfPreTRV"
                                            value={props.values.numberOfPreTRV}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.numberOfPreTRV}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.numberOfPreTRV}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Serial Number</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="serialNumber"
                                value={Boilers.serialNumber}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    serialNumber: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.serialNumber &&
                                                    props.touched.serialNumber
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="serialNumber"
                                            value={props.values.serialNumber}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.serialNumber}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.serialNumber}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Approx age of property</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="boilerEfficiency"
                                value={Boilers.boilerEfficiency}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    boilerEfficiency: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.boilerEfficiency &&
                                                    props.touched.boilerEfficiency
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="boilerEfficiency"
                                            value={props.values.boilerEfficiency}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.boilerEfficiency}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.boilerEfficiency}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Year of Original Commissioning</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="yearOfOriginalCommissioning"
                                value={Boilers.yearOfOriginalCommissioning}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    yearOfOriginalCommissioning: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.yearOfOriginalCommissioning &&
                                                    props.touched.yearOfOriginalCommissioning
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="yearOfOriginalCommissioning"
                                            value={props.values.yearOfOriginalCommissioning}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.yearOfOriginalCommissioning}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.yearOfOriginalCommissioning}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Age of Boiler</strong>
                    </TableCell>

                    <TableCell component="th" scope="row">
                        {Math.abs(new Date().getFullYear() - Number(Boilers.yearOfOriginalCommissioning)) || 0}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>PCDB Index</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="pcdbIndex"
                                value={Boilers.pcdbIndex}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    pcdbIndex: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.pcdbIndex &&
                                                    props.touched.pcdbIndex
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="pcdbIndex"
                                            value={props.values.pcdbIndex}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.pcdbIndex}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.pcdbIndex}
                        </TableCell>
                    )}
                </TableRow>

                <Grid item xs={12} md={12} style={{ marginTop: 20 }}>
                    <h3>New Boiler</h3>
                </Grid>


                <TableRow>
                    <TableCell>
                        <strong>Combi Boilers</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="combiBoiler1"
                                value={Boilers.combiBoiler1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    combiBoiler1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.combiBoiler1 && props.touched.combiBoiler1
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="combiBoiler1"
                                            value={{
                                                label: props.values.combiBoiler1,
                                                value: props.values.combiBoiler1,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.combiBoiler1}
                                            onChange={(e) => {
                                                props.setFieldValue("combiBoiler1", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.combiBoiler1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Manufacturer</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="manufacturer1"
                                value={Boilers.manufacturer1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    manufacturer1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                !!(props.errors.manufacturer1 && props.touched.manufacturer1)
                                            }
                                            className="profile-pic"
                                            value={{
                                                label: props.values.manufacturer1,
                                                value: props.values.manufacturer1,
                                            }}
                                            onChange={(e) => {
                                                props.setFieldValue("manufacturer1", e.value);
                                                handleChangeManufacturerNewBoiler(e)
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                            options={ManufacturerOptions}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.manufacturer1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Model</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="model1"
                                value={Boilers.model1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    model1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                !!(props.errors.model1 && props.touched.model1)
                                            }
                                            className="profile-pic"
                                            value={{
                                                label: props.values.model1,
                                                value: props.values.model1,
                                            }}
                                            onChange={(e) => {
                                                props.setFieldValue("model1", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                            options={manufacturerModelNewBoiler}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.model1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Model Qualifier</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="model_qualifier1"
                                value={Boilers.model_qualifier1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    model_qualifier1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.model_qualifier1 &&
                                                    props.touched.model_qualifier1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="model_qualifier1"
                                            type='number'
                                            value={props.values.model_qualifier1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.model_qualifier1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.model_qualifier1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>GC Number</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="gcNumber1"
                                value={Boilers.gcNumber1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    gcNumber1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.gcNumber1 &&
                                                    props.touched.gcNumber1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="gcNumber1"
                                            type='number'
                                            value={props.values.gcNumber1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.gcNumber1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.gcNumber1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Number of Post TRV's</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="numberOfPreTRV1"
                                value={Boilers.numberOfPreTRV1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    numberOfPreTRV1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.numberOfPreTRV1 &&
                                                    props.touched.numberOfPreTRV1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="numberOfPreTRV1"
                                            value={props.values.numberOfPreTRV1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.numberOfPreTRV1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.numberOfPreTRV1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Serial Number</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="serialNumber1"
                                value={Boilers.serialNumber1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    serialNumber1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.serialNumber1 &&
                                                    props.touched.serialNumber1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="serialNumber1"
                                            value={props.values.serialNumber1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.serialNumber1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.serialNumber1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Approx age of property</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="boilerEfficiency1"
                                value={Boilers.boilerEfficiency1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    boilerEfficiency1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.boilerEfficiency1 &&
                                                    props.touched.boilerEfficiency1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="boilerEfficiency1"
                                            value={props.values.boilerEfficiency1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.boilerEfficiency1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.boilerEfficiency1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>New Heating Control</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="newHeatingControl"
                                value={Boilers.newHeatingControl}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    newHeatingControl: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.newHeatingControl && props.touched.newHeatingControl
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="newHeatingControl"
                                            value={{
                                                label: props.values.newHeatingControl,
                                                value: props.values.newHeatingControl,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.newHeatingControl}
                                            onChange={(e) => {
                                                props.setFieldValue("newHeatingControl", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.newHeatingControl}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Heating Control</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="heating_control"
                                value={Boilers.heating_control}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    heating_control: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.heating_control &&
                                                    props.touched.heating_control
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="heating_control"
                                            value={props.values.heating_control}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.heating_control}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.heating_control}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Installer Name</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="installer_name"
                                value={Boilers.installer_name}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    installer_name: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.installer_name &&
                                                    props.touched.installer_name
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="installer_name"
                                            value={props.values.installer_name}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.installer_name}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.installer_name}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Installer Gas Safe Card Licence No</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="installerGasLicNo"
                                value={Boilers.installerGasLicNo}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    installerGasLicNo: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.installerGasLicNo &&
                                                    props.touched.installerGasLicNo
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="installerGasLicNo"
                                            value={props.values.installerGasLicNo}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.installerGasLicNo}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.installerGasLicNo}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Date of Install</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="dataOfInstall"
                                value={Boilers.dataOfInstall ? new Date(Boilers.dataOfInstall).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    dataOfInstall: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.dataOfInstall &&
                                                            props.touched.dataOfInstall
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="dataOfInstall"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.dataOfInstall
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "dataOfInstall",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="dataOfInstall-number-error"
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {helperMethods.ConvertDate(
                                Number(Boilers.dataOfInstall)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Handover Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="handoverDate"
                                value={Boilers.handoverDate ? new Date(Boilers.handoverDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    handoverDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.handoverDate &&
                                                            props.touched.handoverDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="handoverDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.handoverDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "handoverDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="handoverDate-number-error"
                                                />
                                            </Grid>
                                        </MuiPickersUtilsProvider>
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {helperMethods.ConvertDate(
                                Number(Boilers.handoverDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>PCDB Index</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="pcdbIndex1"
                                value={Boilers.pcdbIndex1}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    pcdbIndex1: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.pcdbIndex1 &&
                                                    props.touched.pcdbIndex1
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="pcdbIndex1"
                                            value={props.values.pcdbIndex1}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.pcdbIndex1}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.pcdbIndex1}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Replacement Cost</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="replacement_cost"
                                value={Boilers.replacement_cost}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    replacement_cost: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.replacement_cost &&
                                                    props.touched.replacement_cost
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="replacement_cost"
                                            value={props.values.replacement_cost}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.replacement_cost}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.replacement_cost}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Contribution Amount</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="contributionAmount"
                                value={Boilers.contributionAmount}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    contributionAmount: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.contributionAmount &&
                                                    props.touched.contributionAmount
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="contributionAmount"
                                            value={props.values.contributionAmount}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.contributionAmount}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.contributionAmount}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Payment Method</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="paymentMethod"
                                value={Boilers.paymentMethod}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    paymentMethod: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.paymentMethod &&
                                                    props.touched.paymentMethod
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="paymentMethod"
                                            value={props.values.paymentMethod}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.paymentMethod}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Boilers.paymentMethod}
                        </TableCell>
                    )}
                </TableRow>
            </Grid>
        </Grid>
    );
}
