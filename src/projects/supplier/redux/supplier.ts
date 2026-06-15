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
  put,
  select,
  takeLatest,
  cancelled,
} from "redux-saga/effects";
import { PayloadAction, createSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./model/supplier";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface supplier {
  suppliers: any;
  count: number;
  supplierCount: number;
  supplierId: string;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  currentSupplier: any;
  isLoadingData: boolean;
  filterData: any;
  editRemote: any;
  message: string;
  flatFileData: any,
  hideSection: boolean;
  flatfileStr: any;
  checkAPIStatus: any;
  loader: boolean;
  flatFileURL: any;
  confirmPopup: boolean;
  sendRequest: boolean;
  isLoadingData2: boolean;
  isLoadingData3: boolean;
}
export type ContainerState = supplier;

export const initialState: ContainerState = {
  suppliers: [],
  count: -1,
  supplierCount: -1,
  supplierId: "",
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  currentSupplier: {},
  filterData: {},
  editRemote: {},
  message: "",
  flatFileData: {},
  hideSection: false,
  flatfileStr: "",
  checkAPIStatus: false,
  loader: false,
  flatFileURL: '',
  confirmPopup: false,
  sendRequest: false,
  isLoadingData: false,
  isLoadingData2: false,
  isLoadingData3: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    supplierList(state, action: PayloadAction<object | null>) { },
    supplierListSuccess(state, action: PayloadAction<any>) {
      state.suppliers = action.payload.data.map((e) => {
        return {
          e: e,
          _id: e._id,
          supplierName: e.supplierName,
          contact: e?.SupplierContact?.length > 0 ? helperMethods.formatObjectToString(
            e.SupplierContact,
            "ContactPersonName"
          ) : '-',
          serviceType: helperMethods.arrayToString(e.serviceType),
          supplierStatus: e.isActive ? "Active" : "Block",
        };
      });
      state.remote = true;
    },
    supplierListFailure(state, action: PayloadAction<any>) { },
    supplierNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    supplierNewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    supplierNewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    supplierLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    resetInitialValues(state, action: PayloadAction<any>) {
      state.hideSection = true;
    },
    supplierChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },
    supplierSearch(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    supplierCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload.status;
    },
    addSupplier(state, action: PayloadAction<any>) {
    },
    standardFlatFile(state, action: PayloadAction<any>) { },
    standardFlatFileSuccess(state, action: PayloadAction<any>) {
      state.flatFileData = action?.payload?.data?.data;
      state.flatFileURL = action.payload.data.file;
      state.hideSection = true;
      state.isLoadingData3 = true;
    },
    standardFlatFileFailure(state, action: PayloadAction<any>) {
      state.isLoadingData3 = true;
    },
    uploadStandardFile(state, action: PayloadAction<any>) {
      state.sendRequest = false;
    },
    removeStandardFile(state, action: PayloadAction<any>) { },
    generateStandardFlatFile(state, action: PayloadAction<{ val: any }>) {
      state.confirmPopup = false;
    },
    generateStandardFlatFileSuccess(state, action: PayloadAction<any>) {
      state.flatfileStr = action.payload;
      state.hideSection = false;
      state.isLoadingData2 = true;
    },
    generateStandardFlatFileFailure(state, action: PayloadAction<any>) {
      state.isLoadingData2 = true;
    },
    addSupplierSuccess(state, action: PayloadAction<any>) {
    },
    addSupplierFailure(state, action: PayloadAction<any>) {
    },
    supplierSlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.searchText = "";
    },
    viewSupplierReq(state, action: PayloadAction<any>) { },
    currentSupplierData(state, action: PayloadAction<any>) {
      state.currentSupplier = action.payload.data;
    },
    supplierLoaderAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },

    checkApiResponse(state, action: PayloadAction<any>) {
      state.checkAPIStatus = true;
    },

    changeToaster(state, action: PayloadAction<any>) {
      state.message = "-";
    },
    updateSupplier(state, action: PayloadAction<any>) {
      state.editRemote = false;
    },
    deleteSupplier(state, action: PayloadAction<any>) {
    },
    isLoadingData(state, action: PayloadAction<any>) {
      state.loader = action.payload.status;
    },
    filterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    supplierCount(state, action: PayloadAction<any | null>) { },
    supplierBasicActions(state, action: PayloadAction<any>) {
      if (action.payload.supplierCount !== undefined)
        state.supplierCount = action.payload.supplierCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
      if (action.payload.hideSection !== undefined)
        state.hideSection = action.payload.hideSection
      if (action.payload.confirmPopup !== undefined)
        state.confirmPopup = action.payload.confirmPopup
      if (action.payload.sendRequest !== undefined)
        state.sendRequest = action.payload.sendRequest
      if (action.payload.isLoadingData !== undefined)
        state.isLoadingData = action.payload.isLoadingData
      if (action.payload.isLoadingData2 !== undefined)
        state.isLoadingData2 = action.payload.isLoadingData2
      if (action.payload.isLoadingData3 !== undefined)
        state.isLoadingData3 = action.payload.isLoadingData3
    },
    supplierAddDocument(state, action: PayloadAction<any>) { },
    supplierDeleteDocument(state, action: PayloadAction<any>) { },

    supplierViewTaskId(state, action: PayloadAction<any>) {
      state.supplierId = action.payload;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    clearAllStateData(state, action: PayloadAction<any | null>) {
      return initialState;
    }
  },
});

export const {
  actions: supplierAction,
  reducer: supplierReducer,
  name: sliceKeySupplier,
} = supplierSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.supplier || initialState;

export const selectSupplierState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.supplier;

export function* supplierList(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.supplierList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;
    yield put(supplierAction.supplierBasicActions({ count }));
    yield put(supplierAction.supplierListSuccess(apiResponse));
  } catch (error) {
    yield put(supplierAction.supplierListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addSupplier(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addSupplier(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Supplier added successfully")
    );
    yield put(supplierAction.supplierCloseSideBar({ status: true }));
    yield put(supplierAction.supplierLoaderStart(false));
    yield supplierList(null);
  } catch (error) {
    console.log("error in add new User", error);
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(supplierAction.supplierCloseSideBar({ status: true }));
  }
}

function* standardFlatFile(props) {
  yield put(supplierAction.supplierBasicActions({ isLoadingData3: false }));

  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.getHeaders(i, props.payload);
    if (apiResponse.success) {
      yield put(supplierAction.standardFlatFileSuccess(apiResponse));
    }
    if (apiResponse.message !== undefined)
      yield put(
        globalConfigActions.enableFeedback(apiResponse.message)
      );
    else
      yield put(
        globalConfigActions.enableFeedback("File Uploaded Successfully.")
      );
    yield put(supplierAction.supplierLoaderAction(false));
    yield put(supplierAction.supplierBasicActions({ isLoadingData3: true }));

  } catch (error) {
    yield put(supplierAction.standardFlatFileFailure(false));
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(supplierAction.supplierLoaderAction(false));
    yield put(supplierAction.supplierBasicActions({ isLoadingData3: true }));
  }
}

function* generateStandardFlatFile(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.generateStandardFlatFile(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback(apiResponse.message)
    );
    yield put(supplierAction.generateStandardFlatFileSuccess(apiResponse));

    let baseURL = '';
    if (process.env.NODE_ENV === "development") {
      baseURL = "http://localhost:8333/price/file/?file=";
    } else {
      baseURL = "/price/file/?file=";
    }

    if (apiResponse.file?.newFile) {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.target = '_blank';
      a.style.display = "none";
      a.href = baseURL + apiResponse.file?.newFile;
      a.click();
    }

    if (apiResponse.success === false)
      yield put(supplierAction.supplierBasicActions({ confirmPopup: false }));

    yield put(supplierAction.supplierBasicActions({ confirmPopup: true }));
    if (apiResponse.message)
      yield put(globalConfigActions.enableFeedback(apiResponse.message));

  } catch (error) {
    yield put(supplierAction.generateStandardFlatFileFailure(false));
    yield put(globalConfigActions.enableFeedback(error));
  }
}

function* uploadStandardFile(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addPrices(i, props.payload);
    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback(apiResponse.message)
      );
      yield put(
        supplierAction.viewSupplierReq({ supplier: { _id: i.currentSupplier._id } })
      );
      yield put(supplierAction.supplierBasicActions({ sendRequest: true }));
    }
  } catch (error) {
    yield put(supplierAction.supplierBasicActions({ sendRequest: true }));
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
  }
}


function* removeStandardFile(props) {
  try {
    yield put(supplierAction.isLoadingData({ status: true }));
    const i = yield select(getState);
    yield backendApi.removeData(i, props.payload);

    yield put(
      globalConfigActions.enableFeedback("File removed successfully")
    );
    yield put(
      supplierAction.viewSupplierReq({ supplier: { _id: i.currentSupplier._id } })
    );
    yield put(supplierAction.isLoadingData({ status: false }));
  } catch (error) {
    yield put(supplierAction.isLoadingData({ status: false }));
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
  }
}

function* viewSupplier(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewSupplier(i, props.payload);
    yield put(supplierAction.currentSupplierData(apiResponse));
    yield put(supplierAction.supplierLoaderAction(false));
  } catch (error) {
    console.log("error in add view supplier", error);
  }
}

function* updateSupplier(props) {
  try {
    const i = yield select(getState);
    yield backendApi.updateSupplier(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Supplier Updated successfully")
    );
    yield put(supplierAction.supplierBasicActions({ isLoadingData2: true }));
    yield put(
      supplierAction.viewSupplierReq({
        supplier: { _id: props.payload.supplier.supplier_id },
      })
    );
    yield supplierList(null);
  } catch (error) {
    [];
  }
}

function* deleteSupplier(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteSupplier(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Supplier deleted Successfully")
    );
    yield put(supplierAction.supplierCloseSideBar({ status: true }));
    yield supplierList(null);
  } catch (error) {
    [];
  }
}

function* Count() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.supplierCount(i);
    yield put(
      supplierAction.supplierBasicActions({ supplierCount: apiResponse.count })
    );
  } catch (error) {
    yield put(supplierAction.supplierBasicActions({ supplierCount: 0 }));
  }
}

function* addDocument(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addDocument(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Document added successfully")
    );
    yield put(supplierAction.currentSupplierData(apiResponse));
  } catch (error) {
    [];
  }
}

function* deleteDocument(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.deleteDocument(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Document deleted successfully")
    );
    yield put(supplierAction.currentSupplierData(apiResponse));
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* supplierSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(supplierAction.supplierList.type, supplierList);
  yield takeLatest(supplierAction.tableSort.type, supplierList);
  yield takeLatest(supplierAction.supplierNewPage.type, supplierList);
  yield takeLatest(supplierAction.supplierChangeLimit.type, supplierList);
  yield takeLatest(supplierAction.supplierSearch.type, supplierList);
  yield takeLatest(supplierAction.addSupplier.type, addSupplier);
  yield takeLatest(supplierAction.standardFlatFile.type, standardFlatFile);
  yield takeLatest(supplierAction.viewSupplierReq.type, viewSupplier);
  yield takeLatest(supplierAction.updateSupplier.type, updateSupplier);
  yield takeLatest(supplierAction.deleteSupplier.type, deleteSupplier);
  yield takeLatest(supplierAction.filterData.type, supplierList);
  yield takeLatest(supplierAction.supplierCount.type, Count);
  yield takeLatest(supplierAction.supplierAddDocument.type, addDocument);
  yield takeLatest(supplierAction.supplierDeleteDocument.type, deleteDocument);
  yield takeLatest(supplierAction.generateStandardFlatFile.type, generateStandardFlatFile);
  yield takeLatest(supplierAction.uploadStandardFile.type, uploadStandardFile);
  yield takeLatest(supplierAction.removeStandardFile.type, removeStandardFile);
}
