import React, { useEffect } from "react";
import {
  selectDocState,
  digitalDocAction,
  sliceKeyDigitalDoc,
  digitalDocReducer,
  digitalDocSaga,
} from "../redux/digital";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Chip, Grid, IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import CreateDoc from "../sections/CreateDoc";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import ViewSavedDoc from "../sections/viewSavedDoc";
import moment from "moment";
import { selectCompanyState } from "projects/company/redux/company";
import { selectQuoteState } from "projects/quote/redux/quote";
import { selectRenewalState } from "../../renewal/Redux/renewal";
import { docusignAction } from "projects/docusign/redux/docusign";
import { ViewAudit } from "projects/docusign/components/ViewAudit";

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
  useInjectReducer({ key: sliceKeyDigitalDoc, reducer: digitalDocReducer });
  useInjectSaga({ key: sliceKeyDigitalDoc, saga: digitalDocSaga });

  const company = useSelector(selectCompanyState);
  const quote = useSelector(selectQuoteState);
  const renewalState = useSelector(selectRenewalState);

  const docState = useSelector(selectDocState);
  const dispatch = useDispatch();
  const classes = useStyles();

  const formInitialVal: any = {};
  if (props.showingFrom == "viewQuote") {
    formInitialVal.id = quote?.currentQuote?._id;
  }
  else if (props.showingFrom == "viewCompany") {
    formInitialVal.id = company?.currentCompany?._id;
  }
  else if (props.showingFrom == "viewRenewal") {
    formInitialVal.id = renewalState?.currentQuote?._id;
  }

  useEffect(() => {
    dispatch(digitalDocAction.SlugUpdate({ slug: props.slug }));
    dispatch(
      digitalDocAction.List({
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  }, []);

  function handleOpenAddDrawer() {
    dispatch(digitalDocAction.changeAddDocDrawerStatus(true));
  }
  function handleAuditDrawerOpen(envId, docusignEmailSubject) {
    dispatch(docusignAction.changeAuditDrawer({ open: true, envId, docusignEmailSubject }));
  }

  function handleOpenViewDrawer(id) {
    dispatch(digitalDocAction.viewDoc(id));
    dispatch(digitalDocAction.changeViewDocDrawerStatus(true));
  }

  function deleteDoc(id) {
    if (confirm("Are You sure you want to delete ")) {
      dispatch(digitalDocAction.deleteDoc(id));
    }
  }

  function _loadingDataAction(bool) {
    dispatch(digitalDocAction.LoaderStart(bool));
  }

  const handleChangePage = (event, newPage) => {
    _loadingDataAction(false);
    dispatch(
      digitalDocAction.NewPage({
        page: newPage + 1,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    _loadingDataAction(false);
    dispatch(
      digitalDocAction.ChangeLimit({
        limit: event.target.value,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const searchInData = (event) => {
    _loadingDataAction(false);
    dispatch(
      digitalDocAction.Search({
        searchText: encodeURIComponent(event),
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const sortingAction = (sortingOn) => {
    _loadingDataAction(false);
    dispatch(
      digitalDocAction.tableSort({
        ...sortingOn,
        showingFrom: props.showingFrom,
        ...formInitialVal,
      })
    );
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    dispatch(
      digitalDocAction.List({
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
      field: "filename",
      sorting: false,
      render: (rawData) => <p>{
        rawData.mode == 'Docusign' ? rawData.docusignEmailSubject : rawData.filename
      }</p>,
      ...(docState.sort === "filename" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Type",
      field: "template.type",
      sorting: false,
      ...(docState.sort === "type" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Mode",
      field: "mode",
      sorting: false,
      render: (rawData) => <p>{rawData.mode || "-"}</p>,
      ...(docState.sort === "type" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Status",
      field: "status",
      sorting: false,
      render: (rawData) => <p>{rawData.status || "-"}</p>,
      ...(docState.sort === "status" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "SentBy",
      field: "sentBy",
      sorting: false,
      render: (rawData) => <p>{rawData.sentBy.name}</p>,
      ...(docState.sort === "sentBy" && {
        defaultSort: docState.sortType,
      }),
    },
    {
      title: "Sent Date",
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
            onClick={() => {
              if (rowData.mode === 'Docusign') {
                // console.log(rowData, "docusign")

                handleAuditDrawerOpen(rowData.docusignEnvId, rowData.docusignEmailSubject)
              } else
                handleOpenViewDrawer(rowData._id)
            }}
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
    },
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
      <ViewSavedDoc showingFrom={props.showingFrom} {...props} />
      <CreateDoc showingFrom={props.showingFrom} {...props} />
      <ViewAudit {...props} />
    </Grid>
  );
}
