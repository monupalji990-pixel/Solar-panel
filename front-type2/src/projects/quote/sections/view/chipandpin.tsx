import React, { useState, Suspense } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import {
  ContractLengthOption,
  PDQFinanceStatusOptions,
  ConnectionTypeOptions,
  MachineTypeOptions,
  AMS,
  mapOptionsForService
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";

import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function ChipAndPin(props) {
  const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentQuote.isDelete === 1
  );
  const [CurrentSupplierId, setCurrentSupplierId] = useState("");
  const [isShowCompany, setIsShowCompany] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});
  const [tidNumber, setTIDNumber]: any = React.useState(null);
  const { type } = props;
  const {
    QuoteID,
    Company,
    service,
    Site,
    postcode,
    Supplier,
    RenewalID,
    quoteStatus,
    Status,
    isActive,
    isDelete,
    contractLengthDate,
    isLiveDateProvided,
  } = props.currentQuote;

  let chipAndPin: any = {};
  if (service && service.chipAndPin) {
    chipAndPin = { ...service.chipAndPin };

  }

  const AddNewTIDNumber = () => {
    let setEditKey = true;
    let setSubmitting;
    let qu = [...chipAndPin.tidNumber];

    qu.push(tidNumber);
    simpleEdit({ tidNumber: qu }, setEditKey, setSubmitting);
  }

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = chipAndPin;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
    if (value.MachineType) qu.MachineType = value.MachineType;
    if (value.PDQFinanceStatus) qu.PDQFinanceStatus = value.PDQFinanceStatus;
    if (value.NumberTerminals) qu.NumberTerminals = value.NumberTerminals;
    if (value.ConnectionType) qu.ConnectionType = value.ConnectionType;
    if (value.DeliveryDate) qu.DeliveryDate = value.DeliveryDate;
    if (value.FirstTransactionDate)
      qu.FirstTransactionDate = value.FirstTransactionDate;
    if (value.RenewalDate) qu.RenewalDate = value.RenewalDate;
    if (value.ProviderRefNumber) qu.ProviderRefNumber = value.ProviderRefNumber;
    if (value.MerchantRental) qu.MerchantRental = value.MerchantRental;
    if (value.Package) qu.Package = value.Package;
    if (value.AnalyticsCost) qu.AnalyticsCost = value.AnalyticsCost;
    if (value.CreditCardRate) qu.CreditCardRate = value.CreditCardRate;
    if (value.DebitCardRate) qu.DebitCardRate = value.DebitCardRate;
    if (value.BusinessCardRate) qu.BusinessCardRate = value.BusinessCardRate;
    if (value.DeploymentCost) qu.DeploymentCost = value.DeploymentCost;
    if (value.AuthorizationFee) qu.AuthorizationFee = value.AuthorizationFee;
    if (value.PCIDSSCharge) qu.PCIDSSCharge = value.PCIDSSCharge;
    if (value.PCIDSSUserName) qu.PCIDSSUserName = value.PCIDSSUserName;
    if (value.PCIDSSPassword) qu.PCIDSSPassword = value.PCIDSSPassword;
    if (value.PCIComplaintDate) qu.PCIComplaintDate = value.PCIComplaintDate;
    if (value.previous_contract_length)
      qu.previous_contract_length = value.previous_contract_length;
    if (value.contract_length) qu.contract_length = value.contract_length;
    if (value.previous_contract_start_date)
      qu.previous_contract_start_date = value.previous_contract_start_date;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.accountNumber) qu.accountNumber = value.accountNumber;
    if (value.midNumber) qu.midNumber = value.midNumber;
    if (value.tidNumber) qu.tidNumber = value.tidNumber;

    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "chipAndPin",
      service: {
        chipAndPin: qu,
      },
    };
    if (value.CurrentSupplier) quoteUpdate.Supplier = CurrentSupplierId;
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

  const handleTidNumber = (index, values, setEditKey, setSubmitting) => {
    let tidNumber = [...chipAndPin.tidNumber];
    Object.keys(values).forEach((key) => {
      try {
        tidNumber[index] = values[key];
      } catch (error) {
        console.log("Erooor", error);
      }
    });
    simpleEdit({ tidNumber: tidNumber }, setEditKey, setSubmitting);
  }

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Chip and Pin",
      "edit"
    );
  }
  const CurrentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";

  const viewCompany = (data) => {
    setIsShowCompany(true);
    setCompanyData(data);
  };

  const handleChangeTIDNumber = (e) => {
    setTIDNumber(e.target.value);
  }

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

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Site Name</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  {Site && Site.siteName}
                </TableCell>
              </TableRow>

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

              {props.currentQuote.Company && props.currentQuote.Company.postcode &&
                <TableRow>
                  <TableCell> <strong>Postcode</strong></TableCell>
                  <TableCell component="th" scope="row">{props.currentQuote.Company.postcode}</TableCell>
                </TableRow>
              }

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
                  <strong>Machine Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="MachineType"
                      value={chipAndPin.MachineType}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        MachineType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.MachineType &&
                                props.touched.MachineType
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="MachineType"
                            value={{
                              label: props.values.MachineType,
                              value: props.values.MachineType,
                            }}
                            options={MachineTypeOptions}
                            helperText={!props.errors.MachineType}
                            onChange={(e) =>
                              props.setFieldValue("MachineType", e.value)
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
                    {chipAndPin.MachineType}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Payment Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="PDQFinanceStatus"
                      value={chipAndPin.PDQFinanceStatus}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        PDQFinanceStatus: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.PDQFinanceStatus &&
                                props.touched.PDQFinanceStatus
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="PDQFinanceStatus"
                            value={{
                              label: props.values.PDQFinanceStatus,
                              value: props.values.PDQFinanceStatus,
                            }}
                            options={PDQFinanceStatusOptions}
                            helperText={!props.errors.PDQFinanceStatus}
                            onChange={(e) =>
                              props.setFieldValue("PDQFinanceStatus", e.value)
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
                    {chipAndPin.PDQFinanceStatus}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Number of terminals</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="NumberTerminals"
                      value={chipAndPin.NumberTerminals}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        NumberTerminals: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.NumberTerminals &&
                                props.touched.NumberTerminals
                                ? true
                                : false
                            }
                            className="profile-pic"
                            name="NumberTerminals"
                            value={props.values.NumberTerminals}
                            onChange={props.handleChange}
                            helperText={!props.errors.NumberTerminals}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.NumberTerminals}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Provider Ref. number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ProviderRefNumber"
                      value={chipAndPin.ProviderRefNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ProviderRefNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.ProviderRefNumber &&
                                props.touched.ProviderRefNumber
                                ? true
                                : false
                            }
                            name="ProviderRefNumber"
                            value={props.values.ProviderRefNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.ProviderRefNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Merchant rental</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="MerchantRental"
                      value={chipAndPin.MerchantRental}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        MerchantRental: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.MerchantRental &&
                                props.touched.MerchantRental
                                ? true
                                : false
                            }
                            name="MerchantRental"
                            value={props.values.MerchantRental}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.MerchantRental}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Package</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Package"
                      value={chipAndPin.Package}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Package: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.Package && props.touched.Package
                                ? true
                                : false
                            }
                            name="Package"
                            value={props.values.Package}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.Package}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Deployment Cost</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="DeploymentCost"
                      value={chipAndPin.DeploymentCost}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        DeploymentCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.DeploymentCost &&
                                props.touched.DeploymentCost
                                ? true
                                : false
                            }
                            name="DeploymentCost"
                            value={props.values.DeploymentCost}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.DeploymentCost}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Analytics cost</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="AnalyticsCost"
                      value={chipAndPin.AnalyticsCost}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        AnalyticsCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.AnalyticsCost &&
                                props.touched.AnalyticsCost
                                ? true
                                : false
                            }
                            name="AnalyticsCost"
                            value={props.values.AnalyticsCost}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.AnalyticsCost}
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
                      value={chipAndPin.previous_contract_length}
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
                    {chipAndPin.previous_contract_length}
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
                        Number(chipAndPin.previous_contract_start_date)
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
                                  props.values.previous_contract_start_date
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
                      Number(chipAndPin.previous_contract_start_date)
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
                      value={chipAndPin.contract_length}
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
                    {chipAndPin.contract_length}
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
                        Number(chipAndPin.contract_start_date)
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
                      Number(chipAndPin.contract_start_date)
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
                        Number(chipAndPin.contract_end_date)
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
                    {helperMethods.ConvertDate(
                      Number(chipAndPin.contract_end_date)
                    )}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Credit card rates</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="CreditCardRate"
                      value={chipAndPin.CreditCardRate}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        CreditCardRate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.CreditCardRate &&
                                props.touched.CreditCardRate
                                ? true
                                : false
                            }
                            name="CreditCardRate"
                            value={props.values.CreditCardRate}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.CreditCardRate}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Debit card rates</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="DebitCardRate"
                      value={chipAndPin.DebitCardRate}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        DebitCardRate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.DebitCardRate &&
                                props.touched.DebitCardRate
                                ? true
                                : false
                            }
                            name="DebitCardRate"
                            value={props.values.DebitCardRate}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.DebitCardRate}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Business card rates</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="BusinessCardRate"
                      value={chipAndPin.BusinessCardRate}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        BusinessCardRate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.BusinessCardRate &&
                                props.touched.BusinessCardRate
                                ? true
                                : false
                            }
                            name="BusinessCardRate"
                            value={props.values.BusinessCardRate}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.BusinessCardRate}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Authorization fee</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="AuthorizationFee"
                      value={chipAndPin.AuthorizationFee}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        AuthorizationFee: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.AuthorizationFee &&
                                props.touched.AuthorizationFee
                                ? true
                                : false
                            }
                            name="AuthorizationFee"
                            value={props.values.AuthorizationFee}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.AuthorizationFee}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>PCI DSS charge</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="PCIDSSCharge"
                      value={chipAndPin.PCIDSSCharge}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        PCIDSSCharge: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.PCIDSSCharge &&
                                props.touched.PCIDSSCharge
                                ? true
                                : false
                            }
                            name="PCIDSSCharge"
                            value={props.values.PCIDSSCharge}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.PCIDSSCharge}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Connection type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ConnectionType"
                      value={chipAndPin.ConnectionType}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ConnectionType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.ConnectionType &&
                                props.touched.ConnectionType
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="ConnectionType"
                            value={{
                              label: props.values.ConnectionType,
                              value: props.values.ConnectionType,
                            }}
                            options={ConnectionTypeOptions}
                            helperText={!props.errors.ConnectionType}
                            onChange={(e) =>
                              props.setFieldValue("ConnectionType", e.value)
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
                    {chipAndPin.ConnectionType}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Delivery date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="DeliveryDate"
                      value={helperMethods.ConvertDate(
                        Number(chipAndPin.DeliveryDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        DeliveryDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.DeliveryDate &&
                                    props.touched.DeliveryDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="DeliveryDate"
                                format="dd/MM/yyyy"
                                value={props.values.DeliveryDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "DeliveryDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="DeliveryDate-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(Number(chipAndPin.DeliveryDate))}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>First transaction date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="FirstTransactionDate"
                      value={helperMethods.ConvertDate(
                        Number(chipAndPin.FirstTransactionDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        FirstTransactionDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.FirstTransactionDate &&
                                    props.touched.FirstTransactionDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="FirstTransactionDate"
                                format="dd/MM/yyyy"
                                value={props.values.FirstTransactionDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "FirstTransactionDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="FirstTransactionDate-number-error"
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
                      Number(chipAndPin.FirstTransactionDate)
                    )}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Renewal Date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="RenewalDate"
                      value={helperMethods.ConvertDate(
                        Number(chipAndPin.RenewalDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        RenewalDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.RenewalDate &&
                                    props.touched.RenewalDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="RenewalDate"
                                format="dd/MM/yyyy"
                                value={props.values.RenewalDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "RenewalDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="RenewalDate-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(Number(chipAndPin.RenewalDate))}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>PCI DSS user name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="PCIDSSUserName"
                      value={chipAndPin.PCIDSSUserName}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        PCIDSSUserName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.PCIDSSUserName &&
                                props.touched.PCIDSSUserName
                                ? true
                                : false
                            }
                            name="PCIDSSUserName"
                            value={props.values.PCIDSSUserName}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.PCIDSSUserName}
                  </TableCell>
                )}
              </TableRow>
              {AMS.includes(props.slug) && (
                <TableRow>
                  <TableCell>
                    {" "}
                    <strong>PCI DSS password</strong>
                  </TableCell>
                  {AMS.includes(props.slug) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="PCIDSSPassword"
                        value={chipAndPin.PCIDSSPassword}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          PCIDSSPassword: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.PCIDSSPassword &&
                                  props.touched.PCIDSSPassword
                                  ? true
                                  : false
                              }
                              name="PCIDSSPassword"
                              value={props.values.PCIDSSPassword}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      <input value={chipAndPin.PCIDSSPassword} type="text" />
                    </TableCell>
                  )}
                </TableRow>
              )}
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>PCI complaint date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="PCIComplaintDate"
                      value={helperMethods.ConvertDate(
                        Number(chipAndPin.PCIComplaintDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        PCIComplaintDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.PCIComplaintDate &&
                                    props.touched.PCIComplaintDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="PCIComplaintDate"
                                format="dd/MM/yyyy"
                                value={props.values.PCIComplaintDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "PCIComplaintDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="PCIComplaintDate-number-error"
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
                      Number(chipAndPin.PCIComplaintDate)
                    )}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>MID Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="midNumber"
                      value={chipAndPin.midNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        midNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.midNumber && props.touched.midNumber
                                ? true
                                : false
                            }
                            name="midNumber"
                            value={props.values.midNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.midNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>TID Number's</strong>
                </TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="caption" style={{}}>
                        Click To Expand
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table>
                        <TableBody
                          style={{
                            borderBottom: "2px solid #000",
                          }}
                        >

                          {chipAndPin.tidNumber && chipAndPin.tidNumber.map((key, index) => (
                            <>
                              <TableRow>
                                {/* <TableCell>{key}</TableCell> */}
                                <TableCell>
                                  <OnTextEditInput
                                    name={key}
                                    value={[key]}
                                    onSubmit={(values, setEditKey, setSubmitting) => handleTidNumber(index, values, setEditKey, setSubmitting)}
                                  >
                                    {(props) => {
                                      return (
                                        <TextField
                                          name="tidNumber"
                                          value={props.values[key]}
                                          onChange={(e) => {
                                            props.setFieldValue(key, e.target.value);
                                          }}
                                          onBlur={props.handleBlur}
                                          margin="normal"
                                        />
                                      );
                                    }}
                                  </OnTextEditInput>
                                </TableCell>
                              </TableRow>
                            </>
                          ))}

                          <div style={{ padding: '10px 0' }}>
                            <TextField
                              variant="outlined"
                              label={`TID Number`}
                              // type="number"
                              name="tidNumber"
                              value={tidNumber}
                              onChange={(e) => handleChangeTIDNumber(e)}
                              margin="normal"
                              className="WidhtFull100"
                            />

                            <Button
                              color="primary"
                              aria-label="Add"
                              variant="contained"
                              size="small"
                              style={{ marginTop: 20 }}
                              onClick={() => AddNewTIDNumber()}
                            >
                              Add TID Number
                            </Button>
                          </div>
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Account Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="accountNumber"
                      value={chipAndPin.accountNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        accountNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.accountNumber &&
                                props.touched.accountNumber
                                ? true
                                : false
                            }
                            name="accountNumber"
                            value={props.values.accountNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {chipAndPin.accountNumber}
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
    </Grid>
  );
}

//);
