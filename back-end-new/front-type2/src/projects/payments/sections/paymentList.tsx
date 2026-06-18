import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  paymentAction,
  selectPaymentState,
} from "../redux/payments";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RefreshIcon from "@material-ui/icons/Refresh";
import {
  PaymentStatus, StatusCodeColor,
  StatusFontCodeColor,
} from '../../../sharedUtils/globalHelper/status'

const useStyles = makeStyles(() => ({
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
}));

export default function PaymentList(props) {

  const paymentState = useSelector(selectPaymentState);

  const classes = useStyles();

  const {
    remote,
    page,
    historyList,
    limit,
    count,
    search
  } = paymentState

  const dispatch = useDispatch();

  const _paymentList = (payload) =>
    dispatch(paymentAction.paymentList(payload));
  const _loadingDataAction = (payload) =>
    dispatch(paymentAction.historyLoaderStart(payload));
  const _basicAction = (payload) =>
    dispatch(paymentAction.historyBasicActions(payload));
  const _nextPage = (payload) =>
    dispatch(paymentAction.historyNewPage(payload));
  const _listLimit = (payload) =>
    dispatch(paymentAction.historyChangeLimit(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _paymentList(null);
    if (Object.keys(search).length > 0 && search !== null && search !== undefined)
      props._filterData(null);
  }, []);

  const columns = [
    {
      title: "Ref",
      field: "ref",
    },
    {
      title: "Supplier",
      field: "supplier",
    },
    {
      title: "Business Name",
      field: "company",
    },
    {
      title: "Meter Number",
      field: "meterNumber",
    },
    {
      title: "Status",
      field: "contractStatus",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.contractStatus],
            backgroundColor: StatusCodeColor[rowData.contractStatus],
          }}
        >
          {PaymentStatus[rowData.contractStatus]}
        </span>
      ),
    },
    {
      width: "10%",
      cellStyle: { width: "10%" },
      headerStyle: { width: "10%" },
      sorting: false,
      render: (rowData) => (
        <Tooltip title="View">
          <IconButton
            className={classes.ViewActionBtn}
            aria-label="view"
            onClick={() => props.setViewDrawer(rowData)}
          >
            <VisibilityIcon className={classes.IconSize} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];


  const handleChangePage = (event, newPage) => {
    const h = { ...paymentState }
    h.page = newPage + 1;
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...paymentState }
    h.limit = event.target.value;
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...props, ...paymentState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _basicAction({ historyCount: -1 });
    props._searchInData(h);
  };

  const RefreshList = () => {
    _paymentList(null);
  }

  let tableAction = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => RefreshList(),
    },
    {
      icon: 'add',
      tooltip: "Add Payment",
      isFreeAction: true,
      onClick: props.setAddPaymentDrawer,
    }
  ];

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Payment History"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={historyList.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          search: false,
          sorting: false,
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
              </div>
            );
          },
        }}
        actions={tableAction}
      />
    </Grid>
  );
}