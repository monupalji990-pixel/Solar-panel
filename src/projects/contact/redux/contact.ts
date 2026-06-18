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
import backendApi from "./model/contact";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import { companyAction } from "../../company/redux/company";

export interface contact {
  contactList: any;
  contactId: any;
  companyId: any;
  count: number;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  message: string;
  messageCode: string;
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  singleContact: any;
  isLoadingData: boolean;
}
export type ContainerState = contact;

export const initialState: ContainerState = {
  contactList: [],
  contactId: "",
  companyId: "",
  count: 0,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  messageCode: "-",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  singleContact: {},
  isLoadingData: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    List(state, action: PayloadAction<object | null>) { },
    ListSuccess(state, action: PayloadAction<any>) {
      state.contactList = action.payload.data.map((e) => {
        return {
          _id: e._id,
          contactName: e.name ? e.name : '-',
          contactOffice: e.phone ? e.phone : '-',
          contactMobile: e.mobile ? e.mobile : '-',
          contactEmail: e.email ? e.email : '-',
          homeAddress: e.homeAddress ? e.homeAddress : '-',
          jobTitle: e.jobTitle ? e.jobTitle : '-',
          DOB: e.DOB ? helperMethods.ConvertDate(e.DOB) : "",
          nationalInsurance: e.nationalInsurance ? e.nationalInsurance : '-',
        };
      });
      state.count = action.payload.count;
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
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },

    LoaderEnd(state, action: PayloadAction<any>) {
      state.remote = action.payload;
    },

    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      if (action.payload.contactId) {
        state.contactId = action.payload.contactId;
      }
      state.companyId = action.payload.companyId;
      if (action.payload.slug) state.slug = action.payload.slug;
    },
    addCompanyContact(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    ContactListOfCompany(state, action: PayloadAction<any>) { },
    ViewSingleContact(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    SingleContactDetailSuccess(state, action: PayloadAction<any>) {
      state.singleContact = action.payload.contact;
    },
    DeleteContact(state, action: PayloadAction<any>) { },
    EditContact(state, action: PayloadAction<any>) { },

    LoaderAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: contactAction,
  reducer: contactReducer,
  name: sliceKeyContact,
} = contactSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.contact || initialState;

export const selectContactState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.contact;

function* addContact(props) {
  try {
    const i = yield select(getState);
    let response = yield backendApi.addContact(i, props.payload);
    if (!response.success) {
      yield put(globalConfigActions.enableFeedback(response.message));
    } else {
      yield put(globalConfigActions.enableFeedback(response.message));
    }
    yield put(contactAction.CloseSideBar(true));
    yield put(contactAction.LoaderAction(false));
    yield put(contactAction.LoaderStart(false));
    yield put(contactAction.SlugUpdate({ companyId: props.payload.companyId }));

    yield put(
      companyAction.singleCompany({ companyId: props.payload.companyId })
    );
    yield put(
      contactAction.ContactListOfCompany({ companyId: props.payload.companyId })
    );

    yield contactListOfCompany();
  } catch (error) {
    if (
      error &&
      ((error.err && error.err.code === 11000) ||
        (error.data && error.data.err.code === 11000))
    ) {
      yield put(
        globalConfigActions.enableFeedback(
          "Email already exist, please change the email address"
        )
      );
      yield put(contactAction.LoaderAction(false));
      yield put(contactAction.CloseSideBar(true));
    }
  }
}

function* editContact(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.editContact(i, props.payload);

    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback(apiResponse.message)
      );

      yield put(
        contactAction.SlugUpdate({ companyId: props.payload.companyId })
      );
      yield put(
        companyAction.singleCompany({ companyId: props.payload.companyId })
      );

      yield put(contactAction.ViewSingleContact(null))
      yield put(
        contactAction.ContactListOfCompany({
          companyId: props.payload.companyId,
        })
      );

      yield contactListOfCompany();
    } else {
      if (apiResponse.error.code === 11000) {
        yield put(globalConfigActions.enableFeedback("Duplicate Email"));
      }
    }
    yield put(contactAction.LoaderAction(false))

  } catch (error) {
    if (error.data.err.code === 11000) {
      yield put(globalConfigActions.enableFeedback("Duplicate Email"));
    }
  }
}

function* contactListOfCompany() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.contactListOfCompany(i);

    yield put(contactAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(contactAction.ListFailure({ payload: [] }));
  }
}

function* deleteContact(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteContact(i, props.payload);

    yield put(
      globalConfigActions.enableFeedback("Contact deleted Successfully")
    );
    yield put(contactAction.SlugUpdate({ companyId: i.companyId }));
    yield put(companyAction.singleCompany({ companyId: i.companyId }));
    yield put(contactAction.ContactListOfCompany({ companyId: i.companyId }));
    yield contactListOfCompany();
  } catch (error) {
    [];
  }
}

function* viewContact() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewContact(i);

    yield put(contactAction.SingleContactDetailSuccess(apiResponse));
    yield put(contactAction.LoaderAction(false));
  } catch (error) {
    yield put(contactAction.ListFailure({ payload: [] }));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* contactSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(contactAction.List.type, contactListOfCompany);
  yield takeLatest(contactAction.tableSort.type, contactListOfCompany);
  yield takeLatest(contactAction.NewPage.type, contactListOfCompany);
  yield takeLatest(contactAction.ChangeLimit.type, contactListOfCompany);
  yield takeLatest(contactAction.Search.type, contactListOfCompany);
  yield takeLatest(contactAction.addCompanyContact.type, addContact);
  yield takeLatest(contactAction.EditContact.type, editContact);
  yield takeLatest(
    contactAction.ContactListOfCompany.type,
    contactListOfCompany
  );
  yield takeLatest(contactAction.ViewSingleContact.type, viewContact);
  yield takeLatest(contactAction.DeleteContact.type, deleteContact);
}
