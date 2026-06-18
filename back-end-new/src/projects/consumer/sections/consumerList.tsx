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
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { consumerAction, selectConsumerState } from "../redux/consumer";
import { AMP, AMPS } from "../../../sharedUtils/globalHelper/constantValues";

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

export default function consumerList(props) {
  const consumerState = useSelector(selectConsumerState);

  const {
    consumers,
    consumerCount,
    count,
    limit,
    remote,
    page,
    message,
    hideSideBar,
    sort,
    sortType,
  } = { ...consumerState };
  const dispatch = useDispatch();

  const _loadingDataAction = (payload) =>
    dispatch(consumerAction.consumerLoaderStart(payload));
  const _consumerList = (payload) =>
    dispatch(consumerAction.consumerList(payload));
  const _consumerCount = () => dispatch(consumerAction.consumerCount(null));
  const _listLimit = (payload) =>
    dispatch(consumerAction.consumerChangeLimit(payload));
  const _searchInData = (payload) =>
    dispatch(consumerAction.consumerSearch(payload));
  const _nextPage = (payload) =>
    dispatch(consumerAction.consumerNewPage(payload));
  const _slugUpdate = (payload) =>
    dispatch(consumerAction.consumerSlugUpdate(payload));
  const _deleteConsumer = (payload) =>
    dispatch(consumerAction.deleteConsumer(payload));
  const _basicAction = (payload) =>
    dispatch(consumerAction.consumerBasicActions(payload));
  const _tableSort = (payload) => dispatch(consumerAction.tableSort(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate(props);
    _basicAction({ consumerCount: -1 });
    _consumerList(null);
  }, []);

  const CurrentProps = props;
  const classes = useStyles();

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _loadingDataAction(false);
      _deleteConsumer(data._id);
    }
  };

  const columns = [
    {
      title: "Consumer ID",
      field: "consumerId",
      customSort: (a, b) => a.consumerId.length - b.consumerId.length,
    },
    {
      title: 'Type',
      field: 'isFromPrimo',
    },
    {
      title: "Title",
      field: "title",
    },
    {
      title: "First Name",
      field: "firstName",
    },
    {
      title: "Surname",
      field: "surName",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Address",
      field: "addressOne",
    },
    {
      title: "AddressTwo",
      field: "addressTwo",
      hidden: true,
      searchable: true,
    },
    {
      title: "fullName",
      field: "fullName",
      hidden: true,
      searchable: true,
    },
    {
      title: "telephoneNumber",
      field: "telephoneNumber",
      hidden: true,
      searchable: true,
    },
    {
      title: "mobile",
      field: "mobile",
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

  let col: any = columns.find((col) => {
    return col.field === sort;
  });

  if (col) col.defaultSort = sortType;

  const handleChangePage = (event, newPage) => {
    const h = { ...consumerState };
    h.page = newPage + 1;
    _basicAction({ consumerCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...consumerState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ consumerCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...consumerState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ consumerCount: -1 });
    _searchInData(h);
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    _consumerList(null);
  };

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Consumer"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={consumers.map((e) => ({ ...e }))}
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
                    label={consumerCount === -1 ? "Total count" : consumerCount}
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => _consumerCount()}
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
            tooltip: "Filter",
            isFreeAction: true,
            onClick: props.setFilterDrawer,
          },
          AMPS.includes(props.slug) && {
            icon: "add",
            tooltip: "Add Consumer",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </Grid>
  );
}