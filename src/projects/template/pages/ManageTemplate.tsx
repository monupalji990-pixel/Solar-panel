import React, { useEffect } from "react";
import { selectTemplateState, templateAction } from "../redux/template";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Chip, Grid, IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import AddTemplate from "../sections/AddTemplate";
import ViewTemplate from "../sections/ViewTemplate";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import ReplaceTemplate from "../sections/ReplaceTemplate";
import moment from "moment";

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

export function ManageTemplate(props) {

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Template" },
    ]);
  }, []);

  const classes = useStyles();
  const TemplateState = useSelector(selectTemplateState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(templateAction.SlugUpdate({ slug: props.slug }));
    dispatch(templateAction.List(null));
  }, []);

  function handleOpenAddDrawer() {
    dispatch(templateAction.changeAddTemplateDrawerStatus(true));
  }

  function handleOpenViewDrawer(id) {
    dispatch(templateAction.viewTemplate(id));
    dispatch(templateAction.changeViewTemplateDrawerStatus(true));
  }
  function deleteTemplate(id) {
    if (confirm("Are You sure you want to delete ")) {
      console.log("tobe delete", id);

      dispatch(templateAction.deleteTemplate(id));
    }
  }
  function _loadingDataAction(bool) {
    dispatch(templateAction.LoaderStart(bool));
  }
  const handleChangePage = (event, newPage) => {
    _loadingDataAction(false);
    dispatch(templateAction.NewPage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    _loadingDataAction(false);
    dispatch(templateAction.ChangeLimit({ limit: event.target.value }));
  };

  const searchInData = (event) => {
    _loadingDataAction(false);
    dispatch(templateAction.Search({ searchText: encodeURIComponent(event) }));
  };

  const sortingAction = (sortingOn) => {
    _loadingDataAction(false);
    dispatch(templateAction.tableSort(sortingOn));
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    dispatch(templateAction.List(null));
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const columns: any = [
    {
      title: "Name",
      field: "templateName",
      sorting: true,
      ...(TemplateState.sort === "templateName" && {
        defaultSort: TemplateState.sortType,
      }),
    },
    {
      title: "Type",
      field: "type",
      sorting: false,
      ...(TemplateState.sort === "type" && {
        defaultSort: TemplateState.sortType,
      }),
    },
    {
      title: "CreatedBy",
      field: "CreatedBy",
      sorting: false,
      render: (rawData) => <p>{rawData.createdBy.name}</p>,
      ...(TemplateState.sort === "CreatedBy" && {
        defaultSort: TemplateState.sortType,
      }),
    },
    {
      title: "Created On",
      field: "createdAt",
      sorting: true,
      render: (rawData) =><p>{moment(rawData.createdAt).format("DD/MM/YYYY")}</p>,
      ...(TemplateState.sort === "createdAt" && {
        defaultSort: TemplateState.sortType,
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
              onClick={() => deleteTemplate(rowData._id)}
            >
              <DeleteIcon className={classes.IconSize} />
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
      tooltip: "Add Template",
      isFreeAction: true,
      onClick: handleOpenAddDrawer,
    });
  }

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        title="Manage Template"
        isLoading={!TemplateState.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={TemplateState.templateList.map((e) => ({
          ...e,
        }))}
        options={{
          pageSize: TemplateState.limit,
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
        key={TemplateState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={TemplateState.count}
                  rowsPerPage={TemplateState.limit}
                  page={TemplateState.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <td className={classes.CountBtnStyle}>
                  <Chip
                    label={
                      TemplateState.count === -1
                        ? "Total count"
                        : TemplateState.count
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
      <AddTemplate />
      <ViewTemplate />
      <ReplaceTemplate />
    </Grid>
  );
}
