import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { selectInvoiceState, invoiceAdminAction } from "../redux/invoiceAdmin";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  InvoiceStatus,
  StatusCodeColor,
  StatusFontCodeColor,
} from "sharedUtils/globalHelper/status";
import moment from "moment";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles(() => ({
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
    marginRight: "0.7rem",
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
  UserFieldStyle: {
    display: "flex",
    alignItems: "center",
  },
}));

export default function userList(props) {
  const invoiceState = useSelector(selectInvoiceState);
  const dispatch = useDispatch();
  const classes = useStyles();
  const count = invoiceState.isNext
    ? invoiceState.invoices.length + invoiceState.limit
    : invoiceState.invoices.length;

  useEffect(() => {
    dispatch(invoiceAdminAction.invoiceLoaderAction(false));
    dispatch(invoiceAdminAction.invoiceBasicActions({ usersCount: -1 }));
    dispatch(invoiceAdminAction.invoiceList(null));
  }, []);

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      dispatch(invoiceAdminAction.deleteInvoice(data._id));
    }
  };

  const getCompanyConsumerName = (rowData) => {
    if (rowData?.company?.businessName) {
      return rowData.company.businessName;
    } else if (rowData?.consumer) {
      const { firstName, lastName } = rowData.consumer;
      return `${firstName || ""} ${lastName || ""}`.trim() || "N/A";
    }
    return "N/A";
  };

  const pdfGenerateFunc = (data) => {
    dispatch(invoiceAdminAction.generatePDF(data._id));
  };

  const columns = [
    {
      title: "Invoice No.",
      field: "invoiceNumber",
    },
    {
      title: "Company/Consumer",
      sorting: true,
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: `${rowData?.company ? "#193562" : "#22a6b3"}`,
            backgroundColor: `${
              rowData?.company ? "rgba(25,53,98,.08)" : "rgba(34, 166, 179,.08)"
            }`,
          }}
        >
          {getCompanyConsumerName(rowData)}
        </span>
      ),
    },
    {
      title: "Due Date",
      field: "dueDate",
      render: (rawData) => moment(rawData.dueDate).format("DD/MM/YYYY"),
    },
    {
      title: "Status",
      field: "status",
      sorting: false,
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.status],
            backgroundColor: StatusCodeColor[rowData.status],
          }}
        >
          {InvoiceStatus[rowData.status]}
        </span>
      ),
    },
    {
      title: "Total Amount",
      field: "totalAmount",
      render: (rowData) => {
        return <span>₤ {rowData?.totalAmount}</span>;
      },
    },
    {
      width: 60,
      sorting: false,
      render: (rowData) => (
        <Tooltip title="PDF Download" placement="top">
          <IconButton
            className={classes.ViewActionBtn}
            aria-label="view"
            onClick={() => pdfGenerateFunc(rowData)}
          >
            <GetAppIcon className={classes.IconSize} />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      width: 60,
      sorting: false,
      render: (rowData) => (
        <Tooltip title="View" placement="top">
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
          <Tooltip title="Delete" placement="top">
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
    const h = { ...invoiceState };
    h.page = newPage + 1;
    dispatch(invoiceAdminAction.invoiceLoaderStart(false));
    dispatch(invoiceAdminAction.invoiceBasicActions({ usersCount: -1 }));
    dispatch(invoiceAdminAction.invoiceNewPage(h));
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...invoiceState };
    h.limit = event.target.value;

    dispatch(invoiceAdminAction.invoiceLoaderStart(false));
    dispatch(invoiceAdminAction.invoiceBasicActions({ usersCount: -1 }));
    dispatch(invoiceAdminAction.invoiceChangeLimit(h));
  };

  const searchInData = (event) => {
    const h = { ...invoiceState };
    h.searchText = encodeURIComponent(event);
    dispatch(invoiceAdminAction.invoiceLoaderStart(false));
    dispatch(invoiceAdminAction.invoiceBasicActions({ usersCount: -1 }));
    dispatch(invoiceAdminAction.invoiceSearch(h));
  };

  const RefreshList = () => {
    dispatch(invoiceAdminAction.invoiceLoaderStart(false));
    dispatch(invoiceAdminAction.invoiceBasicActions({ usersCount: -1 }));
    dispatch(invoiceAdminAction.invoiceList(null));
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  let col: any = columns.find((col) => {
    return col.field === invoiceState.sort;
  });

  if (col) col.defaultSort = invoiceState.sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Invoices"
        isLoading={!invoiceState.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={invoiceState.invoices.map((e) => ({ ...e }))}
        options={{
          pageSize: invoiceState.limit,
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
        key={invoiceState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={count}
                  rowsPerPage={invoiceState.limit}
                  page={invoiceState.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
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
            icon: "add",
            tooltip: "Add Invoice",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </Grid>
  );
}
