import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import FilterListIcon from "@material-ui/icons/FilterList";
import TablePagination from "@material-ui/core/TablePagination";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AlbumIcon from "@material-ui/icons/Album";
import AlbumTwoToneIcon from "@material-ui/icons/AlbumTwoTone";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AM, AMPS } from "../../../sharedUtils/globalHelper/constantValues";
import { companyAction, selectCompanyState } from "../redux/company";
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

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

export default function companyList(props) {

  const companyState = useSelector(selectCompanyState);
  const dispatch = useDispatch();
  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._basicAction({ companyCount: -1 });
    props._companyList();
  }, []);

  const CurrentProps = props;
  const classes = useStyles();
  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      props._loadingDataAction(false);
      props._deleteCompany(data._id);
    }
  };

  const searchInData = (event) => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._basicAction({ companyCount: -1 });
    props._searchInData(h);
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  function filterForClosedCompany() {
    dispatch(companyAction.changeToInitialState(null));
    props._loadingDataAction(false);
    const newFilter = { ...companyState.filterData, isCompanyClose: 'close' };
    props._filterData(newFilter);
  }

  function removefilterForClosedCompany() {
    dispatch(companyAction.changeToInitialState(null))
    props._loadingDataAction(false);
    const { isCompanyClose, ...updateFilter } = companyState.filterData;
    props._filterData(updateFilter);
  }

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
      title: "Company ID",
      field: "companyID",
      width: "10%",
      cellStyle: { width: "10%" },
      headerStyle: { width: "10%" },
      customSort: (a, b) => a.companyID.length - b.companyID.length,
    },
    {
      title: "Company",
      field: "company",
    },
    {
      title: "Site",
      field: "site",
      searchable: true,
    },
    {
      title: "hiddenSite",
      field: "hiddenSite",
      hidden: true,
      searchable: true,
    },
    {
      title: "hiddenSitePostcode",
      field: "hiddenSitePostcode",
      hidden: true,
      searchable: true,
    },
    {
      width: 200,
      title: "Services",
      field: "allServices",
    },
    {
      width: 200,
      title: "Live Services",
      field: "liveServices",
    },
    {
      title: "Added On",
      field: "createdAt",
      customSort: (a, b) => formatLot(a.createdAt) - formatLot(b.createdAt),
    },
    {
      title: "contactName",
      field: "contactName",
      hidden: true,
      searchable: true,
    },
    {
      title: "contactEmail",
      field: "contactEmail",
      hidden: true,
      searchable: true,
    },
    {
      title: "contactMobile",
      field: "contactMobile",
      hidden: true,
      searchable: true,
    },
    {
      title: "contactPhone",
      field: "contactPhone",
      hidden: true,
      searchable: true,
    },
    {
      title: "postcode",
      field: "postcode",
      hidden: true,
      searchable: true,
    },
    {
      title: "firstLine",
      field: "firstLine",
      hidden: true,
      searchable: true,
    },
    {
      title: "topLine",
      field: "topLine",
      hidden: true,
      searchable: true,
    },
    {
      title: "meterNumber",
      field: "meterNumber",
      hidden: true,
      searchable: true,
    },
    {
      title: "chipMidNumber",
      field: "chipMidNumber",
      hidden: true,
      searchable: true,
    },
    {
      title: "gasMprn",
      field: "gasMprn",
      hidden: true,
      searchable: true,
    },
    {
      title: "mprn",
      field: "mprn",
      hidden: true,
      searchable: true,
    },
    {
      title: "mpan",
      field: "mpan",
      hidden: true,
      searchable: true,
    },
    {
      title: "midNumber",
      field: "midNumber",
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
      render: (rowData) => (
        <Tooltip title="Dropbox">
          <IconButton
            className={classes.ViewActionBtn}
            aria-label="view"
            onClick={() => props.setFileManager(rowData)}
          >
            <FolderOpenIcon className={classes.IconSize} />
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

  const handleChangePage = (event, newPage) => {
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._basicAction({ companyCount: -1 });
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._basicAction({ companyCount: -1 });
    props._listLimit(h);
  };

  const RefreshList = () => {
    props._loadingDataAction(false);
    props._companyList();
  };

  const actions: any = [
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
  ];

  if (AM.includes(props.slug) && !companyState.filterData.isCompanyClose) {
    actions.push({
      icon: () => <AlbumIcon />,
      tooltip: 'Closed Companies',
      isFreeAction: true,
      onClick: filterForClosedCompany
    })
  }

  if (AM.includes(props.slug) && companyState.filterData.isCompanyClose) {
    actions.push({
      icon: () => <AlbumTwoToneIcon />,
      tooltip: 'All Companies',
      isFreeAction: true,
      onClick: removefilterForClosedCompany
    })
  }

  if (props.companyType === "normal" && AMPS.includes(props.slug) && !companyState.filterData.isCompanyClose) {
    actions.push({
      icon: "add",
      tooltip: "Add Company",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

  let col: any = columns.find((col) => {
    return col.field === props.sort;
  });

  if (col) col.defaultSort = props.sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Company"
        isLoading={!props.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={props.companyList.map((e) => ({ ...e }))}
        options={{
          pageSize: props.limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
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
        }}
        key={props.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={props.count}
                  rowsPerPage={props.limit}
                  page={props.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <td className={classes.CountBtnStyle}>
                  <Chip
                    label={
                      CurrentProps.companyCount === -1
                        ? "Total count"
                        : CurrentProps.companyCount
                    }
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => CurrentProps._companyCount()}
                  />
                </td>
              </div>
            );
          },
        }}
        actions={actions}
      />
    </Grid>
  );
}
