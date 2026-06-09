import React, { useState, Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
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
    ContractLengthOption, ConnectionOptions, LineRentalOptions,
    AddExtrasOptions, ExtrasOptions, AMS, WholeSaleProviderOptions, telecomStatusOptions, TelecomConnectionOptions,
    mapOptionsForService
} from '../../../../sharedUtils/globalHelper/constantValues'
import { QuoteStatusNames, RenewalStatusNames } from '../../../../sharedUtils/globalHelper/status'
import _ from 'lodash';
import DeleteRequest from '../smallModel/deleteRequest';
import { CommonSimple as ViewSimpleCompany } from '../../../company/loadable/CommonSimple';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Input } from '@material-ui/core';

export default function Telecoms(props) {

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

    const { type } = props;
    const { QuoteID, Company, service, Site, Supplier, RenewalID, quoteStatus, Status } = props.currentQuote;

    let telecoms: any = {}
    if (service && service.telecoms) {
        telecoms = { ...service.telecoms }
    }
    const CurrentSupplier = Supplier !== undefined && Supplier ? Supplier.supplierName : ''
    let supplierList = []
    if (props.suppliers) {
        let voipList = helperMethods.specificServiceSupplier(props.suppliers, 'VOIP', 'add')
        let mobileList = helperMethods.specificServiceSupplier(props.suppliers, 'Mobile', 'add')
        let phoneLineList = helperMethods.specificServiceSupplier(props.suppliers, 'Phone Line', 'add')
        supplierList = _.unionBy(voipList, mobileList, phoneLineList, 'value');
    }

    if (!props.isLoading && telecoms !== undefined && telecoms.Extras
        && typeof telecoms.Extras === 'object' && dummyOne === 'changedAgain') {
        setDefaultSS(telecoms.Extras.map(v => (
            {
                label: v,
                value: v
            }
        )))
        setDummyOne(Math.random().toString(36).substring(7));
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = telecoms;
        const newSt = []
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
        if (value.connectionType) qu.connectionType = value.connectionType;
        if (value.ConnectionCharges) qu.ConnectionCharges = value.ConnectionCharges;
        if (value.AddExtras) qu.AddExtras = value.AddExtras;
        if (value.lineRentalPackageName) qu.lineRentalPackageName = value.lineRentalPackageName
        if (value.lineRental) qu.lineRental = value.lineRental
        if (value.ExtraServiceName) qu.ExtraServiceName = value.ExtraServiceName
        if (value.ExtraServiceCharges) qu.ExtraServiceCharges = value.ExtraServiceCharges

        if (value.TelecomsLiveDate) qu.TelecomsLiveDate = value.TelecomsLiveDate;
        if (value.TelecomsRenewalDate) qu.TelecomsRenewalDate = value.TelecomsRenewalDate;
        if (value.status) qu.status = value.status;
        if (value.CashAmount) qu.CashAmount = value.CashAmount;
        if (value.previous_contract_length) qu.previous_contract_length = value.previous_contract_length;
        if (value.contract_length) qu.contract_length = value.contract_length;
        if (value.contract_start_date) qu.contract_start_date = value.contract_start_date;
        if (value.previous_contract_start_date) qu.previous_contract_start_date = value.previous_contract_start_date;
        if (value.accountNumber) qu.accountNumber = value.accountNumber;
        if (value.WholeSaleProvider) qu.WholeSaleProvider = value.WholeSaleProvider
        if (value.cust_id) qu.cust_id = value.cust_id
        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'telecoms',
            service: {
                telecoms: qu
            }
        }
        if (value.CurrentSupplier && CurrentSupplierId.length > 0) quoteUpdate.Supplier = CurrentSupplierId

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)
        if (props.type === 'quote') {
            //     props.toast("Quote edited Successfully")
        } else {
            //   props.toast("Renewal edited Successfully")
        }
        closeEdit(null);
        setSubmitting(false);
    };

    const viewCompany = (data) => {
        setIsShowCompany(true)
        setCompanyData(data);
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
                                <TableCell> <strong>Current Supplier</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="CurrentSupplier"
                                            value={CurrentSupplier}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                CurrentSupplier: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.CurrentSupplier && props.touched.CurrentSupplier ? true : false}
                                                        className="basic-multi-select WidhtFull100"
                                                        name="CurrentSupplier"
                                                        value={{
                                                            label: props.values.CurrentSupplier,
                                                            value: props.values.CurrentSupplier
                                                        }}
                                                        options={supplierList}
                                                        helperText={!props.errors.CurrentSupplier}
                                                        onChange={e => {
                                                            props.setFieldValue('CurrentSupplier', e.label)
                                                            setCurrentSupplierId(e.value)
                                                        }}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{Supplier && Supplier.supplierName}</TableCell>}
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Telecom status</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="status"
                                            value={telecoms.status}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                status: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.status && props.touched.status ? true : false}
                                                        className="basic-multi-select"
                                                        name="status"
                                                        value={{
                                                            label: props.values.status,
                                                            value: props.values.status
                                                        }}
                                                        options={telecomStatusOptions}
                                                        helperText={!props.errors.status}
                                                        onChange={e => props.setFieldValue('status', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.status}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Cash Amount</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="CashAmount"
                                            value={telecoms.CashAmount}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                CashAmount: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.CashAmount && props.touched.CashAmount ? true : false}
                                                        name="CashAmount"
                                                        value={props.values.CashAmount}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.CashAmount}</TableCell>
                                }
                            </TableRow>

                            {props.type == 'quote' && <TableRow>
                                <TableCell> <strong>Current Contract Length</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_length"
                                            value={telecoms.previous_contract_length}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                previous_contract_length: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.previous_contract_length && props.touched.previous_contract_length ? true : false}
                                                        className="basic-multi-select"
                                                        name="previous_contract_length"
                                                        value={{
                                                            label: props.values.previous_contract_length,
                                                            value: props.values.previous_contract_length
                                                        }}
                                                        options={ContractLengthOption}
                                                        helperText={!props.errors.previous_contract_length}
                                                        onChange={e => props.setFieldValue('previous_contract_length', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{telecoms.previous_contract_length}</TableCell>
                                }
                            </TableRow>}
                            {props.type == 'quote' && <TableRow>
                                <TableCell><strong>Current Contract End Date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_start_date"
                                            value={helperMethods.ConvertDate(Number(telecoms.previous_contract_start_date))}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                previous_contract_start_date: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={props.errors.previous_contract_start_date && props.touched.previous_contract_start_date ? true : false}
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="previous_contract_start_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(props.values.previous_contract_start_date)}
                                                                onChange={e => props.setFieldValue('previous_contract_start_date', Number(new Date(e).getTime()))}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                aria-describedby="previous_contract_start_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(telecoms.previous_contract_start_date))}</TableCell>
                                }
                            </TableRow>}
                            <TableRow>
                                <TableCell> <strong>Contract Length</strong></TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_length"
                                            value={telecoms.contract_length}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_length: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.contract_length && props.touched.contract_length ? true : false}
                                                        className="basic-multi-select"
                                                        name="contract_length"
                                                        value={{
                                                            label: props.values.contract_length,
                                                            value: props.values.contract_length
                                                        }}
                                                        options={ContractLengthOption}
                                                        helperText={!props.errors.contract_length}
                                                        onChange={e => props.setFieldValue('contract_length', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{telecoms.contract_length}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Contract Start Date</strong></TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_start_date"
                                            value={helperMethods.ConvertDate(Number(telecoms.contract_start_date))}
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
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(telecoms.contract_start_date))}</TableCell>
                                }
                            </TableRow>
                           
                            <TableRow>
                                <TableCell> <strong>Connection Type</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="connectionType"
                                            value={telecoms.connectionType}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                connectionType: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.connectionType && props.touched.connectionType ? true : false}
                                                        className="basic-multi-select"
                                                        name="connectionType"
                                                        value={{
                                                            label: props.values.connectionType,
                                                            value: props.values.connectionType
                                                        }}
                                                        options={TelecomConnectionOptions}
                                                        helperText={!props.errors.connectionType}
                                                        onChange={e => props.setFieldValue('connectionType', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{telecoms.connectionType}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Enter Package Name</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="lineRentalPackageName"
                                            value={telecoms.lineRentalPackageName}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                lineRentalPackageName: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.lineRentalPackageName && props.touched.lineRentalPackageName ? true : false}
                                                        name="lineRentalPackageName"
                                                        value={props.values.lineRentalPackageName}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.lineRentalPackageName}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Enter Line Rental</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="lineRental"
                                            value={telecoms.lineRental}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                lineRental: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.lineRental && props.touched.lineRental ? true : false}
                                                        name="lineRental"
                                                        value={props.values.lineRental}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                        type='number'
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.lineRental}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Connection charges</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="ConnectionCharges"
                                            value={telecoms.ConnectionCharges}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                ConnectionCharges: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.ConnectionCharges && props.touched.ConnectionCharges ? true : false}
                                                        className="basic-multi-select"
                                                        name="ConnectionCharges"
                                                        value={{
                                                            label: props.values.ConnectionCharges,
                                                            value: props.values.ConnectionCharges
                                                        }}
                                                        options={ConnectionOptions}
                                                        helperText={!props.errors.ConnectionCharges}
                                                        onChange={e => props.setFieldValue('ConnectionCharges', e.value)}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{telecoms.ConnectionCharges}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Enter Extra Service Name</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="ExtraServiceName"
                                            value={telecoms.ExtraServiceName}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                ExtraServiceName: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.ExtraServiceName && props.touched.ExtraServiceName ? true : false}
                                                        name="ExtraServiceName"
                                                        value={props.values.ExtraServiceName}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.ExtraServiceName}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Enter Extra Service Charge</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="ExtraServiceCharges"
                                            value={telecoms.ExtraServiceCharges}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                ExtraServiceCharges: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.ExtraServiceCharges && props.touched.ExtraServiceCharges ? true : false}
                                                        name="ExtraServiceCharges"
                                                        value={props.values.ExtraServiceCharges}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                        type='number'
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.ExtraServiceCharges}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>BACS/CUST ID NO</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="cust_id"
                                            value={telecoms.cust_id}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                cust_id: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.cust_id && props.touched.cust_id ? true : false}
                                                        name="cust_id"
                                                        value={props.values.cust_id}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> :
                                    <TableCell component="th" scope="row">{telecoms.cust_id}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Telecoms live date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="TelecomsLiveDate"
                                            value={helperMethods.ConvertDate(Number(telecoms.TelecomsLiveDate))}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                TelecomsLiveDate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={props.errors.TelecomsLiveDate && props.touched.TelecomsLiveDate ? true : false}
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="TelecomsLiveDate"
                                                                format="dd/MM/yyyy"
                                                                value={props.values.TelecomsLiveDate}
                                                                onChange={e => props.setFieldValue('TelecomsLiveDate', Number(new Date(e).getTime()))}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                aria-describedby="previous_contract_start_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(telecoms.TelecomsLiveDate))}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Telecoms renewal date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="TelecomsRenewalDate"
                                            value={helperMethods.ConvertDate(Number(telecoms.TelecomsRenewalDate))}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                TelecomsRenewalDate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={props.errors.TelecomsRenewalDate && props.touched.TelecomsRenewalDate ? true : false}
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="TelecomsRenewalDate"
                                                                format="dd/MM/yyyy"
                                                                value={props.values.TelecomsRenewalDate}
                                                                onChange={e => props.setFieldValue('TelecomsRenewalDate', Number(new Date(e).getTime()))}
                                                                KeyboardButtonProps={{
                                                                    'aria-label': 'change date',
                                                                }}
                                                                aria-describedby="previous_contract_start_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(telecoms.TelecomsRenewalDate))}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Account Number</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="accountNumber"
                                            value={telecoms.accountNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                accountNumber: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.accountNumber && props.touched.accountNumber ? true : false}
                                                        name="accountNumber"
                                                        value={props.values.accountNumber}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{telecoms.accountNumber}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Wholesale Provider</strong></TableCell>
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="WholeSaleProvider"
                                        value={telecoms.WholeSaleProvider}
                                        onSubmit={simpleEdit}
                                        validateIt={Yup.object().shape({
                                            WholeSaleProvider: Yup.string().required('Required'),
                                        })}
                                    >
                                        {props => {
                                            return (
                                                <Select
                                                    error={props.errors.WholeSaleProvider && props.touched.WholeSaleProvider ? true : false}
                                                    className="basic-multi-select"
                                                    name="WholeSaleProvider"
                                                    value={{
                                                        label: props.values.WholeSaleProvider,
                                                        value: props.values.WholeSaleProvider
                                                    }}
                                                    options={WholeSaleProviderOptions}
                                                    helperText={!props.errors.WholeSaleProvider}
                                                    onChange={e => props.setFieldValue('WholeSaleProvider', e.value)}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                />
                                            );
                                        }}
                                    </OnTextEditInput>
                                </TableCell>
                            </TableRow>
                            {(props.type === "quote" || props.type === "renewal") &&
                                <Suspense fallback={<></>}><DeleteRequest {...props}></DeleteRequest></Suspense>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <TableContainer component={Paper} className="AccordionStyle">
                    <Formik
                        initialValues={{ phoneNumbers: telecoms.phoneNumbers }}
                        onSubmit={(value) => {
                            const qu = telecoms;
                            if (value.phoneNumbers) qu.phoneNumbers = value.phoneNumbers;
                            const quoteUpdate: any = {
                                quoteId: props.currentQuote._id,
                                serviceTypeName: 'telecoms',
                                service: {
                                    telecoms: qu
                                }
                            }
                            props._isLoadingData(true, props.type);
                            props._editQuote(quoteUpdate, props.type)
                        }}
                        render={({ values, handleChange }) => (
                            <Form>
                                <FieldArray
                                    name="phoneNumbers"
                                    render={() => (
                                        <div>
                                            {values.phoneNumbers && (
                                                values.phoneNumbers.map((ele, index) => (
                                                    <div key={index}>
                                                        <TableRow>
                                                            <TableCell>
                                                                <strong>Phone Number {index + 1}</strong>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name={`phoneNumbers.${index}`}
                                                                    id={`phoneNumbers.${index}`}
                                                                    defaultValue={ele}
                                                                    type='number'
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    </div>
                                                ))
                                            )}
                                            <div style={{ margin: '12px' }}>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                    variant='contained'
                                                    size='small'
                                                >
                                                    UPDATE
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                />
                            </Form>
                        )}
                    />
                </TableContainer>
            </Grid>
            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
        </Grid>
    );
}