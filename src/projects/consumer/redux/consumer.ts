/*
 * GithubRepoForm Slice
 *
 * Here we define:
 * - The shape of our container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import {
  call,
  put,
  select,
  takeLatest,
  delay,
  cancelled,
} from "redux-saga/effects";
import { PayloadAction, createSelector, IdSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./model/consumer";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import consumer from "./model/consumer";

export interface consumer {
  consumers: any;
  currentConsumer: any;
  count: number;
  consumerCount: number;
  addedConsumer: any;
  limit: number;
  page: number;
  hideSideBar: boolean;
  notHideSideBar: boolean;
  remote: boolean;
  searchText: string;
  message: string;
  messageCode: "-";
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  type: string;
  isLoadingData: boolean;
  companies: any;
  suppliers: any;
  assigneeList: any;
  isActionDone: boolean;
  filterData: any;
  notes: any;
  documents: any;
  installerDocuments: any;
  meterReadings: any;
  partnerListForDropdown: any;
  OnlyDeleteData: boolean;
  success: boolean;
  singleConsumer: any;
  cities: any;
}
export type ContainerState = consumer;

export const initialState: ContainerState = {
  consumers: [],
  currentConsumer: {},
  addedConsumer: {},
  count: -1,
  consumerCount: -1,
  limit: 10,
  page: 1,
  hideSideBar: false,
  notHideSideBar: false,
  remote: false,
  searchText: "",
  message: "",
  messageCode: "-",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  type: "",
  isLoadingData: true,
  companies: [],
  suppliers: [],
  assigneeList: {},
  isActionDone: false,
  filterData: {},
  notes: [],
  documents: [],
  installerDocuments: [],
  meterReadings: [],
  partnerListForDropdown: [],
  OnlyDeleteData: false,
  singleConsumer: {},
  success: true,
  cities: [],
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const consumerSlice = createSlice({
  name: "consumer",
  initialState,
  reducers: {
    consumerList(state, action: PayloadAction<any | null>) {},
    consumerListSuccess(state, action: PayloadAction<any>) {
      if (action?.payload?.data?.length > 0) {
        state.consumers = action?.payload?.data?.map((e) => {
          return {
            _id: e._id,
            consumerId: e.consumerId,
            title: e.title ? e.title : "-",
            email: e.email ? e.email : "-",
            firstName: e.firstName ? e.firstName : "-",
            surName: e.surName ? e.surName : "-",
            addressOne: e.addressOne ? e.addressOne : "-",
            addressTwo: e.addressTwo ? e.addressTwo : "-",
            fullName: e.fullName ? e.fullName : "-",
            telephoneNumber: e.telephoneNumber ? e.telephoneNumber : "-",
            mobile: e.mobile ? e.mobile : "-",
            postcode: e.postcode ? e.postcode : "-",
            isFromPrimo: e.isFromPrimo ? "PRIMO" : "CRM",
          };
        });
        state.remote = true;
      } else {
        state.consumers = [];
        state.remote = true;
      }
    },
    consumerListFailure(state, action: PayloadAction<any>) {},
    consumerLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    consumerCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    consumerLoaderEnd(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    consumerDocumentData(state, action: PayloadAction<any>) {
      state.documents = action.payload.data.documents;
      state.installerDocuments = action.payload.data.installerDocuments;
    },
    consumerIsActionDone(state, action: PayloadAction<any>) {
      state.isActionDone = action.payload;
    },
    consumerToasterMessage(state, action: PayloadAction<any>) {
      state.message = action.payload;
    },
    consumerSlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.type = action.payload.consumerType;
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
      state.searchText = "";
    },
    consumerFilterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    consumerNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    consumerNewPageSuccess(state, action: PayloadAction<{ page: number }>) {},
    consumerNewPageFailure(state, action: PayloadAction<{ page: number }>) {},
    consumerSearch(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    consumerChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },

    addConsumer(state, action: PayloadAction<any>) {
      state.success = false;
    },
    addConsumerSuccess(state, action: PayloadAction<any>) {
      state.success = true;
    },
    addConsumerFailure(state, action: PayloadAction<any>) {},
    currentConsumerData(state, action: PayloadAction<any>) {
      state.currentConsumer = action.payload.data;
      state.isLoadingData = false;
    },
    consumerMessageCode(state, action: PayloadAction<any>) {
      state.messageCode = action.payload.messageCode;
    },
    consumerChangeToaster(state, action: PayloadAction<any>) {
      state.messageCode = "-";
    },

    editConsumer(state, action: PayloadAction<any>) {},
    viewSingleConsumer(state, action: PayloadAction<any>) {},
    singleConsumerDetailSuccess(state, action: PayloadAction<any>) {
      state.singleConsumer = action.payload.consumer;
    },
    notCloseSideBar(state, action: PayloadAction<any>) {
      state.notHideSideBar = action.payload;
    },
    addNotesSideBar(state, action: PayloadAction<any>) {},
    consumerAddDocument(state, action: PayloadAction<any>) {},
    deleteConsumer(state, action: PayloadAction<any>) {},
    consumerDeleteDocument(state, action: PayloadAction<any>) {},
    consumerAddMeterReading(state, action: PayloadAction<any>) {},
    consumerDeleteMeterReading(state, action: PayloadAction<any>) {},
    consumerAssigneeList(state, action: PayloadAction<any>) {},
    consumerAssigneeListSuccess(state, action: PayloadAction<any>) {
      state.assigneeList = action.payload.data;
    },
    consumerCreateAssignee(state, action: PayloadAction<any>) {
      state.success = false;
    },
    setSuccess(state, action: PayloadAction<any>) {
      state.success = action.payload;
    },
    consumerPartnerList(state, action: PayloadAction<any>) {},
    consumerPartnerListData(state, action: PayloadAction<any>) {
      state.partnerListForDropdown = action.payload;
    },
    consumerMeterReadingData(state, action: PayloadAction<any>) {
      state.meterReadings = action.payload.data.meterReading;
    },
    consumerNotesData(state, action: PayloadAction<any>) {
      state.notes = action.payload.data.Notes;
    },
    consumerCount(state, action: PayloadAction<any | null>) {},
    consumerBasicActions(state, action: PayloadAction<any>) {
      if (action.payload.consumerCount !== undefined)
        state.consumerCount = action.payload.consumerCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
      if (action.payload.addedConsumer !== undefined)
        state.addedConsumer = action.payload.addedConsumer;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
    },
    consumerAddNotes(state, action: PayloadAction<any>) {},
    sendRequest(state, action: PayloadAction<any>) {},
    actionOnDeleteReq(state, action: PayloadAction<any>) {},
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    cityListForDropdown(state, action: PayloadAction<any>) {},
    cityListForDropdownSucesss(state, action: PayloadAction<any>) {
      state.cities = action.payload.data;
    },
  },
});

export const {
  actions: consumerAction,
  reducer: consumerReducer,
  name: sliceKeyConsumer,
} = consumerSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.consumer || initialState;

export const selectConsumerState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.consumer;

export function* consumerList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(consumerAction.consumerBasicActions({ count }));
    yield put(globalConfigActions.endLoader(null));
    yield put(consumerAction.consumerListSuccess(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
    yield put(consumerAction.consumerListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
      yield put(consumerAction.consumerListSuccess([]));
    }
  }
}

function* addConsumer(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addConsumer(i, props.payload.value);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(consumerAction.addConsumerSuccess(null));
      yield put(
        globalConfigActions.enableFeedback("Consumer added successfully")
      );
      yield put(
        consumerAction.consumerBasicActions({ addedConsumer: apiResponse.data })
      );
      yield put(consumerAction.consumerList(null));
      props.payload.handleCloseAddDrawer();
    } else {
      yield put(globalConfigActions.enableFeedback("Cunsumer Add failed"));
    }
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    if (error.data.err.code === 2310 || error.data.statusCode === 2310) {
      yield put(
        globalConfigActions.enableFeedback(
          "Email already exist, please change the email address"
        )
      );
    } else {
      yield put(globalConfigActions.enableFeedback("something went wrong"));
    }
    yield put(consumerAction.addConsumerSuccess(null));
  }
}

function* editConsumer(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.editConsumer(i, props.payload);
    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback("consumer updated successfully")
      );
      yield put(consumerAction.currentConsumerData(apiResponse));
      yield put(consumerAction.setIsLoadingData(false));
      const fieldArray = [
        "title",
        "firstName",
        "surName",
        "email",
        "addressOne",
      ];
      if (helperMethods.isCallNextApi(fieldArray, props.payload.update)) {
        yield consumerList(null);
      }
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    [];
  }
}

function* viewConsumer(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewConsumer(i, props.payload);
    if (!apiResponse.success) {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    } else {
      yield put(consumerAction.currentConsumerData(apiResponse));
      yield put(consumerAction.setIsLoadingData(false));
      yield put(globalConfigActions.endLoader(null));
    }
  } catch (error) {
    [];
  }
}

function* deleteConsumer(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    yield backendApi.deleteConsumer(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Consumer deleted Successfully")
    );
    yield put(consumerAction.consumerCloseSideBar(true));
    yield put(consumerAction.consumerList(null));
  } catch (error) {
    [];
  }
}

function* addDocument(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addDocument(i, props.payload);
    yield put(consumerAction.consumerIsActionDone(true));
    yield put(
      globalConfigActions.enableFeedback("Document added Successfully")
    );
    yield put(
      consumerAction.viewSingleConsumer({ consumerId: i.currentConsumer._id })
    );
  } catch (error) {
    [];
  }
}

function* deleteDocument(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteDocument(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Document deleted successfully")
    );
    yield put(consumerAction.consumerIsActionDone(true));
    yield put(
      consumerAction.viewSingleConsumer({ consumerId: i.currentConsumer._id })
    );
  } catch (error) {
    [];
  }
}

function* addMeterReading(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addMeterReading(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Meter reading added Successfully")
    );
    yield put(consumerAction.consumerIsActionDone(true));
    yield put(
      consumerAction.viewSingleConsumer({ consumerId: i.currentConsumer._id })
    );
  } catch (error) {
    [];
  }
}

function* deleteMeterReading(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteDocument(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Meter reading deleted Successfully")
    );
    yield put(consumerAction.consumerIsActionDone(true));
    yield put(
      consumerAction.viewSingleConsumer({ consumerId: i.currentConsumer._id })
    );
  } catch (error) {
    [];
  }
}

function* assigneeList() {
  try {
    const apiResponse = yield backendApi.assigneeList(null);
    yield put(consumerAction.consumerAssigneeListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}
function* addAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addAssignee(i, props.payload);
    yield put(consumerAction.setSuccess(true));
    yield put(
      globalConfigActions.enableFeedback("Assignee Added Successfully")
    );
  } catch (error) {
    [];
  }
}

function* partnerList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.partnerListConsumer(i);
    yield put(consumerAction.consumerPartnerListData(apiResponse));
  } catch (error) {
    [];
  }
}

function* consumerCount() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerCount(i);
    yield put(
      consumerAction.consumerBasicActions({ consumerCount: apiResponse.count })
    );
  } catch (error) {
    yield put(consumerAction.consumerBasicActions({ consumerCount: 0 }));
  }
}

function* addNotes(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addNotes(i, props.payload);
    yield put(consumerAction.currentConsumerData(apiResponse));
  } catch (error) {
    [];
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.sendRequest(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Delete request sent successfully")
    );
    yield put(consumerAction.currentConsumerData(apiResponse));
    yield put(consumerAction.consumerList(null));
  } catch (error) {
    [];
  }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);
    yield put(consumerAction.consumerBasicActions({ remote: false }));
    yield backendApi.actionOnSelectData(i, props.payload);
    yield globalConfigActions.enableFeedback(
      `Consumer delete request ${props.payload.action}ed`
    );
    yield put(consumerAction.consumerBasicActions({ status: true }));
    yield put(consumerAction.consumerList(null));
    yield put(consumerAction.consumerBasicActions({ remote: false }));
  } catch (error) {
    [];
  }
}

function* cityListForDropdownReq(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.cityListForDropdownReq(
      i,
      props.payload
    );

    yield put(consumerAction.cityListForDropdownSucesss(apiResponse));
  } catch (error) {
    yield put(consumerAction.cityListForDropdownSucesss([]));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* consumerSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(consumerAction.consumerList.type, consumerList);
  yield takeLatest(consumerAction.consumerFilterData.type, consumerList);
  yield takeLatest(consumerAction.consumerNewPage.type, consumerList);
  yield takeLatest(consumerAction.consumerChangeLimit.type, consumerList);
  yield takeLatest(consumerAction.consumerSearch.type, consumerList);
  yield takeLatest(consumerAction.addConsumer.type, addConsumer);
  yield takeLatest(consumerAction.editConsumer.type, editConsumer);
  yield takeLatest(consumerAction.viewSingleConsumer.type, viewConsumer);
  yield takeLatest(consumerAction.deleteConsumer.type, deleteConsumer);
  yield takeLatest(consumerAction.consumerAddNotes.type, addNotes);
  yield takeLatest(consumerAction.consumerAddDocument.type, addDocument);
  yield takeLatest(consumerAction.consumerDeleteDocument.type, deleteDocument);
  yield takeLatest(
    consumerAction.consumerAddMeterReading.type,
    addMeterReading
  );
  yield takeLatest(
    consumerAction.consumerDeleteMeterReading.type,
    deleteMeterReading
  );
  yield takeLatest(consumerAction.consumerAssigneeList.type, assigneeList);
  yield takeLatest(consumerAction.consumerCreateAssignee.type, addAssignee);
  yield takeLatest(consumerAction.consumerPartnerList.type, partnerList);
  yield takeLatest(consumerAction.consumerCount.type, consumerCount);
  yield takeLatest(consumerAction.sendRequest.type, sendRequest);
  yield takeLatest(consumerAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(consumerAction.tableSort.type, consumerList);
  yield takeLatest(
    consumerAction.cityListForDropdown.type,
    cityListForDropdownReq
  );
}
