import React from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { selectLeadState } from "projects/lead/redux/lead";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from '@material-ui/core/InputAdornment';

export default function CWI(props) {

  const currentProps = props;

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
  } = currentProps;

  const handleContributionPaid = (event) => {
    props.setContributionPaid(event.target.value);
  };

  return (
    <div className="app">
      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.propertyType"
            label="Property Type"
            value={values.cwi?.propertyType}
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
            name="cwi.numberOfBedrooms"
            label="Number of Bedrooms"
            type="number"
            value={values.cwi?.numberOfBedrooms}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="numberOfBedrooms-error"
            className="WidhtFull100"
          />
          {errors.numberOfBedrooms && (
            <FormHelperText className="errormsg" id="numberOfBedrooms-error">
              {errors.numberOfBedrooms}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.mainDwellingM2"
            label="Main Dwelling m2 (-windows)"
            value={values.cwi?.mainDwellingM2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="mainDwellingM2-error"
            className="WidhtFull100"
          />
          {errors.mainDwellingM2 && (
            <FormHelperText className="errormsg" id="mainDwellingM2-error">
              {errors.mainDwellingM2}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.ext1M2"
            label="Ext1 m2 (-windows)"
            value={values.cwi?.ext1M2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="ext1M2-error"
            className="WidhtFull100"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.ext2M2"
            label="Ext2 m2 (-windows)"
            value={values.cwi?.ext2M2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="ext2M2-error"
            className="WidhtFull100"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.ext3M2"
            label="Ext3 m2 (-windows)"
            value={values.cwi?.ext3M2}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="ext3M2-error"
            className="WidhtFull100"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.totalWallArea"
            label="Total Wall Area (-windows)"
            value={values.cwi?.totalWallArea}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="totalWallArea-error"
            className="WidhtFull100"
          />
          {errors.totalWallArea && (
            <FormHelperText className="errormsg" id="totalWallArea-error">
              {errors.totalWallArea}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="cwi.popt"
            label="POPT"
            value={values.cwi?.popt}
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
            name="cwi.materialUsed"
            label="Material Used"
            value={values.cwi?.materialUsed}
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
            name="cwi.CwiEngeineer"
            label="CWI Engineer"
            value={values.cwi?.CwiEngeineer}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="CwiEngeineer-error"
            className="WidhtFull100"
          />
          {errors.CwiEngeineer && (
            <FormHelperText className="errormsg" id="CwiEngeineer-error">
              {errors.CwiEngeineer}
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
                id="cwi.installDate"
                name="cwi.installDate"
                label="Install Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.cwi?.installDate
                    ? values.cwi?.installDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("cwi.installDate", e)
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
                id="cwi.handoverDate"
                name="cwi.handoverDate"
                label="Handover Date"
                allowKeyboardControl
                className="WidhtFull100"
                format="dd/MM/yyyy"
                value={
                  values.cwi?.handoverDate
                    ? values.cwi?.handoverDate
                    : null
                }
                onChange={(e) =>
                  setFieldValue("cwi.handoverDate", e)
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
          <FormControl component="fieldset">
            <FormLabel component="legend">Contribution Paid</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="contributionPaid"
              onChange={handleContributionPaid}
              value={currentProps.contributionPaid}
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
            name="cwi.contributionAmount"
            label="Contribution Amount"
            value={values.cwi?.contributionAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="contributionAmount-error"
            className="WidhtFull100"
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
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
            name="cwi.paymentMethod"
            label="Payment Method"
            value={values.cwi?.paymentMethod}
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
    </div>
  );
}