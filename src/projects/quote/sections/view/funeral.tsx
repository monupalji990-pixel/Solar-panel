import React, { useState } from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import OnTextEditInput from "../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import {
  FuneralTypes,
  FuneralProviderOptions,
  AMS,
  MonthlyPaymentPlans,
  ContractLengthOption,
} from "../../../../sharedUtils/globalHelper/constantValues";
import {
  QuoteStatusNames,
  RenewalStatusNames,
} from "../../../../sharedUtils/globalHelper/status";

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { helperMethods } from "../../../../sharedUtils/globalHelper/helperMethod";
import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function Funeral(props) {
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
    postcode,
    Site,
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

  let funeral: any = {};
  if (service && service.funeral) {
    funeral = { ...service.funeral };
  }

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    let qu = funeral;
    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;

    if (value.funeralProvider) qu.funeralProvider = value.funeralProvider;
    if (value.name) qu.name = value.name;
    if (value.phone) qu.phone = value.phone;
    if (value.email) qu.email = value.email;
    if (value.address) qu.address = value.address;
    if (value.funeralType) qu.funeralType = value.funeralType;
    if (value.planType) qu.planType = value.planType;
    if (value.paymentType) qu.paymentType = value.paymentType;
    if (value.specialRequest) qu.specialRequest = value.specialRequest;
    if (value.PaymentPlan) qu.PaymentPlan = value.PaymentPlan;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.contract_length) qu.contract_length = value.contract_length;
    const quoteUpdate: any = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "funeral",
      service: {
        funeral: qu,
      },
    };
    if (value.CurrentSupplier) quoteUpdate.Supplier = CurrentSupplierId;

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
                  <strong>Funeral Provider</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="funeralProvider"
                      value={funeral.funeralProvider}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        funeralProvider: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.funeralProvider &&
                                props.touched.funeralProvider
                                ? "ErrorColor"
                                : ""
                            }
                            name="funeralProvider"
                            value={{
                              label: props.values.funeralProvider,
                              value: props.values.funeralProvider,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("funeralProvider", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={FuneralProviderOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                    <TableCell component="th" scope="row">
                      {funeral.funeralProvider}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="name"
                      value={funeral.name}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        name: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.name && props.touched.name
                                ? true
                                : false
                            }
                            name="name"
                            value={props.values.name}
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
                      {funeral.name}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Phone</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="phone"
                      value={funeral.phone}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        phone: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.phone && props.touched.phone
                                ? true
                                : false
                            }
                            name="phone"
                            value={props.values.phone}
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
                      {funeral.phone}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="email"
                      value={funeral.email}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        email: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.email && props.touched.email
                                ? true
                                : false
                            }
                            name="email"
                            value={props.values.email}
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
                      {funeral.email}
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
                      value={funeral.address}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        address: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.address && props.touched.address
                                ? true
                                : false
                            }
                            name="address"
                            value={props.values.address}
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
                      {funeral.address}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  {" "}
                  <strong>Funeral Type</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="funeralType"
                      value={funeral.funeralType}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        funeralType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.funeralType &&
                                props.touched.funeralType
                                ? "ErrorColor"
                                : ""
                            }
                            id="funeralType"
                            name="funeralType"
                            placeholder="Funeral Type"
                            value={{
                              label: props.values.funeralType,
                              value: props.values.funeralType,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("funeralType", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={FuneralTypes}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                    <TableCell component="th" scope="row">
                      {funeral.funeralType}
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
                      value={funeral.contract_length}
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
                      {funeral.contract_length}
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
                        Number(funeral.contract_start_date)
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
                        Number(funeral.contract_start_date)
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
                        Number(funeral.contract_end_date)
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
                        Number(funeral.contract_end_date)
                      )}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Over 50s Payment Plan</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="PaymentPlan"
                      value={funeral.PaymentPlan}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        PaymentPlan: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.PaymentPlan &&
                                props.touched.PaymentPlan
                                ? "ErrorColor"
                                : ""
                            }
                            id="PaymentPlan"
                            name="PaymentPlan"
                            placeholder="Over 50s Payment Plan"
                            value={{
                              label: props.values.PaymentPlan,
                              value: props.values.PaymentPlan,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("PaymentPlan", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={MonthlyPaymentPlans}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                    <TableCell component="th" scope="row">
                      {funeral.PaymentPlan}
                    </TableCell>
                  )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Special Request Field</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="specialRequest"
                      value={funeral.specialRequest}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        specialRequest: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.specialRequest &&
                                props.touched.specialRequest
                                ? true
                                : false
                            }
                            name="specialRequest"
                            value={props.values.specialRequest}
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
                      {funeral.specialRequest}
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