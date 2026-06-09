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
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import {
  ContractLengthOption,
  RentalOptions,
  ProductsOptions,
  ConnectionOptions,
  AMS,
  WholeSaleProviderOptions,
  BroadbandRouterPriceOptions,
  broadbandStatusOptions,
  mapOptionsForService
} from "../../../../sharedUtils/globalHelper/constantValues";

import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";
import _ from "lodash";

import DeleteRequest from "../smallModel/deleteRequest";
import { CommonSimple as ViewSimpleCompany } from "../../../company/loadable/CommonSimple";

export default function Broadband(props) {
  const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentQuote.isDelete === 1
  );
  const [isShowCompany, setIsShowCompany] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});
  const [CurrentSupplierId, setCurrentSupplierId] = useState("");

  const { type } = props;
  const {
    QuoteID,
    Company,
    service,
    Site,
    contractLengthDate,
    isLiveDateProvided,
    postcode,
    Supplier,
    RenewalID,
    quoteStatus,
    Status,
    isActive,
    isDelete,
  } = props.currentQuote;

  let broadband: any = {};
  if (service && service.broadband) {
    broadband = { ...service.broadband };
  }
  const CurrentSupplier =
    Supplier !== undefined && Supplier ? Supplier.supplierName : "";
  let supplierList = [];
  if (props.suppliers) {
    let voipList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "VOIP",
      "add"
    );
    let mobileList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Mobile",
      "add"
    );
    let phoneLineList = helperMethods.specificServiceSupplier(
      props.suppliers,
      "Phone Line",
      "add"
    );
    supplierList = _.unionBy(voipList, mobileList, phoneLineList, "value");
  }
  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = broadband;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
    if (value.Products) qu.Products = value.Products;
    if (value.Rental) qu.Rental = value.Rental;
    if (value.ConnectionCharges) qu.ConnectionCharges = value.ConnectionCharges;
    if (value.RouterPrice) qu.RouterPrice = value.RouterPrice;
    if (value.status) qu.status = value.status;
    if (value.BroadbandLiveDate) qu.BroadbandLiveDate = value.BroadbandLiveDate;
    if (value.BroadbandRenewalDate)
      qu.BroadbandRenewalDate = value.BroadbandRenewalDate;
    if (value.ProgrammedDate) qu.ProgrammedDate = value.ProgrammedDate;
    if (value.UserName) qu.UserName = value.UserName;
    if (value.Password) qu.Password = value.Password;
    if (value.wifi_name) qu.wifi_name = value.wifi_name;
    if (value.wifi_password) qu.wifi_password = value.wifi_password;
    if (value.IPAddress) qu.IPAddress = value.IPAddress;
    if (value.RouterModel) qu.RouterModel = value.RouterModel;
    if (value.SerialNumber) qu.SerialNumber = value.SerialNumber;
    if (value.BroadbandPostageProof)
      qu.BroadbandPostageProof = value.BroadbandPostageProof;
    if (value.previous_contract_length)
      qu.previous_contract_length = value.previous_contract_length;
    if (value.contract_length) qu.contract_length = value.contract_length;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.previous_contract_start_date)
      qu.previous_contract_start_date = value.previous_contract_start_date;
    if (value.accountNumber) qu.accountNumber = value.accountNumber;
    if (value.WholeSaleProvider) qu.WholeSaleProvider = value.WholeSaleProvider;
    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "broadband",
      service: {
        broadband: qu,
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
                              props.setFieldValue("CurrentSupplier", e.label);
                              setCurrentSupplierId(e.value);
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
                  <strong>Products & Packages</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Products"
                      value={broadband.Products}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Products: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.Products && props.touched.Products
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="Products"
                            value={{
                              label: props.values.Products,
                              value: props.values.Products,
                            }}
                            options={ProductsOptions}
                            helperText={!props.errors.Products}
                            onChange={(e) =>
                              props.setFieldValue("Products", e.value)
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
                    {broadband.Products}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Broadband rental</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Rental"
                      value={broadband.Rental}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Rental: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.Rental && props.touched.Rental
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="Rental"
                            value={{
                              label: props.values.Rental,
                              value: props.values.Rental,
                            }}
                            options={RentalOptions}
                            helperText={!props.errors.Rental}
                            onChange={(e) =>
                              props.setFieldValue("Rental", e.value)
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
                    {broadband.Rental}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Connection charges</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ConnectionCharges"
                      value={broadband.ConnectionCharges}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ConnectionCharges: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.ConnectionCharges &&
                                props.touched.ConnectionCharges
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="ConnectionCharges"
                            value={{
                              label: props.values.ConnectionCharges,
                              value: props.values.ConnectionCharges,
                            }}
                            options={ConnectionOptions}
                            helperText={!props.errors.ConnectionCharges}
                            onChange={(e) =>
                              props.setFieldValue("ConnectionCharges", e.value)
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
                    {broadband.ConnectionCharges}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Router price</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="RouterPrice"
                      value={broadband.RouterPrice}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        RouterPrice: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {

                        return (
                          <Select
                            error={
                              props.errors.RouterPrice &&
                                props.touched.RouterPrice
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="RouterPrice"
                            value={{
                              label: props.values.RouterPrice,
                              value: props.values.RouterPrice,
                            }}
                            options={BroadbandRouterPriceOptions}
                            helperText={!props.errors.RouterPrice}
                            onChange={(e) =>
                              props.setFieldValue("RouterPrice", e.value)
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
                    {broadband.RouterPrice}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Broadband Status</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="status"
                      value={broadband.status}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        status: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.status && props.touched.status
                                ? true
                                : false
                            }
                            className="basic-multi-select"
                            name="status"
                            value={{
                              label: props.values.status,
                              value: props.values.status,
                            }}
                            options={broadbandStatusOptions}
                            helperText={!props.errors.status}
                            onChange={(e) =>
                              props.setFieldValue("status", e.value)
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
                    {broadband.status}
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
                      value={broadband.previous_contract_length}
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
                    {broadband.previous_contract_length}
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
                        Number(broadband.previous_contract_start_date)
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
                      Number(broadband.previous_contract_start_date)
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
                      value={broadband.contract_length}
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
                    {broadband.contract_length}
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
                        Number(broadband.contract_start_date)
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
                      Number(broadband.contract_start_date)
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
                        Number(broadband.contract_end_date)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        contract_end_date: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        console.log(props);
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
                      Number(broadband.contract_end_date)
                    )}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>User name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="UserName"
                      value={broadband.UserName}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        UserName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.UserName && props.touched.UserName
                                ? true
                                : false
                            }
                            name="UserName"
                            value={props.values.UserName}
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
                    {broadband.UserName}
                  </TableCell>
                )}
              </TableRow>

              {AMS.includes(props.slug) && (
                <TableRow>
                  <TableCell>
                    <strong>Password</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Password"
                      type="password"
                      value={broadband.Password}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Password: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.Password && props.touched.Password
                                ? true
                                : false
                            }
                            name="Password"
                            type="password"
                            value={props.values.Password}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>IP address</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="IPAddress"
                      value={broadband.IPAddress}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        IPAddress: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.IPAddress && props.touched.IPAddress
                                ? true
                                : false
                            }
                            name="IPAddress"
                            value={props.values.IPAddress}
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
                    {broadband.IPAddress}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Router model</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="RouterModel"
                      value={broadband.RouterModel}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        RouterModel: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.RouterModel &&
                                props.touched.RouterModel
                                ? true
                                : false
                            }
                            name="RouterModel"
                            value={props.values.RouterModel}
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
                    {broadband.RouterModel}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Serial number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="SerialNumber"
                      value={broadband.SerialNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        SerialNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.SerialNumber &&
                                props.touched.SerialNumber
                                ? true
                                : false
                            }
                            name="SerialNumber"
                            value={props.values.SerialNumber}
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
                    {broadband.SerialNumber}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Programmed date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ProgrammedDate"
                      value={helperMethods.ConvertDate(
                        Number(broadband.ProgrammedDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ProgrammedDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.ProgrammedDate &&
                                    props.touched.ProgrammedDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="ProgrammedDate"
                                format="dd/MM/yyyy"
                                value={props.values.ProgrammedDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "ProgrammedDate",
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
                      Number(broadband.ProgrammedDate)
                    )}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Broadband postage proof</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="BroadbandPostageProof"
                      value={broadband.BroadbandPostageProof}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        BroadbandPostageProof: Yup.string().required(
                          "Required"
                        ),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.BroadbandPostageProof &&
                                props.touched.BroadbandPostageProof
                                ? true
                                : false
                            }
                            name="BroadbandPostageProof"
                            value={props.values.BroadbandPostageProof}
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
                    {broadband.BroadbandPostageProof}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Broadband live date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="BroadbandLiveDate"
                      value={helperMethods.ConvertDate(
                        Number(broadband.BroadbandLiveDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        BroadbandLiveDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.BroadbandLiveDate &&
                                    props.touched.BroadbandLiveDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="BroadbandLiveDate"
                                format="dd/MM/yyyy"
                                value={props.values.BroadbandLiveDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "BroadbandLiveDate",
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
                      Number(broadband.BroadbandLiveDate)
                    )}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Broadband Renewal date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="BroadbandRenewalDate"
                      value={helperMethods.ConvertDate(
                        Number(broadband.BroadbandRenewalDate)
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        BroadbandRenewalDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.BroadbandRenewalDate &&
                                    props.touched.BroadbandRenewalDate
                                    ? true
                                    : false
                                }
                                margin="normal"
                                className="profile-pic"
                                name="BroadbandRenewalDate"
                                format="dd/MM/yyyy"
                                value={props.values.BroadbandRenewalDate}
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "BroadbandRenewalDate",
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
                      Number(broadband.BroadbandRenewalDate)
                    )}
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
                      value={broadband.accountNumber}
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
                    {broadband.accountNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Wifi name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="wifi_name"
                      value={broadband.wifi_name || '-'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        wifi_name: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.wifi_name && props.touched.wifi_name
                                ? true
                                : false
                            }
                            name="wifi_name"
                            value={props.values.wifi_name}
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
                    {broadband.wifi_name || '-'}
                  </TableCell>
                )}
              </TableRow>

              {AMS.includes(props.slug) && (
                <TableRow>
                  <TableCell>
                    <strong>Wifi Password</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="wifi_password"
                      type="password"
                      value={broadband.wifi_password || '-'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        wifi_password: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.wifi_password && props.touched.wifi_password
                                ? true
                                : false
                            }
                            name="wifi_password"
                            type="password"
                            value={props.values.wifi_password}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>
              )}


              <TableRow>
                <TableCell>
                  <strong>Wholesale Provider</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  <OnTextEditInput
                    name="WholeSaleProvider"
                    value={broadband.WholeSaleProvider}
                    onSubmit={simpleEdit}
                    validateIt={Yup.object().shape({
                      WholeSaleProvider: Yup.string().required("Required"),
                    })}
                  >
                    {(props) => {
                      return (
                        <Select
                          error={
                            props.errors.WholeSaleProvider &&
                              props.touched.WholeSaleProvider
                              ? true
                              : false
                          }
                          className="basic-multi-select"
                          name="WholeSaleProvider"
                          value={{
                            label: props.values.WholeSaleProvider,
                            value: props.values.WholeSaleProvider,
                          }}
                          options={WholeSaleProviderOptions}
                          helperText={!props.errors.WholeSaleProvider}
                          onChange={(e) =>
                            props.setFieldValue("WholeSaleProvider", e.value)
                          }
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
        </ViewSimpleCompany>
      )}
    </Grid>
  );
}