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
  wasteTypeOptions,
  wasteContainerTypeOptions,
  wasteMonthlyDDOptions,
  wasteServiceFrequency,
  ContractLengthOption,
  AMS
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function Waste(
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

  let waste: any = {};
  if (service && service.waste) {
    waste = { ...service.waste };
  }

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Waste",
      "edit"
    );
  }

  const CurrentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = waste;
    // if (value.current_supplier) SupplerID = value.current_supplier.value
    if (value.wasteType) qu.wasteType = value.wasteType;
    if (value.EwcCode) qu.EwcCode = value.EwcCode;
    if (value.containerType) qu.containerType = value.containerType;
    if (value.monthlyDD) qu.monthlyDD = value.monthlyDD;
    if (value.numberOfContainers)
      qu.numberOfContainers = value.numberOfContainers;
    if (value.chargePerLift) qu.chargePerLift = value.chargePerLift;
    if (value.dailyRental) qu.dailyRental = value.dailyRental;
    if (value.serviceFrequency) qu.serviceFrequency = value.serviceFrequency;
    if (value.deliveryCharge) qu.deliveryCharge = value.deliveryCharge;
    if (value.WasteTransferNoteComplainceCharge)
      qu.WasteTransferNoteComplainceCharge =
        value.WasteTransferNoteComplainceCharge;
    if (value.assumedWeight) qu.assumedWeight = value.assumedWeight;
    if (value.totalMonthlyCost) qu.totalMonthlyCost = value.totalMonthlyCost;
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
      serviceTypeName: "waste",
      service: {
        waste: qu,
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
                  <strong>EWC code</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  {waste.EwcCode}
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
                  <strong>Waste Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="wasteType"
                      value={waste.wasteType}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        wasteType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.wasteType && props.touched.wasteType
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="wasteType"
                            value={{
                              label: props.values.wasteType,
                              value: props.values.wasteType,
                            }}
                            options={wasteTypeOptions}
                            helperText={!props.errors.wasteType}
                            onChange={(e) => {
                              props.setFieldValue("wasteType", e.value);
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
                    {waste.wasteType}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Container Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="containerType"
                      value={waste.containerType}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        containerType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.containerType &&
                                props.touched.containerType
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="containerType"
                            value={{
                              label: props.values.containerType,
                              value: props.values.containerType,
                            }}
                            options={wasteContainerTypeOptions}
                            helperText={!props.errors.containerType}
                            onChange={(e) => {
                              props.setFieldValue("containerType", e.value);
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
                    {waste.containerType}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Monthly DD</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="monthlyDD"
                      value={waste.monthlyDD}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        monthlyDD: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.monthlyDD && props.touched.monthlyDD
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="monthlyDD"
                            value={{
                              label: props.values.monthlyDD,
                              value: props.values.monthlyDD,
                            }}
                            options={wasteMonthlyDDOptions}
                            helperText={!props.errors.monthlyDD}
                            onChange={(e) => {
                              props.setFieldValue("monthlyDD", e.value);
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
                    {waste.monthlyDD}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Number of containers</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="numberOfContainers"
                      value={waste.numberOfContainers}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        numberOfContainers: Yup.number()
                          .positive("Number of containers must be positive")
                          .integer("Number of containers must be integer")
                          .required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.numberOfContainers &&
                                props.touched.numberOfContainers
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="numberOfContainers"
                            value={props.values.numberOfContainers}
                            onChange={props.handleChange}
                            helperText={!props.errors.numberOfContainers}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.numberOfContainers}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Charge per lift</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="chargePerLift"
                      value={waste.chargePerLift}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        chargePerLift: Yup.number().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.numberOfContainers &&
                                props.touched.numberOfContainers
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="chargePerLift"
                            value={props.values.chargePerLift}
                            onChange={props.handleChange}
                            helperText={!props.errors.chargePerLift}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.chargePerLift}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Daily rental</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="dailyRental"
                      value={waste.dailyRental}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        dailyRental: Yup.number().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.dailyRental &&
                                props.touched.dailyRental
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="dailyRental"
                            value={props.values.dailyRental}
                            onChange={props.handleChange}
                            helperText={!props.errors.dailyRental}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.dailyRental}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Service frequency</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="serviceFrequency"
                      value={waste.serviceFrequency}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        serviceFrequency: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.serviceFrequency &&
                                props.touched.serviceFrequency
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="serviceFrequency"
                            value={{
                              label: props.values.serviceFrequency,
                              value: props.values.serviceFrequency,
                            }}
                            options={wasteServiceFrequency}
                            helperText={!props.errors.serviceFrequency}
                            onChange={(e) => {
                              props.setFieldValue("serviceFrequency", e.value);
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
                    {waste.serviceFrequency}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Delivery Charge</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="deliveryCharge"
                      value={waste.deliveryCharge}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        deliveryCharge: Yup.number().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.deliveryCharge &&
                                props.touched.deliveryCharge
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="deliveryCharge"
                            value={props.values.deliveryCharge}
                            onChange={props.handleChange}
                            helperText={!props.errors.deliveryCharge}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.deliveryCharge}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>WTN Complaince Charge</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WasteTransferNoteComplainceCharge"
                      value={waste.WasteTransferNoteComplainceCharge}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WasteTransferNoteComplainceCharge: Yup.number().required(
                          "Required"
                        ),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.WasteTransferNoteComplainceCharge &&
                                props.touched.WasteTransferNoteComplainceCharge
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="WasteTransferNoteComplainceCharge"
                            value={
                              props.values.WasteTransferNoteComplainceCharge
                            }
                            onChange={props.handleChange}
                            helperText={
                              !props.errors.WasteTransferNoteComplainceCharge
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
                    {waste.WasteTransferNoteComplainceCharge}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Assumed weight</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="assumedWeight"
                      value={waste.assumedWeight}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        assumedWeight: Yup.number().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.assumedWeight &&
                                props.touched.assumedWeight
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="assumedWeight"
                            value={props.values.assumedWeight}
                            onChange={props.handleChange}
                            helperText={!props.errors.assumedWeight}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.assumedWeight}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Total monthly cost</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="totalMonthlyCost"
                      value={waste.totalMonthlyCost}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        totalMonthlyCost: Yup.number().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.totalMonthlyCost &&
                                props.touched.totalMonthlyCost
                                ? true
                                : false
                            }
                            className="profile-pic"
                            type="number"
                            name="totalMonthlyCost"
                            value={props.values.totalMonthlyCost}
                            onChange={props.handleChange}
                            helperText={!props.errors.totalMonthlyCost}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {waste.totalMonthlyCost}
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
                      value={waste.previous_contract_length}
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
                    {waste.previous_contract_length}
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
                        Number(waste.previous_contract_start_date)
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
                                  waste.previous_contract_start_date
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
                      Number(waste.previous_contract_start_date)
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
                      value={waste.contract_length}
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
                    {waste.contract_length}
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
                        Number(waste.contract_start_date)
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
                      Number(waste.contract_start_date)
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
                        Number(waste.contract_end_date)
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
                    {helperMethods.ConvertDate(Number(waste.contract_end_date))}
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