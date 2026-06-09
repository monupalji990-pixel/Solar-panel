import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import ListUserSection from '../sections/userList';
import AddUser from '../sections/addUser';
import EditUser from '../sections/editUser';
import DeleteTable from '../sections/deleteTable';
import ChangePassword from '../sections/changePassword';
import AddFilter from '../component/setFilter';
import MyDrawerLeft from '../../../sharedUtils/sharedComponents/drawerHelperLeft';

export class Common extends React.Component<any, any> {
    private getUserTable: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.state = {
            drawerIs: null,
            filter: {},
            setDrawer: null,
            otherData: {}
        };
        this.getUserTable = React.createRef();
    }

    componentWillMount() {
        const { setBreadCrumbs, slug } = this.props
        setBreadCrumbs([
            {
                name: 'Dashboard',
                isClickable: true,
                url: `/dashboard/${slug}`,
            },
            { name: 'User' },
        ]);
    }

    setEditDrawer(data) {
        this.setState({
            setDrawer: 'manageUserDrawer',
            otherData: data
        });
    }

    setChangePasswordDrawer(data) {
        this.setState({
            setDrawer: 'changePassDrawer',
            otherData: data
        });
    }
    setAddDrawer() {
        this.setState({
            setDrawer: 'addUserDrawer',
        });
    }
    setFilterDrawer() {
        this.setState({
            drawerIs: (
                <Suspense fallback={<>Loading...</>}>
                    <MyDrawerLeft open={true} onClose={this.closeFilter.bind(this)}>
                        <AddFilter
                            {...this.props}
                            filter={this.state.filter}
                            getUserTable={this.getUserTable}
                            onClose={this.closeFilter.bind(this)}
                        />
                    </MyDrawerLeft>
                </Suspense>
            ),
        });
    }
    closeDrawer() {
        this.setState({ setDrawer: null });
    }
    closeFilter() {
        this.setState({ drawerIs: null });
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>View User</title>
                    <meta
                        name="description"
                        content="A Edan Power CRM Portal"
                    />
                </Helmet>
                {this.props.OnlyDeleteData !== undefined &&
                    this.props.OnlyDeleteData ?
                    <>
                        <DeleteTable
                            {...this.props}
                            getUserTable={this.getUserTable}
                            tableRef={this.getUserTable}
                            filter={this.state.filter}
                            setAddDrawer={this.setAddDrawer.bind(this)}
                            setEditDrawer={this.setEditDrawer.bind(this)}
                        />
                    </> :
                    <>
                        <ListUserSection
                            {...this.props}
                            getUserTable={this.getUserTable}
                            tableRef={this.getUserTable}
                            filter={this.state.filter}
                            setAddDrawer={this.setAddDrawer.bind(this)}
                            setEditDrawer={this.setEditDrawer.bind(this)}
                            setFilterDrawer={this.setFilterDrawer.bind(this)}
                        />
                    </>
                }
                <AddUser
                    {...this.props}
                    getUserTable={this.getUserTable}
                    open={this.state.setDrawer}
                    onClose={this.closeDrawer.bind(this)}
                />
                <EditUser
                    {...this.props}
                    getUserTable={this.getUserTable}
                    open={this.state.setDrawer}
                    user={this.state.otherData}
                    onClose={this.closeDrawer.bind(this)}
                />
                <ChangePassword
                    {...this.props}
                    getUserTable={this.getUserTable}
                    open={this.state.setDrawer}
                    user={this.state.otherData}
                    onClose={this.closeDrawer.bind(this)}
                />
                {this.state.drawerIs}
            </React.Fragment>
        );
    }
}
