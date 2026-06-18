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
import backendApi from "./model/record";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface record {
  count: number;
  limit: number;
  isNext: boolean;
  page: number;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  message: string;
  sort: string;
  sortType: string;
  slug: string;
  type: string;
  isLoadingData: boolean;
  list: any;
}
export type ContainerState = record;

export const initialState: ContainerState = {
  list: [],
  count: -1,
  limit: 10,
  isNext: false,
  page: 1,
  hideSideBar: false,
  remote: false,
  searchText: "",
  message: "",
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  type: "",
  isLoadingData: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) { },
    ListSuccess(state, action: PayloadAction<any>) {
      state.list = action.payload;
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { },

  },
});

export const {
  actions: recordAction,
  reducer: recordReducer,
  name: sliceKeyRecord,
} = recordSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.record || initialState;

export const selectRecordState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.record;

export function* recordList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.driveListAPI(props.payload);
    yield put(recordAction.ListSuccess(apiResponse.data));
  } catch (error) {
    yield put(recordAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* recordSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(recordAction.List.type, recordList);
}
