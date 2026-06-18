import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import FilterListIcon from "@material-ui/icons/FilterList";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import Chip from "@material-ui/core/Chip";
import LowPriorityRoundedIcon from "@material-ui/icons/LowPriorityRounded";
import ListAltIcon from "@material-ui/icons/ListAlt";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  QuoteStatusNames,
  TaskValueToStatus,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";

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

export default function TaskList(props) {
  const isShowOnlyDueTask = (isShow) => {
    props._loadingDataAction(false);
    props._basicAction({ dueTask: isShow, taskCount: -1 });
    props._taskList({ showingFrom: props.showingFrom });
  };

  const checkURL = () => {
    const urlParams = new URLSearchParams(props.location.search);
    if (urlParams.get("dt") !== undefined && urlParams.get("dt")) {
      props.setEditDrawer({ _id: urlParams.get("dt") });
    } else {
    }
  };

  const { showSearch } = props;
  const { setShowSearch } = props;
  const CurrentProps = props;
  const classes = useStyles();

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    const filterObject: any = {}
    filterObject.TaskStatus = ['1062', '1063', '1064', '1065', '1066']
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._basicAction({ taskCount: -1 });
    if (props.isFor === "complaint") {
      props._taskList({ showingFrom: props.showingFrom, filterData: filterObject });
    } else {
      props._taskList({ showingFrom: props.showingFrom, filterData: {} });
    }
    checkURL();
  }, []);

  if (props.currentDueTask && props.currentDueTask._id && !isOpened) {
    setIsOpened(true);
    props.setEditDrawer({ _id: props.currentDueTask._id });
  }

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      props._loadingDataAction(false);
      props._basicAction({ taskCount: -1 });
      props._deleteTask([data._id]);
      setShowSearch(0);
    }
  };

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  const handleChangePage = (event, newPage) => {
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._basicAction({ taskCount: -1 });
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._basicAction({ taskCount: -1 });
    props._listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._basicAction({ taskCount: -1 });
    props._searchInData(h);
  };

  const RefreshList = () => {
    props._loadingDataAction(false);
    props._basicAction({ taskCount: -1 });
    props._taskList({ showingFrom: props.showingFrom });
  };

  const columns: any = [
    {
      title: "Task ID",
      field: "customTaskId",
      sorting: true,
    },
    {
      title: "Title",
      field: "title",
      sorting: true,
    },
    {
      title: "Priority",
      field: "priority",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: rowData.taskStatus !== '1010' ? (rowData.isWeekDate ? '#ffffff' : "#ffffff") : StatusFontCodeColor[rowData.priority],
            backgroundColor: rowData.taskStatus !== '1010' ? (rowData.isWeekDate ? "#193562" : "#193562") : StatusCodeColor[rowData.priority],
          }}
        >
          {QuoteStatusNames[rowData.priority]}
        </span>
      ),
      sorting: false,
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Due Date",
      field: "DueDate",
      render: (rowData) => (
        <span className={helperMethods.ColorForDate1(rowData.taskDueDate)}>
          {rowData.taskDueDate}
        </span>
      ),
    },
    {
      title: "Created Date",
      field: "createdAt",
    },
    {
      title: "Assignee",
      field: "assignee",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Observers",
      field: "observers",
      headerStyle: { fontWeight: "bold" },
    },
    {
      title: "Status",
      field: "taskStatus",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: rowData.taskStatus == "1000" ? '#20bf6b' : StatusFontCodeColor[rowData.taskStatus],
            backgroundColor: rowData.taskStatus !== '1010' ? (rowData.isWeekDate ? '#ffffff' : '#ffffff') : rowData.taskStatus == "1000" ? "rgba(32, 191, 107,.05)" : StatusCodeColor[rowData.taskStatus],
          }}
        >
          {TaskValueToStatus[rowData.taskStatus]}
        </span>
      ),
      sorting: false,
      headerStyle: { fontWeight: "bold" },
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
              color: rowData.taskStatus !== '1010' ? '#ffffff' : (rowData.company ? "#193562" : "#22a6b3"),
              backgroundColor: `${rowData.company
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
  }

  const tableAction: any = [
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
  ];
  if (props.slug === "admin") {
    tableAction.push({
      icon: "delete",
      tooltip: "Delete",
      onClick: (evt, data) => {
        if (confirm("Are you sure you want to delete selected Tasks?")) {
          let deleteTaskIds = [];
          data.forEach((task) => {
            deleteTaskIds.push(task._id);
          });
          props._loadingDataAction(false);
          props._deleteTask(deleteTaskIds);
          setShowSearch(0);
        }
      },
    });
  }

  tableAction.push(
    !props.dueTask && {
      icon: () => <LowPriorityRoundedIcon />,
      tooltip: "Today\n's due task",
      isFreeAction: true,
      onClick: () => isShowOnlyDueTask(true),
    }
  );

  tableAction.push(
    props.dueTask && {
      icon: () => <ListAltIcon />,
      tooltip: "All task",
      isFreeAction: true,
      onClick: () => isShowOnlyDueTask(false),
    }
  );

  if (["admin", "management", "partner", "sales_rep"].includes(props.slug)) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Task",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

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
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Task"
        isLoading={!props.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={props?.taskList?.map((e) => ({ ...e }))}
        options={{
          pageSize: props.limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          selection: props.slug === "admin" ? true : false,
          search: showSearch === 0,
          rowStyle: rowData => ({
            backgroundColor: rowData.taskStatus !== '1010' && (rowData.isWeekDate ? rowData.isWeekDate : ''),
            color: rowData.taskStatus !== '1010' && (rowData.isWeekDate ? '#ffffff' : "#193562"),
          })
        }}
        onOrderChange={(sort, sortType) => {
          let h = { ...props };
          if (sort === -1) {
            h.sort = "DueDate";
            h.sortType = "desc";
          } else {
            h.sort = columns[sort].field;
            h.sortType = sortType;
          }
          props._sortingAction(h); // added sorting for temp check
        }}
        onSelectionChange={(evt, selectedRow: any) => {
          if (selectedRow === undefined) {
            if (props.tableRef.current.state.selectedCount === 0)
              setShowSearch(0);
          } else if (selectedRow.tableData.checked) {
          } else if (!selectedRow.tableData.checked) {
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
                      CurrentProps.taskCount === -1
                        ? "Total count"
                        : CurrentProps.taskCount
                    }
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => CurrentProps._taskCount()}
                  />
                </td>
              </div>
            );
          },
        }}
        actions={tableAction}
      />
    </Grid>
  );
}