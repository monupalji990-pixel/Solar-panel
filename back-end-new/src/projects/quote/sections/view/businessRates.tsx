import React, { useState, Suspense } from "react";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import {
    ContractLengthOption,
    typeOfBusinessRatesWorkOptions,
    yesAndNoOptions,
    AMS,
    mapOptionsForService
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
    QuoteStatusNames,
    RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function BusinessRates(
    props
) {
    const [changeBillType, setBillType] = useState("");
    const [changeBillTypeToggle, setBillTypeToggle] = useState(true);
    const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
    const [isDeleteCheck, setIsDelete] = useState(
        props.currentQuote.isDelete === 1
    );
    const [CurrentSupplierId, setCurrentSupplierId] = useState("");
    const [isShowCompany, setIsShowCompany] = React.useState(false);
    const [companyData, setCompanyData] = React.useState({});
    const [isShowConsumer, setIsShowConsumer] = React.useState(false);
    const [consumerData, setConsumerData] = React.useState({});
    const { type } = props;
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

    let businessRates: any = {};

    if (service && service.businessrates) {
        businessRates = { ...service.businessrates };
        const servOptions = mapOptionsForService.BusinessRates;
        const theService = businessRates;
    }

    let supplierList = [];
    if (props.suppliers) {
        supplierList = helperMethods.specificServiceSupplier(
            props.suppliers,
            "BusinessRates",
            "edit"
        );
    }
    const CurrentSupplier =
        Supplier !== undefined && Supplier ? Supplier.supplierName : "";

    const simpleEdit = (value, closeEdit, setSubmitting) => {

        const qu = businessRates;
        if (value.insurance) qu.insurance = value.insurance;
        if (value.passportNumber) qu.passportNumber = value.passportNumber;
        if (value.typeOfBusinessRatesWork && value.typeOfBusinessRatesWork.length > 0) qu.typeOfBusinessRatesWork = value.typeOfBusinessRatesWork.map(product => product.value);
        if (value.localAuthorityRefNumber) qu.localAuthorityRefNumber = value.localAuthorityRefNumber;
        if (value.businessRatesAccountNo) qu.businessRatesAccountNo = value.businessRatesAccountNo;
        if (value.directorDetails) qu.directorDetails = value.directorDetails;
        if (value.currentRateableValue) qu.currentRateableValue = value.currentRateableValue;

        if (value.businessRatesBill) {
            qu.businessRatesBill = value.businessRatesBill;
        }
        if (value.ratesReliefCompletedForm) {
            qu.ratesReliefCompletedForm = value.ratesReliefCompletedForm;
        }
        if (value.britishPassport) {
            qu.britishPassport = value.britishPassport;
        }
        if (value.homeProof) {
            qu.homeProof = value.homeProof;
        }
        if (value.propertyLayoutDiagram) {
            qu.propertyLayoutDiagram = value.propertyLayoutDiagram;
        }
        if (value.sitePhotos) {
            qu.sitePhotos = value.sitePhotos;
        }
        if (value.lease) {
            qu.lease = value.lease;
        }
        if (value.directorStatement) {
            qu.directorStatement = value.directorStatement;
        }
        if (value.contract_start_date)
            qu.contract_start_date = value.contract_start_date;
        if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
        if (value.contract_length) qu.contract_length = value.contract_length;
        if (value.previous_contract_start_date)
            qu.previous_contract_start_date = value.previous_contract_start_date;
        if (value.previous_contract_length)
            qu.previous_contract_length = value.previous_contract_length;

        const quoteUpdate: any = {
            quoteId: props.currentQuote._id,
            serviceTypeName: "BusinessRates",
            service: {
                businessrates: qu,
            },
        };

        if (value.CurrentSupplier && CurrentSupplierId.length > 0)
            quoteUpdate.Supplier = CurrentSupplierId;
        props._isLoadingData(true, props.type);
        props._editQuote(quoteUpdate, props.type);
        if (props.type === "quote") {
            //   props.toast("Quote edited Successfully");
        } else {
            //    props.toast("Renewal edited Successfully");
        }
        closeEdit(null);
        setSubmitting(false);
    };

    const viewCompany = (data) => {
        setIsShowCompany(true);
        setCompanyData(data);
    };

    const viewConsumer = (data) => {
        setIsShowConsumer(true);
        setConsumerData(data);
    };

    return (
        <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>
                                        {props.type === "quote" ? "Quote ID" : "Renewal ID"}
                                    </strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {props.type === "quote" ? QuoteID : RenewalID}
                                </TableCell>
                            </TableRow>
                            {props.isCreatedFrom === undefined &&
                                props.currentQuote &&
                                props.currentQuote.Company !== undefined && (
                                    <TableRow>
                                        <TableCell>
                                            {" "}
                                            <strong>Company Name</strong>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            onClick={() => viewCompany(Company)}
                                            onMouseOver={(e) => {
                                                (e.target as HTMLElement).style.textDecoration =
                                                    "underline";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.target as HTMLElement).style.textDecoration = "none";
                                            }}
                                        >
                                            {Company !== undefined && Company !== undefined && Company
                                                ? Company.businessName
                                                : ""}{" "}
                                        </TableCell>
                                    </TableRow>
                                )}

                            {props.isCreatedFrom === undefined &&
                                props.currentQuote &&
                                props.currentQuote.Consumer !== undefined && (
                                    <TableRow>
                                        <TableCell>
                                            {" "}
                                            <strong>Consumer Name</strong>
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            onClick={() => viewConsumer(Consumer)}
                                            onMouseOver={(e) => {
                                                (e.target as HTMLElement).style.textDecoration =
                                                    "underline";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.target as HTMLElement).style.textDecoration = "none";
                                            }}
                                        >
                                            {Consumer !== undefined &&
                                                `${Consumer.firstName} ${Consumer.surName}`}
                                        </TableCell>
                                    </TableRow>
                                )}

                            {props.isCreatedFrom === undefined &&
                                props.currentQuote &&
                                props.currentQuote.Company !== undefined && (
                                    <TableRow>
                                        <TableCell>
                                            {" "}
                                            <strong>Site Name</strong>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {Site && Site.siteName}
                                        </TableCell>
                                    </TableRow>
                                )}
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Status</strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {props.type === "quote"
                                        ? QuoteStatusNames[quoteStatus]
                                        : RenewalStatusNames[Status]}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Current Supplier</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="CurrentSupplier"
                                            value={CurrentSupplier}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                CurrentSupplier: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.CurrentSupplier &&
                                                                props.touched.CurrentSupplier
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="CurrentSupplier"
                                                        value={{
                                                            label: props.values.CurrentSupplier,
                                                            value: props.values.CurrentSupplier,
                                                        }}
                                                        options={supplierList}
                                                        helperText={!props.errors.CurrentSupplier}
                                                        onChange={(e) => {
                                                            props.setFieldValue("CurrentSupplier", e.value);
                                                            setCurrentSupplierId(e.id);
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
                                        {Supplier && Supplier.supplierName}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Type Of Business Rates Work</strong>
                                </TableCell>
                                {console.log(businessRates.typeOfBusinessRatesWork)}
                                {(AMS.includes(props.slug) && businessRates.typeOfBusinessRatesWork && businessRates.typeOfBusinessRatesWork.length && businessRates.typeOfBusinessRatesWork.length >= 0) ? (

                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="typeOfBusinessRatesWork"
                                            value={businessRates.typeOfBusinessRatesWork.join()}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                typeOfBusinessRatesWork: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.typeOfBusinessRatesWork && props.touched.typeOfBusinessRatesWork
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="typeOfBusinessRatesWork"
                                                        isMulti
                                                        value={
                                                            typeof props.values.typeOfBusinessRatesWork == 'string' ? props.values.typeOfBusinessRatesWork.split(',').map(a => {
                                                                if (a.value)
                                                                    return a
                                                                return { label: a, value: a }
                                                            }) : props.values.typeOfBusinessRatesWork.map(a => {
                                                                if (a.value)
                                                                    return a
                                                                return { label: a, value: a }
                                                            })
                                                        }
                                                        options={typeOfBusinessRatesWorkOptions}
                                                        helperText={!props.errors.typeOfBusinessRatesWork}
                                                        onChange={(e) => {
                                                            // console.log(typeof e, e);
                                                            // e = e.map(a => a.value);
                                                            if (e)
                                                                props.setFieldValue("typeOfBusinessRatesWork", e);
                                                            else
                                                                props.setFieldValue("typeOfBusinessRatesWork", []);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.typeOfBusinessRatesWork}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Local Authority Ref Number</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="localAuthorityRefNumber"
                                            value={businessRates.localAuthorityRefNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                localAuthorityRefNumber: Yup.number()
                                                    .positive("Number of containers must be positive")
                                                    .integer("Number of containers must be integer")
                                                    .required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.localAuthorityRefNumber &&
                                                                props.touched.localAuthorityRefNumber
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="number"
                                                        name="localAuthorityRefNumber"
                                                        value={props.values.localAuthorityRefNumber}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.localAuthorityRefNumber}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.localAuthorityRefNumber}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Business Rates Account No</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="businessRatesAccountNo"
                                            value={businessRates.businessRatesAccountNo}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                businessRatesAccountNo: Yup.number()
                                                    .positive("Number of containers must be positive")
                                                    .integer("Number of containers must be integer")
                                                    .required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.businessRatesAccountNo &&
                                                                props.touched.businessRatesAccountNo
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="number"
                                                        name="businessRatesAccountNo"
                                                        value={props.values.businessRatesAccountNo}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.businessRatesAccountNo}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.businessRatesAccountNo}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Business Rates Bill</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="businessRatesBill"
                                            value={businessRates.businessRatesBill}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                businessRatesBill: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.businessRatesBill &&
                                                                props.touched.businessRatesBill
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="businessRatesBill"
                                                        value={{
                                                            label: props.values.businessRatesBill,
                                                            value: props.values.businessRatesBill,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.businessRatesBill}
                                                        onChange={(e) => {
                                                            console.log(e);

                                                            props.setFieldValue("businessRatesBill", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.businessRatesBill}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Rates Relief Completed Form</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="ratesReliefCompletedForm"
                                            value={businessRates.ratesReliefCompletedForm}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                ratesReliefCompletedForm: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.ratesReliefCompletedForm &&
                                                                props.touched.ratesReliefCompletedForm
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="businessRatesBill"
                                                        value={{
                                                            label: props.values.ratesReliefCompletedForm,
                                                            value: props.values.ratesReliefCompletedForm,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.ratesReliefCompletedForm}
                                                        onChange={(e) => {
                                                            props.setFieldValue("ratesReliefCompletedForm", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.ratesReliefCompletedForm}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>British Passport</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="britishPassport"
                                            value={businessRates.britishPassport}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                britishPassport: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.britishPassport &&
                                                                props.touched.britishPassport
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="britishPassport"
                                                        value={{
                                                            label: props.values.britishPassport,
                                                            value: props.values.britishPassport,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.britishPassport}
                                                        onChange={(e) => {
                                                            props.setFieldValue("britishPassport", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.britishPassport}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Home Proof</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="homeProof"
                                            value={businessRates.homeProof}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                homeProof: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.homeProof &&
                                                                props.touched.homeProof
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="homeProof"
                                                        value={{
                                                            label: props.values.homeProof,
                                                            value: props.values.homeProof,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.homeProof}
                                                        onChange={(e) => {
                                                            props.setFieldValue("homeProof", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.homeProof}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Property Layout Diagram</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="propertyLayoutDiagram"
                                            value={businessRates.propertyLayoutDiagram}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                propertyLayoutDiagram: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.homeProof &&
                                                                props.touched.homeProof
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="propertyLayoutDiagram"
                                                        value={{
                                                            label: props.values.propertyLayoutDiagram,
                                                            value: props.values.propertyLayoutDiagram,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.propertyLayoutDiagram}
                                                        onChange={(e) => {
                                                            props.setFieldValue("propertyLayoutDiagram", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.propertyLayoutDiagram}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Site Photos</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="sitePhotos"
                                            value={businessRates.sitePhotos}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                sitePhotos: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.sitePhotos &&
                                                                props.touched.sitePhotos
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="sitePhotos"
                                                        value={{
                                                            label: props.values.sitePhotos,
                                                            value: props.values.sitePhotos,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.sitePhotos}
                                                        onChange={(e) => {
                                                            props.setFieldValue("sitePhotos", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.sitePhotos}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Lease</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="lease"
                                            value={businessRates.lease}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                lease: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.lease &&
                                                                props.touched.lease
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="lease"
                                                        value={{
                                                            label: props.values.lease,
                                                            value: props.values.lease,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.lease}
                                                        onChange={(e) => {
                                                            props.setFieldValue("lease", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.lease}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Director Statement</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="directorStatement"
                                            value={businessRates.directorStatement}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                directorStatement: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.directorStatement &&
                                                                props.touched.directorStatement
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select WidhtFull100"
                                                        name="directorStatement"
                                                        value={{
                                                            label: props.values.directorStatement,
                                                            value: props.values.directorStatement,
                                                        }}
                                                        options={yesAndNoOptions}
                                                        helperText={!props.errors.directorStatement}
                                                        onChange={(e) => {
                                                            props.setFieldValue("directorStatement", e.value);
                                                            //   setCurrentSupplierId(e.id)
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
                                        {businessRates.directorStatement}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Director Details</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="directorDetails"
                                            value={businessRates.directorDetails}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                directorDetails: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.directorDetails &&
                                                                props.touched.directorDetails
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="text"
                                                        name="directorDetails"
                                                        value={props.values.directorDetails}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.directorDetails}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.directorDetails}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Current Rateable value (GDP Pound)</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="currentRateableValue"
                                            value={businessRates.currentRateableValue}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                currentRateableValue: Yup.number()
                                                    .positive("Number of containers must be positive")
                                                    .integer("Number of containers must be integer")
                                                    .required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.currentRateableValue &&
                                                                props.touched.currentRateableValue
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="number"
                                                        name="currentRateableValue"
                                                        value={props.values.currentRateableValue}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.currentRateableValue}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.currentRateableValue}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    <strong>Ni Insurance</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="insurance"
                                            value={businessRates.insurance}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                insurance: Yup.string()
                                                    .required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.insurance &&
                                                                props.touched.insurance
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="text"
                                                        name="insurance"
                                                        value={props.values.insurance}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.insurance}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.insurance}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Passport Number</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="passportNumber"
                                            value={businessRates.passportNumber}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                passportNumber: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <TextField
                                                        error={
                                                            props.errors.passportNumber &&
                                                                props.touched.passportNumber
                                                                ? true
                                                                : false
                                                        }
                                                        className="profile-pic"
                                                        type="text"
                                                        name="passportNumber"
                                                        value={props.values.passportNumber}
                                                        onChange={props.handleChange}
                                                        helperText={!props.errors.passportNumber}
                                                        onBlur={props.handleBlur}
                                                        margin="normal"
                                                    />
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {businessRates.passportNumber}
                                    </TableCell>
                                )}
                            </TableRow>
                            {props.type == 'quote' && <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Current Contract Length</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_length"
                                            value={businessRates.previous_contract_length}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                previous_contract_length: Yup.string().required(
                                                    "Required"
                                                ),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.previous_contract_length &&
                                                                props.touched.previous_contract_length
                                                                ? true
                                                                : false
                                                        }
                                                        className="basic-multi-select"
                                                        name="previous_contract_length"
                                                        value={{
                                                            label: props.values.previous_contract_length,
                                                            value: props.values.previous_contract_length,
                                                        }}
                                                        options={ContractLengthOption}
                                                        helperText={!props.errors.previous_contract_length}
                                                        onChange={(e) =>
                                                            props.setFieldValue(
                                                                "previous_contract_length",
                                                                e.value
                                                            )
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
                                        {businessRates.previous_contract_length}
                                    </TableCell>
                                )}
                            </TableRow>}
                            {props.type == 'quote' && <TableRow>
                                <TableCell>
                                    <strong>Current Contract End Date</strong>
                                </TableCell>
                                {AMS.includes(props.slug) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="previous_contract_start_date"
                                            value={helperMethods.ConvertDate(
                                                Number(businessRates.previous_contract_start_date)
                                            )}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                previous_contract_start_date: Yup.string().required(
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
                                                                    props.errors.previous_contract_start_date &&
                                                                        props.touched.previous_contract_start_date
                                                                        ? true
                                                                        : false
                                                                }
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="previous_contract_start_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(
                                                                    businessRates.previous_contract_start_date
                                                                )}
                                                                onChange={(e) =>
                                                                    props.setFieldValue(
                                                                        "previous_contract_start_date",
                                                                        Number(new Date(e).getTime())
                                                                    )
                                                                }
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="previous_contract_start_date-number-error"
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
                                            Number(businessRates.previous_contract_start_date)
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>}
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Contract Length</strong>
                                </TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_length"
                                            value={businessRates.contract_length}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_length: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <Select
                                                        error={
                                                            props.errors.contract_length &&
                                                                props.touched.contract_length
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
                                        {businessRates.contract_length}
                                    </TableCell>
                                )}
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Contract Start Date</strong>
                                </TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_start_date"
                                            value={helperMethods.ConvertDate(
                                                Number(businessRates.contract_start_date)
                                            )}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_start_date: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={
                                                                    props.errors.contract_start_date &&
                                                                        props.touched.contract_start_date
                                                                        ? true
                                                                        : false
                                                                }
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="contract_start_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(
                                                                    props.values.contract_start_date
                                                                )}
                                                                onChange={(e) =>
                                                                    props.setFieldValue(
                                                                        "contract_start_date",
                                                                        Number(new Date(e).getTime())
                                                                    )
                                                                }
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="contract_start_date-number-error"
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
                                            Number(businessRates.contract_start_date)
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    {" "}
                                    <strong>Contract End Date</strong>
                                </TableCell>
                                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                                    <TableCell component="th" scope="row">
                                        <OnTextEditInput
                                            name="contract_end_date"
                                            value={helperMethods.ConvertDate(
                                                Number(businessRates.contract_end_date)
                                            )}
                                            onSubmit={simpleEdit}
                                            validateIt={Yup.object().shape({
                                                contract_end_date: Yup.string().required("Required"),
                                            })}
                                        >
                                            {(props) => {
                                                return (
                                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                        <Grid container justify="space-around">
                                                            <KeyboardDatePicker
                                                                error={
                                                                    props.errors.contract_end_date &&
                                                                        props.touched.contract_end_date
                                                                        ? true
                                                                        : false
                                                                }
                                                                margin="normal"
                                                                className="profile-pic"
                                                                name="contract_end_date"
                                                                format="dd/MM/yyyy"
                                                                value={helperMethods.SwapDtoM(
                                                                    props.values.contract_end_date
                                                                )}
                                                                onChange={(e) =>
                                                                    props.setFieldValue(
                                                                        "contract_end_date",
                                                                        Number(new Date(e).getTime())
                                                                    )
                                                                }
                                                                KeyboardButtonProps={{
                                                                    "aria-label": "change date",
                                                                }}
                                                                aria-describedby="contract_end_date-number-error"
                                                            />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                );
                                            }}
                                        </OnTextEditInput>
                                    </TableCell>
                                ) : (
                                    <TableCell component="th" scope="row">
                                        {helperMethods.ConvertDate(Number(businessRates.contract_end_date))}
                                    </TableCell>
                                )}
                            </TableRow>
                            {(props.type === "quote" || props.type === "renewal") &&
                                <Suspense fallback={<></>}>
                                    <DeleteRequest {...props}></DeleteRequest>
                                </Suspense>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            {isShowCompany && (
                <ViewSimpleCompany
                    {...props}
                    companyData={companyData}
                    isCloseCompany={() => {
                        setIsShowCompany(false);
                    }}
                >
                    {" "}
                </ViewSimpleCompany>
            )}
            {isShowConsumer && (
                <ViewSimpleConsumer
                    {...props}
                    consumerData={consumerData}
                    isCloseConsumer={() => {
                        setIsShowConsumer(false);
                    }}
                >
                    {" "}
                </ViewSimpleConsumer>
            )}
        </Grid>
    );
}
