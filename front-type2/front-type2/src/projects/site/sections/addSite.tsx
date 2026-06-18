import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { siteAction, selectSiteState } from "../Redux/site";
import { selectCompanyState } from "../../company/redux/company";

export default function addSite(props) {
  const [startLoader, setStartLoader] = useState(false);
  const siteState = useSelector(selectSiteState);
  const companyState = useSelector(selectCompanyState);
  const {
    siteList,
    currentSite,
    count,
    limit,
    remote,
    page,
    message,
    hideSideBar,
    messageCode,
    isLoadingData,
  } = {
    ...siteState,
  };
  const dispatch = useDispatch();

  const _closeSideBar = (payload) => dispatch(siteAction.CloseSideBar(payload));
  const _slugUpdate = (payload) => dispatch(siteAction.SlugUpdate(payload));
  const _addSite = (payload) => dispatch(siteAction.addSite(payload));
  const _unsetToaster = (payload) =>
    dispatch(siteAction.siteUnsetToster(payload));

  useEffect(() => {
    if (!isLoadingData) {
      setStartLoader(false);
    }
    if (hideSideBar) {
      props.onClose();
    }
  }, [isLoadingData]);

  useEffect(() => {
    if (hideSideBar) {
      props.onClose();
    }
  }, [hideSideBar]);

  const initialValues = {
    siteName: "",
    siteAddress: "",
    city: "",
    town: "",
    country: "",
    postcode: "",
    contactPerson: null,
    activeOne: false,
    companyId: "",
    gas: {
      MPRN: "",
      meterSerialNumber: "",
    },
    electric: {
      topLine: "",
      meterNumber: "",
      meterSerialNumber: "",
    },
    water: {
      WaterCorespId: "",
      SewageSpid: "",
      WaterMeterSN: "",
    },
    chipandpin: {
      ProviderRefNumber: "",
      midNumber: "",
    },
  };

  let contactList = [];
  if (
    companyState.currentCompany &&
    companyState.currentCompany.Contact !== undefined
  ) {
    contactList = companyState.currentCompany.Contact.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(value, { setSubmitting, resetForm, setErrors }) => {
        value.companyId = companyState.currentCompany._id;
        value.contactPerson = [value.contactPerson.value];
        setStartLoader(true);
        _addSite({
          value,
          showingFrom: props.showingFrom, // to refresh viewSingle company when site added, if showing From ViewCompany
        });
        resetForm();
      }}
      validationSchema={Yup.object().shape({
        siteName: Yup.string().required("Site Name is required"),
        siteAddress: Yup.string().required("Site Address is required"),
        city: Yup.string().required("City is required"),
        town: Yup.string().required("Town is required"),
        country: Yup.string().required("County is required"),
        postcode: Yup.string().required("Postcode is required"),
        contactPerson: Yup.string()
          .nullable()
          .required("Contact Person is required"),
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
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  error={errors.siteName && touched.siteName ? true : false}
                  id="siteName"
                  className="WidhtFull100"
                  label="Site Name"
                  type="name"
                  value={values.siteName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="siteName-error"
                />
                {errors.siteName && touched.siteName && (
                  <FormHelperText className="errormsg" id="siteName-error">
                    {errors.siteName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  error={
                    errors.siteAddress && touched.siteAddress ? true : false
                  }
                  id="siteAddress"
                  label="Site Address"
                  className="WidhtFull100"
                  type="siteAddress"
                  value={values.siteAddress}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="siteAddress-error"
                />
                {errors.siteAddress && touched.siteAddress && (
                  <FormHelperText className="errormsg" id="siteAddress-error">
                    {errors.siteAddress}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  error={errors.town && touched.town ? true : false}
                  id="town"
                  label="Town"
                  className="WidhtFull100"
                  type="town"
                  value={values.town}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="town-error"
                />
                {errors.town && touched.town && (
                  <FormHelperText className="errormsg" id="town-error">
                    {errors.town}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  error={errors.city && touched.city ? true : false}
                  id="city"
                  label="City"
                  className="WidhtFull100"
                  type="city"
                  value={values.city}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="city-error"
                />
                {errors.city && touched.city && (
                  <FormHelperText className="errormsg" id="city-error">
                    {errors.city}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  error={errors.country && touched.country ? true : false}
                  id="country"
                  className="WidhtFull100"
                  label="County"
                  type="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="country-error"
                />
                {errors.country && touched.country && (
                  <FormHelperText className="errormsg" id="country-error">
                    {errors.country}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  error={errors.postcode && touched.postcode ? true : false}
                  id="postcode"
                  className="WidhtFull100"
                  label="Postcode"
                  type="text"
                  value={values.postcode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="postcode-error"
                />
                {errors.postcode && touched.postcode && (
                  <FormHelperText className="errormsg" id="postcode-error">
                    {errors.postcode}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Select
                  className={
                    errors.contactPerson && touched.contactPerson
                      ? "ErrorColor"
                      : ""
                  }
                  variant="outlined"
                  id="contactPerson"
                  placeholder="Site Contact Person"
                  value={values.contactPerson}
                  onChange={(e) => {
                    setFieldValue("contactPerson", e);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="contactPerson-number-error"
                  name="colors"
                  options={contactList}
                />
                {errors.contactPerson && touched.contactPerson && (
                  <FormHelperText className="errormsg" id="contactPerson-error">
                    {errors.contactPerson}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <p>Gas</p>
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={errors.gas?.MPRN && touched.gas?.MPRN ? true : false}
                  id="gas.MPRN"
                  className="WidhtFull100"
                  label="MPRN"
                  type="text"
                  value={values.gas.MPRN}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="gas.MPRN-error"
                />
                {errors.gas?.MPRN && touched.gas?.MPRN && (
                  <FormHelperText className="errormsg" id="gas.MPRN-error">
                    {errors.gas?.MPRN}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.gas?.meterSerialNumber &&
                    touched.gas?.meterSerialNumber
                      ? true
                      : false
                  }
                  id="gas.meterSerialNumber"
                  className="WidhtFull100"
                  label="Meter Serial Number"
                  type="text"
                  value={values.gas.meterSerialNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="gas.meterSerialNumber-error"
                />
                {errors.gas?.meterSerialNumber &&
                  touched.gas?.meterSerialNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="gas.meterSerialNumber-error"
                    >
                      {errors.gas?.meterSerialNumber}
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <p>Electric</p>
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.electric?.topLine && touched.electric?.topLine
                      ? true
                      : false
                  }
                  id="electric.topLine"
                  className="WidhtFull100"
                  label="Top Line"
                  type="text"
                  value={values.electric.topLine}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="electric.topLine-error"
                />
                {errors.electric?.topLine && touched.electric?.topLine && (
                  <FormHelperText
                    className="errormsg"
                    id="electric.topLine-error"
                  >
                    {errors.electric?.topLine}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.electric?.meterNumber &&
                    touched.electric?.meterNumber
                      ? true
                      : false
                  }
                  id="electric.meterNumber"
                  className="WidhtFull100"
                  label="Meter Number"
                  type="text"
                  value={values.electric.meterNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="electric.meterNumber-error"
                />
                {errors.electric?.meterNumber && touched.electric?.meterNumber && (
                  <FormHelperText
                    className="errormsg"
                    id="electric.meterNumber-error"
                  >
                    {errors.electric?.meterNumber}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.electric?.meterSerialNumber &&
                    touched.electric?.meterSerialNumber
                      ? true
                      : false
                  }
                  id="electric.meterSerialNumber"
                  className="WidhtFull100"
                  label="Meter Serial Number"
                  type="text"
                  value={values.electric.meterSerialNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="electric.meterSerialNumber-error"
                />
                {errors.electric?.meterSerialNumber &&
                  touched.electric?.meterSerialNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="electric.meterSerialNumber-error"
                    >
                      {errors.electric?.meterSerialNumber}
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <p>Water</p>
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.water?.WaterCorespId && touched.water?.WaterCorespId
                      ? true
                      : false
                  }
                  id="water.WaterCorespId"
                  className="WidhtFull100"
                  label="WATER CORESPID"
                  type="text"
                  value={values.water.WaterCorespId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="water.WaterCorespId-error"
                />
                {errors.water?.WaterCorespId && touched.water?.WaterCorespId && (
                  <FormHelperText
                    className="errormsg"
                    id="water.WaterCorespId-error"
                  >
                    {errors.water?.WaterCorespId}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.water?.SewageSpid && touched.water?.SewageSpid
                      ? true
                      : false
                  }
                  id="water.SewageSpid"
                  className="WidhtFull100"
                  label="SEWAGE SPID"
                  type="text"
                  value={values.water.SewageSpid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="water.SewageSpid-error"
                />
                {errors.water?.SewageSpid && touched.water?.SewageSpid && (
                  <FormHelperText
                    className="errormsg"
                    id="water.SewageSpid-error"
                  >
                    {errors.water?.SewageSpid}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.water?.WaterMeterSN && touched.water?.WaterMeterSN
                      ? true
                      : false
                  }
                  id="water.WaterMeterSN"
                  className="WidhtFull100"
                  label="WATER METER SN"
                  type="text"
                  value={values.water.WaterMeterSN}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="water.WaterMeterSN-error"
                />
                {errors.water?.WaterMeterSN && touched.water?.WaterMeterSN && (
                  <FormHelperText
                    className="errormsg"
                    id="water.WaterMeterSN-error"
                  >
                    {errors.water?.WaterMeterSN}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <p>Chip And Pin</p>
              </Grid>

              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.chipandpin?.ProviderRefNumber &&
                    touched.chipandpin?.ProviderRefNumber
                      ? true
                      : false
                  }
                  id="chipandpin.ProviderRefNumber"
                  className="WidhtFull100"
                  label="Provide Ref. Number"
                  type="text"
                  value={values.chipandpin.ProviderRefNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="chipandpin.ProviderRefNumber-error"
                />
                {errors.chipandpin?.ProviderRefNumber &&
                  touched.chipandpin?.ProviderRefNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="chipandpin.ProviderRefNumber-error"
                    >
                      {errors.chipandpin?.ProviderRefNumber}
                    </FormHelperText>
                  )}
              </Grid>

              <Grid item>
                <TextField
                  variant="outlined"
                  error={
                    errors.chipandpin?.midNumber &&
                    touched.chipandpin?.midNumber
                      ? true
                      : false
                  }
                  id="chipandpin.midNumber"
                  className="WidhtFull100"
                  label="MID Number"
                  type="text"
                  value={values.chipandpin.midNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                  aria-describedby="chipandpin.midNumber-error"
                />
                {errors.chipandpin?.midNumber &&
                  touched.chipandpin?.midNumber && (
                    <FormHelperText
                      className="errormsg"
                      id="chipandpin.midNumber-error"
                    >
                      {errors.chipandpin?.midNumber}
                    </FormHelperText>
                  )}
              </Grid>
            </Grid>

            <CardActions
              style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
            >
              <Button
                size="medium"
                variant="contained"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </Button>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                type="submit"
              >
                Add Site
              </Button>
              {startLoader && <CircularProgress />}
            </CardActions>
          </form>
        );
      }}
    </Formik>
  );
}
