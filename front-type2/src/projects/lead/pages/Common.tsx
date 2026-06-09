import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import {
  leadAction,
  leadReducer,
  leadSaga,
  selectLeadState,
  sliceKeyLead,
} from "../redux/lead";
import { quoteAction, selectQuoteState } from "../../quote/redux/quote";
import {
  globalConfigActions,
  selectGlobalConfig,
} from "../../../sharedUtils/sharedRedux/configuration";
import DeleteTable from "../sections/deleteTable";
import LeadList from "../sections/leadList";
import AddLead from "../sections/addLead";
import AddSalesRepAssignee from "../components/salesAssignee";
import ViewLead from "../sections/viewLead";
import AddFilter from "../components/setFilter";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  assigneeAction,
  selectAssigneeState,
} from "../../assignee/redux/assignee";

export const Common = (props: any) => {
  useInjectReducer({ key: sliceKeyLead, reducer: leadReducer });
  useInjectSaga({ key: sliceKeyLead, saga: leadSaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const [showSearch, setSearchResult] = useState(0);
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  const leadState = useSelector(selectLeadState);
  const globalState = useSelector(selectGlobalConfig);
  const quoteState = useSelector(selectQuoteState);
  const assigneeState = useSelector(selectAssigneeState);

  const _supplierListForDropdown = (payload) => {
    dispatch(quoteAction.dropDownSupplierList(payload));
  };
  const _slugUpdateQuote = (payload) =>
    dispatch(quoteAction.SlugUpdate(payload));

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Lead" },
    ]);
    _slugUpdateQuote(props);
    _supplierListForDropdown(null);
  }, []);

  const _updateTotalFloorState = (payload) =>
    dispatch(leadAction.updateTotalFloorState(payload));
  const _closeSideBar = (payload) => dispatch(leadAction.CloseSideBar(payload));
  const _filterData = (payload) => dispatch(leadAction.FilterData(payload));
  const _companyListForDropdown = (payload) =>
    dispatch(leadAction.CompanyListData(payload));
  const _consumerDropList = (payload) =>
    dispatch(leadAction.ConsumerList(payload));
  const _singleCompanyDetailWithSite = (payload) => {
    dispatch(globalConfigActions.singleCompanyDetailWithSite(payload));
  };
  const _assigneeList = (payload) => dispatch(assigneeAction.list(payload));
  const _assigneeListInstaller = (payload) =>
    dispatch(assigneeAction.listInstaller(payload));
  const _assigneeListSurveyor = (payload) =>
    dispatch(assigneeAction.listSurveyor(payload));

  const _basicAction = (payload) => dispatch(leadAction.BasicActions(payload));
  const _leadDetail = (payload) => dispatch(leadAction.singleLead(payload));
  const _leadUpdate = (payload) =>
    dispatch(leadAction.singleLeadUpdate(payload));
  const _isLoadingData = (payload) =>
    dispatch(leadAction.LoaderAction(payload));
  const _addLead = (payload) => dispatch(leadAction.addLead(payload));
  const _sendRequest = (payload) => dispatch(leadAction.sendRequest(payload));
  const _addNotes = (payload) => dispatch(leadAction.AddNotes(payload));
  const _soldService = (payload) => {
    dispatch(leadAction.SoldServices(payload));
  };
  const _saveServiceData = (payload) => {
    dispatch(leadAction.SaveServiceData(payload));
  };
  const _loadingDataAction = (payload) =>
    dispatch(leadAction.LoaderStart(payload));
  const _addSalesRepAssignee = (payload) =>
    dispatch(leadAction.AddSalesRepAsAssignee(payload));
  const _salesRepList = (payload) => dispatch(leadAction.SalesRepList(payload));
  const _pointerChange = (payload) =>
    dispatch(leadAction.leadPointerChange(payload));
  const _partnerList = () => {
    dispatch(leadAction.PartnerList(null));
  };

  function setAddDrawer() {
    _closeSideBar(false);
    setSetDrawer("addLeadDrawer");
  }

  function viewLeadDetail(data) {
    setSetDrawer("manageLeadDrawer");
    setOtherData(data);
  }

  function closeFilter() {
    setDrawerIs(null);
    setSearchResult(0);
  }

  function setShowSearch(count) {
    setSearchResult(count);
  }

  function setFilterDrawer() {
    setDrawerIs(
      <Suspense fallback={<>Loading...</>}>
        <MyDrawerLeft open={true} onClose={closeFilter.bind(this)}>
          <AddFilter
            {...props}
            filter={filter}
            getUserTable={getUserTable}
            onClose={closeFilter}
            partnerListForDropdown={leadState.partnerListForDropdown}
            filterData={leadState.filterData}
            _loadingDataAction={_loadingDataAction}
            _filterData={_filterData}
            _partnerList={_partnerList}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  function addSalesRepAssignee(data) {
    setDrawerIs(
      <Suspense fallback={<>Loading...</>}>
        <MyDrawerLeft open onClose={closeDrawer}>
          <AddSalesRepAssignee
            {...props}
            leadIds={data}
            filter={filter}
            getUserTable={getUserTable}
            onClose={closeDrawer}
            setShowSearch={setShowSearch}
            _loadingDataAction={_loadingDataAction}
            _addSalesRepAssignee={_addSalesRepAssignee}
            _salesRepList={_salesRepList}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  function closeDrawer() {
    setSetDrawer(null);
    setDrawerIs(null);
    let data = { ...leadState.totalFloorState };
    data.preRating = undefined;
    data.postRating = undefined;
    data.absValue = 0;
    data.area = [];
    _updateTotalFloorState(data);
  }

  return (
    <>
      <Helmet>
        <title>View Lead</title>
        <meta name="description" content="A Edan Power CRM" />
      </Helmet>

      {props.OnlyDeleteData !== undefined && props.OnlyDeleteData ? (
        <DeleteTable
          {...props}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          filter={filter}
        />
      ) : (
        <LeadList
          {...props}
          isFrom={props.isFrom}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          filter={filter}
          setAddDrawer={setAddDrawer}
          viewLeadDetail={viewLeadDetail}
          setFilterDrawer={setFilterDrawer}
          addSalesRepAssignee={addSalesRepAssignee}
          onClose={closeDrawer}
          filterData={leadState.filterData}
          _pointerChange={_pointerChange}
          _leadUpdate={_leadUpdate}
        />
      )}
      <AddLead
        {...props}
        showingFrom={props.showingFrom}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        hideSideBar={leadState.hideSideBar}
        companies={leadState.companies}
        searchText={leadState.searchText}
        selectedCompanyWithSite={globalState.selectedCompanyWithSite}
        consumersDrop={leadState.consumers}
        _loadingDataAction={_loadingDataAction}
        _addLead={_addLead}
        _closeSideBar={_closeSideBar}
        _companyListForDropdown={_companyListForDropdown}
        _consumerDropList={_consumerDropList}
        _singleCompanyDetailWithSite={_singleCompanyDetailWithSite}
        _basicAction={_basicAction}
        assigneeState={assigneeState}
        _assigneeList={_assigneeList}
        _assigneeListInstaller={_assigneeListInstaller}
        _assigneeListSurveyor={_assigneeListSurveyor}
      />
      <ViewLead
        {...props}
        showingFrom={props.showingFrom}
        getUserTable={getUserTable}
        lead={otherData}
        open={setDrawer}
        onClose={closeDrawer}
        hideSideBar={leadState.hideSideBar}
        leadPointer={leadState.leadPointer}
        singleLead={leadState.singleLead}
        isLoading={leadState.isLoading}
        leadList={leadState.leads}
        suppliers={quoteState.suppliers}
        _closeSideBar={_closeSideBar}
        _leadDetail={_leadDetail}
        _leadUpdate={_leadUpdate}
        _isLoadingData={_isLoadingData}
        _sendRequest={_sendRequest}
        _addNotes={_addNotes}
        _soldService={_soldService}
        _saveServiceData={_saveServiceData}
        _pointerChange={_pointerChange}
        viewLeadDetail={viewLeadDetail}
      />
      {drawerIs}
    </>
  );
};
