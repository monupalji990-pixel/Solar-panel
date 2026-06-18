import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { selectItemState, itemAdminAction } from "../redux/itemAdmin";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import DeleteIcon from "@material-ui/icons/Delete";

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
  const itemState = useSelector(selectItemState)
  const dispatch = useDispatch();
  const classes = useStyles();
  const count = itemState.isNext ? itemState.items.length + itemState.limit : itemState.items.length

  useEffect(() => {
    dispatch(itemAdminAction.itemLoaderAction(false));
    dispatch(itemAdminAction.itemBasicActions({ usersCount: -1 }));
    dispatch(itemAdminAction.itemList(null));
  }, []);

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      dispatch(itemAdminAction.deleteItem(data._id));
    }
  };

  const columns = [
    {
      title: "Title",
      field: "title",
    },
    {
      title: "Price",
      field: "price",
      render: (rowData) => {
        return <span>₤ {rowData.price}</span>
      }
    },
    {
      title: "Description",
      field: "description",
    },
    {
      width: 60,
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
        props.slug === "admin" &&
        props.isFrom !== "Dashboard" && (
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
    const h = { ...itemState };
    h.page = newPage + 1;
    dispatch(itemAdminAction.itemLoaderStart(false));
    dispatch(itemAdminAction.itemBasicActions({ usersCount: -1 }));
    dispatch(itemAdminAction.itemNewPage(h));
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...itemState };
    h.limit = event.target.value;

    dispatch(itemAdminAction.itemLoaderStart(false));
    dispatch(itemAdminAction.itemBasicActions({ usersCount: -1 }));
    dispatch(itemAdminAction.itemChangeLimit(h));
  };

  const searchInData = (event) => {
    const h = { ...itemState };
    h.searchText = encodeURIComponent(event);
    dispatch(itemAdminAction.itemLoaderStart(false));
    dispatch(itemAdminAction.itemBasicActions({ usersCount: -1 }));
    dispatch(itemAdminAction.itemSearch(h));
  };

  const RefreshList = () => {
    dispatch(itemAdminAction.itemLoaderStart(false));
    dispatch(itemAdminAction.itemBasicActions({ usersCount: -1 }));
    dispatch(itemAdminAction.itemList(null));
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  let col: any = columns.find((col) => {
    return col.field === itemState.sort;
  });

  if (col) col.defaultSort = itemState.sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Items"
        isLoading={!itemState.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={itemState.items.map((e) => ({ ...e }))}
        options={{
          pageSize: itemState.limit,
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
        key={itemState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={count}
                  rowsPerPage={itemState.limit}
                  page={itemState.page - 1}
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
            tooltip: "Add Item",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </Grid>
  );
}
