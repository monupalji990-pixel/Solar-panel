import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import TablePagination from "@material-ui/core/TablePagination";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AMPS } from "../../../sharedUtils/globalHelper/constantValues";
import { selectCampaignState } from "../redux/campaign";

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

export default function List(props) {

  const campaignState = useSelector(selectCampaignState);
  const dispatch = useDispatch();

  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._basicAction({ count: -1 });
    props._list();
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
      props._deleteCampaign(data.id);
    }
  };

  const searchInData = (event) => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._basicAction({ count: -1 });
    props._searchInData(h);
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
      title: "Campaign ID",
      field: "id",
      width: "10%",
      cellStyle: { width: "10%" },
      headerStyle: { width: "10%" },
    },
    {
      title: "Campaign",
      field: "name",
    },
    {
      title: "Type",
      field: "type",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Subject",
      field: "subject",
    },
    {
      title: "Sender",
      field: "sender",
      render: (rawData) => (<>{rawData.sender?.name}</>)
    },
    {
      title: "Added On",
      field: "createdAt",
      customSort: (a, b) => formatLot(a.createdAt) - formatLot(b.createdAt),
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
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._basicAction({ count: -1 });
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._basicAction({ count: -1 });
    props._listLimit(h);
  };

  const RefreshList = () => {
    props._loadingDataAction(false);
    props._list();
  };

  const actions: any = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => RefreshList(),
    },
  ];

  if (AMPS.includes(props.slug) && !campaignState.filterData.isCompanyClose) {
    actions.push({
      icon: "add",
      tooltip: "Add Campaign",
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
        title="Manage Campaign"
        isLoading={!props.remote}
        data={props.list.map((e) => ({
          ...e,
          createdAt: helperMethods.ConvertDate(e.createdAt),
        }))}
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
              </div>
            );
          },
        }}
        actions={actions}
      />
    </Grid>
  );
}