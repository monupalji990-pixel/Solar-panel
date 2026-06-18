import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  consumerAction,
  consumerReducer,
  consumerSaga,
  selectConsumerState,
  sliceKeyConsumer,
} from "../redux/consumer";
import ViewSimpleConsumer from "../sections/viewSimpleConsumer";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

export const CommonSimple = (props: any) => {
  useInjectReducer({ key: sliceKeyConsumer, reducer: consumerReducer });
  useInjectSaga({ key: sliceKeyConsumer, saga: consumerSaga });

  const [drawerOpen, setDrawerOpen] = useState(true);
  const getUserTable = useRef(null);
  const dispatch = useDispatch();

  function closeDrawer() {
    const { isCloseConsumer } = props;
    isCloseConsumer();
    setDrawerOpen(false);
  }

  const consumerState = useSelector(selectConsumerState);

  const _closeSideBar = (payload) =>
    dispatch(consumerAction.consumerCloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(consumerAction.consumerLoaderStart(payload));
  const _setIsLoadingData = (payload) =>
    dispatch(consumerAction.setIsLoadingData(payload));
  const _slugUpdate = (payload) =>
    dispatch(consumerAction.consumerSlugUpdate(payload));
  const _editConsumer = (payload) =>
    dispatch(consumerAction.editConsumer(payload));
  const _viewConsumer = (payload) =>
    dispatch(consumerAction.viewSingleConsumer(payload));
  const _addNotes = (payload) =>
    dispatch(consumerAction.consumerAddNotes(payload));
  const _addDocument = (payload) =>
    dispatch(consumerAction.consumerAddDocument(payload));
  const _addMeterReading = (payload) =>
    dispatch(consumerAction.consumerAddMeterReading(payload));
  const _sendRequest = (payload) =>
    dispatch(consumerAction.sendRequest(payload));
  const _isActionDone = (payload) =>
    dispatch(consumerAction.consumerIsActionDone(payload));
  const _deleteMeterReading = (payload) =>
    dispatch(consumerAction.consumerDeleteMeterReading(payload));
  const _deleteDocuments = (payload) =>
    dispatch(consumerAction.consumerDeleteDocument(payload));
  const _cityListForDropdown = (payload) =>
    dispatch(consumerAction.cityListForDropdown(payload));

  return (
    <>
      <MyDrawer
        drawerSize="1100px"
        iconName="Consumer"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <ViewSimpleConsumer
          {...props}
          consumer={props.consumerData}
          getUserTable={getUserTable}
          isLoadingData={consumerState.isLoadingData}
          message={consumerState.message}
          currentConsumer={consumerState.currentConsumer}
          _isLoadingData={_setIsLoadingData}
          _closeSideBar={_closeSideBar}
          _slugUpdate={_slugUpdate}
          _editConsumer={_editConsumer}
          _viewConsumer={_viewConsumer}
          _addNotes={_addNotes}
          _loadingDataAction={_loadingDataAction}
          _addDocument={_addDocument}
          _addMeterReading={_addMeterReading}
          _sendRequest={_sendRequest}
          meterReadings={consumerState.meterReadings}
          isActionDone={consumerState.isActionDone}
          _isActionDone={_isActionDone}
          _deleteMeterReading={_deleteMeterReading}
          documents={consumerState.documents}
          installerDocuments={consumerState.installerDocuments}
          consumerState={consumerState}
          _deleteDocuments={_deleteDocuments}
          notes={consumerState.notes}
          _cityListForDropdown={_cityListForDropdown}
        />
      </MyDrawer>
    </>
  );
};
