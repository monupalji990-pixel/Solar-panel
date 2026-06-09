import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { supplierAction } from '../redux/supplier';
import SupplierList from '../sections/supplierList';
import AddSupplier from '../sections/addSupplier'
import EditSupplier from '../sections/viewSupplier';
import AddFilter from '../component/setFilter';
import MyDrawerLeft from '../../../sharedUtils/sharedComponents/drawerHelperLeft';

export const Common = (props: any) => {
    const [drawerIs, setDrawerIs] = useState(null);
    const [setDrawer, setSetDrawer] = useState(null);
    const [filter, setFilter] = useState({});
    const [otherData, setOtherData] = useState({});
    const getUserTable = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const { setBreadCrumbs, slug } = props;
        setBreadCrumbs([
            {
                name: 'Dashboard',
                isClickable: true,
                url: `/dashboard/${slug}`,
            },
            { name: 'Supplier' },
        ]);
    }, [])

    const _loadingDataAction = payload => dispatch(supplierAction.supplierLoaderStart(payload));
    const _closeSideBar = (payload) => dispatch(supplierAction.supplierCloseSideBar(payload));
    const _filterData = payload => dispatch(supplierAction.filterData(payload));
    const _supplierList = payload => dispatch(supplierAction.supplierList(payload));


    function setEditDrawer(data) {
        setSetDrawer('manageSupplierDrawer')
        setOtherData(data);
    }
    function setAddDrawer() {
        _closeSideBar(false)
        setSetDrawer('addSupplierDrawer');
    }

    function closeFilter() {
        setDrawerIs(null);
    }

    function setFilterDrawer() {
        setDrawerIs('supplierFilterDrawer')
    }

    function closeDrawer() {
        setSetDrawer(null);
    }

    return (
        <Suspense fallback={<></>}>
            <Helmet>
                <title>View Supplier</title>
                <meta
                    name="description"
                    content="A Edan Power CRM Portal"
                />
            </Helmet>
            <SupplierList
                {...props}
                getUserTable={getUserTable}
                tableRef={getUserTable}
                filter={filter}
                setAddDrawer={setAddDrawer}
                setEditDrawer={setEditDrawer}
                onClose={closeDrawer}
                setFilterDrawer={setFilterDrawer}
                _closeSideBar={_closeSideBar}
            />
            <EditSupplier
                {...props}
                getUserTable={getUserTable}
                open={setDrawer}
                supplier={otherData}
                onClose={closeDrawer}
            />
            <AddSupplier
                {...props}
                open={setDrawer}
                getUserTable={getUserTable}
                onClose={closeDrawer}
            />

            <AddFilter
                {...props}
                filter={filter}
                getUserTable={getUserTable}
                onClose={closeFilter}
                open={drawerIs}
                _filterData={_filterData}
                _loadingDataAction={_loadingDataAction}
            />
            {drawerIs}
        </Suspense>
    );
}
