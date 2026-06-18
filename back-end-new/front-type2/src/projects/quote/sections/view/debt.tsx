import React, { useState, Suspense } from 'react';
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
import { DebtServiceTypes, BillDateTypeOption, AMS, mapOptionsForService } from '../../../../sharedUtils/globalHelper/constantValues'
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
    const { QuoteID, Company, service, Consumer, postcode, Site,
        Supplier, RenewalID, quoteStatus, Status, isActive, isDelete,
        contractLengthDate, isLiveDateProvided, } = props.currentQuote;

    let debt: any = {}
    if (service && service.debt) {
        debt = { ...service.debt }
    }

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const qu = debt;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        if (value.full_name) qu.full_name = value.full_name;
        if (value.dob) qu.dob = value.dob;
        if (value.address) qu.address = value.address;
        if (value.businessName) qu.businessName = value.businessName;
        if (value.businessAddress) qu.businessAddress = value.businessAddress;
        if (value.typeOfDebt) qu.typeOfDebt = value.typeOfDebt
        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'debt',
            service: {
                debt: qu
            }
        }

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
                                <TableCell>
                                    <strong>Full Name</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="full_name"
                                            value={debt.full_name}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                full_name: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.full_name &&
                                                                props.touched.full_name
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        name="full_name"
                                                        value={props.values.full_name}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.full_name}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {debt.full_name}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <strong>DOB</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="dob"
                                            value={helperMethods.ConvertDate(debt.dob)
                                            }
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                dob: Yup.string().required(
                                                    "Required"
                                                ),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={
                                                                    props.errors.dob &&
                                                                        props.touched.dob
                                                                        ? true
                                                                        : false
                                                                }
                                                                margin="normal"
                                                                disableFuture
                                                                className="profile-pic"
                                                                name="dob"
                                                                format="dd/MM/yyyy"
                                                                value={
                                                                    props.values.dob
                                                                }
                                                                onChange={(e) =>
                                                                    props.setFieldValue("dob", new Date(e))
                                                                }
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="dob-number-error"
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
                                            Number(debt.dob)
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <strong>Address</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="address"
                                            value={debt.address}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                address: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.address &&
                                                                props.touched.address
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        name="address"
                                                        value={props.values.address}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.address}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {debt.address}
                                    </TableCell>
                                )}
                            </TableRow>

                            {props.isCreatedFrom === undefined && props.currentQuote && props.currentQuote.Company !== undefined &&
                                <>
                                  
                                    <TableRow>
                                        <TableCell>
                                            <strong>Business Name</strong>
                                        </TableCell>
                                        {AMS.includes(props.slug) ? (
                                            <TableCell component="th" scope="row">
                                                <OnTextEditInput
                                                    name="businessName"
                                                    value={debt.businessName}
                                                    onSubmit={simpleEdit}
                                                    validateIt={Yup.object().shape({
                                                        businessName: Yup.string().required("Required"),
                                                    })}
                                                >
                                                    {(props) => {
                                                        return (
                                                            <TextField
                                                                error={
                                                                    props.errors.businessName &&
                                                                        props.touched.businessName
                                                                        ? true
                                                                        : false
                                                                }
                                                                className="profile-pic"
                                                                name="businessName"
                                                                value={props.values.businessName}
                                                                onChange={props.handleChange}
                                                                helperText={!props.errors.businessName}
                                                                onBlur={props.handleBlur}
                                                                margin="normal"
                                                            />
                                                        );
                                                    }}
                                                </OnTextEditInput>
                                            </TableCell>
                                        ) : (
                                            <TableCell component="th" scope="row">
                                                {debt.businessName}
                                            </TableCell>
                                        )}
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <strong>Business Address</strong>
                                        </TableCell>
                                        {AMS.includes(props.slug) ? (
                                            <TableCell component="th" scope="row">
                                                <OnTextEditInput
                                                    name="businessAddress"
                                                    value={debt.businessAddress}
                                                    onSubmit={simpleEdit}
                                                    validateIt={Yup.object().shape({
                                                        businessAddress: Yup.string().required("Required"),
                                                    })}
                                                >
                                                    {(props) => {
                                                        return (
                                                            <TextField
                                                                error={
                                                                    props.errors.businessAddress &&
                                                                        props.touched.businessAddress
                                                                        ? true
                                                                        : false
                                                                }
                                                                className="profile-pic"
                                                                name="businessAddress"
                                                                value={props.values.businessAddress}
                                                                onChange={props.handleChange}
                                                                helperText={!props.errors.businessAddress}
                                                                onBlur={props.handleBlur}
                                                                margin="normal"
                                                            />
                                                        );
                                                    }}
                                                </OnTextEditInput>
                                            </TableCell>
                                        ) : (
                                            <TableCell component="th" scope="row">
                                                {debt.businessAddress}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </>
                            }
                            <TableRow>
                                <TableCell>
                                    <strong>Type of Debt</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="typeOfDebt"
                                            value={debt.typeOfDebt ? debt.typeOfDebt : "N/A"}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                typeOfDebt: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.typeOfDebt &&
                                                                props.touched.typeOfDebt
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="typeOfDebt"
                                                        value={{
                                                            label: props.values.typeOfDebt,
                                                            value: props.values.typeOfDebt,
                                                        }}
                                                        options={DebtServiceTypes}
                                                        helperText={!props.errors.typeOfDebt}
                                                        onChange={(e) => {
                                                            props.setFieldValue("typeOfDebt", e.value);
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
                                        {debt.typeOfDebt}
                                    </TableCell>
                                )}
                            </TableRow>
                            <Suspense fallback={<></>}><DeleteRequest {...props}></DeleteRequest></Suspense>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
            {isShowConsumer && <ViewSimpleConsumer {...props} consumerData={consumerData} isCloseConsumer={() => { setIsShowConsumer(false) }}> </ViewSimpleConsumer>}
        </Grid >
    );
}

//);
