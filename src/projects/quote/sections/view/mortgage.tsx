import React, { useState } from "react";
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
  lifeInsuranceOptions,
  criticalIllnessOptions,
  homeInsuranceOptions,
  funeralPlanOptions,
  MorgageType,
  AMS,
} from "../../../../sharedUtils/globalHelper/constantValues";

import { CommonSimple as ViewSimpleConsumer } from "../../../consumer/loadable/CommonSimple";

export default function Mortgage(props) {
  const [isChecked, setIsChecked] = useState(props.currentQuote.isActive === 1);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentQuote.isDelete === 1
  );
  const [isShowConsumer, setIsShowConsumer] = React.useState(false);
  const [consumerData, setConsumerData] = React.useState({});
  const { type } = props;
  const {
    QuoteID,
    service,
    Consumer,
    quoteStatus,
    RenewalID,
    Status,
  } = props.currentQuote;

  let mortgage: any = {};
  if (service && service.mortgage) {
    mortgage = { ...service.mortgage };
  }

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const qu = mortgage;
    if (!qu.estateAgent) {
      qu.estateAgent = {};
    }
    if (!qu.solicitors) {
      qu.solicitors = {};
    }
    if (!qu.lender) {
      qu.lender = {};
    }

    if (value.isActive) qu.isActive = isChecked ? 1 : 2;
    if (value.isDelete) qu.isDelete = isDeleteCheck ? 1 : 2;
    if (value.addproperty) qu.addproperty = value.addproperty;
    if (value.morgage_type) qu.morgage_type = value.morgage_type;
    if (value.phone) qu.phone = value.phone;
    if (value.email) qu.email = value.email;
    if (value.companyName) qu.companyName = value.companyName;
    if (value.phoneNumber) qu.phoneNumber = value.phoneNumber;
    if (value.nameOfContact) qu.nameOfContact = value.nameOfContact;
    if (value.propertyValue) qu.propertyValue = value.propertyValue;
    if (value.deposit) qu.deposit = value.deposit;
    if (value.loanValue) qu.loanValue = value.loanValue;
    if (value.creditScore) qu.creditScore = value.creditScore;
    if (value.valuationDate) qu.valuationDate = value.valuationDate;
    if (value.cValuation) qu.cValuation = value.cValuation;
    if (value.dateOffer) qu.dateOffer = value.dateOffer;
    if (value.contract_exchange_date)
      qu.contract_exchange_date = value.contract_exchange_date;
    if (value.completionDate) qu.completionDate = value.completionDate;
    if (value.lifeInsurance) qu.lifeInsurance = value.lifeInsurance;
    if (value.criticalIllness) qu.criticalIllness = value.criticalIllness;
    if (value.homeInsurance) qu.homeInsurance = value.homeInsurance;
    if (value.funeralPlan) qu.funeralPlan = value.funeralPlan;
    if (value.EAcompanyName) qu.estateAgent.EAcompanyName = value.EAcompanyName;
    if (value.EAphoneNumber) qu.estateAgent.EAphoneNumber = value.EAphoneNumber;
    if (value.EAemail) qu.estateAgent.EAemail = value.EAemail;
    if (value.EAnameOfContact)
      qu.estateAgent.EAnameOfContact = value.EAnameOfContact;
    if (value.ScompanyName) qu.solicitors.ScompanyName = value.ScompanyName;
    if (value.SphoneNumber) qu.solicitors.SphoneNumber = value.SphoneNumber;
    if (value.Semail) qu.solicitors.Semail = value.Semail;
    if (value.SnameOfContact)
      qu.solicitors.SnameOfContact = value.SnameOfContact;
    if (value.LcompanyName) qu.lender.LcompanyName = value.LcompanyName;
    if (value.LphoneNumber) qu.lender.LphoneNumber = value.LphoneNumber;
    if (value.Lemail) qu.lender.Lemail = value.Lemail;
    if (value.LnameOfContact) qu.lender.LnameOfContact = value.LnameOfContact;
    if (value.contract_start_date)
      qu.contract_start_date = value.contract_start_date;
    if (value.contract_end_date) qu.contract_end_date = value.contract_end_date;
    if (value.contract_length) qu.contract_length = value.contract_length;
    const quoteUpdate = {
      quoteId: props.currentQuote._id,
      serviceTypeName: "mortgage",
      service: {
        mortgage: qu,
      },
    };

    props._isLoadingData(true, props.type);
    props._editQuote(quoteUpdate, props.type);
    if (props.type === "quote") {
      //  props.toast("Quote edited Successfully");
    } else {
      //     props.toast("Renewal edited Successfully");
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
                  <strong>Address of Property</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="addproperty"
                      value={mortgage.addproperty}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        addproperty: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.addproperty &&
                              props.touched.addproperty
                            }
                            name="addproperty"
                            value={props.values.addproperty}
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
                    {mortgage.addproperty}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Type of Mortgage</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="morgage_type"
                      value={mortgage.morgage_type}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        morgage_type: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.morgage_type &&
                                props.touched.morgage_type
                                ? "ErrorColor"
                                : ""
                            }
                            id="morgage_type"
                            name="morgage_type"
                            placeholder="Type of Mortgage"
                            value={{
                              label: props.values.morgage_type,
                              value: props.values.morgage_type,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("morgage_type", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={MorgageType}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mortgage.morgage_type}
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
                      value={mortgage.phone}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        phone: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={props.errors.phone && props.touched.phone}
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
                    {mortgage.phone}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Estate Agents Company Name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EAcompanyName"
                      value={
                        mortgage.estateAgent !== undefined &&
                        mortgage.estateAgent.EAcompanyName
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EAcompanyName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EAcompanyName &&
                              props.touched.EAcompanyName
                            }
                            name="EAcompanyName"
                            value={props.values.EAcompanyName}
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
                    {mortgage.estateAgent !== undefined &&
                      mortgage.estateAgent.EAcompanyName}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Estate Agents Phone Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EAphoneNumber"
                      value={
                        mortgage.estateAgent !== undefined &&
                        mortgage.estateAgent.EAphoneNumber
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EAphoneNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EAphoneNumber &&
                              props.touched.EAphoneNumber
                            }
                            name="EAphoneNumber"
                            value={props.values.EAphoneNumber}
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
                    {mortgage.estateAgent !== undefined &&
                      mortgage.estateAgent.EAphoneNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Estate Agents Email</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EAemail"
                      value={
                        mortgage.estateAgent !== undefined &&
                        mortgage.estateAgent.EAemail
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EAemail: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EAemail && props.touched.EAemail
                            }
                            name="EAemail"
                            value={props.values.EAemail}
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
                    {mortgage.estateAgent !== undefined &&
                      mortgage.estateAgent.EAemail}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Estate Agents Name of Contact</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="EAnameOfContact"
                      value={
                        mortgage.estateAgent !== undefined &&
                        mortgage.estateAgent.EAnameOfContact
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        EAnameOfContact: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.EAnameOfContact &&
                              props.touched.EAnameOfContact
                            }
                            name="EAnameOfContact"
                            value={props.values.EAnameOfContact}
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
                    {mortgage.estateAgent !== undefined &&
                      mortgage.estateAgent.EAnameOfContact}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Solicitors Company Name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ScompanyName"
                      value={
                        mortgage.solicitors !== undefined &&
                        mortgage.solicitors.ScompanyName
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ScompanyName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.ScompanyName &&
                              props.touched.ScompanyName
                            }
                            name="ScompanyName"
                            value={props.values.ScompanyName}
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
                    {mortgage.solicitors !== undefined &&
                      mortgage.solicitors.ScompanyName}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Solicitors Phone Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="SphoneNumber"
                      value={
                        mortgage.solicitors !== undefined &&
                        mortgage.solicitors.SphoneNumber
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        SphoneNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.SphoneNumber &&
                              props.touched.SphoneNumber
                            }
                            name="SphoneNumber"
                            value={props.values.SphoneNumber}
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
                    {mortgage.solicitors !== undefined &&
                      mortgage.solicitors.SphoneNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Solicitors Email</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Semail"
                      value={
                        mortgage.solicitors !== undefined &&
                        mortgage.solicitors.Semail
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Semail: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={props.errors.Semail && props.touched.Semail}
                            name="Semail"
                            value={props.values.Semail}
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
                    {mortgage.solicitors !== undefined &&
                      mortgage.solicitors.Semail}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Solicitors Name of Contact</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="SnameOfContact"
                      value={
                        mortgage.solicitors !== undefined &&
                        mortgage.solicitors.SnameOfContact
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        SnameOfContact: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.SnameOfContact &&
                              props.touched.SnameOfContact
                            }
                            name="SnameOfContact"
                            value={props.values.SnameOfContact}
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
                    {mortgage.solicitors !== undefined &&
                      mortgage.solicitors.SnameOfContact}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Lender Company Name</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="LcompanyName"
                      value={
                        mortgage.lender !== undefined &&
                        mortgage.lender.LcompanyName
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        LcompanyName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.LcompanyName &&
                              props.touched.LcompanyName
                            }
                            name="LcompanyName"
                            value={props.values.LcompanyName}
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
                    {mortgage.lender !== undefined &&
                      mortgage.lender.LcompanyName}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Lender Phone Number</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="LphoneNumber"
                      value={
                        mortgage.lender !== undefined &&
                        mortgage.lender.LphoneNumber
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        LphoneNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.LphoneNumber &&
                              props.touched.LphoneNumber
                            }
                            name="LphoneNumber"
                            value={props.values.LphoneNumber}
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
                    {mortgage.lender !== undefined &&
                      mortgage.lender.LphoneNumber}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Lender Email</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Lemail"
                      value={
                        mortgage.lender !== undefined && mortgage.lender.Lemail
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Lemail: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={props.errors.Lemail && props.touched.Lemail}
                            name="Lemail"
                            value={props.values.Lemail}
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
                    {mortgage.lender !== undefined && mortgage.lender.Lemail}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Lender Name of Contact</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="LnameOfContact"
                      value={
                        mortgage.lender !== undefined &&
                        mortgage.lender.LnameOfContact
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        LnameOfContact: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.LnameOfContact &&
                              props.touched.LnameOfContact
                            }
                            name="LnameOfContact"
                            value={props.values.LnameOfContact}
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
                    {mortgage.lender !== undefined &&
                      mortgage.lender.LnameOfContact}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Value of Property</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="propertyValue"
                      value={mortgage.propertyValue}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        propertyValue: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.propertyValue &&
                              props.touched.propertyValue
                            }
                            name="propertyValue"
                            value={props.values.propertyValue}
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
                    {mortgage.propertyValue}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Available Deposit</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="deposit"
                      value={mortgage.deposit}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        deposit: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.deposit && props.touched.deposit
                            }
                            name="deposit"
                            value={props.values.deposit}
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
                    {mortgage.deposit}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Loan to Value</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="loanValue"
                      value={mortgage.loanValue}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        loanValue: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.loanValue && props.touched.loanValue
                            }
                            name="loanValue"
                            value={props.values.loanValue}
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
                    {mortgage.loanValue}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Credit Score</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="creditScore"
                      value={mortgage.creditScore}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        creditScore: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.creditScore &&
                              props.touched.creditScore
                            }
                            name="creditScore"
                            value={props.values.creditScore}
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
                    {mortgage.creditScore}
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
                      value={mortgage.contract_length}
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
                            options={[]}
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
                    {mortgage.contract_length}
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
                        Number(mortgage.contract_start_date)
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
                      Number(mortgage.contract_start_date)
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
                        Number(mortgage.contract_end_date)
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
                      Number(mortgage.contract_end_date)
                    )}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Valuation Date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="valuationDate"
                      value={helperMethods.ConvertDate(mortgage.valuationDate)}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        valuationDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                variant="dialog"
                                inputVariant="outlined"
                                error={
                                  props.errors.valuationDate &&
                                  props.touched.valuationDate
                                }
                                margin="normal"
                                id="valuationDate"
                                allowKeyboardControl
                                className="WidhtFull100"
                                format="dd/MM/yyyy"
                                value={
                                  props.values.valuationDate
                                    ? props.values.valuationDate
                                    : null
                                }
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "valuationDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="valuationDate-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(mortgage.valuationDate)}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Confirmed Valuation Value</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="cValuation"
                      value={mortgage.cValuation}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        cValuation: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.cValuation &&
                              props.touched.cValuation
                            }
                            name="cValuation"
                            value={props.values.cValuation}
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
                    {mortgage.cValuation}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Date of Offer</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="dateOffer"
                      value={helperMethods.ConvertDate(mortgage.dateOffer)}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        dateOffer: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                variant="dialog"
                                inputVariant="outlined"
                                error={
                                  props.errors.dateOffer &&
                                  props.touched.dateOffer
                                }
                                margin="normal"
                                id="dateOffer"
                                label="Date of Offer"
                                allowKeyboardControl
                                className="WidhtFull100"
                                format="dd/MM/yyyy"
                                value={
                                  props.values.dateOffer
                                    ? props.values.dateOffer
                                    : null
                                }
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "dateOffer",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="dateOffer-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(mortgage.dateOffer)}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Completion Date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="completionDate"
                      value={helperMethods.ConvertDate(mortgage.completionDate)}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        completionDate: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                variant="dialog"
                                inputVariant="outlined"
                                error={
                                  props.errors.completionDate &&
                                  props.touched.completionDate
                                }
                                margin="normal"
                                id="completionDate"
                                label="Completion Date"
                                allowKeyboardControl
                                className="WidhtFull100"
                                format="dd/MM/yyyy"
                                value={
                                  props.values.completionDate
                                    ? props.values.completionDate
                                    : null
                                }
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "completionDate",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="completionDate-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(mortgage.completionDate)}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contract Exchange Date</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="contract_exchange_date"
                      value={helperMethods.ConvertDate(
                        mortgage.contract_exchange_date
                      )}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        contract_exchange_date: Yup.string().required(
                          "Required"
                        ),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                variant="dialog"
                                inputVariant="outlined"
                                error={
                                  props.errors.contract_exchange_date &&
                                  props.touched.contract_exchange_date
                                }
                                margin="normal"
                                id="contract_exchange_date"
                                label="Contract Exchange Date"
                                allowKeyboardControl
                                className="WidhtFull100"
                                format="dd/MM/yyyy"
                                value={
                                  props.values.contract_exchange_date
                                    ? props.values.contract_exchange_date
                                    : null
                                }
                                onChange={(e) =>
                                  props.setFieldValue(
                                    "contract_exchange_date",
                                    Number(new Date(e).getTime())
                                  )
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="contract_exchange_date-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {helperMethods.ConvertDate(mortgage.contract_exchange_date)}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Life Insurance</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="lifeInsurance"
                      value={mortgage.lifeInsurance}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        lifeInsurance: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.lifeInsurance &&
                                props.touched.lifeInsurance
                                ? "ErrorColor"
                                : ""
                            }
                            name="lifeInsurance"
                            placeholder="Life Insurance"
                            value={{
                              label: props.values.lifeInsurance,
                              value: props.values.lifeInsurance,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("lifeInsurance", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={lifeInsuranceOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mortgage.lifeInsurance}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Critical Illness</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="criticalIllness"
                      value={mortgage.criticalIllness}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        criticalIllness: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.criticalIllness &&
                                props.touched.criticalIllness
                                ? "ErrorColor"
                                : ""
                            }
                            name="criticalIllness"
                            placeholder="Critical Illness"
                            value={{
                              label: props.values.criticalIllness,
                              value: props.values.criticalIllness,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("criticalIllness", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={criticalIllnessOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mortgage.criticalIllness}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Home Insurance and Contents</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="homeInsurance"
                      value={mortgage.homeInsurance}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        homeInsurance: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.homeInsurance &&
                                props.touched.homeInsurance
                                ? "ErrorColor"
                                : ""
                            }
                            name="homeInsurance"
                            value={{
                              label: props.values.homeInsurance,
                              value: props.values.homeInsurance,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("homeInsurance", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={homeInsuranceOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mortgage.homeInsurance}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Funeral Plan</strong>
                </TableCell>
                {AMS.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="funeralPlan"
                      value={mortgage.funeralPlan}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        funeralPlan: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.funeralPlan &&
                                props.touched.funeralPlan
                                ? "ErrorColor"
                                : ""
                            }
                            name="funeralPlan"
                            value={{
                              label: props.values.funeralPlan,
                              value: props.values.funeralPlan,
                            }}
                            onChange={(e) => {
                              props.setFieldValue("funeralPlan", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="role-number-error"
                            options={funeralPlanOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mortgage.funeralPlan}
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