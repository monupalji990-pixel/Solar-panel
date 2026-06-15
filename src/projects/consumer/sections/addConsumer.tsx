import React, { useState, useEffect, Suspense } from "react";
import { Formik } from "formik";
import { connect, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Assignee from "./assignee";
import { Title, AMP, EPCRatingOptions } from "../../../sharedUtils/globalHelper/constantValues";
import {
  consumerAction,
  consumerList,
  selectConsumerState,
} from "../redux/consumer";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import CitiesData from "../assets/cities.json";

declare const google

export default function AddConsumer(props) {
  return (
    <MyDrawer
      drawerSize="1100px"
      iconName="Consumer"
      open={props.open == "addConsumerDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddConsumerLogic {...props} />
    </MyDrawer>
  );
}

function AddConsumerLogic(props) {
  const consumerState = useSelector(selectConsumerState);

  const { message, hideSideBar, currentConsumer } = { ...consumerState };
  const dispatch = useDispatch();
  const _closeSideBar = (payload) =>
    dispatch(consumerAction.consumerCloseSideBar(payload));
  const _addConsumer = (payload) =>
    dispatch(consumerAction.addConsumer(payload));
  const _basicAction = (payload) =>
    dispatch(consumerAction.consumerBasicActions(payload));
  const _cityListForDropdown = (payload) =>
    dispatch(consumerAction.cityListForDropdown(payload));

  useEffect(() => {
    _basicAction({ addedConsumer: {} });
  }, []);

  const [selectedTab, setSelectedTab] = React.useState("consumer");
  const [startLoader, setStartLoader] = useState(false);
  const [ageCalc, setAgeCalc] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");
  const [consumerTitle, setConsumerTitle] = useState(null);
  const [consumerCity, setConsumerCity] = useState(null);
  const [results, setResults] = React.useState([]);
  const [LatitudeLongitude, setLatitudeLongitude] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    if (consumerState.success) {
      setStartLoader(false);
    }
  }, [consumerState.success]);
  if (hideSideBar) {
  }

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAgeCalc(age);
    return age;
  };

  const initialValues = {
    title: null,
    firstName: "",
    surName: "",
    addressOne: "",
    addressTwo: "",
    town: "",
    city: "",
    postcode: "",
    telephoneNumber: "", // legacy (derived from phoneNumbers on submit)
    mobile: "", // legacy (derived from phoneNumbers on submit)
    phoneNumbers: [
      {
        type: "mobile",
        number: "",
      },
    ],
    email: "",
    dob: "",
    age: ageCalc,
    bankName: "",
    sortCode: "",
    accountNumber: "",
    consumerId: "",
    siteAddress: "", // legacy (fallback on submit)
    EPCrating: null,
    address: null,
    lat: '',
    lon: ''
  };

  const phoneTypeOptions = [
    { label: "Mobile", value: "mobile" },
    { label: "Work", value: "work" },
    { label: "Home", value: "home" },
    { label: "Other", value: "other" },
  ];

  const normalizePhoneNumbers = (rows: any[]) => {
    if (!Array.isArray(rows)) return [];
    return rows
      .map((r) => ({
        type: String(r?.type || "other").toLowerCase(),
        number: String(r?.number || "").trim(),
      }))
      .filter((r) => r.number.length > 0);
  };

  const mapPhonesToLegacy = (rows: any[]) => {
    const normalized = normalizePhoneNumbers(rows);
    const mobileRow =
      normalized.find((r) => r.type === "mobile") ||
      normalized.find((r) => r.type === "home") ||
      normalized[0];
    const otherRow = normalized.find((r) => r !== mobileRow);
    return {
      mobile: mobileRow?.number || "",
      telephoneNumber: otherRow?.number || "",
    };
  };

  let citiesList = [];

  if (consumerState.cities)
    citiesList = consumerState.cities.map((e) => ({
      label: e.city,
      value: e._id,
    }));

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);

    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);

    if (event.length >= 0) {
      if (action === "city")
        _cityListForDropdown({
          searchText: event,
          limit: consumerState.cities.length + 10,
        });
    }
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const lazyLoadAPI = (event, action) => {
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);

    if (action === "city" && consumerState.cities.length <= 50)
      _cityListForDropdown({
        searchText: CurrentSearchText,
        limit: consumerState.cities.length + 10,
      });
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
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Consumer" value="consumer" />
              {AMP.includes(props.slug) &&
                <Tab label="Assignee" value="assignee" />
              }
            </Tabs>
          </Paper>
        </Grid>
      </Grid>

      {selectedTab === "consumer" && (
        <Formik
          initialValues={initialValues}
          onSubmit={(value) => {
            value.consumerId = currentConsumer._id;
            if (value.title) value.title = consumerTitle.value;
            if (value.city) value.city = value.city
            if (value.EPCrating) value.EPCrating = value.EPCrating?.value
            if (ageCalc) value.age = ageCalc;
            if (LatitudeLongitude?.latitude && LatitudeLongitude?.latitude !== "") value.lat = LatitudeLongitude?.latitude
            if (LatitudeLongitude?.longitude && LatitudeLongitude?.longitude !== "") value.lon = LatitudeLongitude?.longitude
            if (value.address?.label && value.address?.label !== undefined && value.address?.label !== null) value.address = value.address?.label

            // Backward-compatible mapping: keep legacy fields populated.
            const legacyPhones = mapPhonesToLegacy(value.phoneNumbers);
            value.mobile = legacyPhones.mobile;
            value.telephoneNumber = legacyPhones.telephoneNumber;

            // Site address removed from UI; keep legacy field populated for older API expectations.
            if (!value.siteAddress || String(value.siteAddress).trim().length === 0) {
              value.siteAddress =
                (value.address && String(value.address).trim().length > 0 ? value.address : "") ||
                value.addressOne ||
                value.postcode ||
                "";
            }

            // Optional bank details: if section is hidden, avoid sending partial stale values.
            if (!showBankDetails) {
              value.bankName = "";
              value.sortCode = "";
              value.accountNumber = "";
            }

            setStartLoader(true);
            _addConsumer({ value, handleCloseAddDrawer: props.onClose });
            setAgeCalc("");
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().nullable().required("Title is required"),
            firstName: Yup.string().required("First Name is required"),
            surName: Yup.string().required("Surname is required"),
            addressOne: Yup.string().required("Address 1 is required"),
            town: Yup.string().nullable(),
            city: Yup.string().required("City is required").nullable(),
            postcode: Yup.string().required("Postcode is required"),
            email: Yup.string().email("Enter a valid email").required("Email is required"),
            EPCrating: Yup.object().nullable().required("EPC rating is required"),
            dob: Yup.date().required("DOB is required"),
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
                  <Grid item xs={12} md={4}>
                    <Select
                      className={
                        errors.title && touched.title ? "ErrorColor" : ""
                      }
                      error={!!(errors.title && touched.title)}
                      id="title"
                      placeholder="Select Title"
                      value={consumerTitle}
                      onChange={(e) => {
                        setFieldValue("title", e);
                        setConsumerTitle(e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="title-error"
                      name="colors"
                      options={Title}
                    />
                    {errors.title && touched.title && (
                      <FormHelperText className="errormsg" id="title-error">
                        {errors.title}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={!!(errors.firstName && touched.firstName)}
                      label="First Name"
                      name="firstName"
                      className="WidhtFull100"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="firstName-error"
                    />
                    {errors.firstName && touched.firstName && (
                      <FormHelperText className="errormsg" id="firstName-error">
                        {errors.firstName}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={!!(errors.surName && touched.surName)}
                      label="Surname"
                      name="surName"
                      className="WidhtFull100"
                      value={values.surName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="surName-error"
                    />
                    {errors.surName && touched.surName && (
                      <FormHelperText className="errormsg" id="surName-error">
                        {errors.surName}
                      </FormHelperText>
                    )}
                  </Grid>

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

                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={!!(errors.addressOne && touched.addressOne)}
                      label="Address 1"
                      name="addressOne"
                      className="WidhtFull100"
                      value={values.addressOne}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="addressOne-error"
                    />
                    {errors.addressOne && touched.addressOne && (
                      <FormHelperText
                        className="errormsg"
                        id="addressOne-error"
                      >
                        {errors.addressOne}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={!!(errors.addressTwo && touched.addressTwo)}
                      label="Address 2"
                      name="addressTwo"
                      className="WidhtFull100"
                      value={values.addressTwo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="addressTwo-error"
                    />
                    {errors.addressTwo && touched.addressTwo && (
                      <FormHelperText
                        className="errormsg"
                        id="addressTwo-error"
                      >
                        {errors.addressTwo}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={errors.town && touched.town ? true : false}
                      label="Town (optional)"
                      name="town"
                      className="WidhtFull100"
                      value={values.town}
                      onChange={handleChange}
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
                      label="City"
                      name="city"
                      className="WidhtFull100"
                      value={values.city}
                      onChange={handleChange}
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
                  
                  {/* <Grid item xs={12} md={4}>
                    <Select
                      className={
                        errors && errors.city ? "ErrorColor" : ""
                      }
                      id="city"
                      name="city"
                      placeholder="Search City"
                      value={values.city}
                      onChange={(e) => {
                        setFieldValue("city", e);
                        // setConsumerCity(e);
                      }}
                      onBlur={handleBlur}
                      isLoading={isLoadingData}
                      // onInputChange={(e) => {
                      //   setIsLoadingData(true);
                      //   debounceOnChange(e, "city");
                      // }}
                      // onMenuScrollToBottom={(e) => {
                      //   const isCallNewOne = consumerState.cities.length % 10 === 0;
                      //   if (isCallNewOne) {
                      //     setIsLoadingData(true);
                      //     lazyLoadAPI(e, "city");
                      //   }
                      // }}
                      components={{
                        LoadingIndicator() {
                          return <CircularProgress />;
                        },
                      }}
                      margin="normal"
                      aria-describedby="role-number-error"
                      options={CitiesData}
                    />
                    <FormHelperText className="errormsg" id="city-error">
                      {errors.city}
                    </FormHelperText>
                  </Grid> */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      error={errors.postcode && touched.postcode ? true : false}
                      label="Postcode"
                      name="postcode"
                      className="WidhtFull100"
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

                  <Grid item xs={12} md={4}>
                    <Select
                      className={
                        errors.EPCrating && touched.EPCrating ? "ErrorColor" : ""
                      }
                      error={!!(errors.EPCrating && touched.EPCrating)}
                      id="EPCrating"
                      placeholder="Select EPCrating"
                      value={values.EPCrating}
                      onChange={(e) => {
                        setFieldValue("EPCrating", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="EPCrating-error"
                      name="EPCrating"
                      options={EPCRatingOptions}
                    />
                    {errors.EPCrating && touched.EPCrating && (
                      <FormHelperText className="errormsg" id="EPCrating-error">
                        {errors.EPCrating}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Paper style={{ padding: 12 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                          <strong>Phone Numbers</strong>
                        </Grid>

                        {(values.phoneNumbers || []).map((row, idx) => {
                          const selectedType =
                            phoneTypeOptions.find((t) => t.value === row?.type) ||
                            phoneTypeOptions[0];

                          return (
                            <React.Fragment key={`${idx}-${row?.type || "phone"}`}>
                              <Grid item xs={12} md={4}>
                                <Select
                                  id={`phoneNumbers.${idx}.type`}
                                  name={`phoneNumbers.${idx}.type`}
                                  placeholder="Type"
                                  value={selectedType}
                                  onChange={(e: any) =>
                                    setFieldValue(
                                      `phoneNumbers.${idx}.type`,
                                      e?.value || "other"
                                    )
                                  }
                                  options={phoneTypeOptions}
                                />
                              </Grid>

                              <Grid item xs={10} md={7}>
                                <TextField
                                  variant="outlined"
                                  label="Phone number"
                                  name={`phoneNumbers.${idx}.number`}
                                  className="WidhtFull100"
                                  value={row?.number || ""}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  margin="normal"
                                />
                              </Grid>

                              <Grid item xs={2} md={1}>
                                <IconButton
                                  aria-label="Remove phone number"
                                  onClick={() => {
                                    const next = [...(values.phoneNumbers || [])];
                                    next.splice(idx, 1);
                                    setFieldValue(
                                      "phoneNumbers",
                                      next.length > 0
                                        ? next
                                        : [{ type: "mobile", number: "" }]
                                    );
                                  }}
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Grid>
                            </React.Fragment>
                          );
                        })}

                        <Grid item xs={12}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setFieldValue("phoneNumbers", [
                                ...(values.phoneNumbers || []),
                                { type: "other", number: "" },
                              ]);
                            }}
                            startIcon={<AddIcon />}
                          >
                            Add number
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      variant="outlined"
                      // error={errors.email && touched.email ? true : false}
                      label="Email"
                      name="email"
                      className="WidhtFull100"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="email-error"
                    />
                    {/* {errors.email && touched.email && (
                      <FormHelperText className="errormsg" id="email-error">
                        {errors.email}
                      </FormHelperText>
                    )} */}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="space-around">
                        <KeyboardDatePicker
                          clearable
                          variant="dialog"
                          error={!!(errors.dob && touched.dob)}
                          disableFuture
                          inputVariant="outlined"
                          margin="normal"
                          className="WidhtFull100"
                          placeholder="Date of Birth"
                          allowKeyboardControl
                          format="dd/MM/yyyy"
                          value={values.dob ? values.dob : null}
                          onChange={(e) => {
                            setFieldValue("dob", e);
                            setFieldValue("age", handleChangeAge(e));
                          }}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="dob-error"
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    {errors.dob && touched.dob && (
                      <FormHelperText className="errormsg" id="dob-error">
                        {errors.dob}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      type="Number"
                      variant="outlined"
                      //label="Age"
                      placeholder="Age"
                      name="age"
                      className="WidhtFull100"
                      value={ageCalc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="age-error"
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {!showBankDetails ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setShowBankDetails(true)}
                      >
                        + Add Bank Details
                      </Button>
                    ) : (
                      <Paper style={{ padding: 12 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Grid container justify="space-between" alignItems="center">
                              <strong>Bank Details</strong>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => setShowBankDetails(false)}
                              >
                                Hide
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              variant="outlined"
                              label="Account Name"
                              name="bankName"
                              className="WidhtFull100"
                              value={values.bankName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              variant="outlined"
                              label="Account Number"
                              name="accountNumber"
                              type="Number"
                              className="WidhtFull100"
                              value={values.accountNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              variant="outlined"
                              label="Sort Code"
                              name="sortCode"
                              type="Number"
                              className="WidhtFull100"
                              value={values.sortCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Grid>

                  <CardActions
                    style={{ paddingLeft: 20, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={handleReset}
                      disabled={!dirty}
                    >
                      Reset
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Add Consumer
                    </Button>
                    {startLoader && <CircularProgress />}
                  </CardActions>
                </Grid>
              </form>
            );
          }}
        </Formik>
      )}

      {selectedTab === "assignee" && AMP.includes(props.slug) && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <Assignee
                {...props}
                showingFrom="addConsumer"
                assigneeList={consumerState.assigneeList}
                addedConsumer={consumerState.addedConsumer}
                messageCode={consumerState.messageCode}
                consumerState={consumerState}
              />
            </Suspense>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
