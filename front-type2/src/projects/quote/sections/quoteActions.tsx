import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useDispatch } from "react-redux";
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
import {
  ContractLengthOption,
  contractLengthConvertInMonths,
  ContractLengthValue,
} from "../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  QuoteStatusNames,
} from "../../../sharedUtils/globalHelper/status";
import { CommissionAction, CommissionActionView } from '../component/commissionAction';
import SolarAction from '../sections/solarAction';
import SolarPaidAction from '../sections/solarPaidAction';

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
    case "eco":
      return <></>;
    case "paidsolar":
      return <></>;
  }
}

export default function QuoteActions(props) {
  let service = null;
  if (
    props.currentQuote?.service &&
    props.currentQuote?.serviceType && props.currentQuote.serviceType !== "ChipAndPin" &&
    props.currentQuote?.service[props.currentQuote.serviceType.toLowerCase()]
  ) {
    service =
      props.currentQuote?.service[props.currentQuote.serviceType.toLowerCase()];
  }
  if (
    props.currentQuote?.service &&
    props.currentQuote?.serviceType && props.currentQuote.serviceType == "ChipAndPin" &&
    props.currentQuote?.service["chipAndPin"]
  ) {
    service =
      props.currentQuote?.service["chipAndPin"];
  }

  let initObj: any = {};
  ContractLengthOption.forEach((cl) => {
    if (
      service &&
      service.contract_length &&
      (cl.label == service.contract_length ||
        cl.value == service.contract_length) &&
      !initObj.label
    ) {
      initObj = cl;
    }
  });

  let initAmount:any={}

  if(props.currentQuote.serviceType === 'Telecoms'){
    initAmount = (service.lineRental + service.ExtraServiceCharges) * (ContractLengthValue[service.contract_length]*12) + Number(service.ConnectionCharges)
  }else{
    initAmount=0
  }

  const dispatch = useDispatch();

  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);
  const [thisActionStatus, setThisActionStatus] = useState(0);
  const [currentAction, setCurrentAction] = useState("");

  if (props.isActionDone && startLoader) {
    props._isActionDone(false);
    setStartLoader(false);
  }
  const quoteAccepted = () => {
    const negotiation: any = {};
    const CQ = props.currentQuote;
    const quoteId = CQ._id;
    negotiation.QuoteID = quoteId;
    negotiation.quoteStatus = 1002;
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
    negotiation.Amount = CQ.quotePrice;
    negotiation.notes = "";
    negotiation.QuoteEmailType = "AcceptQuoteProvided";
    setCurrentAction("Quote accepted successfully");
    setStartLoader(true);
    props._quoteActions(negotiation, 1002);
  };

  const QuoteStatus = String(props.currentQuote.quoteStatus);

  const {
    quotePrice,
    notes,
    contractLength,
  } = props.currentQuote;

  let conditionFirst = ["admin", "management", 'service_partner'].includes(props.slug) && !props.currentQuote.subServiceType.includes('Solar') && props.currentQuote.serviceType !== "PaidSolar"
  let conditionSecond = ["1001", "1005", "1012"].includes(QuoteStatus) && !props.currentQuote.subServiceType.includes('Solar') && props.currentQuote.serviceType !== "PaidSolar"
  let conditionThird = ["1011"].includes(QuoteStatus) && !props.currentQuote.subServiceType.includes('Solar') && props.currentQuote.serviceType !== "PaidSolar"
  let conditionFour = ["1002"].includes(QuoteStatus) && !props.currentQuote.subServiceType.includes('Solar') && props.currentQuote.serviceType !== "PaidSolar"

  return (
    <>
      <TableContainer component={Paper} className={classes.Spacing}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                {QuoteStatusNames[props.currentQuote.quoteStatus]}
              </TableCell>
            </TableRow>
            {props.currentQuote.quoteStatus != 1000 ? (
              <TableRow>
                <TableCell>
                  <strong>Preferred Contract Length</strong>
                </TableCell>
                <TableCell>{props.currentQuote.contractLength}</TableCell>
              </TableRow>
            ) : null}
            {props.currentQuote.quoteStatus != 1000 ? (
              <TableRow>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>{props.currentQuote.quotePrice}</TableCell>
              </TableRow>
            ) : null}
            {props.currentQuote.quoteStatus != 1000 ? (
              <TableRow>
                <TableCell>
                  <strong>Quote Expiry Date</strong>
                </TableCell>
                <TableCell>
                  {helperMethods.ConvertDate(
                    Number(props.currentQuote.expiryDate)
                  )}
                </TableCell>
              </TableRow>
            ) : null}

            {props.currentQuote && props.currentQuote.service && (
              <ServiceWiseFields {...props.currentQuote} />
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Grid item xs={12} md={12} style={{ marginTop: 35 }}>
        {/* PROVIDE QUOTE */}
        {["1000"].includes(QuoteStatus) &&
          conditionFirst && (
            <React.Fragment>
              <Paper>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12} className={classes.PaddingSpace}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        ContractLength: initObj, //null,
                        Amount: initAmount,
                        ExpiryDate: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = props.currentQuote;
                        const quoteId = CQ._id;
                        negotiation.ContractLength =
                          values.ContractLength.value;
                        negotiation.ExpiryDate = new Date(
                          values.ExpiryDate
                        ).getTime();
                        negotiation.Amount = values.Amount;
                        negotiation.Notes = values.Notes;
                        negotiation.QuoteID = quoteId;
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
                        negotiation.QuoteStatus = CQ.quoteStatus;
                        negotiation.Status = Number(CQ.quoteStatus);
                        negotiation.serviceType = CQ.serviceType;

                        if (Number(CQ.quoteStatus) === 1000) {
                          negotiation.QuoteEmailType = "QuoteProvided";
                        } else {
                          negotiation.QuoteEmailType = "RevisedQuote";
                        }
                        setStartLoader(true);
                        setCurrentAction(
                          `Quote ${Number(CQ.quoteStatus) === 1000
                            ? "provided"
                            : "revised"
                          } successfully`
                        );
                        props._quoteActions({ negotiation }, 1001);
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
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                        } = props;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Select
                                  className={
                                    errors.ContractLength &&
                                      touched.ContractLength
                                      ? "ErrorColor"
                                      : ""
                                  }
                                  id="ContractLength"
                                  placeholder="Preferred Contract Length"
                                  label="Preferred Contract Length"
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
                              <Grid item xs={12} md={12}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      variant="dialog"
                                      inputVariant="outlined"
                                      error={
                                        !!(
                                          errors.ExpiryDate &&
                                          touched.ExpiryDate
                                        )
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Quote Expiry Date"
                                      allowKeyboardControl
                                      format="dd/MM/yyyy"
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

                              <Grid item md={12} sm={6} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Amount && touched.Amount)}
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
                              <Grid item md={12} sm={6} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Notes && touched.Notes)}
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
                              >
                                {Number(QuoteStatus) === 1000
                                  ? "Provide "
                                  : "Revise "}
                                Quote
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

        {/* REVISE QUOTE */}
        {["1003"].includes(QuoteStatus) &&
          conditionFirst && (
            <React.Fragment>
              {/* <Grid container spacing={3} >
                            <Grid item xs={12} md={12}>
                                <Typography variant="h5" className={classes.TypoSpace} gutterBottom>Quote Actions</Typography>
                            </Grid>
                        </Grid> */}
              <Paper>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        ContractLength: initObj,
                        ExpiryDate: props.currentQuote.expiryDate
                          ? props.currentQuote.expiryDate
                          : null,
                        Amount: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = props.currentQuote;
                        const quoteId = CQ._id;
                        if (values.ContractLength) {
                          negotiation.ContractLength =
                            values.ContractLength.value;
                        } else {
                          negotiation.ContractLength = CQ.contractLength;
                        }
                        negotiation.ExpiryDate =
                          values.ExpiryDate && values.ExpiryDate !== null
                            ? values.ExpiryDate
                            : CQ.ExpiryDate;

                        if (values.Amount) {
                          negotiation.Amount = values.Amount;
                        } else {
                          negotiation.Amount = CQ.quotePrice;
                        }
                        if (values.Notes) {
                          negotiation.Notes = values.Notes;
                        } else {
                          negotiation.Notes = CQ.notes;
                        }

                        negotiation.QuoteID = quoteId;
                        negotiation.CompanyID =
                          CQ.Company !== undefined ? CQ.Company._id : "";
                        negotiation.QuoteStatus = 1005;
                        negotiation.Status = 1005;
                        negotiation.serviceType = CQ.serviceType;
                        negotiation.QuoteEmailType = "RevisedQuote";
                        setStartLoader(true);
                        setCurrentAction(`Revised quote successfully`);
                        props._quoteActions({ negotiation }, 1001);
                      }}
                    // validationSchema={{}}
                    >
                      {(fprops) => {
                        const {
                          values,
                          touched,
                          errors,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                        } = fprops;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12} xs={12}>
                                <Select
                                  className={
                                    errors.ContractLength &&
                                      touched.ContractLength
                                      ? "ErrorColor"
                                      : ""
                                  }
                                  id="ContractLength"
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
                                      variant="dialog"
                                      inputVariant="outlined"
                                      error={
                                        !!(
                                          errors.ExpiryDate &&
                                          touched.ExpiryDate
                                        )
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Quote Expiry Date"
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
                                        // setCurrentExpiryDate(
                                        //   new Date(e).getTime()
                                        // );
                                        setFieldValue(
                                          "ExpiryDate",
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
                              <Grid item md={12} sm={6} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Amount && touched.Amount)}
                                  id="Amount"
                                  className="WidhtFull100"
                                  label="Enter Amount"
                                  type="number"
                                  name="Amount"
                                  // value={values.Amount}
                                  defaultValue={quotePrice}
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
                              <Grid item md={12} sm={6} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Notes && touched.Notes)}
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
                              >
                                Revise Quote
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
        {conditionSecond && (
          <Paper>
            <Grid container spacing={3} className={classes.PaddingSpace}>
              <Grid item xs={12} md={12}>
                <Formik
                  initialValues={{
                    Notes: "",
                  }}
                  onSubmit={(values) => {
                    const negotiation: any = {};
                    const CQ = props.currentQuote;
                    const quoteId = CQ._id;
                    const mailTempArray = {
                      1002: "PendingSupplierConfirmation",
                      1003: "RejectQuoteProvided",
                      1009: "DNDQuoteProvidedtomgt",
                    };

                    const toasterMessage = {
                      1002: "Quote pending supplier confirmation provided",
                      1003: "Quote rejected successfully",
                      1009: "Quote DND successfully",
                    };

                    negotiation.QuoteID = quoteId;
                    if (Number(thisActionStatus) === 1002) {
                      negotiation.quoteStatus = 1011;
                    } else {
                      negotiation.quoteStatus = thisActionStatus;
                    }
                    negotiation.Status = thisActionStatus;
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
                    negotiation.Amount = CQ.quotePrice;
                    negotiation.Notes = values.Notes;
                    negotiation.notes = values.Notes;
                    negotiation.QuoteEmailType =
                      mailTempArray[thisActionStatus];
                    setStartLoader(true);
                    setCurrentAction(`${toasterMessage[thisActionStatus]}`);
                    props._quoteActions(negotiation, 1002);
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
                      isSubmitting,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                    } = props;

                    return (
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                          <Grid item md={12} sm={6} xs={12}>
                            <TextField
                              variant="outlined"
                              error={!!(errors.Notes && touched.Notes)}
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
        {conditionThird &&
          ["admin", "management", 'service_partner'].includes(props.slug) && (
            <React.Fragment>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                style={{ marginBottom: "30px" }}
                onClick={() => quoteAccepted()}
              >
                Confirm Rates
              </Button>
              <Paper>
                <Grid container spacing={3} className={classes.PaddingSpace}>
                  <Grid item xs={12} md={12}>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        ContractLength: initObj,
                        ExpiryDate: props.currentQuote.expiryDate
                          ? props.currentQuote.expiryDate
                          : null,
                        Amount: "",
                        Notes: "",
                      }}
                      onSubmit={(values) => {
                        const negotiation: any = {};
                        const CQ = props.currentQuote;
                        const quoteId = CQ._id;
                        if (values.ContractLength) {
                          negotiation.ContractLength =
                            values.ContractLength.value;
                        } else {
                          negotiation.ContractLength = CQ.contractLength;
                        }
                        negotiation.ExpiryDate =
                          values.ExpiryDate && values.ExpiryDate !== null
                            ? values.ExpiryDate
                            : CQ.ExpiryDate;
                        if (values.Amount) {
                          negotiation.Amount = values.Amount;
                        } else {
                          negotiation.Amount = CQ.quotePrice;
                        }
                        if (values.Notes) {
                          negotiation.Notes = values.Notes;
                        } else {
                          negotiation.Notes = CQ.notes;
                        }
                        negotiation.QuoteID = quoteId;
                        if (CQ.Company !== undefined)
                          negotiation.CompanyID =
                            CQ.Company !== undefined ? CQ.Company._id : "";
                        if (CQ.Consumer !== undefined)
                          negotiation.ConsumerID =
                            CQ.Consumer !== undefined ? CQ.Consumer._id : "";
                        negotiation.QuoteStatus = 1012;
                        negotiation.Status = 1012;
                        negotiation.serviceType = CQ.serviceType;
                        negotiation.QuoteEmailType = "RevisedSupplierRate";

                        setStartLoader(true);
                        setCurrentAction(
                          `Revised supplier rates provided successfully`
                        );
                        props._quoteActions({ negotiation }, 1012);
                      }}
                    >
                      {(fprops) => {
                        const {
                          values,
                          touched,
                          errors,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                        } = fprops;

                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                              <Grid item md={6} sm={12} xs={12}>
                                <Select
                                  id="ContractLength"
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
                              <Grid item xs={12} sm={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      variant="dialog"
                                      inputVariant="outlined"
                                      error={
                                        !!(
                                          errors.ExpiryDate &&
                                          touched.ExpiryDate
                                        )
                                      }
                                      margin="normal"
                                      id="ExpiryDate"
                                      name="ExpiryDate"
                                      className="WidhtFull100"
                                      label="Quote Expiry Date"
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
                              <Grid item md={12} sm={12} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Amount && touched.Amount)}
                                  id="Amount"
                                  className="WidhtFull100"
                                  label="Enter Amount"
                                  type="number"
                                  name="Amount" // value={values.Amount}
                                  defaultValue={quotePrice}
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
                              <Grid item md={12} sm={12} xs={12}>
                                <TextField
                                  variant="outlined"
                                  error={!!(errors.Notes && touched.Notes)}
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
        {conditionFour &&
          // isLiveDateProvided &&
          ["admin", "management", 'service_partner'].includes(props.slug) && (
            <Paper>
              <Grid container spacing={3} className={classes.PaddingSpace}>
                <Grid item xs={12} md={12}>
                  <Formik
                    initialValues={{
                      Invoice: "",
                      contractLengthDate: "",
                    }}
                    validationSchema={
                      Yup.object().shape({
                        contractLengthDate: Yup.string().required("please select date")
                      })
                    }
                    onSubmit={(values, actions) => {

                      const negotiation = new FormData();
                      const CQ = props.currentQuote;
                      negotiation.set("QuoteID", CQ._id);

                      if (CQ.Company !== undefined) {
                        negotiation.set(
                          "CompanyID",
                          CQ.Company !== undefined ? CQ.Company._id : ""
                        );
                      }
                      if (CQ.Consumer !== undefined) {

                        negotiation.set(
                          "ConsumerID",
                          CQ.Consumer !== undefined ? CQ.Consumer._id : ""
                        );
                      }
                      negotiation.set("QuoteEmailType", "QuoteInvoiced");
                      negotiation.set("Status", CQ.quoteStatus);
                      negotiation.set("contractLengthDate", values.contractLengthDate);
                      negotiation.set('Invoice', values.Invoice[0]);

                      if (['ChipAndPin'].includes(CQ.serviceType)) {
                        negotiation.set('service', 'chipAndPin')
                      } else {
                        negotiation.set('service', CQ.serviceType.toLowerCase());
                      }

                      setCurrentAction("Quote invoice uploaded successfully");
                      setStartLoader(true);

                      props._quoteActions(negotiation, 1004);
                      actions.resetForm();
                    }}
                  >
                    {(props) => {
                      const { touched, errors, handleSubmit, setFieldValue, values } = props;
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
                                acceptedFiles={["application/pdf"]}
                                filesLimit={1}
                                dropzoneText="Please Upload File From Here"
                                useChipsForPreview
                                dropzoneClass={
                                  errors.Invoice && touched.Invoice
                                    ? "ErrorColorDropzone"
                                    : ""
                                }
                                maxFileSize={10000000}
                                onChange={(e) => setFieldValue("Invoice", e)}
                              />
                              <FormHelperText>
                                Upload Invoice Document Here.
                              </FormHelperText>
                              {errors.Invoice && touched.Invoice && (
                                <FormHelperText
                                  className="errormsg"
                                  id="Invoice-error"
                                >
                                  {errors.Invoice}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <CardActions
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                              >
                                <Button
                                  size="medium"
                                  variant="contained"
                                  type="submit"
                                  color="primary"
                                >
                                  Add {" "}
                                </Button>{" "}
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


        {
          ["1004"].includes(QuoteStatus) && props?.currentQuote?.serviceType === "Insurance" && ['admin', 'management', 'service_partner'].includes(props.slug) ? (
            <Grid item xs={12} style={{ marginTop: 35 }}>
              {
                props.currentQuote?.commissionStatus == 'Paid' ? <CommissionActionView {...props} /> : <CommissionAction {...props} />
              }
            </Grid>) : null
        }

        {props.currentQuote.subServiceType.includes('Solar') && (
          <React.Fragment>
            <SolarAction {...props} />
          </React.Fragment>
        )}

        {props.currentQuote.serviceType === "PaidSolar" && (
          <React.Fragment>
            <SolarPaidAction {...props} />
          </React.Fragment>
        )}
      </Grid>
    </>
  );
}