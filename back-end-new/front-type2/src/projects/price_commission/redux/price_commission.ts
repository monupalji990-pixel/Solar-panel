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
} from "redux-saga/effects";
import { PayloadAction, createSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./modal/price_commission";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface priceCommission {
  count: number;
  isNext: boolean;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  message: string;
  messageCode: "-";
  sort: string;
  sortType: string;
  slug: string;
  type: string;
  isLoadingData: boolean;
  priceList: any;
  listContactList: any;
  obj: any;
  priceData: any;
  priceSupplier: any;
  isStatus: boolean;
  ldz: any;
  ldzLoader: boolean;
  localData: any;
  isPostcode: boolean;
  loaderFirst: boolean;
  isShowList: boolean;
}


export type ContainerState = priceCommission;

export const initialState: ContainerState = {
  priceList: [],
  listContactList: [],
  count: -1,
  isNext: false,
  hideSideBar: false,
  remote: false,
  searchText: "",
  message: "",
  messageCode: "-",
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  type: "",
  isLoadingData: false,
  obj: {
    page: 1,
    limit: 10,
    skip: 0,
  },
  priceData: {},
  priceSupplier: '',
  isStatus: false,
  ldz: [],
  ldzLoader: false,
  localData: {},
  isPostcode: false,
  loaderFirst: false,
  isShowList: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const priceCommissionSlice = createSlice({
  name: "priceCommission",
  initialState,
  reducers: {
    setLocalData(state, action: PayloadAction<any | null>) {
      state.localData = action.payload;
    },
    List(state, action: PayloadAction<any | null>) {
      state.isShowList = true;
      state.loaderFirst = true;
      state.remote = true;

      if (state.localData && state.localData.length === 1) {
        state.obj = {
          ...state.obj,
          skip: 0,
          page: 1,
          limit: 10,
          // limit: state.limit,
          // filter: action.payload.filter
          filter: {
            ...action.payload.filter,
            ldz: state.localData[0].ldz
          }
        }
      }
      else {
        state.obj = {
          ...state.obj,
          skip: 0,
          page: 1,
          limit: 10,
          // limit: state.limit,
          filter: action.payload.filter
        }
      }
      state.priceData = action.payload;
    },
    ListSuccess(state, action: PayloadAction<any>) {
      state.loaderFirst = false;
      state.remote = false;
      state.priceList = action?.payload?.data?.map((e) => {
        return {
          _id: e._id,
          logo: e.supplier.length > 0 ? e.supplier[0].logo : '',
          supplier: e.supplier.length > 0 ? e.supplier[0].supplierName : '-',
          standingCharge: Number(e.standingCharge),
          unitRate: e.unitRate >= 0 ? e.unitRate : e.dayUnitRate,
          minAQ: e.minAQ ? e.minAQ : '-',
          maxAQ: e.maxAQ ? e.maxAQ : '-',
          ldz: e.ldz ? e.ldz : '-',
          duration: e.duration ? e.duration : 0,
          isExport: false,
          ewRate: e.eveningAndWeekendUnitRate,
          nightRate: e.nightUnitRate,
          uplift: 0,
          other: e.other,
        }
      });

    },

    getLdzFromPostcode(state, action: PayloadAction<any | null>) {
      state.ldzLoader = true;
      // state.loaderFirst = true;
    },
    getLdzFromPostcodeSuccess(state, action: PayloadAction<any | null>) {
      state.ldz = action.payload.ldz;
      state.ldzLoader = false;
      state.loaderFirst = false;
      state.isPostcode = action.payload.success;
    },
    getLdzFromPostcodeFailed(state, action: PayloadAction<any | null>) {
      state.ldzLoader = true;
      state.loaderFirst = false;
    },

    SupplierFilter(state, action: PayloadAction<any | null>) {
      state.remote = true;

      if (state.localData && state.localData.length === 1) {
        state.obj = {
          ...state.obj,
          skip: 0,
          page: 1,
          filter: {
            priceForSupplier: action.payload.priceForSupplier,
            ldz: state.localData[0].ldz,
            ...state.priceData.filter,
          },
        }
      }
      else {
        state.obj = {
          ...state.obj,
          skip: 0,
          page: 1,
          filter: {
            priceForSupplier: action.payload.priceForSupplier,
            ...state.priceData.filter,
          },
        }
      }
      state.priceSupplier = action.payload.priceForSupplier;
    },
    DuartionFilter(state, action: PayloadAction<any | null>) {
      state.remote = true;

      if (action.payload.duration === "any") {
        if (state.localData && state.localData.length === 1) {
          state.obj = {
            ...state.obj,
            skip: 0,
            page: 1,
            filter: {
              // duration: action.payload.duration,
              // priceForSupplier: state.priceSupplier,
              AQ: state?.priceData?.aq,
              currentSupplier: state?.priceData?.filter?.currentSupplier,
              ldz: state?.localData[0].ldz,
              contractStartDate: state?.priceData?.filter?.contractStartDate,
              ...state?.priceData?.filter,
            },
          }
        }
        else {
          state.obj = {
            ...state.obj,
            skip: 0,
            page: 1,
            filter: {
              // duration: action.payload.duration,
              // priceForSupplier: state.priceSupplier,
              AQ: state?.priceData?.aq,
              currentSupplier: state?.priceData?.filter?.currentSupplier,
              ldz: state?.priceData?.filter?.ldz,
              contractStartDate: state?.priceData?.filter?.contractStartDate,
              ...state?.priceData?.filter,
            },
          }
        }
      }
      else {
        if (state.localData && state.localData.length === 1) {
          state.obj = {
            ...state.obj,
            skip: 0,
            page: 1,
            filter: {
              duration: action.payload.duration,
              // priceForSupplier: state.priceSupplier,
              AQ: state?.priceData?.aq,
              currentSupplier: state?.priceData?.filter?.currentSupplier,
              ldz: state?.localData[0].ldz,
              contractStartDate: state?.priceData?.filter?.contractStartDate,
              ...state?.priceData?.filter,
            },
          }
        }
        else {
          state.obj = {
            ...state.obj,
            skip: 0,
            page: 1,
            filter: {
              duration: action.payload.duration,
              // priceForSupplier: state.priceSupplier,
              AQ: state?.priceData?.aq,
              currentSupplier: state?.priceData?.filter?.currentSupplier,
              ldz: state?.priceData?.filter?.ldz,
              contractStartDate: state?.priceData?.filter?.contractStartDate,
              ...state?.priceData?.filter,
            },
          }
        }
      }
    },
    ClearAPIData(state, action: PayloadAction<any | null>) {
      return initialState;
      state.priceList = null;
      state.ldz = null;
      state.localData = null;
    },
    ListFailure(state, action: PayloadAction<any>) { },
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.obj = {
        ...state.obj,
        skip: (action.payload.page - 1) * (state.obj.limit),
        page: action.payload.page
      }
      // state.skip = (action.payload.page - 1) * (state.limit);
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    NewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.obj.page = 1;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    ChangeLimit(state, action: PayloadAction<any>) {
      state.obj = {
        ...state.obj,
        limit: action.payload.limit,
      }
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
      state.message = action.payload.message;
    },


    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
    },
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
      if (action.payload.isStatus !== undefined)
        state.isStatus = action.payload.isStatus
    },
    Count(state, action: PayloadAction<any | null>) { },
    CountSuccesss(state, action: PayloadAction<any | null>) {
      state.count = action.payload.count;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    LoadingAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload.status;
    },
  },
});

export const {
  actions: priceCommissionAction,
  reducer: priceCommissionReducer,
  name: sliceKeyPriceCommission,
} = priceCommissionSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.priceCommission || initialState;

export const selectPriceCommission = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.priceCommission;

function* priceCommissionAPI(props) {
  try {
    yield put(priceCommissionAction.LoadingAction({ status: true }));
    const i = yield select(getState);
    const service = i?.priceData?.serviceType

    let apiResponse: any = null;
    if (i.priceData.serviceType === 'electric') {
      apiResponse = yield backendApi.listData(i.obj, service);
    }
    else if (i.obj.filter.ldz && i.obj.filter.ldz !== null || i.obj.filter.ldz !== undefined) {
      apiResponse = yield backendApi.listData(i.obj, service);
    }
    else if (i.ldz.length === 1) {
      apiResponse = yield backendApi.listData(i.obj, service);
    }
    else if (i.isPostcode === true && (i.obj.filter.ldz === null || i.obj.filter.ldz === undefined)) {
      yield put(globalConfigActions.enableFeedback("Please select the LDZ"));
    }

    const count = apiResponse.isNext === false ? (i.obj.page - 1) * i.obj.limit + apiResponse.data.length : -1
    if (apiResponse)
      yield put(priceCommissionAction.LoadingAction({ status: false }));
    yield put(priceCommissionAction.BasicActions({ count }));
    yield put(priceCommissionAction.ListSuccess(apiResponse));
    if (apiResponse.message)
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    yield put(priceCommissionAction.ListSuccess([]));
  }
}

function* getLdzFromPostcodeAPI(props) {
  try {
    yield put(priceCommissionAction.LoadingAction({ status: true }));
    const i = yield select(getState);
    const service = i?.priceData?.serviceType
    const apiResponse = yield backendApi.ldzFromPostcode(props.payload);
    if (apiResponse)
      yield put(priceCommissionAction.LoadingAction({ status: false }));
    yield put(priceCommissionAction.getLdzFromPostcodeSuccess(apiResponse));
    if (apiResponse.message)
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    yield put(priceCommissionAction.getLdzFromPostcodeFailed([]));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* priceCommissionSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(priceCommissionAction.List.type, priceCommissionAPI);
  yield takeLatest(priceCommissionAction.NewPage.type, priceCommissionAPI);
  yield takeLatest(priceCommissionAction.ChangeLimit.type, priceCommissionAPI);
  yield takeLatest(priceCommissionAction.SupplierFilter.type, priceCommissionAPI);
  yield takeLatest(priceCommissionAction.DuartionFilter.type, priceCommissionAPI);
  yield takeLatest(priceCommissionAction.getLdzFromPostcode.type, getLdzFromPostcodeAPI);

}
