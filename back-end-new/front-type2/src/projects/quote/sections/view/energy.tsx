import React, { useState, Suspense } from "react";
// import { Formik } from 'formik';
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
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";

import {
  AMS,
  EconomyOptions,
  PaymentOptions,
  warmHomeDiscounts,
  ContractLengthOption
} from "../../../../sharedUtils/globalHelper/constantValues";

import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function Energy(props) {
  const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentQuote.isDelete === 1
  );
  const [CurrentSupplierId, setCurrentSupplierId] = useState("");
  const [isShowConsumer, setIsShowConsumer] = React.useState(false);
  const [consumerData, setConsumerData] = React.useState({});
  const { type } = props;
  const {
    QuoteID,
    Company,
    service,
    Site,
    postcode,
    Consumer,
    Supplier,
    quoteStatus,
    RenewalID,
    Status,
    isActive,
    isDelete,
    contractLengthDate,
    isLiveDateProvided,
  } = props.currentQuote;

  let energy: any = {};
  if (service && service.energy) {
    energy = { ...service.energy };
  }

  let supplierList = [];
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Gas",
      "edit"
    );
  }

  const currentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    let qu = energy;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

    if (value.EMonthlyCost) qu.EMonthlyCost = value.EMonthlyCost;
    if (value.EAnnualCost) qu.EAnnualCost = value.EAnnualCost;
    if (value.GMonthlyCost) qu.GMonthlyCost = value.GMonthlyCost;
    if (value.GAnnualCost) qu.GAnnualCost = value.GAnnualCost;

    if (value.pcode) qu.pcode = value.pcode;

    if (value.currentTariff) qu.currentTariff = value.currentTariff;
    if (value.economy) qu.economy = value.economy;
    if (value.electricAnnual) qu.electricAnnual = value.electricAnnual;
    if (value.gasAnnual) qu.gasAnnual = value.gasAnnual;
    if (value.paymentOption) qu.paymentOption = value.paymentOption;
    if (value.warmHomeDiscount) qu.warmHomeDiscount = value.warmHomeDiscount;
    if (value.newSupplier) qu.newSupplier = value.newSupplier;
    if (value.newTariff) qu.newTariff = value.newTariff;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.contract_length) qu.contract_length = value.contract_length;

    if (value.contractReviewOption) qu.contractReviewOption = value.contractReviewOption;




    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "energy",
      service: {
        energy: qu,
      },
    };
    if (value.currentSupplier) quoteUpdate.Supplier = CurrentSupplierId;

    props._isLoadingData(true, props.type);
    props._editQuote(quoteUpdate, props.type);
    if (props.type === "quote") {
      //    props.toast("Quote edited Successfully");
    } else {
      //    props.toast("Renewal edited Successfully");
    }
    closeEdit(null);
    setSubmitting(false);
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
                      name="currentSupplier"
                      value={currentSupplier}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        currentSupplier: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.currentSupplier &&
                                props.touched.currentSupplier
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="currentSupplier"
                            value={{
                              label: props.values.currentSupplier,
                              value: props.values.currentSupplier,
                            }}
                            options={supplierList}
                            helperText={!props.errors.currentSupplier}
                            onChange={(e) => {
                              props.setFieldValue("currentSupplier", e.value);
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
                  <strong>Current Tariff</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="currentTariff"
                      value={energy.currentTariff}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        currentTariff: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.currentTariff &&
                                props.touched.currentTariff
                                ? true
                                : false
                            }
                            name="currentTariff"
                            value={props.values.currentTariff}
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
                    {energy.currentTariff}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Economy 7</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="economy"
                      value={energy.economy}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        economy: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.economy && props.touched.economy
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="economy"
                            value={{
                              label: props.values.economy,
                              value: props.values.economy,
                            }}
                            options={EconomyOptions}
                            helperText={!props.errors.economy}
                            onChange={(e) => {
                              props.setFieldValue("economy", e.value);
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
                    {energy.economy}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Electric Annual Usage</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EAnnualCost"
                      value={energy.EAnnualCost ? energy.EAnnualCost : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EAnnualCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EAnnualCost &&
                                props.touched.EAnnualCost
                                ? true
                                : false
                            }
                            name="EAnnualCost"
                            value={props.values.EAnnualCost}
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
                    {energy.EAnnualCost ? energy.EAnnualCost : "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Electric Monthly Usage</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EMonthlyCost"
                      value={energy.EMonthlyCost ? energy.EMonthlyCost : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EMonthlyCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EMonthlyCost &&
                                props.touched.EMonthlyCost
                                ? true
                                : false
                            }
                            name="EMonthlyCost"
                            value={props.values.EMonthlyCost}
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
                    {energy.EMonthlyCost ? energy.EMonthlyCost : "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Gas Annual Usage</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="GAnnualCost"
                      value={energy.GAnnualCost ? energy.GAnnualCost : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        GAnnualCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.GAnnualCost &&
                                props.touched.GAnnualCost
                                ? true
                                : false
                            }
                            name="GAnnualCost"
                            value={props.values.GAnnualCost}
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
                    {energy.GAnnualCost ? energy.GAnnualCost : "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Gas Monthly Usage</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="GMonthlyCost"
                      value={energy.GMonthlyCost ? energy.GMonthlyCost : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        GMonthlyCost: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.GMonthlyCost &&
                                props.touched.GMonthlyCost
                                ? true
                                : false
                            }
                            name="GMonthlyCost"
                            value={props.values.GMonthlyCost}
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
                    {energy.GMonthlyCost ? energy.GMonthlyCost : "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Payment Option</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="paymentOption"
                      value={energy.paymentOption}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        paymentOption: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.paymentOption &&
                                props.touched.paymentOption
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="paymentOption"
                            value={{
                              label: props.values.paymentOption,
                              value: props.values.paymentOption,
                            }}
                            options={PaymentOptions}
                            helperText={!props.errors.paymentOption}
                            onChange={(e) => {
                              props.setFieldValue("paymentOption", e.value);
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
                    {energy.paymentOption}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Warm Home Discount</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="warmHomeDiscount"
                      value={energy.warmHomeDiscount}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        warmHomeDiscount: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.warmHomeDiscount &&
                                props.touched.warmHomeDiscount
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="warmHomeDiscount"
                            value={{
                              label: props.values.warmHomeDiscount,
                              value: props.values.warmHomeDiscount,
                            }}
                            options={warmHomeDiscounts}
                            helperText={!props.errors.warmHomeDiscount}
                            onChange={(e) => {
                              props.setFieldValue("warmHomeDiscount", e.value);
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
                    {energy.warmHomeDiscount}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Promotion Code</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="pcode"
                      value={energy.pcode ? energy.pcode : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        pcode: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.pcode && props.touched.pcode
                                ? true
                                : false
                            }
                            name="pcode"
                            value={props.values.pcode}
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
                    {energy.pcode ? energy.pcode : "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>New Supplier Name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="newSupplier"
                      value={currentSupplier}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        currentSupplier: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.currentSupplier &&
                                props.touched.currentSupplier
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="currentSupplier"
                            value={{
                              label: props.values.currentSupplier,
                              value: props.values.currentSupplier,
                            }}
                            options={supplierList}
                            helperText={!props.errors.currentSupplier}
                            onChange={(e) => {
                              props.setFieldValue("currentSupplier", e.value);
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
                    {currentSupplier}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>New Supplier Tariff</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="newTariff"
                      value={energy.newTariff}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        newTariff: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.newTariff && props.touched.newTariff
                                ? true
                                : false
                            }
                            name="newTariff"
                            value={props.values.newTariff}
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
                    {energy.newTariff}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Contract Length</strong>
                </TableCell>
                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="contract_length"
                      value={energy.contract_length || "N/A"}
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
                    {energy.contract_length || "N/A"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contract Start Date</strong>
                </TableCell>
                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="contract_start_date"
                      value={helperMethods.ConvertDate(
                        Number(energy.contract_start_date)
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
                      Number(energy.contract_start_date)
                    )}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contract End Date</strong>
                </TableCell>
                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="contract_end_date"
                      value={helperMethods.ConvertDate(
                        Number(energy.contract_end_date)
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
                                aria-describedby="pcontract_end_date-number-error"
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
                      Number(energy.contract_end_date)
                    )}
                  </TableCell>
                )}
              </TableRow>




              {/* {[{ value: '3', label: '3' }, { value: '11', label: '11' }]} */}

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Contract Review</strong>
                </TableCell>
                {(AMS.includes(props.slug) && quoteStatus == 1000) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="contractReviewOption"
                      value={energy.contractReviewOption || "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        contractReviewOption: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.contractReviewOption &&
                                props.touched.contractReviewOption
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="contractReviewOption"
                            value={{
                              label: props.values.contractReviewOption,
                              value: props.values.contractReviewOption,
                            }}
                            options={[{ value: '3 Months', label: '3 Months' }, { value: '11 Months', label: '11 Months' }]}
                            helperText={!props.errors.contractReviewOption}
                            onChange={(e) =>
                              props.setFieldValue("contractReviewOption", e.value)
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
                    {energy.contractReviewOption || "N/A"}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
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
