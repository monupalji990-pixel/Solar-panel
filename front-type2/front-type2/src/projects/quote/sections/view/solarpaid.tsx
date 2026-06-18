import React, { useState, useEffect, Suspense } from 'react';
import * as Yup from 'yup';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { EconomyOptions, AMS } from '../../../../sharedUtils/globalHelper/constantValues'
import Grid from '@material-ui/core/Grid';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { Formik, Form, FieldArray } from 'formik';
import Input from '@material-ui/core/Input';
import Button from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { QuoteStatusNames, RenewalStatusNames } from 'sharedUtils/globalHelper/status';
import DeleteRequest from '../smallModel/deleteRequest';
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from '../../../consumer/loadable/CommonSimple';

export default function SolarPaidView(props) {

    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(props.currentQuote.isDelete === 1);
    const [isInverters, setIsInverters] = useState([]);
    const [isRoofsInstalled, setIsRoofsInstalled] = useState([]);
    const [isBatteries, setIsBatteries] = useState([]);
    const {
        QuoteID,
        Company,
        Consumer,
        service,
        Site,
        Supplier,
        quoteStatus,
        RenewalID,
        Status,
    } = props.currentQuote;
    const [isShowCompany, setIsShowCompany] = React.useState(false);
    const [companyData, setCompanyData] = React.useState({});
    const [isShowConsumer, setIsShowConsumer] = React.useState(false);
    const [consumerData, setConsumerData] = React.useState({});

    let SolarPaid: any = {}
    if (service && service.paidsolar) {
        SolarPaid = { ...service.paidsolar }
    }

    useEffect(() => {
        let number = []
        SolarPaid?.numberOfRoofs?.forEach((x, index) => {
            let arr1 = []
            for (let i = 0; i < x?.numberOfPanels; i++) {
                arr1.push({});
            }
            number[index] = arr1;
        })

        setIsRoofsInstalled(number);
        let arr2 = []
        for (let i = 0; i < SolarPaid?.noOfInverters; i++) {
            arr2.push({});
        }
        setIsInverters(arr2);
        let arr3 = []
        for (let i = 0; i < SolarPaid?.noOfBatteries; i++) {
            arr3.push({});
        }
        setIsBatteries(arr3);
    }, [])

    const simpleEdit = (value, closeEdit, setSubmitting) => {

        const qu = SolarPaid;
        if (value.isActive) qu.isActive = isChecked ? 1 : 2;
        if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

        if (value.netCost) qu.netCost = value.netCost
        if (value.vat) qu.vat = value.vat
        if (value.noOfInverters) qu.noOfInverters = value.noOfInverters
        if (value.noOfBatteries) qu.noOfBatteries = value.noOfBatteries
        if (value.depositAmount) qu.depositAmount = value.depositAmount
        if (value.depositDate) qu.depositDate = value.depositDate
        if (value.noOfPanels) qu.noOfPanels = value.noOfPanels
        if (value.peakSystemOutput) qu.peakSystemOutput = value.peakSystemOutput
        if (value.systemSize) qu.systemSize = value.systemSize
        if (value.discount) qu.discount = value.discount
        if (value.roofsPanelsInstalled) qu.roofsPanelsInstalled = value.roofsPanelsInstalled;
        if (value.offeredQuotation) qu.offeredQuotation = value.offeredQuotation;
        if (value.agreedAmount) qu.agreedAmount = value.agreedAmount;
        if (value.installmentAmount) qu.installmentAmount = value.installmentAmount;
        if (value.dataOfInstallment) qu.dataOfInstallment = value.dataOfInstallment;
        if (value.finalPayment) qu.finalPayment = value.finalPayment;
        if (value.finalPaymentDate) qu.finalPaymentDate = value.finalPaymentDate;
        if (value.installationDate) qu.installationDate = value.installationDate;
        if (value.jobCompletionDate) qu.jobCompletionDate = value.jobCompletionDate;
        if (value.dnoApproval) qu.dnoApproval = value.dnoApproval;
        if (value.dnoApproved) qu.dnoApproved = value.dnoApproved;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: 'PaidSolar',
            service: {
                paidsolar: qu
            }
        }

        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type)

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
        <Grid container spacing={3} className="eco_service_table">
            <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>
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

                            <Suspense fallback={<></>}><DeleteRequest {...props}></DeleteRequest></Suspense>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>

                <TableRow>
                    <TableCell>
                        <strong>No. of Roofs</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roofsPanelsInstalled"
                                value={SolarPaid.roofsPanelsInstalled}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roofsPanelsInstalled: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.roofsPanelsInstalled &&
                                                    props.touched.roofsPanelsInstalled
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="roofsPanelsInstalled"
                                            value={props.values.roofsPanelsInstalled}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.roofsPanelsInstalled}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.roofsPanelsInstalled}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>No. of Inverters</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="noOfInverters"
                                value={SolarPaid.noOfInverters}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    noOfInverters: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.noOfInverters &&
                                                    props.touched.noOfInverters
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="noOfInverters"
                                            value={props.values.noOfInverters}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.noOfInverters}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.noOfInverters}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>No. of Batteries</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="noOfBatteries"
                                value={SolarPaid.noOfBatteries}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    noOfBatteries: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.noOfBatteries &&
                                                    props.touched.noOfBatteries
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="noOfBatteries"
                                            value={props.values.noOfBatteries}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.noOfBatteries}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.noOfBatteries}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Total No. of Panels</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="noOfPanels"
                                value={SolarPaid.noOfPanels}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    noOfPanels: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.noOfPanels &&
                                                    props.touched.noOfPanels
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="noOfPanels"
                                            value={props.values.noOfPanels}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.noOfPanels}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.noOfPanels}
                        </TableCell>
                    )}
                </TableRow>

                <Formik
                    initialValues={{ numberOfRoofs: SolarPaid.numberOfRoofs }}
                    onSubmit={(value) => {
                        const qu = SolarPaid;
                        if (value.numberOfRoofs) qu.numberOfRoofs = value.numberOfRoofs

                        const quoteUpdate: any = {
                            quoteId: props.currentQuote._id,
                            serviceTypeName: 'eco',
                            service: {
                                eco: {
                                    subservice: {
                                        ...service?.eco?.subservice,
                                        solar: qu
                                    }
                                }
                            }
                        }
                        props._isLoadingData(true, props.type);
                        props._editQuote(quoteUpdate, props.type)
                    }}
                    render={({ values, handleChange }) => (
                        <Form>
                            <FieldArray
                                name="numberOfRoofs"
                                render={arrayHelpers => (
                                    <div>
                                        {values.numberOfRoofs && (
                                            values.numberOfRoofs.map((ele, index) => (
                                                <div key={index}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong style={{ color: '#2a00b8' }}>Roofs {index + 1}</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Roof Pitch</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfRoofs.${index}.roofPitch`}
                                                                id={`numberOfRoofs.${index}.roofPitch`}
                                                                defaultValue={ele.roofPitch}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Roof Orientation</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfRoofs.${index}.roofOrientation`}
                                                                id={`numberOfRoofs.${index}.roofOrientation`}
                                                                defaultValue={ele.roofOrientation}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Number of Panels</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfRoofs.${index}.numberOfPanels`}
                                                                id={`numberOfRoofs.${index}.numberOfPanels`}
                                                                defaultValue={ele.numberOfPanels}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Manufacturer</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfRoofs.${index}.manufacturer`}
                                                                id={`numberOfRoofs.${index}.manufacturer`}
                                                                defaultValue={ele.manufacturer}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Model</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfRoofs.${index}.model`}
                                                                id={`numberOfRoofs.${index}.model`}
                                                                defaultValue={ele.model}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    {isRoofsInstalled[index] && isRoofsInstalled[index].map((x, ind) => (
                                                        <TableRow>
                                                            <TableCell>
                                                                <strong>Serial Number {ind + 1}</strong>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name={`numberOfRoofs.${index}.serialNumber${ind}`}
                                                                    id={`numberOfRoofs.${index}.serialNumber${ind}`}
                                                                    // defaultValue={ele.serialNumber}
                                                                    defaultValue={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                                                    inputProps={{ 'aria-label': 'description' }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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

                <Formik
                    initialValues={{ numberOfInverters: SolarPaid.numberOfInverters }}
                    onSubmit={(value) => {
                        const qu = SolarPaid;
                        if (value.numberOfInverters) qu.numberOfInverters = value.numberOfInverters;
                        const quoteUpdate: any = {
                            quoteId: props.currentQuote._id,
                            serviceTypeName: 'eco',
                            service: {
                                eco: {
                                    subservice: {
                                        ...service?.eco?.subservice,
                                        solar: qu
                                    }
                                }
                            }
                        }
                        props._isLoadingData(true, props.type);
                        props._editQuote(quoteUpdate, props.type)
                    }}
                    render={({ values, handleChange }) => (
                        <Form>
                            <FieldArray
                                name="numberOfInverters"
                                render={arrayHelpers => (
                                    <div>
                                        {values.numberOfInverters && (
                                            values.numberOfInverters.map((ele, index) => (
                                                <div key={index}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong style={{ color: '#2a00b8' }}>Inverters {index + 1}</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Manufacturer</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfInverters.${index}.manufacturer`}
                                                                id={`numberOfInverters.${index}.manufacturer`}
                                                                defaultValue={ele.manufacturer}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Model</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfInverters.${index}.model`}
                                                                id={`numberOfInverters.${index}.model`}
                                                                defaultValue={ele.model}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    {isInverters && isInverters.map((x, ind) => (
                                                        <TableRow>
                                                            <TableCell>
                                                                <strong>Serial Number {ind + 1}</strong>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name={`numberOfInverters.${index}.serialNumber${ind}`}
                                                                    id={`numberOfInverters.${index}.serialNumber${ind}`}
                                                                    // defaultValue={ele.serialNumber}
                                                                    defaultValue={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                                                    inputProps={{ 'aria-label': 'description' }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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

                <Formik
                    initialValues={{ numberOfBatteries: SolarPaid.numberOfBatteries }}
                    onSubmit={(value) => {
                        const qu = SolarPaid;
                        if (value.numberOfBatteries) qu.numberOfBatteries = value.numberOfBatteries;
                        const quoteUpdate: any = {
                            quoteId: props.currentQuote._id,
                            serviceTypeName: 'eco',
                            service: {
                                eco: {
                                    subservice: {
                                        ...service?.eco?.subservice,
                                        solar: qu
                                    }
                                }
                            }
                        }
                        props._isLoadingData(true, props.type);
                        props._editQuote(quoteUpdate, props.type)
                    }}
                    render={({ values, handleChange }) => (
                        <Form>
                            <FieldArray
                                name="numberOfBatteries"
                                render={arrayHelpers => (
                                    <div>
                                        {values.numberOfBatteries && (
                                            values.numberOfBatteries.map((ele, index) => (
                                                <div key={index}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong style={{ color: '#2a00b8' }}>Batteries {index + 1}</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Manufacturer</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfBatteries.${index}.manufacturer`}
                                                                id={`numberOfBatteries.${index}.manufacturer`}
                                                                defaultValue={ele.manufacturer}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell>
                                                            <strong>Model</strong>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                onChange={handleChange}
                                                                name={`numberOfBatteries.${index}.model`}
                                                                id={`numberOfBatteries.${index}.model`}
                                                                defaultValue={ele.model}
                                                                inputProps={{ 'aria-label': 'description' }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                    {isBatteries && isBatteries.map((x, ind) => (
                                                        <TableRow>
                                                            <TableCell>
                                                                <strong>Serial Number {ind + 1}</strong>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name={`numberOfBatteries.${index}.serialNumber${ind}`}
                                                                    id={`numberOfBatteries.${index}.serialNumber${ind}`}
                                                                    // defaultValue={ele.serialNumber}
                                                                    defaultValue={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                                                    inputProps={{ 'aria-label': 'description' }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
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

                <TableRow>
                    <TableCell>
                        <strong>Peak System Output</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="peakSystemOutput"
                                value={SolarPaid.peakSystemOutput}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    peakSystemOutput: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.peakSystemOutput &&
                                                    props.touched.peakSystemOutput
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="peakSystemOutput"
                                            value={props.values.peakSystemOutput}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.peakSystemOutput}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {(SolarPaid.peakSystemOutput)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>System Size</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="systemSize"
                                value={(SolarPaid.systemSize)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    systemSize: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.systemSize &&
                                                    props.touched.systemSize
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="systemSize"
                                            value={props.values.systemSize}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.systemSize}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {(SolarPaid.systemSize)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Offered Quotation</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="offeredQuotation"
                                value={Number(SolarPaid.offeredQuotation)?.toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    offeredQuotation: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.offeredQuotation &&
                                                    props.touched.offeredQuotation
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="offeredQuotation"
                                            value={props.values.offeredQuotation}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.offeredQuotation}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             £
                                        //         </InputAdornment>
                                        //     ),
                                        //     endAdornment: (
                                        //         <InputAdornment position="end">
                                        //             .00
                                        //         </InputAdornment>
                                        //     )
                                        // }}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.offeredQuotation)?.toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Agreed Amount</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="agreedAmount"
                                value={Number(SolarPaid.agreedAmount)?.toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    agreedAmount: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.agreedAmount &&
                                                    props.touched.agreedAmount
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="agreedAmount"
                                            value={props.values.agreedAmount}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.agreedAmount}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.agreedAmount)?.toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Net Cost</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="netCost"
                                value={Number(SolarPaid.netCost)?.toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    netCost: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.netCost &&
                                                    props.touched.netCost
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="netCost"
                                            value={props.values.netCost}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.netCost}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.netCost)?.toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>VAT</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="vat"
                                value={Number(SolarPaid.vat)?.toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    vat: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.vat &&
                                                    props.touched.vat
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="vat"
                                            value={props.values.vat}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.vat}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.vat)?.toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Discount</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="discount"
                                value={Number(SolarPaid.offeredQuotation - SolarPaid.agreedAmount)?.toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    discount: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.discount &&
                                                    props.touched.discount
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="discount"
                                            value={props.values.discount}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.discount}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             £
                                        //         </InputAdornment>
                                        //     ),
                                        //     endAdornment: (
                                        //         <InputAdornment position="end">
                                        //             .00
                                        //         </InputAdornment>
                                        //     )
                                        // }}
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.discount)?.toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Deposit Amount</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="depositAmount"
                                value={Number(SolarPaid.depositAmount).toFixed(2)}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    depositAmount: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.depositAmount &&
                                                    props.touched.depositAmount
                                                    ? true
                                                    : false
                                            }
                                            type="number"
                                            className="profile-pic"
                                            name="depositAmount"
                                            value={props.values.depositAmount}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.depositAmount}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {'£ ' + Number(SolarPaid.depositAmount).toFixed(2)}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Deposit Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="depositDate"
                                value={SolarPaid.depositDate ? new Date(SolarPaid.depositDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    depositDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.depositDate &&
                                                            props.touched.depositDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="depositDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.depositDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "depositDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="depositDate-number-error"
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
                                Number(SolarPaid.depositDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Final Payment</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="finalPayment"
                                value={SolarPaid.finalPayment}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    finalPayment: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.finalPayment &&
                                                    props.touched.finalPayment
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="finalPayment"
                                            value={props.values.finalPayment}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.finalPayment}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.finalPayment}
                        </TableCell>
                    )}
                </TableRow>


                <TableRow>
                    <TableCell>
                        <strong>Final Payment Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="finalPaymentDate"
                                value={SolarPaid.finalPaymentDate ? new Date(SolarPaid.finalPaymentDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    finalPaymentDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.finalPaymentDate &&
                                                            props.touched.finalPaymentDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="finalPaymentDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.finalPaymentDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "finalPaymentDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="finalPaymentDate-number-error"
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
                                Number(SolarPaid.finalPaymentDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Installation Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="installationDate"
                                value={SolarPaid.installationDate ? new Date(SolarPaid.installationDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    installationDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.installationDate &&
                                                            props.touched.installationDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="installationDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.installationDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "installationDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="installationDate-number-error"
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
                                Number(SolarPaid.installationDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Property Type</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="propertyType"
                                value={SolarPaid.propertyType}
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
                            {SolarPaid.propertyType}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Roof Style</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roofStyle"
                                value={SolarPaid.roofStyle}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roofStyle: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.roofStyle &&
                                                    props.touched.roofStyle
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="roofStyle"
                                            value={props.values.roofStyle}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.roofStyle}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.roofStyle}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Roof Material</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="roofMaterial"
                                value={SolarPaid.roofMaterial}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    roofMaterial: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.roofMaterial &&
                                                    props.touched.roofMaterial
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="roofMaterial"
                                            value={props.values.roofMaterial}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.roofMaterial}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.roofMaterial}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Shading</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="shading"
                                value={SolarPaid.shading}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    shading: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.shading &&
                                                    props.touched.shading
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="shading"
                                            value={props.values.shading}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.shading}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.shading}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Ownership</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="ownership"
                                value={SolarPaid.ownership}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    ownership: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <TextField
                                            error={
                                                props.errors.ownership &&
                                                    props.touched.ownership
                                                    ? true
                                                    : false
                                            }
                                            className="profile-pic"
                                            name="ownership"
                                            value={props.values.ownership}
                                            onChange={props.handleChange}
                                            helperText={!props.errors.ownership}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                        />
                                    );
                                }}
                            </OnTextEditInput>
                        </TableCell>
                    ) : (
                        <TableCell component="th" scope="row">
                            {SolarPaid.ownership}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>Job Completion Date</strong>
                    </TableCell>
                    {(AMS.includes(props.slug)) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="jobCompletionDate"
                                value={SolarPaid.jobCompletionDate ? new Date(SolarPaid.jobCompletionDate).toLocaleDateString("en-GB") : "N/A"}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    jobCompletionDate: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <Grid container justify="space-around">
                                                <KeyboardDatePicker
                                                    error={
                                                        props.errors.jobCompletionDate &&
                                                            props.touched.jobCompletionDate
                                                            ? true
                                                            : false
                                                    }
                                                    margin="normal"
                                                    name="jobCompletionDate"
                                                    format="dd/MM/yyyy"
                                                    value={helperMethods.SwapDtoM(
                                                        props.values.jobCompletionDate
                                                    )}
                                                    onChange={(e) =>
                                                        props.setFieldValue(
                                                            "jobCompletionDate",
                                                            Number(new Date(e).getTime())
                                                        )
                                                    }
                                                    KeyboardButtonProps={{
                                                        "aria-label": "change date",
                                                    }}
                                                    aria-describedby="jobCompletionDate-number-error"
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
                                Number(SolarPaid.jobCompletionDate)
                            )}
                        </TableCell>
                    )}
                </TableRow>

                <TableRow>
                    <TableCell>
                        <strong>DNO Approval Required?</strong>
                    </TableCell>
                    {AMS.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                            <OnTextEditInput
                                name="dnoApproval"
                                value={SolarPaid.dnoApproval}
                                onSubmit={simpleEdit}
                                validateIt={Yup.object().shape({
                                    dnoApproval: Yup.string().required("Required"),
                                })}
                            >
                                {(props) => {
                                    return (
                                        <Select
                                            error={
                                                props.errors.dnoApproval && props.touched.dnoApproval
                                                    ? true
                                                    : false
                                            }
                                            className="basic-multi-select WidhtFull100"
                                            name="dnoApproval"
                                            value={{
                                                label: props.values.dnoApproval,
                                                value: props.values.dnoApproval,
                                            }}
                                            options={EconomyOptions}
                                            helperText={!props.errors.dnoApproval}
                                            onChange={(e) => {
                                                props.setFieldValue("dnoApproval", e.value);
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
                            {SolarPaid.dnoApproval}
                        </TableCell>
                    )}
                </TableRow>

                {SolarPaid.dnoApproval == "Yes" &&
                    <TableRow>
                        <TableCell>
                            <strong>DNO Approved?</strong>
                        </TableCell>
                        {AMS.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                                <OnTextEditInput
                                    name="dnoApproved"
                                    value={SolarPaid.dnoApproved}
                                    onSubmit={simpleEdit}
                                    validateIt={Yup.object().shape({
                                        dnoApproved: Yup.string().required("Required"),
                                    })}
                                >
                                    {(props) => {
                                        return (
                                            <Select
                                                error={
                                                    props.errors.dnoApproved && props.touched.dnoApproved
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select WidhtFull100"
                                                name="dnoApproved"
                                                value={{
                                                    label: props.values.dnoApproved,
                                                    value: props.values.dnoApproved,
                                                }}
                                                options={EconomyOptions}
                                                helperText={!props.errors.dnoApproved}
                                                onChange={(e) => {
                                                    props.setFieldValue("dnoApproved", e.value);
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
                                {SolarPaid.dnoApproved}
                            </TableCell>
                        )}
                    </TableRow>
                }
            </Grid>

            {isShowCompany && <ViewSimpleCompany {...props} companyData={companyData} isCloseCompany={() => { setIsShowCompany(false) }}> </ViewSimpleCompany>}
            {isShowConsumer && <ViewSimpleConsumer {...props} consumerData={consumerData} isCloseConsumer={() => { setIsShowConsumer(false) }}> </ViewSimpleConsumer>}
        </Grid >
    );
}
