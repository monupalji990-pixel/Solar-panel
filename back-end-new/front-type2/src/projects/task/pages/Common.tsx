import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import List from "../sections/taskList";
import Add from "../sections/addTask";
import View from "../sections/viewTask";
import AddFilter from "../components/setFilter";
import DeleteTable from "../sections/deleteTable";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { taskAction, selectTaskState } from "../redux/task";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";
import CalenderView from "../components/calender"

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState("");
  const [setDrawerCal, setSetDrawerCal] = useState("");
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const [showSearch, setShowSearch] = useState(0);

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Task" },
    ]);
  }, []);

  const taskState = useSelector(selectTaskState);

  const _addDocument = (payload) =>
    dispatch(taskAction.taskAddDocument(payload));
  const _deleteDocuments = (payload) =>
    dispatch(taskAction.taskDeleteDocument(payload));
  const _closeSideBar = (payload) => dispatch(taskAction.CloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(taskAction.LoaderStart(payload));
  const _taskList = (payload) => dispatch(taskAction.List(payload));
  const _taskCount = (payload) => dispatch(taskAction.Count(payload));
  const _listLimit = (payload) => dispatch(taskAction.ChangeLimit(payload));
  const _searchInData = (payload) => dispatch(taskAction.Search(payload));
  const _nextPage = (payload) => dispatch(taskAction.NewPage(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _deleteTask = (payload) => dispatch(taskAction.deleteTask(payload));
  const _basicAction = (payload) => dispatch(taskAction.BasicActions(payload));
  const _actionOnSelectData = (deleteIds, action) =>
    dispatch(taskAction.actionOnDeleteReq({ selectedData: deleteIds, action }));
  const _sortingAction = (payload) => dispatch(taskAction.Sort(payload));

  const _addComments = (payload) => dispatch(taskAction.addComment(payload));

  const _notCloseSideBar = (payload) =>
    dispatch(taskAction.notCloseSideBar(payload));

  const _setIsLoadingData = (payload) =>
    dispatch(taskAction.setIsLoadingData(payload));
  const _viewTask = (payload) => dispatch(taskAction.viewTask(payload));

  const _checkCurrentDueTask = (payload) =>
    dispatch(taskAction.currentDueTask(payload));
  const _sendRequest = (payload) => dispatch(taskAction.sendRequest(payload));

  const _filterData = (payload) => dispatch(taskAction.FilterData(payload));
  const _addTask = (payload) => dispatch(taskAction.addTask(payload));

  const _addComment = (payload) => dispatch(taskAction.addComment(payload));

  const _companyListForDropdown = (payload) =>
    dispatch(taskAction.dropdownCompanyList(payload));
  const _leadListForDropdown = (payload) =>
    dispatch(taskAction.dropdownLeadList(payload));

  const _quotesListForDropdown = (payload) =>
    dispatch(taskAction.dropdownQuoteList(payload));

  const _consumerDropList = (payload) =>
    dispatch(globalConfigActions.consumerDropDownListReq(payload));

  const _singleCompanyDetail = (payload) =>
    dispatch(taskAction.singleCompany(payload));

  const _singleConsumerDetail = (payload) =>
    dispatch(globalConfigActions.singleConsumerDetail(payload));

  const _updateTask = (payload) => dispatch(taskAction.updateTask(payload));

  const _viewTaskId = (payload) => dispatch(taskAction.viewTaskId(payload));

  const _assigneeList = (payload) =>
    dispatch(taskAction.assigneeListOfTask(payload));

  const _taskCalendarData = (payload) => dispatch(taskAction.TaskCalendarData(payload));
  const _taskSlotInfo = (payload) => dispatch(taskAction.TaskSlotDetails(payload));
  const _OpenDahboardTaskViews = (payload) => dispatch(taskAction.OpenDahboardTaskViews(payload));
  const _isActionDone = (payload) => dispatch(taskAction.taskIsActionDone(payload));

  useEffect(() => {
    if (taskState.viewTaskDashboard && taskState.viewTaskDashboard.isDashboard) {
      setSetDrawer("manageTaskDrawer");
      setOtherData(taskState.viewTaskDashboard);
    }
  }, [taskState.viewTaskDashboard]);

  function closeDrawer() {
    setSetDrawer(null);
    // props._OpenDahboardTaskViews({});
  }

  function closeDrawerCal() {
    setSetDrawerCal(null);
  }

  function setShowSearchFunc(count) {
    setShowSearch(count);
  }

  function setAddDrawer() {
    setSetDrawer("addTaskDrawer");
  }
  function setEditDrawer(data) {

    setSetDrawer("manageTaskDrawer");
    setOtherData(data);
  }
  function setViewCalDrawer() {
    setSetDrawerCal("manageCalender");
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
            filterData={taskState.filterData}
            assigneeList={taskState.assigneeList}
            _assigneeList={_assigneeList}
            _loadingDataAction={_loadingDataAction}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  return (
    <>
      <Helmet>
        <title>View Task</title>
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
            count={taskState.count}
            companyCount={taskState.count}
            limit={taskState.limit}
            remote={taskState.remote}
            page={taskState.page}
            hideSideBar={taskState.hideSideBar}
            companyList={taskState.companies}
            taskList={taskState.tasks}
            taskCount={taskState.taskCount}
            sortType={taskState.sortType}
            dueTask={taskState.dueTask}
            currentDueTask={taskState.currentDueTask}
            setShowSearch={setShowSearchFunc}
            showSearch={showSearch}
            _loadingDataAction={_loadingDataAction}
            _taskList={_taskList}
            _taskCount={_taskCount}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _sortingAction={_sortingAction}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteTask={_deleteTask}
            _basicAction={_basicAction}
            _actionOnSelectData={_actionOnSelectData}
            _checkCurrentDueTask={_checkCurrentDueTask}
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
            setEditDrawer={setEditDrawer}
            onClose={closeDrawer}
            setFilterDrawer={setFilterDrawer}
            _closeSideBar={_closeSideBar}
            taskList={taskState.tasks}
            taskCount={taskState.taskCount}
            count={taskState.count}
            limit={taskState.limit}
            remote={taskState.remote}
            page={taskState.page}
            hideSideBar={taskState.hideSideBar}
            sortType={taskState.sortType}
            sort={taskState.sort}
            dueTask={taskState.dueTask}
            currentDueTask={taskState.currentDueTask}
            setShowSearch={setShowSearchFunc}
            showSearch={showSearch}
            _loadingDataAction={_loadingDataAction}
            _taskList={_taskList}
            _taskCount={_taskCount}
            _listLimit={_listLimit}
            _searchInData={_searchInData}
            _sortingAction={_sortingAction}
            _nextPage={_nextPage}
            _slugUpdate={_slugUpdate}
            _deleteTask={_deleteTask}
            _basicAction={_basicAction}
            _actionOnSelectData={_actionOnSelectData}
            _checkCurrentDueTask={_checkCurrentDueTask}
            _filterData={_filterData}
          />
        </>
      )}

      <Add
        {...props}
        open={setDrawer}
        setViewCalDrawer={setViewCalDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        companies={taskState.companies}
        slotInfo={taskState.slotInfo}
        hideSideBar={taskState.hideSideBar}
        leads={taskState.leads}
        quotes={taskState.quotes}
        selectedCompany={taskState.selectedCompany}
        assigneeList={taskState.assigneeList}
        _companyListForDropdown={_companyListForDropdown}
        _leadListForDropdown={_leadListForDropdown}
        _quotesListForDropdown={_quotesListForDropdown}
        _consumerDropList={_consumerDropList}
        _singleCompanyDetail={_singleCompanyDetail}
        _singleConsumerDetail={_singleConsumerDetail}
        _basicAction={_basicAction}
        _addTask={_addTask}
        taskState={taskState}
      />
      {setDrawer === "manageTaskDrawer" ? (
        <View
          {...props}
          getUserTable={getUserTable}
          open={setDrawer}
          company={otherData}
          onClose={closeDrawer}
          isLoadingData={taskState.isLoadingData}
          currentTask={taskState.currentTask}
          currentTaskDoc={taskState.currentTaskDoc}
          companies={taskState.companies}
          isActionDone={taskState.isActionDone}
          notHideSideBar={taskState.notHideSideBar}
          _loadingDataAction={_loadingDataAction}
          _addComment={_addComment}
          _notCloseSideBar={_notCloseSideBar}
          _isLoadingData={_setIsLoadingData}
          _closeSideBar={_closeSideBar}
          task={otherData}
          _slugUpdate={_slugUpdate}
          _viewTask={_viewTask}
          _updateTask={_updateTask}
          _viewTaskId={_viewTaskId}
          _addNotes={_addComments}
          _basicAction={_basicAction}
          _sendRequest={_sendRequest}
          _companyListForDropdown={_companyListForDropdown}
          _addDocument={_addDocument}
          _deleteDocuments={_deleteDocuments}
          _isActionDone={_isActionDone}
        />
      ) : (
        ""
      )}

      {setDrawerCal === "manageCalender" ? (
        <CalenderView
          {...props}
          calendarData={taskState.calendarData}
          localCalendarData={taskState.localCalendarData}
          open={setDrawerCal}
          showingFrom="taskView"
          _taskSlotInfo={_taskSlotInfo}
          onClose={closeDrawerCal}
          _taskCalendarData={_taskCalendarData}
          getUserTable={getUserTable}
          isLoadingForCalTask={taskState.isLoadingForCalTask}
          setEditDrawer={setEditDrawer}
        />
      ) : (
        ""
      )}
      {drawerIs}
    </>
  );
};
