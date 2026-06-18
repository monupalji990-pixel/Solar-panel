import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import FilterListIcon from "@material-ui/icons/FilterList";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import {
  RenewalStatusNames,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { selectCompanyState } from "projects/company/redux/company";

const useStyles = makeStyles(() => ({
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
}));

export default function userList(props) {
  const renewalState = useSelector(selectRenewalState);
  const CompanyState = useSelector(selectCompanyState);
  const {
    renewals,
    count,
    limit,
    remote,
    page,
    hideSideBar,
    renewalCount,
    sortType,
    sort,
  } = {
    ...renewalState,
  };
  const dispatch = useDispatch();

  const _renewalList = (payload) => dispatch(renewalAction.List(payload));
  const _renewalCount = (payload) => dispatch(renewalAction.Count(payload));
  const _loadingDataAction = (payload) =>
    dispatch(renewalAction.LoaderStart(payload));
  const _searchInData = (payload) => dispatch(renewalAction.Search(payload));
  const _nextPage = (payload) => dispatch(renewalAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(renewalAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(renewalAction.SlugUpdate(payload));
  const _deleteRenewal = (payload) =>
    dispatch(renewalAction.renewalDelete(payload));
  const _basicAction = (payload) =>
    dispatch(renewalAction.BasicAction(payload));
  const _closeSideBar = (payload) =>
    dispatch(renewalAction.CloseSideBar(payload));
  const _tableSort = (payload) => dispatch(renewalAction.tableSort(payload));
  function ChangeCompanySP(id) {
    dispatch(renewalAction.updateCompanyId(id));
  }
  
  useEffect(() => {
    _loadingDataAction(false);
    if (props.isCreatedFrom == 'Company') {
      ChangeCompanySP(CompanyState.currentCompany?._id)
    }
    _slugUpdate(props);
    _basicAction({ renewalCount: -1 });
    _renewalList(null);
  }, []);

  const CurrentProps = props;
  const classes = useStyles();

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _loadingDataAction(false);
      _basicAction({ renewalCount: -1 });
      _deleteRenewal(data._id);
    }
  };

  const formatLot = (value) => {
    if (value && value.trim().length > 0) {
      value = value.replace(new RegExp("/", "g"), "-");
      var stringData = value.split("_")[0];
      stringData = stringData.split("-").reverse().join("-");
      value = new Date(stringData);
      return value;
    } else if (value == null) {
      return "";
    }
    return value;
  };

  const columns = [
    {
      title: "Renewal ID",
      field: "renewalID",
    },
    {
      title: "Contract Start Date",
      field: "renewalStartDate",
      customSort: (a, b) =>
        formatLot(a.renewalStartDate) - formatLot(b.renewalStartDate),
    },
    {
      title: "Contract End Date",
      field: "renewalEndDate",
      customSort: (a, b) =>
        formatLot(a.renewalEndDate) - formatLot(b.renewalEndDate),
    },
    {
      title: "Site",
      field: "site",
    },
    {
      title: "Service",
      field: "serviceType",
    },
    {
      title: "Status",
      field: "quoteStatus",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.quoteStatus],
            backgroundColor: StatusCodeColor[rowData.quoteStatus],
          }}
        >
          {RenewalStatusNames[rowData.quoteStatus]}
        </span>
      ),
    },
    {
      title: "Company",
      field: "company",
      hidden: true,
      searchable: true,
    },
    {
      title: "Consumer",
      field: "consumer",
      hidden: true,
      searchable: true,
    },
    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) => (
        <Tooltip title="View">
          <IconButton
            className={classes.ViewActionBtn}
            aria-label="view"
            onClick={() => props.setEditDrawer(rowData)}
          >
            <VisibilityIcon className={classes.IconSize} />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) =>
        props.slug === "admin" && (
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

  columns.splice(
    3,
    0,
    helperMethods.columnCreator({
      title: "Company/Consumer",
      sorting: true,
      renderData: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: `${rowData.company ? "#193562" : "#22a6b3"}`,
            backgroundColor: `${rowData.company ? "rgba(25,53,98,.08)" : "rgba(34, 166, 179,.08)"
              }`,
          }}
        >
          {rowData.company} {rowData.consumer}
        </span>
      ),
      headerStyle: { fontWeight: "bold" },
    })
  );

  const handleChangePage = (event, newPage) => {
    let h = { ...renewalState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _basicAction({ renewalCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    let h = { ...renewalState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ renewalCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    let h = { ...renewalState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ renewalCount: -1 });
    _searchInData(h);
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    _basicAction({ renewalCount: -1 });
    _renewalList(null);
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  let col: any = columns.find((col) => {
    return col.field === sort;
  });

  if (col) col.defaultSort = sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Renewal"
        isLoading={!remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={renewals.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          sorting: true,
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
          _tableSort(h);
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
                    label={renewalCount === -1 ? "Total count" : renewalCount}
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => _renewalCount(null)}
                  />
                </td>
              </div>
            );
          },
        }}
        actions={[
          {
            icon: () => <RefreshIcon />,
            tooltip: "Refresh",
            isFreeAction: true,
            onClick: () => RefreshList(),
          },
          {
            icon: () => <FilterListIcon />,
            tooltip: "Filters",
            isFreeAction: true,
            onClick: props.setFilterDrawer,
          },
        ]}
      />
    </Grid>
  );
}
