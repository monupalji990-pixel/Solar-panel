import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";

const yesNoOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const paymentOptions = [
  { label: "Finance", value: "Finance" },
  { label: "Cash", value: "Cash" },
  { label: "Finance + Cash", value: "Finance + Cash" },
];

const installTypeOptions = [
  { label: "Wall mounted", value: "Wall mounted" },
  { label: "Ground mounted", value: "Ground mounted" },
  { label: "Roof integrated", value: "Roof integrated" },
];

const roofOrientationOptions = [
  { label: "North", value: "North" },
  { label: "North East", value: "North East" },
  { label: "East", value: "East" },
  { label: "South East", value: "South East" },
  { label: "South", value: "South" },
  { label: "South West", value: "South West" },
  { label: "West", value: "West" },
  { label: "North West", value: "North West" },
];

const toOption = (options, value) => {
  if (!value) return null;
  return options.find((option) => option.value === value) || null;
};

const safeNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return Number(value);
};

function getCustomerLabel(data) {
  if (!data) return "";
  if (data.Consumer?._id) {
    return data.Consumer.firstName
      ? `${data.Consumer.title || ""} ${data.Consumer.firstName} ${data.Consumer.surName || ""}`.trim()
      : "";
  }
  if (data.Company?._id) {
    return data.Company.businessName || "";
  }
  return "";
}

function getCustomerNumber(data) {
  return (
    data.Consumer?.mobile ||
    data.Contact?.mobile ||
    data.Company?.mobile ||
    ""
  );
}

function getCustomerEmail(data) {
  return (
    data.Consumer?.email ||
    data.Contact?.email ||
    data.Company?.email ||
    ""
  );
}

function getCustomerAddress(data) {
  return (
    data.Consumer?.addressOne ||
    data.Company?.address ||
    ""
  );
}

function getCustomerPostcode(data) {
  return (
    data.Consumer?.postcode ||
    data.Company?.postcode ||
    ""
  );
}

const baseValues = (props) => {
  const digital = props.singleLead?.digitalDashboard || props.currentQuote?.digitalDashboard || {};
  const lead = props.singleLead || props.currentQuote?.Lead || {};

  return {
    leadId: props.singleLead?.leadId || props.currentQuote?.Lead?.leadId || props.singleLead?._id || "",
    customerName: getCustomerLabel(props.singleLead || props.currentQuote) || "",
    customerNumber: getCustomerNumber(props.singleLead || props.currentQuote) || "",
    customerEmail: getCustomerEmail(props.singleLead || props.currentQuote) || "",
    firstLineOfadd: getCustomerAddress(props.singleLead || props.currentQuote) || "",
    postcode: getCustomerPostcode(props.singleLead || props.currentQuote) || "",
    status: lead.status || "",
    leadGenerator: (props.singleLead?.LeadGenerator?.name || props.currentQuote?.LeadGenerator?.name) || "",
    assignee: (props.singleLead?.Assignee?.name || props.currentQuote?.Assignee?.name) || "",
    notes: digital.notes || "",
    paymentMethod: digital.paymentMethod || "",
    hiesRegCertNo: digital.hiesRegCertNo || "",
    mcsRegCertNo: digital.mcsRegCertNo || "",
    buildRegCerNo: digital.buildRegCerNo || "",
    depositPaymentDate: digital.depositPaymentDate ? new Date(digital.depositPaymentDate) : null,
    solar: {
      peakSystemOutput: digital.solar?.peakSystemOutput || "",
      systemSize: digital.solar?.systemSize || "",
      offeredQuotation: digital.solar?.offeredQuotation || 0,
      discount: digital.solar?.discount || 0,
      agreedAmount: digital.solar?.agreedAmount || 0,
      depositPaidAmount: digital.solar?.depositPaidAmount || 0,
      netCost: digital.solar?.netCost || "",
      finalPayment: digital.solar?.finalPayment || 0,
      finalPaymentDate: digital.solar?.finalPaymentDate ? new Date(digital.solar.finalPaymentDate) : null,
      installationDate: digital.solar?.installationDate ? new Date(digital.solar.installationDate) : null,
      jobCompletionDate: digital.solar?.jobCompletionDate ? new Date(digital.solar.jobCompletionDate) : null,
      dnoApproval: digital.solar?.dnoApproval || "No",
      dnoApproved: digital.solar?.dnoApproved || "No",
      vatApplicable: digital.solar?.vatApplicable || "No",
      noOfPanels: digital.solar?.noOfPanels || 0,
      noOfInverters: digital.solar?.noOfInverters || 0,
      noOfBatteries: digital.solar?.noOfBatteries || 0,
      roofStyle: digital.solar?.roofStyle || "",
      roofMaterial: digital.solar?.roofMaterial || "",
      shading: digital.solar?.shading || "",
      propertyType: digital.solar?.propertyType || "",
      inverterInstallType: digital.solar?.inverterInstallType || "",
      batteryInstallType: digital.solar?.batteryInstallType || "",
      additionalProducts: digital.solar?.additionalProducts || "",
      financeApplicationDate: digital.solar?.financeApplicationDate ? new Date(digital.solar.financeApplicationDate) : null,
      dnoApplicationSubmissionDate: digital.solar?.dnoApplicationSubmissionDate ? new Date(digital.solar.dnoApplicationSubmissionDate) : null,
      approvalDate: digital.solar?.approvalDate ? new Date(digital.solar.approvalDate) : null,
      contractSignedDate: digital.solar?.contractSignedDate ? new Date(digital.solar.contractSignedDate) : null,
      scaffoldingUpDate: digital.solar?.scaffoldingUpDate ? new Date(digital.solar.scaffoldingUpDate) : null,
      scaffoldingDownDate: digital.solar?.scaffoldingDownDate ? new Date(digital.solar.scaffoldingDownDate) : null,
      scaffoldingCompany: digital.solar?.scaffoldingCompany || "",
      roofingDate: digital.solar?.roofingDate ? new Date(digital.solar.roofingDate) : null,
      rooferAssigned: digital.solar?.rooferAssigned || "",
      electricalWorkDate: digital.solar?.electricalWorkDate ? new Date(digital.solar.electricalWorkDate) : null,
      electricianAssigned: digital.solar?.electricianAssigned || "",
      handoverPaperworkSigned: digital.solar?.handoverPaperworkSigned || "No",
      hiesRegistrationDate: digital.solar?.hiesRegistrationDate ? new Date(digital.solar.hiesRegistrationDate) : null,
      mcsRegistrationComplete: digital.solar?.mcsRegistrationComplete || "No",
      buildingRegulationsDate: digital.solar?.buildingRegulationsDate ? new Date(digital.solar.buildingRegulationsDate) : null,
      epvsCompletion: digital.solar?.epvsCompletion || "No",
      handoverPackSent: digital.solar?.handoverPackSent || "No",
      roofs: Array.isArray(digital.solar?.roofs) && digital.solar.roofs.length > 0 ? digital.solar.roofs : [
        { roofPitch: "", roofOrientation: "South", noOfPanels: 0 },
      ],
    },
  };
};

export default function LeadDigitalDashboardPaidSolar(props) {
  const [initialData, setInitialData] = useState(baseValues(props));
  const [startLoader, setStartLoader] = useState(false);

  useEffect(() => {
    setInitialData(baseValues(props));
  }, [props.singleLead, props.currentQuote]);

  const validateDashboard = (values) => {
    const errors: any = {};
    const solarErrors: any = {};

    if (!values.solar.agreedAmount || values.solar.agreedAmount <= 0) {
      solarErrors.agreedAmount = "Total agreed amount is required";
    }

    if (values.paymentMethod !== "Cash") {
      if (!values.solar.financeApplicationDate) {
        solarErrors.financeApplicationDate = "Finance application date is required";
      }
      if (!values.solar.dnoApplicationSubmissionDate) {
        solarErrors.dnoApplicationSubmissionDate = "DNO submission date is required";
      }
      if (!values.solar.approvalDate) {
        solarErrors.approvalDate = "Approval date is required";
      }
    }

    if (values.paymentMethod === "Cash" || values.paymentMethod === "Finance + Cash") {
      if (!values.solar.depositPaidAmount || values.solar.depositPaidAmount <= 0) {
        solarErrors.depositPaidAmount = "Deposit paid amount is required";
      }
    }

    if (values.solar.contractSignedDate) {
      if (!values.solar.epvsCompletion || values.solar.epvsCompletion !== "Yes") {
        solarErrors.epvsCompletion = "EPVS completion is required when contract is signed";
      }
      if (!values.solar.hiesRegistrationDate) {
        solarErrors.hiesRegistrationDate = "HIES registration date is required when contract is signed";
      }
      if (!values.solar.mcsRegistrationComplete || values.solar.mcsRegistrationComplete !== "Yes") {
        solarErrors.mcsRegistrationComplete = "MCS registration completion is required when contract is signed";
      }
      if (!values.solar.buildingRegulationsDate) {
        solarErrors.buildingRegulationsDate = "Building regulations date is required when contract is signed";
      }
      if (!values.solar.finalPayment || values.solar.finalPayment <= 0) {
        solarErrors.finalPayment = "Final payment is required when contract is signed";
      }
      if (!values.solar.finalPaymentDate) {
        solarErrors.finalPaymentDate = "Final payment date is required when contract is signed";
      }
    }

    if (values.solar.handoverPackSent === "Yes") {
      if (!values.solar.contractSignedDate) {
        solarErrors.contractSignedDate = "Contract signed date is required before handover";
      }
      if (!values.solar.jobCompletionDate) {
        solarErrors.jobCompletionDate = "Job completion date is required before handover";
      }
      if (!values.solar.epvsCompletion || values.solar.epvsCompletion !== "Yes") {
        solarErrors.epvsCompletion = "EPVS completion is required before handover";
      }
      if (!values.solar.hiesRegistrationDate) {
        solarErrors.hiesRegistrationDate = "HIES registration date is required before handover";
      }
      if (!values.solar.mcsRegistrationComplete || values.solar.mcsRegistrationComplete !== "Yes") {
        solarErrors.mcsRegistrationComplete = "MCS registration completion is required before handover";
      }
      if (!values.solar.buildingRegulationsDate) {
        solarErrors.buildingRegulationsDate = "Building regulations date is required before handover";
      }
    }

    if (Object.keys(solarErrors).length > 0) {
      errors.solar = solarErrors;
    }

    return errors;
  };

  const validationSchema = Yup.object().shape({});

  const handleSubmitForm = async (values) => {
    setStartLoader(true);
    const payload = {
      leadId: props.singleLead?._id || props.currentQuote?.Lead?._id,
      serviceType: props.singleLead?.serviceType || props.currentQuote?.serviceType,
      status:
        values.solar.handoverPackSent === "Yes"
          ? "Installation Complete"
          : values.status,
      digitalDashboard: {
        ...values,
        solar: {
          ...values.solar,
          finalPaymentDate: values.solar.finalPaymentDate ? new Date(values.solar.finalPaymentDate).getTime() : null,
          installationDate: values.solar.installationDate ? new Date(values.solar.installationDate).getTime() : null,
          jobCompletionDate: values.solar.jobCompletionDate ? new Date(values.solar.jobCompletionDate).getTime() : null,
          financeApplicationDate: values.solar.financeApplicationDate ? new Date(values.solar.financeApplicationDate).getTime() : null,
          dnoApplicationSubmissionDate: values.solar.dnoApplicationSubmissionDate ? new Date(values.solar.dnoApplicationSubmissionDate).getTime() : null,
          approvalDate: values.solar.approvalDate ? new Date(values.solar.approvalDate).getTime() : null,
          contractSignedDate: values.solar.contractSignedDate ? new Date(values.solar.contractSignedDate).getTime() : null,
          scaffoldingUpDate: values.solar.scaffoldingUpDate ? new Date(values.solar.scaffoldingUpDate).getTime() : null,
          scaffoldingDownDate: values.solar.scaffoldingDownDate ? new Date(values.solar.scaffoldingDownDate).getTime() : null,
          roofingDate: values.solar.roofingDate ? new Date(values.solar.roofingDate).getTime() : null,
          electricalWorkDate: values.solar.electricalWorkDate ? new Date(values.solar.electricalWorkDate).getTime() : null,
          hiesRegistrationDate: values.solar.hiesRegistrationDate ? new Date(values.solar.hiesRegistrationDate).getTime() : null,
          buildingRegulationsDate: values.solar.buildingRegulationsDate ? new Date(values.solar.buildingRegulationsDate).getTime() : null,
        },
        depositPaymentDate: values.depositPaymentDate ? new Date(values.depositPaymentDate).getTime() : null,
      },
    };

    props._leadUpdate({ data: payload, showingFrom: props.showingFrom });
    setTimeout(() => setStartLoader(false), 500);
  };

  return (
    <div style={{ width: "100%", padding: 10, background: "#f7f8fb" }}>
      <Formik
        enableReinitialize
        initialValues={initialData}
        validationSchema={validationSchema}
        validate={validateDashboard}
        onSubmit={handleSubmitForm}
      >
        {({ values, setFieldValue, handleSubmit, isSubmitting, errors, touched }) => {
          const getFieldError = (field) =>
            touched?.solar?.[field] && errors?.solar?.[field] ? errors.solar[field] : "";

          return (
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18 }}>
                  Paid Solar Sheet View
                </div>
              </Grid>

              <Grid item xs={12}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#ffffff",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Field</th>
                      <th style={{ border: "1px solid #ddd", padding: 10, textAlign: "left" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Lead ID</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.leadId}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Customer</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.customerName}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Contact</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.customerNumber}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Email</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.customerEmail}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Address</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.firstLineOfadd}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Postcode</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.postcode}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Lead Status</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.status}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Lead Generator</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.leadGenerator}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Assignee</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>{values.assignee}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>System Size</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.systemSize}
                          onChange={(e) => setFieldValue("solar.systemSize", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Peak Output</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.peakSystemOutput}
                          onChange={(e) => setFieldValue("solar.peakSystemOutput", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Panels</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.noOfPanels}
                          type="number"
                          onChange={(e) => setFieldValue("solar.noOfPanels", safeNumber(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Roof Layout</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        {values.solar.roofs.map((roof, index) => (
                          <div key={index} style={{ marginBottom: 16, padding: 8, border: "1px solid #e0e0e0", borderRadius: 4 }}>
                            <div style={{ marginBottom: 8, fontWeight: 600 }}>Roof {index + 1}</div>
                            <Grid container spacing={1}>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  label="Pitch"
                                  value={roof.roofPitch}
                                  onChange={(e) => {
                                    const updated = [...values.solar.roofs];
                                    updated[index] = { ...updated[index], roofPitch: e.target.value };
                                    setFieldValue("solar.roofs", updated);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <Select
                                  value={toOption(roofOrientationOptions, roof.roofOrientation)}
                                  options={roofOrientationOptions}
                                  onChange={(e) => {
                                    const updated = [...values.solar.roofs];
                                    updated[index] = { ...updated[index], roofOrientation: e?.value || "" };
                                    setFieldValue("solar.roofs", updated);
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  label="Panels"
                                  type="number"
                                  value={roof.noOfPanels}
                                  onChange={(e) => {
                                    const updated = [...values.solar.roofs];
                                    updated[index] = { ...updated[index], noOfPanels: safeNumber(e.target.value) };
                                    setFieldValue("solar.roofs", updated);
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            setFieldValue("solar.roofs", [
                              ...values.solar.roofs,
                              { roofPitch: "", roofOrientation: "South", noOfPanels: 0 },
                            ])
                          }
                        >
                          Add Roof
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Inverters</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.noOfInverters}
                          type="number"
                          onChange={(e) => setFieldValue("solar.noOfInverters", safeNumber(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Inverter Install Type</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(installTypeOptions, values.solar.inverterInstallType)}
                          options={installTypeOptions}
                          onChange={(e) => setFieldValue("solar.inverterInstallType", e?.value || "")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Batteries</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.noOfBatteries}
                          type="number"
                          onChange={(e) => setFieldValue("solar.noOfBatteries", safeNumber(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Battery Install Type</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(installTypeOptions, values.solar.batteryInstallType)}
                          options={installTypeOptions}
                          onChange={(e) => setFieldValue("solar.batteryInstallType", e?.value || "")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Additional Products</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.additionalProducts}
                          onChange={(e) => setFieldValue("solar.additionalProducts", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Finance Application Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.financeApplicationDate || null}
                            onChange={(e) => setFieldValue("solar.financeApplicationDate", e)}
                            error={Boolean(getFieldError("financeApplicationDate"))}
                            helperText={getFieldError("financeApplicationDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>DNO Submission Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.dnoApplicationSubmissionDate || null}
                            onChange={(e) => setFieldValue("solar.dnoApplicationSubmissionDate", e)}
                            error={Boolean(getFieldError("dnoApplicationSubmissionDate"))}
                            helperText={getFieldError("dnoApplicationSubmissionDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>DNO Approval Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.approvalDate || null}
                            onChange={(e) => setFieldValue("solar.approvalDate", e)}
                            error={Boolean(getFieldError("approvalDate"))}
                            helperText={getFieldError("approvalDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Contract Signed Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.contractSignedDate || null}
                            onChange={(e) => setFieldValue("solar.contractSignedDate", e)}
                            error={Boolean(getFieldError("contractSignedDate"))}
                            helperText={getFieldError("contractSignedDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Scaffolding Company</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.scaffoldingCompany}
                          onChange={(e) => setFieldValue("solar.scaffoldingCompany", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Scaffolding Up Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.scaffoldingUpDate || null}
                            onChange={(e) => setFieldValue("solar.scaffoldingUpDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Scaffolding Down Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.scaffoldingDownDate || null}
                            onChange={(e) => setFieldValue("solar.scaffoldingDownDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Roofing Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.roofingDate || null}
                            onChange={(e) => setFieldValue("solar.roofingDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Roofer Assigned</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.rooferAssigned}
                          onChange={(e) => setFieldValue("solar.rooferAssigned", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Electrical Work Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.electricalWorkDate || null}
                            onChange={(e) => setFieldValue("solar.electricalWorkDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Electrician Assigned</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.electricianAssigned}
                          onChange={(e) => setFieldValue("solar.electricianAssigned", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Handover Paperwork Signed</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.handoverPaperworkSigned)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.handoverPaperworkSigned", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>HIES Registration Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.hiesRegistrationDate || null}
                            onChange={(e) => setFieldValue("solar.hiesRegistrationDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>MCS Registration Complete</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.mcsRegistrationComplete)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.mcsRegistrationComplete", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Building Regulations Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.buildingRegulationsDate || null}
                            onChange={(e) => setFieldValue("solar.buildingRegulationsDate", e)}
                            error={Boolean(getFieldError("buildingRegulationsDate"))}
                            helperText={getFieldError("buildingRegulationsDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>EPVS Completion</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <div>
                          <Select
                            value={toOption(yesNoOptions, values.solar.epvsCompletion)}
                            options={yesNoOptions}
                            onChange={(e) => setFieldValue("solar.epvsCompletion", e?.value || "No")}
                          />
                          {getFieldError("epvsCompletion") && (
                            <div style={{ color: "#d32f2f", marginTop: 6, fontSize: 12 }}>
                              {getFieldError("epvsCompletion")}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Handover Pack Sent</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.handoverPackSent)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.handoverPackSent", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    {values.solar.handoverPackSent === "Yes" && (
                      <tr>
                        <td style={{ border: "1px solid #ddd", padding: 10 }}>Job Status</td>
                        <td style={{ border: "1px solid #ddd", padding: 10, fontWeight: 700 }}>
                          Complete / Solar Maintenance ready
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Total Agreed Amount</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.agreedAmount}
                          type="number"
                          onChange={(e) => setFieldValue("solar.agreedAmount", safeNumber(e.target.value))}
                          error={Boolean(getFieldError("agreedAmount"))}
                          helperText={getFieldError("agreedAmount")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Deposit Paid Amount</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.depositPaidAmount}
                          type="number"
                          onChange={(e) => setFieldValue("solar.depositPaidAmount", safeNumber(e.target.value))}
                          error={Boolean(getFieldError("depositPaidAmount"))}
                          helperText={getFieldError("depositPaidAmount")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Net Cost</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.netCost}
                          onChange={(e) => setFieldValue("solar.netCost", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Final Payment</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.solar.finalPayment}
                          type="number"
                          onChange={(e) => setFieldValue("solar.finalPayment", safeNumber(e.target.value))}
                          error={Boolean(getFieldError("finalPayment"))}
                          helperText={getFieldError("finalPayment")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Final Payment Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.finalPaymentDate || null}
                            onChange={(e) => setFieldValue("solar.finalPaymentDate", e)}
                            error={Boolean(getFieldError("finalPaymentDate"))}
                            helperText={getFieldError("finalPaymentDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Installation Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.installationDate || null}
                            onChange={(e) => setFieldValue("solar.installationDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Job Completion Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.solar.jobCompletionDate || null}
                            onChange={(e) => setFieldValue("solar.jobCompletionDate", e)}
                            error={Boolean(getFieldError("jobCompletionDate"))}
                            helperText={getFieldError("jobCompletionDate")}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>DNO Approval</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.dnoApproval)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.dnoApproval", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>DNO Approved</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.dnoApproved)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.dnoApproved", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>VAT Applicable</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(yesNoOptions, values.solar.vatApplicable)}
                          options={yesNoOptions}
                          onChange={(e) => setFieldValue("solar.vatApplicable", e?.value || "No")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>HIES Cert No</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.hiesRegCertNo}
                          onChange={(e) => setFieldValue("hiesRegCertNo", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>MCS Cert No</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.mcsRegCertNo}
                          onChange={(e) => setFieldValue("mcsRegCertNo", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Build Reg Cert No</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={values.buildRegCerNo}
                          onChange={(e) => setFieldValue("buildRegCerNo", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Deposit Payment Date</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            clearable
                            variant="dialog"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={values.depositPaymentDate || null}
                            onChange={(e) => setFieldValue("depositPaymentDate", e)}
                            fullWidth
                          />
                        </MuiPickersUtilsProvider>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Payment Method</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <Select
                          value={toOption(paymentOptions, values.paymentMethod)}
                          options={paymentOptions}
                          onChange={(e) => setFieldValue("paymentMethod", e?.value || "")}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>Notes</td>
                      <td style={{ border: "1px solid #ddd", padding: 10 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          multiline
                          rows={3}
                          value={values.notes}
                          onChange={(e) => setFieldValue("notes", e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || startLoader}>
                  Save Paid Solar Sheet
                </Button>
                {startLoader && <CircularProgress size={24} style={{ marginLeft: 12 }} />}
                {Object.keys(values).length > 0 && Object.keys((errors && errors.solar) || {}).length > 0 && (
                  <div style={{ marginTop: 12, color: "#d32f2f", fontWeight: 600 }}>
                    Please fix the highlighted finance and completion fields before saving.
                  </div>
                )}
              </Grid>
            </Grid>
          </form>
        );
        }}
      </Formik>
    </div>
  );
}
