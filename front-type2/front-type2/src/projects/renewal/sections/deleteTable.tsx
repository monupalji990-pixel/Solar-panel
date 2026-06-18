import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import Grid from "@material-ui/core/Grid";
import {
  RenewalStatusNames,
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import { renewalAction, selectRenewalState } from "../Redux/renewal";

export default function DeleteRequest(props) {
  const renewalState = useSelector(selectRenewalState);

  const { renewals, count, limit, remote, page, hideSideBar, renewalCount } = {
    ...renewalState,
  };
  const dispatch = useDispatch();

  const _renewalList = (payload) => dispatch(renewalAction.List(payload));
  const _renewalCount = (payload) => dispatch(renewalAction.Count(payload));
  const _loadingDataAction = (payload) =>
    dispatch(renewalAction.setIsLoadingData(payload));
  const _searchInData = (payload) => dispatch(renewalAction.Search(payload));
  const _nextPage = (payload) => dispatch(renewalAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(renewalAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(renewalAction.SlugUpdate(payload));
  const _deleteRenewal = (payload) =>
    dispatch(renewalAction.renewalDelete(payload));
  const _basicAction = (payload) =>
    dispatch(renewalAction.BasicAction(payload));
  const _actionOnSelectData = (payload) =>
    dispatch(renewalAction.ActionOnDelete(payload));

  useEffect(() => {
    _slugUpdate(props);
    _renewalList(null);
  }, []);

  const columns = [
    {
      title: "Renewal ID",
      field: "renewalID",
    },
    {
      title: "Status",
      field: "quoteStatus",
      render: (rowData) => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.quoteStatus],
            backgroundColor: StatusCodeColor[rowData.quoteStatus],
          }}
        >
          {RenewalStatusNames[rowData.quoteStatus]}
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
            backgroundColor: `${
              rowData.company ? "rgba(25,53,98,.08)" : "rgba(34, 166, 179,.08)"
            }`,
          }}
        >
          {rowData.company} {rowData.consumer}
        </span>
      ),
      headerStyle: { fontWeight: "bold" },
    })
  );

  const handleChangePage = (event, newPage) => {
    let h = { ...renewalState };
    h.page = newPage + 1;
    _loadingDataAction(false);
    _nextPage(h);
  };

  const handleChangeRowsPerPage = (event) => {
    let h = { ...renewalState };
    h.limit = event.target.value;
    _loadingDataAction(false);
    _listLimit(h);
  };

  const searchInData = (event) => {
    let h = { ...renewalState };
    h.searchText = encodeURIComponent(event);
    _loadingDataAction(false);
    _searchInData(h);
  };

  const ActionOnSelectedData = (obj) => {
    const deleteIds = [];
    obj.data.map((e) => deleteIds.push(e._id));
    _actionOnSelectData({ selectedData: deleteIds, action: obj.action });
  };

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Delete Renewal Request"
        isLoading={!remote}
        onSearchChange={(e) => searchInData(e)}
        data={renewals.map((e) => ({ ...e }))}
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
            onClick: (evt, data) =>
              ActionOnSelectedData({ data, action: "reject" }),
          },
          {
            tooltip: "Accept All delete request",
            icon: "delete",
            onClick: (evt, data) =>
              ActionOnSelectedData({ data, action: "accept" }),
          },
        ]}
      />
    </Grid>
  );
}
