import React, { Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { connect, useDispatch, useSelector } from "react-redux";
import ConsumerList from "../sections/consumerList";
import AddConsumer from "../sections/addConsumer";
import DeleteTable from "../sections/deleteTable";
import AddFilter from "../components/setFilter";
import ViewConsumer from "../sections/viewConsumer";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { consumerAction, consumerReducer, consumerSaga, selectConsumerState, sliceKeyConsumer } from "../redux/consumer";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import FileManager from "../sections/fileManager";

export const Common = (props: any) => {

  useInjectReducer({ key: sliceKeyConsumer, reducer: consumerReducer });
  useInjectSaga({ key: sliceKeyConsumer, saga: consumerSaga })

  const [drawerIs, setDrawerIs] = useState(null);
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
      { name: "Consumer" },
    ]);
  }, []);

  const consumerState = useSelector(selectConsumerState);

  const _closeSideBar = (payload) =>
    dispatch(consumerAction.consumerCloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(consumerAction.consumerLoaderStart(payload));
  const _consumerList = (payload) =>
    dispatch(consumerAction.consumerList(payload));
  const _consumerCount = (payload) =>
    dispatch(consumerAction.consumerCount(payload));
  const _listLimit = (payload) =>
    dispatch(consumerAction.consumerChangeLimit(payload));
  const _searchInData = (payload) =>
    dispatch(consumerAction.consumerSearch(payload));
  const _nextPage = (payload) =>
    dispatch(consumerAction.consumerNewPage(payload));
  const _slugUpdate = (payload) =>
    dispatch(consumerAction.consumerSlugUpdate(payload));
  const _deleteConsumer = (payload) =>
    dispatch(consumerAction.deleteConsumer(payload));
  const _basicAction = (payload) =>
    dispatch(consumerAction.consumerBasicActions(payload));
  const _actionOnSelectData = (deleteIds, action) =>
    dispatch(
      consumerAction.actionOnDeleteReq({ selectedData: deleteIds, action })
    );
  const _addDocument = (payload) =>
    dispatch(consumerAction.consumerAddDocument(payload));
  const _deleteDocuments = (payload) =>
    dispatch(consumerAction.consumerDeleteDocument(payload));
  const _setIsLoadingData = (payload) =>
    dispatch(consumerAction.setIsLoadingData(payload));
  const _editConsumer = (payload) =>
    dispatch(consumerAction.editConsumer(payload));
  const _viewConsumer = (payload) =>
    dispatch(consumerAction.viewSingleConsumer(payload));
  const _addNotes = (payload) =>
    dispatch(consumerAction.consumerAddNotes(payload));
  const _sendRequest = (payload) =>
    dispatch(consumerAction.sendRequest(payload));
  const _assigneeList = (payload) =>
    dispatch(consumerAction.consumerAssigneeList(payload));
  const _addAssignee = (payload) =>
    dispatch(consumerAction.consumerCreateAssignee(payload));
  const _isActionDone = (payload) =>
    dispatch(consumerAction.consumerIsActionDone(payload));
  const _addMeterReading = (payload) =>
    dispatch(consumerAction.consumerAddMeterReading(payload));
  const _deleteMeterReading = (payload) =>
    dispatch(consumerAction.consumerDeleteMeterReading(payload));
  const _filterData = (payload) =>
    dispatch(consumerAction.consumerFilterData(payload));
  const _cityListForDropdown = (payload) =>
    dispatch(consumerAction.cityListForDropdown(payload));

  function deleteUser(id) {
    props._deleteUserById(id, (resp) => {
      getUserTable.current.onQueryChange();
    });
  }
  function closeDrawer() {
    setSetDrawer(null);
  }

  function setAddDrawer() {
    _closeSideBar(false);
    setSetDrawer("addConsumerDrawer");
  }

  function setEditDrawer(data) {
    setSetDrawer("manageConsumerDrawer");
    setOtherData(data);
  }

  function setFileManager(data) {
    setSetDrawer("manageFiles");
    setOtherData(data);
  }

  function deleteConfirmation(data) {
    if (confirm("Are you sure you want to delete?")) {
      deleteUser(data._id);
    }
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
            filterData={consumerState.filterData}
            _loadingDataAction={_loadingDataAction}
          />
        </MyDrawerLeft>
      </Suspense>
    );
  }

  return (
    <>
      <Helmet>
        <title>View Consumer</title>
        <meta name="description" content="A Edan Power CRM" />
      </Helmet>

      {props.OnlyDeleteData !== undefined && props.OnlyDeleteData ? (
        <DeleteTable
          {...props}
          getUserTable={getUserTable}
          tableRef={getUserTable}
          filter={filter}
          setAddDrawer={setAddDrawer}
          setEditDrawer={setEditDrawer}
          count={consumerState.count}
          consumerCount={consumerState.consumerCount}
          limit={consumerState.limit}
          remote={consumerState.remote}
          page={consumerState.page}
          message={consumerState.message}
          hideSideBar={consumerState.hideSideBar}
          consumerList={consumerState.consumers}
          _loadingDataAction={_loadingDataAction}
          _consumerList={_consumerList}
          _consumerCount={_consumerCount}
          _listLimit={_listLimit}
          _searchInData={_searchInData}
          _nextPage={_nextPage}
          _slugUpdate={_slugUpdate}
          _deleteConsumer={_deleteConsumer}
          _basicAction={_basicAction}
          _actionOnSelectData={_actionOnSelectData}
        />
      ) : (
        <>
          <ConsumerList
            {...props}
            getUserTable={getUserTable}
            tableRef={getUserTable}
            filter={filter}
            setAddDrawer={setAddDrawer}
            setEditDrawer={setEditDrawer}
            onClose={closeDrawer}
            setFilterDrawer={setFilterDrawer}
            setFileManager={setFileManager}
            _closeSideBar={_closeSideBar}
          />
        </>
      )}
      <ViewConsumer
        {...props}
        getUserTable={getUserTable}
        open={setDrawer}
        consumer={otherData}
        onClose={closeDrawer}
        isLoadingData={consumerState.isLoadingData}
        message={consumerState.message}
        currentConsumer={consumerState.currentConsumer}
        _isLoadingData={_setIsLoadingData}
        _closeSideBar={_closeSideBar}
        _slugUpdate={_slugUpdate}
        _editConsumer={_editConsumer}
        _viewConsumer={_viewConsumer}
        _addNotes={_addNotes}
        _sendRequest={_sendRequest}
        meterReadings={consumerState.meterReadings}
        isActionDone={consumerState.isActionDone}
        _isActionDone={_isActionDone}
        _addMeterReading={_addMeterReading}
        _deleteMeterReading={_deleteMeterReading}
        documents={consumerState.documents}
        installerDocuments={consumerState.installerDocuments}
        consumerState={consumerState}
        _addDocument={_addDocument}
        _deleteDocuments={_deleteDocuments}
        notes={consumerState.notes}
        _cityListForDropdown={_cityListForDropdown}
      />
      <AddConsumer
        {...props}
        open={setDrawer}
        getUserTable={getUserTable}
        onClose={closeDrawer}
        _assigneeList={_assigneeList}
        _addAssignee={_addAssignee}
      />

      <FileManager
        open={setDrawer}
        onClose={closeDrawer}
        currentData={otherData}
        showingFrom="Consumer"
      />

      {drawerIs}
    </>
  );
};
