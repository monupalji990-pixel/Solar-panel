import React, { useState, useEffect, Suspense } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
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
import { DropzoneDialog } from "material-ui-dropzone";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AMPS, BusinessTypeOption } from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import SelectAddress from "../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectForAddress";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { Common as HistoryTable } from "../../history/loadable/Common";
import Documents from "./document";
import InstallerDocuments from "./installer_document";
import MeterReading from "./meterReading";
import { Common as SiteList } from "../../site/loadable/Common";
import { Common as ContactList } from "../../contact/loadable/Common";
import { Common as LeadList } from "../../lead/loadable/Common";
import { Common as QuoteList } from "../../quote/loadable/Common";
import { Common as RenewalList } from "../../renewal/loadable/Common";
import { Common as TaskList } from "../../task/loadable/Common";
import { Common as DigitalDocList } from "../../digitalDocs/loadable/Common";
import { Common as AssigneeList } from "../../assignee/loadable/Common";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";
import TaskComments from '../sections/taskComment';
import { Button } from "@material-ui/core";
import { CreateComplainTask } from "../../task/pages/CommonCreateTask";

declare const google

const useStyles = makeStyles(() => ({
  Spacing: {
    marginBottom: "15px",
  },
  TopHeading: {
    position: "absolute",
    top: "1.8rem",
    left: "12rem",
    "@media(max-width:480px)": {
      position: "static",
      fontSize: "1.1rem",
      fontWight: 500,
    },
  },
  marginSpacing: {
    marginTop: 10,
    marginBottom: 5,
  },
  paddingSpacing: {
    padding: 15,
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
}));

export default function ManageCompany(props) {
  return (
    <MyDrawer
      drawerSize="1250px"
      iconName="Company"
      open={props.open === "manageCompanyDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <ManageCompanyLogic {...props} />
    </MyDrawer>
  );
}

function ManageCompanyLogic(props) {
  const [dummyOne, setDummyOne] = useState("hello");

  useEffect(() => {
    props._isLoadingData(true);
    props._slugUpdate(props);
    props._viewSingleCompany({ companyId: props.company._id });
    setDummyOne("changedAgain");
  }, []);

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
  const [openDialog, setOpenDialog] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const [results, setResults] = React.useState([]);
  const [LatitudeLongitude, setLatitudeLongitude] = useState(null);
  const [isComplainShow, setIsComplainShow] = useState(false);

  const dispatch = useDispatch();

  const handleChangeBT = (event) => {
    setChangeRole(event.label);
  };

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
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

  const simpleEdit = (value, closeEdit, setSubmitting) => {
    const cu = value;
    if (value.creditScoreDate) cu.creditScoreDate = value.creditScoreDate;
    if (value.isActive) cu.isActive = isChecked ? 1 : 2;

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
    isDelete,
    isCompanyClose,
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
    <Grid container spacing={2} className="txt-uppercase">
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5" gutterBottom className={classes.TopHeading}>
            {businessName}
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
            <Tab label="General" value="company" />
            {["admin", "management"].includes(props.slug) && (
              <Tab label="Assignee" value="assignee" />
            )}
            <Tab label="Contacts" value="contacts" />
            <Tab label="Sites" value="sites" />
            {["admin", "management", "partner", "sales_rep", "service_partner"].includes(
              props.slug
            ) && <Tab label="Leads" value="leads" />}

            {!['installer', 'surveyor'].includes(props.slug) &&
              <Tab label="Quotes" value="quotes" />
            }

            {['service_partner', 'admin', 'management'].includes(props.slug) && <Tab label="Renewals" value="renewals" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Complaint" value="complaint" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Task" value="task" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Meter Reading" value="meterReading" />}
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="Documents" value="documents" />}
            {!['service_partner'].includes(props.slug) && <Tab label="Installer Documents" value="installer_document" />}
            <Tab label="History" value="history" />
            {!['service_partner', 'installer', 'surveyor'].includes(props.slug) && <Tab label="E-Sign docs" value="digitalDocs" />}
          </Tabs>
        </Paper>
      </Grid>

      {selectedTab === "company" && (
        <>
          <Grid item md={6} xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
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
                          value={businessName || "N/A"}
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
                      <TableCell>{businessName || "N/A"}</TableCell>
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
                          value={businessSector || "N/A"}
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
                      <TableCell>{businessType || "N/A"}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Company Type</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="businessType"
                          value={businessType || "N/A"}
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
                                value={{
                                  label: props.values.businessType,
                                  value: props.values.businessType,
                                }}
                                onChange={(e) => {
                                  props.setFieldValue("businessType", e.value);
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
                      <TableCell>{businessType || "N/A"}</TableCell>
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
                          value={registerNumber || "N/A"}
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
                      <TableCell>{registerNumber || "N/A"}</TableCell>
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
                          value={vatNumber || "N/A"}
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
                      <TableCell>{vatNumber || "N/A"}</TableCell>
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
                          value={firstLine || "N/A"}
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
                      <TableCell>{firstLine || "N/A"}</TableCell>
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
                          value={secondLine || "N/A"}
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
                      <TableCell>{secondLine || "N/A"}</TableCell>
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
                          value={town || "N/A"}
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
                      <TableCell>{town || "N/A"}</TableCell>
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
                          value={country || "N/A"}
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
                      <TableCell>{country || "N/A"}</TableCell>
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
                      <TableCell>{postcode || "N/A"}</TableCell>
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
                          value={gatewayNumber || "N/A"}
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
                      <TableCell>{gatewayNumber || "N/A"}</TableCell>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <strong>Bank Name</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="bankName"
                          value={bankName}
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
                      <TableCell>{bankName || "N/A"}</TableCell>
                    )}
                  </TableRow>

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
                          value={bankSortcode || "N/A"}
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
                      <TableCell>{bankSortcode || "N/A"}</TableCell>
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
                          value={bankAccountNumber || "N/A"}
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
                      <TableCell>{bankAccountNumber || "N/A"}</TableCell>
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
                          value={creditScore || "N/A"}
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
                      <TableCell>{creditScore || "N/A"}</TableCell>
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
                            creditScoreDate
                              ? // ? helperMethods.ConvertDate(creditScoreDate)
                              creditScoreDate
                              : ""
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
                                    value={props.values.creditScoreDate}
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
                      <strong>Website</strong>
                    </TableCell>
                    {["admin", "management", "partner", "sales_rep"].includes(
                      currentProps.slug
                    ) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="website"
                          value={website || "N/A"}
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
                      <TableCell>{website || "N/A"}</TableCell>
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

                  <TableRow>
                    <TableCell>
                      <strong>Close Company</strong>
                    </TableCell>
                    {["admin", "management"].includes(props.slug) ? (
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="isCompanyClose"
                          value={isCompanyClose}
                          onSubmit={simpleEdit}
                          validateIt={Yup.object().shape({
                            isCompanyClose: Yup.boolean().required("Required"),
                          })}
                          ShowOnChecked='closed'
                          showOnUnCheck='Active'
                          switch={true}
                        >
                          {(props) => {
                            return (
                              <Switch
                                checked={props.values.isCompanyClose}
                                onChange={(event) => {
                                  props.setFieldValue('isCompanyClose', event.target.checked)
                                }}
                                value={props.values.isCompanyClose}
                                name="checkedA"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            );
                          }}
                        </OnTextEditInput>
                      </TableCell>
                    ) : (
                      <TableCell>{`userStatus`}</TableCell>
                    )}
                  </TableRow>

                  {["management", "partner", 'sales_rep', 'Sales Rep'].includes(currentProps.slug) && (
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
                  notesComment={currentProps.currentCompany.Notes}
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

      {selectedTab === "assignee" &&
        ["admin", "management"].includes(props.slug) && (
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <AssigneeList {...props} showingFrom="viewCompany" />
            </Suspense>
          </Grid>
        )}

      {selectedTab === "contacts" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <ContactList {...props} showingFrom="viewCompany" />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "sites" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <SiteList {...props} showingFrom="viewCompany" />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "leads" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <LeadList
              {...props}
              showingFrom="viewCompany"
              isCreatedFrom="Company"
              closeCompanyDrawer={props.onClose}
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "quotes" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <QuoteList
              {...props}
              showingFrom="viewCompany"
              type="quote"
              isCreatedFrom="Company"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "renewals" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <RenewalList {...props}
              showingFrom="viewCompany"
              isCreatedFrom="Company"
            />
          </Suspense>
        </Grid>
      )}

      {selectedTab === "complaint" && (
        <Grid item xs={12} md={12}>
          <Suspense fallback={<>Loading...</>}>
            <TaskList
              {...props}
              showingFrom="viewCompany"
              isCreatedFrom="Company"
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
              showingFrom="viewCompany"
              isCreatedFrom="Company"
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
      {selectedTab === "installer_document" && (
        <Suspense fallback={<>Loading...</>}>
          <InstallerDocuments {...props} />
        </Suspense>
      )}
      {selectedTab === "notes" && (
        <Suspense fallback={<>Loading...</>}>
          <Notes {...props} />
        </Suspense>
      )}
      {selectedTab === "history" && (
        <Suspense fallback={<>Loading...</>}>
          <HistoryTable {...props} historyFor="Company" showingFrom="viewCompany" />
        </Suspense>
      )}

      {selectedTab === "digitalDocs" && (
        <Suspense fallback={<>Loading...</>}>
          <DigitalDocList {...props} showingFrom="viewCompany" />
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
              showingFrom="viewCompany"
              isCreatedFrom="Company"
            />
          </Suspense>
        </Grid>
      )}

      <DropzoneDialog
        fullWidth
        maxWidth="md"
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
