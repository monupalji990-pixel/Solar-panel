import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

export default function DeleteRequest(props) {
  // Viewing delete request of company on the dashboard
  useEffect(() => {
    props._loadingDataAction(false);
    props._slugUpdate(props);
    props._companyList();
  }, []);

  if (props.hideSideBar) {
    props.onClose();
    props._closeSideBar(false);
  }

  const columns = [
    {
      title: 'Company ID',
      field: 'companyID',
    },
    {
      title: 'Company',
      field: 'company',
    },
    {
      title: 'Site',
      field: 'site',
    },
    {
      title: 'Added On',
      field: 'createdAt',
    },
  ];

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
        title="Delete Company Request"
        isLoading={!props.remote}
        onSearchChange={e => searchInData(e)}
        data={props.companyList.map(e => ({...e }))}
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
