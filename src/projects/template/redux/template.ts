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
import backendApi from "./model/template";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface template {
  count: number;
  limit: number;
  isNext: boolean;
  page: number;
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
  templateList: any;
  templateOptions: ItemplateOptions;
  fieldsOfPdf: any;
  templatePdfTobeUpload: any;
  viewTemPlate: any;
  toBeReplaceTemplate: any;
}
export type ContainerState = template;
interface ItemplateOptions {
  openAddTemplateDrawer: boolean;
  openViewTemplateDrawer: boolean;
  openReplaceTemplateDrawer: boolean;
}
export const initialState: ContainerState = {
  templateList: [],
  count: -1,
  limit: 10,
  isNext: false,
  page: 1,
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
  templateOptions: {
    openAddTemplateDrawer: false,
    openViewTemplateDrawer: false,
    openReplaceTemplateDrawer: false,
  },
  fieldsOfPdf: [],
  templatePdfTobeUpload: {},
  viewTemPlate: {},
  toBeReplaceTemplate: {},
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {},
    ListSuccess(state, action: PayloadAction<any>) {
      state.templateList = action.payload;
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) {},
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) {},
    NewPageFailure(state, action: PayloadAction<{ page: number }>) {},
    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    ChangeLimit(state, action: PayloadAction<any>) {
      state.limit = action.payload.limit;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
      state.message = action.payload.message;
    },

    addCompany(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    addCompanySuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    addCompanyFailure(state, action: PayloadAction<any>) {
    },

    roleList(state, action: PayloadAction<any>) {},
    roleListSuccess(state, action: PayloadAction<any>) {},

    editCompany(state, action: PayloadAction<any>) {
    },
    currentCompanyrData(state, action: PayloadAction<any>) {
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
    },
    deleteTemplate(state, action: PayloadAction<any>) {},
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },
    Count(state, action: PayloadAction<any | null>) {},
    CountSuccesss(state, action: PayloadAction<any | null>) {
      state.count = action.payload.count;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    changeAddTemplateDrawerStatus(state, action: PayloadAction<any>) {
      state.templateOptions.openAddTemplateDrawer = action.payload;
    },
    changeViewTemplateDrawerStatus(state, action: PayloadAction<any>) {
      state.templateOptions.openViewTemplateDrawer = action.payload;
    },
    changeReplaceTemplateDrawerStatus(state, action: PayloadAction<any>) {
      state.templateOptions.openReplaceTemplateDrawer = action.payload;
    },
    viewTemplate(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    viewTemplateSuccess(state, action: PayloadAction<any>) {
      state.viewTemPlate = action.payload;
      state.isLoadingData = false;
    },
    getFieldsOfPdf(state, action: PayloadAction<any>) {},
    getFieldsOfPdfSuccess(state, action: PayloadAction<any>) {
      state.fieldsOfPdf = action.payload;
    },
    changeTemplatePdfTobeUpload(state, action: PayloadAction<any>) {
      state.templatePdfTobeUpload = action.payload;
    },
    createTemplate(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    createTemplateSuccess(state, action: PayloadAction<any>) {
      state.templatePdfTobeUpload = initialState.templatePdfTobeUpload;
      state.fieldsOfPdf = initialState.fieldsOfPdf;
      state.isLoadingData = false;
      state.templateOptions.openAddTemplateDrawer = false;
    },
    changeTobeReplaceTemplate(state, action: PayloadAction<any>) {
      state.toBeReplaceTemplate = action.payload;
    },
  },
});

export const {
  actions: templateAction,
  reducer: templateReducer,
  name: sliceKeyTemplate,
} = templateSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.template || initialState;

export const selectTemplateState = createSelector(
  [selectDomain],
  (State) => State
);

export const selectTemplateOptions = createSelector(
  [selectDomain],
  (State) => State.templateOptions
);

export const selectTemplateList = createSelector(
  [selectDomain],
  (State) => State.templateList
);

export const selectToBeReplaceTemplate = createSelector(
  [selectDomain],
  (State) => State.toBeReplaceTemplate
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.template;

export function* templateList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.templateList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(templateAction.BasicActions({ count }));
    yield put(templateAction.ListSuccess(apiResponse.data));
  } catch (error) {
    yield put(templateAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* getFieldsOfPdf(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.getFormFields(state, props.payload);
    if (apiResponse.success) {
      yield put(templateAction.getFieldsOfPdfSuccess(apiResponse.data));
      yield put(
        globalConfigActions.enableFeedback("form fields fetch successfully")
      );
    } else {
      yield put(templateAction.getFieldsOfPdfSuccess([]));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    yield put(templateAction.getFieldsOfPdfSuccess([]));
  }
}

function* createTemplate(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.createTemplate(state, props.payload);
    if (apiResponse.success) {
      yield put(templateAction.createTemplateSuccess(null));
      yield put(templateAction.List(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* deleteTemplate(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.deleteTemplate(state, props.payload);
    if (apiResponse.success) {
      yield put(templateAction.List(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* viewTemPlate(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.viewTemplate(state, props.payload);
    if (apiResponse.success) {
      yield put(templateAction.viewTemplateSuccess(apiResponse.data));
    } else {
      yield put(templateAction.viewTemplateSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* templateSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(templateAction.List.type, templateList);
  yield takeLatest(templateAction.getFieldsOfPdf.type, getFieldsOfPdf);
  yield takeLatest(templateAction.createTemplate.type, createTemplate);
  yield takeLatest(templateAction.deleteTemplate.type, deleteTemplate);
  yield takeLatest(templateAction.viewTemplate.type, viewTemPlate);
  yield takeLatest(templateAction.NewPage.type, templateList);
  yield takeLatest(templateAction.ChangeLimit.type, templateList);
  yield takeLatest(templateAction.Search.type, templateList);
  yield takeLatest(templateAction.tableSort.type, templateList);
}
