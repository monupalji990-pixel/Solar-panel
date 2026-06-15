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
import backendApi from "./model/renewal";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import renewal from "./model/renewal";

export interface renewal {
  renewals: any;
  count: number;
  renewalCount: number;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  message: string;
  role: any;
  sort: string;
  sortType: string;
  slug: any;
  type: any;
  isLoadingData: boolean;
  companies: any;
  leads: any;
  suppliers: any;
  assignee: any;
  companyId: any;
  isActionDone: boolean;
  currentQuote: any;
  filterData: any;
  OnlyDeleteData: boolean;
  newLoader: boolean;
  isLoading: boolean;

}
export type ContainerState = renewal;

export const initialState: ContainerState = {
  renewals: [],
  count: -1,
  renewalCount: -1,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  type: "",
  isLoadingData: true,
  companies: [],
  leads: [],
  suppliers: [],
  assignee: [],
  companyId: "",
  isActionDone: false,
  currentQuote: {},
  filterData: {},
  OnlyDeleteData: false,
  newLoader: false,
  isLoading: false,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const renewalSlice = createSlice({
  name: "renewal",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) { },
    ListSuccess(state, action: PayloadAction<any>) {
      state.renewals = action.payload.data.map((e) => {
        return {
          _id: e._id,
          renewalID: e.RenewalID,
          company: e.Company ? e.Company.businessName : "",
          consumer: e.Consumer
            ? `${e.Consumer.firstName} ${e.Consumer.surName}`
            : "",
          site: e.Site ? e.Site.siteName : "",
          serviceType: e.serviceType,
          quoteStatus: e.Status,
          renewalStartDate: helperMethods.ConvertDate(e.renewalStartDate),
          renewalEndDate: helperMethods.ConvertDate(e.renewalEndDate),
        };
      });
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { },

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
      state.slug = action.payload.slug;
      state.type = action.payload.type;
      state.searchText = "";
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },

    addQuotePayment(state, action: PayloadAction<any>) {
      state.newLoader = true;
    },
    addQuotePaymentSuccess(state, action: PayloadAction<any>) {
      state.newLoader = false;
    },
    addQuotePaymentFailure(state, action: PayloadAction<any>) {
      state.newLoader = false;
    },
    isPaymentLoader(state, action: PayloadAction<any>) {
      state.isLoading = action.payload;
    },

    deleteDebtPayment(state, action: PayloadAction<any>) {
    },

    viewSigleRenewal(state, action: PayloadAction<any>) { },

    currentRenewalData(state, action: PayloadAction<any>) {
      state.currentQuote = action.payload.data;
    },

    editRenewal(state, action: PayloadAction<any>) { },

    isActionDone(state, action: PayloadAction<any>) {
      state.isActionDone = action.payload;
    },
    renewalAction(state, action: PayloadAction<any>) { },
    renewalDelete(state, action: PayloadAction<any>) { },
    renewalFilter(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },

    dropdownCompanyListForRenewal(state, action: PayloadAction<any>) { },
    dropdownCompanyListSuccessForRenewal(state, action: PayloadAction<any>) {
      state.companies = action.payload.data;
    },

    sendRenewal(state, action: PayloadAction<any>) { },
    ActionOnDelete(state, action: PayloadAction<any>) { },
    BasicAction(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.renewalCount !== undefined)
        state.renewalCount = action.payload.renewalCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },

    Count(state, action: PayloadAction<any>) { },
    AddNote(state, action: PayloadAction<any>) { },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    updateAssignee(state, action: PayloadAction<any>) {
    },
    updateCompanyId(state, action: PayloadAction<any>) {
      state.companyId = action.payload;
    }
  },
});

export const {
  actions: renewalAction,
  reducer: renewalReducer,
  name: sliceKeyRenewal,
} = renewalSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.renewal || initialState;

export const selectRenewalState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.renewal;

function* renewalList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.renewalList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(renewalAction.BasicAction({ count }));
    yield put(renewalAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(renewalAction.ListFailure([]));
  }
}

function* viewQuote(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewQuote(i, props.payload);

    yield put(renewalAction.currentRenewalData(apiResponse));
    yield put(renewalAction.setIsLoadingData(false));
  } catch (error) {
    [];
  }
}

function* editQuote(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.editQuote(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Renewal updated successfully")
    );
    yield put(renewalAction.currentRenewalData(apiResponse));
    yield put(renewalAction.setIsLoadingData(false));

    yield renewalList();
  } catch (error) {
    [];
  }
}

function* quoteActions(props) {
  try {
    const i = yield select(getState);
    yield backendApi.quoteActions(i, props.payload.data, props.payload.action);

    yield put(renewalAction.isActionDone(true));
    yield put(renewalAction.viewSigleRenewal({ quoteId: i.currentQuote._id }));
    yield put(renewalAction.setIsLoadingData(false));
    yield renewalList();
  } catch (error) {
    [];
  }
}

function* deleteRenewal(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteRenewal(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Renewal delete successfully")
    );
    yield put(renewalAction.CloseSideBar(true));

    yield renewalList();
  } catch (error) {
    [];
  }
}

function* companyListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdownTemp(
      i,
      props.payload
    );

    yield put(renewalAction.dropdownCompanyListSuccessForRenewal(apiResponse));
  } catch (error) {
    [];
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getState);
    yield backendApi.sendRequest(i, props.payload);
    yield put(renewalAction.viewSigleRenewal({ quoteId: props.payload.id }));
  } catch (error) {
    [];
  }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);
    yield put(renewalAction.BasicAction({ remote: false }));

    yield backendApi.actionOnSelectData(i, props.payload);

    yield put(renewalAction.BasicAction({ status: true }));
    yield put(
      globalConfigActions.enableFeedback(
        `Renewal delete request accepted`
      )
    );

    yield renewalList();

    yield put(renewalAction.BasicAction({ remote: true }));
  } catch (error) {
    [];
  }
}

function* Count() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.renewalCount(i);
    yield put(renewalAction.BasicAction({ renewalCount: apiResponse.count }));
  } catch (error) {
    yield put(renewalAction.BasicAction({ renewalCount: 0 }));
  }
}

function* addNotes(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addNotes(i, props.payload);
    yield put(renewalAction.currentRenewalData(apiResponse));
  } catch (error) {
    [];
  }
}

function* addQuotePaymentReq(props) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.addQuotePaymentReq(i, props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback("Payment Added Successfully!")
      );
      yield put(renewalAction.addQuotePaymentSuccess({}));
      yield put(renewalAction.isPaymentLoader(true));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(renewalAction.setIsLoadingData(false));
    yield put(globalConfigActions.endLoader(null));
    yield put(renewalAction.isPaymentLoader(false));
  } catch (error) {
    yield put(renewalAction.isPaymentLoader(false));
    yield put(renewalAction.addQuotePaymentFailure({}));
    yield put(globalConfigActions.enableFeedback("something went wrong"));
  }
}

function* deleteDeptPayment(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.deleteDebtPaymentReq(i, props.payload);
    if (apiResponse.success)
      yield put(globalConfigActions.enableFeedback("Payment Delete Successfully"));
    yield put(renewalAction.currentRenewalData(apiResponse));

    yield put(renewalAction.setIsLoadingData(false));

  } catch (error) {
    [];
  }
}

function* updateAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.updateAssignee(i, props.payload);
    yield put(renewalAction.viewSigleRenewal({ quoteId: i.currentQuote._id }));
    yield put(renewalAction.setIsLoadingData(false));
    yield renewalList();
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* renewalSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(renewalAction.List.type, renewalList),
    yield takeLatest(renewalAction.tableSort.type, renewalList),
    yield takeLatest(renewalAction.NewPage.type, renewalList),
    yield takeLatest(renewalAction.ChangeLimit.type, renewalList),
    yield takeLatest(renewalAction.Search.type, renewalList),
    yield takeLatest(renewalAction.viewSigleRenewal.type, viewQuote),
    yield takeLatest(renewalAction.editRenewal.type, editQuote),
    yield takeLatest(renewalAction.renewalAction.type, quoteActions),
    yield takeLatest(renewalAction.renewalDelete.type, deleteRenewal),
    yield takeLatest(renewalAction.renewalFilter.type, renewalList),
    yield takeLatest(renewalAction.addQuotePayment.type, addQuotePaymentReq),
    yield takeLatest(
      renewalAction.dropdownCompanyListForRenewal.type,
      companyListForDropdown
    ),
    yield takeLatest(renewalAction.sendRenewal.type, sendRequest),
    yield takeLatest(renewalAction.ActionOnDelete.type, actionOnSelectData),
    yield takeLatest(renewalAction.Count.type, Count),
    yield takeLatest(renewalAction.AddNote.type, addNotes),
    yield takeLatest(renewalAction.updateAssignee.type, updateAssignee),
    yield takeLatest(renewalAction.deleteDebtPayment.type, deleteDeptPayment)

}
