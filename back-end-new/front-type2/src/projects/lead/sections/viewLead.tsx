import React, { useEffect, useState, Suspense, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as Yup from "yup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Switch from "@material-ui/core/Switch";
import TableContainer from "@material-ui/core/TableContainer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  leadOptions,
  CompanyServiceTypes,
  ConsumerServiceTypes,
  SubServiceOptions,
  CompanySubServiceOptions,
  AM,
  sourceOptions,
  paidSolarLeadStatus,
  ecoLeadStatus,
  B2BConsumerServices,
  B2BCompanyServices,
  LeadJobTypeOptions,
} from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { Common as TaskList } from "../../task/loadable/Common";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Lodash from "lodash";
import { CommonSimple as ViewSimpleCompany } from "../../company/loadable/CommonSimple";
import { CommonSimple as ViewSimpleConsumer } from "../../consumer/loadable/CommonSimple";
import Notes from "../../../sharedUtils/sharedComponents/notes";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import SoldService from "./soldService";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { Common as HistoryTable } from "../../history/loadable/Common";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";
import { Typography } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {
  assigneeAction,
  selectAssigneeState,
} from "projects/assignee/redux/assignee";
import {
  companyAction,
  selectCompanyState,
} from "projects/company/redux/company";
import { selectSiteState, siteAction } from "projects/site/Redux/site";
import { Common as PriceCommission } from "../../price_commission/loadable/Common";
import SelectEditHelper from "../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelect";
import PhotoGallery from "../../quote/sections/photoGallery";
import LeadDigitalDashboard from "./leadDigitalDashboard";
import LeadDigitalDashboardPaidSolar from "./leadDigitalDashboardPaidSolar";
import CommisionCost from "../sections/commissionCost";
import { selectLoggedUser } from "projects/authentication/redux/auth";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
  },
  marginSpacing: {
    marginTop: 10,
    marginBottom: 5,
  },
  paddingSpacing: {
    padding: 15,
  },
  topBtnStyle: {
    background: "#193562",
    color: "#ffffff",
    "&:hover": {
      background: "#193562",
      color: "#ffffff",
    },
    padding: "7px 7px",
    borderRadius: 20,
  },
  setTopBtn: {
    position: "absolute",
    top: "1.5rem",
    right: 0,
    paddingLeft: "10rem",
    "@media(max-width:767px)": {
      top: "1rem",
    },
    width: "auto",
  },

  RightBtnStyle: {
    paddingRight: "2.8rem",
    marginLeft: 20,
  },
}));

export default function ViewLead(props) {
  const ds =
    props.showingFrom &&
    ["viewCompany", "viewConsumer"].includes(props.showingFrom)
      ? "100vw"
      : "100vw";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Lead"
      open={props.open == "manageLeadDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <ViewLeadLogic {...props} />
    </MyDrawer>
  );
}

function ViewLeadLogic(props) {
  const currentProps = props;
  const [dummyOne, setDummyOne] = useState("hello");

  useEffect(() => {
    props._isLoadingData(true);
    props._leadDetail({
      slug: props.slug,
      leadId: props.lead._id,
    });
    setDummyOne("changedAgain");

    if (AM.includes(props.slug)) {
      if (companyState.companies && companyState.companies.length > 0) {
        dispatch(companyAction.companyListForDropDown({ slug: props.slug }));
      }

      if (
        assigneeState.assigneeListForDropdown &&
        assigneeState.assigneeListForDropdown.length <= 0
      ) {
        dispatch(assigneeAction.list(null));
      }
      if (
        assigneeState.assigneeListInstallerForDropdown &&
        assigneeState.assigneeListInstallerForDropdown.length <= 0
      ) {
        dispatch(
          assigneeAction.listInstaller({ role: "62b02a8fda27b400c8b8cf1e" })
        );
      }
      if (
        assigneeState.assigneeListSurveyorForDropdown &&
        assigneeState.assigneeListSurveyorForDropdown.length <= 0
      ) {
        dispatch(
          assigneeAction.listSurveyor({ role: "62a8266b193c318de458db58" })
        );
      }
    }
  }, [props.lead, props.slug]);

  const classes = useStyles();
  const [defaultSS, setDefaultSS] = useState([]);
  const [defaultEco, setDefaultEco] = useState([]);
  const [defaultSubSer, setDefaultSubSer] = useState([]);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [selectedNoteTabs, setselectedNoteTabs] = React.useState("comment");
  const [isShowCompany, setIsShowCompany] = React.useState(false);
  const [companyData, setCompanyData] = React.useState({});
  const [isShowConsumer, setIsShowConsumer] = React.useState(false);
  const [consumerData, setConsumerData] = React.useState({});
  const [isDeleteCheck, setIsDelete] = useState(
    props.singleLead && props.singleLead.isDelete === 1
  );
  const singleDetail = props.singleLead || {};
  const { isDelete } = singleDetail || {};

  const userData = useSelector(selectLoggedUser);

  const dispatch = useDispatch();

  function handleSearchCompanyForDropDown(payload) {
    if (payload.search && payload.search.length > 2)
      dispatch(
        companyAction.companyListForDropDownSearch({
          searchText: payload.search,
        })
      );

    if (payload.current && payload.current.length > 0 && !payload.search) {
      dispatch(companyAction.companyListForDropDownSearch({ searchText: "" }));
    }
  }
  const delayedQuerySearchCompanyDropDown = useCallback(
    Lodash.debounce((payload) => {
      handleSearchCompanyForDropDown(payload);
    }, 500),
    []
  );
  function handleCompanyDropDownPageChange() {
    dispatch(
      companyAction.companyListForDropDownLimit({
        page: companyState.pageForDropDown + 1,
        limit: companyState.limitForDropDown,
      })
    );
  }

  useEffect(() => {
    if (AM.includes(props.slug)) {
      if (singleDetail.Company && singleDetail.Company._id)
        dispatch(
          siteAction.siteListForleadDropDown({
            companyId: singleDetail.Company._id,
          })
        );
    }
  }, [singleDetail.Company?._id]);

  useEffect(() => {
    if (AM.includes(props.slug)) {
      dispatch(assigneeAction.list(null));
      dispatch(companyAction.companyListForDropDown({ slug: props.slug }));
    }
  }, []);

  const assigneeState = useSelector(selectAssigneeState);
  const companyState = useSelector(selectCompanyState);
  const siteState = useSelector(selectSiteState);

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  useEffect(() => {
    if (
      !props.isLoading &&
      singleDetail !== undefined &&
      singleDetail.subServiceType
    ) {
      setDefaultSubSer(
        singleDetail?.subServiceType?.map((v: any) => ({
          label: v.split(" ").join(""),
          value: v.split(" ").join(""),
        }))
      );

      // let ecoSer = ["Eco"];

      // if (singleDetail.subServiceType.length > 0) {
      //   setDefaultEco(ecoSer);
      // }else{
      //   setDefaultEco([]);
      // }

      setDummyOne(Math.random().toString(36).substring(7));
    }

    if (
      !props.isLoading &&
      singleDetail !== undefined &&
      singleDetail.serviceType &&
      dummyOne === "changedAgain"
    ) {
      setDefaultSS(
        singleDetail?.serviceType?.map((v) => ({
          label: v.split(" ").join(""),
          value: v.split(" ").join(""),
        }))
      );
      setDummyOne(Math.random().toString(36).substring(7));
    }

    if (
      !props.isLoading &&
      isDelete !== undefined &&
      dummyOne === "changedAgain"
    ) {
      setIsDelete(Number(isDelete) === 1);
      setDummyOne(Math.random().toString(36).substring(7));
    }
  }, [props.isLoading]);

  const editDetail = (data) => {
    const { _id, serviceType, subServiceType, status, Site, Contact, Company } =
      singleDetail || {};
    const so: any = {};
    let updateField = "";

    so.leadId = _id;
    const newSt = [];
    so.serviceType = serviceType;
    so.subServiceType = subServiceType;
    so.status = status;
    if (data.id) so.id = data.id.value;
    if (data.status) {
      updateField = "status";
      so.status = data.status;
      so.historyStatus = `Status changed from ${status} to ${data.status}`;
      if (data.notes) so.notes = data.notes;
    }
    if (data.serviceType) {
      data.serviceType.map((v) => newSt.push(v.value));
      so.serviceType = newSt;
    }

    if (data.subServiceType) {
      data.subServiceType.map((v) => newSt.push(v.value));
      so.subServiceType = newSt;
    } else {
      so.subServiceType = [];
    }
    if (Site) so.Site = Site._id;
    if (Contact) so.Contact = Contact._id;
    if (Company) so.Company = Company._id;

    if (data.company) {
      so.Company = data.company.value;
      so.Site = "";
      so.Assignee = "";
    }
    if (data.site) so.Site = data.site.value;
    if (data.assignee) so.Assignee = data.assignee.value;
    if (data.jobType) so.jobType = data.jobType;
    if (data.source) {
      so.source = data.source;
    }
    if (data.appoinmentBooker) {
      so.appoinmentBooker = data.appoinmentBooker.value;
    }
    if (data.LeadGenerator) {
      so.LeadGenerator = data.LeadGenerator.value;
    }
    if (data.leadAdministrator)
      so.leadAdministrator = data.leadAdministrator.value;
    if (data.Installer) {
      so.Installer = data.Installer.value;
    }
    if (data.Surveyor) {
      so.Surveyor = data.Surveyor.value;
    }
    if (data.SystemDesigner) {
      so.SystemDesigner = data.SystemDesigner.value;
    }
    if (data.dialer) {
      so.dialer = data.dialer.value;
    }
    if (data.salesRep?.value) so.salesRep = data.salesRep.value;

    if (data.ASHPInstaller?.value)
      so["ASHPInstaller"] = data.ASHPInstaller?.value;
    if (data.CavityWallInstaller?.value)
      so["CavityWallInstaller"] = data.CavityWallInstaller?.value;
    if (data.Electricians?.value) so["Electricians"] = data.Electricians?.value;
    if (data.ExternalWallInsulation?.value)
      so["ExternaWallInsulation"] = data.ExternalWallInsulation?.value;
    if (data.GasEngineers?.value) so["GasEngineers"] = data.GasEngineers?.value;
    if (data.InternalWallInsulation?.value)
      so["InternalWallInsulation"] = data.InternalWallInsulation?.value;
    if (data.LoftInstaller?.value)
      so["LoftInstaller"] = data.LoftInstaller?.value;
    if (data.Roofers?.value) so["Roofers"] = data.Roofers?.value;
    if (data.RoomInRoofInstaller?.value)
      so["RoomInRoofInstaller"] = data.RoomInRoofInstaller?.value;
    if (data.Scaffolders?.value) so["Scaffolders"] = data.Scaffolders?.value;
    if (data.UnderFloorInstaller?.value)
      so["UnderFloorInstaller"] = data.UnderFloorInstaller?.value;
    if (data.VentilationInstaller?.value)
      so["VentilationInstaller"] = data.VentilationInstaller?.value;

    props._leadUpdate({
      data: so,
      updateField,
      closeDrawer: props.onClose,
      showingFrom: currentProps.showingFrom,
      closeCompanyDrawer: currentProps.closeCompanyDrawer,
    });
  };

  const sentDeleteRequest = (value, closeEdit, setSubmitting) => {
    props._isLoadingData(true);
    if (isDeleteCheck) {
      const data = {
        id: singleDetail?._id,
      };
      props._sendRequest(data);
    } else {
      const data = {
        leadId: singleDetail?._id,
        isDelete: 0,
      };
      props._leadUpdate(data);
    }
    dispatch(
      globalConfigActions.enableFeedback(
        `Delete request ${isDeleteCheck ? "sent" : "cancelled"} successfully`
      )
    );

    closeEdit(null);
    setSubmitting(false);
  };

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabHandleChangeNote = (event, newValue) => {
    setselectedNoteTabs(newValue);
  };

  if (props.isLoading) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  const viewCompany = (data) => {
    setIsShowCompany(true);
    setCompanyData(data);
  };

  const viewConsumer = (data) => {
    setIsShowConsumer(true);
    setConsumerData(data);
  };

  const addNotes = (data, v) => {
    data.append("id", currentProps.singleLead?._id);
    props._addNotes(data);
  };

  const nextLead = () => {
    let x = props.leadPointer;

    if (x < props.leadList.length - 1) {
      x++;
      props._pointerChange(x);
      props.viewLeadDetail(props.leadList[x]);
    }
  };

  const prevLead = () => {
    let y = props.leadPointer;

    if (y > 0) {
      y--;
      props._pointerChange(y);
      props.viewLeadDetail(props.leadList[y]);
    }
  };

  const { Company, Consumer } = singleDetail || {};
  let DropServices = [];
  // if (!props.isLoading && Company) DropServices = CompanyServiceTypes;
  // if (!props.isLoading && Consumer) DropServices = ConsumerServiceTypes;

  if (singleDetail?.leadType) {
    switch (singleDetail?.leadType) {
      case "B2B Sales":
        if (Company) {
          DropServices = B2BCompanyServices;
        } else {
          DropServices = B2BConsumerServices;
        }
        break;
      case "Paid Solar Sales":
        DropServices = [
          {
            label: "Paid Solar",
            value: "PaidSolar",
          },
        ];
        break;
      case "ECO Sales":
        DropServices = [
          {
            label: "Eco",
            value: "Eco",
          },
        ];
        break;
    }
  }

  let DropSubServices = [];
  if (!props.isLoading && Consumer) DropSubServices = SubServiceOptions;

  let FilterUserData = [];
  if (assigneeState.assigneeListForDropdown)
    assigneeState.assigneeListForDropdown.filter((e) => {
      if (
        ["Sales Rep", "sales_rep"].includes(e?.role?.roleName) &&
        e.city_list &&
        e.city_list.length > 0 &&
        e.city_list.includes(singleDetail?.Consumer?.city)
      ) {
        FilterUserData.push({
          label: e.name,
          value: e._id,
        });
      } else if (!["Sales Rep", "sales_rep"].includes(e?.role?.roleName)) {
        FilterUserData.push({
          label: e.name,
          value: e._id,
        });
      }
    });

  let allPl = [];
  if (assigneeState.assigneeListForDropdown)
    allPl = assigneeState.assigneeListForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));

  let allSalesRep = [];
  if (assigneeState.assigneeListForDropdown) {
    allSalesRep = assigneeState.assigneeListForDropdown.filter((e) => {
      return e.role?.roleName === "Sales Rep";
    });
  }

  let allInstaller = [];
  if (assigneeState.assigneeListInstallerForDropdown)
    allInstaller = assigneeState.assigneeListInstallerForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));

  let allSurveyor = [];
  if (assigneeState.assigneeListSurveyorForDropdown)
    allSurveyor = assigneeState.assigneeListSurveyorForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));

  let fUserData = [];
  if (FilterUserData)
    fUserData = FilterUserData.map((e) => ({ label: e.label, value: e.value }));

  let companyOption = [];
  if (companyState.companyListForDropDown)
    companyOption = companyState.companyListForDropDown.map((e) => ({
      label: e.company,
      value: e._id,
    }));

  let siteOption = [];
  if (siteState.siteListForLeadDropDown)
    siteOption = siteState.siteListForLeadDropDown.map((e) => ({
      label: e.siteName,
      value: e._id,
    }));

  const fetchUsersList = (option) => {
    if (assigneeState.assigneeListForDropdown.length > 0) {
      let userList = assigneeState.assigneeListForDropdown;
      switch (option) {
        case "Scaffolders": {
          let sca = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              sca.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return sca;
        }
        case "Roofers": {
          let roof = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              roof.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return roof;
        }
        case "Electricians": {
          let elec = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              elec.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return elec;
        }
        case "GasEngineers": {
          let gasEng = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              gasEng.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return gasEng;
        }
        case "CavityWallInstaller": {
          let cwI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              cwI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return cwI;
        }
        case "UnderFloorInstaller": {
          let ufI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              ufI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return ufI;
        }
        case "LoftInstaller": {
          let LI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              LI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return LI;
        }
        case "VentilationInstaller": {
          let VI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              VI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return VI;
        }
        case "InternalWallInsulation": {
          let IWI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              IWI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return IWI;
        }
        case "ExternalWallInsulation": {
          let EWI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              EWI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return EWI;
        }
        case "RoomInRoofInstaller": {
          let RRI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              RRI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return RRI;
        }
        case "ASHPInstaller": {
          let ASHPI = [];
          userList.map((f) => {
            if (f.installerType?.includes(option)) {
              ASHPI.push({
                label: f.name,
                value: f._id,
              });
            }
          });
          return ASHPI;
        }
      }
    }
  };

  let statusOptions = [];

  switch (singleDetail?.leadType) {
    case "B2B Sales":
      statusOptions = leadOptions;
      break;
    case "Paid Solar Sales":
      statusOptions = paidSolarLeadStatus;
      break;
    case "ECO Sales":
      statusOptions = ecoLeadStatus;
      break;
    default:
      statusOptions = leadOptions;
      break;
  }

  const getDigitalDashboardTab = () => {
    if (
      currentProps.singleLead.Consumer?._id &&
      currentProps.singleLead.serviceType.includes("Eco")
    ) {
      return <Tab label="Digital Dashboard" value={4} />;
    } else if (
      currentProps.singleLead.Consumer?._id &&
      currentProps.singleLead.serviceType.includes("PaidSolar")
    ) {
      return <Tab label="Digital Dashboard" value={5} />;
    } else if (
      currentProps.singleLead.Company?._id &&
      currentProps.singleLead.serviceType.includes("PaidSolar")
    ) {
      return <Tab label="Digital Dashboard" value={5} />;
    }
  };

  return (
    <div className="txt-uppercase app">
      <Grid container className={classes.setTopBtn}>
        <Grid direction="row" justify="flex-start" alignItems="center">
          <Tooltip title="Previous">
            <IconButton
              disabled={props.leadPointer <= 0}
              onClick={prevLead}
              className={classes.topBtnStyle}
              aria-label="previous"
            >
              <ArrowForwardIosIcon style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid
          direction="row"
          justify="flex-end"
          alignItems="center"
          className={classes.RightBtnStyle}
        >
          <Tooltip title="Next">
            <IconButton
              disabled={props.leadPointer >= props.leadList.length - 1}
              onClick={nextLead}
              className={classes.topBtnStyle}
              aria-label="next"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="General" />
              {!["service_partner"].includes(props.slug) && (
                <Tab label="View Task" />
              )}
              <Tab label="History" />
              {currentProps.singleLead &&
                currentProps.singleLead.Company !== undefined &&
                AM.includes(props.slug) && <Tab label="Price & Commission" />}
              {getDigitalDashboardTab()}
            </Tabs>
          </Paper>
        </Grid>
        {selectedTab === 0 && (
          <>
            <Grid item md={4} xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="caption table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Lead ID</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {singleDetail ? singleDetail.leadId : null}{" "}
                      </TableCell>
                    </TableRow>

                    {props.isCreatedFrom === undefined &&
                      currentProps.singleLead &&
                      currentProps.singleLead.Company !== undefined && (
                        <TableRow>
                          <TableCell>
                            {" "}
                            <strong>Company </strong>
                          </TableCell>
                          {AM.includes(props.slug) ? (
                            <>
                              <TableCell component="th" scope="row">
                                <SelectEditHelper
                                  clickable={true}
                                  onClickFn={() =>
                                    viewCompany(singleDetail.Company)
                                  }
                                  reactSelect={true}
                                  name="company"
                                  value={
                                    singleDetail !== undefined &&
                                    singleDetail.Company !== undefined &&
                                    singleDetail.Company
                                      ? {
                                          label:
                                            singleDetail?.Company?.businessName,
                                          value: singleDetail?.Company?._id,
                                        }
                                      : ""
                                  }
                                  onSubmit={editDetail}
                                  validateIt={Yup.object().shape({
                                    company: Yup.object()
                                      .required("company is required")
                                      .nullable(),
                                  })}
                                  options={companyOption}
                                  companyState={companyState}
                                  delayedSearch={
                                    delayedQuerySearchCompanyDropDown
                                  }
                                  handleScrollDown={
                                    handleCompanyDropDownPageChange
                                  }
                                />
                              </TableCell>
                            </>
                          ) : (
                            <TableCell
                              component="th"
                              scope="row"
                              onClick={() => viewCompany(singleDetail?.Company)}
                              onMouseOver={(e) => {
                                (e.target as HTMLElement).style.textDecoration =
                                  "underline";
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.textDecoration =
                                  "none";
                              }}
                            >
                              {singleDetail !== undefined &&
                              singleDetail.Company !== undefined &&
                              singleDetail.Company
                                ? singleDetail.Company.businessName
                                : ""}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {props.isCreatedFrom === undefined &&
                      currentProps.singleLead &&
                      currentProps.singleLead.Consumer !== undefined && (
                        <>
                          <TableRow>
                            <TableCell>
                              <strong>Consumer</strong>
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              onClick={() =>
                                viewConsumer(singleDetail.Consumer)
                              }
                              onMouseOver={(e) => {
                                (e.target as HTMLElement).style.textDecoration =
                                  "underline";
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.textDecoration =
                                  "none";
                              }}
                            >
                              {singleDetail !== undefined &&
                              singleDetail.Consumer !== undefined &&
                              singleDetail.Consumer
                                ? `${singleDetail.Consumer.firstName} ${singleDetail.Consumer.surName}`
                                : null}{" "}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    {currentProps.singleLead &&
                      currentProps.singleLead.Consumer !== undefined && (
                        <>
                          {singleDetail !== undefined &&
                            singleDetail.Consumer !== undefined &&
                            singleDetail.Consumer &&
                            singleDetail.Consumer.mobile && (
                              <TableRow>
                                <TableCell>
                                  <strong>Mobile</strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {singleDetail.Consumer.mobile}
                                </TableCell>
                              </TableRow>
                            )}

                          {singleDetail !== undefined &&
                            singleDetail.Consumer !== undefined &&
                            singleDetail.Consumer &&
                            singleDetail.Consumer.telephoneNumber && (
                              <TableRow>
                                <TableCell>
                                  <strong>Telephone Number</strong>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {singleDetail !== undefined &&
                                  singleDetail.Consumer !== undefined &&
                                  singleDetail.Consumer
                                    ? `${singleDetail.Consumer.telephoneNumber}`
                                    : null}
                                </TableCell>
                              </TableRow>
                            )}
                        </>
                      )}

                    {(props.isCreatedFrom === undefined ||
                      props.isCreatedFrom == "Company") &&
                      currentProps.singleLead &&
                      currentProps.singleLead?.Company && (
                        <TableRow>
                          <TableCell>
                            <strong>Site Name</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                reactSelect
                                name="site"
                                value={
                                  singleDetail !== undefined &&
                                  singleDetail.Site !== undefined &&
                                  singleDetail.Site
                                    ? {
                                        label: singleDetail.Site.siteName,
                                        value: singleDetail.Site._id,
                                      }
                                    : null
                                }
                                onSubmit={editDetail}
                                validateIt={Yup.object().shape({
                                  site: Yup.object()
                                    .required("site is required")
                                    .nullable(),
                                })}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="site"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="site"
                                      value={props.values.site}
                                      onChange={(e) => {
                                        props.setFieldValue("site", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="site-number-error"
                                      name="site"
                                      options={siteOption}
                                      isloading={!siteState.remote}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail !== undefined &&
                              singleDetail.Site !== undefined &&
                              singleDetail.Site
                                ? singleDetail.Site.siteName
                                : null}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    <TableRow>
                      <TableCell>
                        <strong>Service Name</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="serviceType"
                          value={
                            singleDetail !== undefined &&
                            singleDetail.serviceType !== undefined &&
                            singleDetail.serviceType
                              ? helperMethods.arrayToString(
                                  singleDetail.serviceType.concat(defaultEco)
                                )
                              : null
                          }
                          onSubmit={editDetail}
                          validateIt={Yup.object().shape({
                            serviceType: Yup.array()
                              .required("Service type is required")
                              .nullable(),
                          })}
                        >
                          {(props) => (
                            <Grid className="RatingInfo">
                              <Select
                                error={
                                  props.errors.serviceType &&
                                  props.touched.serviceType
                                }
                                className="WidhtFull100 basic-multi-select"
                                isMulti
                                onChange={(e) => {
                                  if (e) {
                                    setDefaultSS(
                                      e.map((v) => ({
                                        label: v.value.split(" ").join(""),
                                        value: v.value.split(" ").join(""),
                                      }))
                                    );
                                  } else {
                                    setDefaultSS([]);
                                  }
                                  props.setFieldValue("serviceType", e);
                                }}
                                value={defaultSS}
                                onBlur={props.handleBlur}
                                margin="normal"
                                options={DropServices}
                                classNamePrefix="select"
                              />
                            </Grid>
                          )}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>

                    {singleDetail.serviceType &&
                      singleDetail.serviceType.includes("Eco") && (
                        <TableRow>
                          <TableCell>
                            <strong>Sub Service Name</strong>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="subServiceType"
                              value={
                                singleDetail !== undefined &&
                                singleDetail.subServiceType !== undefined &&
                                singleDetail.subServiceType
                                  ? helperMethods.arrayToString(
                                      singleDetail.subServiceType
                                    )
                                  : null
                              }
                              onSubmit={editDetail}
                              validateIt={Yup.object().shape({
                                subServiceType: Yup.array()
                                  .required("Sub Service type is required")
                                  .nullable(),
                              })}
                            >
                              {(props) => (
                                <Grid className="RatingInfo">
                                  <Select
                                    error={
                                      props.errors.subServiceType &&
                                      props.touched.subServiceType
                                    }
                                    className="WidhtFull100 basic-multi-select"
                                    isMulti
                                    onChange={(e) => {
                                      if (e) {
                                        setDefaultSubSer(
                                          e.map((v) => ({
                                            label: v.value.split(" ").join(""),
                                            value: v.value.split(" ").join(""),
                                          }))
                                        );
                                      } else {
                                        setDefaultSubSer([]);
                                      }
                                      props.setFieldValue("subServiceType", e);
                                    }}
                                    value={defaultSubSer}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    options={
                                      currentProps.singleLead.Company
                                        ? CompanySubServiceOptions
                                        : SubServiceOptions
                                    }
                                    classNamePrefix="select"
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        </TableRow>
                      )}

                    <TableRow>
                      <TableCell>
                        <strong>Lead Type</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {singleDetail.leadType || "N/A"}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Job Type</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="jobType"
                          value={
                            singleDetail !== undefined && singleDetail.jobType
                          }
                          onSubmit={editDetail}
                          validateIt={Yup.object().shape({
                            jobType: Yup.string()
                              .required("Job Type is required")
                              .nullable(),
                          })}
                        >
                          {(props) => (
                            <Grid item>
                              <Select
                                id="jobType"
                                className="WidhtFull100 basic-multi-select"
                                placeholder="Job Type"
                                value={{
                                  label: props.values.jobType,
                                  value: props.values.jobType,
                                }}
                                onChange={(e) => {
                                  props.setFieldValue("jobType", e.value);
                                }}
                                onBlur={props.handleBlur}
                                margin="normal"
                                aria-describedby="jobType-number-error"
                                name="jobType"
                                options={LeadJobTypeOptions}
                              />
                            </Grid>
                          )}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <OnTextEditInput
                          name="status"
                          value={
                            singleDetail !== undefined && singleDetail.status
                          }
                          onSubmit={editDetail}
                          validateIt={Yup.object().shape({
                            status: Yup.string()
                              .required("Status is required")
                              .nullable(),
                          })}
                        >
                          {(props) => (
                            <Grid item>
                              <Select
                                id="status"
                                className="WidhtFull100 basic-multi-select"
                                placeholder="Status"
                                value={{
                                  label: props.values.status,
                                  value: props.values.status,
                                }}
                                onChange={(e) => {
                                  props.setFieldValue("status", e.value);
                                }}
                                onBlur={props.handleBlur}
                                margin="normal"
                                aria-describedby="status-number-error"
                                name="status"
                                options={leadOptions}
                              />
                            </Grid>
                          )}
                        </OnTextEditInput>
                      </TableCell>
                    </TableRow>

                    {props.isCreatedFrom === undefined &&
                      currentProps.singleLead &&
                      currentProps.singleLead.Contact !== undefined && (
                        <TableRow>
                          <TableCell>
                            <strong>Contact</strong>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {singleDetail !== undefined &&
                            singleDetail.Contact !== undefined &&
                            singleDetail.Contact
                              ? singleDetail.Contact.name
                              : null}{" "}
                          </TableCell>
                        </TableRow>
                      )}

                    <TableRow>
                      <TableCell>
                        <strong>Assignee</strong>
                      </TableCell>
                      {AM.includes(props.slug) ? (
                        <TableCell component="th" scope="row">
                          <OnTextEditInput
                            reactSelect={true}
                            name="assignee"
                            value={
                              singleDetail !== undefined &&
                              singleDetail.Assignee !== undefined &&
                              singleDetail.Assignee
                                ? {
                                    label: singleDetail.Assignee.name,
                                    value: singleDetail.Assignee._id,
                                  }
                                : ""
                            }
                            onSubmit={editDetail}
                            validateIt={Yup.object().shape({
                              assignee: Yup.object()
                                .required("assignee is required")
                                .nullable(),
                            })}
                          >
                            {(props) => (
                              <Grid item>
                                <Select
                                  id="assignee"
                                  className="WidhtFull100 basic-multi-select"
                                  placeholder="assignee"
                                  value={props.values.assignee}
                                  onChange={(e) => {
                                    props.setFieldValue("assignee", e);
                                  }}
                                  onBlur={props.handleBlur}
                                  margin="normal"
                                  aria-describedby="assignee-number-error"
                                  name="assignee"
                                  options={
                                    currentProps.singleLead &&
                                    currentProps.singleLead.Consumer !==
                                      undefined
                                      ? fUserData
                                      : allPl
                                  }
                                />
                              </Grid>
                            )}
                          </OnTextEditInput>
                        </TableCell>
                      ) : (
                        <TableCell component="th" scope="row">
                          {singleDetail !== undefined &&
                          singleDetail.Assignee !== undefined &&
                          singleDetail.Assignee
                            ? singleDetail.Assignee.name
                            : ""}
                        </TableCell>
                      )}
                    </TableRow>

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Source</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="source"
                              value={singleDetail.source}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="source"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Source"
                                    value={{
                                      label: props.values.source,
                                      value: props.values.source,
                                    }}
                                    onChange={(e) => {
                                      props.setFieldValue("source", e.value);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="source"
                                    options={sourceOptions}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.source || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Appoinment Booker</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="appoinmentBooker"
                              value={singleDetail?.appoinmentBooker?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="appoinmentBooker"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Appoinment Booker"
                                    value={props.values.appoinmentBooker}
                                    onChange={(e) => {
                                      props.setFieldValue(
                                        "appoinmentBooker",
                                        e
                                      );
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="appoinmentBooker"
                                    options={allPl}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.source || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Sales Rep</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="salesRep"
                              value={singleDetail?.salesRep?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="salesRep"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Sales Rep"
                                    value={props.values.salesRep?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("salesRep", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="salesRep"
                                    options={allSalesRep.map((x) => ({
                                      label: x.name,
                                      value: x._id,
                                    }))}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.salesRep?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Lead Generator</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="LeadGenerator"
                              value={singleDetail?.LeadGenerator?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="LeadGenerator"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Lead Generator"
                                    value={props.values.LeadGenerator?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("LeadGenerator", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="LeadGenerator"
                                    options={allPl}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.LeadGenerator?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Lead Administrator</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="leadAdministrator"
                              value={singleDetail?.leadAdministrator?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="leadAdministrator"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Lead Administrator"
                                    value={props.values.leadAdministrator?.name}
                                    onChange={(e) => {
                                      props.setFieldValue(
                                        "leadAdministrator",
                                        e
                                      );
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="leadAdministrator"
                                    options={allPl}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.leadAdministrator?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>System Designer</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="SystemDesigner"
                              value={singleDetail?.SystemDesigner?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="SystemDesigner"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="System Designer"
                                    value={props.values.SystemDesigner?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("SystemDesigner", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="SystemDesigner"
                                    options={allPl}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.SystemDesigner?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Lead Dialer</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="dialer"
                              value={singleDetail?.dialer?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="dialer"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Select Lead Dialer"
                                    value={props.values.dialer?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("dialer", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="dialer"
                                    options={allPl}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.LeadGenerator?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead && singleDetail?.Installer?.name && (
                      <TableRow>
                        <TableCell>
                          <strong>Installer</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="Installer"
                              value={singleDetail?.Installer?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="Installer"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Installer"
                                    value={props.values.Installer?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("Installer", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="Installer"
                                    options={allInstaller}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.Installer?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {/* Installer Type --------------------------------------------- start ----- */}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Scaffolders</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="Scaffolders"
                                value={singleDetail?.Scaffolders?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="Scaffolders"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Scaffolders"
                                      value={props.values.Scaffolders?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("Scaffolders", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="Scaffolders"
                                      options={fetchUsersList("Scaffolders")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.Scaffolders?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Roofers</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="Roofers"
                                value={singleDetail?.Roofers?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="Roofers"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Roofers"
                                      value={props.values.Roofers?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("Roofers", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="Roofers"
                                      options={fetchUsersList("Roofers")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.Roofers?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Electricians</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="Electricians"
                                value={singleDetail?.Electricians?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="Electricians"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Electricians"
                                      value={props.values.Electricians?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("Electricians", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="Electricians"
                                      options={fetchUsersList("Electricians")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.Electricians?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Gas Engineers</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="GasEngineers"
                                value={singleDetail?.GasEngineers?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="GasEngineers"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="GasEngineers"
                                      value={props.values.GasEngineers?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("GasEngineers", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="GasEngineers"
                                      options={fetchUsersList("GasEngineers")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.GasEngineers?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Cavity Wall Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="CavityWallInstaller"
                                value={singleDetail.CavityWallInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="CavityWallInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Cavity Wall Installer"
                                      value={
                                        props.values.CavityWallInstaller?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "CavityWallInstaller",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="CavityWallInstaller"
                                      options={fetchUsersList(
                                        "CavityWallInstaller"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.CavityWallInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Under Floor Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="UnderFloorInstaller"
                                value={singleDetail.UnderFloorInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="UnderFloorInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Under Floor Installer"
                                      value={
                                        props.values.UnderFloorInstaller?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "UnderFloorInstaller",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="UnderFloorInstaller"
                                      options={fetchUsersList(
                                        "UnderFloorInstaller"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.UnderFloorInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Loft Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="LoftInstaller"
                                value={singleDetail.LoftInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="LoftInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Loft Installer"
                                      value={props.values.LoftInstaller?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("LoftInstaller", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="LoftInstaller"
                                      options={fetchUsersList("LoftInstaller")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.LoftInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Ventilation Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="VentilationInstaller"
                                value={singleDetail.VentilationInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="VentilationInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Ventilation Installer"
                                      value={
                                        props.values.VentilationInstaller?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "VentilationInstaller",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="VentilationInstaller"
                                      options={fetchUsersList(
                                        "VentilationInstaller"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.VentilationInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Internal Wall Insulation</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="InternalWallInsulation"
                                value={
                                  singleDetail.InternalWallInsulation?.name
                                }
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="InternalWallInsulation"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Internal Wall Insulation"
                                      value={
                                        props.values.InternalWallInsulation
                                          ?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "InternalWallInsulation",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="InternalWallInsulation"
                                      options={fetchUsersList(
                                        "InternalWallInsulation"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.InternalWallInsulation?.name ||
                                "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>External Wall Insulation</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="ExternalWallInsulation"
                                value={
                                  singleDetail.ExternalWallInsulation?.name
                                }
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="ExternalWallInsulation"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="External Wall Insulation"
                                      value={
                                        props.values.ExternalWallInsulation
                                          ?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "ExternalWallInsulation",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="ExternalWallInsulation"
                                      options={fetchUsersList(
                                        "ExternalWallInsulation"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.ExternalWallInsulation?.name ||
                                "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" &&
                      singleDetail.leadType !== "Paid Solar Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>Room In Roof Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="RoomInRoofInstaller"
                                value={singleDetail.RoomInRoofInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="RoomInRoofInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="Room In Roof Installer"
                                      value={
                                        props.values.RoomInRoofInstaller?.name
                                      }
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          "RoomInRoofInstaller",
                                          e
                                        );
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="RoomInRoofInstaller"
                                      options={fetchUsersList(
                                        "RoomInRoofInstaller"
                                      )}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.RoomInRoofInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {currentProps.singleLead &&
                      singleDetail.leadType !== "B2B Sales" && (
                        <TableRow>
                          <TableCell>
                            <strong>ASHP Installer</strong>
                          </TableCell>

                          {AM.includes(props.slug) ? (
                            <TableCell component="th" scope="row">
                              <OnTextEditInput
                                name="ASHPInstaller"
                                value={singleDetail.ASHPInstaller?.name}
                                onSubmit={editDetail}
                              >
                                {(props) => (
                                  <Grid item>
                                    <Select
                                      id="ASHPInstaller"
                                      className="WidhtFull100 basic-multi-select"
                                      placeholder="ASHP Installerr"
                                      value={props.values.ASHPInstaller?.name}
                                      onChange={(e) => {
                                        props.setFieldValue("ASHPInstaller", e);
                                      }}
                                      onBlur={props.handleBlur}
                                      margin="normal"
                                      aria-describedby="source-number-error"
                                      name="ASHPInstaller"
                                      options={fetchUsersList("ASHPInstallerr")}
                                    />
                                  </Grid>
                                )}
                              </OnTextEditInput>
                            </TableCell>
                          ) : (
                            <TableCell component="th" scope="row">
                              {singleDetail.ASHPInstaller?.name || "N/A"}
                            </TableCell>
                          )}
                        </TableRow>
                      )}

                    {/* Installer Type --------------------------------------------- end ------- */}

                    {currentProps.singleLead && (
                      <TableRow>
                        <TableCell>
                          <strong>Surveyor</strong>
                        </TableCell>

                        {AM.includes(props.slug) ? (
                          <TableCell component="th" scope="row">
                            <OnTextEditInput
                              name="Surveyor"
                              value={singleDetail?.Surveyor?.name}
                              onSubmit={editDetail}
                            >
                              {(props) => (
                                <Grid item>
                                  <Select
                                    id="Surveyor"
                                    className="WidhtFull100 basic-multi-select"
                                    placeholder="Surveyor"
                                    value={props.values.Surveyor?.name}
                                    onChange={(e) => {
                                      props.setFieldValue("Surveyor", e);
                                    }}
                                    onBlur={props.handleBlur}
                                    margin="normal"
                                    aria-describedby="source-number-error"
                                    name="Surveyor"
                                    options={allSurveyor}
                                  />
                                </Grid>
                              )}
                            </OnTextEditInput>
                          </TableCell>
                        ) : (
                          <TableCell component="th" scope="row">
                            {singleDetail.Surveyor?.name || "N/A"}
                          </TableCell>
                        )}
                      </TableRow>
                    )}

                    {currentProps.singleLead?.companyContacts && (
                      <>
                        <TableRow>
                          <TableCell>
                            <strong>Company Contacts :</strong>
                          </TableCell>
                        </TableRow>
                      </>
                    )}

                    {[
                      "management",
                      "partner",
                      "sales_rep",
                      "Sales Rep",
                    ].includes(currentProps.slug) && (
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

                    <TableRow>
                      <TableCell>
                        <strong>Note</strong>
                      </TableCell>
                      <TableCell>{singleDetail?.notes || "N/A"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Click To Expand</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      <Grid item xs={12}>
                        <Table>
                          {currentProps.singleLead?.companyContacts &&
                            currentProps.singleLead?.companyContacts.map(
                              (contact) => (
                                <>
                                  <TableBody
                                    style={{
                                      borderBottom: "2px solid #000",
                                    }}
                                  >
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell>{contact.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Email</TableCell>
                                      <TableCell>{contact.email}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Mobile</TableCell>
                                      <TableCell>{contact.mobile}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell>Office Number</TableCell>
                                      <TableCell>{contact.phone}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </>
                              )
                            )}
                        </Table>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            <Grid item md={8} xs={12}>
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
                  <Tab label="Action" value="action" />
                  {props.singleLead?.serviceType?.includes("Eco") && (
                    <Tab label="Gallery" value="gallery" />
                  )}
                  {/* {currentProps.singleLead?.LeadGenerator?_id === userData?._id } */}
                  {(currentProps.singleLead?.LeadGenerator?._id ===
                    userData?._id ||
                    (AM.includes(props.slug) &&
                      currentProps.singleLead.Consumer?._id &&
                      currentProps.singleLead.serviceType.includes("Eco"))) && (
                    <Tab label="Commission Tracker" value="commissionCost" />
                  )}
                </Tabs>
              </Paper>
              {selectedNoteTabs === "comment" && (
                <Suspense fallback={<>Loading...</>}>
                  <Notes
                    addNotes={(e, v) => addNotes(e, v)}
                    notesComment={currentProps.singleLead?.notesComment}
                  ></Notes>
                </Suspense>
              )}
              {selectedNoteTabs === "action" && (
                <Suspense fallback={<>Loading...</>}>
                  <SoldService
                    {...props}
                    setDefaultSSValues={(e) => setDefaultSS(e)}
                  />
                </Suspense>
              )}

              {selectedNoteTabs === "gallery" && (
                <PhotoGallery {...props} isFrom="lead" />
              )}

              {selectedNoteTabs === "commissionCost" && (
                <CommisionCost {...props} />
              )}
            </Grid>
          </>
        )}

        {selectedTab === 1 && (
          <>
            <Grid item md={12} xs={12}>
              <Suspense fallback={<>Loading...</>}>
                <TaskList
                  {...props}
                  isCreatedFrom="Lead"
                  showingFrom="viewLead"
                />
              </Suspense>
            </Grid>
          </>
        )}

        {selectedTab === 2 && (
          <>
            <Grid item md={12} xs={12}>
              <Suspense fallback={<>Loading...</>}>
                <HistoryTable {...props} historyFor="Lead" />
              </Suspense>
            </Grid>
          </>
        )}

        {isShowCompany && (
          <ViewSimpleCompany
            {...props}
            companyData={companyData}
            isCloseCompany={() => {
              setIsShowCompany(false);
            }}
          ></ViewSimpleCompany>
        )}
        {isShowConsumer && (
          <ViewSimpleConsumer
            {...props}
            consumerData={consumerData}
            isCloseConsumer={() => {
              setIsShowConsumer(false);
            }}
          ></ViewSimpleConsumer>
        )}

        {selectedTab === 3 && (
          <>
            <Grid item md={12} xs={12}>
              <Suspense fallback={<>Loading...</>}>
                <PriceCommission {...props} showingFrom="viewLead" />
              </Suspense>
            </Grid>
          </>
        )}

        {selectedTab === 4 && (
          <LeadDigitalDashboard
            {...props}
            assigneeList={assigneeState.assigneeListForDropdown}
          />
        )}

        {selectedTab === 5 && (
          <LeadDigitalDashboardPaidSolar
            {...props}
            assigneeList={assigneeState.assigneeListForDropdown}
          />
        )}
      </Grid>
    </div>
  );
}
