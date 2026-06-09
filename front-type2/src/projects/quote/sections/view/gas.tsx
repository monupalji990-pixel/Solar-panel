import React, { useState, Suspense } from "react";
import { connect } from "react-redux";
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
  MeterTypeOption,
  ContractLengthOption,
  AMS,
  mapOptionsForService,
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function Gas(props) {
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

  let gas: any = {};
  if (service && service.gas) {
    gas = { ...service.gas };
  }


  if (gas && gas.bill_date_type && changeBillTypeToggle) {
    setBillType(gas.bill_date_type);
    setBillTypeToggle(false);
  }

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Gas",
      "edit"
    );
  }

  const CurrentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = gas;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
    if (value.meterNumber) qu.meterNumber = value.meterNumber;
    if (value.meterNumberTwo) qu.meterNumberTwo = value.meterNumberTwo;


    if (value.meterSerialNumber) qu.meterSerialNumber = value.meterSerialNumber;
    if (value.COT) qu.COT = value.COT;
    if (value.previous_contract_length)
      qu.previous_contract_length = value.previous_contract_length;
    if (value.contract_length) qu.contract_length = value.contract_length;
    if (value.meterType) qu.meterType = value.meterType;
    if (value.dailyCharges) qu.dailyCharges = value.dailyCharges;
    if (value.unitRate) qu.unitRate = value.unitRate;
    if (value.kWH) qu.kWH = value.kWH;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) {
      qu.contract_end_date = new Date(value.contract_end_date).getTime();
    }
    if (value.previous_contract_start_date)
      qu.previous_contract_start_date = value.previous_contract_start_date;
    if (value.bill_date_type) qu.bill_date_type = value.bill_date_type;
    if (value.no_of_days) qu.no_of_days = value.no_of_days;
    if (value.bill_start_date) qu.bill_start_date = value.bill_start_date;
    if (value.bill_end_date) qu.bill_end_date = value.bill_end_date;
    if (value.accountNumber) qu.accountNumber = value.accountNumber;
    if (value.onlineAccountUserName)
      qu.onlineAccountUserName = value.onlineAccountUserName;
    if (value.onlineAccountPassword)
      qu.onlineAccountPassword = value.onlineAccountPassword;
    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "gas",
      service: {
        gas: qu,
      },
    };
    if (value.CurrentSupplier && CurrentSupplierId.length > 0)
      quoteUpdate.Supplier = CurrentSupplierId;
    props._isLoadingData(true, props.type);
    props._editQuote(quoteUpdate, props.type);
    if (props.type === "quote") {
      //   props.toast("Quote edited Successfully");
    } else {
      //  props.toast("Renewal edited Successfully");
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
                      value={CurrentSupplier ? CurrentSupplier : "N/A"}
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
                  <strong>MPRN</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="meterNumber"
                      value={gas.meterNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        meterNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.meterNumber &&
                                props.touched.meterNumber
                                ? true
                                : false
                            }
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
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {gas.meterNumber}
                  </TableCell>
                )}
              </TableRow>


              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Second MPRN</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="meterNumberTwo"
                      value={gas.meterNumberTwo}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        meterNumberTwo: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.meterNumberTwo &&
                                props.touched.meterNumberTwo
                                ? true
                                : false
                            }
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
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {gas.meterNumberTwo}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Meter Serial Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="meterSerialNumber"
                      value={gas.meterSerialNumber || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        meterSerialNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.meterSerialNumber &&
                                props.touched.meterSerialNumber
                                ? true
                                : false
                            }
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
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {gas.meterSerialNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Meter Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="meterType"
                      value={gas.meterType || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        meterType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.meterType && props.touched.meterType
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="meterType"
                            value={{
                              label: props.values.meterType,
                              value: props.values.meterType,
                            }}
                            options={MeterTypeOption}
                            helperText={!props.errors.meterType}
                            onChange={(e) =>
                              props.setFieldValue("meterType", e.value)
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
                    {gas.meterType || "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>COT</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="COT"
                      value={gas.COT || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        COT: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.COT && props.touched.COT
                                ? true
                                : false
                            }
                            name="COT"
                            value={props.values.COT}
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
                    {gas.COT || "N/A"}
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
                      value={gas.previous_contract_length || "N/A"}
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
                    {gas.previous_contract_length || "N/A"}
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
                        Number(gas.previous_contract_start_date)
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
                      Number(gas.previous_contract_start_date)
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
                      value={gas.contract_length || "N/A"}
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
                    {gas.contract_length || "N/A"}
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
                        Number(gas.contract_start_date)
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
                    {helperMethods.ConvertDate(Number(gas.contract_start_date))}
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
                        Number(gas.contract_end_date)
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
                    {helperMethods.ConvertDate(Number(gas.contract_end_date))}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Unit Rate</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="unitRate"
                      value={gas.unitRate || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        unitRate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.unitRate && props.touched.unitRate
                                ? true
                                : false
                            }
                            name="unitRate"
                            value={props.values.unitRate}
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
                    {gas.unitRate || "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>AQ</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="kWH"
                      value={gas.kWH || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        kWH: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.kWH && props.touched.kWH
                                ? true
                                : false
                            }
                            name="kWH"
                            value={props.values.kWH}
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
                    {gas.kWH || "N/A"}
                  </TableCell>
                )}
              </TableRow>

              {(changeBillType === "Number days" || changeBillType === "2") && (
                <TableRow>
                  <TableCell>
                    {" "}
                    <strong>Number of Days</strong>
                  </TableCell>
                  {AMS.includes(props.slug) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="no_of_days"
                        value={gas.no_of_days || "N/A"}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          no_of_days: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.no_of_days &&
                                  props.touched.no_of_days
                                  ? true
                                  : false
                              }
                              name="no_of_days"
                              value={props.values.no_of_days}
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
                      {gas.no_of_days || "N/A"}
                    </TableCell>
                  )}
                </TableRow>
              )}

              {(changeBillType === "Date range" || changeBillType === "1") && (
                <TableRow>
                  <TableCell>
                    {" "}
                    <strong>Bill Start Date</strong>
                  </TableCell>
                  {AMS.includes(props.slug) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="bill_start_date"
                        value={helperMethods.ConvertDate(
                          Number(gas.bill_start_date)
                        )}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          bill_start_date: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container justify="space-around">
                                <KeyboardDatePicker
                                  error={
                                    props.errors.bill_start_date &&
                                      props.touched.bill_start_date
                                      ? true
                                      : false
                                  }
                                  margin="normal"
                                  className="profile-pic"
                                  name="bill_start_date"
                                  format="dd/MM/yyyy"
                                  value={props.values.bill_start_date}
                                  onChange={(e) =>
                                    props.setFieldValue(
                                      "bill_start_date",
                                      Number(new Date(e).getTime())
                                    )
                                  }
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  aria-describedby="bill_start_date-number-error"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {helperMethods.ConvertDate(Number(gas.bill_start_date))}
                    </TableCell>
                  )}
                </TableRow>
              )}
              {(changeBillType === "Date range" || changeBillType === "1") && (
                <TableRow>
                  <TableCell>
                    {" "}
                    <strong>Bill End Date</strong>
                  </TableCell>
                  {AMS.includes(props.slug) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="bill_end_date"
                        value={helperMethods.ConvertDate(
                          Number(gas.bill_end_date)
                        )}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          bill_end_date: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container justify="space-around">
                                <KeyboardDatePicker
                                  error={
                                    props.errors.bill_end_date &&
                                      props.touched.bill_end_date
                                      ? true
                                      : false
                                  }
                                  margin="normal"
                                  className="profile-pic"
                                  name="bill_end_date"
                                  format="dd/MM/yyyy"
                                  value={props.values.bill_end_date}
                                  onChange={(e) =>
                                    props.setFieldValue(
                                      "bill_end_date",
                                      Number(new Date(e).getTime())
                                    )
                                  }
                                  KeyboardButtonProps={{
                                    "aria-label": "change date",
                                  }}
                                  aria-describedby="bill_end_date-number-error"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {helperMethods.ConvertDate(Number(gas.bill_end_date))}
                    </TableCell>
                  )}
                </TableRow>
              )}

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Standing Charge</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="dailyCharges"
                      value={gas.dailyCharges || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        dailyCharges: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.dailyCharges &&
                                props.touched.dailyCharges
                                ? true
                                : false
                            }
                            name="dailyCharges"
                            value={props.values.dailyCharges}
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
                    {gas.dailyCharges || "N/A"}
                  </TableCell>
                )}
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
                      value={gas.accountNumber || "N/A"}
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
                    {gas.accountNumber || "N/A"}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Online Account Username</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  <OnTextEditInput
                    name="onlineAccountUserName"
                    value={gas.onlineAccountUserName || "N/A"}
                    onSubmit={simpleEdit}
                    validateIt={Yup.object().shape({
                      onlineAccountUserName: Yup.string().required("Required"),
                    })}
                  >
                    {(props) => {
                      return (
                        <TextField
                          error={
                            props.errors.onlineAccountUserName &&
                              props.touched.onlineAccountUserName
                              ? true
                              : false
                          }
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
                <TableCell>
                  {" "}
                  <strong>Online Account Password</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  <OnTextEditInput
                    name="onlineAccountPassword"
                    value={gas.onlineAccountPassword || "N/A"}
                    onSubmit={simpleEdit}
                    validateIt={Yup.object().shape({
                      onlineAccountPassword: Yup.string().required("Required"),
                    })}
                  >
                    {(props) => {
                      return (
                        <TextField
                          error={
                            props.errors.onlineAccountPassword &&
                              props.touched.onlineAccountPassword
                              ? true
                              : false
                          }
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
