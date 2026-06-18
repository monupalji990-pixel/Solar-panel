import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import CompanyList from "../sections/companyList";
import AddCompany from "../sections/addCompany";
import ViewCompany from "../sections/viewCompany";
import AddFilter from "../components/setFilter";
import DeleteTable from "../sections/deleteTable";
import {
  companyAction,
  companyReducer,
  companySaga,
  selectCompanyState,
  sliceKeyCompany,
} from "../redux/company";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { io } from 'socket.io-client';
import { selectAuthState } from "projects/authentication/redux/auth";
import FileManager from '../../consumer/sections/fileManager';

export const Common = (props: any) => {
  useInjectReducer({ key: sliceKeyCompany, reducer: companyReducer });
  useInjectSaga({ key: sliceKeyCompany, saga: companySaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const getUserTable = useRef(null);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const authStates = useSelector(selectAuthState);

  const observerRoles = authStates?.loggedUser?.role?.roleName

  let socketURL = ''

  if (window.location?.origin == 'https://thepowerportal.co.uk') {
    socketURL = 'https://thepowerportal.co.uk'
  }
  else if (process.env.NODE_ENV === "development") {
    socketURL = 'http://localhost:4000'
  } else {
    socketURL = 'https://stage.thepowerportal.co.uk'
  }

  useEffect(() => {
    if (observerRoles == 'Observing Partner') {
      const newSocket: any = io(socketURL, {
        transports: ['websocket'],
      })

      newSocket.on('connect', () => {
      })

      newSocket.on("error", (error: any) => {
        console.log("socket error", error);
      })
      setSocket(newSocket);
    }
    // return () => newSocket.close();
  }, [])

  useEffect(() => {
    if (socket !== null && observerRoles == 'Observing Partner') {
      socket.emit('get_list', '')
      socket.on('user_list', (data) => {
      })
    }
  }, [socket?.connected]);


  const socketAuthStatus = authStates?.isSocketStatus

  useEffect(() => {
    if (socket !== null && observerRoles == 'Observing Partner') {
      socket.emit('idle', { status: socketAuthStatus });
    }
  }, [socketAuthStatus]);

  if (socket !== null && observerRoles == 'Observing Partner') {
    socket.on('user_list_change', (data) => {
    });
  }

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: props.companyType === "normal" ? "Company" : "Live Company" },
    ]);
  }, []);

  useEffect(() => {
    _loadingDataAction(false);
    _slugUpdate(props);
    _basicAction({ companyCount: -1 });
    _companyList(null);
  }, [props.companyType]);

  const companyState = useSelector(selectCompanyState);

  const _closeSideBar = (payload) =>
    dispatch(companyAction.CloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(companyAction.LoaderStart(payload));
  const _companyList = (payload) => dispatch(companyAction.List(payload));
  const _companyCount = (payload) => dispatch(companyAction.Count(payload));
  const _listLimit = (payload) => dispatch(companyAction.ChangeLimit(payload));
  const _searchInData = (payload) => dispatch(companyAction.Search(payload));
  const _nextPage = (payload) => dispatch(companyAction.NewPage(payload));
  const _slugUpdate = (payload) => dispatch(companyAction.SlugUpdate(payload));
  const _deleteCompany = (payload) =>
    dispatch(companyAction.deleteCompany(payload));
  const _basicAction = (payload) =>
    dispatch(companyAction.BasicActions(payload));
  const _actionOnSelectData = (deleteIds, action) =>
    dispatch(
      companyAction.actionOnDeleteReq({ selectedData: deleteIds, action })
    );
  const _assigneeList = (payload) =>
    dispatch(companyAction.assigneeListOfCompany(payload));
  const _addCompany = (payload) => dispatch(companyAction.addCompany(payload));
  const _addAssignee = (payload) =>
    dispatch(companyAction.CreateAssignee(payload));
  const _setIsLoadingData = (payload) =>
    dispatch(companyAction.setIsLoadingData(payload));
  const _viewSingleCompany = (payload) =>
    dispatch(companyAction.singleCompany(payload));
  const _editCompany = (payload) =>
    dispatch(companyAction.editCompany(payload));
  const _addNotes = (payload) => dispatch(companyAction.AddNotes(payload));
  const _sendRequest = (payload) =>
    dispatch(companyAction.sendRequest(payload));
  const _isActionDone = (payload) =>
    dispatch(companyAction.IsActionDone(payload));
  const _addDocument = (payload) =>
    dispatch(companyAction.AddDocument(payload));
  const _deleteDocuments = (payload) =>
    dispatch(companyAction.DeleteDocument(payload));
  const _addMeterReading = (payload) =>
    dispatch(companyAction.AddMeterReading(payload));
  const _deleteMeterReading = (payload) =>
    dispatch(companyAction.DeleteMeterReading(payload));
  const _filterData = (payload) => dispatch(companyAction.FilterData(payload));

  const _partnerList = (payload) =>
    dispatch(companyAction.PartnerList(payload));

  const _tableSort = (payload) => dispatch(companyAction.tableSort(payload));

  function closeDrawer() {
    setSetDrawer(null);
  }

  function setAddDrawer() {
    _closeSideBar(false);
    setSetDrawer("addCompanyDrawer");
  }

  function setEditDrawer(data) {
    setSetDrawer("manageCompanyDrawer");
    setOtherData(data);
  }

  function closeFilter() {
    setDrawerIs(null);
  }

  function setFilterDrawer() {
    _closeSideBar(false);
    setSetDrawer("filterDrawer");
  }

  function setFileManager(data) {
    setSetDrawer("manageFiles");
    setOtherData(data);
  }

  return (
    <>
      <Helmet>
        <title>
          View {props.companyType === "normal" ? "Company" : "Live Company"}
        </title>
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
            count={companyState.count}
            companyCount={companyState.count}
            limit={companyState.limit}
            remote={companyState.remote}
            page={companyState.page}
            message={companyState.message}
            hideSideBar={companyState.hideSideBar}
            companyList={companyState.companies}
            _loadingDataAction={_loadingDataAction}
            _companyList={_companyList}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteCompany={_deleteCompany}
            _basicAction={_basicAction}
            _closeSideBar={_closeSideBar}
            _actionOnSelectData={_actionOnSelectData}
          />
        </>
      ) : (
        <>
          <CompanyList
            {...props}
            getUserTable={getUserTable}
            tableRef={getUserTable}
            filter={filter}
            setAddDrawer={setAddDrawer}
            setEditDrawer={setEditDrawer}
            onClose={closeDrawer}
            setFilterDrawer={setFilterDrawer}
            _closeSideBar={_closeSideBar}
            companyList={companyState.companies}
            companyCount={companyState.companyCount}
            count={companyState.count}
            limit={companyState.limit}
            remote={companyState.remote}
            page={companyState.page}
            message={companyState.message}
            hideSideBar={companyState.hideSideBar}
            sort={companyState.sort}
            sortType={companyState.sortType}
            _loadingDataAction={_loadingDataAction}
            _companyList={_companyList}
            _companyCount={_companyCount}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteCompany={_deleteCompany}
            _basicAction={_basicAction}
            _actionOnSelectData={_actionOnSelectData}
            _tableSort={_tableSort}
            _filterData={_filterData}
            setFileManager={setFileManager}
          />
        </>
      )}
      <ViewCompany
        {...props}
        getUserTable={getUserTable}
        open={setDrawer}
        company={otherData}
        onClose={closeDrawer}
        isLoadingData={companyState.isLoadingData}
        message={companyState.message}
        currentCompany={companyState.currentCompany}
        _isLoadingData={_setIsLoadingData}
        _closeSideBar={_closeSideBar}
        _viewSingleCompany={_viewSingleCompany}
        _editCompany={_editCompany}
        _slugUpdate={_slugUpdate}
        _addNotes={_addNotes}
        _sendRequest={_sendRequest}
        isActionDone={companyState.isActionDone}
        _isActionDone={_isActionDone}
        documents={companyState.documents}
        installerDocuments={companyState.installerDocuments}
        _addDocument={_addDocument}
        isAddDocumentLoading={companyState.addDocumentLoading}
        _deleteDocuments={_deleteDocuments}
        meterReadings={companyState.meterReadings}
        _addMeterReading={_addMeterReading}
        addMeterReadingLoading={companyState.addMeterReadingLoading}
        _deleteMeterReading={_deleteMeterReading}
      />
      <AddCompany
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        role={companyState.role}
        _closeSideBar={_closeSideBar}
        _addCompany={_addCompany}
        _slugUpdate={_slugUpdate}
        assigneeList={companyState.assigneeList}
        currentCompany={companyState.currentCompany}
        _assigneeList={_assigneeList}
        companyState={companyState}
        _addAssignee={_addAssignee}
      />
      <AddFilter
        {...props}
        filter={filter}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        open={setDrawer}
        _filterData={_filterData}
        filterData={companyState.filterData}
        _partnerList={_partnerList}
        _loadingDataAction={_loadingDataAction}
        partnerListForDropdown={companyState.partnerListForDropdown}
      />

      <FileManager
        open={setDrawer}
        onClose={closeDrawer}
        currentData={otherData}
        showingFrom="Company"
      />
    </>
  );
};
