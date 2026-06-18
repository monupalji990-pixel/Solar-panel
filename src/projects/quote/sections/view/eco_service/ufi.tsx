import React, { useState } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from '../../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';
import { CustomerTypeOptions, CoverTypesOptions, EconomyOptions, RoofStructureOptions, AMS } from '../../../../../sharedUtils/globalHelper/constantValues'
import Grid from '@material-ui/core/Grid';
import { helperMethods } from "../../../../../sharedUtils/globalHelper/helperMethod";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function UFI(props) {

    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const { service } = props.currentQuote;

    let Ufi: any = {}
    if (service && service.eco.subservice.ufiunderfloor) {
        Ufi = { ...service.eco.subservice.ufiunderfloor }
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = Ufi;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        // Old Boilers
        if (value.timberSuspendedFloorAreaM2) qu.timberSuspendedFloorAreaM2 = value.timberSuspendedFloorAreaM2;
        if (value.solidFloorAreaM2) qu.solidFloorAreaM2 = value.solidFloorAreaM2;
        if (value.totalFloorAreaM2) qu.totalFloorAreaM2 = value.totalFloorAreaM2;
        if (value.popt) qu.popt = value.popt;
        if (value.materialUsed) qu.materialUsed = value.materialUsed;
        if (value.installerName) qu.installerName = value.installerName;
        if (value.installDate) qu.installDate = value.installDate;
        if (value.handoverDate) qu.handoverDate = value.handoverDate;
        if (value.swipeWarrantyApplied) qu.swipeWarrantyApplied = value.swipeWarrantyApplied;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'eco',
            service: {
                eco: {
                    subservice: {
                        ...service.eco.subservice,
                        ufiunderfloor: qu
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

                <TableRow>
                    <TableCell>
                        <strong>Timber Suspended Floor Area m2</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="timberSuspendedFloorAreaM2"
                                value={Ufi.timberSuspendedFloorAreaM2}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    timberSuspendedFloorAreaM2: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.timberSuspendedFloorAreaM2 &&
                                                    props.touched.timberSuspendedFloorAreaM2
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="timberSuspendedFloorAreaM2"
                                            value={props.values.timberSuspendedFloorAreaM2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.timberSuspendedFloorAreaM2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.timberSuspendedFloorAreaM2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Solid Floor Area m2</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="solidFloorAreaM2"
                                value={Ufi.solidFloorAreaM2}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    solidFloorAreaM2: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.solidFloorAreaM2 &&
                                                    props.touched.solidFloorAreaM2
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="solidFloorAreaM2"
                                            value={props.values.solidFloorAreaM2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.solidFloorAreaM2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.solidFloorAreaM2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Total Floor Area m2</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="totalFloorAreaM2"
                                value={Ufi.totalFloorAreaM2}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    totalFloorAreaM2: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.totalFloorAreaM2 &&
                                                    props.touched.totalFloorAreaM2
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="totalFloorAreaM2"
                                            value={props.values.totalFloorAreaM2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.totalFloorAreaM2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.totalFloorAreaM2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>POPT</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="popt"
                                value={Ufi.popt}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    popt: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.popt &&
                                                    props.touched.popt
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="popt"
                                            value={props.values.popt}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.popt}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.popt}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Material Used</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="materialUsed"
                                value={Ufi.materialUsed || "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    materialUsed: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.materialUsed &&
                                                    props.touched.materialUsed
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="materialUsed"
                                            value={props.values.materialUsed}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.materialUsed}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.materialUsed}
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
                                name="installerName"
                                value={Ufi.installerName}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    installerName: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.installerName &&
                                                    props.touched.installerName
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="installerName"
                                            value={props.values.installerName}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.installerName}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Ufi.installerName}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Install Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="installDate"
                                value={Ufi.installDate ? new Date(Ufi.installDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    installDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.installDate &&
                                                            props.touched.installDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="installDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.installDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "installDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="installDate-number-error"
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
                                Number(Ufi.installDate)
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
                                value={Ufi.handoverDate ? new Date(Ufi.handoverDate).toLocaleDateString("en-GB") : "N/A"}
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
                                Number(Ufi.handoverDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>


                <TableRow>
                    <TableCell>
                        <strong>Swipe Warranty applied</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="swipeWarrantyApplied"
                                value={Ufi.swipeWarrantyApplied}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    swipeWarrantyApplied: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.swipeWarrantyApplied && props.touched.swipeWarrantyApplied
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="swipeWarrantyApplied"
                                            value={{
                                                label: props.values.swipeWarrantyApplied,
                                                value: props.values.swipeWarrantyApplied,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.swipeWarrantyApplied}
                                            onChange={(e) => {
                                                props.setFieldValue("swipeWarrantyApplied", e.value);
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
                            {Ufi.swipeWarrantyApplied}
                        </TableCell>
                    )}
                </TableRow>
            </Grid>
        </Grid>
    );
}
