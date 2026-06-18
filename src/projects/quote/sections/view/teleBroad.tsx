import React, { useState, Suspense, useEffect } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import OnTextEditInput from '../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper';
import { helperMethods } from '../../../../sharedUtils/globalHelper/helperMethod'
import {
    TeleBroadPhoneSystem,
    TeleBroadProviderOptions,
    EconomyOptions,
    DivertsCostOptions,
    ContractLengthOption,
    AMS,
    combinedPackgeOptions,
} from "../../../../sharedUtils/globalHelper/constantValues";
import { QuoteStatusNames, RenewalStatusNames } from '../../../../sharedUtils/globalHelper/status'
import _ from 'lodash';

import DeleteRequest from '../smallModel/deleteRequest';
import { CommonSimple as ViewSimpleCompany } from '../../../company/loadable/CommonSimple';

export default function teleBroad(props) {

    const [dummyOne, setDummyOne] = useState('hello');

    useEffect(() => {
        setDummyOne('changedAgain')
    }, []);

    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const [defaultSS, setDefaultSS] = useState([]);
    const [isShowCompany, setIsShowCompany] = React.useState(false);
    const [companyData, setCompanyData] = React.useState({});
    const [CurrentSupplierId, setCurrentSupplierId] = useState('');
    const [selectedProduct, setSelectedProduct]: any = React.useState("");
    const [handsetPrice, setHandsetPrice]: any = React.useState("");
    const [selectPackage, setSelectPackage] = useState('');

    const { type } = props;
    const { QuoteID, Company, service, Site, postcode, Supplier, RenewalID, quoteStatus, Status, isActive, isDelete, contractLengthDate, isLiveDateProvided } = props.currentQuote;

    let teleBroad: any = {}
    if (service && service.telecomandbroadband) {
        teleBroad = { ...service.telecomandbroadband }
    }
    const CurrentSupplier = Supplier !== undefined && Supplier ? Supplier.supplierName : ''

    if (!props.isLoading && teleBroad !== undefined && teleBroad.Extras
        && typeof teleBroad.Extras === 'object' && dummyOne === 'changedAgain') {
        setDefaultSS(teleBroad.Extras.map(v => (
            {
                label: v,
                value: v
            }
        )))
        setDummyOne(Math.random().toString(36).substring(7));
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = teleBroad;
        const newSt = []
        qu.Extras = teleBroad.Extras;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        try {
            if (value.PhoneNumber) qu.PhoneNumber = value.PhoneNumber
            if (value.phoneSystem) qu.phoneSystem = value.phoneSystem;
            if (value.provider) qu.provider = value.provider;
            if (value.products) qu.products = value.products;
            if (value.broadband_number) qu.broadband_number = value.broadband_number

            if (teleBroad.phoneSystem === "VOIP") {
                if (value.number_of_handset) qu.number_of_handset = value.number_of_handset
            }
            if (value.additional_handsets) qu.additional_handsets = value.additional_handsets
            if (value.broadband_number) qu.broadband_number = value.broadband_number
            if (value.router) qu.router = value.router
            if (value.UserName) qu.UserName = value.UserName
            if (value.IPAddress) qu.IPAddress = value.IPAddress
            if (value.contract_length) qu.contract_length = value.contract_length;

            if (value.contract_start_date) {
                qu.contract_start_date = new Date(
                    value.contract_start_date
                ).getTime();
            } else {
                qu.contract_start_date = new Date().getTime();
            }

            if (value.contract_end_date) {
                qu.contract_end_date = new Date(
                    value.contract_end_date
                ).getTime();
            } else {
                qu.contract_end_date = new Date().getTime();
            }

            if (value.multiline) qu.multiline = value.multiline
            if (value.Multiline_PhoneNumber) qu.Multiline_PhoneNumber = value.Multiline_PhoneNumber
            if (value.multilineCost) qu.multilineCost = value.multilineCost

            if (value.extraMultiLine) qu.extraMultiLine = value.extraMultiLine
            if (value.divertsCost) qu.divertsCost = value.divertsCost.value;

            if (value.overall_customer_cost) qu.overall_customer_cost = value.overall_customer_cost
            if (value.oneOffCharge) qu.oneOffCharge = value.oneOffCharge
            if (value.costOfExtras) qu.costOfExtras = value.costOfExtras
            if (value.noOfRouter) qu.noOfRouter = value.noOfRouter
        }
        catch (error) {
            console.log('Error in update data', error)
        }

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'TelecomAndBroadband',
            service: {
                telecomandbroadband: qu
            }
        }
        // if (value.CurrentSupplier && CurrentSupplierId.length > 0) quoteUpdate.Supplier = CurrentSupplierId

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)

        closeEdit(null);
        setSubmitting(false);
    };

    const viewCompany = (data) => {
        setIsShowCompany(true)
        setCompanyData(data);
    }

    let isBroadbandNumber = false;
    if (teleBroad.products === "SOGEA" || teleBroad.products === "FTTP") {
        isBroadbandNumber = true;
    }
    else {
        isBroadbandNumber = false;
    }

    return (
        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <TableContainer component={Paper} className="AccordionStyle">
                    <Table aria-label="caption table">
                        <TableBody>
                            <TableRow>
                                <TableCell> <strong>{props.type === 'quote' ? 'Quote ID' : 'Renewal ID'}</strong></TableCell>
                                <TableCell component="th" scope="row">{props.type === 'quote' ? QuoteID : RenewalID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Company Name</strong></TableCell>
                                <TableCell component="th" scope="row" onClick={() => viewCompany(Company)} onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none' }}>
                                    {Company !== undefined && Company !== undefined && Company ? Company.businessName : ''} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Site Name</strong></TableCell>
                                <TableCell component="th" scope="row">{Site && Site.siteName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Status</strong></TableCell>
                                <TableCell component="th" scope="row">{props.type === 'quote' ? QuoteStatusNames[quoteStatus] : RenewalStatusNames[Status]}</TableCell>
                            </TableRow>
                            {props.currentQuote.Company && props.currentQuote.Company.postcode &&
                                <TableRow>
                                    <TableCell> <strong>Postcode</strong></TableCell>
                                    <TableCell component="th" scope="row">{props.currentQuote.Company.postcode}</TableCell>
                                </TableRow>
                            }


                            <TableRow>
                                <TableCell> <strong>Phone Number</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="PhoneNumber"
                                            value={teleBroad.PhoneNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                PhoneNumber: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.PhoneNumber && props.touched.PhoneNumber ? true : false}
                                                        className="profile-pic"
                                                        name="PhoneNumber"
                                                        value={props.values.PhoneNumber}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.PhoneNumber}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.PhoneNumber}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Type of Phone System</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="phoneSystem"
                                            value={teleBroad.phoneSystem}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                phoneSystem: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.phoneSystem && props.touched.phoneSystem ? true : false}
                                                        className="basic-multi-select"
                                                        name="phoneSystem"
                                                        value={{
                                                            label: props.values.phoneSystem,
                                                            value: props.values.phoneSystem
                                                        }}
                                                        options={TeleBroadPhoneSystem}
                                                        helperText={!props.errors.phoneSystem}
                                                        onChange={e => props.setFieldValue('phoneSystem', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.phoneSystem}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Provider</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="provider"
                                            value={teleBroad.provider}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                provider: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.provider && props.touched.provider ? true : false}
                                                        className="basic-multi-select"
                                                        name="provider"
                                                        value={{
                                                            label: props.values.provider,
                                                            value: props.values.provider
                                                        }}
                                                        options={TeleBroadProviderOptions}
                                                        helperText={!props.errors.provider}
                                                        onChange={e => props.setFieldValue('provider', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.provider}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Package</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="products"
                                            value={teleBroad.products}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                products: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.products && props.touched.products ? true : false}
                                                        className="basic-multi-select"
                                                        name="products"
                                                        value={{
                                                            label: props.values.products,
                                                            value: props.values.products
                                                        }}
                                                        options={combinedPackgeOptions}
                                                        helperText={!props.errors.products}
                                                        onChange={e => props.setFieldValue('products', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.products}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>One Off Charge</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="oneOffCharge"
                                            value={teleBroad.oneOffCharge}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                oneOffCharge: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.oneOffCharge && props.touched.oneOffCharge ? true : false}
                                                        className="profile-pic"
                                                        name="oneOffCharge"
                                                        value={props.values.oneOffCharge}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.oneOffCharge}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.oneOffCharge}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Broadband Number</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="broadband_number"
                                            value={teleBroad.broadband_number}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                broadband_number: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.broadband_number && props.touched.broadband_number ? true : false}
                                                        className="profile-pic"
                                                        name="broadband_number"
                                                        value={props.values.broadband_number}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.broadband_number}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.broadband_number}</TableCell>
                                }
                            </TableRow>

                            {teleBroad.phoneSystem === "VOIP" &&
                                <TableRow>
                                    <TableCell> <strong>Number of Handsets</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="number_of_handset"
                                                value={teleBroad.number_of_handset}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    number_of_handset: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.number_of_handset && props.touched.number_of_handset ? true : false}
                                                            className="profile-pic"
                                                            name="number_of_handset"
                                                            value={props.values.number_of_handset}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.number_of_handset}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.number_of_handset}</TableCell>
                                    }
                                </TableRow>
                            }

                            {teleBroad.number_of_handset >= 3 &&
                                <TableRow>
                                    <TableCell> <strong>Additional Handsets £10 Per Handsests</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="additional_handsets"
                                                value={teleBroad.additional_handsets}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    additional_handsets: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.additional_handsets && props.touched.additional_handsets ? true : false}
                                                            className="profile-pic"
                                                            name="additional_handsets"
                                                            value={props.values.additional_handsets}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.additional_handsets}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.additional_handsets}</TableCell>
                                    }
                                </TableRow>
                            }

                            {isBroadbandNumber &&
                                <TableRow>
                                    <TableCell> <strong>Broadband Number</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="broadband_number"
                                                value={teleBroad.broadband_number}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    broadband_number: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.broadband_number && props.touched.broadband_number ? true : false}
                                                            className="profile-pic"
                                                            name="broadband_number"
                                                            value={props.values.broadband_number}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.broadband_number}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.broadband_number}</TableCell>
                                    }
                                </TableRow>
                            }

                            <TableRow>
                                <TableCell>
                                    <strong>Customer got our Router</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="router"
                                            value={teleBroad.router}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                router: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.router && props.touched.router
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="router"
                                                        value={{
                                                            label: props.values.router,
                                                            value: props.values.router,
                                                        }}
                                                        options={EconomyOptions}
                                                        helperText={!props.errors.router}
                                                        onChange={(e) => {
                                                            props.setFieldValue("router", e.value);
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
                                        {teleBroad.router}
                                    </TableCell>
                                )}
                            </TableRow>

                            {teleBroad.router === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>Number of Routers</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="noOfRouter"
                                                value={teleBroad.noOfRouter}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    noOfRouter: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.noOfRouter && props.touched.noOfRouter ? true : false}
                                                            className="profile-pic"
                                                            name="noOfRouter"
                                                            value={props.values.noOfRouter}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.noOfRouter}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.noOfRouter}</TableCell>
                                    }
                                </TableRow>
                            }

                            {teleBroad.router === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>User Name</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="UserName"
                                                value={teleBroad.UserName}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    UserName: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.UserName && props.touched.UserName ? true : false}
                                                            className="profile-pic"
                                                            name="UserName"
                                                            value={props.values.UserName}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.UserName}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.UserName}</TableCell>
                                    }
                                </TableRow>
                            }

                            <TableRow>
                                <TableCell> <strong>IP Address</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="IPAddress"
                                            value={teleBroad.IPAddress}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                IPAddress: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.IPAddress && props.touched.IPAddress ? true : false}
                                                        className="profile-pic"
                                                        name="IPAddress"
                                                        value={props.values.IPAddress}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.IPAddress}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.IPAddress}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <strong>Contract length</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_length"
                                            value={teleBroad.contract_length}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_length: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.contract_length && props.touched.contract_length
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select"
                                                        name="contract_length"
                                                        value={{
                                                            label: props.values.contract_length,
                                                            value: props.values.contract_length,
                                                        }}
                                                        options={ContractLengthOption}
                                                        helperText={!props.errors.contract_length}
                                                        onChange={(e) =>
                                                            props.setFieldValue("contract_length", e.value)
                                                        }
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {teleBroad.contract_length}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell><strong>Contract Start Date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_start_date"
                                            value={helperMethods.ConvertDate(Number(teleBroad.contract_start_date))}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_start_date: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={props.errors.contract_start_date && props.touched.contract_start_date ? true : false}
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="contract_start_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(props.values.contract_start_date)}
                                                                onChange={e => props.setFieldValue('contract_start_date', Number(new Date(e).getTime()))}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                aria-describedby="contract_start_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(teleBroad.contract_start_date))}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell><strong>Contract End Date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_end_date"
                                            value={helperMethods.ConvertDate(Number(teleBroad.contract_end_date))}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_end_date: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={props.errors.contract_end_date && props.touched.contract_end_date ? true : false}
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="contract_end_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(props.values.contract_end_date)}
                                                                onChange={e => props.setFieldValue('contract_end_date', Number(new Date(e).getTime()))}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                aria-describedby="contract_end_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(teleBroad.contract_end_date))}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <strong>Multi Line</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="multiline"
                                            value={teleBroad.multiline}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                multiline: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.multiline && props.touched.multiline
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="multiline"
                                                        value={{
                                                            label: props.values.multiline,
                                                            value: props.values.multiline,
                                                        }}
                                                        options={EconomyOptions}
                                                        helperText={!props.errors.multiline}
                                                        onChange={(e) => {
                                                            props.setFieldValue("multiline", e.value);
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
                                        {teleBroad.multiline}
                                    </TableCell>
                                )}
                            </TableRow>

                            {teleBroad.multiline === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>Multiline Phone Number</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="Multiline_PhoneNumber"
                                                value={teleBroad.Multiline_PhoneNumber}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    Multiline_PhoneNumber: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.Multiline_PhoneNumber && props.touched.Multiline_PhoneNumber ? true : false}
                                                            className="profile-pic"
                                                            name="Multiline_PhoneNumber"
                                                            value={props.values.Multiline_PhoneNumber}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.Multiline_PhoneNumber}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.Multiline_PhoneNumber}</TableCell>
                                    }
                                </TableRow>
                            }

                            {teleBroad.multiline === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>Cost For Multi Line</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="multilineCost"
                                                value={teleBroad.multilineCost}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    multilineCost: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.multilineCost && props.touched.multilineCost ? true : false}
                                                            className="profile-pic"
                                                            name="multilineCost"
                                                            value={props.values.multilineCost}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.multilineCost}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.multilineCost}</TableCell>
                                    }
                                </TableRow>
                            }

                            {teleBroad.multiline === "Yes" &&
                                <TableRow>
                                    <TableCell>
                                        <strong>Extra on Multi Line</strong>
                                    </TableCell>
                                    {AMS.includes(props.slug) ? (
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="extraMultiLine"
                                                value={teleBroad.extraMultiLine}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    extraMultiLine: Yup.string().required("Required"),
                                                })}
                                            >
                                                {(props) => {
                                                    return (
                                                        <Select
                                                            error={
                                                                props.errors.extraMultiLine && props.touched.extraMultiLine
                                                                    ? true
                                                                    : false
                                                            }
                                                            className="basic-multi-select WidhtFull100"
                                                            name="extraMultiLine"
                                                            value={{
                                                                label: props.values.extraMultiLine,
                                                                value: props.values.extraMultiLine,
                                                            }}
                                                            options={EconomyOptions}
                                                            helperText={!props.errors.extraMultiLine}
                                                            onChange={(e) => {
                                                                props.setFieldValue("extraMultiLine", e.value);
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
                                            {teleBroad.extraMultiLine}
                                        </TableCell>
                                    )}
                                </TableRow>
                            }

                            {teleBroad.extraMultiLine === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>Type of Extras</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="divertsCost"
                                                value={teleBroad.divertsCost}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    divertsCost: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <Select
                                                            error={props.errors.divertsCost && props.touched.divertsCost ? true : false}
                                                            className="basic-multi-select"
                                                            name="divertsCost"
                                                            value={{
                                                                label: props.values.divertsCost,
                                                                value: props.values.divertsCost
                                                            }}
                                                            options={DivertsCostOptions}
                                                            helperText={!props.errors.divertsCost}
                                                            onChange={e => props.setFieldValue('divertsCost', e.value)}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.divertsCost}</TableCell>
                                    }
                                </TableRow>
                            }

                            {teleBroad.extraMultiLine === "Yes" &&
                                <TableRow>
                                    <TableCell> <strong>Cost of Extras</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="costOfExtras"
                                                value={teleBroad.costOfExtras}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    costOfExtras: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.costOfExtras && props.touched.costOfExtras ? true : false}
                                                            className="profile-pic"
                                                            name="costOfExtras"
                                                            value={props.values.costOfExtras}
                                                            onChange={props.handleChange}
                                                            helperText={!props.errors.costOfExtras}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{teleBroad.costOfExtras}</TableCell>
                                    }
                                </TableRow>
                            }

                            <TableRow>
                                <TableCell> <strong>Overall Cost to Customer</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="overall_customer_cost"
                                            value={teleBroad.overall_customer_cost}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                overall_customer_cost: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.overall_customer_cost && props.touched.overall_customer_cost ? true : false}
                                                        className="profile-pic"
                                                        name="overall_customer_cost"
                                                        value={props.values.overall_customer_cost}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.overall_customer_cost}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{teleBroad.overall_customer_cost}</TableCell>
                                }
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {(props.type === "quote" || props.type === "renewal") &&
                <Suspense fallback={<></>}><DeleteRequest {...props}></DeleteRequest></Suspense>
            }
            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
        </Grid>
    );
}