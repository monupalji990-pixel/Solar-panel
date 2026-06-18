import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import { leadAction, selectLeadState } from "../redux/lead";
import {
  LeadStatusNames,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";

export default function deleteTable(props) {
  const leadState = useSelector(selectLeadState);
  const {
    leads,
    count,
    limit,
    remote,
    page,
  } = { ...leadState };
  const dispatch = useDispatch();

  const _leadList = (payload) => dispatch(leadAction.List(payload));
  const _loadingDataAction = (payload) =>
    dispatch(leadAction.LoaderStart(payload));
  const _searchInData = (payload) => dispatch(leadAction.Search(payload));
  const _nextPage = (payload) => dispatch(leadAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(leadAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(leadAction.SlugUpdate(payload));
  const _basicAction = (payload) => dispatch(leadAction.BasicActions(payload));
  const _actionOnSelectData = (deleteIds, action) =>
    dispatch(leadAction.actionOnDeleteReq({ selectedData: deleteIds, action }));
  useEffect(() => {
    _loadingDataAction(false);
    _basicAction({
      filterData: {},
      leadCount: -1,
    });
    _slugUpdate(props);
    _leadList({ showingFrom: props.showingFrom });
  }, []);

  if (props.message) {
    _basicAction({ message: null });
  }

  const columns = [
    {
      title: "Lead ID",
      field: "lead",
    },
    {
      title: "Site",
      field: "site",
    },
    {
      title: "Type",
      field: "type",
    },
    {
      title: "Status",
      field: "status",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.status],
            backgroundColor: StatusCodeColor[rowData.status],
          }}
        >
          {LeadStatusNames[rowData.status]}
        </span>
      ),
    },
  ];

  columns.splice(
    1,
    0,
    helperMethods.columnCreator({
      title: "Company/Consumer",
      sorting: true,
      renderData: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: `${rowData.company ? "#193562" : "#22a6b3"}`,
            backgroundColor: `${rowData.company ? "rgba(25,53,98,.08)" : "rgba(34, 166, 179,.08)"
              }`,
          }}
        >
          {rowData.company} {rowData.Consumer}
        </span>
      ),
      headerStyle: { fontWeight: "bold" },
    })
  );

  const handleChangePage = (event, newPage) => {
    const h = { ...leadState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    const h = { ...leadState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _listLimit(h);
  };

  const searchInData = (event) => {
    const h = { ...leadState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _searchInData(h);
  };

  const ActionOnSelectedData = (data, action) => {
    const deleteIds = [];
    data.map((e) => deleteIds.push(e._id));
    _actionOnSelectData(deleteIds, action);
  };

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Delete Lead Request"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={leads.map((e) => ({ ...e }))}
        options={{
          pageSize: limit,
          search: false,
          selection: true,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
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
          {
            tooltip: "Reject All delete request",
            icon: "restore",
            onClick: (evt, data) => ActionOnSelectedData(data, "reject"),
          },
          {
            tooltip: "Accept All delete request",
            icon: "delete",
            onClick: (evt, data) => ActionOnSelectedData(data, "accept"),
          },
        ]}
      />
    </Grid>
  );
}
