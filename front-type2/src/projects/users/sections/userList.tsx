import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import FilterListIcon from "@material-ui/icons/FilterList";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { userAdminAction, selectUsersState } from "../redux/userAdmin";
import {
  UserStatusNames,
  UserRole,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { Typography } from "@material-ui/core";

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
  const userState = { ...useSelector(selectUsersState) };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userAdminAction.userLoaderAction(false));
    dispatch(userAdminAction.userSlugUpdate(props));
    dispatch(userAdminAction.userBasicActions({ usersCount: -1 }));
    dispatch(userAdminAction.userList(null));
  }, []);

  const CurrentProps = props;
  const classes = useStyles();

  const columns = [
    {
      title: "User",
      field: "name",
      sorting: false,
      render: (rowData) => (
        <div className={classes.UserFieldStyle}>
          <Avatar src={rowData.avatar}>
            {rowData.avatar === undefined &&
              rowData.name &&
              rowData.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            style={{ marginLeft: 10 }}
            variant="body2"
            display="inline"
          >
            {rowData.name}
          </Typography>
        </div>
      ),
    },

    {
      title: "Email",
      field: "email",
    },
    {
      title: "Role",
      field: "role",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.role],
            backgroundColor: StatusCodeColor[rowData.role],
          }}
        >
          {UserRole[rowData.role]}
        </span>
      ),
    },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <>
          <span
            className="StatusChip"
            style={{
              color: StatusFontCodeColor[rowData.status],
              backgroundColor: StatusCodeColor[rowData.status],
            }}
          >
            {UserStatusNames[rowData.status]}{" "}
          </span>
        </>
      ),
    },
    {
      title: "IsDelete",
      field: "isDelete",
      hidden: true,
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
  ];

  const handleChangePage = (event, newPage) => {
    const h = userState;
    h.page = newPage + 1;
    dispatch(userAdminAction.userLoaderStart(false));
    dispatch(userAdminAction.userBasicActions({ usersCount: -1 }));
    dispatch(userAdminAction.userNewPage(h));
  };

  const handleChangeRowsPerPage = (event) => {
    const h = userState;
    h.limit = event.target.value;

    dispatch(userAdminAction.userLoaderStart(false));
    dispatch(userAdminAction.userBasicActions({ usersCount: -1 }));
    dispatch(userAdminAction.userChangeLimit(h));
  };

  const searchInData = (event) => {
    const h = userState;
    h.searchText = encodeURIComponent(event);
    dispatch(userAdminAction.userLoaderStart(false));
    dispatch(userAdminAction.userBasicActions({ usersCount: -1 }));
    dispatch(userAdminAction.userSearch(h));
  };

  const RefreshList = () => {
    dispatch(userAdminAction.userLoaderStart(false));
    dispatch(userAdminAction.userBasicActions({ usersCount: -1 }));
    dispatch(userAdminAction.userList(null));
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  let col: any = columns.find((col) => {
    return col.field === userState.sort;
  });

  if (col) col.defaultSort = userState.sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Users"
        isLoading={!userState.remote}
        onSearchChange={(e) => debounceOnChange(e)}
        data={userState.users.map((e) => ({ ...e }))}
        options={{
          pageSize: userState.limit,
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
        key={userState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={userState.count}
                  rowsPerPage={userState.limit}
                  page={userState.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <td className={classes.CountBtnStyle}>
                  <Chip
                    label={
                      userState.usersCount === -1
                        ? "Total count"
                        : userState.usersCount
                    }
                    variant="outlined"
                    style={{ marginRight: 5 }}
                    onClick={() => dispatch(userAdminAction.userCount(null))}
                  />
                </td>
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
            icon: () => <FilterListIcon />,
            tooltip: "Filters",
            isFreeAction: true,
            onClick: props.setFilterDrawer,
          },
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </Grid>
  );
}
