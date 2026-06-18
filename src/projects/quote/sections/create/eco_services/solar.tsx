import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { InputAdornment } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';

export default function Solar(props) {
  const leadState = useSelector(selectLeadState);
  const { singleLead } = leadState
  const currentProps = props;
  const shirnkInput = props.isFromLead;
  const [startLoader, setStartLoader] = useState(false);
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [postcode, setPostcode] = useState("");
  const [isPanels, setPanels] = useState([]);
  const [isInverters, setInverters] = useState([]);
  const [isBatteries, setBatteries] = useState([]);
  const [checked, setChecked] = React.useState('');

  useEffect(() => {
    let number = []
    props.initialValues?.solar?.numberOfRoofs?.forEach((x, index) => {
      let arr = []
      for (let i = 0; i < x.numberOfPanels; i++) {
        arr.push({});
      }
      number[index] = arr;
    })

    let arr2 = []
    for (let i = 0; i < props.initialValues.solar?.noOfInverters; i++) {
      arr2.push({});
    }
    let arr3 = []
    for (let i = 0; i < props.initialValues.solar?.noOfBatteries; i++) {
      arr3.push({});
    }

    if (props.isFromLead) {
      setPanels(number);
      setInverters(arr2);
      setBatteries(arr3)
    }
  }, []);

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    ConsumerData,
  } = currentProps;

  const handleDNOApproval = (event) => {
    props.setDNOApproval(event.target.value);
  }

  const handleDNOApproved = (event) => {
    props.setDNOApproved(event.target.value);
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

  return (
    <div className="app" >
      <Grid container spacing={3}>

        <Grid item xs={12} md={3}>
          <TextField
            variant="outlined"
            error={errors.solar?.roofsPanelsInstalled && touched.solar?.roofsPanelsInstalled ? true : false}
            name="solar.roofsPanelsInstalled"
            label="No. of Roofs"
            value={values.solar?.roofsPanelsInstalled}
            onChange={(event) => {
              props.setNoOfRoofs(event.target.value)
              handleChange(event)
            }}
            type="number"
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="roofsPanelsInstalled-error"
            className="WidhtFull100"
          />
          {errors.solar?.roofsPanelsInstalled && (
            <FormHelperText className="errormsg" id="roofsPanelsInstalled-error">
              {errors.solar?.roofsPanelsInstalled}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            variant="outlined"
            name="solar.noOfInverters"
            label="No. of Inverters"
            value={values.solar?.noOfInverters}
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
            name="solar.noOfBatteries"
            label="No. of Batteries"
            value={values.solar?.noOfBatteries}
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
            name="solar.noOfPanels"
            label="Total No. of Panels"
            value={values.solar?.noOfPanels}
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
                              roofPitch: '',
                              roofOrientation: '',
                              numberOfPanels: '',
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
            name="solar.peakSystemOutput"
            label="Peak System Output"
            value={values.solar?.peakSystemOutput}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="peakSystemOutput-error"
            className="WidhtFull100"
          />
          {errors.peakSystemOutput && (
            <FormHelperText className="errormsg" id="peakSystemOutput-error">
              {errors.peakSystemOutput}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.systemSize"
            label="System Size"
            value={values.solar?.systemSize}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="systemSize-error"
            className="WidhtFull100"
          />
          {errors.systemSize && (
            <FormHelperText className="errormsg" id="systemSize-error">
              {errors.systemSize}
            </FormHelperText>
          )}
        </Grid>
        <Grid item md={4}></Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.offeredQuotation"
            label="Offered Quotation"
            type="number"
            value={values.solar?.offeredQuotation}
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
            name="solar.agreedAmount"
            label="Agreed Amount"
            value={values.solar?.agreedAmount}
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
                name="solar.netCost"
                label="Net Cost"
                value={values.solar?.netCost || ''}
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
                name="solar.vat"
                label="VAT"
                value={values.solar?.vat || ''}
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
            name="solar.discount"
            label="Discount"
            value={(values.solar?.offeredQuotation - values.solar?.agreedAmount) || ''}
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

        {/* <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.installmentAmount"
            label="1st Installment Amount"
            value={values.solar?.installmentAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="installmentAmount-error"
            className="WidhtFull100"
          />
          {errors.installmentAmount && (
            <FormHelperText className="errormsg" id="installmentAmount-error">
              {errors.installmentAmount}
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
                id="solar.dataOfInstallment"
                name="solar.dataOfInstallment"
                label="Date of 1st Installment"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.solar?.dataOfInstallment
                    ? values.solar?.dataOfInstallment
                    : null
                }
                onChange={(e) =>
                  setFieldValue("solar.dataOfInstallment", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="dataOfInstallment-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.dataOfInstallment && (
            <FormHelperText
              className="errormsg"
              id="dataOfInstallment-error"
            >
              {errors.dataOfInstallment}
            </FormHelperText>
          )}
        </Grid> */}

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.finalPayment"
            label="Final Payment"
            value={values.solar?.finalPayment}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="finalPayment-error"
            className="WidhtFull100"
          />
          {errors.finalPayment && (
            <FormHelperText className="errormsg" id="finalPayment-error">
              {errors.finalPayment}
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
                id="solar.finalPaymentDate"
                name="solar.finalPaymentDate"
                label="Final Payment Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.solar?.finalPaymentDate
                    ? values.solar?.finalPaymentDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("solar.finalPaymentDate", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="finalPaymentDate-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.finalPaymentDate && (
            <FormHelperText
              className="errormsg"
              id="finalPaymentDate-error"
            >
              {errors.finalPaymentDate}
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
                id="solar.installationDate"
                name="solar.installationDate"
                label="Installation Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.solar?.installationDate
                    ? values.solar?.installationDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("solar.installationDate", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="installationDate-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.installationDate && (
            <FormHelperText
              className="errormsg"
              id="installationDate-error"
            >
              {errors.installationDate}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.propertyType"
            label="Property Type"
            value={values.solar?.propertyType}
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
            name="solar.roofStyle"
            label="Roof Style"
            value={values.solar?.roofStyle}
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
            name="solar.roofMaterial"
            label="Roof Material"
            value={values.solar?.roofMaterial}
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
            name="solar.shading"
            label="Shading"
            value={values.solar?.shading}
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
            name="solar.ownership"
            label="Ownership"
            value={values.solar?.ownership}
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
                id="solar.jobCompletionDate"
                name="solar.jobCompletionDate"
                label="Job Completion Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.solar?.jobCompletionDate
                    ? values.solar?.jobCompletionDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("solar.jobCompletionDate", e)
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
              value={currentProps.dnoApproval}
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

        {currentProps.dnoApproval == "Yes" &&
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">DNO Approved?</FormLabel>
              <RadioGroup
                row
                aria-label="position"
                name="dnoApproved"
                onChange={handleDNOApproved}
                value={currentProps.dnoApproved}
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

        {/* <Grid item xs={12} md={12}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="customer_charge"
                onChange={handleChangeCheck}
              />
            }
            label="VAT Applicable?"
          />
        </Grid> */}

        <Grid item xs={12} md={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">VAT Applicable?</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="customer_charge"
              onChange={handleChangeCheck}
              value={currentProps.customer_charge}
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
    </div>
  );
}