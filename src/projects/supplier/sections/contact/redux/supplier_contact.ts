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
import backendApi from "./model/supplier_contact";
import { globalConfigActions } from "../../../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface supplier_contact {
  contactList: any;
  count: number;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  sort: string;
  sortType: string;
  slug: string;
  supplierId: string;
  currentContact: any;
  message: string;
}
export type ContainerState = supplier_contact;

export const initialState: ContainerState = {
  contactList: [],
  count: 0,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  sort: "timestamps",
  sortType: "desc",
  slug: "",
  supplierId: "",
  currentContact: {},
  message: "",
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const supplier_contactSlice = createSlice({
  name: "supplier_contact",
  initialState,
  reducers: {
    supplier_contactList(state, action: PayloadAction<object | null>) { },
    supplier_contactListSuccess(state, action: PayloadAction<any>) {
      state.contactList = action.payload.data.map((e) => {
        return {
          contactPersonName: e.ContactPersonName,
          Email: e.Email,
          telephoneNumber: e.TelephoneNumber,
          Department: e.Department,
          jobTitle: e.jobTitle,
          Address: e.Address,
        };
      });
      state.count = action.payload.count;
      state.remote = true;
    },
    supplier_contactListFailure(state, action: PayloadAction<any>) { },
    supplier_contactNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    supplier_contactNewPageSuccess(
      state,
      action: PayloadAction<{ page: number }>
    ) { },
    supplier_contactNewPageFailure(
      state,
      action: PayloadAction<{ page: number }>
    ) { },
    supplier_contactLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    supplier_contactLoaderEnd(state, action: PayloadAction<any>) {
      state.remote = action.payload;
    },
    supplier_contactChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },
    supplier_contactSearch(
      state,
      action: PayloadAction<{ searchText: string }>
    ) {
      state.searchText = action.payload.searchText;
    },
    supplier_contactCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    supplier_contactHideSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload.status;
    },

    supplier_contactSlugUpdate(state, action: PayloadAction<any>) {
      state.supplierId =
        action.payload.supplier !== undefined
          ? action.payload.supplier._id
          : "";
      state.slug = action.payload.slug;
    },
    addSupplier_contact(state, action: PayloadAction<any>) {
    },
    addSupplier_contactSuccess(state, action: PayloadAction<any>) {
    },
    addSupplier_contactFailure(state, action: PayloadAction<any>) {
    },

    supplier_contactListOfCompany(state, action: PayloadAction<any>) {
    },
    viewSupplier_contactReq(state, action: PayloadAction<any>) { },
    currentSupplier_contactData(state, action: PayloadAction<any>) {
      state.currentContact = action.payload.data;
    },

    updateSupplier_contact(state, action: PayloadAction<any>) {
    },
    deleteSupplier_contact(state, action: PayloadAction<any>) {
    },
  },
});

export const {
  actions: supplier_contactAction,
  reducer: supplier_contactReducer,
  name: sliceKeySupplier_contact,
} = supplier_contactSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) =>
  state.supplier_contact || initialState;

export const selectSupplier_contactState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.supplier_contact;

export function* supplier_contactList(props: any) {
  try {
    const i = yield select(getState);
    let apiResponse = null;
    if (props.payload == null)
      apiResponse = yield backendApi.contactListOfSupplier(i);
    else {
      apiResponse = yield backendApi.contactListOfSupplier(props.payload);
    }
    yield put(supplier_contactAction.supplier_contactListSuccess(apiResponse));
  } catch (error) {
    yield put(supplier_contactAction.supplier_contactListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* viewContact(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewContact(i, props.payload);

    yield put(supplier_contactAction.currentSupplier_contactData(apiResponse));
    yield put(supplier_contactAction.supplier_contactLoaderEnd(true));
  } catch (error) {
    console.log("error in add view supplier contact", error);
  }
}

function* addContact(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addContact(i, props.payload);
    yield put(globalConfigActions.enableFeedback("contact added successfully"));

    yield put(
      supplier_contactAction.supplier_contactHideSideBar({ status: true })
    );
    yield put(supplier_contactAction.supplier_contactLoaderStart(false));
    yield supplier_contactList(null);
  } catch (error) {
    console.log("error in add new User", error);
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(
      supplier_contactAction.supplier_contactHideSideBar({ status: true })
    );
  }
}

function* updateContact(props) {
  try {
    const i = yield select(getState);
    yield backendApi.updateContact(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Contact Updated successfully")
    );
    yield put(
      supplier_contactAction.supplier_contactHideSideBar({ status: true })
    );
    yield put(supplier_contactAction.supplier_contactLoaderStart(false));
    yield supplier_contactList(null);
  } catch (error) {
    [];
  }
}

function* deleteContact(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteContact(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Contact deleted Successfully")
    );
    yield put(
      supplier_contactAction.supplier_contactHideSideBar({ status: true })
    );
    yield supplier_contactList(null);
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* supplier_contactSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(
    supplier_contactAction.supplier_contactList.type,
    supplier_contactList
  );
  yield takeLatest(
    supplier_contactAction.supplier_contactNewPage.type,
    supplier_contactList
  );
  yield takeLatest(
    supplier_contactAction.supplier_contactChangeLimit.type,
    supplier_contactList
  );
  yield takeLatest(
    supplier_contactAction.supplier_contactSearch.type,
    supplier_contactList
  );
  yield takeLatest(supplier_contactAction.addSupplier_contact.type, addContact);
  yield takeLatest(
    supplier_contactAction.viewSupplier_contactReq.type,
    viewContact
  );
  yield takeLatest(
    supplier_contactAction.supplier_contactListOfCompany.type,
    supplier_contactList
  );
  yield takeLatest(
    supplier_contactAction.updateSupplier_contact.type,
    updateContact
  );
  yield takeLatest(
    supplier_contactAction.deleteSupplier_contact.type,
    deleteContact
  );
}
