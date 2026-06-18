import React, { useState, useEffect, Suspense } from "react";
import Select from "react-select";
import { connect, useDispatch, useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AMPS, BusinessTypeOption } from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import SelectAddress from "../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectForAddress";
import { Common as ContactList } from "../../contact/loadable/Common";
import { Common as SiteList } from "../../site/loadable/Common";
import { Common as QuoteList } from "../../quote/loadable/Common";
import { Common as LeadList } from "../../lead/loadable/Common";
import { Common as HistoryTable } from "../../history/loadable/Common";
import { Common as DigitalDocList } from "../../digitalDocs/loadable/Common";
import MeterReading from "./meterReading";
import Documents from "../../company/sections/document";
import InstallerDocuments from "./installer_document";
import { AM, AMS } from "../../../sharedUtils/globalHelper/constantValues";
import {
  companyAction,
  companyReducer,
  companySaga,
  selectCompanyState,
  sliceKeyCompany,
} from "../../company/redux/company";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";

declare const google

const useStyles = makeStyles(() => ({
  Spacing: {
    marginBottom: "15px",
  },
  TopHeading: {
    position: "absolute",
    top: "1.8rem",
    left: "12rem",
  },
}));

export default function viewCompany(props) {
  // When user view any single company from clicking company name(ex: view company detail from view task)
  const [dummyOne, setDummyOne] = useState("hello");
  useEffect(() => {
    props._isLoadingData(true);
    if (props.slug && props.slug != "everyone") {
      props._slugUpdate(props);
    }
    props._viewSingleCompany({ companyId: props.company._id });
    setDummyOne("changedAgain");
  }, []);

  const _addDocument = (payload) =>
    dispatch(companyAction.AddDocument(payload));

  const _addMeterReading = (payload) =>
    dispatch(companyAction.AddMeterReading(payload));

  const _deleteDocuments = (payload) =>
    dispatch(companyAction.DeleteDocument(payload));

  const _deleteMeterReading = (payload) =>
    dispatch(companyAction.DeleteMeterReading(payload));

  const classes = useStyles();
  const [changeRole, setChangeRole] = useState("");
  const [selectedTab, setSelectedTab] = React.useState("company");
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("comment");
  const [isChecked, setIsChecked] = useState(
    props.currentCompany.isActive === 1
  );
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentCompany.isDelete === 1
  );
  const [results, setResults] = React.useState([]);
  const [LatitudeLongitude, setLatitudeLongitude] = useState(null);

  const companyState = useSelector(selectCompanyState);
  const dispatch = useDispatch();

  const [breadCrumbsOpt, setBreadCrumbsOpt] = useState([{ name: "/" }]);
  const setBreadCrumbs = (array) => {
    if (JSON.stringify(array) != JSON.stringify(breadCrumbsOpt)) {
      setBreadCrumbsOpt(array);
      dispatch(globalConfigActions.changeBreadCrumbs(array));
    }
  };

  const handleChangeBT = (event) => {
    setChangeRole(event.label);
  };

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const cu = value;
    if (value.creditScoreDate)
      cu.creditScoreDate = Number(new Date(value.creditScoreDate).getTime());
    if (value.isActive) cu.isActive = isChecked ? 1 : 2;
    if (value.businessType) cu.businessType = value.businessType.value;

    
    if (value.address?.label) {
      cu.address = value.address?.label
      if (LatitudeLongitude.latitude) cu.lat = LatitudeLongitude.latitude
      if (LatitudeLongitude.longitude) cu.lon = LatitudeLongitude.longitude
    }

    const companyUpdate = {
      editId: props.currentCompany._id,
      updateDetail: cu,
    };

    props._isLoadingData(true);
    props._editCompany(companyUpdate);
    dispatch(globalConfigActions.enableFeedback(`Company edited Successfully`));

    closeEdit(null);
    setSubmitting(false);
  };

  const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
    props._isLoadingData(true);
    if (isDeleteCheck) {
      const data = {
        id: props.currentCompany._id,
      };
      props._sendRequest(data);
    } else {
      const data = {
        editId: props.currentCompany._id,
        updateDetail: {
          isDelete: 0,
        },
      };
      props._editCompany(data);
    }

    dispatch(
      globalConfigActions.enableFeedback(
        `Delete request ${isDeleteCheck ? "sent" : "cancelled"} successfully`
      )
    );

    closeEdit(null);
    setSubmitting(false);
  };

  const currentProps = props;
  const {
    businessName,
    companyID,
    businessType,
    businessSector,
    firstLine,
    secondLine,
    town,
    country,
    postcode,
    registerNumber,
    vatNumber,
    gatewayNumber,
    bankName,
    bankSortcode,
    bankAccountNumber,
    creditScore,
    creditScoreDate,
    website,
    isActive,
    isDelete,
    utr,
    address
  } = props.currentCompany || {};

  if (
    !props.isLoadingData &&
    isDelete !== undefined &&
    dummyOne === "changedAgain"
  ) {
    setIsDelete(Number(isDelete) === 1);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };

  const addNotes = (data, v) => {
    data.append("id", currentProps.currentCompany._id);
    props._addNotes(data);
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

  if (props.isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h5" gutterBottom className={classes.TopHeading}>
          {businessName}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Paper>
          <Tabs
            variant="scrollable"
            value={selectedTab}
            scrollButtons="auto"
            onChange={tabHandleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="General" value="company" />
            <Tab label="Contacts" value="contacts" />
            <Tab label="Sites" value="sites" />
            {AMS.includes(props.slug) && <Tab label="Quotes" value="quotes" />}
            {AMS.includes(props.slug) && <Tab label="Leads" value="leads" />}
            {AMS.includes(props.slug) && (
              <Tab label="Documents" value="documents" />
            )}
            {AMS.includes(props.slug) && (
              <Tab label="Installer Documents" value="installer_document" />
            )}
            {AMS.includes(props.slug) && (
              <Tab label="Meter Reading" value="meterReading" />
            )}
            <Tab label="History" value="history" />
            {AMS.includes(props.slug) && (
              <Tab label="E-Sign docs" value="digitalDocs" />
            )}
          </Tabs>
        </Paper>
      </Grid>

      {selectedTab === "company" && (
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table" className="EditIconStyle">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Company ID</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {companyID}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Company Name</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="businessName"
                          value={businessName}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            businessName: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.businessName &&
                                    props.touched.businessName
                                  )
                                }
                                className="profile-pic"
                                name="businessName"
                                value={props.values.businessName}
                                helperText={!props.errors.businessName}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{businessName}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Business Sector</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="businessSector"
                          value={businessSector}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            businessSector: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.businessSector &&
                                    props.touched.businessSector
                                  )
                                }
                                className="profile-pic"
                                name="businessSector"
                                value={props.values.businessSector}
                                helperText={!props.errors.businessSector}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{businessType}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Business Type</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="businessType"
                          value={businessType}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            businessType: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Select
                                error={
                                  !!(
                                    props.errors.businessType &&
                                    props.touched.businessType
                                  )
                                }
                                className="profile-pic"
                                value={props.values.businessType}
                                onChange={(e) => {
                                  handleChangeBT(e);
                                  props.setFieldValue("businessType", e);
                                }}
                                onBlur={props.handleBlur}
                                margin="normal"
                                options={BusinessTypeOption}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{businessType}</TableCell>
                    )}
                  </TableRow>

                  {props.currentCompany !== undefined &&
                    props.currentCompany.Contact ? (
                    <TableRow>
                      <TableCell>
                        <strong>No of Employees</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {props.currentCompany.Contact.length}
                      </TableCell>
                    </TableRow>
                  ) : null}

                  <TableRow>
                    <TableCell>
                      <strong>Registration number</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="registerNumber"
                          value={registerNumber ? registerNumber : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            registerNumber: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.registerNumber &&
                                    props.touched.registerNumber
                                  )
                                }
                                className="profile-pic"
                                name="registerNumber"
                                value={props.values.registerNumber}
                                helperText={!props.errors.registerNumber}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{registerNumber}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>VAT Number</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="vatNumber"
                          value={vatNumber ? vatNumber : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            vatNumber: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.vatNumber &&
                                    props.touched.vatNumber
                                  )
                                }
                                className="profile-pic"
                                name="vatNumber"
                                value={props.values.vatNumber}
                                helperText={!props.errors.vatNumber}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{vatNumber}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <SelectAddress
                          name="address"
                          value={address}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            address: Yup.object()
                              .required("address is required")
                              .nullable(),
                          })}
                          options={addressList}
                          setLatLongFun={setLatLongFun}
                          setPossiblePlacesFun={setPossiblePlacesFun}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>{address || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Address line 1</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="firstLine"
                          value={firstLine}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            firstLine: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.firstLine &&
                                    props.touched.firstLine
                                  )
                                }
                                className="profile-pic"
                                name="firstLine"
                                value={props.values.firstLine}
                                helperText={!props.errors.firstLine}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{firstLine}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Address line 2</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="secondLine"
                          value={secondLine ? secondLine : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            secondLine: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.secondLine &&
                                    props.touched.secondLine
                                  )
                                }
                                className="profile-pic"
                                name="secondLine"
                                value={props.values.secondLine}
                                placeholder="name"
                                helperText={!props.errors.secondLine}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{secondLine}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Town</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="town"
                          value={town ? town : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            town: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(props.errors.town && props.touched.town)
                                }
                                className="profile-pic"
                                name="town"
                                value={props.values.town}
                                helperText={!props.errors.town}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{town}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>County</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="country"
                          value={country ? country : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            country: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.country &&
                                    props.touched.country
                                  )
                                }
                                className="profile-pic"
                                name="country"
                                value={props.values.country}
                                helperText={!props.errors.country}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{country}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Postcode</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="postcode"
                          value={postcode ? postcode : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            postcode: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.postcode &&
                                    props.touched.postcode
                                  )
                                }
                                className="profile-pic"
                                name="postcode"
                                value={props.values.postcode}
                                helperText={!props.errors.postcode}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{postcode}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Gateway Number</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="gatewayNumber"
                          value={gatewayNumber ? gatewayNumber : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            gatewayNumber: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.gatewayNumber &&
                                    props.touched.gatewayNumber
                                  )
                                }
                                className="profile-pic"
                                name="gatewayNumber"
                                value={props.values.gatewayNumber}
                                helperText={!props.errors.gatewayNumber}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{gatewayNumber}</TableCell>
                    )}
                  </TableRow>
                  <TableCell>
                    {" "}
                    <strong>Bank Name</strong>
                  </TableCell>
                  {["admin", "management", "partner", "sales_rep"].includes(
                    currentProps.slug
                  ) ? (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="bankName"
                        value={bankName ? bankName : 'N/A'}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          bankName: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                !!(
                                  props.errors.bankName &&
                                  props.touched.bankName
                                )
                              }
                              className="profile-pic"
                              name="bankName"
                              value={props.values.bankName}
                              helperText={!props.errors.bankName}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell>{bankName}</TableCell>
                  )}

                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Bank Sortcode</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="bankSortcode"
                          value={bankSortcode ? bankSortcode : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            bankSortcode: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.bankSortcode &&
                                    props.touched.bankSortcode
                                  )
                                }
                                className="profile-pic"
                                name="bankSortcode"
                                value={props.values.bankSortcode}
                                helperText={!props.errors.bankSortcode}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{bankSortcode}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Bank Account Number</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="bankAccountNumber"
                          value={bankAccountNumber ? bankAccountNumber : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            bankAccountNumber: Yup.string().required(
                              "Required"
                            ),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.bankAccountNumber &&
                                    props.touched.bankAccountNumber
                                  )
                                }
                                className="profile-pic"
                                name="bankAccountNumber"
                                value={props.values.bankAccountNumber}
                                helperText={!props.errors.bankAccountNumber}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{bankAccountNumber}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Credit Score</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="creditScore"
                          value={creditScore ? creditScore : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            creditScore: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.creditScore &&
                                    props.touched.creditScore
                                  )
                                }
                                className="profile-pic"
                                name="creditScore"
                                value={props.values.creditScore}
                                helperText={!props.errors.creditScore}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{creditScore}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Credit Score Date </strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="creditScoreDate"
                          value={
                            creditScoreDate ? creditScoreDate : ""
                          }
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            creditScoreDate: Yup.string().required("Required"),
                          })}
                          isShowDate={true}
                        >
                          {(props) => {
                            return (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                  <KeyboardDatePicker
                                    error={
                                      props.errors.creditScoreDate &&
                                        props.touched.creditScoreDate
                                        ? true
                                        : false
                                    }
                                    margin="normal"
                                    className="profile-pic"
                                    name="creditScoreDate"
                                    helperText={""}
                                    value={helperMethods.ConvertDate(
                                      Number(props.values.creditScoreDate)
                                    )}
                                    format="dd/MM/yyyy"
                                    onChange={(e) =>
                                      props.setFieldValue("creditScoreDate", e)
                                    }
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                    aria-describedby="creditScoreDate-number-error"
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>
                        {helperMethods.ConvertDate(Number(creditScoreDate))}
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <strong>Website</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="website"
                          value={website ? website : 'N/A'}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            website: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.website &&
                                    props.touched.website
                                  )
                                }
                                className="profile-pic"
                                name="website"
                                value={props.values.website}
                                helperText={!props.errors.website}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{website}</TableCell>
                    )}
                  </TableRow>


                  <TableRow>
                    <TableCell>
                      <strong>UTR</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="utr"
                          value={utr || ""}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            utr: Yup.number().positive().integer().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  !!(
                                    props.errors.utr &&
                                    props.touched.utr
                                  )
                                }
                                className="profile-pic"
                                name="utr"
                                type='number'
                                inputProps={{ min: 0 }}
                                value={props.values.utr}
                                helperText={!props.errors.utr}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{utr || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  {["management", "partner", 'sales_rep', 'Sales Rep'].includes(props.slug) && (
                    <TableRow>
                      <TableCell>
                        <strong>Delete Request</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="isDelete"
                          value={
                            Number(isDelete) === 1
                              ? "Delete request sent"
                              : "Send delete request"
                          }
                          onSubmit={sentDeleteRequest}
                          validateIt={Yup.object().shape({
                            isDelete: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Switch
                                checked={isDeleteCheck}
                                onChange={(event) => {
                                  setIsDelete(event.target.checked);
                                }}
                                value={props.values.isDelete}
                                name="isDelete"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper>
              <Tabs
                className="notesTabStyle"
                variant="scrollable"
                scrollButtons="auto"
                value={selectedNoteTabs}
                onChange={tabHandleChangeNote}
                aria-label="simple tabs example"
              >
                <Tab label="Comment" value="comment" />
              </Tabs>
            </Paper>
            {selectedNoteTabs === "comment" && (
              <Suspense fallback={<>Loading...</>}>
                <Notes
                  addNotes={(e, v) => addNotes(e, v)}
                  notesComment={currentProps.currentCompany.Notes}
                ></Notes>
              </Suspense>
            )}
          </Grid>
        </Grid>
      )}

      {selectedTab === "contacts" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <ContactList {...props} showingFrom="viewCompany" setBreadCrumbs={setBreadCrumbs} />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "sites" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            {" "}
            <SiteList {...props} showingFrom="viewCompany" setBreadCrumbs={setBreadCrumbs} />
          </Suspense>
        </Grid>
      )}

      {selectedTab == "quotes" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            {" "}
            <QuoteList {...props} showingFrom="viewCompany" type="quote" setBreadCrumbs={setBreadCrumbs} />
          </Suspense>
        </Grid>
      )}
      {selectedTab == "leads" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            {" "}
            <LeadList {...props} showingFrom="viewCompany" setBreadCrumbs={setBreadCrumbs} />
          </Suspense>
        </Grid>
      )}
      {selectedTab === "documents" && (
        <Suspense fallback={<>Loading...</>}>
          <Documents
            {...props}
            _deleteDocuments={_deleteDocuments}
            isAddDocumentLoading={companyState.addDocumentLoading}
            _addDocument={_addDocument}
          />
        </Suspense>
      )}
      {selectedTab === "installer_document" && (
        <Suspense fallback={<>Loading...</>}>
          <InstallerDocuments
            {...props}
            _deleteDocuments={_deleteDocuments}
            isAddDocumentLoading={companyState.addDocumentLoading}
            _addDocument={_addDocument}
          />
        </Suspense>
      )}
      {selectedTab === "meterReading" && (
        <Suspense fallback={<>Loading...</>}>
          <MeterReading
            {...props}
            _deleteMeterReading={_deleteMeterReading}
            addMeterReadingLoading={companyState.addMeterReadingLoading}
            _addMeterReading={_addMeterReading}
          />
        </Suspense>
      )}
      {selectedTab === "history" && (
        <Suspense fallback={<>Loading...</>}>
          <HistoryTable {...props} historyFor="Company" showingFrom="viewCompany" setBreadCrumbs={setBreadCrumbs} />
        </Suspense>
      )}
      {selectedTab === "digitalDocs" && (
        <Suspense fallback={<>Loading...</>}>
          <DigitalDocList {...props} showingFrom="viewCompany" setBreadCrumbs={setBreadCrumbs} />
        </Suspense>
      )}
    </Grid>
  );
}