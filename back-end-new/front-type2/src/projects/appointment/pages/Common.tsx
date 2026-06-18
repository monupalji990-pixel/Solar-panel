import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import List from "../sections/appointmentList";
import { appointmentAction, selectAppointmentState } from "../redux/appointment";
import AddAppointment from "../sections/addAppointment";
import { quoteAction, selectQuoteState } from "../../quote/redux/quote";
import ViewAppointment from "../sections/viewAppointment";
import { selectTaskState, taskAction } from "projects/task/redux/task";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState("");
  const [setDrawerCal, setSetDrawerCal] = useState("");
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const [showSearch, setShowSearch] = useState(0);

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  const appointmentState = useSelector(selectAppointmentState);
  const quoteState = useSelector(selectQuoteState);
  const taskState = useSelector(selectTaskState);
  const assigneeList = taskState.assigneeList;
  
  const _appointmentList = (payload) => dispatch(appointmentAction.List(payload));
  const _listLimit = (payload) => dispatch(appointmentAction.ChangeLimit(payload));
  const _searchInData = (payload) => dispatch(appointmentAction.Search(payload));
  const _nextPage = (payload) => dispatch(appointmentAction.NewPage(payload));
  const _slugUpdate = (payload) => dispatch(appointmentAction.SlugUpdate(payload));
  const _sortingAction = (payload) => dispatch(appointmentAction.Sort(payload));
  const _closeSideBar = (payload) => dispatch(appointmentAction.CloseSideBar(payload));
  const _userListAppointment = (payload) => dispatch(appointmentAction.userListAppointment(payload));
  const _addAppointment = (payload) => dispatch(appointmentAction.addAppointment(payload));
  const _singleAppointmentDetails = (payload) => dispatch(appointmentAction.singleAppointmentDetails(payload));
  const _editAppointment = (payload) => dispatch(appointmentAction.editAppointment(payload));
  const _deleteAppointment = (payload) => dispatch(appointmentAction.deleteAppointment(payload));
  const _companyListForDropdown = (payload) => dispatch(appointmentAction.CompanyListData(payload));
  const _consumerDropList = (payload) => dispatch(appointmentAction.ConsumerList(payload));
  const _loadingDataAction = (payload) => dispatch(appointmentAction.LoaderStart(payload));
  const _leadListForDropdown = (payload) => dispatch(quoteAction.dropDownLeadList(payload));
  const _assigneeList = (payload) =>
  dispatch(taskAction.assigneeListOfTask(payload));
  
  function closeDrawer() {
    setSetDrawer(null);
  }

  function closeDrawerCal() {
    setSetDrawerCal(null);
  }

  function setShowSearchFunc(count) {
    setShowSearch(count);
  }

  function setAddDrawer() {
    setSetDrawer("addAppointmentDrawer");
  }
  function setEditDrawer(data) {
    setSetDrawer("viewAppointmentDrawer");
    setOtherData(data);
  }
  function closeFilter() {
    setDrawerIs(null);
  }

  return (
    <>
      <Helmet>
        <title>View Appointment</title>
        <meta name="description" content="A Edan Power CRM Portal" />
      </Helmet>

      <List
        {...props}
        getUserTable={getUserTable}
        tableRef={getUserTable}
        filter={filter}
        setAddDrawer={setAddDrawer}
        setEditDrawer={setEditDrawer}
        onClose={closeDrawer}
        _closeSideBar={_closeSideBar}
        appointmentList={appointmentState.appointments}
        loadingCal={appointmentState.loadingCal}
        count={appointmentState.count}
        limit={appointmentState.limit}
        remote={appointmentState.remote}
        page={appointmentState.page}
        hideSideBar={appointmentState.hideSideBar}
        sortType={appointmentState.sortType}
        sort={appointmentState.sort}
        _loadingDataAction={_loadingDataAction}
        _appointmentList={_appointmentList}
        _listLimit={_listLimit}
        _searchInData={_searchInData}
        _sortingAction={_sortingAction}
        _nextPage={_nextPage}
        _slugUpdate={_slugUpdate}
        assigneeList={assigneeList}
        isLoadingData2={appointmentState.isLoadingData2}
        _assigneeList={_assigneeList}
      />

      <AddAppointment
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        _addAppointment={_addAppointment}
        leads={quoteState.leads}
        availableUsers={appointmentState.availableUsers}
        isLoadingData={appointmentState.isLoadingData}
        isLoadingData2={appointmentState.isLoadingData2}
        _leadListForDropdown={_leadListForDropdown}
        _userListAppointment={_userListAppointment}
        _companyListForDropdown={_companyListForDropdown}
        _consumerDropList={_consumerDropList}
      />

      <ViewAppointment
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        appointmentData={otherData}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        _addAppointment={_addAppointment}
        leads={quoteState.leads}
        viewAppointment={appointmentState.viewAppointment}
        viewLoading={appointmentState.viewLoading}
        availableUsers={appointmentState.availableUsers}
        isLoadingData={appointmentState.isLoadingData}
        isLoadingData2={appointmentState.isLoadingData2}
        editLoading={appointmentState.editLoading}
        _leadListForDropdown={_leadListForDropdown}
        _userListAppointment={_userListAppointment}
        _singleAppointmentDetails={_singleAppointmentDetails}
        _editAppointment={_editAppointment}
        _deleteAppointment={_deleteAppointment}
        _companyListForDropdown={_companyListForDropdown}
        _consumerDropList={_consumerDropList}
      />

      {drawerIs}
    </>
  );
};
