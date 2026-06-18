import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import List from "../sections/List";
import Add from "../sections/add";
import View from "../sections/view";
import {
    campaignAction,
    campaignReducer,
    campaignSaga,
    selectCampaignState,
    sliceKeyCampaign,
} from "../redux/campaign"
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

export const ManageCampaign = (props: any) => {
    useInjectReducer({ key: sliceKeyCampaign, reducer: campaignReducer });
    useInjectSaga({ key: sliceKeyCampaign, saga: campaignSaga });

    const [setDrawer, setSetDrawer] = useState(null);
    const [filter, setFilter] = useState({});
    const [otherData, setOtherData] = useState({});
    const getUserTable = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        props.setBreadCrumbs([
            {
                name: "Dashboard",
                isClickable: true,
                url: `/dashboard/${props.slug}`,
            },
            { name: "Campaign" },
        ]);
    }, []);

    const campaignState = useSelector(selectCampaignState);

    const _closeSideBar = (payload) =>
        dispatch(campaignAction.CloseSideBar(payload));
    const _loadingDataAction = (payload) =>
        dispatch(campaignAction.LoaderStart(payload));
    const _list = (payload) => dispatch(campaignAction.List(payload));
    const _count = (payload) => dispatch(campaignAction.Count(payload));
    const _listLimit = (payload) => dispatch(campaignAction.ChangeLimit(payload));
    const _searchInData = (payload) => dispatch(campaignAction.Search(payload));
    const _nextPage = (payload) => dispatch(campaignAction.NewPage(payload));
    const _slugUpdate = (payload) => dispatch(campaignAction.SlugUpdate(payload));
    const _deleteCampaign = (payload) =>
        dispatch(campaignAction.delete(payload));
    const _basicAction = (payload) =>
        dispatch(campaignAction.BasicActions(payload));
    const _actionOnSelectData = (deleteIds, action) =>
        dispatch(
            campaignAction.actionOnDeleteReq({ selectedData: deleteIds, action })
        );
    const _add = (payload) => dispatch(campaignAction.addCampaign(payload));
    const _setIsLoadingData = (payload) =>
        dispatch(campaignAction.setIsLoadingData(payload));
    const _viewSingle = (payload) =>
        dispatch(campaignAction.viewCampaign(payload));
    const _edit = (payload) =>
        dispatch(campaignAction.editCampaign(payload));
    const _sendRequest = (payload) =>
        dispatch(campaignAction.sendRequest(payload));
    const _isActionDone = (payload) =>
        dispatch(campaignAction.IsActionDone(payload));
    const _filterData = (payload) => dispatch(campaignAction.FilterData(payload));
    const _tableSort = (payload) => dispatch(campaignAction.tableSort(payload));

    function closeDrawer() {
        setSetDrawer(null);
    }

    function setAddDrawer() {
        _closeSideBar(false);
        setSetDrawer("addCampaignDrawer");
    }
    function setEditDrawer(data) {
        setSetDrawer("manageCampaignDrawer");
        setOtherData(data);
    }

    function setFilterDrawer() {
        _closeSideBar(false);
        setSetDrawer("filterDrawer");
    }

    return (
        <>
            <Helmet>
                <title>
                    View Campaign
                </title>
                <meta name="description" content="A Edan Power CRM Portal" />
            </Helmet>

            <>
                <List
                    {...props}
                    getUserTable={getUserTable}
                    tableRef={getUserTable}
                    filter={filter}
                    setAddDrawer={setAddDrawer}
                    setEditDrawer={setEditDrawer}
                    onClose={closeDrawer}
                    setFilterDrawer={setFilterDrawer}
                    _closeSideBar={_closeSideBar}
                    list={campaignState.campaigns}
                    totalcount={campaignState.totalCount}
                    count={campaignState.count}
                    limit={campaignState.limit}
                    remote={campaignState.remote}
                    page={campaignState.page}
                    message={campaignState.message}
                    hideSideBar={campaignState.hideSideBar}
                    sort={campaignState.sort}
                    sortType={campaignState.sortType}
                    _loadingDataAction={_loadingDataAction}
                    _list={_list}
                    _count={_count}
                    _listLimit={_listLimit}
                    _searchInData={_searchInData}
                    _nextPage={_nextPage}
                    _slugUpdate={_slugUpdate}
                    _deleteCampaign={_deleteCampaign}
                    _basicAction={_basicAction}
                    _actionOnSelectData={_actionOnSelectData}
                    _tableSort={_tableSort}
                    _filterData={_filterData}
                />
            </>

            <View
                {...props}
                getUserTable={getUserTable}
                open={setDrawer}
                data={otherData}
                onClose={closeDrawer}
                isLoadingData={campaignState.isLoadingData}
                message={campaignState.message}
                currentCampaign={campaignState.currentCampaign}
                _isLoadingData={_setIsLoadingData}
                _closeSideBar={_closeSideBar}
                _viewSingle={_viewSingle}
                _edit={_edit}
                _slugUpdate={_slugUpdate}
                _sendRequest={_sendRequest}
                isActionDone={campaignState.isActionDone}
                _isActionDone={_isActionDone}
            />

            <Add
                {...props}
                open={setDrawer}
                getUserTable={getUserTable}
                onClose={closeDrawer}
                role={campaignState.role}
                _closeSideBar={_closeSideBar}
                _add={_add}
                _slugUpdate={_slugUpdate}
                currentCampaign={campaignState.currentCampaign}
                campaignState={campaignState}
            />
        </>
    );
};
