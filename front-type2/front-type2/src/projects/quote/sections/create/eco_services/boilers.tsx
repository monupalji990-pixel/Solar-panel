import React, { useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { selectLeadState } from "projects/lead/redux/lead";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "react-select";
import { ManufacturerOptions } from "sharedUtils/globalHelper/constantValues";

export default function Solar(props) {

  const leadState = useSelector(selectLeadState);
  const { singleLead } = leadState
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [postcode, setPostcode] = useState("");
  const [manufacturerModel, setManufacturerModel] = useState("");
  const [manufacturerModelNewBoiler, setManufacturerModelNewBoiler] = useState("");

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  const handleCombiBoiler = (event) => {
    props.setCombiBoiler(event.target.value);
  };

  const handleCombiBoiler1 = (event) => {
    props.setCombiBoiler1(event.target.value);
  };

  const handleNewHeatingControl = (event) => {
    props.setNewHeatingControlState(event.target.value);
  }

  const handleChangeManufacturer = (data) => {
    setManufacturerModel(data.models)
  }

  const handleChangeManufacturerNewBoiler = (data) => {
    setManufacturerModelNewBoiler(data.models)
  }

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    ConsumerData,
  } = currentProps;

  return (
    <div className="app" >
      <Grid container spacing={3}>

        {/* <Grid item xs={12} md={12} style={{ marginBottom: 20 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Boilers</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="boiler"
              onChange={handleBoilerType}
              value={currentProps.boilerType}
              defaultValue="top"
            >
              <FormControlLabel
                value="0"
                control={<Radio color="primary" />}
                label="Older Boiler"
              />
              <FormControlLabel
                value="1"
                control={<Radio color="primary" />}
                label="New Boiler"
              />
            </RadioGroup>
          </FormControl>
        </Grid> */}

        <Grid item xs={12} md={12}>
          <h3>Older Boiler</h3>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Combi Boilers</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="combiBoiler"
              onChange={handleCombiBoiler}
              value={currentProps.combiBoiler}
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

        <Grid item xs={12} md={4}>
          {/* <TextField
            variant="outlined"
            name="boiler.manufacturer"
            label="Manufacturer"
            value={values.boiler?.manufacturer}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="manufacturer-error"
            className="WidhtFull100"
          />
          {errors.manufacturer && (
            <FormHelperText className="errormsg" id="manufacturer-error">
              {errors.manufacturer}
            </FormHelperText>
          )} */}

          <Select
            className={
              errors.manufacturer ? "ErrorColor" : ""
            }
            error={!!(errors.manufacturer)}
            id="manufacturer"
            placeholder="Select Manufacturer"
            value={values.boiler?.manufacturer}
            onChange={(e) => {
              setFieldValue("manufacturer", e);
              handleChangeManufacturer(e)
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="manufacturer-error"
            name="boiler.manufacturer"
            options={ManufacturerOptions}
          />
          {errors.manufacturer && (
            <FormHelperText className="errormsg" id="manufacturer-error">
              {errors.manufacturer}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* <TextField
            variant="outlined"
            name="boiler.model"
            label="Model"
            value={values.boiler?.model}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model-error"
            className="WidhtFull100"
          />
          {errors.model && (
            <FormHelperText className="errormsg" id="model-error">
              {errors.model}
            </FormHelperText>
          )} */}

          <Select
            className={
              errors.model ? "ErrorColor" : ""
            }
            error={!!(errors.model)}
            id="model"
            placeholder="Select Model"
            value={values.boiler?.model}
            onChange={(e) => {
              setFieldValue("model", e);
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model-error"
            name="boiler.model"
            options={manufacturerModel}
          />
          {errors.model && (
            <FormHelperText className="errormsg" id="model-error">
              {errors.model}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.model_qualifier"
            label="Model Qualifier"
            value={values.boiler?.model_qualifier}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model_qualifier-error"
            className="WidhtFull100"
          />
          {errors.model_qualifier && (
            <FormHelperText className="errormsg" id="model_qualifier-error">
              {errors.model_qualifier}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.gcNumber"
            label="GC Number"
            value={values.boiler?.gcNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="gcNumber-error"
            className="WidhtFull100"
          />
          {errors.gcNumber && (
            <FormHelperText className="errormsg" id="gcNumber-error">
              {errors.gcNumber}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.numberofRads"
            label="Number of Rad's"
            value={values.boiler?.numberofRads}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="numberofRads-error"
            className="WidhtFull100"
          />
          {errors.numberofRads && (
            <FormHelperText className="errormsg" id="numberofRads-error">
              {errors.numberofRads}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.numberOfPreTRV"
            label="Number of Pre TRV's"
            value={values.boiler?.numberOfPreTRV}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="numberOfPreTRV-error"
            className="WidhtFull100"
          />
          {errors.numberOfPreTRV && (
            <FormHelperText className="errormsg" id="numberOfPreTRV-error">
              {errors.numberOfPreTRV}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.serialNumber"
            label="Serial Number"
            value={values.boiler?.serialNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="serialNumber-error"
            className="WidhtFull100"
          />
          {errors.serialNumber && (
            <FormHelperText className="errormsg" id="serialNumber-error">
              {errors.serialNumber}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.boilerEfficiency"
            label="Boiler Efficiency"
            value={values.boiler?.boilerEfficiency}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="boilerEfficiency-error"
            className="WidhtFull100"
          />
          {errors.boilerEfficiency && (
            <FormHelperText className="errormsg" id="boilerEfficiency-error">
              {errors.boilerEfficiency}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.yearOfOriginalCommissioning"
            label="Year of Original Commissioning"
            value={values.boiler?.yearOfOriginalCommissioning}
            onChange={handleChange}
            // props.calculateAgeOfBoiler(e)
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="yearOfOriginalCommissioning-error"
            className="WidhtFull100"
          />
          {errors.yearOfOriginalCommissioning && (
            <FormHelperText className="errormsg" id="yearOfOriginalCommissioning-error">
              {errors.yearOfOriginalCommissioning}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            name="boiler.ageOfBoiler"
            label="Age of Boiler"
            // placeholder="Age of Boiler"
            value={Math.abs(new Date().getFullYear() - Number(values.boiler.yearOfOriginalCommissioning)) || 0}
            // defaultValue={values.boiler.ageOfBoiler}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="ageOfBoiler-error"
            className="WidhtFull100"
          />
          {errors.ageOfBoiler && (
            <FormHelperText className="errormsg" id="ageOfBoiler-error">
              {errors.ageOfBoiler}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.pcdbIndex"
            label="PCDB Index"
            value={values.boiler?.pcdbIndex}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="pcdbIndex-error"
            className="WidhtFull100"
          />
          {errors.pcdbIndex && (
            <FormHelperText className="errormsg" id="pcdbIndex-error">
              {errors.pcdbIndex}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          <h3>New Boiler</h3>
        </Grid>


        <Grid item xs={12} md={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Combi Boilers</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="combiBoiler1"
              onChange={handleCombiBoiler1}
              value={currentProps.combiBoiler1}
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

        <Grid item xs={12} md={4}>
          {/* <TextField
            variant="outlined"
            name="boiler.manufacturer1"
            label="Manufacturer"
            value={values.boiler?.manufacturer1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="manufacturer1-error"
            className="WidhtFull100"
          />
          {errors.manufacturer1 && (
            <FormHelperText className="errormsg" id="manufacturer1-error">
              {errors.manufacturer1}
            </FormHelperText>
          )} */}

          <Select
            className={
              errors.manufacturer1 ? "ErrorColor" : ""
            }
            error={!!(errors.manufacturer1)}
            id="manufacturer1"
            placeholder="Select Manufacturer"
            value={values.boiler?.manufacturer1}
            onChange={(e) => {
              setFieldValue("manufacturer1", e);
              handleChangeManufacturerNewBoiler(e)
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="manufacturer1-error"
            name="boiler.manufacturer1"
            options={ManufacturerOptions}
          />
          {errors.manufacturer1 && (
            <FormHelperText className="errormsg" id="manufacturer1-error">
              {errors.manufacturer1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {/* <TextField
            variant="outlined"
            name="boiler.model1"
            label="Model"
            value={values.boiler?.model1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model1-error"
            className="WidhtFull100"
          />
          {errors.model1 && (
            <FormHelperText className="errormsg" id="model1-error">
              {errors.model1}
            </FormHelperText>
          )} */}

          <Select
            className={
              errors.model1 ? "ErrorColor" : ""
            }
            error={!!(errors.model1)}
            id="model1"
            placeholder="Select Model"
            value={values.boiler?.model1}
            onChange={(e) => {
              setFieldValue("model1", e);
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model1-error"
            name="boiler.model1"
            options={manufacturerModelNewBoiler}
          />
          {errors.model1 && (
            <FormHelperText className="errormsg" id="model1-error">
              {errors.model1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.model_qualifier1"
            label="Model Qualifier"
            value={values.boiler?.model_qualifier1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="model_qualifier1-error"
            className="WidhtFull100"
          />
          {errors.model_qualifier1 && (
            <FormHelperText className="errormsg" id="model_qualifier1-error">
              {errors.model_qualifier1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.gcNumber1"
            label="GC Number"
            value={values.boiler?.gcNumber1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="gcNumber1-error"
            className="WidhtFull100"
          />
          {errors.gcNumber1 && (
            <FormHelperText className="errormsg" id="gcNumber1-error">
              {errors.gcNumber1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.numberOfPreTRV1"
            label="Number of Post TRV's"
            value={values.boiler?.numberOfPreTRV1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="numberOfPreTRV1-error"
            className="WidhtFull100"
          />
          {errors.numberOfPreTRV1 && (
            <FormHelperText className="errormsg" id="numberOfPreTRV1-error">
              {errors.numberOfPreTRV1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.serialNumber1"
            label="Serial Number"
            value={values.boiler?.serialNumber1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="serialNumber1-error"
            className="WidhtFull100"
          />
          {errors.serialNumber1 && (
            <FormHelperText className="errormsg" id="serialNumber1-error">
              {errors.serialNumber1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.boilerEfficiency1"
            label="Boiler Efficiency"
            value={values.boiler?.boilerEfficiency1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="boilerEfficiency1-error"
            className="WidhtFull100"
          />
          {errors.boilerEfficiency1 && (
            <FormHelperText className="errormsg" id="boilerEfficiency1-error">
              {errors.boilerEfficiency1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">New Heating Control</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="newHeatingControl"
              onChange={handleNewHeatingControl}
              value={currentProps.newHeatingControlState}
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

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.heating_control"
            label="Heating Control"
            value={values.boiler?.heating_control}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="heating_control-error"
            className="WidhtFull100"
          />
          {errors.heating_control && (
            <FormHelperText className="errormsg" id="heating_control-error">
              {errors.heating_control}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.installer_name"
            label="Installer Name"
            value={values.boiler?.installer_name}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="installer_name-error"
            className="WidhtFull100"
          />
          {errors.installer_name && (
            <FormHelperText className="errormsg" id="installer_name-error">
              {errors.installer_name}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.installerGasLicNo"
            label="Installer Gas Safe Card Licence No"
            value={values.boiler?.installerGasLicNo}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="installerGasLicNo-error"
            className="WidhtFull100"
          />
          {errors.installerGasLicNo && (
            <FormHelperText className="errormsg" id="installerGasLicNo-error">
              {errors.installerGasLicNo}
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
                id="boiler.dataOfInstall"
                name="boiler.dataOfInstall"
                label="Date of Install"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.boiler?.dataOfInstall
                    ? values.boiler?.dataOfInstall
                    : null
                }
                onChange={(e) =>
                  setFieldValue("boiler.dataOfInstall", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="dataOfInstall-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.dataOfInstall && (
            <FormHelperText
              className="errormsg"
              id="dataOfInstall-error"
            >
              {errors.dataOfInstall}
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
                id="boiler.handoverDate"
                name="boiler.handoverDate"
                label="Handover Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.boiler?.handoverDate
                    ? values.boiler?.handoverDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("boiler.handoverDate", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="handoverDate-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.handoverDate && (
            <FormHelperText
              className="errormsg"
              id="handoverDate-error"
            >
              {errors.handoverDate}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.pcdbIndex1"
            label="PCDB Index"
            value={values.boiler?.pcdbIndex1}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="pcdbIndex1-error"
            className="WidhtFull100"
          />
          {errors.pcdbIndex1 && (
            <FormHelperText className="errormsg" id="pcdbIndex1-error">
              {errors.pcdbIndex1}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.replacement_cost"
            label="Replacement Cost"
            value={values.boiler?.replacement_cost}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            type="number"
            aria-describedby="replacement_cost-error"
            className="WidhtFull100"
          />
          {errors.replacement_cost && (
            <FormHelperText className="errormsg" id="replacement_cost-error">
              {errors.replacement_cost}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.contributionAmount"
            label="Contribution Amount"
            value={values.boiler?.contributionAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            type="number"
            aria-describedby="contributionAmount-error"
            className="WidhtFull100"
          />
          {errors.contributionAmount && (
            <FormHelperText className="errormsg" id="contributionAmount-error">
              {errors.contributionAmount}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="boiler.paymentMethod"
            label="Payment Method"
            value={values.boiler?.paymentMethod}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="paymentMethod-error"
            className="WidhtFull100"
          />
          {errors.paymentMethod && (
            <FormHelperText className="errormsg" id="paymentMethod-error">
              {errors.paymentMethod}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </div >
  );
}