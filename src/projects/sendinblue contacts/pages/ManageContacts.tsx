import React, { useEffect } from "react";
import { selectSendinblueContactState, contactAction } from "../redux/sendinblueContact";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import AddContact from '../sections/AddContact';
import ViewContact from '../sections/ViewContact';
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

export function ManageContacts(props) {

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Sendinblue" },
    ]);

  }, []);

  const classes = useStyles();
  const TemplateState = useSelector(selectSendinblueContactState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(contactAction.SlugUpdate({ slug: props.slug }));
    dispatch(contactAction.List(null));
  }, []);

  function handleOpenAddDrawer() {
    dispatch(contactAction.changeAddTemplateDrawerStatus(true));
  }

  function _getlistOfContactList() {
    dispatch(contactAction.ListContactList(null));
  }

  function _addContact(payload) {
    dispatch(contactAction.createContact(payload))
  }

  function handleOpenViewDrawer(id) {
    dispatch(contactAction.viewContact({ identifier: id }));
    dispatch(contactAction.changeViewTemplateDrawerStatus(true));
  }
  function _editContact(payload) {
    dispatch(contactAction.editContact(payload))
  }
  function deleteContact(id) {
    if (confirm("Are You sure you want to delete ?\n" + id)) {
      dispatch(contactAction.deleteContact({ identifier: id }));
    }
  }

  const handleChangePage = (event, newPage) => {
    dispatch(contactAction.LoaderStart(true));
    dispatch(contactAction.NewPage({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(contactAction.LoaderStart(true));
    dispatch(contactAction.ChangeLimit({ limit: event.target.value }));
  };

  const RefreshList = () => {
    dispatch(contactAction.List(null));

  };

  const columns: any = [
    {
      title: "Email",
      field: "email",
      sorting: false,
    },
    {
      title: "FirstName",
      field: "FIRSTNAME",
      sorting: false,
      ...(TemplateState.sort === "type" && {
        defaultSort: TemplateState.sortType,
      }),
    },
    {
      title: "LastName",
      field: "LASTNAME",
      sorting: false,
    },
    {
      title: "Created On",
      field: "createdAt",
      sorting: false,
      render: (rawData) => <p>{moment(rawData.createdAt).format("DD/MM/YYYY")}</p>,
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
            onClick={() => handleOpenViewDrawer(rowData.email)}
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
        (props.slug === "admin" || props.slug === 'management') && (
          <Tooltip title="Delete">
            <IconButton
              className={classes.DeleteActionBtn}
              aria-label="delete"
              onClick={() => deleteContact(rowData.email)}
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

  if (["admin", "management"].includes(props.slug)) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Contact",
      isFreeAction: true,
      onClick: handleOpenAddDrawer,
    });
  }

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Manage Sendinblue Contact"
        isLoading={TemplateState.remote}
        data={TemplateState?.contactList?.contacts ? TemplateState.contactList.contacts.map(e => ({ email: e.email, createdAt: e.createdAt, FIRSTNAME: e.attributes.FIRSTNAME, LASTNAME: e.attributes.LASTNAME })) : []}
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
        }}
        key={TemplateState.limit}
        components={{
          Pagination: () => {
            return (
              <div>
                <TablePagination
                  style={{ width: "100%", padding: 0, marginRight: 5 }}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  count={TemplateState.contactList.count}
                  rowsPerPage={TemplateState.limit}
                  page={TemplateState.page - 1}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </div>
            );
          },
        }}
        actions={tableAction}
      />
      <AddContact  {...props} _addContact={_addContact} _getlistOfContactList={_getlistOfContactList} contactState={TemplateState} />
      <ViewContact {...props} _editContact={_editContact} _getlistOfContactList={_getlistOfContactList} />
    </Grid>
  );
}
