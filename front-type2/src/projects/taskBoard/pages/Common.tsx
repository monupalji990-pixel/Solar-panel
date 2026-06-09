import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import List from "../sections/taskBoard";
import { taskAction, selectTaskState } from "../../task/redux/task";
import View from "../sections/taskDetail";

export const Common = (props: any) => {
  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState("");
  const [otherData, setOtherData] = useState({});

  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  const taskState = useSelector(selectTaskState);

  const _closeSideBar = (payload) => dispatch(taskAction.CloseSideBar(payload));
  const _taskList = (payload) => dispatch(taskAction.List(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _loadingDataAction = (payload) =>
    dispatch(taskAction.LoaderStart(payload));
  const _basicAction = (payload) => dispatch(taskAction.BasicActions(payload));

  const _addComments = (payload) => dispatch(taskAction.addComment(payload));

  const _notCloseSideBar = (payload) =>
    dispatch(taskAction.notCloseSideBar(payload));

  const _setIsLoadingData = (payload) =>
    dispatch(taskAction.setIsLoadingData(payload));
  const _viewTask = (payload) => dispatch(taskAction.viewTask(payload));

  const _sendRequest = (payload) => dispatch(taskAction.sendRequest(payload));

  const _addComment = (payload) => dispatch(taskAction.addComment(payload));

  const _companyListForDropdown = (payload) =>
    dispatch(taskAction.dropdownCompanyList(payload));

  const _updateTask = (payload) => dispatch(taskAction.updateTask(payload));
  const _viewTaskId = (payload) => dispatch(taskAction.viewTaskId(payload));

  function closeDrawer() {
    setSetDrawer(null);
  }

  function setEditDrawer(data) {
    setSetDrawer("manageTaskBoardDrawer");
    setOtherData(data);
  }

  return (
    <>
      <Helmet>
        <title>View Task Board</title>
        <meta name="description" content="A Edan Power CRM Portal || Task Board" />
      </Helmet>

      <List
        {...props}
        getUserTable={getUserTable}
        tableRef={getUserTable}
        taskList={taskState.tasks}
        count={taskState.count}
        limit={taskState.limit}
        remote={taskState.remote}
        page={taskState.page}
        _taskList={_taskList}
        setEditDrawer={setEditDrawer}
        _slugUpdate={_slugUpdate}
        _updateTask={_updateTask}
        _isLoadingData={_setIsLoadingData}
      />

      {setDrawer === "manageTaskBoardDrawer" ? (
        <View
          {...props}
          getUserTable={getUserTable}
          open={setDrawer}
          company={otherData}
          onClose={closeDrawer}
          isLoadingData={taskState.isLoadingData}
          currentTask={taskState.currentTask}
          companies={taskState.companies}
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
        />
      ) : (
        ""
      )}

      {drawerIs}
    </>
  );
};
