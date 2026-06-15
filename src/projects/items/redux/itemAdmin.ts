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
import backendApi from "./model/itemAdmin";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import itemAdmin from "./model/itemAdmin";

export interface itemAdmin {
  error: null;
  items: any;
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
}
export type ContainerState = itemAdmin;

export const initialState: ContainerState = {
  error: null,
  items: [],
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
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const ItemsAdminSlice = createSlice({
  name: "itemAdmin",
  initialState,
  reducers: {
    itemList(state, action: PayloadAction<object | null>) { },
    itemListSuccess(state, action: PayloadAction<any>) {
      state.items = action.payload.data
      state.isNext = action.payload.isNext
      state.remote = true
    },
    itemListFailure(state, action: PayloadAction<any>) { },

    itemNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    itemNewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    itemNewPageFailure(state, action: PayloadAction<{ page: number }>) { },

    itemLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    itemChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },
    itemSearch(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    itemCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload.status;
      state.message = action.payload.message;
    },

    addItem(state, action: PayloadAction<any>) {
    },
    addItemSuccess(state, action: PayloadAction<any>) {
    },
    addItemFailure(state, action: PayloadAction<any>) {
    },

    editItem(state, action: PayloadAction<any>) {
    },

    itemLoaderAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
      state.page = 1;
    },

    itemBasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.usersCount !== undefined)
        state.isNext = action.payload.isNext;
    },

    deleteItem(state, action: PayloadAction<any>) { 
      state.remote = false
    },
    loadingData(state, action: PayloadAction<any>) {
      state.items.success = action.payload;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: itemAdminAction,
  reducer: ItemsAdminReducer,
  name: sliceKeyItemsAdmin,
} = ItemsAdminSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.itemAdmin || initialState;

export const selectItemState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getItemState = (state: RootState) => state.itemAdmin;

export function* itemListByAdmin(props: any) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getItemState);
    const apiResponse = yield backendApi.itemListApi(i);
    const isNext = apiResponse.isNext
    yield put(itemAdminAction.itemBasicActions({ isNext }));
    yield put(globalConfigActions.endLoader(null));
    yield put(itemAdminAction.itemListSuccess(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
    yield put(itemAdminAction.itemListFailure([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addNewItem(props) {
  try {
    const i = yield select(getItemState);
    const apiResponse = yield backendApi.addItemApi(props.payload);
    if (apiResponse.success) {
      yield put(itemAdminAction.itemCloseSideBar({ status: true }));
      yield put(itemAdminAction.itemList(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(itemAdminAction.itemCloseSideBar({ status: true }));
  }
}

function* editItem(props) {
  try {
    const apiResponse = yield backendApi.editItemApi(props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(itemAdminAction.itemBasicActions({ remote: false }));
    yield put(itemAdminAction.itemList(null));
  } catch (error) {
    [];
  }
}

function* deleteItem(props) {
  try {
    const apiResponse = yield backendApi.deleteItemApi(props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(
      itemAdminAction.itemBasicActions({ sidebar: false, remote: false })
    );
    yield put(itemAdminAction.itemList(null));
    yield put(
      itemAdminAction.itemBasicActions({ sidebar: true, remote: true })
    );
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* itemAdminSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(itemAdminAction.itemList.type, itemListByAdmin);
  yield takeLatest(itemAdminAction.itemNewPage.type, itemListByAdmin);
  yield takeLatest(itemAdminAction.itemChangeLimit.type, itemListByAdmin);
  yield takeLatest(itemAdminAction.itemSearch.type, itemListByAdmin);
  yield takeLatest(itemAdminAction.addItem.type, addNewItem);
  yield takeLatest(itemAdminAction.editItem.type, editItem);
  yield takeLatest(itemAdminAction.deleteItem.type, deleteItem);
  yield takeLatest(itemAdminAction.tableSort.type, itemListByAdmin);
}
