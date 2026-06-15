import React, { useState, Suspense } from "react";
// import { Formik } from 'formik';
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
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import {
  AMS,
  ContractLengthOption
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";

import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";

export default function Water(
  props
) {
  const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentQuote.isDelete === 1
  );
  const [CurrentSupplierId, setCurrentSupplierId] = useState("");
  const [isShowCompany, setIsShowCompany] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});
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

  let water: any = {};
  if (service && service.water) {
    water = { ...service.water };
  }

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = water;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
    if (value.WaterSupplier) qu.WaterSupplier = value.WaterSupplier;
    if (value.WaterCorespId) qu.WaterCorespId = value.WaterCorespId;
    if (value.CoreSpidRates) qu.CoreSpidRates = value.CoreSpidRates;
    if (value.SewageSpid) qu.SewageSpid = value.SewageSpid;
    if (value.SewageApidRates) qu.SewageApidRates = value.SewageApidRates;
    if (value.WaterRenewalDate) qu.WaterRenewalDate = value.WaterRenewalDate;
    if (value.WaterMeterSN) qu.WaterMeterSN = value.WaterMeterSN;
    if (value.WaterAnnualSpend) qu.WaterAnnualSpend = value.WaterAnnualSpend;
    if (value.WaterDiscount) qu.WaterDiscount = value.WaterDiscount;
    if (value.previous_contract_length)
      qu.previous_contract_length = value.previous_contract_length;
    if (value.contract_length) qu.contract_length = value.contract_length;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.previous_contract_start_date)
      qu.previous_contract_start_date = value.previous_contract_start_date;
    if (value.accountNumber) qu.accountNumber = value.accountNumber;
    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "water",
      service: {
        water: qu,
      },
    };
    if (value.CurrentSupplier) quoteUpdate.Supplier = CurrentSupplierId;
    props._isLoadingData(true, props.type);
    props._editQuote(quoteUpdate, props.type);
    if (props.type === "quote") {
      //  props.toast("Quote edited Successfully");
    } else {
      //   props.toast("Renewal edited Successfully");
    }
    closeEdit(null);
    setSubmitting(false);
  };

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Water",
      "edit"
    );
  }

  const CurrentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";

  const viewCompany = (data) => {
    setIsShowCompany(true);
    setCompanyData(data);
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
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
                      <strong>Consumer Name</strong>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
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
                      <strong>Site Name</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {Site && Site.siteName}
                    </TableCell>
                  </TableRow>
                )}
              <TableRow>
                <TableCell>
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
                {["admin", "management"].includes(props.slug) ? (
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
                  <strong>Water Corespid</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WaterCorespId"
                      value={water.WaterCorespId}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WaterCorespId: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.WaterCorespId &&
                                props.touched.WaterCorespId
                                ? true
                                : false
                            }
                            className="profile-pic"
                            name="WaterCorespId"
                            value={props.values.WaterCorespId}
                            onChange={props.handleChange}
                            helperText={!props.errors.WaterCorespId}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {water.WaterCorespId}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Core Spid Rates</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="CoreSpidRates"
                      value={water.CoreSpidRates}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        CoreSpidRates: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.CoreSpidRates &&
                                props.touched.CoreSpidRates
                                ? true
                                : false
                            }
                            name="CoreSpidRates"
                            value={props.values.CoreSpidRates}
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
                    {water.CoreSpidRates}
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
                      value={water.previous_contract_length}
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
                    {water.previous_contract_length}
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
                        Number(water.previous_contract_start_date)
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
                      Number(water.previous_contract_start_date)
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
                      value={water.contract_length}
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
                    {water.contract_length}
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
                        Number(water.contract_start_date)
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
                                autoOk
                                error={
                                  props.errors.contract_start_date &&
                                  props.touched.contract_start_date
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
                      Number(water.contract_start_date)
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
                        Number(water.contract_end_date)
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
                    {helperMethods.ConvertDate(Number(water.contract_end_date))}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Sewage Spid</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="SewageSpid"
                      value={water.SewageSpid}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        SewageSpid: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.SewageSpid &&
                                props.touched.SewageSpid
                                ? true
                                : false
                            }
                            name="SewageSpid"
                            value={props.values.SewageSpid}
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
                    {water.SewageSpid}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Sewage Apid Rates</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="SewageApidRates"
                      value={water.SewageApidRates}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        SewageApidRates: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.SewageApidRates &&
                                props.touched.SewageApidRates
                                ? true
                                : false
                            }
                            name="SewageApidRates"
                            value={props.values.SewageApidRates}
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
                    {water.SewageApidRates}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Water Meter SN</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WaterMeterSN"
                      value={water.WaterMeterSN}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WaterMeterSN: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.WaterMeterSN &&
                                props.touched.WaterMeterSN
                                ? true
                                : false
                            }
                            name="WaterMeterSN"
                            value={props.values.WaterMeterSN}
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
                    {water.WaterMeterSN}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Water Annual Spend</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WaterAnnualSpend"
                      value={water.WaterAnnualSpend}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WaterAnnualSpend: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.WaterAnnualSpend &&
                                props.touched.WaterAnnualSpend
                                ? true
                                : false
                            }
                            name="WaterAnnualSpend"
                            value={props.values.WaterAnnualSpend}
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
                    {water.WaterAnnualSpend}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Water Discount</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WaterDiscount"
                      value={water.WaterDiscount}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WaterDiscount: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.WaterDiscount &&
                                props.touched.WaterDiscount
                                ? true
                                : false
                            }
                            name="WaterDiscount"
                            value={props.values.WaterDiscount}
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
                    {water.WaterDiscount}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Water Renewal Date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="WaterRenewalDate"
                      value={helperMethods.ConvertDate(
                        Number(water.WaterRenewalDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        WaterRenewalDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.WaterRenewalDate &&
                                    props.touched.WaterRenewalDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="WaterRenewalDate"
                                format="dd/MM/yyyy"
                                value={helperMethods.SwapDtoM(
                                  props.values.WaterRenewalDate
                                )}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "WaterRenewalDate",
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
                    {helperMethods.ConvertDate(Number(water.WaterRenewalDate))}
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
                      value={water.accountNumber}
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
                    {water.accountNumber}
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
        </ViewSimpleCompany>
      )}
    </Grid>
  );
}
