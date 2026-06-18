import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DropzoneArea } from "material-ui-dropzone";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  ContractLengthOption,
  contractLengthConvertInMonths,
} from "../../../sharedUtils/globalHelper/constantValues";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import {
  RenewalStatusNames,
} from "../../../sharedUtils/globalHelper/status";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  TypoSpace: {
    marginBottom: 25,
  },
  PaddingSpace: {
    padding: "10px",
  },
}));

function ServiceWiseFields(props) {
  // console.log("serviceWise fields comp", props);
  switch (props.serviceType.toLowerCase()) {
    case "water":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Core spid rates</strong>
            </TableCell>
            <TableCell>{props.service["water"].CoreSpidRates}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Sewage Spid</strong>
            </TableCell>
            <TableCell>{props.service["water"].SewageSpid}</TableCell>
          </TableRow>
        </>
      );
    case "gas":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Standing Charge</strong>
            </TableCell>
            <TableCell>{props.service["gas"].dailyCharges}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Unit Rate</strong>
            </TableCell>
            <TableCell>{props.service["gas"].unitRate}</TableCell>
          </TableRow>
        </>
      );
    case "electric":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Standing Charge</strong>
            </TableCell>
            <TableCell>{props.service["electric"].dailyCharges}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Unit Day Rate</strong>
            </TableCell>
            <TableCell>{props.service["electric"].unitDayRate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Unit Night Rate</strong>
            </TableCell>
            <TableCell>{props.service["electric"].unitNightRate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Eve/Wkd Rate</strong>
            </TableCell>
            <TableCell>{props.service["electric"].unitWkdRate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Winter Rate</strong>
            </TableCell>
            <TableCell>{props.service["electric"].unitWinterRate}</TableCell>
          </TableRow>
        </>
      );
    case "chipandpin":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Package</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].Package}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Deployment Cost</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].DeploymentCost}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Analytics cost</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].AnalyticsCost}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Credit card rates</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].CreditCardRate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Debit card rates</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].DebitCardRate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Business card rates</strong>
            </TableCell>
            <TableCell>
              {props.service["chipAndPin"].BusinessCardRate}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Authorization fee</strong>
            </TableCell>
            <TableCell>
              {props.service["chipAndPin"].AuthorizationFee}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>PCI DSS charge</strong>
            </TableCell>
            <TableCell>{props.service["chipAndPin"].PCIDSSCharge}</TableCell>
          </TableRow>
        </>
      );
    case "telecoms":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Cash Amount</strong>
            </TableCell>
            <TableCell>{props.service["telecoms"].CashAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Line rental and Packages</strong>
            </TableCell>
            <TableCell>{props.service["telecoms"].LineRental}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Connection charges</strong>
            </TableCell>
            <TableCell>{props.service["telecoms"].ConnectionCharges}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Plus option to add extras</strong>
            </TableCell>
            <TableCell>{props.service["telecoms"].AddExtras}</TableCell>
          </TableRow>
        </>
      );
    case "broadband":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Broadband rental</strong>
            </TableCell>
            <TableCell>{props.service["broadband"].Rental}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Connection charges</strong>
            </TableCell>
            <TableCell>
              {props.service["broadband"].ConnectionCharges}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Router price</strong>
            </TableCell>
            <TableCell>{props.service["broadband"].RouterPrice}</TableCell>
          </TableRow>
        </>
      );
    case "waste":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Charge per lift</strong>
            </TableCell>
            <TableCell>{props.service["waste"].chargePerLift}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Daily rental</strong>
            </TableCell>
            <TableCell>{props.service["waste"].dailyRental}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Delivery Charge</strong>
            </TableCell>
            <TableCell>{props.service["waste"].deliveryCharge}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>WTN Complaince Charge</strong>
            </TableCell>
            <TableCell>
              {props.service["waste"].WasteTransferNoteComplainceCharge}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Total monthly cost</strong>
            </TableCell>
            <TableCell>{props.service["waste"].totalMonthlyCost}</TableCell>
          </TableRow>
        </>
      );
    case "insurance":
      return <></>;
    case "businessrates":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Current Rateable value (GDP Pound)</strong>
            </TableCell>
            <TableCell>
              {props.service["businessrates"].currentRateableValue}
            </TableCell>
          </TableRow>
        </>
      );
    case "energy":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Current Tariff</strong>
            </TableCell>
            <TableCell>{props.service["energy"].currentTariff}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>New Supplier Tariff</strong>
            </TableCell>
            <TableCell>{props.service["energy"].newTariff}</TableCell>
          </TableRow>
        </>
      );
    case "funeral":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Over 50s Payment Plan</strong>
            </TableCell>
            <TableCell>{props.service["funeral"].PaymentPlan}</TableCell>
          </TableRow>
        </>
      );
    case "mortgage":
      return (
        <>
          <TableRow>
            <TableCell>
              <strong>Value of Property</strong>
            </TableCell>
            <TableCell>{props.service["mortgage"].propertyValue}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Available Deposit</strong>
            </TableCell>
            <TableCell>{props.service["mortgage"].deposit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Loan to Value</strong>
            </TableCell>
            <TableCell>{props.service["mortgage"].loanValue}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Credit Score</strong>
            </TableCell>
            <TableCell>{props.service["mortgage"].creditScore}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Confirmed Valuation Value</strong>
            </TableCell>
            <TableCell>{props.service["mortgage"].cValuation}</TableCell>
          </TableRow>
        </>
      );
    case "debt":
      return <></>;
    case "telecomandbroadband":
      return <></>;
  }
}
export default function RenewalActions(props) {
  const renewalState = useSelector(selectRenewalState);

  const { currentQuote, isActionDone } = {
    ...renewalState,
  };
  const dispatch = useDispatch();

  const _isActionDone = (payload) =>
    dispatch(renewalAction.isActionDone(payload));
  const _quoteActions = (payload, action) =>
    dispatch(renewalAction.renewalAction({ data: payload, action: action }));

  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);
  const [thisActionStatus, setThisActionStatus] = useState(0);
  const [fileUpload, setFileUpload] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [currentExpiryDate, setCurrentExpiryDate] = useState(
    currentQuote.expiryDate
  );

  useEffect(() => {
    if (isActionDone && startLoader) {
      _isActionDone(false);
      dispatch(globalConfigActions.enableFeedback(currentAction));
      setStartLoader(false);
    }
  }, [isActionDone, startLoader, currentQuote.expiryDate]);
  let initObj: any = {};
  let service = null;
  if (
    renewalState.currentQuote?.service &&
    renewalState.currentQuote?.serviceType && renewalState.currentQuote.serviceType !== "ChipAndPin" &&
    renewalState.currentQuote?.service[renewalState.currentQuote.serviceType.toLowerCase()]
  ) {
    service =
      renewalState.currentQuote?.service[renewalState.currentQuote.serviceType.toLowerCase()];
  }
  if (
    renewalState.currentQuote?.service &&
    renewalState.currentQuote?.serviceType && renewalState.currentQuote.serviceType == "ChipAndPin" &&
    renewalState.currentQuote?.service["chipAndPin"]
  ) {
    service =
      renewalState.currentQuote?.service["chipAndPin"];
  }
  // renewalState.currentQuote.service[
  // Object.keys(renewalState.currentQuote.service)[0]
  // ];

  ContractLengthOption.forEach((cl) => {
    if (
      (cl.label == service.contract_length ||
        cl.value == service.contract_length) &&
      !initObj.label
    ) {
      initObj = cl;
    }
  });
  const quoteAccepted = () => {
    const negotiation: any = {};
    const CQ = currentQuote;
    const quoteId = CQ._id;
    negotiation.RenewalID = quoteId;
    negotiation.Status = 1002;
    if (CQ.Company !== undefined)
      negotiation.CompanyID = CQ.Company !== undefined ? CQ.Company._id : "";
    if (CQ.Consumer !== undefined)
      negotiation.ConsumerID = CQ.Consumer !== undefined ? CQ.Consumer._id : "";
    negotiation.contractLengthDate = new Date(
      new Date().setMonth(
        new Date().getMonth() + contractLengthConvertInMonths[CQ.contractLength]
      )
    ).getTime();
    negotiation.contractAcceptDate = new Date().getTime();
    negotiation.ContractLength = CQ.contractLength;
    negotiation.ExpiryDate = Number(CQ.expiryDate);
    negotiation.Amount = CQ.Price;
    negotiation.EmailType = "AcceptRenewalProvided";
    setCurrentAction("Renewal accepted successfully");
    setStartLoader(true);
    _quoteActions(negotiation, 1002);
  };

  const QuoteStatus = currentQuote.Status;

  const { Price, notes, contractLength, expiryDate } = currentQuote;

  return (
    <Grid container spacing={3} className={classes.Spacing}>
      <Grid item xs={12} md={12}>
        <TableContainer component={Paper} className={classes.Spacing}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  {RenewalStatusNames[renewalState.currentQuote.Status]}
                </TableCell>
              </TableRow>
              {renewalState.currentQuote.Status != "1000" ? (
                <TableRow>
                  <TableCell>
                    <strong>Preferred Contract Length</strong>
                  </TableCell>
                  <TableCell>
                    {renewalState.currentQuote.contractLength}
                  </TableCell>
                </TableRow>
              ) : null}
              {renewalState.currentQuote.Status != "1000" ? (
                <TableRow>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>{renewalState.currentQuote.Price}</TableCell>
                </TableRow>
              ) : null}
              {renewalState.currentQuote.Status != "1000" ? (
                <TableRow>
                  <TableCell>
                    <strong>Renewal Expiry Date</strong>
                  </TableCell>
                  <TableCell>
                    {helperMethods.ConvertDate(
                      Number(renewalState.currentQuote.expiryDate)
                    )}
                  </TableCell>
                </TableRow>
              ) : null}
              {renewalState.currentQuote.Status != "1000" ? (
                <TableRow>
                  <TableCell>
                    <strong>Generated Amount</strong>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ) : null}
              <ServiceWiseFields {...renewalState.currentQuote} />
            </TableBody>
          </Table>
        </TableContainer>
        {/* PROVIDE RENEWAL */}
        {["1000"].includes(QuoteStatus) &&
          ["admin", "management"].includes(props.slug) && (
            <React.Fragment>
              <Paper style={{ marginTop: 35 }}>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12} className={classes.PaddingSpace}>
                    <Formik
                      initialValues={{
                        ContractLength: initObj,
                        ExpiryDate: "",
                        Amount: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = currentQuote;
                        const quoteId = CQ._id;
                        negotiation.ContractLength =
                          values.ContractLength.value;
                        negotiation.ExpiryDate = new Date(
                          values.ExpiryDate
                        ).getTime();
                        negotiation.Amount = values.Amount;
                        negotiation.Notes = values.Notes;
                        negotiation.RenewalID = quoteId;
                        if (CQ.Company !== undefined)
                          negotiation.CompanyID =
                            CQ.Company !== undefined ? CQ.Company._id : "";
                        if (CQ.Consumer !== undefined)
                          negotiation.ConsumerID =
                            CQ.Consumer !== undefined ? CQ.Consumer._id : "";
                        negotiation.IntroducerID =
                          CQ.User !== undefined
                            ? helperMethods.findIntroducerID(CQ.User)
                            : "";
                        negotiation.Status = Number(CQ.Status);
                        negotiation.serviceType = CQ.serviceType;

                        if (Number(CQ.Status) === 1000) {
                          negotiation.EmailType = "RenewalProvided";
                        } else {
                          negotiation.EmailType = "RevisedRenewal";
                        }
                        setStartLoader(true);
                        setCurrentAction(
                          `Renewal ${Number(CQ.Status) === 1000 ? "provided" : "revised"
                          } successfully`
                        );
                        _quoteActions({ negotiation }, 1001);
                      }}
                      validationSchema={Yup.object().shape({
                        ContractLength: Yup.string().required(
                          "Contract Length is required"
                        ),
                        Amount: Yup.string().required("Amount is required"),
                        ExpiryDate: Yup.string().required(
                          "ExpiryDate is required"
                        ),
                        Notes: Yup.string().required("Notes is required"),
                      })}
                    >
                      {(props) => {
                        const {
                          values,
                          touched,
                          errors,
                          dirty,
                          isSubmitting,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          handleReset,
                          setFieldValue,
                        } = props;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12}>
                                <Select
                                  error={
                                    errors.ContractLength &&
                                      touched.ContractLength
                                      ? true
                                      : false
                                  }
                                  id="ContractLength"
                                  className="WidhtFull100"
                                  placeholder="Preferred Contract Length"
                                  value={values.ContractLength}
                                  onChange={(e) => {
                                    setFieldValue("ContractLength", e);
                                  }}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="ContractLength-number-error"
                                  name="ContractLength"
                                  options={ContractLengthOption}
                                />
                                {errors.ContractLength &&
                                  touched.ContractLength && (
                                    <FormHelperText
                                      className="errormsg"
                                      id="ContractLength-error"
                                    >
                                      {errors.ContractLength}
                                    </FormHelperText>
                                  )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      error={
                                        errors.ExpiryDate && touched.ExpiryDate
                                          ? true
                                          : false
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Renewal Expiry Date"
                                      allowKeyboardControl
                                      format="dd/MM/yyyy"
                                      inputVariant="outlined"
                                      value={
                                        values.ExpiryDate
                                          ? values.ExpiryDate
                                          : null
                                      }
                                      onChange={(e) =>
                                        setFieldValue("ExpiryDate", e)
                                      }
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                      aria-describedby="ExpiryDate-number-error"
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                                {errors.ExpiryDate && touched.ExpiryDate && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="ExpiryDate-error"
                                  >
                                    {errors.ExpiryDate}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Amount && touched.Amount
                                      ? true
                                      : false
                                  }
                                  id="Amount"
                                  className="WidhtFull100"
                                  label="Enter Amount"
                                  type="number"
                                  value={values.Amount}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Amount-error"
                                />
                                {errors.Amount && touched.Amount && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Amount-error"
                                  >
                                    {errors.Amount}
                                  </FormHelperText>
                                )}
                              </Grid>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Notes && touched.Notes ? true : false
                                  }
                                  id="Notes"
                                  className="WidhtFull100"
                                  label="Notes"
                                  value={values.Notes}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Notes-error"
                                  multiline
                                />
                                {errors.Notes && touched.Notes && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Notes-error"
                                  >
                                    {errors.Notes}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>
                            <CardActions
                              style={{
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 20,
                              }}
                            >
                              <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                type="submit"
                              // disabled={isSubmitting}
                              >
                                {Number(QuoteStatus) === 1000
                                  ? "Provide "
                                  : "Revise "}
                                Renewal
                              </Button>{" "}
                              {startLoader && <CircularProgress />}
                            </CardActions>
                          </form>
                        );
                      }}
                    </Formik>
                  </Grid>
                </Grid>
              </Paper>
            </React.Fragment>
          )}

        {/* REVISE Renewal */}
        {["1003"].includes(QuoteStatus) &&
          ["admin", "management"].includes(props.slug) && (
            <React.Fragment >

              <Paper style={{ marginTop: 35 }}>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12}>
                    <Formik
                      initialValues={{
                        ContractLength: null,
                        ExpiryDate: "",
                        Amount: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = currentQuote;
                        const quoteId = CQ._id;
                        if (values.ContractLength) {
                          negotiation.ContractLength =
                            values.ContractLength.value;
                        } else {
                          negotiation.ContractLength = CQ.contractLength;
                        }
                        negotiation.ExpiryDate = currentExpiryDate;
                        if (values.Amount) {
                          negotiation.Amount = values.Amount;
                        } else {
                          negotiation.Amount = CQ.Price;
                        }
                        if (values.Notes) {
                          negotiation.Notes = values.Notes;
                        } else {
                          negotiation.Notes = CQ.notes;
                        }

                        negotiation.RenewalID = quoteId;
                        if (CQ.Company !== undefined)
                          negotiation.CompanyID =
                            CQ.Company !== undefined ? CQ.Company._id : "";
                        if (CQ.Consumer !== undefined)
                          negotiation.ConsumerID =
                            CQ.Consumer !== undefined ? CQ.Consumer._id : "";
                        negotiation.Status = 1005;
                        negotiation.serviceType = CQ.serviceType;
                        negotiation.EmailType = "RevisedRenewal";
                        setStartLoader(true);
                        setCurrentAction(`Revised renewal successfully`);
                        _quoteActions({ negotiation }, 1001);
                      }}
                    // validationSchema={{}}
                    >
                      {(props) => {
                        const {
                          values,
                          touched,
                          errors,
                          dirty,
                          isSubmitting,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          handleReset,
                          setFieldValue,
                        } = props;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12}>
                                <Select
                                  error={
                                    errors.ContractLength &&
                                      touched.ContractLength
                                      ? true
                                      : false
                                  }
                                  id="ContractLength"
                                  className="WidhtFull100"
                                  placeholder="Preferred Contract Length"
                                  defaultValue={{
                                    label: contractLength,
                                    value: contractLength,
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("ContractLength", e);
                                  }}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="ContractLength-number-error"
                                  name="ContractLength"
                                  options={ContractLengthOption}
                                  classNamePrefix="select"
                                />
                                {errors.ContractLength &&
                                  touched.ContractLength && (
                                    <FormHelperText
                                      className="errormsg"
                                      id="ContractLength-error"
                                    >
                                      {errors.ContractLength}
                                    </FormHelperText>
                                  )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      error={
                                        errors.ExpiryDate && touched.ExpiryDate
                                          ? true
                                          : false
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Renewal Expiry Date"
                                      allowKeyboardControl
                                      inputVariant="outlined"
                                      format="dd/MM/yyyy"
                                      value={
                                        currentQuote.expiryDate
                                          ? helperMethods.MillisecondsToDate_NewOne(
                                            currentQuote.expiryDate
                                          )
                                          : null
                                      }
                                      onChange={(e) => {
                                        setCurrentExpiryDate(
                                          new Date(e).getTime()
                                        );
                                      }}
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                      aria-describedby="ExpiryDate-number-error"
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                                {errors.ExpiryDate && touched.ExpiryDate && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="ExpiryDate-error"
                                  >
                                    {errors.ExpiryDate}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Amount && touched.Amount
                                      ? true
                                      : false
                                  }
                                  id="Amount"
                                  className="WidhtFull100"
                                  label="Enter Amount"
                                  type="number"
                                  name="Amount"
                                  // value={values.Amount}
                                  defaultValue={Price}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Amount-error"
                                />
                                {errors.Amount && touched.Amount && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Amount-error"
                                  >
                                    {errors.Amount}
                                  </FormHelperText>
                                )}
                              </Grid>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Notes && touched.Notes ? true : false
                                  }
                                  id="Notes"
                                  className="WidhtFull100"
                                  label="Notes"
                                  name="Notes"
                                  defaultValue={notes}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Notes-error"
                                  multiline
                                />
                                {errors.Notes && touched.Notes && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Notes-error"
                                  >
                                    {errors.Notes}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>
                            <CardActions
                              style={{
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 20,
                              }}
                            >
                              <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                type="submit"
                              // disabled={isSubmitting}
                              >
                                Revise Renewal
                              </Button>{" "}
                              {startLoader && <CircularProgress />}
                            </CardActions>
                          </form>
                        );
                      }}
                    </Formik>
                  </Grid>
                </Grid>
              </Paper>
            </React.Fragment>
          )}

        {/* ACCEPT/REJECT/DND */}
        {["1001", "1005", "1012"].includes(QuoteStatus) && (
          <Paper style={{ marginTop: 35 }}>
            <Grid container spacing={3} className={classes.PaddingSpace}>
              <Grid item xs={12} md={12}></Grid>
            </Grid>
            <Grid container spacing={3} className={classes.PaddingSpace}>
              <Grid item xs={12} md={12}>
                <Formik
                  initialValues={{
                    Notes: "",
                  }}
                  onSubmit={(values) => {
                    const negotiation: any = {};
                    const CQ = currentQuote;
                    const quoteId = CQ._id;
                    const mailTempArray = {
                      1002: "PendingSupplierConfirmation",
                      1003: "RejectRenewalProvided",
                      1009: "DNDRenewalProvidedToMgt",
                    };

                    const toasterMessage = {
                      1002: "Renewal pending supplier confirmation provided",
                      1003: "Renewal rejected successfully",
                      1009: "Renewal DND successfully",
                    };

                    negotiation.RenewalID = quoteId;
                    if (Number(thisActionStatus) === 1002) {
                      negotiation.Status = 1011;
                    } else {
                      negotiation.Status = thisActionStatus;
                    }

                    if (CQ.Company !== undefined)
                      negotiation.CompanyID =
                        CQ.Company !== undefined ? CQ.Company._id : "";
                    if (CQ.Consumer !== undefined)
                      negotiation.ConsumerID =
                        CQ.Consumer !== undefined ? CQ.Consumer._id : "";
                    negotiation.IntroducerID =
                      CQ.User !== undefined
                        ? helperMethods.findIntroducerID(CQ.User)
                        : "";
                    negotiation.contractLengthDate = new Date(
                      new Date().setMonth(
                        new Date().getMonth() +
                        contractLengthConvertInMonths[CQ.contractLength]
                      )
                    ).getTime();
                    negotiation.contractAcceptDate = new Date().getTime();
                    negotiation.ContractLength = CQ.contractLength;
                    if (CQ.expiryDate)
                      negotiation.ExpiryDate = Number(CQ.expiryDate);
                    negotiation.Amount = CQ.Price;
                    negotiation.notes = values.Notes;
                    negotiation.Notes = values.Notes;
                    negotiation.EmailType = mailTempArray[thisActionStatus];
                    setStartLoader(true);
                    setCurrentAction(`${toasterMessage[thisActionStatus]}`);
                    _quoteActions(negotiation, 1002);
                  }}
                  validationSchema={Yup.object().shape({
                    Notes: Yup.string().required("Notes is required"),
                  })}
                >
                  {(props) => {
                    const {
                      values,
                      touched,
                      errors,
                      dirty,
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      handleReset,
                      setFieldValue,
                    } = props;

                    return (
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid item md={12} sm={6}>
                            <TextField
                              variant="outlined"
                              error={
                                errors.Notes && touched.Notes ? true : false
                              }
                              id="Notes"
                              className="WidhtFull100"
                              label="Notes"
                              value={values.Notes}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              rows={4}
                              aria-describedby="Notes-error"
                              multiline
                            />
                            {errors.Notes && touched.Notes && (
                              <FormHelperText
                                className="errormsg"
                                id="Notes-error"
                              >
                                {errors.Notes}
                              </FormHelperText>
                            )}
                          </Grid>
                        </Grid>
                        <CardActions
                          style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            marginTop: 20,
                          }}
                        >
                          <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            onClick={() => setThisActionStatus(1002)}
                            value="1002"
                          >
                            Accept
                          </Button>
                          <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            value="1003"
                            onClick={() => setThisActionStatus(1003)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            type="submit"
                            value="1009"
                            disabled={isSubmitting}
                            onClick={() => setThisActionStatus(1009)}
                          >
                            DND
                          </Button>{" "}
                          {startLoader && <CircularProgress />}
                        </CardActions>
                      </form>
                    );
                  }}
                </Formik>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* REVISED SUPPLIERS RATES */}
        {["1011"].includes(QuoteStatus) &&
          ["admin", "management"].includes(props.slug) && (
            <React.Fragment>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={() => quoteAccepted()}
                style={{ marginBottom: "30px", marginTop: "20" }}
              >
                Confirm Rates
              </Button>

              <Paper style={{ marginTop: 35 }}>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12}>
                    <Formik
                      initialValues={{
                        ContractLength: null,
                        ExpiryDate: currentQuote.expiryDate
                          ? currentQuote.expiryDate
                          : null,
                        Amount: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = currentQuote;
                        const quoteId = CQ._id;
                        if (values.ContractLength) {
                          negotiation.ContractLength =
                            values.ContractLength.value;
                        } else {
                          negotiation.ContractLength = CQ.contractLength;
                        }
                        // negotiation.ExpiryDate = currentExpiryDate;
                        negotiation.ExpiryDate = values.ExpiryDate;
                        if (values.Amount) {
                          negotiation.Amount = values.Amount;
                        } else {
                          negotiation.Amount = CQ.Price;
                        }
                        if (values.Notes) {
                          negotiation.Notes = values.Notes;
                        } else {
                          negotiation.Notes = CQ.notes;
                        }

                        negotiation.RenewalID = quoteId;
                        if (CQ.Company !== undefined)
                          negotiation.CompanyID =
                            CQ.Company !== undefined ? CQ.Company._id : "";
                        if (CQ.Consumer !== undefined)
                          negotiation.ConsumerID =
                            CQ.Consumer !== undefined ? CQ.Consumer._id : "";
                        negotiation.Status = 1012;
                        negotiation.EmailType = "RenewalRevisedSupplierRate";
                        negotiation.serviceType = CQ.serviceType;
                        setStartLoader(true);
                        setCurrentAction(
                          `Revised supplier rates provided successfully`
                        );
                        _quoteActions({ negotiation }, 1012);
                      }}
                    // validationSchema={{}}
                    >
                      {(props) => {
                        const {
                          values,
                          touched,
                          errors,
                          dirty,
                          isSubmitting,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          handleReset,
                          setFieldValue,
                        } = props;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12}>
                                <Select
                                  error={
                                    errors.ContractLength &&
                                      touched.ContractLength
                                      ? true
                                      : false
                                  }
                                  id="ContractLength"
                                  className="WidhtFull100"
                                  placeholder="Preferred Contract Length"
                                  defaultValue={{
                                    label: contractLength,
                                    value: contractLength,
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("ContractLength", e);
                                  }}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="ContractLength-number-error"
                                  name="ContractLength"
                                  options={ContractLengthOption}
                                />
                                {errors.ContractLength &&
                                  touched.ContractLength && (
                                    <FormHelperText
                                      className="errormsg"
                                      id="ContractLength-error"
                                    >
                                      {errors.ContractLength}
                                    </FormHelperText>
                                  )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      error={
                                        errors.ExpiryDate && touched.ExpiryDate
                                          ? true
                                          : false
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      name="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Renewal Expiry Date"
                                      inputVariant="outlined"
                                      allowKeyboardControl
                                      format="dd/MM/yyyy"
                                      value={
                                        values.ExpiryDate
                                          ? helperMethods.MillisecondsToDate_NewOne(
                                            values.ExpiryDate
                                          )
                                          : null
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          "ExpiryDate",
                                          new Date(e).getTime()
                                        );
                                      }}
                                      KeyboardButtonProps={{
                                        "aria-label": "change date",
                                      }}
                                    />
                                  </Grid>
                                </MuiPickersUtilsProvider>
                                {errors.ExpiryDate && touched.ExpiryDate && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="ExpiryDate-error"
                                  >
                                    {errors.ExpiryDate}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>

                            <Grid container spacing={3}>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Amount && touched.Amount
                                      ? true
                                      : false
                                  }
                                  id="Amount"
                                  className="WidhtFull100"
                                  label="Enter Amount"
                                  type="number"
                                  name="Amount"
                                  defaultValue={Price}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Amount-error"
                                />
                                {errors.Amount && touched.Amount && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Amount-error"
                                  >
                                    {errors.Amount}
                                  </FormHelperText>
                                )}
                              </Grid>
                              <Grid item md={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  error={
                                    errors.Notes && touched.Notes ? true : false
                                  }
                                  id="Notes"
                                  className="WidhtFull100"
                                  label="Notes"
                                  name="Notes"
                                  // defaultValue={notes}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                  aria-describedby="Notes-error"
                                  multiline
                                />
                                {errors.Notes && touched.Notes && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="Notes-error"
                                  >
                                    {errors.Notes}
                                  </FormHelperText>
                                )}
                              </Grid>
                            </Grid>
                            <CardActions
                              style={{
                                paddingLeft: 0,
                                paddingRight: 0,
                                marginTop: 20,
                              }}
                            >
                              <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                type="submit"
                              // disabled={isSubmitting}
                              >
                                Revise Rates
                              </Button>{" "}
                              {startLoader && <CircularProgress />}
                            </CardActions>
                          </form>
                        );
                      }}
                    </Formik>
                  </Grid>
                </Grid>
              </Paper>
            </React.Fragment>
          )}

        {/* INVOICED */}
        {["1002"].includes(QuoteStatus) &&
          ["admin", "management"].includes(props.slug) && (
            <Paper style={{ marginTop: 35 }}>
              <Grid container spacing={3} className={classes.PaddingSpace}>
                <Grid item xs={12} md={12}>
                  <Formik
                    initialValues={{
                      file_upload: "",
                      contractLengthDate: "",
                      contractLength: ""
                    }}
                    onSubmit={(values, actions) => {
                      console.log('on submit');

                      const negotiation: any = new FormData();
                      const CQ = currentQuote;
                      negotiation.set("RenewalID", CQ._id);
                      if (CQ.serviceType && CQ.serviceType != "") {
                        negotiation.set("serviceType", CQ.serviceType)
                      }
                      if (CQ.contractLength && CQ.contractLength != "") {
                        negotiation.set("contractLength", CQ.contractLength)
                      }
                      if (CQ.Company !== undefined)
                        negotiation.set(
                          "CompanyID",
                          CQ.Company !== undefined ? CQ.Company._id : ""
                        );
                      if (CQ.Consumer !== undefined)
                        negotiation.set(
                          "ConsumerID",
                          CQ.Consumer !== undefined ? CQ.Consumer._id : ""
                        );
                      negotiation.set("EmailType", "RenewalInvoiced");
                      negotiation.set("Status", Number(CQ.Status));
                      for (let x = 0; x < fileUpload.length; x++) {
                        negotiation.append("Invoice", fileUpload[x]);
                      }

                      if (!values.contractLengthDate && values.contractLengthDate == "") {

                      }
                      setCurrentAction(
                        "Renewal invoice uploaded successfully"
                      );
                      if (values.contractLengthDate && values.contractLengthDate != "") {
                        console.log('here', values.contractLengthDate);
                        negotiation.set('contractLengthDate', values.contractLengthDate)
                      } else {
                        actions.setErrors({ contractLengthDate: "Please select live date" })
                      }

                      setStartLoader(true);
                      _quoteActions(negotiation, 1004);
                      actions.resetForm();
                    }}
                    validationSchema={Yup.object().shape({
                      contractLengthDate: Yup.string().required("Please select service live date"),
                    })}
                  >
                    {(props) => {
                      const { values, touched, errors, handleSubmit, setFieldValue } = props;
                      return (
                        <form onSubmit={handleSubmit}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                  <KeyboardDatePicker
                                    variant="dialog"
                                    inputVariant="outlined"
                                    error={
                                      !!(
                                        errors.contractLengthDate &&
                                        touched.contractLengthDate
                                      )
                                    }
                                    margin="normal"
                                    id="ServiceLiveDate"
                                    name="contractLengthDate"
                                    className="WidhtFull100"
                                    label="Service Live Date"
                                    allowKeyboardControl
                                    format="dd/MM/yyyy"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "contractLengthDate",
                                        new Date(e).getTime()
                                      );
                                    }}
                                    value={
                                      values.contractLengthDate
                                        ? helperMethods.MillisecondsToDate_NewOne(
                                          values.contractLengthDate
                                        )
                                        : null
                                    }
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                              {errors.contractLengthDate &&
                                touched.contractLengthDate && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="contractLengthDate-error"
                                  >
                                    {errors.contractLengthDate}
                                  </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <DropzoneArea
                                filesLimit={1}
                                dropzoneText="Please Upload File From Here"
                                useChipsForPreview
                                dropzoneClass={
                                  errors.file_upload && touched.file_upload
                                    ? "ErrorColorDropzone"
                                    : ""
                                }
                                maxFileSize={10000000}
                                onChange={(e: any) => setFileUpload(e)}
                              />
                              {errors.file_upload && touched.file_upload && (
                                <FormHelperText
                                  className="errormsg"
                                  id="file_upload-error"
                                >
                                  {errors.file_upload}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <CardActions
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  type="submit"
                                  color="primary"
                                >
                                  Add
                                </Button>
                                {startLoader && <CircularProgress />}
                              </CardActions>
                            </Grid>
                          </Grid>
                        </form>
                      );
                    }}
                  </Formik>
                </Grid>
              </Grid>
            </Paper>
          )}
      </Grid>
    </Grid >
  );
}
