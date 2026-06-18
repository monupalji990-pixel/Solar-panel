import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import List from "../sections/quoteList";
import AddQuoteTemp from "../sections/addQuoteTemp";
import AddQuote from "../sections/addQuote";
import AddPayments from "../component/addPayments"
import ViewQuote from "../sections/viewQuote";
import AddFilter from "../component/setFilter";
import DeleteTable from "../sections/deleteTable";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { quoteAction, selectQuoteState } from "../redux/quote";
import {
  globalConfigActions,
  selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import { renewalAction } from "projects/renewal/Redux/renewal";
import { selectCompanyState } from "projects/company/redux/company";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  docusignAction,
  sliceKeyDocusign,
  docusignSaga,
  docusignReducer,
} from "../../docusign/redux/docusign";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const [setPaymentDrawer, setSetPaymentDrawer] = useState(null);
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  useInjectReducer({ key: sliceKeyDocusign, reducer: docusignReducer });
  useInjectSaga({ key: sliceKeyDocusign, saga: docusignSaga });

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: props.type === "quote" ? "Quote" : "Renewal" },
    ]);
  }, []);

  const quoteState = useSelector(selectQuoteState);
  const globalconfig = useSelector(selectGlobalConfig);
  const companyState = useSelector(selectCompanyState);

  const _closeSideBar = (payload) =>
    dispatch(quoteAction.CloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(quoteAction.LoaderStart(payload));
  const _quoteList = (payload) => dispatch(quoteAction.List(payload));
  const _quoteCount = (payload) => dispatch(quoteAction.Count(payload));
  const _listLimit = (payload) => dispatch(quoteAction.ChangeLimit(payload));
  const _searchInData = (payload) => dispatch(quoteAction.Search(payload));
  const _nextPage = (payload) => dispatch(quoteAction.NewPage(payload));
  const _slugUpdate = (payload) => dispatch(quoteAction.SlugUpdate(payload));
  const _deleteQuote = (payload) => dispatch(quoteAction.deleteQuote(payload));
  const _basicAction = (payload) => dispatch(quoteAction.BasicActions(payload));
  const _getPriceList = (payload) => dispatch(quoteAction.supplierPriceList(payload));
  const _actionOnSelectData = (deleteIds, action) =>
    dispatch(
      quoteAction.actionOnDeleteReq({ selectedData: deleteIds, action })
    );

  const _companyListForDropdown = (payload) =>
    dispatch(quoteAction.dropDownCompanyList(payload));
  const _consumerDropList = (payload) =>
    dispatch(globalConfigActions.consumerDropDownListReq(payload));
  const _leadListForDropdown = (payload) =>
    dispatch(quoteAction.dropDownLeadList(payload));
  const _supplierListForDropdown = (payload) => {
    dispatch(quoteAction.dropDownSupplierList(payload));
  };

  const _addQuote = (payload) => dispatch(quoteAction.addQuote(payload));
  const _addQuotePayment = (payload) => dispatch(quoteAction.addQuotePayment(payload));
  const _DeleteDeptPayment = (payload) => dispatch(quoteAction.deleteDebtPayment(payload))

  const _singleLeadDetailWithSite = (payload) =>
    dispatch(globalConfigActions.singleLeadDetailWithSite(payload));

  const _editQuote = (payload, type) => {
    if (type === "quote") {
      dispatch(quoteAction.editQuote(payload));
    } else {
      dispatch(renewalAction.editRenewal(payload));
    }
  };

  const _isLoadingData = (payload, type) => {
    if (type === "quote") {
      dispatch(quoteAction.setIsLoadingData(payload));
    } else {
      dispatch(renewalAction.setIsLoadingData(payload));
    }
  };

  const _sendRequest = (payload, type) => {
    if (type === "quote") {
      dispatch(quoteAction.sendRequest(payload));
    } else {
      dispatch(renewalAction.sendRenewal(payload));
    }
  };

  const _updateAssignee = (payload) =>
    dispatch(quoteAction.updateAssignee(payload));
  const _isActionDone = (payload) =>
    dispatch(quoteAction.IsActionDone(payload));

  const _quoteActions = (payload, actionType) =>
    dispatch(quoteAction.quoteAction({ data: payload, type: actionType }));

  const _restartQuote = (payload) =>
    dispatch(quoteAction.restartQuote(payload));

  const _viewSingleQuote = (payload) => {
    dispatch(quoteAction.singleQuote(payload));
    dispatch(docusignAction.clearDocusignRedux(null));
  }

  const _assigneeList = (payload) =>
    dispatch(quoteAction.assigneeListOfQuote(payload));
  const _addNotes = (payload) => dispatch(quoteAction.AddNotes(payload));

  const _filterData = (payload) => dispatch(quoteAction.FilterData(payload));
  const _tableSort = (payload) => dispatch(quoteAction.tableSort(payload));

  function closeDrawer() {
    setSetDrawer(null);
  }

  function closePaymentDrawer() {
    setSetPaymentDrawer(null);
  }

  function setAddDrawer() {
    setSetDrawer("addQuoteDrawer");
  }

  function setAddPaymentDrawer() {
    setSetPaymentDrawer("addPaymentDrawer");
  }

  function setAddDrawerTemp() {
    setSetDrawer("addQuoteTempDrawer");
  }

  function setEditDrawer(data) {
    setSetDrawer("manageQuoteDrawer");
    setOtherData(data);
  }

  function closeFilter() {
    setDrawerIs(null);
  }

  function setFilterDrawer() {
    setDrawerIs(
      <Suspense fallback={<></>}>
        <MyDrawerLeft open={true} onClose={closeFilter}>
          <AddFilter
            {...props}
            filter={filter}
            getUserTable={getUserTable}
            onClose={closeFilter}
            _filterData={_filterData}
            filterData={quoteState.filterData}
            _partnerDropList={(payload) =>
              dispatch(globalConfigActions.partnerDropDownListReq(payload))
            }
            _loadingDataAction={_loadingDataAction}
            partnerListForDropdown={quoteState.partnerListForDropdown}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  return (
    <>
      <Helmet>
        <title>View {props.type === "quote" ? "Quote" : "Renewal"}</title>
        <meta name="description" content="A Edan Power CRM Portal" />
      </Helmet>

      {props.OnlyDeleteData !== undefined && props.OnlyDeleteData ? (
        <>
          <DeleteTable
            {...props}
            getUserTable={getUserTable}
            tableRef={getUserTable}
            filter={filter}
            setAddDrawer={setAddDrawer}
            setEditDrawer={setEditDrawer}
            count={quoteState.count}
            companyCount={quoteState.count}
            limit={quoteState.limit}
            remote={quoteState.remote}
            page={quoteState.page}
            message={quoteState.message}
            hideSideBar={quoteState.hideSideBar}
            quoteList={quoteState.quotes}
            _loadingDataAction={_loadingDataAction}
            _quoteList={_quoteList}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteQuote={_deleteQuote}
            _basicAction={_basicAction}
            _closeSideBar={_closeSideBar}
            _actionOnSelectData={_actionOnSelectData}
          />
        </>
      ) : (
        <>
          <List
            {...props}
            getUserTable={getUserTable}
            tableRef={getUserTable}
            filter={filter}
            setAddDrawer={setAddDrawer}
            setAddDrawerTemp={setAddDrawerTemp}
            setEditDrawer={setEditDrawer}
            onClose={closeDrawer}
            setFilterDrawer={setFilterDrawer}
            _closeSideBar={_closeSideBar}
            quoteList={quoteState.quotes}
            quoteCount={quoteState.quoteCount}
            count={quoteState.count}
            limit={quoteState.limit}
            remote={quoteState.remote}
            page={quoteState.page}
            sort={quoteState.sort}
            sortType={quoteState.sortType}
            message={quoteState.message}
            hideSideBar={quoteState.hideSideBar}
            _loadingDataAction={_loadingDataAction}
            _quoteList={_quoteList}
            _quoteCount={_quoteCount}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteQuote={_deleteQuote}
            _basicAction={_basicAction}
            _actionOnSelectData={_actionOnSelectData}
            _tableSort={_tableSort}
          />
        </>
      )}
      <ViewQuote
        {...props}
        getUserTable={getUserTable}
        open={setDrawer}
        _DeleteDeptPayment={_DeleteDeptPayment}
        quote={otherData}
        onClose={closeDrawer}
        newLoader={quoteState.newLoader}
        loadingState={quoteState.loadingState}
        hideSideBar={quoteState.hideSideBar}
        isLoadingData={quoteState.isLoadingData}
        currentQuote={quoteState.currentQuote}
        suppliers={quoteState.suppliers}
        _slugUpdate={_slugUpdate}
        _viewSingleQuote={_viewSingleQuote}
        _assigneeList={_assigneeList}
        _isLoadingData={_isLoadingData}
        _restartQuote={_restartQuote}
        _supplierListForDropdown={_supplierListForDropdown}
        _addNotes={_addNotes}
        message={quoteState.message}
        isActionDone={quoteState.isActionDone}
        _quoteActions={_quoteActions}
        _isActionDone={_isActionDone}
        assignee={quoteState.assignee}
        currentCompany={companyState.currentCompany}
        _updateAssignee={_updateAssignee}
        _closeSideBar={_closeSideBar}
        _editQuote={_editQuote}
        _sendRequest={_sendRequest}
        _getPriceList={_getPriceList}
        setAddPaymentDrawer={setAddPaymentDrawer}
      />
      <AddQuote
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        hideSideBar={quoteState.hideSideBar}
        companies={quoteState.companies}
        leads={quoteState.leads}
        suppliers={quoteState.suppliers}
        message={quoteState.message}
        consumer={quoteState.consumers}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        _companyListForDropdown={_companyListForDropdown}
        _consumerListForDropdown={_consumerDropList}
        _leadListForDropdown={_leadListForDropdown}
        _supplierListForDropdown={_supplierListForDropdown}
        _addQuote={_addQuote}
        visible={globalconfig.visible}
      />

      <AddQuoteTemp
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        hideSideBar={quoteState.hideSideBar}
        companies={quoteState.companies}
        leads={quoteState.leads}
        suppliers={quoteState.suppliers}
        message={quoteState.message}
        consumersDrop={globalconfig.consumersDrop}
        selectedLead={globalconfig.selectedLead}
        _closeSideBar={_closeSideBar}
        _companyListForDropdown={_companyListForDropdown}
        _consumerDropList={_consumerDropList}
        _leadListForDropdown={_leadListForDropdown}
        _supplierListForDropdown={_supplierListForDropdown}
        _addQuote={_addQuote}
        _singleLeadDetailWithSite={_singleLeadDetailWithSite}
        visible={globalconfig.visible}
      />


      <AddPayments
        {...props}
        open={setPaymentDrawer}
        getUserTable={getUserTable}
        currentQuote={quoteState.currentQuote}
        newLoader={quoteState.newLoader}
        loadingState={quoteState.loadingState}
        onClose={closePaymentDrawer}
        setAddPaymentDrawer={setAddPaymentDrawer}
        hideSideBar={quoteState.hideSideBar}
        _closeSideBar={_closeSideBar}
        isLoadingData={quoteState.isLoadingData}
        _addQuotePayment={_addQuotePayment}
        _isLoadingData={_isLoadingData}
        _slugUpdate={_slugUpdate}
        _viewSingleQuote={_viewSingleQuote}
      />
      {drawerIs}
    </>
  );
};
