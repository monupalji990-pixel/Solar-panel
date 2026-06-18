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
import backendApi from "./modal/sendinblueContact";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface sendinblueContact {
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
  contactList: any;
  contactOptions: ItemplateOptions;
  listContactList: any;
  fieldsOfPdf: any;
  templatePdfTobeUpload: any;
  viewContact: any;
  toBeReplaceTemplate: any;
}
export type ContainerState = sendinblueContact;
interface ItemplateOptions {
  openAddContactDrawer: boolean;
  openViewContactDrawer: boolean;
}
export const initialState: ContainerState = {
  contactList: [],
  listContactList: [],
  count: 0,
  limit: 50,
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
  contactOptions: {
    openAddContactDrawer: false,
    openViewContactDrawer: false
  },
  fieldsOfPdf: [],
  templatePdfTobeUpload: {},
  viewContact: {},
  toBeReplaceTemplate: {},
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const contactSlice = createSlice({
  name: "sendinblueContact",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {
      state.remote = true;
    },
    ListSuccess(state, action: PayloadAction<any>) {
      console.log(action.payload);
      state.remote = false;
      state.contactList = action.payload;
    },
    ListContactList(state, action: PayloadAction<any | null>) { },
    listContactListSuccess(state, action: PayloadAction<any>) {
      state.listContactList = action.payload;
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
    addCompany(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    addContactSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    addConsumerFailure(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    roleList(state, action: PayloadAction<any>) { },
    roleListSuccess(state, action: PayloadAction<any>) { },

    editContact(state, action: PayloadAction<any>) {
    },
    currentCompanyrData(state, action: PayloadAction<any>) {
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
    },
    deleteContact(state, action: PayloadAction<any>) { },
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
    changeAddTemplateDrawerStatus(state, action: PayloadAction<any>) {
      state.contactOptions.openAddContactDrawer = action.payload;
    },
    changeViewTemplateDrawerStatus(state, action: PayloadAction<any>) {
      state.contactOptions.openViewContactDrawer = action.payload;
    },

    viewContact(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    viewContactSuccess(state, action: PayloadAction<any>) {
      state.viewContact = action.payload;
      state.isLoadingData = false;
    },
    getFieldsOfPdf(state, action: PayloadAction<any>) { },
    getFieldsOfPdfSuccess(state, action: PayloadAction<any>) {
      state.fieldsOfPdf = action.payload;
    },
    changeTemplatePdfTobeUpload(state, action: PayloadAction<any>) {
      state.templatePdfTobeUpload = action.payload;
    },
    createContact(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    createContactSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
      state.contactOptions.openAddContactDrawer = false;
    },
    changeTobeReplaceTemplate(state, action: PayloadAction<any>) {
      state.toBeReplaceTemplate = action.payload;
    },
  },
});

export const {
  actions: contactAction,
  reducer: sendinblueContactReducer,
  name: sliceKeySendinblueContact,
} = contactSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.sendinblueContact || initialState;

export const selectSendinblueContactState = createSelector(
  [selectDomain],
  (State) => State
);

export const selectContactOptions = createSelector(
  [selectDomain],
  (State) => State.contactOptions
);

export const selectToBeReplaceTemplate = createSelector(
  [selectDomain],
  (State) => State.toBeReplaceTemplate
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.sendinblueContact;

export function* listContactList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.listContactList(i);

    yield put(contactAction.listContactListSuccess(apiResponse.data));
  } catch (error) {
    yield put(contactAction.listContactListSuccess([]));
  } finally {
    if (yield cancelled()) {
    }
  }
}

export function* listContacts(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.listContact(i);
    yield put(contactAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(contactAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
    }
  }
}



function* createContact(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.createSendinblueConntact(state, props.payload);
    if (apiResponse.success) {
      yield put(contactAction.createContactSuccess(null));
      yield put(contactAction.List(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* deleteContact(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.deleteContact(state, props.payload);
    if (apiResponse.success) {
      yield put(contactAction.List(null));
    }
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* viewContact(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.viewContact(state, props.payload);
    if (apiResponse.success) {
      yield put(contactAction.viewContactSuccess(apiResponse.data));
    } else {
      yield put(contactAction.viewContactSuccess({}));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
  }
}

function* updateContact(props) {
  try {
    const state = yield select(getState);
    const apiResponse = yield backendApi.editContact(state, props.payload);
    if (apiResponse.success) {
      yield put(contactAction.viewContact({ identifier: props.payload.identifier }));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    console.log(error);
    yield put(globalConfigActions.enableFeedback(error.message));

  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* sendinblueContactSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(contactAction.ListContactList.type, listContactList);
  yield takeLatest(contactAction.List.type, listContacts);
  yield takeLatest(contactAction.createContact, createContact);
  yield takeLatest(contactAction.deleteContact.type, deleteContact);
  yield takeLatest(contactAction.editContact.type, updateContact);
  yield takeLatest(contactAction.viewContact.type, viewContact);
  yield takeLatest(contactAction.NewPage.type, listContacts);
  yield takeLatest(contactAction.ChangeLimit.type, listContacts);
}
