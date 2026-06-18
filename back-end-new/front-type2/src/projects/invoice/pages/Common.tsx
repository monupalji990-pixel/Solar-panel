import React from 'react';
import { Helmet } from 'react-helmet';
import ListInvoiceSection from '../sections/invoiceList';
import AddInvoice from '../sections/addInvoice';
import EditInvoice from '../sections/editInvoice';

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
            { name: 'Invoice' },
        ]);
    }

    setEditDrawer(data) {
        this.setState({
            setDrawer: 'editInvoiceDrawer',
            otherData: data
        });
    }

    setAddDrawer() {
        this.setState({
            setDrawer: 'addInvoiceDrawer',
        });
    }

    closeDrawer() {
        this.setState({ setDrawer: null });
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>View Invoice</title>
                    <meta
                        name="description"
                        content="A Edan Power CRM Portal"
                    />
                </Helmet>

                <ListInvoiceSection
                    {...this.props}
                    getUserTable={this.getUserTable}
                    tableRef={this.getUserTable}
                    filter={this.state.filter}
                    setAddDrawer={this.setAddDrawer.bind(this)}
                    setEditDrawer={this.setEditDrawer.bind(this)}
                />

                <AddInvoice
                    {...this.props}
                    getUserTable={this.getUserTable}
                    open={this.state.setDrawer}
                    onClose={this.closeDrawer.bind(this)}
                />
                <EditInvoice
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
