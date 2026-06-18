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
import backendApi from "./model/digital";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface digitalDoc {
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
  idForList: string;
  showingFrom: string;
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
  type: string;
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
  type: "",
};
export type ContainerState = digitalDoc;
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
  idForList: "",
  showingFrom: "",
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const digitalDocSlice = createSlice({
  name: "digitalDoc",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {
      if (action.payload.id && action.payload.showingFrom)
        state.idForList = action.payload.id;
      state.showingFrom = action.payload.showingFrom;
    },
    ListSuccess(state, action: PayloadAction<any>) {
      state.docList = action.payload.data;
      state.isNext = action.payload.isNext;
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { 
      state.docList = [];
      state.isNext = false;
      state.remote = true;
    },
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
      state.template.type = actions.payload;
      state.template.isLoading = true;
    },
    getListOfTemplateSuccess(state, actions: PayloadAction<any>) {
      state.template.isLoading = false;
      state.template.templateList = actions.payload.data;
      state.template.isNext = actions.payload.isNext;
    },
    changeTemplateListType(state, actions: PayloadAction<any>) {
      state.template.type = actions.payload;
    },
    templateListChangelimit(state, action: PayloadAction<any>) {
      state.template.limit = action.payload.limit;
      state.template.isLoading = true;
    },
    changePdfStr(state, action: PayloadAction<any>) {
      state.pdfStr = action.payload;
    },
    changeLoadingState(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
      state.loadingForUpload = false;
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
    attachedVerbalPdf(state, action: PayloadAction<any>) {
      state.loadingForUpload = true;
    },
    attachedVerbalPdfSuccess(state, action: PayloadAction<any>) {
      state.loadingForUpload = false;
      state.viewDoc = action.payload;
    },
  },
});

export const {
  actions: digitalDocAction,
  reducer: digitalDocReducer,
  name: sliceKeyDigitalDoc,
} = digitalDocSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.digitalDoc || initialState;

export const selectDocState = createSelector([selectDomain], (State) => State);

export const selectDocList = createSelector(
  [selectDomain],
  (State) => State.docList
);

export const selectDocOptions = createSelector(
  [selectDomain],
  (State) => State.docOptions
);

export const selectTemplateFromDigitalDoc = createSelector(
  [selectDomain],
  (State) => State.template
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.digitalDoc;

export const getTemplateState = (state: RootState) => state.digitalDoc.template;

export function* docList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.docList(props.payload, i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;
    yield put(digitalDocAction.BasicActions({ count }));
    yield put(digitalDocAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(digitalDocAction.ListFailure([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* createDoc(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.getPopulatedPdf(state, props.payload);
    if (apiResponse.success) {
      yield put(digitalDocAction.createDocSuccess(apiResponse.data));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(digitalDocAction.changeLoadingState(false));
  } catch (error) {
    console.log(error);
  }
}

function* viewDoc(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.ViewDoc(state, props.payload);
    if (apiResponse.success) {
      yield put(digitalDocAction.viewDocSuccess(apiResponse.data));
    } else {
      yield put(digitalDocAction.viewDocSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

function* savePdf(props) {
  try {
    const state = yield select(getState);

    const apiResponse = yield backendApi.savePopulatedPdf(state, props.payload);
    if (apiResponse.success) {
      yield put(digitalDocAction.savePdfSuccess(""));
      console.log(props.payload);

      yield put(
        digitalDocAction.List({
          id: state.idForList,
          showingFrom: state.showingFrom,
        })
      );
      yield put(digitalDocAction.changeAddDocDrawerStatus(false));
    }
    yield put(digitalDocAction.changeLoadingState(false));
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
      yield put(digitalDocAction.getListOfTemplateSuccess(apiResponse));
    } else {
      yield put(digitalDocAction.getListOfTemplateSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

function* attachSignedPdf(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.attachedSignedPdf(state, props.payload);
    if (apiResponse.success) {
      yield put(digitalDocAction.attachedSignPdfSuccess(apiResponse.data));
      yield put(digitalDocAction.List({
        id: state.idForList,
        showingFrom: state.showingFrom,
      }));
    }
    yield put(digitalDocAction.changeLoadingState(false));
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}
function* attachedVerbalPdf(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.attachedForVerbal(state, props.payload);
    if (apiResponse.success) {
      yield put(digitalDocAction.attachedSignPdfSuccess(apiResponse.data));
      yield put(digitalDocAction.List({
        id: state.idForList,
        showingFrom: state.showingFrom,
      }));
    }
    yield put(digitalDocAction.changeLoadingState(false));
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* digitalDocSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(digitalDocAction.List.type, docList);
  yield takeLatest(digitalDocAction.createDoc.type, createDoc);
  yield takeLatest(digitalDocAction.viewDoc.type, viewDoc);
  yield takeLatest(digitalDocAction.NewPage.type, docList);
  yield takeLatest(digitalDocAction.ChangeLimit.type, docList);
  yield takeLatest(digitalDocAction.Search.type, docList);
  yield takeLatest(digitalDocAction.tableSort.type, docList);
  yield takeLatest(digitalDocAction.getListOfTemplate.type, getListOfTemplate);
  yield takeLatest(
    digitalDocAction.templateListChangelimit.type,
    getListOfTemplate
  );
  yield takeLatest(digitalDocAction.savePdf.type, savePdf);
  yield takeLatest(digitalDocAction.attachedSignPdf.type, attachSignedPdf);
  yield takeLatest(digitalDocAction.attachedVerbalPdf.type, attachedVerbalPdf);
}
