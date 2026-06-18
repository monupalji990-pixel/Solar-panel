import React, { Suspense } from 'react';
import HistoryList from '../sections/historyList';

export class Common extends React.Component<any, any>{

    private getUserTable: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.state = {
            drawerIs: null,
        };
        this.getUserTable = React.createRef();
    }

    closeDrawer() {
        this.setState({ drawerIs: null });
    }

    render() {
        return (
            <>
                <HistoryList
                    {...this.props}
                    getUserTable={this.getUserTable}
                    tableRef={this.getUserTable}
                    onClose={this.closeDrawer.bind(this)}
                />
                {this.state.drawerIs}
            </>
        );
    }
}