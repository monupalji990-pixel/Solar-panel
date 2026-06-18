import React, { useEffect } from "react";
import {
  selectDocState,
  verbalDocAction,
  sliceKeyVerbalDoc,
  verbalDocReducer,
  verbalDocSaga,
} from "../redux/verbal";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button, Chip, Grid, IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import CreateDoc from "../sections/CreateDoc";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import moment from "moment";
import { selectCompanyState } from "projects/company/redux/company";
import { selectQuoteState } from "projects/quote/redux/quote";

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

export function ManageDocs(props) {
  useInjectReducer({ key: sliceKeyVerbalDoc, reducer: verbalDocReducer });
  useInjectSaga({ key: sliceKeyVerbalDoc, saga: verbalDocSaga });

  const company = useSelector(selectCompanyState);
  const quote = useSelector(selectQuoteState);
  const formInitialVal: any = {};
  if (props.showingFrom == "viewQuote") {
    formInitialVal.id = quote?.currentQuote?._id;
  } else {
    formInitialVal.id = company?.currentCompany?._id;
  }

  const classes = useStyles();
  const docState = useSelector(selectDocState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verbalDocAction.SlugUpdate({ slug: props.slug }));
    dispatch(
      verbalDocAction.List({
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  }, []);

  function handleOpenAddDrawer() {
    dispatch(verbalDocAction.changeAddDocDrawerStatus(true));
  }

  function handleOpenViewDrawer(id) {
    dispatch(verbalDocAction.viewDoc(id));
    dispatch(verbalDocAction.changeViewDocDrawerStatus(true));
  }

  function _loadingDataAction(bool) {
    dispatch(verbalDocAction.LoaderStart(bool));
  }

  const handleChangePage = (event, newPage) => {
    _loadingDataAction(false);
    dispatch(
      verbalDocAction.NewPage({
        page: newPage + 1,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    _loadingDataAction(false);
    dispatch(
      verbalDocAction.ChangeLimit({
        limit: event.target.value,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const searchInData = (event) => {
    _loadingDataAction(false);
    dispatch(
      verbalDocAction.Search({
        searchText: encodeURIComponent(event),
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const sortingAction = (sortingOn) => {
    _loadingDataAction(false);
    dispatch(
      verbalDocAction.tableSort({
        ...sortingOn,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    dispatch(
      verbalDocAction.List({
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const columns: any = [
    {
      title: "Name",
      field: "template.templateName",
      sorting: true,
      ...(docState.sort === "template" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Type",
      field: "template.type",
      sorting: true,
      ...(docState.sort === "type" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "SentBy",
      field: "sentBy",
      sorting: true,
      render: (rawData) => <p>{rawData.sentBy.name}</p>,
      ...(docState.sort === "sentBy" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Sent Time",
      field: "sentDocumentTimestamp",
      sorting: true,
      render: (rawData) => (
        <p>{moment(rawData.sentDocumentTimestamp).format("DD/MM/YYYY")}</p>
      ),
      ...(docState.sort === "sentDocumentTimestamp" && {
        defaultSort: docState.sortType,
      }),
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
            onClick={() => handleOpenViewDrawer(rowData._id)}
          >
            <VisibilityIcon className={classes.IconSize} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const tableAction: any = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: RefreshList,
    }
  ];

  if (["admin", "management", "partner", "sales_rep"].includes(props.slug)) {
    tableAction.push({
      icon: "add",
      tooltip: "Create Document",
      isFreeAction: true,
      onClick: handleOpenAddDrawer,
    });
  }

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        title="Manage Docs"
        isLoading={!docState.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={docState.docList.map((e) => ({
          ...e,
        }))}
        options={{
          pageSize: docState.limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
        }}
        onOrderChange={(sort, sortType) => {
          let h: any = {};
          if (sort === -1) {
            h.sort = "DueDate";
            h.sortType = "desc";
          } else {
            h.sort = columns[sort].field;
            h.sortType = sortType;
          }
          sortingAction(h); // added sorting for temp check
        }}
        key={docState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={docState.count}
                  rowsPerPage={docState.limit}
                  page={docState.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <td className={classes.CountBtnStyle}>
                  <Chip
                    label={
                      docState.count === -1 ? "Total count" : docState.count
                    }
                    variant="outlined"
                    style={{ marginRight: 5 }}
                  />
                </td>
              </div>
            );
          },
        }}
        actions={tableAction}
      />
      <CreateDoc showingFrom={props.showingFrom} />
    </Grid>
  );
}
