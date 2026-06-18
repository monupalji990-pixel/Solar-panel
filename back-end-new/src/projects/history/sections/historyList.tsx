import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect, useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import {
  historyAction,
  historyReducer,
  historySaga,
  selectHistoryState,
  sliceKeyHistory,
} from "../redux/history";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

const useStyles = makeStyles(() => ({
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

function getRole(role) {
  if (role == "5d5b91db1c9d440000c9991d") {
    return 'Observing Partner';
  }
  if (role == "5d5b91e01c9d440000c9990f") {
    return 'Admin';
  }
  if (role == "5d5b92031c9d440000c99911") {
    return 'Partner';
  }
  if (role == '5d5b92031c9d440000c99912') {
    return 'Sales Rep';
  }
  if (role == '5d5b92031c9d440000c99914') {
    return 'Management'
  }

}

export default function HistoryList(props) {
  useInjectReducer({ key: sliceKeyHistory, reducer: historyReducer });
  useInjectSaga({ key: sliceKeyHistory, saga: historySaga });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const historyState = useSelector(selectHistoryState);
  const classes = useStyles();
  const [userData, setUserData] = useState(null)

  const {
    historyList,
    count,
    historyCount,
    limit,
    remote,
    page,
  } = historyState;
  const dispatch = useDispatch();

  const _historyList = (payload) =>
    dispatch(historyAction.historyList(payload));
  const _loadingDataAction = (payload) =>
    dispatch(historyAction.historyLoaderStart(payload));
  const _historyFor = (payload) => dispatch(historyAction.historyFor(payload));
  const _basicAction = (payload) =>
    dispatch(historyAction.historyBasicActions(payload));
  const _nextPage = (payload) =>
    dispatch(historyAction.historyNewPage(payload));
  const _listLimit = (payload) =>
    dispatch(historyAction.historyChangeLimit(payload));
  const _historyCount = (payload) =>
    dispatch(historyAction.historyCount(payload));
  // Showing history list of every module, created global component and using on all required places.
  const CurrentProps = props;

  useEffect(() => {
    _loadingDataAction(false);
    _historyFor(props);
    _historyList({ showingFrom: props.showingFrom });
  }, []);

  const columns = [
    {
      title: "Date / Time",
      field: "createdAt",
    },
    {
      title: "Event Type",
      field: "event",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "Author",
      field: "addedBy",
      render: (rowData) => (
        <span>
          <Avatar
            style={{ display: "inline-flex", verticalAlign: "middle  " }}
            src={rowData.addedBy ? rowData.addedBy.avatar : ""}
            onClick={(data) => {
              if (rowData.addedBy) {
                setUserData(rowData.addedBy)
                setDrawerOpen(true)
              }
            }}
          >
            {rowData.addedBy
              ? rowData.addedBy.name.charAt(0).toUpperCase()
              : "S"}
          </Avatar>{" "}
          {rowData.addedBy ? rowData.addedBy.name : "System Created"}
        </span>
      ),
    },
  ];

  if (["Quote", "Renewal"].includes(props.historyFor)) {
    columns.splice(
      3,
      0,
      {
        title: "Amount (£)",
        field: "amount",
      },
      {
        title: "Contract Length",
        field: "contractLength",
      },
      {
        title: "Expiry Date",
        field: "expiryDate",
      },
      {
        title: "Notes",
        field: "notes",
      },
      {
        title: "Invoice",
        field: "invoice",
        render: (rowData) => (
          <span>
            {rowData.invoice !== undefined &&
              rowData.invoice &&
              Object.keys(rowData.invoice).length > 0 ? (
              <ViewFile attachments={[rowData.invoice]}></ViewFile>
            ) : (
              "-"
            )}
          </span>
        ),
      }
    );
  }

  const handleChangePage = (event, newPage) => {
    // const h = { ...props };
    const h = { ...historyState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    //const h = { ...props };
    const h = { ...historyState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    //    const h = { ...props };
    const h = { ...props, ...historyState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    props._searchInData(h);
  };

  const tableAction = [];

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="History"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={historyList && historyList.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          search: false,
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
                    label={historyCount === -1 ? "Total count" : historyCount}
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => _historyCount(null)}
                  />
                </td>
              </div>
            );
          },
        }}
        actions={!props.removeActions && tableAction}
      />
      {isDrawerOpen && <MyDrawer
        drawerSize="1100px"
        iconName="User"
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {userData && <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="caption table">
                <TableBody>
                  {userData.name && <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div>{userData.name}</div>
                    </TableCell>
                  </TableRow>}
                  {userData.email &&
                    <TableRow>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <div> {userData.email}</div>
                      </TableCell>
                    </TableRow>}
                  {userData.role && <TableRow>
                    <TableCell>
                      <strong>Role</strong>
                    </TableCell>
                    <TableCell><div> {getRole(userData.role)}</div></TableCell>
                  </TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        }
      </MyDrawer>
      }
    </Grid>
  );
}