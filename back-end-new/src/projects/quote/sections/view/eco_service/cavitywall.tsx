import React, { useState } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from '../../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';
import { EconomyOptions, AMS } from '../../../../../sharedUtils/globalHelper/constantValues'
import Grid from '@material-ui/core/Grid';
import { helperMethods } from "../../../../../sharedUtils/globalHelper/helperMethod";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from '@material-ui/core/InputAdornment';

export default function CWI(props) {

    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const { service } = props.currentQuote;

    let Cwi: any = {}
    if (service && service.eco.subservice.cavitywall) {
        Cwi = { ...service.eco.subservice.cavitywall }
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = Cwi;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        if (value.propertyType) qu.propertyType = value.propertyType;
        if (value.numberOfBedrooms) qu.numberOfBedrooms = value.numberOfBedrooms;
        if (value.mainDwellingM2) qu.mainDwellingM2 = value.mainDwellingM2;
        if (value.ext1M2) qu.ext1M2 = value.ext1M2;
        if (value.ext2M2) qu.ext2M2 = value.ext2M2;
        if (value.ext3M2) qu.ext3M2 = value.ext3M2;
        if (value.totalWallArea) qu.totalWallArea = value.totalWallArea;
        if (value.popt) qu.popt = value.popt
        if (value.materialUsed) qu.materialUsed = value.materialUsed
        if (value.CwiEngeineer) qu.CwiEngeineer = value.CwiEngeineer
        if (value.handoverDate) qu.handoverDate = value.handoverDate;
        if (value.contributionPaid) qu.contributionPaid = value.contributionPaid;
        if (value.contributionAmount) qu.contributionAmount = value.contributionAmount;
        if (value.paymentMethod) qu.paymentMethod = value.paymentMethod;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'eco',
            service: {
                eco: {
                    subservice: {
                        ...service.eco.subservice,
                        cavitywall: qu
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
                        <strong>Property Type</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="propertyType"
                                value={Cwi.propertyType}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    propertyType: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.propertyType &&
                                                    props.touched.propertyType
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="propertyType"
                                            value={props.values.propertyType}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.propertyType}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.propertyType}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Number of Bedrooms</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="numberOfBedrooms"
                                value={Cwi.numberOfBedrooms}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    numberOfBedrooms: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.numberOfBedrooms &&
                                                    props.touched.numberOfBedrooms
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="numberOfBedrooms"
                                            type='number'
                                            value={props.values.numberOfBedrooms}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.numberOfBedrooms}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.numberOfBedrooms}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Main Dwelling m2 (-windows)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="mainDwellingM2"
                                value={Cwi.mainDwellingM2}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    mainDwellingM2: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.mainDwellingM2 &&
                                                    props.touched.mainDwellingM2
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="mainDwellingM2"
                                            value={props.values.mainDwellingM2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.mainDwellingM2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.mainDwellingM2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Ext1 m2 (-windows)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="ext1M2"
                                value={Cwi.ext1M2}
                                onSubmit={simpleEdit}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            className="profile-pic"
                                            name="ext1M2"
                                            value={props.values.ext1M2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.ext1M2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.ext1M2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Ext2 m2 (-windows)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="ext2M2"
                                value={Cwi.ext2M2}
                                onSubmit={simpleEdit}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            className="profile-pic"
                                            name="ext2M2"
                                            value={props.values.ext2M2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.ext2M2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.ext2M2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Ext3 m2 (-windows)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="ext3M2"
                                value={Cwi.ext3M2}
                                onSubmit={simpleEdit}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            className="profile-pic"
                                            name="ext3M2"
                                            value={props.values.ext3M2}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.ext3M2}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.ext3M2}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Total Wall Area (-windows)</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="totalWallArea"
                                value={Cwi.totalWallArea || "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    totalWallArea: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.totalWallArea &&
                                                    props.touched.totalWallArea
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="totalWallArea"
                                            value={props.values.totalWallArea}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.totalWallArea}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.totalWallArea}
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
                                value={Cwi.popt}
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
                            {Cwi.popt}
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
                                value={Cwi.materialUsed}
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
                            {Cwi.materialUsed}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>CWI Engineer</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="CwiEngeineer"
                                value={Cwi.CwiEngeineer}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    CwiEngeineer: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.CwiEngeineer &&
                                                    props.touched.CwiEngeineer
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="CwiEngeineer"
                                            value={props.values.CwiEngeineer}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.CwiEngeineer}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.CwiEngeineer}
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
                                value={Cwi.installDate ? new Date(Cwi.installDate).toLocaleDateString("en-GB") : "N/A"}
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
                                Number(Cwi.installDate)
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
                                value={Cwi.handoverDate ? new Date(Cwi.handoverDate).toLocaleDateString("en-GB") : "N/A"}
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
                                Number(Cwi.handoverDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Contribution Paid</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="contributionPaid"
                                value={Cwi.contributionPaid}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    contributionPaid: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.contributionPaid && props.touched.contributionPaid
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="contributionPaid"
                                            value={{
                                                label: props.values.contributionPaid,
                                                value: props.values.contributionPaid,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.contributionPaid}
                                            onChange={(e) => {
                                                props.setFieldValue("contributionPaid", e.value);
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
                            {Cwi.contributionPaid}
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
                                value={Cwi.contributionAmount}
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
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">£</InputAdornment>,
                                            }}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {Cwi.contributionAmount}
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
                                value={Cwi.paymentMethod}
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
                            {Cwi.paymentMethod}
                        </TableCell>
                    )}
                </TableRow>
            </Grid>
        </Grid>
    );
}
