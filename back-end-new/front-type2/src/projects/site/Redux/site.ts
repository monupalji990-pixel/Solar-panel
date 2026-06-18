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
import backendApi from "./model/site";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import site from "./model/site";
import { companyAction } from "../../company/redux/company";

export interface site {
  siteList: any;
  currentSite: any;
  companyId: any;
  count: number;
  limit: number;
  page: number;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  message: string;
  messageCode: string;
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  editRemote: boolean;
  isLoadingData: boolean;
  siteListForLeadDropDown: any;
}
export type ContainerState = site;

export const initialState: ContainerState = {
  siteList: [],
  currentSite: {},
  companyId: "",
  count: 0,
  limit: 10,
  page: 1,
  hideSideBar: false,
  remote: false,
  isLoadingData: true,
  searchText: "",
  message: "",
  messageCode: "-",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  editRemote: false,
  siteListForLeadDropDown: []
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      if (action.payload.slug) state.slug = action.payload.slug;
      state.companyId = action.payload.companyId
        ? action.payload.companyId
        : "";
      state.companyId =
        action.payload.company !== undefined ? action.payload.company._id : "";
    },
    addSite(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    siteUnsetToster(state, action: PayloadAction<any>) {
      state.messageCode = "-";
    },

    List(state, action: PayloadAction<any | null>) { },

    ListSuccess(state, action: PayloadAction<any>) {
      state.siteList = action.payload.data.map((e) => {
        return {
          _id: e._id,
          siteName: e.siteName ? e.siteName : '-',
          siteAddress: e.siteAddress ? e.siteAddress : '-',
          town: e.town ? e.town : '-',
          city: e.city ? e.city:'-',
          country: e.country ? e.country :'-',
          postcode: e.postcode ? e.postcode:'-',
          contactPerson:
            e.User !== undefined && e.User && e.User.length > 0
              ? helperMethods.formatArrayToString(e.User, "name")
              : "",
        };
      });
      state.count = 10;
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { },

    viewSite(state, action: PayloadAction<any>) { },

    currentSiteData(state, action: PayloadAction<any>) {
      state.currentSite = action.payload.data;
    },

    editSite(state, action: PayloadAction<any>) { },
    LoaderEnd(state, action: PayloadAction<any>) {
      state.editRemote = action.payload;
    },

    DeleteSite(state, action: PayloadAction<any>) { },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    siteListForleadDropDown(state, action: PayloadAction<any>) {
      state.remote = false;
    },
    siteListForleadDropDownSuccess(state, action: PayloadAction<any>) {
      state.remote = true;
      state.siteListForLeadDropDown = action.payload.data;
    }
  },
});

export const {
  actions: siteAction,
  reducer: siteReducer,
  name: sliceKeySite,
} = siteSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.site || initialState;

export const selectSiteState = createSelector([selectDomain], (State) => State);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.site;

function* addSite(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addSite(i, props.payload.value);
    yield put(globalConfigActions.enableFeedback("Site added successfully"));

    yield put(siteAction.List({ companyId: props.payload.value.companyId }));
    if (props.payload.showingFrom === "viewCompany")
      yield put(
        companyAction.singleCompany({
          companyId: props.payload.value.companyId,
        })
      );
    yield put(siteAction.setIsLoadingData(false));
    yield put(companyAction.List(null));
  } catch (error) {
  }
}

function* siteListOfCompany(props) {
  try {
    let i = yield select(getState);
    if (
      props.payload != null &&
      props.payload !== undefined &&
      props.payload.companyId !== undefined &&
      props.payload.companyId != ""
    ) {
      i = props.payload;
    }

    const apiResponse = yield backendApi.siteListOfCompany(i);
    yield put(siteAction.ListSuccess(apiResponse));
  } catch (error) { }
}

function* siteListForleadDropDown(props) {
  try {
    const apiResponse = yield backendApi.siteListForLeadDropDown(props.payload);
    if (apiResponse.success)
      yield put(siteAction.siteListForleadDropDownSuccess(apiResponse));
  } catch (error) { }
}

function* viewSite(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewSite(i, props.payload);
    yield put(siteAction.currentSiteData(apiResponse));
    yield put(siteAction.LoaderEnd(true));
  } catch (error) {
    [];
  }
}

function* editSite(props) {
  try {
    const i = yield select(getState);
    yield backendApi.editSite(i, props.payload);

    yield put(globalConfigActions.enableFeedback("Site edited successfully"));
    yield put(
      companyAction.singleCompany({ companyId: props.payload.companyId })
    );
    yield put(siteAction.List({ companyId: props.payload.companyId }));
    yield put(siteAction.setIsLoadingData(false));
    yield put(siteAction.viewSite({ site: { _id: props.payload.findId } }))
    yield put(siteAction.List(null));
  } catch (error) {
    [];
  }
}

function* deleteSite(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteSite(i, props.payload);

    yield put(globalConfigActions.enableFeedback("Site deleted successfully"));

    yield put(siteAction.List(null));
    if (props.payload.showingFrom === "viewCompany")
      yield put(
        companyAction.singleCompany({ companyId: props.payload.companyId })
      );
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* siteSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(siteAction.NewPage.type, siteListOfCompany);
  yield takeLatest(siteAction.tableSort.type, siteListOfCompany);
  yield takeLatest(siteAction.ChangeLimit.type, siteListOfCompany);
  yield takeLatest(siteAction.Search.type, siteListOfCompany);
  yield takeLatest(siteAction.addSite.type, addSite);
  yield takeLatest(siteAction.List.type, siteListOfCompany);
  yield takeLatest(siteAction.viewSite.type, viewSite);
  yield takeLatest(siteAction.editSite.type, editSite);
  yield takeLatest(siteAction.DeleteSite.type, deleteSite);
  yield takeLatest(siteAction.siteListForleadDropDown.type, siteListForleadDropDown);
}
