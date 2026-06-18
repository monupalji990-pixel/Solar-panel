import React, { useEffect, Suspense } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import RefreshIcon from "@material-ui/icons/Refresh";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import OptionMenu from "../../../sharedUtils/sharedComponents/optionMenu";

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

export default function AssigneeList(props) {
  const classes = useStyles();

  const IsCallCompany =
    props.showingFrom && props.showingFrom === "viewCompany";
  const IsCallConsumer =
    props.showingFrom && props.showingFrom === "viewConsumer";

  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate({
      slug: props.slug,
      companyId: props.company !== undefined ? props.company._id : "",
      consumerID: props.consumer !== undefined ? props.consumer._id : "",
    });
    if (IsCallCompany) props._companyAssigneeList({ showingFrom: props.showingFrom });
    if (IsCallConsumer) props._consumerAssigneeList({ showingFrom: props.showingFrom });
  }, []);

  const filterHtml = [];

  const removeAssignee = (data) => {
    const so: any = {
      RemoveID: data._id,
    };
    if (IsCallCompany) so.CompanyID = props.currentCompany._id;
    if (IsCallConsumer) so.Consumer = props.currentConsumer._id;
    props._loadingDataAction(false);
    props._removeAssignee(so);
  };

  const columns = [
    {
      title: "Name",
      field: "name",
      customSort: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Role",
      field: "role",
    },

    {
      width: "2%",
      cellStyle: { width: "2%" },
      headerStyle: { width: "2%" },
      sorting: false,
      render: (rowData) => (
        <Tooltip title="Remove">
          <IconButton
            className={classes.DeleteActionBtn}
            aria-label="delete"
            onClick={() => removeAssignee(rowData)}
          >
            <DeleteIcon className={classes.IconSize} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._searchInData(h);
  };

  const RefreshList = () => {
    props._loadingDataAction(false);
    if (IsCallCompany) props._companyAssigneeList({ showingFrom: props.showingFrom });
    if (IsCallConsumer) props._consumerAssigneeList({ showingFrom: props.showingFrom });
  };

  let col: any = columns.find((col) => {
    return col.field === props.sort;
  });

  if (col) col.defaultSort = props.sortType;

  return (
    <React.Fragment>
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Assignee"
        isLoading={!props.remote}
        onSearchChange={(e) => searchInData(e)}
        data={props.assigneeList.map((e) => ({ ...e }))}
        options={{
          pageSize: props.limit,
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
        key={props.limit}
        components={{
          Pagination: () => {
            const { count, limit, page } = props;
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
          {
            icon: () => <RefreshIcon />,
            tooltip: "Refresh",
            isFreeAction: true,
            onClick: () => RefreshList(),
          },
          {
            icon: "add",
            tooltip: "Add Assignee",
            isFreeAction: true,
            onClick: props.setAddDrawer,
          },
        ]}
      />
    </React.Fragment>
  );
}
