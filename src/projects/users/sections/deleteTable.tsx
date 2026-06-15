import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { useDispatch, useSelector } from 'react-redux';
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import { UserRole, StatusCodeColor } from '../../../sharedUtils/globalHelper/status';
import { selectUsersState, userAdminAction } from '../redux/userAdmin';

export default function DeleteUsers(props) {
    const userState = { ...useSelector(selectUsersState) };

    const dispatch = useDispatch();

    const _userListByAdmin = payload => dispatch(userAdminAction.userList(payload));
    const _loadingDataAction = payload => dispatch(userAdminAction.userLoaderStart(payload));
    const _nextPage = payload => dispatch(userAdminAction.userNewPage(payload));
    const _listLimit = payload => dispatch(userAdminAction.userChangeLimit(payload));
    const _slugUpdate = payload => dispatch(userAdminAction.userSlugUpdate(payload));
    const _basicAction = payload => dispatch(userAdminAction.userBasicActions(payload));
    const _actionOnSelectData = (deleteIds, action) => dispatch(userAdminAction.actionOnDeleteReq({ selectedData: deleteIds, action: action }));

    useEffect(() => {
        _loadingDataAction(false);
        _slugUpdate(props);
        _userListByAdmin(null);
    }, []);

    if (props.message) {
        _basicAction({ message: null });
    }

    const columns = [
        {
            title: 'Name',
            field: 'name',
        },
        {
            title: 'Email',
            field: 'email',
        },
        {
            title: 'Role',
            field: 'role',
            render: rowData => <span className="StatusChip" style={{ backgroundColor: StatusCodeColor[rowData.role] }}>{UserRole[rowData.role]}</span>
        }
    ];

    const handleChangePage = (event, newPage) => {
        const h = { ...userState };
        h.page = newPage + 1;
        _loadingDataAction(false);
        _nextPage(h);
    };

    const handleChangeRowsPerPage = event => {
        const h = { ...userState };
        h.limit = event.target.value;
        _loadingDataAction(false);
        _listLimit(h);
    };

    return (
        <Grid item md={12} xs={12} className="TableScrolling">
            <MaterialTable
                columns={columns}
                tableRef={props.tableRef}
                title="Delete User Request"
                isLoading={!userState.remote}
                data={userState.users.map(e => ({ ...e }))}
                options={{
                    pageSize: userState.limit,
                    search: false,
                    emptyRowsWhenPaging: false,
                    exportButton: false,
                    filtering: false,
                    doubleHorizontalScroll: true
                }}
                key={userState.limit}
                components={{
                    Pagination: () => {
                        return (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={userState.count}
                                rowsPerPage={userState.limit}
                                page={userState.page - 1}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        );
                    },
                }}
            />
        </Grid>
    );
}