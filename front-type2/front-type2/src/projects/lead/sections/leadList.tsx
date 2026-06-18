import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import FilterListIcon from "@material-ui/icons/FilterList";
import AlbumIcon from "@material-ui/icons/Album";
import AlbumTwoToneIcon from "@material-ui/icons/AlbumTwoTone";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  LeadStatusNames,
  LeadStatusRowColor,
  LeadStatusRowTextColor,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { leadAction, selectLeadState } from "../redux/lead";
import Paper from "@material-ui/core/Paper";
import { Tab, Tabs, Typography } from "@material-ui/core";
import axios from "axios";
import { Drawer } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import ViewLeadForm from "../sections/viewLeadForm";
import { AM } from "sharedUtils/globalHelper/constantValues";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PaidIcon from "../assets/paid.png";
import UnPaidIcon from "../assets/unpaid.png";
import PaidTotalCostIcon from "../assets/totalPaid.png";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import QuoteBoardViewApp from "./board/boardView";

const useStyles = makeStyles(() => ({
  FilterIcon: {
    backgroundColor: "#303f9f",
    minWidth: 44,
  },
  assigneeDrop: {
    minWidth: "350px",
    margin: "0 0 0 auto",
  },
  ViewActionBtn: {
    background: "#193562",
    width: "26px",
    height: "26px",
    borderRadius: 3,
    padding: "3px",
    color: "#ffffff",
    "&:hover": {
      background: "#193562",
    },
    boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
  },
  DeleteActionBtn: {
    background: "#ef4d56 ",
    width: "26px",
    height: "26px",
    borderRadius: 3,
    padding: "3px",
    color: "#ffffff",
    "&:hover": {
      background: "#ef4d56 ",
    },
    boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
  },
  IconSize: {
    fontSize: "1rem",
  },
  CountBtnStyle: {
    minWidth: "200px",
    textAlign: "center",
    "@media(max-width:480px)": {
      minWidth: "auto",
      display: "block",
      padding: 15,
    },
  },
  fontStyle: {
    fontSize: "21px",
    fontWeight: 500,
    padding: "1rem 0",
    margin: 0,
  },
  btnStyle: {
    margin: 10,
    border: "1px solid #fff",
  },
  iconStyle: {
    fontSize: 32,
    color: "#6592d9",
  },
  MainCard: {
    position: "relative",
  },
  card: {
    cursor: "pointer",
  },
  card_icon: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
  },
  card_title: {
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#272E48",
  },
  card_body_title: {
    fontWeight: 900,
    fontSize: "1.7rem",
    color: "#272E48",
  },
  card_body_subtitle: {
    color: "#19b159",
    textTransform: "capitalize",
    fontWeight: 400,
  },
  imgStyle: {
    width: 35,
  },
}));

export default function leadList(props) {
  const leadState = useSelector(selectLeadState);
  const customProps = props;

  const {
    leads,
    leadCount,
    count,
    limit,
    remote,
    page,
    sort,
    sortType,
    getLeadSourceCount,
    filterData,
  } = { ...leadState };

  const dispatch = useDispatch();

  const _leadList = (payload) => dispatch(leadAction.List(payload));
  const _leadCount = () => dispatch(leadAction.Count(null));
  const _loadingDataAction = (payload) =>
    dispatch(leadAction.LoaderStart(payload));
  const _searchInData = (payload) => dispatch(leadAction.Search(payload));
  const _nextPage = (payload) => dispatch(leadAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(leadAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(leadAction.SlugUpdate(payload));
  const _deleteLead = (payload) => dispatch(leadAction.DeleteLead(payload));
  const _filterData = (payload) => dispatch(leadAction.FilterData(payload));
  const _basicAction = (payload) => dispatch(leadAction.BasicActions(payload));
  const _getLeadSourceCounts = (payload) =>
    dispatch(leadAction.getLeadSourceCounts(payload));

  let baseURL;
  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8087/api/";
  } else {
    baseURL = "/api/";
  }

  const checkURL = () => {
    const urlParams = new URLSearchParams(props.location.search);
    if (urlParams.get("add") !== undefined && urlParams.get("add")) {
      props.setAddDrawer();
    }
  };
  const { showSearch } = props;
  const { setShowSearch } = props;

  const [state, setState] = useState({
    installationDate: null,
    submissionDate: null,
    installationStartDate: null,
    installationEndDate: null,
    submissionStartDate: null,
    submissionEndDate: null,
  });
  const [formLeadList, setformLeadList] = useState([]);
  const [openLeadForm, setOpenLeadForm] = useState(false);
  const [leadRowdata, setLeadRowdata] = useState(null);
  const [isUpdatedData, setIsUpdatedData] = useState(false);
  const [paidLeadStats, setPaidLeadStats]: any = useState();
  const [unpaidLeadStats, setUnPaidLeadStats]: any = useState();
  const [showStats, setShowStats] = useState(false);
  const [boardView, setBoardView] = useState(null);

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate(props);
    _basicAction({
      filterData: {},
      leadCount: -1,
    });
    _leadList({ showingFrom: props.showingFrom });
    setShowSearch(0);
    checkURL();
    _getLeadSourceCounts({});

    const fetchFormLeadList = async () => {
      axios({
        method: "get",
        url: baseURL + "form/list",
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.success) {
            setformLeadList(response.data.data);
          }
        })
        .catch((resp) => {
          console.log("Catch Error----", resp);
        });
    };
    fetchFormLeadList();

    const fetchDigitalDashboardStats = async () => {
      axios({
        method: "get",
        url: baseURL + "lead/regUser/digital-dashboard-stats",
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.success) {
            let paidLead = [],
              unpaidLead = [];
            response.data.data &&
              response.data.data.map((e) => {
                if (e._id) {
                  paidLead.push(e);
                } else {
                  unpaidLead.push(e);
                }
              });
            setPaidLeadStats(paidLead[0]);
            setUnPaidLeadStats(unpaidLead[0]);
          }
        })
        .catch((resp) => {
          console.log("Catch Error----", resp);
        });
    };

    fetchDigitalDashboardStats();
  }, []);

  useEffect(() => {
    if (filterData.digitalDashboardStats && filterData.LeadGenerator?.value) {
      const fetchDigitalDashboardStats = async () => {
        axios({
          method: "get",
          url:
            baseURL +
            `lead/regUser/digital-dashboard-stats?LeadGenerator=${filterData.LeadGenerator?.value}`,
          withCredentials: true,
        })
          .then((response) => {
            if (response.data.success) {
              let paidLead = [],
                unpaidLead = [];
              response.data.data &&
                response.data.data.map((e) => {
                  if (e._id) {
                    paidLead.push(e);
                  } else {
                    unpaidLead.push(e);
                  }
                });
              setPaidLeadStats(paidLead[0]);
              setUnPaidLeadStats(unpaidLead[0]);
              _filterData({ ...filterData, digitalDashboardStats: false });
            }
          })
          .catch((resp) => {
            console.log("Catch Error----", resp);
          });
      };

      fetchDigitalDashboardStats();
    }
  }, [filterData.digitalDashboardStats]);

  useEffect(() => {
    if (isUpdatedData) {
      const fetchFormLeadList = async () => {
        axios({
          method: "get",
          url: baseURL + "form/list",
          withCredentials: true,
        })
          .then((response) => {
            if (response.data.success) {
              setformLeadList(response.data.data);
            }
          })
          .catch((resp) => {
            console.log("Catch Error----", resp);
          });
      };
      fetchFormLeadList();
      setIsUpdatedData(false);
    }
  }, [isUpdatedData]);

  const classes = useStyles();

  const [isImportedLead, setIsImportedLead] = useState(false);
  const [selectOption, setSelectOption] = useState(null);
  const [selectedTab, setSelectedTab] = useState("lead");

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _deleteLead(data._id);
    }
  };

  const columns = [
    {
      title: "Lead ID",
      field: "lead",
    },
    {
      width: 200,
      title: "Service",
      field: "type",
      sorting: false,
    },
    {
      title: "Status",
      field: "status",
      sorting: false,
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: rowData?.isBfrThreeMonth
              ? "#ffffff"
              : StatusFontCodeColor[rowData.status],
            backgroundColor: rowData?.isBfrThreeMonth
              ? "#193562"
              : StatusCodeColor[rowData.status],
          }}
        >
          {LeadStatusNames[rowData.status]}
        </span>
      ),
    },
    {
      title: "Company",
      field: "company",
      hidden: true,
      searchable: true,
      sorting: false,
    },
    {
      title: "Consumer",
      field: "Consumer",
      hidden: true,
      searchable: true,
      sorting: false,
    },
    {
      title: "Business Sector",
      field: "businessSector",
      hidden: true,
      searchable: true,
      sorting: false,
    },
    {
      title: "Postcode",
      field: "postcode",
      hidden: true,
      searchable: true,
      sorting: false,
    },
    {
      title: "Source",
      field: "source",
      sorting: false,
    },
    {
      title: "Address 1",
      field: "addressline1",
      sorting: false,
    },
    {
      title: "Address 2",
      field: "addressline2",
      sorting: false,
    },
    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) => {
        return (
          <Tooltip title="View">
            <IconButton
              className={classes.ViewActionBtn}
              aria-label="view"
              onClick={() => {
                props.viewLeadDetail(rowData),
                  props._pointerChange(rowData.tableData.id);
              }}
            >
              <VisibilityIcon className={classes.IconSize} />
            </IconButton>
          </Tooltip>
        );
      },
    },
    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) =>
        props.slug === "admin" &&
        props.isFrom !== "Dashboard" && (
          <Tooltip title="Delete">
            <IconButton
              className={classes.DeleteActionBtn}
              aria-label="delete"
              onClick={() => deleteConfirmation(rowData)}
            >
              <DeleteIcon className={classes.IconSize} />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  const leadformColumns = [
    {
      title: "Assignee",
      field: "assignee",
      render: (rowData) => {
        return <span>{rowData?.assignee?.name || "-"}</span>;
      },
    },
    {
      title: "Consumer",
      field: "consumer",
      render: (rowData) => {
        return (
          <span>
            {rowData?.consumer?.title +
              " " +
              rowData?.consumer?.firstName +
              " " +
              rowData?.consumer?.surName}
          </span>
        );
      },
    },
    {
      title: "Email",
      field: "email",
      render: (rowData) => {
        return <span>{rowData?.consumer?.email}</span>;
      },
    },
    {
      title: "Address",
      field: "address",
      render: (rowData) => {
        return <span>{rowData?.data?.address || "-"}</span>;
      },
    },
    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) => {
        return (
          <Tooltip title="View">
            <IconButton
              className={classes.ViewActionBtn}
              aria-label="view"
              onClick={() => {
                setOpenLeadForm(true);
                setLeadRowdata(rowData);
              }}
            >
              <VisibilityIcon className={classes.IconSize} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  if (props.isCreatedFrom === "Consumer") {
  } else if (props.isCreatedFrom === "Company") {
    columns.splice(3, 0, {
      title: "Site",
      field: "site",
    });
    columns.splice(6, 0, {
      title: "Contact",
      field: "contact",
    });
  } else {
    columns.splice(
      2,
      0,
      helperMethods.columnCreator({
        title: "Company/Consumer",
        sorting: true,
        renderData: (rowData) => (
          <span
            className="StatusChip"
            style={{
              color: rowData?.isBfrThreeMonth
                ? "#193562"
                : `${rowData.company ? "#193562" : "#22a6b3"}`,
              backgroundColor: rowData?.isBfrThreeMonth
                ? "#ffffff"
                : `${
                    rowData.company
                      ? "rgba(25,53,98,.08)"
                      : "rgba(34, 166, 179,.08)"
                  }`,
            }}
          >
            {rowData.company} {rowData.Consumer}
          </span>
        ),
        headerStyle: { fontWeight: "bold" },
      })
    );
    columns.splice(4, 0, {
      title: "Site",
      field: "site",
    });
    columns.splice(7, 0, {
      title: "Contact",
      field: "contact",
    });
  }

  const handleChangePage = (event, newPage) => {
    const h = { ...leadState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _basicAction({ leadCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...leadState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ leadCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...leadState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ leadCount: -1 });
    _searchInData(h);
  };

  const RefreshList = () => {
    // _loadingDataAction(false);
    // _leadList({ showingFrom: props.showingFrom });
    const filterObject: any = {};
    _loadingDataAction(false);
    _filterData(filterObject);
  };

  const showOnlyImportedLead = (obj, isTrue) => {
    const merged = { ...props.filterData, ...obj };
    setIsImportedLead(isTrue);
    _loadingDataAction(false);
    if (Object.keys(obj).length > 0) _filterData(merged);
    else _filterData({});
  };

  const ActionOnSelectedData = (data) => {
    const deleteIds = [];
    data.map((e) => deleteIds.push(e._id));
    props.addSalesRepAssignee(deleteIds);
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  ); // debouncing for search on 400ms

  const handleChangeSource = (e) => {
    setSelectOption({ label: e?.label, value: e?.label });
    const filterObject: any = {};
    if (e.label) filterObject.source = e.label;
    props._filterData(filterObject);
  };

  const ClearSelectValues = () => {
    setSelectOption(null);
    // props._AssigneeFilter({ assigneeId: null });
  };

  let tableAction: any = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => RefreshList(),
    },
    {
      icon: () => <ViewColumnIcon />,
      tooltip: "Board View",
      isFreeAction: true,
      onClick: () => openBoardView(),
    },
    {
      icon: () => <FilterListIcon />,
      tooltip: "Filters",
      isFreeAction: true,
      onClick: props.setFilterDrawer,
    },
    props.isFrom !== "Dashboard" &&
      !isImportedLead &&
      ["admin", "management"].includes(props.slug) && {
        icon: () => <AlbumIcon />,
        tooltip: "Imported Lead",
        isFreeAction: true,
        onClick: () =>
          showOnlyImportedLead({ StatusArray: ["Lead Imported"] }, true),
      },
    isImportedLead &&
      ["admin", "management"].includes(props.slug) && {
        icon: () => <AlbumTwoToneIcon />,
        tooltip: "All Lead",
        isFreeAction: true,
        onClick: () => showOnlyImportedLead({}, false),
      },
  ];

  if (props.slug === "admin" && props.isFrom !== "Dashboard") {
    tableAction.push({
      tooltip: "Delete",
      icon: "delete",
      // isFreeAction: false,
      onClick: (evt, data) => {
        if (confirm("Are you sure you want to delete selected Leads?")) {
          let deleteLeadIds = [];
          data.forEach((lead) => {
            deleteLeadIds.push(lead._id);
          });
          _loadingDataAction(false);
          _deleteLead(deleteLeadIds);
          setShowSearch(0);
        }
      },
    });
    tableAction.push({
      icon: "person_add_alt_1",
      tooltip: "Add Sales rep assignee",
      // isFreeAction: false,
      onClick: (evt, data) => ActionOnSelectedData(data),
    });
  }

  if (
    ["admin", "management", "partner", "sales_rep"].includes(props.slug) &&
    props.isFrom !== "Dashboard"
  ) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Lead",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

  if (isImportedLead) {
    tableAction = [
      {
        icon: () => <AlbumTwoToneIcon />,
        tooltip: "All Lead",
        isFreeAction: true,
        onClick: () => showOnlyImportedLead({}, false),
      },
      {
        icon: () => <PersonAddIcon />,
        tooltip: "Add Sales rep assignee",
        // isFreeAction: true,
        onClick: (evt, data) => ActionOnSelectedData(data),
      },
    ];
  }

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  let col: any = columns.find((col) => {
    return col.field === sort;
  });

  if (col) col.defaultSort = sortType;

  const filterLeadType = (type) => {
    // Paid - UnPaid lead filter list
    // _leadList({ isPaid: type });
    const filterObject: any = {};
    filterObject.isPaid = type;
    _loadingDataAction(false);
    _filterData(filterObject);
  };

  const getTotalCommission = () => {
    let tc: any = 0;
    let paid = paidLeadStats?.cost || 0;
    let unpaid = unpaidLeadStats?.cost || 0;
    tc = paid + unpaid;
    return tc ? tc.toLocaleString({ style: "currency" }) : 0;
  };

  const handleChangeDate = (date, type) => {
    let iDate = null;
    let startDate = null;
    let endDate = null;

    if (date) {
      iDate = new Date(date);
      startDate = new Date(iDate.getFullYear(), date.getMonth(), 1);
      endDate = new Date(iDate.getFullYear(), date.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59);
    }

    const filterObject: any = {};

    if (type === "submissionDate") {
      setState((prev) => ({
        ...prev,
        submissionDate: iDate,
        submissionStartDate: startDate,
        submissionEndDate: endDate,
      }));

      filterObject.SubmissionCompletedStartDate = startDate;
      filterObject.SubmissionCompletedEndDate = endDate;
    } else {
      setState((prev) => ({
        ...prev,
        installationDate: iDate,
        installationStartDate: startDate,
        installationEndDate: endDate,
      }));

      filterObject.InstallationCompleteStartDate = startDate;
      filterObject.InstallationCompleteEndDate = endDate;
    }

    _loadingDataAction(false);
    _filterData(filterObject);
  };

  const openBoardView = () => {
    setBoardView(true);
  };

  return (
    <Grid container>
      {AM.includes(props.slug) && props.isFrom !== "Dashboard" && showStats && (
        <Grid container spacing={3} style={{ marginBottom: 20 }}>
          <Grid item xs>
            <Card
              style={{ cursor: "pointer" }}
              onClick={() => filterLeadType(true)}
            >
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img
                    src={PaidIcon}
                    className={classes.imgStyle}
                    alt="Icons"
                  />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">
                    Paid Leads
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>
                    {paidLeadStats?.count || 0}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img
                    src={PaidTotalCostIcon}
                    className={classes.imgStyle}
                    alt="Icons"
                  />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">
                    Paid Amount
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>
                    {paidLeadStats?.cost
                      ? (paidLeadStats?.cost).toLocaleString({
                          style: "currency",
                        })
                      : 0}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card
              style={{ cursor: "pointer" }}
              onClick={() => filterLeadType(false)}
            >
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img
                    src={UnPaidIcon}
                    className={classes.imgStyle}
                    alt="Icons"
                  />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">
                    Unpaid Leads
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>
                    {unpaidLeadStats?.count || 0}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img
                    src={PaidTotalCostIcon}
                    className={classes.imgStyle}
                    alt="Icons"
                  />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">
                    Unpaid Amount
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>
                    {unpaidLeadStats?.cost
                      ? (unpaidLeadStats?.cost).toLocaleString({
                          style: "currency",
                        })
                      : 0}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs>
            <Card>
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img
                    src={PaidTotalCostIcon}
                    className={classes.imgStyle}
                    alt="Icons"
                  />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">
                    Total Commission
                  </Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>
                    {getTotalCommission()}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {props.isFrom !== "Dashboard" && (
        <Grid container spacing={3} style={{ marginBottom: 20 }}>
          <Grid item xs={AM.includes(props.slug) ? 4 : 12}>
            <Paper>
              <Tabs
                value={selectedTab}
                onChange={tabHandleChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Leads" value="lead" />
                <Tab label="Lead Data" value="formLead" />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="dialog"
                inputVariant="outlined"
                views={["year", "month"]}
                id="InstallationCompleteDate"
                name="InstallationCompleteDate"
                label="Installation Completed Date"
                allowKeyboardControl
                style={{ width: "100%" }}
                value={state.installationDate}
                size="small"
                format="MMMM yyyy"
                onChange={(e) => {
                  handleChangeDate(e, "installationDate");
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="InstallationCompleteDate-number-error"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                variant="dialog"
                inputVariant="outlined"
                views={["year", "month"]}
                id="SubmissionCompletedDate"
                name="SubmissionCompletedDate"
                label="Submission Completed Date"
                allowKeyboardControl
                style={{ width: "100%" }}
                value={state.submissionDate}
                size="small"
                format="MMMM yyyy"
                onChange={(e) => {
                  handleChangeDate(e, "submissionDate");
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                aria-describedby="SubmissionCompletedDate-number-error"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          {AM.includes(props.slug) && (
            <Grid item xs>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => setShowStats(!showStats)}
              >
                {!showStats ? "Show Commission Data" : "Hide Commission Data"}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
      {(selectedTab === "lead" || props.isFrom === "Dashboard") && (
        <React.Fragment>
          <Grid
            item
            md={12}
            xs={12}
            component={Paper}
            style={{
              marginBottom: 10,
              padding: 15,
              marginTop: props.isFrom == "Dashboard" ? 10 : 0,
            }}
          >
            <div className="lead_source_count">
              {Object.keys(getLeadSourceCount).map((x: any) => (
                <span className="lead_source_span">
                  {x} - {getLeadSourceCount[x] || 0}{" "}
                </span>
              ))}
            </div>
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            className="TableScrolling"
            style={{ marginTop: props.isFrom == "Dashboard" ? 10 : 0 }}
          >
            {boardView ? (
              <QuoteBoardViewApp {...props} setBoardView={setBoardView} />
            ) : (
              <MaterialTable
                columns={columns}
                tableRef={props.tableRef}
                title="Manage Lead"
                isLoading={!remote}
                onSearchChange={(e) => debounceOnChange(e)}
                data={leads.map((e) => ({ ...e }))}
                options={{
                  pageSize: limit,
                  search:
                    props.isFrom !== "Dashboard"
                      ? !isImportedLead && showSearch === 0
                      : false,
                  selection:
                    props.slug === "admin" && props.isFrom !== "Dashboard"
                      ? true
                      : false,
                  emptyRowsWhenPaging: false,
                  exportButton: true,
                  filtering: false,
                  rowStyle: (rowData) => ({
                    backgroundColor: rowData.isBfrThreeMonth
                      ? "#6d92d9"
                      : LeadStatusRowColor[rowData.status],
                    color: rowData.isBfrThreeMonth
                      ? "#ffffff"
                      : LeadStatusRowTextColor[rowData.status],
                  }),
                }}
                onOrderChange={(sort, sortType) => {
                  let h = { ...props };
                  if (sort === -1) {
                    h.sort = "createdAt";
                    h.sortType = "desc";
                  } else {
                    h.sort = columns[sort].field;
                    h.sortType = sortType;
                  }
                  // _tableSort(h);
                }}
                onSelectionChange={(evt, selectedRow) => {
                  if (selectedRow === undefined) {
                    if (props.tableRef.current.state.selectedCount === 0)
                      setShowSearch(0);
                  } else if (selectedRow.tableData.checked) {
                  } else if (!selectedRow.tableData.checked) {
                  }
                }}
                key={limit}
                components={{
                  Pagination: () => {
                    return (
                      <div>
                        <TablePagination
                          style={{ width: "100%", padding: 0 }}
                          rowsPerPageOptions={[5, 10, 25, 50, 100]}
                          count={count}
                          rowsPerPage={limit}
                          page={page - 1}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                        <td className={classes.CountBtnStyle}>
                          <Chip
                            label={leadCount === -1 ? "Total count" : leadCount}
                            variant="outlined"
                            style={{ marginRight: 5 }}
                            onClick={() => _leadCount()}
                          />
                        </td>
                      </div>
                    );
                  },
                }}
                actions={(tableAction || []).filter((a) => typeof a?.onClick === 'function' || typeof a?.icon === 'function')}
              />
            )}
          </Grid>
        </React.Fragment>
      )}

      {selectedTab === "formLead" && props.isFrom !== "Dashboard" && (
        <Grid
          item
          md={12}
          xs={12}
          className="darkTableStyle"
          style={{ marginTop: props.isFrom == "Dashboard" ? 10 : 0 }}
        >
          <MaterialTable
            columns={leadformColumns}
            tableRef={props.tableRef}
            title="Lead Forms"
            data={formLeadList && formLeadList.map((e) => ({ ...e }))}
            options={{
              pageSize: 10,
              emptyRowsWhenPaging: false,
              exportButton: false,
              filtering: false,
              paging: true,
              pageSizeOptions: [10, 25, 50, 100],
            }}
            key={limit}
          />
        </Grid>
      )}

      {openLeadForm && (
        <Drawer id="overflowid" anchor="right" open={openLeadForm}>
          <Grid container spacing={3} style={{ width: "65vw", padding: 30 }}>
            <Grid item xs={12} md={12} justify="flex-end">
              <Button onClick={() => setOpenLeadForm(false)} id="closeButton">
                <Chip
                  color="primary"
                  icon={
                    <CloseIcon style={{ fontSize: "22px", color: "#fff" }} />
                  }
                  label={"Lead Form"}
                />
              </Button>
              <ViewLeadForm
                {...props}
                leadRowdata={leadRowdata}
                setIsUpdatedData={setIsUpdatedData}
              />
            </Grid>
          </Grid>
        </Drawer>
      )}
    </Grid>
  );
}
