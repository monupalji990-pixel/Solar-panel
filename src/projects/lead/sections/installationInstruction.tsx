import React, { useState, useEffect, useMemo } from "react";
import { FieldArray, Formik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import LeadApi from "../redux/model/lead";
import { Divider, Snackbar } from "@material-ui/core";
import Select from "react-select";
import {
  HeatingOptions,
  RoofSpacesOptions,
  WallAreasOptions,
} from "sharedUtils/globalHelper/constantValues";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

export default function InstallationInstructionApp(props) {
  const classes = useStyles();
  const customeProps = props;

  const leadDigiDash = props.singleLead?.digitalDashboard;
  let measuresArray = leadDigiDash?.measuresBeingDone || [];
  if (leadDigiDash?.measuresBeingDone?.length > 0) {
    let arr = leadDigiDash?.measuresBeingDone?.map((e) => e.label);
    measuresArray = arr.join(", ");
  }

  let measuresLabelArray = [];
  if (leadDigiDash?.measuresBeingDone?.length > 0) {
    let arr = leadDigiDash?.measuresBeingDone?.map((e) => e.label);
    measuresLabelArray = arr;
  }

  const [startLoader, setStartLoader] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (props.hideSideBar && startLoader) {
      setStartLoader(false);
    }
  }, [props.hideSideBar]);

  const getCustomerName = () => {
    if (props.singleLead?.Consumer?._id) {
      return props.singleLead?.Consumer?.firstName
        ? props.singleLead?.Consumer?.title +
            " " +
            props.singleLead?.Consumer?.firstName +
            " " +
            props.singleLead?.Consumer?.surName
        : "";
    } else if (props.currentQuote?.Consumer?._id) {
      return props.currentQuote.Consumer?.firstName
        ? props.currentQuote.Consumer?.title +
            " " +
            props.currentQuote.Consumer?.firstName +
            " " +
            props.currentQuote.Consumer?.surName
        : "";
    } else if (props.singleLead?.Company?._id) {
      return props.singleLead?.Company?.businessName
        ? props.singleLead?.Company?.businessName
        : "";
    } else if (props.currentQuote?.Company?._id) {
      return props.currentQuote?.Company?.businessName
        ? props.currentQuote?.Company?.businessName
        : "";
    }
  };

  const getCCAddress = () => {
    if (props.singleLead?.Consumer?.addressOne) {
      return props.singleLead?.Consumer?.addressOne;
    } else if (props.currentQuote?.Consumer?.addressOne) {
      return props.currentQuote?.Consumer?.addressOne;
    } else if (props.singleLead?.Company?.address) {
      return props.singleLead?.Company?.address;
    } else if (props.currentQuote?.Company?.address) {
      return props.currentQuote?.Company?.address;
    }
  };

  const getCCNumber = () => {
    if (props.singleLead?.Consumer?.mobile) {
      return props.singleLead?.Consumer?.mobile;
    } else if (props.currentQuote?.Consumer?.mobile) {
      return props.currentQuote?.Consumer?.mobile;
    } else if (props.singleLead?.Contact?.mobile) {
      return props.singleLead?.Contact?.mobile;
    } else if (props.currentQuote?.Contact?.mobile) {
      return props.currentQuote?.Contact?.mobile;
    }
  };

  const getCCPostcode = () => {
    if (props.singleLead?.Consumer?.postcode) {
      return props.singleLead?.Consumer?.postcode;
    } else if (props.currentQuote?.Consumer?.postcode) {
      return props.currentQuote?.Consumer?.postcode;
    } else if (props.singleLead?.Company?.postcode) {
      return props.singleLead?.Company?.postcode;
    } else if (props.currentQuote?.Company?.postcode) {
      return props.currentQuote?.Company?.postcode;
    }
  };

  const getCBbatchNumber = () => {
    if (leadDigiDash?.CB_batchNumber) {
      return leadDigiDash?.CB_batchNumber;
    }
    return "";
  };

  const getCBGlueQuantity = () => {
    if (leadDigiDash?.CB_glueQuantity) {
      return leadDigiDash?.CB_glueQuantity;
    }
    return "";
  };

  let initialValues = {
    customerName: getCustomerName(),
    customerAddress: getCCAddress(),
    mobile: getCCNumber(),
    postcode: getCCPostcode(),
    construct: leadDigiDash?.build?.label || "",
    floor: leadDigiDash?.totalFloorAreaM2?.label || "",
    previous: leadDigiDash?.ABS || "",
    property: "",
    measures: "",
    trickleVents: "",
    extFan1: "",
    extFan2: "",
    extFan3: "",
    extFan4: "",
    extFan5: "",
    preEPC: leadDigiDash?.PreEPRRating?.label || "",
    postEPC: leadDigiDash?.PostEPRRating?.label || "",
    preEPCRating: "",
    postEPCRating: "",
    preNotes: "",
    postNotes: "",
    roofSpaces: "",
    wallAreas: "",
    wallType: "",
    preEvidenceWall: "",
    wallPostRequirement: "",
    wallremarks: "",
    heating: "",
    location: "",
    heatingPreEvidence: "",
    heatingPostRequirement: "",
    heatingRemarks: "",
    ventilationLocation: "",
    ventilationHeatingPreEvidence: "",
    ventilationheatingPostRequirement: "",
    ventilationheatingRemarks: "",
    roofSpacesFields: [],
    wallAreasFields: [],
    heatingFields: [],
    CB_batchNumber: getCBbatchNumber(),
    CB_glueQuantity: getCBGlueQuantity(),
  };

  const [initialData, setInitialData] = useState({ ...initialValues });

  useEffect(() => {
    if (props.singleLead?.digitalDashboard) {
      let InitDigitalData = {
        ...props.singleLead?.digitalDashboard?.installationInstruction,
      };
      setInitialData({ ...initialData, ...InitDigitalData });
    } else if (
      props.currentQuote?.digitalDashboard?.installationInstruction &&
      props.showingFrom === "viewQuote"
    ) {
      let InitDigitalData = {
        ...props.currentQuote?.digitalDashboard?.installationInstruction,
      };
      setInitialData({ ...initialData, ...InitDigitalData });
    }
  }, []);

  // const DownloadPDF = () => {
  //     return useMemo(
  //         () => (
  //             <PDFDownloadLink document={<PDFDocument data={customeProps.singleLead?.digitalDashboard?.installationInstruction} measuresArray={measuresArray} />} fileName={`${getCustomerName() + '_' + 'InstallationIntruction'}.pdf`}>
  //                 {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Export as PDF')}
  //             </PDFDownloadLink>
  //         ), [],
  //     )
  // }

  const downloadAttachment = async (fileData, fileType, fileName) => {
    try {
      // setIsFileDownloadInProgress(true);
      const typeArray = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        pdf: "application/pdf",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const blob = fileData;
      // setIsFileDownloadInProgress(false);
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
        new Blob([blob as ArrayBuffer], { type: typeArray[fileType] })
      );
      a.setAttribute("download", fileName);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } catch (error) {}
  };

  const generatePDF = () => {
    setIsLoading(true);
    LeadApi.getPdfReqAPI({
      ...props.singleLead?.digitalDashboard?.installationInstruction,
      measuresArray: measuresArray,
    }).then((response: any) => {
      if (response) {
        let bString = response;
        let bLength = bString.length;
        let bytes = new Uint8Array(bLength);
        // let bytes = new Array(bLength);
        for (let i = 0; i < bLength; i++) {
          let ascii = response.charCodeAt(i);
          bytes[i] = ascii;
        }
        downloadAttachment(bytes, "pdf", `Installation_Instruction`);
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={true}
          autoHideDuration={2000}
          // onClose={handleClose}
          message="PDF Generated Successfully!"
        />;
      }
      setIsLoading(false);
    });
  };

  const handleChangeRoofSpace = (value, setFieldValue) => {
    let updatedData = [...initialData.roofSpacesFields];
    // Remove values not present in the new API data
    updatedData = updatedData.filter((existingItem) => {
      return value && value.some((d) => d.label === existingItem.label);
    });

    if (value && value.length > 0) {
      value.forEach((e) => {
        // Check if the label already exists in the data
        const existingIndex = updatedData.findIndex(
          (item) => item.label === e.label
        );

        if (existingIndex !== -1) {
          // If label exists, update the values
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            label: e.label,
            // Update other fields as needed
          };
        } else {
          // If label doesn't exist, add it to the data
          updatedData.push({
            label: e.label,
            roofType: "",
            preEvidence: "",
            postEvidence: "",
            remarks: "",
          });
        }
      });
    }

    setFieldValue("roofSpacesFields", updatedData);
  };

  const handleChangeWallAreas = (value, setFieldValue) => {
    let updatedData = [...initialData.wallAreasFields];
    // Remove values not present in the new API data
    updatedData = updatedData.filter((existingItem) => {
      return value && value.some((d) => d.label === existingItem.label);
    });

    if (value && value.length > 0) {
      value.forEach((e) => {
        // Check if the label already exists in the data
        const existingIndex = updatedData.findIndex(
          (item) => item.label === e.label
        );

        if (existingIndex !== -1) {
          // If label exists, update the values
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            label: e.label,
            // Update other fields as needed
          };
        } else {
          // If label doesn't exist, add it to the data
          updatedData.push({
            label: e.label,
            wallType: "",
            preEvidence: "",
            wallPostRequirement: "",
            remarks: "",
          });
        }
      });
    }

    setFieldValue("wallAreasFields", updatedData);
  };

  const handleChangeheating = (value, setFieldValue) => {
    let updatedData = [...initialData.heatingFields];
    // Remove values not present in the new API data
    updatedData = updatedData.filter((existingItem) => {
      return value && value.some((d) => d.label === existingItem.label);
    });

    if (value && value.length > 0) {
      value.forEach((e) => {
        // Check if the label already exists in the data
        const existingIndex = updatedData.findIndex(
          (item) => item.label === e.label
        );

        if (existingIndex !== -1) {
          // If label exists, update the values
          updatedData[existingIndex] = {
            ...updatedData[existingIndex],
            label: e.label,
            // Update other fields as needed
          };
        } else {
          // If label doesn't exist, add it to the data
          updatedData.push({
            label: e.label,
            location: "",
            preEvidence: "",
            postRequirement: "",
            remarks: "",
          });
        }
      });
    }

    setFieldValue("heatingFields", updatedData);
  };

  return (
    <div style={{ width: "100%", padding: 10 }} className="lead-digital-dash">
      <Formik
        enableReinitialize
        initialValues={{ ...initialData }}
        onSubmit={(values) => {
          try {
            setStartLoader(true);
            let obj: any = {};
            obj.leadId = props.singleLead._id;
            obj.serviceType = props.singleLead.serviceType;
            obj.digitalDashboard = {
              ...props.singleLead.digitalDashboard,
              installationInstruction: values,
            };
            props._leadUpdate({
              data: obj,
              showingFrom: props.showingFrom,
            });
          } catch (error) {
            console.log("error--------", error);
          }
        }}
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
                <Grid item md={6} sm={6} xs={12}>
                  <label htmlFor="customerName">Customer Name</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="customerName"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.customerName}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="customerName-error"
                  />
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <label htmlFor="customerAddress">Customer Address</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="customerAddress"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.customerAddress}
                    // InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="customerAddress-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={6} xs={12}>
                  <label htmlFor="mobile">Mobile Number</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="mobile"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.mobile}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="mobile-error"
                  />
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <label htmlFor="postcode">Postcode</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="postcode"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.postcode}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="postcode-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="construct">Construct</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="construct"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.construct}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="construct-error"
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="floor">Floor</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="floor"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.floor}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="floor-error"
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12}>
                  <label htmlFor="previous">ABS</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="previous"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.previous}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="previous-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <label htmlFor="property">Property</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="property"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.property}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="property-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <label htmlFor="measures">Measures</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="measures"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.measures}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="measures-error"
                  />
                </Grid>
              </Grid>

              {/* Roof Details */}
              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="roofSpaces">Roof Spaces</label>
                  <Select
                    id="roofSpaces"
                    placeholder="Select Roof Spaces"
                    value={values.roofSpaces}
                    onChange={(e) => {
                      setFieldValue("roofSpaces", e);
                      handleChangeRoofSpace(e, setFieldValue);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    name="roofSpaces"
                    options={RoofSpacesOptions}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <FieldArray
                  name="roofSpacesFields"
                  render={(arrayHelpers) =>
                    values.roofSpacesFields &&
                    values.roofSpacesFields.length > 0 &&
                    values.roofSpacesFields.map((ele, index) => (
                      <div key={index} style={{ width: "100%" }}>
                        <label className="array-field-label">
                          {ele.label || ""}
                        </label>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="roofType">Roof Type</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`roofSpacesFields.${index}.roofType`}
                              name={`roofSpacesFields.${index}.roofType`}
                              className="WidhtFull100"
                              placeholder="Enter Roof Type"
                              value={ele.roofType}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="roofType-error"
                            />
                          </Grid>

                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="preEvidence">Pre Evidence</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`roofSpacesFields.${index}.preEvidence`}
                              name={`roofSpacesFields.${index}.preEvidence`}
                              className="WidhtFull100"
                              placeholder="Enter Pre Evidence"
                              value={ele.preEvidence}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="preEvidence-error"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="postEvidence">Post Evidence</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`roofSpacesFields.${index}.postEvidence`}
                              name={`roofSpacesFields.${index}.postEvidence`}
                              className="WidhtFull100"
                              placeholder="Enter Post Evidence"
                              value={ele.postEvidence}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="postEvidence-error"
                            />
                          </Grid>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="remarks">Remarks</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`roofSpacesFields.${index}.remarks`}
                              name={`roofSpacesFields.${index}.remarks`}
                              className="WidhtFull100"
                              placeholder="Enter Remarks"
                              value={ele.remarks}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="remarks-error"
                            />
                          </Grid>
                        </Grid>
                      </div>
                    ))
                  }
                />
              </Grid>

              <Divider style={{ margin: 20 }} />

              {/* Wall Details */}

              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="wallAreas">Wall Areas</label>
                  <Select
                    id="wallAreas"
                    placeholder="Select Wall Areas"
                    value={values.wallAreas}
                    onChange={(e) => {
                      setFieldValue("wallAreas", e);
                      handleChangeWallAreas(e, setFieldValue);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    name="wallAreas"
                    options={WallAreasOptions}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <FieldArray
                  name="wallAreasFields"
                  render={(arrayHelpers) =>
                    values.wallAreasFields &&
                    values.wallAreasFields.length > 0 &&
                    values.wallAreasFields.map((ele, index) => (
                      <div key={index} style={{ width: "100%" }}>
                        <label className="array-field-label">
                          {ele.label || ""}
                        </label>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="wallType">Wall Type</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`wallAreasFields.${index}.wallType`}
                              name={`wallAreasFields.${index}.wallType`}
                              className="WidhtFull100"
                              placeholder="Enter Wall Type"
                              value={ele.wallType}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="wallType-error"
                            />
                          </Grid>

                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="preEvidence">Pre Evidence</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`wallAreasFields.${index}.preEvidence`}
                              name={`wallAreasFields.${index}.preEvidence`}
                              className="WidhtFull100"
                              placeholder="Enter Pre Evidence"
                              value={ele.preEvidence}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="preEvidence-error"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="wallPostRequirement">
                              Post Requirement
                            </label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`wallAreasFields.${index}.wallPostRequirement`}
                              name={`wallAreasFields.${index}.wallPostRequirement`}
                              className="WidhtFull100"
                              placeholder="Enter Post Requirement"
                              value={ele.wallPostRequirement}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="wallPostRequirement-error"
                            />
                          </Grid>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="remarks">Remarks</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`wallAreasFields.${index}.remarks`}
                              name={`wallAreasFields.${index}.remarks`}
                              className="WidhtFull100"
                              placeholder="Enter Remarks"
                              value={ele.remarks}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="remarks-error"
                            />
                          </Grid>
                        </Grid>
                      </div>
                    ))
                  }
                />
              </Grid>

              <Divider style={{ margin: 20 }} />

              {measuresLabelArray.includes("Cavity Bead") && (
                <Grid container spacing={3}>
                  <Grid item md={6} sm={6} xs={12}>
                    <label htmlFor="CB_batchNumber">
                      Cavity Bead - Batch Number
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="CB_batchNumber"
                      className="WidhtFull100"
                      placeholder="Enter value here"
                      value={values.CB_batchNumber}
                      // InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CB_batchNumber-error"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <label htmlFor="CB_glueQuantity">
                      Cavity Bead - Quantity of Glue
                    </label>
                    <TextField
                      variant="outlined"
                      size="small"
                      id="CB_glueQuantity"
                      className="WidhtFull100"
                      placeholder="Enter value here"
                      value={values.CB_glueQuantity}
                      // InputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: false }}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="CB_glueQuantity-error"
                    />
                  </Grid>
                </Grid>
              )}

              <Divider style={{ margin: 20 }} />

              {/* Heating Details */}
              <Grid container spacing={3}>
                <Grid item xs>
                  <label htmlFor="heating">Heating</label>
                  <Select
                    id="heating"
                    placeholder="Select Heating"
                    value={values.heating}
                    onChange={(e) => {
                      setFieldValue("heating", e);
                      handleChangeheating(e, setFieldValue);
                    }}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        maxHeight: "80px",
                      }),
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    name="heating"
                    options={HeatingOptions}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <FieldArray
                  name="heatingFields"
                  render={(arrayHelpers) =>
                    values.heatingFields &&
                    values.heatingFields.length > 0 &&
                    values.heatingFields.map((ele, index) => (
                      <div key={index} style={{ width: "100%" }}>
                        <label className="array-field-label">
                          {ele.label || ""}
                        </label>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="location">Location</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`heatingFields.${index}.location`}
                              name={`heatingFields.${index}.location`}
                              className="WidhtFull100"
                              placeholder="Enter Location"
                              value={ele.location}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="location-error"
                            />
                          </Grid>

                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="preEvidence">Pre Evidence</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`heatingFields.${index}.preEvidence`}
                              name={`heatingFields.${index}.preEvidence`}
                              className="WidhtFull100"
                              placeholder="Enter Pre Evidence"
                              value={ele.preEvidence}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="preEvidence-error"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="postRequirement">
                              Post Requirement
                            </label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`heatingFields.${index}.postRequirement`}
                              name={`heatingFields.${index}.postRequirement`}
                              className="WidhtFull100"
                              placeholder="Enter Post Requirement"
                              value={ele.postRequirement}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="postRequirement-error"
                            />
                          </Grid>
                          <Grid item md={6} sm={6} xs={12}>
                            <label htmlFor="remarks">Remarks</label>
                            <TextField
                              variant="outlined"
                              size="small"
                              id={`heatingFields.${index}.remarks`}
                              name={`heatingFields.${index}.remarks`}
                              className="WidhtFull100"
                              placeholder="Enter Remarks"
                              value={ele.remarks}
                              InputLabelProps={{ shrink: false }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="remarks-error"
                            />
                          </Grid>
                        </Grid>
                      </div>
                    ))
                  }
                />
              </Grid>

              <Divider style={{ margin: 20 }} />

              <h3 style={{ marginTop: 20, marginBottom: 10 }}>
                <strong>Ventilation</strong>
              </h3>
              <Grid container spacing={3}>
                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="trickleVents">Trickle vents</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="trickleVents"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.trickleVents}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="trickleVents-error"
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="extFan1">Ext Fan1</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="extFan1"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.extFan1}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="extFan1-error"
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="extFan2">Ext Fan2</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="extFan2"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.extFan2}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="extFan2-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="extFan3">Ext Fan3</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="extFan3"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.extFan3}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="extFan3-error"
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="extFan4">Ext Fan4</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="extFan4"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.extFan4}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="extFan4-error"
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <label htmlFor="extFan5">Ext Fan5</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="extFan5"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.extFan5}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="extFan5-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="preEPC">Pre EPC</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="preEPC"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.preEPC}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="preEPC-error"
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="postEPC">Post EPC</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="postEPC"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.postEPC}
                    InputLabelProps={{ shrink: false }}
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="postEPC-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="preEPCRating">Rating</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="preEPCRating"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.preEPCRating}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="preEPCRating-error"
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="postEPCRating">Rating</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="postEPCRating"
                    className="WidhtFull100"
                    placeholder="Enter value here"
                    value={values.postEPCRating}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="postEPCRating-error"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="preNotes">Notes</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="preNotes"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.preNotes}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="preNotes-error"
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <label htmlFor="postNotes">Notes</label>
                  <TextField
                    variant="outlined"
                    size="small"
                    id="postNotes"
                    className="WidhtFull100"
                    placeholder="Enter note here"
                    value={values.postNotes}
                    multiline
                    rows={3}
                    InputLabelProps={{ shrink: false }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="postNotes-error"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item md={4} sm={12} xs={12} className="measures_services">
                  <h4>Measures</h4>
                  {leadDigiDash?.measuresBeingDone &&
                  leadDigiDash?.measuresBeingDone?.length > 0
                    ? leadDigiDash?.measuresBeingDone.map((e, index) => (
                        <div key={index}>
                          <span>{e.label}</span>
                        </div>
                      ))
                    : "No Data Found"}
                </Grid>
              </Grid>

              <Grid container spacing={3} style={{ marginTop: 20 }}>
                <Grid item>
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                  {startLoader && <CircularProgress />}
                </Grid>
                {/* <Grid item className='export_pdf_btn'>
                                    <a href="https://edan-power.s3.amazonaws.com/d22go1819785oh8hwb-1699722271333.pdf" target="_blank">Export as PDF</a>
                                </Grid> */}
                {customeProps.singleLead?.digitalDashboard
                  ?.installationInstruction && (
                  <Grid item className="export_pdf_btn">
                    <Button
                      size="medium"
                      variant="contained"
                      color="default"
                      type="button"
                      onClick={generatePDF}
                    >
                      Export as PDF
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
