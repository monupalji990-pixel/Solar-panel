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

export default function UFI(props) {

  const leadState = useSelector(selectLeadState);
  const { singleLead } = leadState
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [isPostcodeChange, setIsPostcodeChange] = useState("randomString");
  const [postcode, setPostcode] = useState("");

  if (
    (props.SitePostcode || props.SitePostcode === "") &&
    isPostcodeChange !== props.PostCodeRandomString
  ) {
    setPostcode(props.SitePostcode);
    setIsPostcodeChange(props.PostCodeRandomString);
  }

  const handleChangeRadio = (event) => {
    props.setSwipeWarrantyApplied(event.target.value);
  };

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

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.timberSuspendedFloorAreaM2"
            label="Timber Suspended Floor Area m2"
            value={values.ufi?.timberSuspendedFloorAreaM2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="timberSuspendedFloorAreaM2-error"
            className="WidhtFull100"
          />
          {errors.timberSuspendedFloorAreaM2 && (
            <FormHelperText className="errormsg" id="timberSuspendedFloorAreaM2-error">
              {errors.timberSuspendedFloorAreaM2}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.solidFloorAreaM2"
            label="Solid Floor Area m2"
            value={values.ufi?.solidFloorAreaM2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="solidFloorAreaM2-error"
            className="WidhtFull100"
          />
          {errors.solidFloorAreaM2 && (
            <FormHelperText className="errormsg" id="solidFloorAreaM2-error">
              {errors.solidFloorAreaM2}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.totalFloorAreaM2"
            label="Total Floor Area m2"
            value={values.ufi?.totalFloorAreaM2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="totalFloorAreaM2-error"
            className="WidhtFull100"
          />
          {errors.totalFloorAreaM2 && (
            <FormHelperText className="errormsg" id="totalFloorAreaM2-error">
              {errors.totalFloorAreaM2}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.popt"
            label="POPT"
            value={values.ufi?.popt}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="popt-error"
            className="WidhtFull100"
          />
          {errors.popt && (
            <FormHelperText className="errormsg" id="popt-error">
              {errors.popt}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.materialUsed"
            label="Material Used"
            value={values.ufi?.materialUsed}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="materialUsed-error"
            className="WidhtFull100"
          />
          {errors.materialUsed && (
            <FormHelperText className="errormsg" id="materialUsed-error">
              {errors.materialUsed}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="ufi.installerName"
            label="Installer Name"
            value={values.ufi?.installerName}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="installerName-error"
            className="WidhtFull100"
          />
          {errors.installerName && (
            <FormHelperText className="errormsg" id="installerName-error">
              {errors.installerName}
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
                id="ufi.installDate"
                name="ufi.installDate"
                label="Install Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.ufi?.installDate
                    ? values.ufi?.installDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("ufi.installDate", e)
                }
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="installDate-number-error"
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {errors.installDate && (
            <FormHelperText
              className="errormsg"
              id="installDate-error"
            >
              {errors.installDate}
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
                id="ufi.handoverDate"
                name="ufi.handoverDate"
                label="Handover Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.ufi?.handoverDate
                    ? values.ufi?.handoverDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("ufi.handoverDate", e)
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

        <Grid item xs={12} md={12} style={{ marginBottom: 20 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Swipe Warranty applied</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="swipeWarrantyApplied"
              onChange={handleChangeRadio}
              value={currentProps.swipeWarrantyApplied}
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
    </div >
  );
}