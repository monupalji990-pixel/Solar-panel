import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import {
  supplier_contactAction,
  selectSupplier_contactState,
} from "../redux/supplier_contact";
import { AM } from "../../../../../sharedUtils/globalHelper/constantValues";
import { IconButton, makeStyles, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyle = makeStyles({
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
})

export default function ContactList(props) {
  const supplier_contactState = useSelector(selectSupplier_contactState);

  const { contactList, count, limit, remote, page, supplierId, hideSideBar } = {
    ...supplier_contactState,
  };

  const classes = useStyle();
  const dispatch = useDispatch();

  const _contactList = (payload) =>
    dispatch(supplier_contactAction.supplier_contactList(payload));
  const _loadingDataAction = (payload) =>
    dispatch(supplier_contactAction.supplier_contactLoaderStart(payload));
  const _searchInData = (payload) =>
    dispatch(supplier_contactAction.supplier_contactSearch(payload));
  const _nextPage = (payload) =>
    dispatch(supplier_contactAction.supplier_contactNewPage(payload));
  const _listLimit = (payload) =>
    dispatch(supplier_contactAction.supplier_contactChangeLimit(payload));
  const _slugUpdate = (payload) =>
    dispatch(supplier_contactAction.supplier_contactSlugUpdate(payload));
  const _deleteContact = (payload) =>
    dispatch(supplier_contactAction.deleteSupplier_contact(payload));
  const _closeSideBar = (payload) =>
    dispatch(supplier_contactAction.supplier_contactCloseSideBar(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate(props);
    _contactList(null);
  }, []);

  function deleteConfirmation(data) {
    if (confirm('Are You sure you want to delete?')) {
      simpleDelete(data);
    }
  }

  const simpleDelete = (data) => {
    const updateObject = {
      supplierId: supplierId,
      editData: {
        Email: data.Email,
        contactPersonName: data.contactPersonName,
      },
    };
    _loadingDataAction(false);
    _deleteContact(updateObject);
  };

  if (hideSideBar) {
    props.onCloseChild();
    _closeSideBar(false);
  }

  const options = [
    {
      name: "View",
      callFunc: props.setEditDrawer,
    },
  ];

  if (props.slug === "admin") {
    options.push({
      name: "Delete",
      callFunc: simpleDelete,
    });
  }

  const columns = [
    {
      title: "Name",
      field: "contactPersonName",
    },
    {
      title: "Email",
      field: "Email",
    },
    {
      title: "Telephone Number",
      field: "telephoneNumber",
    },
    {
      title: "Department",
      field: "Department",
    },
    {
      title: "Job Title",
      field: "jobTitle",
    },
    {
      title: "Address",
      field: "Address",
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

  const handleChangePage = (event, newPage) => {
    const h = { ...supplier_contactState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...supplier_contactState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...supplier_contactState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _searchInData(h);
  };

  return (
    <React.Fragment>
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Contacts"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={contactList.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
          search: false,
        }}
        key={limit}
        components={{
          Pagination: () => {
            return (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={count}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            );
          },
        }}
        actions={[
          AM.includes(props.slug) && {
            icon: "add",
            tooltip: "Add Contact",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </React.Fragment>
  );
}