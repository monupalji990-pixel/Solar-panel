import React, { useEffect, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";
import TableContainer from "@material-ui/core/TableContainer";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { DropzoneDialog } from "material-ui-dropzone";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import SelectAddress from "../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectForAddress";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  AM,
  AMPS,
  EPCRatingOptions,
  MP,
  Title,
} from "../../../sharedUtils/globalHelper/constantValues";
import MeterReading from "./meterReading";
import Documents from "./document";
import InstallerDocuments from "./installer_document";
import { Common as HistoryTable } from "../../history/loadable/Common";
import { Common as AssigneeList } from "../../assignee/loadable/Common";
import { Common as LeadList } from "../../lead/loadable/Common";
import { Common as QuoteList } from "../../quote/loadable/Common";
import { Common as TaskList } from "../../task/loadable/Common";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectUsersState } from "../../users/redux/userAdmin";
import TaskComments from '../sections/taskComment';
import { Common as DigitalDocList } from "../../digitalDocsConsumer/loadable/Common";
import { Button } from "@material-ui/core";
import { CreateComplainTask } from '../../task/pages/CommonCreateTask';

declare const google

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  TypoSpace: {
    padding: "10px",
  },
  TopHeading: {
    position: "absolute",
    top: "1.7rem",
    left: "12rem",
    "@media(max-width:480px)": {
      position: "static",
      fontSize: "1.1rem",
      fontWeight: 500,
    },
  },
  TopButton: {
    position: "absolute",
    top: "1.7rem",
    right: "2rem",
    "@media(max-width:480px)": {
      position: "static",
      fontSize: "1.1rem",
      fontWeight: 500,
    },
  },
  marginSpacing: {
    marginTop: 10,
    marginBottom: 5,
  },
  paddingSpacing: {
    padding: 15,
  },
}));

export default function ViewConsumer(props) {
  return (
    <MyDrawer
      drawerSize="1250px"
      iconName="Consumer"
      open={props.open == "manageConsumerDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <ViewConsumerLogic {...props} />
    </MyDrawer>
  );
}

function ViewConsumerLogic(props) {
  const [dummyOne, setDummyOne] = useState("hello");

  useEffect(() => {
    props._isLoadingData(true);
    props._slugUpdate(props);
    props._viewConsumer({ consumerId: props.consumer._id });
    setDummyOne("changedAgain");
  }, []);

  const classes = useStyles();
  const [selectedTab, setSelectedTab] = React.useState("consumer");
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("comment");
  const [fileUpload, setFileUpload] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleteCheck, setIsDelete] = useState(
    props.currentConsumer?.isDelete === 1
  );
  const [results, setResults] = React.useState([]);
  const [LatitudeLongitude, setLatitudeLongitude] = useState(null);
  const [isComplainShow, setIsComplainShow] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const userState = useSelector(selectUsersState);

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleSaveFile = (files) => {
    setFileUpload(files);
    setOpenDialog(false);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const data = value;
    if (value.city) data.city = value.city

    if (value.address?.label) {
      data.address = value.address?.label
      if (LatitudeLongitude.latitude) data.lat = LatitudeLongitude.latitude
      if (LatitudeLongitude.longitude) data.lon = LatitudeLongitude.longitude
    }

    const consumerUpdate = {
      editId: props.currentConsumer._id,
      update: data,
    };
    props._isLoadingData(true);
    props._editConsumer(consumerUpdate);
    closeEdit(null);
    setSubmitting(false);
  };

  const currentProps = props;

  const {
    consumerId,
    mobile,
    title,
    DOB,
    accountNumber,
    addressOne,
    addressTwo,
    age,
    bankName,
    city,
    email,
    firstName,
    postcode,
    sortCode,
    surName,
    telephoneNumber,
    town,
    additionalFieldOne,
    additionalFieldTwo,
    isDelete,
    ecoStats,
    EPCrating,
    address
  }: any = props.currentConsumer !== undefined && props.currentConsumer;

  const phoneSummary = () => {
    const parts: string[] = [];
    if (mobile) parts.push(`Mobile: ${mobile}`);
    if (telephoneNumber) parts.push(`Other: ${telephoneNumber}`);
    return parts.length > 0 ? parts.join(" | ") : "N/A";
  };

  const addNotes = (data, v) => {
    data.append("id", currentProps.currentConsumer._id);
    props._addNotes(data);
  };

  if (
    !props.isLoadingData &&
    isDelete !== undefined &&
    dummyOne === "changedAgain"
  ) {
    setIsDelete(Number(isDelete) === 1);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
    props._isLoadingData(true);
    if (isDeleteCheck) {
      const data = {
        id: props.currentConsumer._id,
      };
      props._sendRequest(data);
    } else {
      const data = {
        editId: props.currentConsumer._id,
        update: {
          isDelete: 0,
        },
      };
      props._editConsumer(data);
    }
    closeEdit(null);
    setSubmitting(false);
  };

  let citiesList = [];

  if (userState.cities)
    citiesList = userState.cities.map((e) => ({
      label: e.city,
      value: e._id,
    }));

  // const ecoServiceState = () => {
  //   ecoStats
  //   return '';
  // }

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
    <Grid container spacing={2} className="txt-uppercase">
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom className={classes.TopHeading}>
            {`${title} ${firstName} ${surName}`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            className={classes.TopButton}
            size="small"
            variant="contained"
            color="secondary"
            type="button"
            onClick={() => setIsComplainShow((prev) => !prev)}
          >
            Add Complaint
          </Button>
        </Grid>
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
            <Tab label="General" value="consumer" />
            {AM.includes(props.slug) && (
              <Tab label="Assignee" value="assignee" />
            )}
            {AMPS.includes(props.slug) && <Tab label="Leads" value="leads" />}
            {!['installer', 'surveyor'].includes(props.slug) && <Tab label="Quotes" value="quotes" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Complaint" value="complaint" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Task" value="task" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Meter Reading" value="meterReading" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Documents" value="documents" />}
            {!['service_partner'].includes(props.slug) && <Tab label="Installer Documents" value="installer_documents" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="History" value="history" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="E-Sign docs" value="digitalDocs" />}
          </Tabs>
        </Paper>
      </Grid>

      {selectedTab === "consumer" && (
        <>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Consumer ID</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {consumerId}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Eco Services</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <strong>Sold:</strong> {ecoStats.sold.length > 0 ? ecoStats.sold.map((x) => x + ', ') : '0'} <br /><br />
                      <strong>UnSold:</strong> {ecoStats.unsoldSet.length > 0 ? ecoStats.unsoldSet.map((x) => x + ', ') : '0'}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Title</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="title"
                          value={title}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            title: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Select
                                error={
                                  !!(props.errors.title && props.touched.title)
                                }
                                className="profile-pic"
                                value={{
                                  label: props.values.title,
                                  value: props.values.title,
                                }}
                                onChange={(e) => {
                                  props.setFieldValue("title", e.value);
                                }}
                                onBlur={props.handleBlur}
                                margin="normal"
                                options={Title}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{title || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="firstName"
                          value={firstName}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            firstName: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.firstName &&
                                    props.touched.firstName
                                    ? true
                                    : false
                                }
                                name="firstName"
                                value={props.values.firstName}
                                onChange={props.handleChange}
                                helperText={!props.errors.firstName}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{firstName || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Surname</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="surName"
                          value={surName}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            surName: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.surName && props.touched.surName
                                    ? true
                                    : false
                                }
                                name="surName"
                                value={props.values.surName}
                                onChange={props.handleChange}
                                helperText={!props.errors.surName}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{surName || "N/A"}</TableCell>
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
                      <strong>Address 1</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="addressOne"
                          value={addressOne}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            addressOne: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.addressOne &&
                                    props.touched.addressOne
                                    ? true
                                    : false
                                }
                                name="addressOne"
                                value={props.values.addressOne}
                                onChange={props.handleChange}
                                helperText={!props.errors.addressOne}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{addressOne || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Address 2</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="addressTwo"
                          value={addressTwo || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            addressTwo: Yup.string().nullable(),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.addressTwo &&
                                    props.touched.addressTwo
                                    ? true
                                    : false
                                }
                                name="addressTwo"
                                value={props.values.addressTwo}
                                onChange={props.handleChange}
                                helperText={!props.errors.addressTwo}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{addressTwo || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Town</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="town"
                          value={town || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            town: Yup.string().nullable(),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.town && props.touched.town
                                    ? true
                                    : false
                                }
                                name="town"
                                value={props.values.town}
                                onChange={props.handleChange}
                                helperText={!props.errors.town}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{town || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>City</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="city"
                          value={city || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            city: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.city && props.touched.city
                                    ? true
                                    : false
                                }
                                name="city"
                                value={props.values.city}
                                onChange={props.handleChange}
                                helperText={!props.errors.city}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{city || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  {/* <TableRow>
                    <TableCell>
                      <strong>City 1</strong>
                    </TableCell>
                    <TableCell>{city || "N/A"}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>City 2</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <SelectCity
                          clickable={false}
                          reactSelect={true}
                          name="city"
                          value={{
                            label: city,
                            value: city,
                          }}
                          onSubmit={simpleEdit}
                          options={CitiesData}
                          data={userState}
                          isSearchable={true}
                          isMulti={false}
                        />
                      </TableCell>
                    ) : (
                      <TableCell>{city || "N/A"}</TableCell>
                    )}
                  </TableRow> */}

                  <TableRow>
                    <TableCell>
                      <strong>Postcode</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="postcode"
                          value={postcode || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            postcode: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.postcode &&
                                    props.touched.postcode
                                    ? true
                                    : false
                                }
                                name="postcode"
                                value={props.values.postcode}
                                onChange={props.handleChange}
                                helperText={!props.errors.postcode}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{postcode || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>EPC Rating</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="EPCrating"
                          value={EPCrating || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            EPCrating: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <Select
                                error={
                                  !!(props.errors.EPCrating && props.touched.EPCrating)
                                }
                                className="profile-pic"
                                value={{
                                  label: props.values.EPCrating,
                                  value: props.values.EPCrating,
                                }}
                                onChange={(e) => {
                                  props.setFieldValue("EPCrating", e.value);
                                }}
                                onBlur={props.handleBlur}
                                margin="normal"
                                options={EPCRatingOptions}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{EPCrating || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Phone Numbers</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {phoneSummary()}
                      {AMPS.includes(currentProps.slug) && (
                        <div style={{ marginTop: 8 }}>
                          <OnTextEditInput
                            name="mobile"
                            value={mobile || ""}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              mobile: Yup.string().nullable(),
                            })}
                          >
                            {(props) => (
                              <TextField
                                name="mobile"
                                label="Mobile"
                                type="number"
                                value={props.values.mobile}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            )}
                          </OnTextEditInput>

                          <OnTextEditInput
                            name="telephoneNumber"
                            value={telephoneNumber || ""}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              telephoneNumber: Yup.string().nullable(),
                            })}
                          >
                            {(props) => (
                              <TextField
                                name="telephoneNumber"
                                label="Other"
                                type="number"
                                value={props.values.telephoneNumber}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            )}
                          </OnTextEditInput>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="email"
                          value={email || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            email: Yup.string().nullable(),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.email && props.touched.email
                                    ? true
                                    : false
                                }
                                name="email"
                                value={props.values.email}
                                onChange={props.handleChange}
                                helperText={!props.errors.email}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{email || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>DOB</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="DOB"
                          value={
                            DOB !== undefined && DOB
                              ? // ? `${helperMethods.ConvertDate(DOB)}`
                              DOB
                              : ""
                          }
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            DOB: Yup.string().required("Required"),
                          })}
                          isShowDate={true}
                        >
                          {(props) => {
                            return (
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                  <KeyboardDatePicker
                                    error={
                                      props.errors.DOB && props.touched.DOB
                                        ? true
                                        : false
                                    }
                                    disableFuture
                                    name="DOB"
                                    margin="normal"
                                    helperText={""}
                                    placeholder="Date of Birth"
                                    allowKeyboardControl
                                    format="dd/MM/yyyy"
                                    value={props.values.DOB}
                                    onChange={(e) =>
                                      props.setFieldValue("DOB", e)
                                    }
                                    KeyboardButtonProps={{
                                      "aria-label": "change date",
                                    }}
                                    aria-describedby="DOB-error"
                                  />
                                </Grid>
                              </MuiPickersUtilsProvider>
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>
                        {DOB !== undefined && DOB
                          ? `${helperMethods.ConvertDate(DOB)}`
                          : ""}
                      </TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Age</strong>
                    </TableCell>
                    {AMPS.includes(currentProps.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="age"
                          value={age || "N/A"}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            age: Yup.string().required("Required"),
                          })}
                        >
                          {(props) => {
                            return (
                              <TextField
                                error={
                                  props.errors.age && props.touched.age
                                    ? true
                                    : false
                                }
                                name="age"
                                value={props.values.age}
                                onChange={props.handleChange}
                                helperText={!props.errors.age}
                                onBlur={props.handleBlur}
                                margin="normal"
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{age || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Bank Details</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {!showBankDetails && !(bankName || sortCode || accountNumber) ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setShowBankDetails(true)}
                        >
                          + Add Bank Details
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => setShowBankDetails((p) => !p)}
                          >
                            {showBankDetails ? "Hide" : "Show"}
                          </Button>
                          {(showBankDetails || bankName || sortCode || accountNumber) && (
                            <div>
                              {AMPS.includes(currentProps.slug) ? (
                                <>
                                  <OnTextEditInput
                                    name="bankName"
                                    value={bankName || ""}
                                    onSubmit={simpleEdit}
                                    validateIt={Yup.object().shape({
                                      bankName: Yup.string().nullable(),
                                    })}
                                  >
                                    {(props) => (
                                      <TextField
                                        name="bankName"
                                        label="Account Name"
                                        value={props.values.bankName}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        margin="normal"
                                      />
                                    )}
                                  </OnTextEditInput>

                                  <OnTextEditInput
                                    name="accountNumber"
                                    value={accountNumber || ""}
                                    onSubmit={simpleEdit}
                                    validateIt={Yup.object().shape({
                                      accountNumber: Yup.string().nullable(),
                                    })}
                                  >
                                    {(props) => (
                                      <TextField
                                        name="accountNumber"
                                        label="Account Number"
                                        value={props.values.accountNumber}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        margin="normal"
                                      />
                                    )}
                                  </OnTextEditInput>

                                  <OnTextEditInput
                                    name="sortCode"
                                    value={sortCode || ""}
                                    onSubmit={simpleEdit}
                                    validateIt={Yup.object().shape({
                                      sortCode: Yup.string().nullable(),
                                    })}
                                  >
                                    {(props) => (
                                      <TextField
                                        name="sortCode"
                                        label="Sort Code"
                                        value={props.values.sortCode}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        margin="normal"
                                      />
                                    )}
                                  </OnTextEditInput>
                                </>
                              ) : (
                                <div>
                                  <div>{bankName ? `Account Name: ${bankName}` : ""}</div>
                                  <div>{accountNumber ? `Account Number: ${accountNumber}` : ""}</div>
                                  <div>{sortCode ? `Sort Code: ${sortCode}` : ""}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>

                  {additionalFieldOne && (
                    <TableRow>
                      <TableCell>
                        <strong>Additional Field One</strong>
                      </TableCell>
                      {AMPS.includes(currentProps.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="additionalFieldOne"
                            value={additionalFieldOne || "N/A"}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              additionalFieldOne: Yup.string().required(
                                "Required"
                              ),
                            })}
                          >
                            {(props) => {
                              return (
                                <TextField
                                  error={
                                    props.errors.additionalFieldOne &&
                                      props.touched.additionalFieldOne
                                      ? true
                                      : false
                                  }
                                  name="additionalFieldOne"
                                  value={props.values.additionalFieldOne}
                                  onChange={props.handleChange}
                                  helperText={!props.errors.additionalFieldOne}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell>{additionalFieldOne || "N/A"}</TableCell>
                      )}
                    </TableRow>
                  )}

                  {additionalFieldTwo && (
                    <TableRow>
                      <TableCell>
                        <strong>Additional Field Two</strong>
                      </TableCell>
                      {AMPS.includes(currentProps.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            name="additionalFieldTwo"
                            value={additionalFieldTwo || "N/A"}
                            onSubmit={simpleEdit}
                            validateIt={Yup.object().shape({
                              additionalFieldTwo: Yup.string().required(
                                "Required"
                              ),
                            })}
                          >
                            {(props) => {
                              return (
                                <TextField
                                  error={
                                    props.errors.additionalFieldTwo &&
                                      props.touched.additionalFieldTwo
                                      ? true
                                      : false
                                  }
                                  name="additionalFieldTwo"
                                  value={props.values.additionalFieldTwo}
                                  onChange={props.handleChange}
                                  helperText={!props.errors.additionalFieldTwo}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                />
                              );
                            }}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell>{additionalFieldTwo || "N/A"}</TableCell>
                      )}
                    </TableRow>
                  )}

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
                <Tab label="Notes (Task Comments)" value="notes" />
              </Tabs>
            </Paper>
            {selectedNoteTabs === "comment" && (
              <Suspense fallback={<>Loading...</>}>
                <Notes
                  addNotes={(e, v) => addNotes(e, v)}
                  notesComment={currentProps.currentConsumer.Notes}
                ></Notes>
              </Suspense>
            )}

            {selectedNoteTabs === "notes" && (
              <Suspense fallback={<>Loading...</>}>
                <TaskComments {...props} />
              </Suspense>
            )}
          </Grid>
        </>
      )}

      {selectedTab === "assignee" && AM.includes(props.slug) && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <AssigneeList {...props} showingFrom="viewConsumer" />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "leads" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <LeadList
              {...props}
              showingFrom="viewConsumer"
              isCreatedFrom="Consumer"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "quotes" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <QuoteList
              {...props}
              showingFrom="viewConsumer"
              type="quote"
              isCreatedFrom="Consumer"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "complaint" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <TaskList
              {...props}
              showingFrom="viewConsumer"
              isCreatedFrom="Consumer"
              isFor="complaint"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "task" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <TaskList
              {...props}
              showingFrom="viewConsumer"
              isCreatedFrom="Consumer"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "meterReading" && (
        <Suspense fallback={<>Loading...</>}>
          <MeterReading {...props} />
        </Suspense>
      )}

      {selectedTab === "documents" && (
        <Suspense fallback={<>Loading...</>}>
          <Documents {...props} />
        </Suspense>
      )}

      {selectedTab === "installer_documents" && (
        <Suspense fallback={<>Loading...</>}>
          <InstallerDocuments {...props} />
        </Suspense>
      )}

      {/*
      //not in use
      
      {selectedTab === 'notes' && <Suspense fallback={<>Loading...</>}> <Notes {...props} /></Suspense>} */}
      {selectedTab === "history" && (
        <Suspense fallback={<>Loading...</>}>
          {" "}
          <HistoryTable {...props} historyFor="Consumer" showingFrom="viewConsumer" />
        </Suspense>
      )}

      {selectedTab === "digitalDocs" && (
        <Suspense fallback={<>Loading...</>}>
          <DigitalDocList {...props} showingFrom="viewConsumer" />
        </Suspense>
      )}

      {/* Create Task as a Complain */}
      {isComplainShow && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <CreateComplainTask
              {...props}
              openModal={true}
              onClose={() => {
                setIsComplainShow(false);
              }}
              showingFrom="viewConsumer"
              isCreatedFrom="Consumer"
            />
          </Suspense>
        </Grid>
      )}


      <DropzoneDialog
        fullWidth
        maxWidth="md"
        // className="FileUploadDesign"
        filesLimit={8}
        open={openDialog}
        onSave={handleSaveFile}
        acceptedFiles={[
          "image/jpeg",
          "image/png",
          "image/bmp",
          ".pdf",
          ".csv",
          ".mp4",
          ".mp3",
          ".mkv",
          ".mov",
          ".ts",
        ]}
        showPreviews
        maxFileSize={500000000}
        onClose={handleCloseDialog}
      />
    </Grid>
  );
}