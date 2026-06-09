import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import MaterialTable from "material-table";
import FilterListIcon from "@material-ui/icons/FilterList";
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  QuoteStatusNames,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { AMPS } from "../../../sharedUtils/globalHelper/constantValues";
import QuoteBoardView from './board/boardView';

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

export default function quoteList(props) {
  let history = useHistory()

  const [boardView, setBoardView] = useState(null)

  const checkURL = () => {
    const urlParams = new URLSearchParams(props?.location?.search);
    if (urlParams.get("add") !== undefined && urlParams.get("add")) {
      props.setAddDrawerTemp();
    }
  };

  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._basicAction({ quoteCount: -1 });
    props._quoteList({ showingFrom: props.showingFrom });
    checkURL();
  }, []);

  const CurrentProps = props;
  const classes = useStyles();

  const deleteConfirmation = (data) => {
    if (
      confirm(
        `Are you sure you want to delete? \nNote: If you delete this quote then all renewals for this quote will also be deleted.`
      )
    ) {
      props._loadingDataAction(false);
      props._basicAction({ quoteCount: -1 });
      props._deleteQuote(data._id);
    }
  };

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  const columns = [
    {
      title: "Quote ID",
      field: "quoteID",

    },
    {
      title: "Assignee",
      field: "assignee",
    },
    {
      title: "Service",
      field: "serviceType",
    },
    {
      title: "Status",
      field: "quoteStatus",
      sorting: false,
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.quoteStatus],
            backgroundColor: StatusCodeColor[rowData.quoteStatus],
          }}
        >
          {QuoteStatusNames[rowData.quoteStatus]}
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
      field: "Consumer",
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

  if (props.isCreatedFrom === "Consumer") {
  } else if (props.isCreatedFrom === "Company") {
    columns.splice(4, 0, {
      title: "Site",
      field: "site",
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
              color: rowData.quoteStatus == '1000' ? '#ffffff' : `${rowData.company ? "#193562" : "#22a6b3"}`,
              backgroundColor:
                rowData.quoteStatus == '1000' ?
                  '#6d92d9'
                  :
                  `${rowData.company
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
    columns.splice(5, 0, {
      title: "Site",
      field: "site",
    });
  }

  const handleChangePage = (event, newPage) => {
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._basicAction({ quoteCount: -1 });
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._basicAction({ quoteCount: -1 });
    props._listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._basicAction({ quoteCount: -1 });
    props._searchInData(h);
  };

  const RefreshList = () => {
    props._loadingDataAction(false);
    props._basicAction({ quoteCount: -1 });
    props._quoteList({ showingFrom: props.showingFrom });
  };

  const openBoardView = () => {
    setBoardView(true);
  }

  const tableAction: any = [
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
  ];


  if (
    AMPS.includes(props.slug) &&
    ["/lead", "/consumer", "/company"].includes(props?.match?.path)
  ) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Quote",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

  // if (AMPS.includes(props.slug) && ["/quote"].includes(props?.match?.path)) {
  //   tableAction.push({
  //     icon: "add",
  //     tooltip: "Add Quote",
  //     isFreeAction: true,
  //     onClick: props.setAddDrawerTemp,
  //   });
  // }

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  let col: any = columns.find((col) => {
    return col.field === props.sort;
  });

  if (col) col.defaultSort = props.sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      {boardView ?
        <QuoteBoardView {...props} setBoardView={setBoardView} />
        :
        <MaterialTable
          columns={columns}
          tableRef={props.tableRef}
          title="Manage Quote"
          isLoading={!props.remote}
          onSearchChange={(e) => debounceOnChange(e)}
          data={props.quoteList.map((e) => ({ ...e }))}
          options={{
            pageSize: props.limit,
            emptyRowsWhenPaging: false,
            exportButton: false,
            filtering: false,
            rowStyle: rowData => ({
              backgroundColor: rowData.quoteStatus == '1000' ? '#6d92d9' : '',
              color: rowData.quoteStatus == '1000' ? '#ffffff' : '',
            })
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
                        CurrentProps.quoteCount === -1
                          ? "Total count"
                          : CurrentProps.quoteCount
                      }
                      variant="outlined"
                      style={{ marginRight: 5 }}
                      onClick={() => CurrentProps._quoteCount()}
                    />
                  </td>
                </div>
              );
            },
          }}
          actions={tableAction}
        />
      }
    </Grid>
  );
}
