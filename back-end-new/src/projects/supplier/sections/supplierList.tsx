import React, { useEffect, Suspense } from "react";
import MaterialTable from "material-table";
import { connect, useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { selectSupplierState, supplierAction } from "../redux/supplier";
import {
  SupplierStatusNames,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { AM } from "../../../sharedUtils/globalHelper/constantValues";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import FilterListIcon from "@material-ui/icons/FilterList";

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

export default function SupplierList(props) {
  const supplierState = useSelector(selectSupplierState);

  const {
    suppliers,
    supplierCount,
    count,
    limit,
    remote,
    page,
    hideSideBar,
    sort,
    sortType,
  } = { ...supplierState };
  const dispatch = useDispatch();

  const _supplierList = (payload) =>
    dispatch(supplierAction.supplierList(payload));
  const _supplierCount = (payload) =>
    dispatch(supplierAction.supplierCount(payload));
  const _loadingDataAction = (payload) =>
    dispatch(supplierAction.supplierLoaderStart(payload));
  const _searchInData = (payload) =>
    dispatch(supplierAction.supplierSearch(payload));
  const _nextPage = (payload) =>
    dispatch(supplierAction.supplierNewPage(payload));
  const _listLimit = (payload) =>
    dispatch(supplierAction.supplierChangeLimit(payload));
  const _slugUpdate = (payload) =>
    dispatch(supplierAction.supplierSlugUpdate(payload));
  const _deleteSupplier = (payload) =>
    dispatch(supplierAction.deleteSupplier(payload));
  const _basicAction = (payload) =>
    dispatch(supplierAction.supplierBasicActions(payload));
  const _tableSort = (payload) => dispatch(supplierAction.tableSort(payload));

  useEffect(() => {
    _slugUpdate(props);
    _basicAction({ supplierCount: -1 });
    _supplierList(null);
  }, []);

  const CurrentProps = props;
  const classes = useStyles();

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _loadingDataAction(false);
      _basicAction({ supplierCount: -1 });
      _deleteSupplier(data._id);
    }
  };

  if (hideSideBar) {
    props.onClose();
    props._closeSideBar(false);
  }

  const columns = [
    {
      title: "Supplier Name",
      field: "supplierName",
      customSort: (a, b) => a.supplierName.length - b.supplierName.length,
    },
    {
      title: "Contacts",
      field: "contact",
    },
    {
      title: "Services",
      field: "serviceType",
    },
    {
      title: "Status",
      field: "supplierStatus",
      sorting: false,
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.supplierStatus],
            backgroundColor: StatusCodeColor[rowData.supplierStatus],
          }}
        >
          {SupplierStatusNames[rowData.supplierStatus]}
        </span>
      ),
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
    const h = { ...supplierState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _basicAction({ supplierCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...supplierState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ supplierCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...supplierState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ supplierCount: -1 });
    _searchInData(h);
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    _basicAction({ supplierCount: -1 });
    _supplierList(null);
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
        title="Manage Supplier"
        isLoading={!remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={suppliers.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
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
                    label={supplierCount === -1 ? "Total count" : supplierCount}
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => _supplierCount(null)}
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
          AM.includes(props.slug) && {
            icon: "add",
            tooltip: "Add Supplier",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </Grid>
  );
}
