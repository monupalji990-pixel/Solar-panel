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
import backendApi from "./model/verbal";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface verbalDoc {
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
  docList: any;
  docOptions: IDocOptions;
  viewDoc: any;
  template: Itemplate;
  pdfStr: string;
  loadingForUpload: boolean;
}
interface Itemplate {
  templateList: any;
  isNext: boolean;
  skip: number;
  limit: number;
  search: string;
  isLoading: boolean;
  page: number;
  slug: string;
}

export const initialTemplate = {
  templateList: [],
  isNext: true,
  skip: 0,
  limit: 10,
  search: "",
  page: 1,
  isLoading: false,
  slug: "",
};
export type ContainerState = verbalDoc;
interface IDocOptions {
  openAddDocDrawer: boolean;
  openViewDocDrawer: boolean;
}
export const initialState: ContainerState = {
  docList: [],
  count: -1,
  limit: 10,
  isNext: false,
  page: 1,
  hideSideBar: false,
  remote: false,
  searchText: "",
  message: "",
  messageCode: "-",
  sort: "sentDocumentTimestamp",
  sortType: "desc",
  slug: "",
  type: "",
  isLoadingData: false,
  docOptions: {
    openAddDocDrawer: false,
    openViewDocDrawer: false,
  },
  template: initialTemplate,
  viewDoc: {},
  pdfStr: "",
  loadingForUpload: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const verbalDocSlice = createSlice({
  name: "verbalDoc",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) { },
    ListSuccess(state, action: PayloadAction<any>) {
      state.docList = action.payload.data;
      state.isNext = action.payload.isNext;
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { },
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    NewPageFailure(state, action: PayloadAction<{ page: number }>) { },
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

    roleList(state, action: PayloadAction<any>) { },
    roleListSuccess(state, action: PayloadAction<any>) { },

    editCompany(state, action: PayloadAction<any>) {
    },
    currentCompanyrData(state, action: PayloadAction<any>) {
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.template.slug = action.payload.slug;
    },
    deleteDoc(state, action: PayloadAction<any>) { },
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },
    Count(state, action: PayloadAction<any | null>) { },
    CountSuccesss(state, action: PayloadAction<any | null>) {
      state.count = action.payload.count;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    changeAddDocDrawerStatus(state, action: PayloadAction<any>) {
      state.docOptions.openAddDocDrawer = action.payload;
    },
    changeViewDocDrawerStatus(state, action: PayloadAction<any>) {
      state.docOptions.openViewDocDrawer = action.payload;
    },
    viewDoc(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    viewDocSuccess(state, action: PayloadAction<any>) {
      state.viewDoc = action.payload;
      state.isLoadingData = false;
    },
    createDoc(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    createDocSuccess(state, action: PayloadAction<any>) {
      state.pdfStr = action.payload;
      state.isLoadingData = false;
    },
    getListOfTemplate(state, actions: PayloadAction<any>) {
      state.template.isLoading = true;
    },
    getListOfTemplateSuccess(state, actions: PayloadAction<any>) {
      state.template.isLoading = false;
      state.template.templateList = actions.payload.data;
      state.template.isNext = actions.payload.isNext;
    },
    templateListChangelimit(state, action: PayloadAction<any>) {
      state.template.limit = action.payload.limit;
    },
    changePdfStr(state, action: PayloadAction<any>) {
      state.pdfStr = action.payload;
    },
    changeLoadingState(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    savePdf(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    savePdfSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
      state.pdfStr = action.payload;
    },
    attachedSignPdf(state, action: PayloadAction<any>) {
      state.loadingForUpload = true;
    },
    attachedSignPdfSuccess(state, action: PayloadAction<any>) {
      state.loadingForUpload = false;
      state.viewDoc = action.payload;
    },
  },
});

export const {
  actions: verbalDocAction,
  reducer: verbalDocReducer,
  name: sliceKeyVerbalDoc,
} = verbalDocSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.verbalDoc || initialState;

export const selectDocState = createSelector([selectDomain], (State) => State);

export const selectDocList = createSelector(
  [selectDomain],
  (State) => State.docList
);

export const selectDocOptions = createSelector(
  [selectDomain],
  (State) => State.docOptions
);

export const selectTemplateFromVerbalDoc = createSelector(
  [selectDomain],
  (State) => State.template
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.verbalDoc;

export const getTemplateState = (state: RootState) => state.verbalDoc.template;

export function* docList(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.docList(props.payload, i);

    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(verbalDocAction.BasicActions({ count }));
    yield put(verbalDocAction.ListSuccess(apiResponse));
  } catch (error) {
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* createDoc(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.getPopulatedPdf(props.payload);
    if (apiResponse.success) {
      yield put(verbalDocAction.createDocSuccess(apiResponse.data));
    }
    yield put(verbalDocAction.changeLoadingState(false));

    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* viewDoc(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.ViewDoc(state, props.payload);
    if (apiResponse.success) {
      yield put(verbalDocAction.viewDocSuccess(apiResponse.data));
    } else {
      yield put(verbalDocAction.viewDocSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

function* savePdf(props) {
  try {
    const apiResponse = yield backendApi.savePopulatedPdf(props.payload);
    if (apiResponse.success) {
      yield put(verbalDocAction.savePdfSuccess(""));
      yield put(verbalDocAction.List(null));
    }
    yield put(verbalDocAction.changeLoadingState(false));
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* getListOfTemplate(props) {
  try {
    const state = yield select(getTemplateState);
    const apiResponse = yield backendApi.getTemplateList(state);
    if (apiResponse.success) {
      yield put(verbalDocAction.getListOfTemplateSuccess(apiResponse));
    } else {
      yield put(verbalDocAction.getListOfTemplateSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

function* attachSignedPdf(props) {
  try {
    const apiResponse = yield backendApi.attachedSignedPdf(props.payload);
    if (apiResponse.success) {
      yield put(verbalDocAction.attachedSignPdfSuccess(apiResponse.data));
      yield put(verbalDocAction.List(null));
    }
    yield put(verbalDocAction.changeLoadingState(false));
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export function* verbalDocSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(verbalDocAction.List.type, docList);
  yield takeLatest(verbalDocAction.createDoc.type, createDoc);
  yield takeLatest(verbalDocAction.viewDoc.type, viewDoc);
  yield takeLatest(verbalDocAction.NewPage.type, docList);
  yield takeLatest(verbalDocAction.ChangeLimit.type, docList);
  yield takeLatest(verbalDocAction.Search.type, docList);
  yield takeLatest(verbalDocAction.tableSort.type, docList);
  yield takeLatest(verbalDocAction.getListOfTemplate.type, getListOfTemplate);
  yield takeLatest(verbalDocAction.templateListChangelimit.type, getListOfTemplate);
  yield takeLatest(verbalDocAction.savePdf.type, savePdf);
  yield takeLatest(verbalDocAction.attachedSignPdf.type, attachSignedPdf);
}
