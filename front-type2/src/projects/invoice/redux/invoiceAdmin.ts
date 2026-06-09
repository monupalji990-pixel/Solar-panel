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
import { put, select, takeLatest, cancelled } from "redux-saga/effects";
import { PayloadAction, createSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./model/invoiceAdmin";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import invoiceAdmin from "./model/invoiceAdmin";
import moment from "moment";

export interface invoiceAdmin {
  error: null;
  invoices: any;
  isNext: boolean;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  message: string;
  sort: string;
  sortType: string;
  isLoadingData: boolean;
  invoiceDetails: any;
  invoiceCompany: [];
}
export type ContainerState = invoiceAdmin;

export const initialState: ContainerState = {
  error: null,
  invoices: [],
  isNext: false,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  sort: "createdAt",
  sortType: "desc",
  isLoadingData: true,
  invoiceDetails: null,
  invoiceCompany: [],
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const InvoiceAdminSlice = createSlice({
  name: "invoiceAdmin",
  initialState,
  reducers: {
    invoiceList(state, action: PayloadAction<object | null>) {},
    invoiceListSuccess(state, action: PayloadAction<any>) {
      state.invoices = action.payload.data;
      state.remote = true;
    },
    invoiceListFailure(state, action: PayloadAction<any>) {},

    invoiceNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    invoiceNewPageSuccess(state, action: PayloadAction<{ page: number }>) {},
    invoiceNewPageFailure(state, action: PayloadAction<{ page: number }>) {},

    invoiceLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    invoiceChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },
    invoiceSearch(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    invoiceCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload.status;
      state.message = action.payload.message;
    },

    addInvoice(state, action: PayloadAction<any>) {},
    addInvoiceSuccess(state, action: PayloadAction<any>) {},
    addInvoiceFailure(state, action: PayloadAction<any>) {},

    getInvoiceDetails(state, action: PayloadAction<any>) {},
    getInvoiceDetailsSuccess(state, action: PayloadAction<any>) {
      state.invoiceDetails = action.payload.data;
      state.isLoadingData = false;
    },

    getInvoiceCompanyList(state, action: PayloadAction<any>) {},
    getInvoiceCompanyListSuccess(state, action: PayloadAction<any>) {
      state.invoiceCompany = action.payload.data;
      state.isLoadingData = false;
    },

    editInvoice(state, action: PayloadAction<any>) {},

    invoiceLoaderAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
      state.page = 1;
    },

    invoiceBasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.usersCount !== undefined)
        state.isNext = action.payload.isNext;
    },

    deleteInvoice(state, action: PayloadAction<any>) {
      state.remote = false;
    },
    generatePDF(state, action: PayloadAction<any>) {
      state.remote = false;
    },
    loadingData(state, action: PayloadAction<any>) {
      state.invoices.success = action.payload;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: invoiceAdminAction,
  reducer: InvoiceAdminReducer,
  name: sliceKeyInvoiceAdmin,
} = InvoiceAdminSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.invoiceAdmin || initialState;

export const selectInvoiceState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getInvoiceState = (state: RootState) => state.invoiceAdmin;

export function* invoiceListByAdmin(props: any) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getInvoiceState);
    const apiResponse = yield backendApi.invoiceListApi(i);
    const isNext = apiResponse.isNext;
    yield put(invoiceAdminAction.invoiceBasicActions({ isNext }));
    yield put(globalConfigActions.endLoader(null));
    yield put(invoiceAdminAction.invoiceListSuccess(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
    yield put(invoiceAdminAction.invoiceListFailure([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addNewInvoice(props) {
  try {
    const i = yield select(getInvoiceState);
    const apiResponse = yield backendApi.addInvoiceApi(props.payload);
    if (apiResponse.success) {
      yield put(invoiceAdminAction.invoiceCloseSideBar({ status: true }));
      yield put(invoiceAdminAction.invoiceList(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(invoiceAdminAction.invoiceCloseSideBar({ status: true }));
  }
}

function* editInvoice(props) {
  try {
    const apiResponse = yield backendApi.editInvoiceApi(props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(invoiceAdminAction.invoiceBasicActions({ remote: false }));
    yield put(invoiceAdminAction.invoiceList(null));
  } catch (error) {
    [];
  }
}

function* deleteInvoice(props) {
  try {
    const apiResponse = yield backendApi.deleteInvoiceApi(props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(
      invoiceAdminAction.invoiceBasicActions({ sidebar: false, remote: false })
    );
    yield put(invoiceAdminAction.invoiceList(null));
    yield put(
      invoiceAdminAction.invoiceBasicActions({ sidebar: true, remote: true })
    );
  } catch (error) {
    [];
  }
}

function* generatePDFByAdmin(props){
  try {
    const apiResponse = yield backendApi.generateInvoicePdfAPI(props.payload);
    if (apiResponse) {
      let bString = apiResponse;
      let bLength = bString.length;
      let bytes = new Uint8Array(bLength);
      // let bytes = new Array(bLength);
      for (let i = 0; i < bLength; i++) {
        let ascii = apiResponse.charCodeAt(i);
        bytes[i] = ascii;
      }

      const typeArray = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        pdf: "application/pdf",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const blob = bytes;
      // setIsFileDownloadInProgress(false);
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
        new Blob([blob as ArrayBuffer], { type: typeArray["pdf"] })
      );
      a.setAttribute("download", `Invoice-${moment().format('DD-MM-YYY')}`);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);

      yield put(globalConfigActions.enableFeedback("PDF Generated Successfully!"));
    }
    yield put(
      invoiceAdminAction.invoiceBasicActions({ sidebar: false, remote: false })
    );
    yield put(invoiceAdminAction.invoiceList(null));
    yield put(
      invoiceAdminAction.invoiceBasicActions({ sidebar: true, remote: true })
    );
  } catch (error) {
    [];
  }
}

function* getInvoiceDetailsByAdmin(props) {
  try {
    const apiResponse = yield backendApi.getInvoiceDetailAPI(props.payload);
    yield put(invoiceAdminAction.getInvoiceDetailsSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* getInvoiceCompanyListByAdmin() {
  try {
    const apiResponse = yield backendApi.getInvoiceCompanyListAPI();
    yield put(invoiceAdminAction.getInvoiceCompanyListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* invoiceAdminSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(invoiceAdminAction.invoiceList.type, invoiceListByAdmin);
  yield takeLatest(invoiceAdminAction.invoiceNewPage.type, invoiceListByAdmin);
  yield takeLatest(
    invoiceAdminAction.invoiceChangeLimit.type,
    invoiceListByAdmin
  );
  yield takeLatest(invoiceAdminAction.invoiceSearch.type, invoiceListByAdmin);
  yield takeLatest(invoiceAdminAction.addInvoice.type, addNewInvoice);
  yield takeLatest(invoiceAdminAction.editInvoice.type, editInvoice);
  yield takeLatest(invoiceAdminAction.deleteInvoice.type, deleteInvoice);
  yield takeLatest(invoiceAdminAction.generatePDF.type, generatePDFByAdmin);
  yield takeLatest(invoiceAdminAction.tableSort.type, invoiceListByAdmin);
  yield takeLatest(
    invoiceAdminAction.getInvoiceDetails.type,
    getInvoiceDetailsByAdmin
  );
  yield takeLatest(
    invoiceAdminAction.getInvoiceCompanyList.type,
    getInvoiceCompanyListByAdmin
  );
}
