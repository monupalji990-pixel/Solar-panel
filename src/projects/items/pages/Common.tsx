import React from 'react';
import { Helmet } from 'react-helmet';
import ListItemSection from '../sections/itemList';
import AddItem from '../sections/addItem';
import EditItem from '../sections/editItem';

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
            { name: 'Items' },
        ]);
    }

    setEditDrawer(data) {
        this.setState({
            setDrawer: 'editItemDrawer',
            otherData: data
        });
    }

    setAddDrawer() {
        this.setState({
            setDrawer: 'addItemDrawer',
        });
    }

    closeDrawer() {
        this.setState({ setDrawer: null });
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>View Item</title>
                    <meta
                        name="description"
                        content="A Edan Power CRM Portal"
                    />
                </Helmet>

                <ListItemSection
                    {...this.props}
                    getUserTable={this.getUserTable}
                    tableRef={this.getUserTable}
                    filter={this.state.filter}
                    setAddDrawer={this.setAddDrawer.bind(this)}
                    setEditDrawer={this.setEditDrawer.bind(this)}
                />

                <AddItem
                    {...this.props}
                    getUserTable={this.getUserTable}
                    open={this.state.setDrawer}
                    onClose={this.closeDrawer.bind(this)}
                />
                <EditItem
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
