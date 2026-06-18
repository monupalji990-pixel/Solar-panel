import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import RefreshIcon from "@material-ui/icons/Refresh";
import { contactAction, selectContactState } from "../redux/contact";
import { selectCompanyState } from "projects/company/redux/company";
import { IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";

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
}));

export default function ContactList(props) {
  const contactState = useSelector(selectContactState);
  const {
    contactList,
    count,
    limit,
    remote,
    page,
    hideSideBar,
    sort,
    sortType,
  } = contactState;
  const companyState = useSelector(selectCompanyState);

  const dispatch = useDispatch();
  const classes = useStyles();

  const _contactList = (payload) => dispatch(contactAction.List(payload));
  const _closeSideBar = (payload) =>
    dispatch(contactAction.CloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(contactAction.LoaderAction(payload));
  const _searchInData = (payload) => dispatch(contactAction.Search(payload));
  const _nextPage = (payload) => dispatch(contactAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(contactAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(contactAction.SlugUpdate(payload));
  const _tableSort = (payload) => dispatch(contactAction.tableSort(payload));
  const _deleteContact = (payload) =>
    dispatch(contactAction.DeleteContact(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate({
      slug: props.slug,
      companyId: props.company !== undefined ? props.company._id : "",
    });
    _contactList(null);
  }, []);

  const deleteConfirmation = (data) => {
    if (confirm("Are you sure you want to delete?")) {
      _loadingDataAction(false);
      if (companyState.currentCompany)
        _deleteContact({
          id: data._id,
          companyId: companyState.currentCompany._id,
        });
    }
  };

  if (hideSideBar) {
    props.onCloseChild();
    _closeSideBar(false);
  }

  const updateEmail = (email) => {
    const input = email.contactEmail;
    const x = input.replace(/\+[0-9]+/g, "");
    return x;
  }

  const columns = [
    {
      title: "Name",
      field: "contactName",
      customSort: (a, b) => a.contactName.length - b.contactName.length,
    },
    {
      title: "Office Number",
      field: "contactOffice",
    },
    {
      title: "Mobile",
      field: "contactMobile",
    },
    {
      title: "Email",
      field: "contactEmail",
      render: (email) => updateEmail(email)
    },
    {
      title: "Job Title",
      field: "jobTitle",
    },
    {
      title: "DOB",
      field: "DOB",
    },
    {
      title: "National Insurance",
      field: "nationalInsurance",
    },
    {
      title: "Home Address",
      field: "homeAddress",
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
    const h = { ...contactState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...contactState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...contactState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _searchInData(h);
  };

  const RefreshList = () => {
    _loadingDataAction(false);
    _contactList(null);
  };

  const tableAction: any = [
    {
      icon: () => <RefreshIcon />,
      tooltip: "Refresh",
      isFreeAction: true,
      onClick: () => RefreshList(),
    },
  ];

  if (["admin", "management", "partner", "sales_rep"].includes(props.slug)) {
    tableAction.push({
      icon: "add",
      tooltip: "Add Contact",
      isFreeAction: true,
      onClick: props.setAddDrawer,
    });
  }

  let col: any = columns.find((col) => {
    return col.field === sort;
  });

  if (col) col.defaultSort = sortType;

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
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
        actions={!props.removeActions && tableAction}
      />
    </Grid>
  );
}
