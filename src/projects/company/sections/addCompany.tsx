import React, { useState, useEffect, Suspense } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import DateFnsUtils from "@date-io/date-fns";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { BusinessTypeOption } from "../../../sharedUtils/globalHelper/constantValues";
import AddSite from "../../site/sections/addSite";
import AddContact from "../../contact/sections/addContact";
import { Common as SiteList } from "../../site/loadable/Common";
import { Common as ContactList } from "../../contact/loadable/Common";
import Assignee from "./assignee";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

declare const google

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: "100%",
  },
}));

export default function AddCompany(props) {
  return (
    <MyDrawer
      drawerSize="1250px"
      iconName="Company"
      open={props.open == "addCompanyDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddCompanyLogic {...props} />
    </MyDrawer>
  );
}

function AddCompanyLogic(props) {
  useEffect(() => {
    props._slugUpdate(props);
  }, []);

  useEffect(() => {
    if (!props.companyState.isLoadingData) {
      setStartLoader(false);
    }
  }, [props.companyState.isLoadingData]);

  const classes = useStyles();
  const [changeRole, setChangeRole] = useState("");
  const [startLoader, setStartLoader] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState("company");
  const [results, setResults] = React.useState([]);
  const [LatitudeLongitude, setLatitudeLongitude] = useState(null);

  const handleChangeBT = (event) => {
    setChangeRole(event.label);
  };

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const initialValues = {
    businessName: "",
    trendingName: "",
    firstLine: "",
    company_town: "",
    company_country: "",
    company_postcode: "",
    registerNumber: "",
    vatNumber: "",
    businessType: null,
    secondLine: "",
    gatewayNumber: "",
    bankName: "",
    bankSortcode: "",
    bankAccountNumber: "",
    creditScore: "",
    creditScoreDate: 0,
    website: "",
    utr: '',
    address: null,
    lat: '',
    lon: '',
  };

  const sessionToken = new google.maps.places.AutocompleteSessionToken();

  const setPossiblePlacesFun = address => {
    var autocompleteService = new google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions({
      input: address,
      sessionToken: sessionToken
    },
      displaySuggestions => {
        if (displaySuggestions) {
          setResults(
            displaySuggestions.map(e => ({
              description: e.description,
              place_id: e.place_id
            }))
          )
        }
      }
    )
  }

  let addressList = []
  addressList = results.map(e => ({
    label: e.description,
    value: e.place_id
  }))

  const setLatLongFun = place_id => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: place_id }, function (results, status) {
      if (status === 'OK') {
        setLatitudeLongitude({
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
        })
      }
    })
  }

  return (
    <div className="app">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              aria-label="simple tabs example"
              textColor="primary"
              variant="scrollable"
              indicatorColor="primary"
            >
              <Tab label="Company" value="company" />
              <Tab label="Contacts" value="contact" />
              <Tab label="Site" value="site" />
              {props.slug !== "sales_rep" && (
                <Tab label="Assignee" value="assignee" />
              )}
            </Tabs>
          </Paper>
        </Grid>
      </Grid>

      {selectedTab === "company" && (
        <div>
          <Formik
            initialValues={initialValues}
            onSubmit={(value, { setSubmitting, resetForm, setErrors }) => {
              try {
                value.businessType = value.businessType.value;
                if (value.creditScoreDate)
                  value.creditScoreDate = new Date(
                    value.creditScoreDate
                  ).getTime();
                if (LatitudeLongitude?.latitude && LatitudeLongitude?.latitude !== "") value.lat = LatitudeLongitude?.latitude
                if (LatitudeLongitude?.longitude && LatitudeLongitude?.longitude !== "") value.lon = LatitudeLongitude?.longitude
                if (value.address?.label && value.address?.label !== undefined && value.address?.label !== null) value.address = value.address?.label

                setStartLoader(true);
                props._addCompany(value);
                resetForm();
              } catch (error) {
                console.log("error while add new company-----------", error);
              }
            }}
            validationSchema={Yup.object().shape({
              businessName: Yup.string().required(
                "Company/Business name is required"
              ),
              trendingName: Yup.string().required("Trading name is required"),
              firstLine: Yup.string().required("First address is required"),
              company_town: Yup.string().required("Town is required"),
              company_country: Yup.string().required("County is required"),
              company_postcode: Yup.string().required("Postcode is required"),
              businessType: Yup.object().required("Company Type is required").nullable(),
              registerNumber: Yup.string().required(
                "Register Number is required"
              ),
              vatNumber: Yup.string().required("VAT Number is required"),
              utr: Yup.number().positive().integer()
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
                        error={
                          errors.businessName && touched.businessName
                            ? true
                            : false
                        }
                        id="businessName"
                        className="WidhtFull100"
                        label="Company/Business name"
                        type="name"
                        value={values.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessName-error"
                      />
                      {errors.businessName && touched.businessName && (
                        <FormHelperText
                          className="errormsg"
                          id="businessName-error"
                        >
                          {errors.businessName}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.trendingName && touched.trendingName
                            ? true
                            : false
                        }
                        id="trendingName"
                        label="Trading name"
                        className="WidhtFull100"
                        type="trendingName"
                        value={values.trendingName}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="trendingName-error"
                      />
                      {errors.trendingName && touched.trendingName && (
                        <FormHelperText
                          className="errormsg"
                          id="trendingName-error"
                        >
                          {errors.trendingName}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <Select
                        id="address"
                        name="address"
                        placeholder="Search address"
                        label="Search address"
                        value={values.address}
                        onChange={e => {
                          setFieldValue('address', e)
                          setLatLongFun(e.value)
                        }}
                        onBlur={handleBlur}
                        onInputChange={e => {
                          if (e) setPossiblePlacesFun(e)
                        }}
                        margin="normal"
                        aria-describedby="role-number-error"
                        options={addressList}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.firstLine && touched.firstLine ? true : false
                        }
                        id="firstLine"
                        label="Address Line 1"
                        className="WidhtFull100"
                        type="firstLine"
                        value={values.firstLine}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="firstLine-error"
                      />
                      {errors.firstLine && touched.firstLine && (
                        <FormHelperText
                          className="errormsg"
                          id="firstLine-error"
                        >
                          {errors.firstLine}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.secondLine && touched.secondLine ? true : false
                        }
                        id="secondLine"
                        label="Address Line 2"
                        className="WidhtFull100"
                        type="secondLine"
                        value={values.secondLine}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="secondLine-error"
                      />
                      {errors.secondLine && touched.secondLine && (
                        <FormHelperText
                          className="errormsg"
                          id="secondLine-error"
                        >
                          {errors.secondLine}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.company_town && touched.company_town
                            ? true
                            : false
                        }
                        id="company_town"
                        className="WidhtFull100"
                        label="Town"
                        type="company_town"
                        value={values.company_town}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="company_town-error"
                      />
                      {errors.company_town && touched.company_town && (
                        <FormHelperText
                          className="errormsg"
                          id="company_town-error"
                        >
                          {errors.company_town}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.company_country && touched.company_country
                            ? true
                            : false
                        }
                        id="company_country"
                        className="WidhtFull100"
                        label="County"
                        type="text"
                        value={values.company_country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="company_country-error"
                      />
                      {errors.company_country && touched.company_country && (
                        <FormHelperText
                          className="errormsg"
                          id="company_country-error"
                        >
                          {errors.company_country}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.company_postcode && touched.company_postcode
                            ? true
                            : false
                        }
                        id="company_postcode"
                        className="WidhtFull100"
                        label="Postcode"
                        type="company_postcode"
                        value={values.company_postcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="company_postcode-error"
                      />
                      {errors.company_postcode && touched.company_postcode && (
                        <FormHelperText
                          className="errormsg"
                          id="company_postcode-error"
                        >
                          {errors.company_postcode}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <Select
                        className={
                          errors.businessType && touched.businessType
                            ? "ErrorColor"
                            : ""
                        }
                        error={
                          errors.businessType && touched.businessType
                            ? true
                            : false
                        }
                        isClearable
                        id="businessType"
                        placeholder="Select Company type"
                        value={values.businessType}
                        onChange={(e) => {
                          handleChangeBT(e);
                          setFieldValue("businessType", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="businessType-error"
                        name="colors"
                        options={BusinessTypeOption}
                      />
                      {errors.businessType && touched.businessType && (
                        <FormHelperText
                          className="errormsg"
                          id="businessType-error"
                        >
                          {errors.businessType}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.registerNumber && touched.registerNumber
                            ? true
                            : false
                        }
                        id="registerNumber"
                        label="Company registration number"
                        className="WidhtFull100"
                        type="registerNumber"
                        value={values.registerNumber}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="registerNumber-error"
                      />
                      {errors.registerNumber && touched.registerNumber && (
                        <FormHelperText
                          className="errormsg"
                          id="registerNumber-error"
                        >
                          {errors.registerNumber}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.vatNumber && touched.vatNumber ? true : false
                        }
                        id="vatNumber"
                        label="Company VAT number"
                        className="WidhtFull100"
                        type="vatNumber"
                        value={values.vatNumber}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="vatNumber-error"
                      />
                      {errors.vatNumber && touched.vatNumber && (
                        <FormHelperText
                          className="errormsg"
                          id="vatNumber-error"
                        >
                          {errors.vatNumber}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.gatewayNumber && touched.gatewayNumber
                            ? true
                            : false
                        }
                        id="gatewayNumber"
                        label="Gateway Number"
                        className="WidhtFull100"
                        type="gatewayNumber"
                        value={values.gatewayNumber}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="gatewayNumber-error"
                      />
                      {errors.gatewayNumber && touched.gatewayNumber && (
                        <FormHelperText
                          className="errormsg"
                          id="gatewayNumber-error"
                        >
                          {errors.gatewayNumber}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.bankName && touched.bankName ? true : false
                        }
                        id="bankName"
                        label="Bank Name"
                        className="WidhtFull100"
                        type="bankName"
                        value={values.bankName}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="bankName-error"
                      />
                      {errors.bankName && touched.bankName && (
                        <FormHelperText
                          className="errormsg"
                          id="bankName-error"
                        >
                          {errors.bankName}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.bankSortcode && touched.bankSortcode
                            ? true
                            : false
                        }
                        id="bankSortcode"
                        label="Bank Sortcode"
                        className="WidhtFull100"
                        type="bankSortcode"
                        value={values.bankSortcode}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="bankSortcode-error"
                      />
                      {errors.bankSortcode && touched.bankSortcode && (
                        <FormHelperText
                          className="errormsg"
                          id="bankSortcode-error"
                        >
                          {errors.bankSortcode}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.bankAccountNumber && touched.bankAccountNumber
                            ? true
                            : false
                        }
                        id="bankAccountNumber"
                        label="Bank Account Number"
                        className="WidhtFull100"
                        type="bankAccountNumber"
                        value={values.bankAccountNumber}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="bankAccountNumber-error"
                      />
                      {errors.bankAccountNumber && touched.bankAccountNumber && (
                        <FormHelperText
                          className="errormsg"
                          id="bankAccountNumber-error"
                        >
                          {errors.bankAccountNumber}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.creditScore && touched.creditScore
                            ? true
                            : false
                        }
                        id="creditScore"
                        label="Credit Score"
                        className="WidhtFull100"
                        type="creditScore"
                        value={values.creditScore}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="creditScore-error"
                      />
                      {errors.creditScore && touched.creditScore && (
                        <FormHelperText
                          className="errormsg"
                          id="creditScore-error"
                        >
                          {errors.creditScore}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                          <KeyboardDatePicker
                            variant="dialog"
                            inputVariant="outlined"
                            error={
                              errors.creditScoreDate && touched.creditScoreDate
                                ? true
                                : false
                            }
                            margin="normal"
                            id="creditScoreDate"
                            placeholder="Credit Score Date"
                            allowKeyboardControl
                            helperText={""}
                            className="WidhtFull100"
                            format="dd/MM/yyyy"
                            value={
                              values.creditScoreDate
                                ? values.creditScoreDate
                                : null
                            }
                            onChange={(e) =>
                              setFieldValue("creditScoreDate", e)
                            }
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                            aria-describedby="creditScoreDate-number-error"
                          />
                        </Grid>
                      </MuiPickersUtilsProvider>
                      {errors.creditScoreDate && touched.creditScoreDate && (
                        <FormHelperText
                          className="errormsg"
                          id="creditScoreDate-error"
                        >
                          {errors.creditScoreDate}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <TextField
                        variant="outlined"
                        error={errors.website && touched.website ? true : false}
                        id="website"
                        label="Website"
                        className="WidhtFull100"
                        type="website"
                        value={values.website}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="website-error"
                      />
                      {errors.website && touched.website && (
                        <FormHelperText className="errormsg" id="website-error">
                          {errors.website}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.utr && touched.utr
                            ? true
                            : false
                        }
                        id="utr"
                        className="WidhtFull100"
                        label="UTR"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={values.utr}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="utr-error"
                      />
                      {errors.utr && touched.utr && (
                        <FormHelperText
                          className="errormsg"
                          id="utr-error"
                        >
                          {errors.utr}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="large"
                      variant="contained"
                      onClick={handleReset}
                      disabled={!dirty || isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Add Company
                    </Button>
                    {startLoader && <CircularProgress />}
                  </CardActions>
                </form>
              );
            }}
          </Formik>
        </div>
      )}

      {selectedTab === "contact" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <AddContact {...props} showingFrom="addCompany" />{" "}
            </Suspense>
            <Suspense fallback={<></>}>
              <ContactList {...props} removeActions showingFrom="addCompany" />
            </Suspense>
          </Grid>
        </Grid>
      )}

      {selectedTab === "site" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <AddSite {...props} showingFrom="addCompany" />
            </Suspense>
            <Suspense fallback={<></>}>
              <SiteList {...props} removeActions showingFrom="addCompany" />
            </Suspense>
          </Grid>
        </Grid>
      )}
      {selectedTab === "assignee" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <Assignee {...props} showingFrom="addCompany" />
            </Suspense>
          </Grid>
        </Grid>
      )}
    </div>
  );
}