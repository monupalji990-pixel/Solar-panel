import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import { siteAction, selectSiteState } from "../Redux/site";
import { selectCompanyState } from "../../company/redux/company";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Tooltip, IconButton } from "@material-ui/core";

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
}));

export default function SiteList(props) {
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
    sortType,
    sort,
  } = {
    ...siteState,
  };

  const dispatch = useDispatch();

  const _siteList = (payload) => dispatch(siteAction.List(payload));
  const _loadingDataAction = (payload) =>
    dispatch(siteAction.LoaderStart(payload));
  const _searchInData = (payload) => dispatch(siteAction.Search(payload));
  const _nextPage = (payload) => dispatch(siteAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(siteAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(siteAction.SlugUpdate(payload));
  const _deleteSite = (payload) => dispatch(siteAction.DeleteSite(payload));
  const _tableSort = (payload) => dispatch(siteAction.tableSort(payload));
  const _unsetToaster = (payload) =>
    dispatch(siteAction.siteUnsetToster(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate(props);
    _siteList(null);
  }, []);

  const classes = useStyles();

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _loadingDataAction(false);
      if (companyState.currentCompany)
        _deleteSite({
          id: data._id,
          companyId: companyState.currentCompany._id,
          showingFrom: props.showingFrom   //if showingForm company then ,to update viewCompany when site deleted
        });
    }
  };

  if (
    messageCode &&
    ["Site added successfully", "Site deleted successfully"].includes(
      messageCode
    ) &&
    props.showingFrom === "viewCompany"
  ) {
    if (messageCode === "Site added successfully") {
      props.onClose();
    }
    _unsetToaster(false);
  }

  const columns = [
    {
      title: "Name",
      field: "siteName",
      customSort: (a, b) => a.siteName.length - b.siteName.length,
    },
    {
      title: "Address",
      field: "siteAddress",
    },
    {
      title: "Town",
      field: "town",
    },
    {
      title: "City",
      field: "city",
    },
    {
      title: "County",
      field: "country",
    },
    {
      title: "Postcode",
      field: "postcode",
    },
    {
      title: "Contact Person",
      field: "contactPerson",
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

  const handleChangePage = (event, newPage) => {
    const h = { ...siteState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...siteState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...siteState };
    h.searchText = event;
    _loadingDataAction(false);
    _searchInData(h);
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    _siteList(null);
  };

  const tableAction: any = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => RefreshList(),
    },
  ];

  if (["admin", "management", "partner", "sales_rep"].includes(props.slug)) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Site",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

  let col: any = columns.find((col) => {
    return col.field === sort;
  });

  if (col) col.defaultSort = sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Sites"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={siteList.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          search: false,
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
        key={limit}
        components={{
          Pagination: () => {
            return (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={count}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            );
          },
        }}
        actions={!props.removeActions && tableAction}
      />
    </Grid>
  );
}
