import React, { useState, Suspense } from 'react';
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
import { ContractLengthOption, BillDateTypeOption, AMS, mapOptionsForService } from '../../../../sharedUtils/globalHelper/constantValues'
import { QuoteStatusNames, RenewalStatusNames } from '../../../../sharedUtils/globalHelper/status'
import DeleteRequest from '../smallModel/deleteRequest';
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from '../../../consumer/loadable/CommonSimple';

export default function Electric(props) {

    const [changeBillType, setBillType] = useState('');
    const [changeBillTypeToggle, setBillTypeToggle] = useState(true);
    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const [CurrentSupplierId, setCurrentSupplierId] = useState('');
    const [isShowCompany, setIsShowCompany] = React.useState(false);
    const [companyData, setCompanyData] = React.useState({});
    const [isShowConsumer, setIsShowConsumer] = React.useState(false);
    const [consumerData, setConsumerData] = React.useState({});
    const { type } = props;
    const currentQuoteTemp = { ...props.currentQuote };
    const { QuoteID, Company, service, Consumer, postcode, Site, Supplier, RenewalID, quoteStatus, Status, isActive, isDelete, contractLengthDate, isLiveDateProvided } = props.currentQuote;

    const electricMOptions = mapOptionsForService.Electric;


    let electric: any = {}
    if (service && service.electric) {
        electric = { ...service.electric }

        const filtered = Object.keys(electric).filter(key => {
            const found = electricMOptions.find(e => e.value.split('.')[2] == key);
            if (found && found.value) {
                return false;
            }
            return true;
        })
    }

    const handleChangeForBillType = (event) => {
        setBillType(event.value);
    }

    if (electric && electric.bill_date_type && changeBillTypeToggle) {
        setBillType(electric.bill_date_type);
        setBillTypeToggle(false);
    }


    const simpleEdit = (value, closeEdit, setSubmitting) => {

        const qu = electric;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
        if (value.topLine) qu.topLine = value.topLine;
        if (value.meterNumber) qu.meterNumber = value.meterNumber;
        if (value.meterSerialNumber) qu.meterSerialNumber = value.meterSerialNumber;

        if (value.topLineTwo) qu.topLineTwo = value.topLineTwo;
        if (value.meterNumberTwo) qu.meterNumberTwo = value.meterNumberTwo;

        if (value.COT) qu.COT = value.COT;
        if (value.dailyCharges) qu.dailyCharges = value.dailyCharges;
        if (value.unitDayRate) qu.unitDayRate = value.unitDayRate;
        if (value.unitDaykWh) qu.unitDaykWh = value.unitDaykWh;
        if (value.unitNightRate) qu.unitNightRate = value.unitNightRate;
        if (value.unitNightkWH) qu.unitNightkWH = value.unitNightkWH;
        if (value.unitWkdRate) qu.unitWkdRate = value.unitWkdRate;
        if (value.unitWkdkWh) qu.unitWkdkWh = value.unitWkdkWh;
        if (value.unitWinterRate) qu.unitWinterRate = value.unitWinterRate;
        if (value.unitWinterkWH) qu.unitWinterkWH = value.unitWinterkWH;
        if (value.previous_contract_length) qu.previous_contract_length = value.previous_contract_length;
        if (value.contract_length) qu.contract_length = value.contract_length;
        if (value.contract_start_date) qu.contract_start_date = value.contract_start_date;
        if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
        if (value.previous_contract_start_date) qu.previous_contract_start_date = value.previous_contract_start_date;
        if (value.bill_date_type) qu.bill_date_type = value.bill_date_type;
        if (value.no_of_days) qu.no_of_days = value.no_of_days;
        if (value.bill_start_date) qu.bill_start_date = value.bill_start_date;
        if (value.bill_end_date) qu.bill_end_date = value.bill_end_date;
        if (value.accountNumber) qu.accountNumber = value.accountNumber;
        if (value.onlineAccountUserName) qu.onlineAccountUserName = value.onlineAccountUserName;
        if (value.onlineAccountPassword) qu.onlineAccountPassword = value.onlineAccountPassword;
        console.log('value editQuote --- ', qu);

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'electric',
            service: {
                electric: qu
            }
        }
        if (value.CurrentSupplier) quoteUpdate.Supplier = CurrentSupplierId

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)
        if (props.type === 'quote') {
            //      props.toast("Quote edited Successfully")
        } else {
            //       props.toast("Renewal edited Successfully")
        }
        closeEdit(null);
        setSubmitting(false);
    };

    let supplierList = []
    if (props.suppliers) {
        supplierList = helperMethods.specificServiceSupplier(props.suppliers, 'Electric', 'edit')
    }

    const CurrentSupplier = Supplier !== undefined && Supplier ? Supplier.supplierName : ''

    const BillDateTypeArray = {
        'Date range': 'Date range',
        'Number days': 'Number days',
        '1': 'Date range',
        '2': 'Number days'
    };

    const viewCompany = (data) => {
        setIsShowCompany(true)
        setCompanyData(data);
    }

    const viewConsumer = (data) => {
        setIsShowConsumer(true)
        setConsumerData(data);
    }

    return (

        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                        <TableBody>
                            <TableRow>
                                <TableCell> <strong>{props.type === 'quote' ? 'Quote ID' : 'Renewal ID'}</strong></TableCell>
                                <TableCell component="th" scope="row">{props.type === 'quote' ? QuoteID : RenewalID}</TableCell>
                            </TableRow>

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Company !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Company Name</strong></TableCell>
                                    <TableCell component="th" scope="row" onClick={() => viewCompany(Company)} onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none' }}>
                                        {Company !== undefined && Company !== undefined && Company ? Company.businessName : ''} </TableCell>
                                </TableRow>
                            }

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Consumer !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Consumer Name</strong></TableCell>
                                    <TableCell component="th" scope="row" onClick={() => viewConsumer(Consumer)} onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline' }} onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none' }}>{Consumer !== undefined && `${Consumer.firstName} ${Consumer.surName}`}</TableCell>
                                </TableRow>
                            }

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Company !== undefined &&
                                <TableRow>
                                    <TableCell> <strong>Site Name</strong></TableCell>
                                    <TableCell component="th" scope="row">{Site && Site.siteName}</TableCell>
                                </TableRow>
                            }
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
                                                            props.setFieldValue('CurrentSupplier', e.value)
                                                            setCurrentSupplierId(e.id)
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
                                <TableCell> <strong>Top line - MPAN</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="topLine"
                                            value={electric.topLine}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                topLine: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.topLine && props.touched.topLine ? true : false}
                                                        className="profile-pic"
                                                        name="topLine"
                                                        value={props.values.topLine}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.topLine}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.topLine}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Bottom line - MPAN</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="meterNumber"
                                            value={electric.meterNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                meterNumber: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.meterNumber && props.touched.meterNumber ? true : false}
                                                        className="profile-pic"
                                                        name="meterNumber"
                                                        value={props.values.meterNumber}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.meterNumber}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.meterNumber}</TableCell>
                                }
                            </TableRow>


                            <TableRow>
                                <TableCell> <strong>Top line - Second MPAN</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="topLineTwo"
                                            value={electric.topLineTwo}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                topLineTwo: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.topLineTwo && props.touched.topLineTwo ? true : false}
                                                        className="profile-pic"
                                                        name="topLineTwo"
                                                        value={props.values.topLineTwo}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.topLineTwo}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.topLineTwo}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Bottom line - Second MPAN</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="meterNumberTwo"
                                            value={electric.meterNumberTwo}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                meterNumberTwo: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.meterNumberTwo && props.touched.meterNumberTwo ? true : false}
                                                        className="profile-pic"
                                                        name="meterNumberTwo"
                                                        value={props.values.meterNumberTwo}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.meterNumberTwo}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.meterNumberTwo}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Meter Serial Number</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="meterSerialNumber"
                                            value={electric.meterSerialNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                meterSerialNumber: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.meterSerialNumber && props.touched.meterSerialNumber ? true : false}
                                                        className="profile-pic"
                                                        name="meterSerialNumber"
                                                        value={props.values.meterSerialNumber}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.meterSerialNumber}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.meterSerialNumber}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>COT</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="COT"
                                            value={electric.COT}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                COT: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.COT && props.touched.COT ? true : false}
                                                        name="COT"
                                                        value={props.values.COT}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />

                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.COT}</TableCell>
                                }
                            </TableRow>

                            {props.type == 'quote' && <TableRow>
                                <TableCell> <strong>Current Contract Length</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_length"
                                            value={electric.previous_contract_length}
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
                                    </TableCell> : <TableCell component="th" scope="row">{electric.previous_contract_length}</TableCell>
                                }
                            </TableRow>}
                            {props.type == 'quote' && <TableRow>
                                <TableCell><strong>Current Contract End Date</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_start_date"
                                            value={helperMethods.ConvertDate(Number(electric.previous_contract_start_date))}
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
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(electric.previous_contract_start_date))}</TableCell>
                                }
                            </TableRow>}
                            <TableRow>
                                <TableCell> <strong>Contract Length</strong></TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_length"
                                            value={electric.contract_length}
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
                                    </TableCell> : <TableCell component="th" scope="row">{electric.contract_length}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Contract Start Date</strong></TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_start_date"
                                            value={helperMethods.ConvertDate(Number(electric.contract_start_date))}
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
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(electric.contract_start_date))}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Contract End Date</strong></TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_end_date"
                                            value={helperMethods.ConvertDate(Number(electric.contract_end_date))}
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
                                    </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(electric.contract_end_date))}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Standing Charge</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="dailyCharges"
                                            value={electric.dailyCharges}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                dailyCharges: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.dailyCharges && props.touched.dailyCharges ? true : false}
                                                        name="dailyCharges"
                                                        value={props.values.dailyCharges}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.dailyCharges}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Bill Date Type</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="bill_date_type"
                                            value={BillDateTypeArray[electric.bill_date_type]}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                bill_date_type: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <Select
                                                        error={props.errors.bill_date_type && props.touched.bill_date_type ? true : false}
                                                        className="basic-multi-select"
                                                        name="bill_date_type"
                                                        value={{
                                                            label: BillDateTypeArray[props.values.bill_date_type],
                                                            value: BillDateTypeArray[props.values.bill_date_type]
                                                        }}
                                                        options={BillDateTypeOption}
                                                        helperText={!props.errors.bill_date_type}
                                                        onChange={e => {
                                                            handleChangeForBillType(e)
                                                            props.setFieldValue('bill_date_type', e.value)
                                                        }}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{BillDateTypeArray[electric.bill_date_type]}</TableCell>
                                }
                            </TableRow>

                            {(changeBillType === 'Number days' || changeBillType === "2") &&
                                <TableRow>
                                    <TableCell> <strong>Number of Days</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="no_of_days"
                                                value={electric.no_of_days}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    no_of_days: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <TextField
                                                            error={props.errors.no_of_days && props.touched.no_of_days ? true : false}
                                                            name="no_of_days"
                                                            value={props.values.no_of_days}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                            margin="normal"
                                                        />
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{electric.no_of_days}</TableCell>
                                    }
                                </TableRow>
                            }

                            {(changeBillType === 'Date range' || changeBillType === "1") &&
                                <TableRow>
                                    <TableCell> <strong>Bill Start Date</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="bill_start_date"
                                                value={helperMethods.ConvertDate(Number(electric.bill_start_date))}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    bill_start_date: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <Grid container justify="space-around">
                                                                <KeyboardDatePicker
                                                                    error={props.errors.bill_start_date && props.touched.bill_start_date ? true : false}
                                                                    margin="normal"
                                                                    className="profile-pic"
                                                                    name="bill_start_date"
                                                                    format="dd/MM/yyyy"
                                                                    value={props.values.bill_start_date}
                                                                    onChange={e => props.setFieldValue('bill_start_date', Number(new Date(e).getTime()))}
                                                                    KeyboardButtonProps={{
                                                                        'aria-label': 'change date',
                                                                    }}
                                                                    aria-describedby="bill_start_date-number-error"
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(electric.bill_start_date))}</TableCell>
                                    }
                                </TableRow>
                            }
                            {(changeBillType === 'Date range' || changeBillType === "1") &&
                                <TableRow>
                                    <TableCell> <strong>Bill End Date</strong></TableCell>
                                    {AMS.includes(props.slug) ?
                                        <TableCell component="th" scope="row">
                                            <OnTextEditInput
                                                name="bill_end_date"
                                                value={helperMethods.ConvertDate(Number(electric.bill_end_date))}
                                                onSubmit={simpleEdit}
                                                validateIt={Yup.object().shape({
                                                    bill_end_date: Yup.string().required('Required'),
                                                })}
                                            >
                                                {props => {
                                                    return (
                                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                            <Grid container justify="space-around">
                                                                <KeyboardDatePicker
                                                                    error={props.errors.bill_end_date && props.touched.bill_end_date ? true : false}
                                                                    margin="normal"
                                                                    className="profile-pic"
                                                                    name="bill_end_date"
                                                                    format="dd/MM/yyyy"
                                                                    value={props.values.bill_end_date}
                                                                    onChange={e => props.setFieldValue('bill_end_date', Number(new Date(e).getTime()))}
                                                                    KeyboardButtonProps={{
                                                                        'aria-label': 'change date',
                                                                    }}
                                                                    aria-describedby="bill_end_date-number-error"
                                                                />
                                                            </Grid>
                                                        </MuiPickersUtilsProvider>
                                                    );
                                                }}
                                            </OnTextEditInput>
                                        </TableCell> : <TableCell component="th" scope="row">{helperMethods.ConvertDate(Number(electric.bill_end_date))}</TableCell>
                                    }
                                </TableRow>
                            }

                            <TableRow>
                                <TableCell> <strong>Unit Day Rate</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitDayRate"
                                            value={electric.unitDayRate}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitDayRate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitDayRate && props.touched.unitDayRate ? true : false}
                                                        name="unitDayRate"
                                                        value={props.values.unitDayRate}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitDayRate}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Unit Day Usage</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitDaykWh"
                                            value={electric.unitDaykWh}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitDaykWh: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitDaykWh && props.touched.unitDaykWh ? true : false}
                                                        name="unitDaykWh"
                                                        value={props.values.unitDaykWh}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitDaykWh}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Unit Night Rate</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitNightRate"
                                            value={electric.unitNightRate}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitNightRate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitNightRate && props.touched.unitNightRate ? true : false}
                                                        name="unitNightRate"
                                                        value={props.values.unitNightRate}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitNightRate}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Unit Night Usage</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitNightkWH"
                                            value={electric.unitNightkWH}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitNightkWH: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitNightkWH && props.touched.unitNightkWH ? true : false}
                                                        name="unitNightkWH"
                                                        value={props.values.unitNightkWH}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitNightkWH}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Eve/Wkd Rate</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitWkdRate"
                                            value={electric.unitWkdRate}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitWkdRate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitWkdRate && props.touched.unitWkdRate ? true : false}
                                                        name="unitWkdRate"
                                                        value={props.values.unitWkdRate}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitWkdRate}</TableCell>
                                }
                            </TableRow>

                            <TableRow>
                                <TableCell> <strong>Eve/Wkd Usage</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitWkdkWh"
                                            value={electric.unitWkdkWh}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitWkdkWh: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitWkdkWh && props.touched.unitWkdkWh ? true : false}
                                                        name="unitWkdkWh"
                                                        value={props.values.unitWkdkWh}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitWkdkWh}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Winter Rate</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitWinterRate"
                                            value={electric.unitWinterRate}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitWinterRate: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitWinterRate && props.touched.unitWinterRate ? true : false}
                                                        name="unitWinterRate"
                                                        value={props.values.unitWinterRate}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitWinterRate}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Winter Usage</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="unitWinterkWH"
                                            value={electric.unitWinterkWH}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                unitWinterkWH: Yup.string().required('Required'),
                                            })}
                                        >
                                            {props => {
                                                return (
                                                    <TextField
                                                        error={props.errors.unitWinterkWH && props.touched.unitWinterkWH ? true : false}
                                                        name="unitWinterkWH"
                                                        value={props.values.unitWinterkWH}
                                                        onChange={props.handleChange}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell> : <TableCell component="th" scope="row">{electric.unitWinterkWH}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Account Number</strong></TableCell>
                                {AMS.includes(props.slug) ?
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="accountNumber"
                                            value={electric.accountNumber}
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
                                    </TableCell> : <TableCell component="th" scope="row">{electric.accountNumber}</TableCell>
                                }
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Online Account Username</strong></TableCell>
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="onlineAccountUserName"
                                        value={electric.onlineAccountUserName}
                                        onSubmit={simpleEdit}
                                        validateIt={Yup.object().shape({
                                            onlineAccountUserName: Yup.string().required('Required'),
                                        })}
                                    >
                                        {props => {
                                            return (
                                                <TextField
                                                    error={props.errors.onlineAccountUserName && props.touched.onlineAccountUserName ? true : false}
                                                    name="onlineAccountUserName"
                                                    value={props.values.onlineAccountUserName}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                />
                                            );
                                        }}
                                    </OnTextEditInput>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> <strong>Online Account Password</strong></TableCell>
                                <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                        name="onlineAccountPassword"
                                        value={electric.onlineAccountPassword}
                                        onSubmit={simpleEdit}
                                        validateIt={Yup.object().shape({
                                            onlineAccountPassword: Yup.string().required('Required'),
                                        })}
                                    >
                                        {props => {
                                            return (
                                                <TextField
                                                    error={props.errors.onlineAccountPassword && props.touched.onlineAccountPassword ? true : false}
                                                    name="onlineAccountPassword"
                                                    value={props.values.onlineAccountPassword}
                                                    onChange={props.handleChange}
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
            </Grid>
            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
            {isShowConsumer && <ViewSimpleConsumer {...props} consumerData={consumerData} isCloseConsumer={() => { setIsShowConsumer(false) }}> </ViewSimpleConsumer>}
        </Grid >
    );
}
