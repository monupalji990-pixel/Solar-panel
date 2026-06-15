import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Add from "../sections/addTaskCommon";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { taskAction, selectTaskState } from "../redux/task";
import { globalConfigActions } from "sharedUtils/sharedRedux/configuration";

export const CreateComplainTask = (props: any) => {
  const [setDrawer, setSetDrawer] = useState("");
  const [setDrawerCal, setSetDrawerCal] = useState("");

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

  const _closeSideBar = (payload) => dispatch(taskAction.CloseSideBar(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _basicAction = (payload) => dispatch(taskAction.BasicActions(payload));
  const _addTask = (payload) => dispatch(taskAction.addTask(payload));
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

  function setViewCalDrawer() {
    setSetDrawerCal("manageCalender");
  }

  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "1250px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Complaint"
      open={props.openModal}
      onClose={props.onClose.bind(this)}
    >
      <Add
        {...props}
        setViewCalDrawer={setViewCalDrawer}
        getUserTable={getUserTable}
        onClose={props.onClose.bind(this)}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        companies={taskState.companies}
        slotInfo={taskState.slotInfo}
        isLoadingData={taskState.isLoadingData}
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
    </MyDrawer>
  );
};
