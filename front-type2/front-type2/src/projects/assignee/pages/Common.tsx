import React, { Suspense, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssigneeList from "../sections/assigneeList";
import AddAssignee from "../sections/addAssignee";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  assigneeAction,
  assigneeReducer,
  assigneeSaga,
  selectAssigneeState,
  sliceKeyAssignee,
} from "../redux/assignee";
import { selectCompanyState } from "projects/company/redux/company";
import { selectConsumerState } from "projects/consumer/redux/consumer";

export const Common = (props: any) => {
  useInjectReducer({ key: sliceKeyAssignee, reducer: assigneeReducer });
  useInjectSaga({ key: sliceKeyAssignee, saga: assigneeSaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);

  const getUserTable = useRef(null);
  const dispatch = useDispatch();
  const assigneeState = useSelector(selectAssigneeState);
  const companyState = useSelector(selectCompanyState);

  const consumerState = useSelector(selectConsumerState);

  const _companyAssigneeList = (payload) =>
    dispatch(assigneeAction.assigneeCompanylist(payload));
  const _consumerAssigneeList = (payload) =>
    dispatch(assigneeAction.assigneeConsumerlist(payload));
  const _loadingDataAction = (payload) =>
    dispatch(assigneeAction.LoaderStart(payload));
  const _searchInData = (payload) => dispatch(assigneeAction.Search(payload));
  const _nextPage = (payload) => dispatch(assigneeAction.NewPage(payload));
  const _listLimit = (payload) => dispatch(assigneeAction.ChangeLimit(payload));
  const _slugUpdate = (payload) => dispatch(assigneeAction.SlugUpdate(payload));
  const _removeAssignee = (payload) =>
    dispatch(assigneeAction.deleteAssignee(payload));
  const _addAssignee = (payload) =>
    dispatch(assigneeAction.addAssignee(payload));
  const _closeSideBar = (payload) =>
    dispatch(assigneeAction.CloseSideBar(payload));
  const _assigneeList = (payload) => dispatch(assigneeAction.list(payload));
  const _tableSort = (payload) => dispatch(assigneeAction.tableSort(payload));

  function closeDrawer() {
    setSetDrawer(null);
  }
  function setAddDrawer() {
    _closeSideBar(false);
    setSetDrawer("addAssigneeDrawer");
  }

  return (
    <>
      <Suspense fallback={<></>}>
        <AssigneeList
          {...props}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          setAddDrawer={setAddDrawer}
          assigneeList={assigneeState.assigneeList}
          count={assigneeState.count}
          limit={assigneeState.limit}
          remote={assigneeState.remote}
          page={assigneeState.page}
          sort={assigneeState.sort}
          sortType={assigneeState.sortType}
          currentCompany={companyState.currentCompany}
          currentConsumer={consumerState.currentConsumer}
          _companyAssigneeList={_companyAssigneeList}
          _consumerAssigneeList={_consumerAssigneeList}
          _loadingDataAction={_loadingDataAction}
          _searchInData={_searchInData}
          _nextPage={_nextPage}
          _listLimit={_listLimit}
          _slugUpdate={_slugUpdate}
          _removeAssignee={_removeAssignee}
          _tableSort={_tableSort}
        />

        <AddAssignee
          {...props}
          open={setDrawer}
          getUserTable={getUserTable}
          onClose={closeDrawer}
          hideSideBar={assigneeState.hideSideBar}
          assigneeListForDropdown={assigneeState.assigneeListForDropdown}
          allAssignee={assigneeState.allAssignee}
          _addAssignee={_addAssignee}
          _closeSideBar={_closeSideBar}
          _assigneeList={_assigneeList}
        />

        {drawerIs}
      </Suspense>
    </>
  );
};
