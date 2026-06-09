import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "react-select";
import { selectLeadState } from "projects/lead/redux/lead";
import { CustomerTypeOptions, RoofStructureOptions, CoverTypesOptions } from "../../../../../sharedUtils/globalHelper/constantValues"

export default function Solar(props) {
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

        <Grid item xs={12} md={12}>
          <h3>Contact Details</h3>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.name"
            label="Name"
            value={values.solar?.name}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="name-error"
            className="WidhtFull100"
          />
          {errors.name && (
            <FormHelperText className="errormsg" id="name-error">
              {errors.name}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.address"
            label="Address"
            multiline
            value={values.solar?.address}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="address-error"
            className="WidhtFull100"
          />
          {errors.address && (
            <FormHelperText className="errormsg" id="address-error">
              {errors.address}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.telephone"
            label="Telephone"
            type="number"
            value={values.solar?.telephone}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="telephone-error"
            className="WidhtFull100"
          />
          {errors.telephone && (
            <FormHelperText className="errormsg" id="telephone-error">
              {errors.telephone}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.mobile"
            label="Mobile"
            type="number"
            value={values.solar?.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="mobile-error"
            className="WidhtFull100"
          />
          {errors.mobile && (
            <FormHelperText className="errormsg" id="mobile-error">
              {errors.mobile}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.email"
            label="Email"
            type="email"
            value={values.solar?.email}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="email-error"
            className="WidhtFull100"
          />
          {errors.email && (
            <FormHelperText className="errormsg" id="email-error">
              {errors.email}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Select
            id="solar.customerType"
            name="solar.customerType"
            placeholder="Customer type"
            label="Customer type"
            value={values.solar?.customerType}
            onChange={(e) => {
              setFieldValue("solar.customerType", e);
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="role-number-error"
            options={CustomerTypeOptions}
          />
          {errors.customerType && (
            <FormHelperText
              className="errormsg"
              id="customerType-error"
            >
              {errors.customerType}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          <h3>Project Details</h3>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.property_desc"
            label="Property Description"
            value={values.solar?.property_desc}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="property_desc-error"
            className="WidhtFull100"
          />
          {errors.property_desc && (
            <FormHelperText className="errormsg" id="property_desc-error">
              {errors.property_desc}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.property_age"
            label="Approx age of property"
            type="number"
            value={values.solar?.property_age}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="property_age-error"
            className="WidhtFull100"
          />
          {errors.property_age && (
            <FormHelperText className="errormsg" id="property_age-error">
              {errors.property_age}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.property_conservation_area"
            label="Is property in conservation area?"
            value={values.solar?.property_conservation_area}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="property_conservation_area-error"
            className="WidhtFull100"
          />
          {errors.property_conservation_area && (
            <FormHelperText className="errormsg" id="property_conservation_area-error">
              {errors.property_conservation_area}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.property_occupy_people"
            label="How many people occupy the property?"
            type="number"
            value={values.solar?.property_occupy_people}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="property_occupy_people-error"
            className="WidhtFull100"
          />
          {errors.property_occupy_people && (
            <FormHelperText className="errormsg" id="property_occupy_people-error">
              {errors.property_occupy_people}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.sought_permission"
            label="Is planning permission to be sought?"
            value={values.solar?.sought_permission}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="sought_permission-error"
            className="WidhtFull100"
          />
          {errors.sought_permission && (
            <FormHelperText className="errormsg" id="sought_permission-error">
              {errors.sought_permission}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.obtained_permission"
            label="Has planning permission been obtained?"
            value={values.solar?.obtained_permission}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="obtained_permission-error"
            className="WidhtFull100"
          />
          {errors.obtained_permission && (
            <FormHelperText className="errormsg" id="obtained_permission-error">
              {errors.obtained_permission}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          <h3>Supply Details</h3>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.voltage_optimiser_installed"
            label="Voltage/boiler optimiser installed"
            value={values.solar?.voltage_optimiser_installed}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="voltage_optimiser_installed-error"
            className="WidhtFull100"
          />
          {errors.voltage_optimiser_installed && (
            <FormHelperText className="errormsg" id="voltage_optimiser_installed-error">
              {errors.voltage_optimiser_installed}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.electricity_supplier"
            label="Electricity Supplier"
            value={values.solar?.electricity_supplier}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="electricity_supplier-error"
            className="WidhtFull100"
          />
          {errors.electricity_supplier && (
            <FormHelperText className="errormsg" id="electricity_supplier-error">
              {errors.electricity_supplier}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.fuse_band_location"
            label="Location of Fuse Band"
            value={values.solar?.fuse_band_location}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="fuse_band_location-error"
            className="WidhtFull100"
          />
          {errors.fuse_band_location && (
            <FormHelperText className="errormsg" id="fuse_band_location-error">
              {errors.fuse_band_location}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.rcd_protected"
            label="RCD protected"
            value={values.solar?.rcd_protected}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="rcd_protected-error"
            className="WidhtFull100"
          />
          {errors.rcd_protected && (
            <FormHelperText className="errormsg" id="rcd_protected-error">
              {errors.rcd_protected}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.estimated_roof_area"
            label="Estimated roof area"
            value={values.solar?.estimated_roof_area}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="estimated_roof_area-error"
            className="WidhtFull100"
          />
          {errors.estimated_roof_area && (
            <FormHelperText className="errormsg" id="estimated_roof_area-error">
              {errors.estimated_roof_area}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.roof_pitch"
            label="Roof pitch (°)"
            value={values.solar?.roof_pitch}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="roof_pitch-error"
            className="WidhtFull100"
          />
          {errors.roof_pitch && (
            <FormHelperText className="errormsg" id="roof_pitch-error">
              {errors.roof_pitch}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.orientation_of_roof"
            label="Orientation of roof (° from N)"
            value={values.solar?.orientation_of_roof}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="orientation_of_roof-error"
            className="WidhtFull100"
          />
          {errors.orientation_of_roof && (
            <FormHelperText className="errormsg" id="orientation_of_roof-error">
              {errors.orientation_of_roof}
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
            name="solar.roof_condition"
            label="Roof condition"
            value={values.solar?.roof_condition}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="roof_condition-error"
            className="WidhtFull100"
          />
          {errors.roof_condition && (
            <FormHelperText className="errormsg" id="roof_condition-error">
              {errors.roof_condition}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.remedial_required"
            label="Remedial electrical works required?"
            value={values.solar?.remedial_required}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="remedial_required-error"
            className="WidhtFull100"
          />
          {errors.remedial_required && (
            <FormHelperText className="errormsg" id="remedial_required-error">
              {errors.remedial_required}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.structural_servey_required"
            label="Structural survey required?"
            value={values.solar?.structural_servey_required}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="structural_servey_required-error"
            className="WidhtFull100"
          />
          {errors.structural_servey_required && (
            <FormHelperText className="errormsg" id="structural_servey_required-error">
              {errors.structural_servey_required}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.proposed_inverter_site"
            label="Proposed inverter site"
            value={values.solar?.proposed_inverter_site}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="proposed_inverter_site-error"
            className="WidhtFull100"
          />
          {errors.proposed_inverter_site && (
            <FormHelperText className="errormsg" id="proposed_inverter_site-error">
              {errors.proposed_inverter_site}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.suitable_access_loft"
            label="Suitable access to loft"
            value={values.solar?.suitable_access_loft}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="suitable_access_loft-error"
            className="WidhtFull100"
          />
          {errors.suitable_access_loft && (
            <FormHelperText className="errormsg" id="suitable_access_loft-error">
              {errors.suitable_access_loft}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            variant="outlined"
            name="solar.access_to_site"
            placeholder="Comment on any restrictions"
            label="Access to site"
            value={values.solar?.access_to_site}
            onChange={handleChange}
            multiline
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="access_to_site-error"
            className="WidhtFull100"
          />
          {errors.access_to_site && (
            <FormHelperText className="errormsg" id="access_to_site-error">
              {errors.access_to_site}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Select
            id="roof_structure"
            name="solar.roof_structure"
            placeholder="Identification Of Roof Structure"
            label="Identification Of Roof Structure"
            value={values.solar?.roof_structure}
            onChange={(e) => {
              setFieldValue("solar.roof_structure", e);
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="role-number-error"
            options={RoofStructureOptions}
          />
          {errors.roof_structure && (
            <FormHelperText
              className="errormsg"
              id="roof_structure-error"
            >
              {errors.roof_structure}
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Select
            id="types_of_cover"
            name="solar.types_of_cover"
            placeholder="Types Of Cover"
            label="Types Of Cover"
            value={values.solar?.types_of_cover}
            onChange={(e) => {
              setFieldValue("solar.types_of_cover", e);
            }}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="role-number-error"
            options={CoverTypesOptions}
          />
          {errors.types_of_cover && (
            <FormHelperText
              className="errormsg"
              id="types_of_cover-error"
            >
              {errors.types_of_cover}
            </FormHelperText>
          )}
        </Grid>

      </Grid>
    </div >
  );
}