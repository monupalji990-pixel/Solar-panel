import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import {
  TaskValueToStatus,
  StatusCodeColor,
  StatusFontCodeColor,
} from '../../../sharedUtils/globalHelper/status';
import { helperMethods } from '../../../sharedUtils/globalHelper/helperMethod';

export default function DeleteRequest(props) {
  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._taskList();
  }, []);

  if (props.message) {
    props._basicAction({ message: null });
  }

  const handleChangePage = (event, newPage) => {
    const h = { ...props };
    h.page = newPage + 1;
    props._loadingDataAction(false);
    props._nextPage(h);
  };

  const handleChangeRowsPerPage = event => {
    const h = { ...props };
    h.limit = event.target.value;
    props._loadingDataAction(false);
    props._listLimit(h);
  };

  const searchInData = event => {
    const h = { ...props };
    h.searchText = encodeURIComponent(event);
    props._loadingDataAction(false);
    props._searchInData(h);
  };

  const columns = [
    {
      title: 'Title',
      field: 'title',
    },
    {
      title: 'Status',
      field: 'taskStatus',
      render: rowData => (
        <span
          className="StatusChip"
          style={{
            color: StatusFontCodeColor[rowData.status],
            backgroundColor: StatusCodeColor[rowData.taskStatus],
          }}
        >
          {TaskValueToStatus[rowData.taskStatus]}
        </span>
      ),
    },
  ];

  columns.splice(
    1,
    0,
    helperMethods.columnCreator({
      title: 'Company/Consumer',
      sorting: true,
      renderData: rowData => (
        <span
          className="StatusChip"
          style={{
            color: `${rowData.company ? '#193562' : '#22a6b3'}`,
            backgroundColor: `${rowData.company ? 'rgba(25,53,98,.08)' : 'rgba(34, 166, 179,.08)'
              }`,
          }}
        >
          {rowData.company} {rowData.Consumer}
        </span>
      ),
      headerStyle: { fontWeight: 'bold' },
    }),
  );

  const ActionOnSelectedData = (data, action) => {
    const deleteIds = [];
    data.map(e => deleteIds.push(e._id));
    props._actionOnSelectData(deleteIds, action);
  };

  return (
    <Grid item md={12} xs={12} className="TableScrolling">
      <MaterialTable
        columns={columns}
        tableRef={props.tableRef}
        title="Delete Task Request"
        isLoading={!props.remote}
        onSearchChange={e => searchInData(e)}
        data={props.taskList.map(e => ({ ...e }))}
        options={{
          pageSize: props.limit,
          search: false,
          selection: true,
          emptyRowsWhenPaging: false,
          exportButton: false,
          filtering: false,
        }}
        key={props.limit}
        components={{
          Pagination: () => {
            return (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                count={props.count}
                rowsPerPage={props.limit}
                page={props.page - 1}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            );
          },
        }}
        actions={[
          {
            tooltip: 'Reject All delete request',
            icon: 'restore',
            onClick: (evt, data) => ActionOnSelectedData(data, 'reject'),
          },
          {
            tooltip: 'Accept All delete request',
            icon: 'delete',
            onClick: (evt, data) => ActionOnSelectedData(data, 'accept'),
          },
        ]}
      />
    </Grid>
  );
}
