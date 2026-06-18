import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import { selectLeadState } from "projects/lead/redux/lead";
import { FieldArray } from 'formik';
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { CardActions, CircularProgress, InputAdornment } from "@material-ui/core";

export default function SolarPaid(props) {
  const leadState = useSelector(selectLeadState);
  const currentProps = props;
  const shirnkInput = props.isFromLead;
  const [startLoader, setStartLoader] = useState(false);
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [postcode, setPostcode] = useState("");
  const [isPanels, setPanels] = useState([]);
  const [isInverters, setInverters] = useState([]);
  const [isBatteries, setBatteries] = useState([]);
  const [checked, setChecked] = React.useState('');
  const [noOfRoofs, setNoOfRoofs] = useState(props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs?.length || 0);
  const [dnoApproval, setDNOApproval] = React.useState(props.serviceDataFromLead?.subservice?.solar?.dnoApproval || "No");
  const [dnoApproved, setDNOApproved] = React.useState(props.serviceDataFromLead?.subservice?.solar?.dnoApproved || "");

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  const handleDNOApproval = (event) => {
    setDNOApproval(event.target.value);
  }

  const handleDNOApproved = (event) => {
    setDNOApproved(event.target.value);
  }

  const handleChangePanels = (value, index) => {
    let arr = []
    for (let i = 0; i < value; i++) {
      arr.push({});
    }
    isPanels[index] = arr
    setPanels(isPanels);
  }

  const handleChangeInverters = (value) => {
    let inv = []
    for (let i = 0; i < (value); i++) {
      inv.push({});
    }
    setInverters(inv);
  }

  const handleChangeBatteries = (value) => {
    let bat = []
    for (let i = 0; i < value; i++) {
      bat.push({});
    }
    setBatteries(bat);
  }

  const handleChangeCheck = (event) => {
    setChecked(event.target.value);
  }

  let roofsArr = []
  for (let i = 0; i < noOfRoofs; i++) {
    roofsArr.push(props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs ? props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs[i] : {
      roofPitch: '',
      roofOrientation: '',
      numberOfPanels: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
    });
  }

  let leadServiceDataInit: any = null;

  if (props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = {
      ...props.serviceDataFromLead,
      numberOfRoofs: (roofsArr.length > 0 && roofsArr.length < 21) ? roofsArr : [{
        roofPitch: '',
        roofOrientation: '',
        numberOfPanels: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
      }],
      numberOfInverters: [{}],
      numberOfBatteries: [{}],
    };
  }

  let ii = {
    saveLeadData: false,
    roofsPanelsInstalled: '',
    noOfInverters: '',
    noOfBatteries: '',
    noOfPanels: '',
    numberOfRoofs: (roofsArr.length > 0 && roofsArr.length < 21) ? roofsArr : [
      {
        roofPitch: '',
        roofOrientation: '',
        numberOfPanels: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
      }
    ],
    numberOfInverters: [{}],
    numberOfBatteries: [{}],
    peakSystemOutput: '',
    systemSize: '',
    offeredQuotation: '',
    agreedAmount: '',
    netCost: '',
    vat: '',
    discount: '',
    finalPayment: '',
    finalPaymentDate: null,
    installationDate: null,
    propertyType: '',
    roofStyle: '',
    roofMaterial: '',
    shading: '',
    ownership: '',
    jobCompletionDate: '',
    dnoApproval: '',
    dnoApproved: '',
    customer_charge: '',
  };

  useEffect(() => {
    let number = []
    ii?.numberOfRoofs?.forEach((x, index) => {
      let arr = []
      for (let i = 0; i < x.numberOfPanels; i++) {
        arr.push({
          roofPitch: '',
          roofOrientation: '',
          numberOfPanels: '',
          manufacturer: '',
          model: '',
          serialNumber: '',
        });
      }
      number[index] = arr;
    })

    let arr2 = []
    for (let i = 0; i < ii.noOfInverters.length; i++) {
      arr2.push({});
    }
    let arr3 = []
    for (let i = 0; i < ii.noOfBatteries.length; i++) {
      arr3.push({});
    }

    setPanels(number);
    setInverters(arr2);
    setBatteries(arr3)
  }, []);

  return (
    <div className="app" >
      <Formik
        initialValues={(leadServiceDataInit !== null ? leadServiceDataInit : ii)}
        onSubmit={(value) => {                    
          const qu: any = {};
          let SupplerID = "";

          if (value.agreedAmount) qu.agreedAmount = value.agreedAmount;
          if (value.finalPayment) qu.finalPayment = value.finalPayment;
          if (value.finalPaymentDate) qu.finalPaymentDate = new Date(value.finalPaymentDate).getTime();
          if (value.installationDate) qu.installationDate = new Date(value.installationDate).getTime();
          if (value.jobCompletionDate) qu.jobCompletionDate = new Date(value.finalPaymentDate).getTime();
          if (value.netCost) qu.netCost = value.netCost;
          if (value.noOfBatteries) qu.noOfBatteries = value.noOfBatteries;
          if (value.noOfInverters) qu.noOfInverters = value.noOfInverters;
          if (value.noOfPanels) qu.noOfPanels = value.noOfPanels;
          if (value.numberOfBatteries) qu.numberOfBatteries = value.numberOfBatteries;
          if (value.numberOfInverters) qu.numberOfInverters = value.numberOfInverters;
          if (value.numberOfRoofs) qu.numberOfRoofs = value.numberOfRoofs;
          if (value.offeredQuotation) qu.offeredQuotation = value.offeredQuotation;
          if (value.ownership) qu.ownership = value.ownership;
          if (value.peakSystemOutput) qu.peakSystemOutput = value.peakSystemOutput;
          if (value.propertyType) qu.propertyType = value.propertyType;
          if (value.roofMaterial) qu.roofMaterial = value.roofMaterial;
          if (value.roofStyle) qu.roofStyle = value.roofStyle;
          if (value.roofsPanelsInstalled) qu.roofsPanelsInstalled = value.roofsPanelsInstalled;
          if (value.shading) qu.shading = value.shading;
          if (value.systemSize) qu.systemSize = value.systemSize;
          if (value.vat) qu.vat = value.vat;
          if (dnoApproval) qu.dnoApproval = dnoApproval;
          if (dnoApproved) qu.dnoApproved = dnoApproved;

          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { paidsolar: qu }, service: 'paidsolar' });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                paidsolar: qu,
                Supplier: SupplerID
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          roofsPanelsInstalled: Yup.string().required("No. of Roofs is required"),
          noOfInverters: Yup.string().required("No. of Inverters"),
          noOfBatteries: Yup.string().required("No. of Batteries"),
          noOfPanels: Yup.string().required("Total No. of Panels"),
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
            submitForm
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.roofsPanelsInstalled ? true : false}
                    name="roofsPanelsInstalled"
                    label="No. of Roofs"
                    value={values?.roofsPanelsInstalled}
                    type="number"
                    InputProps={{
                      inputProps: {
                        max: 20, min: 0
                      }
                    }}
                    onChange={(event) => {
                      // setNoOfRoofs(event.target.value)
                      let roofArray = []
                      for (let i: any = 0; i < event.target.value; i++) {
                        roofArray.push({
                          roofPitch: '',
                          roofOrientation: '',
                          numberOfPanels: '',
                          manufacturer: '',
                          model: '',
                          serialNumber: '',
                        })
                      }
                      setFieldValue('numberOfRoofs', roofArray)
                      handleChange(event)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="roofsPanelsInstalled-error"
                    className="WidhtFull100"
                  />
                  {errors.roofsPanelsInstalled && (
                    <FormHelperText className="errormsg" id="roofsPanelsInstalled-error">
                      {errors.roofsPanelsInstalled}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.noOfInverters ? true : false}
                    name="noOfInverters"
                    label="No. of Inverters"
                    value={values.noOfInverters}
                    onChange={(event) => {
                      handleChangeInverters(event.target.value)
                      handleChange(event)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="noOfInverters-error"
                    className="WidhtFull100"
                  />
                  {errors.noOfInverters && (
                    <FormHelperText className="errormsg" id="noOfInverters-error">
                      {errors.noOfInverters}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.noOfBatteries ? true : false}
                    name="noOfBatteries"
                    label="No. of Batteries"
                    value={values.noOfBatteries}
                    onChange={(event) => {
                      handleChangeBatteries(event.target.value)
                      handleChange(event)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="noOfBatteries-error"
                    className="WidhtFull100"
                  />
                  {errors.noOfBatteries && (
                    <FormHelperText className="errormsg" id="noOfBatteries-error">
                      {errors.noOfBatteries}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.noOfPanels ? true : false}
                    name="noOfPanels"
                    label="Total No. of Panels"
                    value={values.noOfPanels}
                    onChange={(event) => {
                      handleChange(event)
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="noOfPanels-error"
                    className="WidhtFull100"
                  />
                  {errors.noOfPanels && (
                    <FormHelperText className="errormsg" id="noOfPanels-error">
                      {errors.noOfPanels}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <h3 style={{ marginBottom: 20 }}>Based on number of roofs</h3>
                  <FieldArray
                    name="numberOfRoofs"
                    render={arrayHelpers => (
                      <div>
                        {values.numberOfRoofs && values.numberOfRoofs.length > 0 ? (
                          values.numberOfRoofs.map((ele, index) => (
                            <div key={index}>
                              <Grid container spacing={2}>
                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfRoofs.${index}.roofPitch`}
                                    id={`numberOfRoofs.${index}.roofPitch`}
                                    label="Roof Pitch"
                                    value={ele.roofPitch}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    InputLabelProps={{
                                      shrink: shirnkInput
                                    }}
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfRoofs.${index}.roofOrientation`}
                                    id={`numberOfRoofs.${index}.roofOrientation`}
                                    label="Roof Orientation"
                                    value={ele.roofOrientation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfRoofs.${index}.numberOfPanels`}
                                    id={`numberOfRoofs.${index}.numberOfPanels`}
                                    label="Number of Panels"
                                    value={ele.numberOfPanels}
                                    onChange={(event) => {
                                      handleChangePanels(event.target.value, index)
                                      handleChange(event)
                                    }}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfRoofs.${index}.manufacturer`}
                                    id={`numberOfRoofs.${index}.manufacturer`}
                                    label="Manufacturer"
                                    value={ele.manufacturer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfRoofs.${index}.model`}
                                    id={`numberOfRoofs.${index}.model`}
                                    label="Model"
                                    value={ele.model}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                {isPanels[index] && isPanels[index].map((x, ind) => (
                                  <Grid item>
                                    <TextField
                                      variant="outlined"
                                      name={`numberOfRoofs.${index}.serialNumber${ind}`}
                                      id={`numberOfRoofs.${index}.serialNumber${ind}`}
                                      label={`Serial Number ${ind + 1}`}
                                      value={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                      className="WidhtFull100"
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            </div>
                          ))
                        ) : (
                          <Button type="button" color="primary" size="small" onClick={() => arrayHelpers.push('')}>
                            Add Roofs
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <h3 style={{ marginBottom: 20 }}>Number of Inverters</h3>
                  <FieldArray
                    name="numberOfInverters"
                    render={arrayHelpers => (
                      <div>
                        {values.numberOfInverters && values.numberOfInverters.length > 0 ? (
                          values.numberOfInverters.map((ele, index) => (
                            <div key={index}>
                              <Grid container spacing={2}>
                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfInverters.${index}.manufacturer`}
                                    id={`numberOfInverters.${index}.manufacturer`}
                                    label="Manufacturer"
                                    value={ele.manufacturer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfInverters.${index}.model`}
                                    id={`numberOfInverters.${index}.model`}
                                    label="Model"
                                    value={ele.model}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                {isInverters && isInverters.map((x, ind) => (
                                  <Grid item>
                                    <TextField
                                      variant="outlined"
                                      name={`numberOfInverters.${index}.serialNumber${ind}`}
                                      id={`numberOfInverters.${index}.serialNumber${ind}`}
                                      label={`Serial Number ${ind + 1}`}
                                      value={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                      className="WidhtFull100"
                                    />
                                  </Grid>
                                ))}
                              </Grid>

                              {/* <Tooltip title="Remove">
                        <IconButton
                          color="secondary"
                          aria-label="Remove"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <IndeterminateCheckBoxSharpIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Add">
                        <IconButton
                          aria-label="Add"
                          color="primary"
                          onClick={() =>
                            arrayHelpers.push({
                              manufacturer: '',
                              model: '',
                            })
                          } >
                          <AddCircleSharpIcon />
                        </IconButton>
                      </Tooltip> */}
                            </div>
                          ))
                        ) : (
                          <Button type="button" color="primary" size="small" onClick={() => arrayHelpers.push('')}>
                            Add Inverters
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <h3 style={{ marginBottom: 20 }}>Number of Batteries</h3>
                  <FieldArray
                    name="numberOfBatteries"
                    render={arrayHelpers => (
                      <div>
                        {values.numberOfBatteries && values.numberOfBatteries.length > 0 ? (
                          values.numberOfBatteries.map((ele, index) => (
                            <div key={index}>
                              <Grid container spacing={2}>
                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfBatteries.${index}.manufacturer`}
                                    id={`numberOfBatteries.${index}.manufacturer`}
                                    label="Manufacturer"
                                    value={ele.manufacturer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                <Grid item>
                                  <TextField
                                    variant="outlined"
                                    name={`numberOfBatteries.${index}.model`}
                                    id={`numberOfBatteries.${index}.model`}
                                    label="Model"
                                    value={ele.model}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    margin="normal"
                                    className="WidhtFull100"
                                  />
                                </Grid>

                                {isBatteries && isBatteries.map((x, ind) => (
                                  <Grid item>
                                    <TextField
                                      variant="outlined"
                                      name={`numberOfBatteries.${index}.serialNumber${ind}`}
                                      id={`numberOfBatteries.${index}.serialNumber${ind}`}
                                      label={`Serial Number ${ind + 1}`}
                                      value={ele[`serialNumber${ind}`] ? ele[`serialNumber${ind}`] : ele.serialNumber}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      margin="normal"
                                      className="WidhtFull100"
                                    />
                                  </Grid>
                                ))}
                              </Grid>

                              {/* <Tooltip title="Remove">
                        <IconButton
                          color="secondary"
                          aria-label="Remove"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <IndeterminateCheckBoxSharpIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Add">
                        <IconButton
                          aria-label="Add"
                          color="primary"
                          onClick={() =>
                            arrayHelpers.push({
                              manufacturer: '',
                              model: '',
                            })
                          } >
                          <AddCircleSharpIcon />
                        </IconButton>
                      </Tooltip> */}
                            </div>
                          ))
                        ) : (
                          <Button type="button" color="primary" size="small" onClick={() => arrayHelpers.push('')}>
                            Add Batteries
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="peakSystemOutput"
                    label="Peak System Output"
                    value={values.peakSystemOutput}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="peakSystemOutput-error"
                    className="WidhtFull100"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="systemSize"
                    label="System Size"
                    value={values.systemSize}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="systemSize-error"
                    className="WidhtFull100"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="offeredQuotation"
                    label="Offered Quotation"
                    type="number"
                    value={values.offeredQuotation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="offeredQuotation-error"
                    className="WidhtFull100"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          £
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          .00
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.offeredQuotation && (
                    <FormHelperText className="errormsg" id="offeredQuotation-error">
                      {errors.offeredQuotation}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="agreedAmount"
                    label="Agreed Amount"
                    value={values.agreedAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="agreedAmount-error"
                    className="WidhtFull100"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          £
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          .00
                        </InputAdornment>
                      )
                    }}
                  />
                  {errors.agreedAmount && (
                    <FormHelperText className="errormsg" id="agreedAmount-error">
                      {errors.agreedAmount}
                    </FormHelperText>
                  )}
                </Grid>

                {checked == 'Yes' &&
                  <React.Fragment>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="netCost"
                        label="Net Cost"
                        value={values.netCost || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="netCost-error"
                        className="WidhtFull100"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              £
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              .00
                            </InputAdornment>
                          )
                        }}
                      />
                      {errors.netCost && (
                        <FormHelperText className="errormsg" id="netCost-error">
                          {errors.netCost}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="vat"
                        label="VAT"
                        value={values.vat || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="vat-error"
                        className="WidhtFull100"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              £
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              .00
                            </InputAdornment>
                          )
                        }}
                      />
                      {errors.vat && (
                        <FormHelperText className="errormsg" id="vat-error">
                          {errors.vat}
                        </FormHelperText>
                      )}
                    </Grid>
                  </React.Fragment>
                }

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="discount"
                    label="Discount"
                    value={(values.offeredQuotation - values.agreedAmount) || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="discount-error"
                    className="WidhtFull100"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          £
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          .00
                        </InputAdornment>
                      )
                    }}
                  />
                  {errors.discount && (
                    <FormHelperText className="errormsg" id="discount-error">
                      {errors.discount}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="finalPayment"
                    label="Final Payment"
                    value={values.finalPayment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="finalPayment-error"
                    className="WidhtFull100"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="finalPaymentDate"
                        name="finalPaymentDate"
                        label="Final Payment Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.finalPaymentDate
                            ? values.finalPaymentDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("finalPaymentDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="finalPaymentDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="installationDate"
                        name="installationDate"
                        label="Installation Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.installationDate
                            ? values.installationDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("installationDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="installationDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="propertyType"
                    label="Property Type"
                    value={values.propertyType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="propertyType-error"
                    className="WidhtFull100"
                  />
                  {errors.propertyType && (
                    <FormHelperText className="errormsg" id="propertyType-error">
                      {errors.propertyType}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="roofStyle"
                    label="Roof Style"
                    value={values.roofStyle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="roofStyle-error"
                    className="WidhtFull100"
                  />
                  {errors.roofStyle && (
                    <FormHelperText className="errormsg" id="roofStyle-error">
                      {errors.roofStyle}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="roofMaterial"
                    label="Roof Material"
                    value={values.roofMaterial}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="roofMaterial-error"
                    className="WidhtFull100"
                  />
                  {errors.roofMaterial && (
                    <FormHelperText className="errormsg" id="roofMaterial-error">
                      {errors.roofMaterial}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="shading"
                    label="Shading"
                    value={values.shading}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="shading-error"
                    className="WidhtFull100"
                  />
                  {errors.shading && (
                    <FormHelperText className="errormsg" id="shading-error">
                      {errors.shading}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    name="ownership"
                    label="Ownership"
                    value={values.ownership}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="ownership-error"
                    className="WidhtFull100"
                  />
                  {errors.ownership && (
                    <FormHelperText className="errormsg" id="ownership-error">
                      {errors.ownership}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        margin="normal"
                        id="jobCompletionDate"
                        name="jobCompletionDate"
                        label="Job Completion Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={
                          values.jobCompletionDate
                            ? values.jobCompletionDate
                            : null
                        }
                        onChange={(e) =>
                          setFieldValue("jobCompletionDate", e)
                        }
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="jobCompletionDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.jobCompletionDate && (
                    <FormHelperText
                      className="errormsg"
                      id="jobCompletionDate-error"
                    >
                      {errors.jobCompletionDate}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">DNO Approval Required?</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="dnoApproval"
                      onChange={handleDNOApproval}
                      value={dnoApproval}
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {dnoApproval == "Yes" &&
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">DNO Approved?</FormLabel>
                      <RadioGroup
                        row
                        aria-label="position"
                        name="dnoApproved"
                        onChange={handleDNOApproved}
                        value={dnoApproved}
                        defaultValue="top"
                      >
                        <FormControlLabel
                          value="Yes"
                          control={<Radio color="primary" />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                }

                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">VAT Applicable?</FormLabel>
                    <RadioGroup
                      row
                      aria-label="position"
                      name="vatApplicable"
                      onChange={handleChangeCheck}
                      value={checked}
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', false);
                    props.submitForm();
                  }}
                >
                  Generate Quote
                </Button>
                {currentProps.isFromLead && <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', true);
                    props.submitForm();
                  }}
                >
                  Save
                </Button>}
                {leadState.isSaveLeadLoading && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div >
  );
}