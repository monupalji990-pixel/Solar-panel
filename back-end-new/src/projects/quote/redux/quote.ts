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
import backendApi from "./model/quote";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface quote {
  currentQuote: any;
  count: number;
  quoteCount: number;
  limit: number;
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
  quotes: any;
  consumers: any;
  companies: any;
  leads: any;
  suppliers: any;
  consumerID: any;
  supplierID: any;
  assignee: any;
  companyId: any;
  isActionDone: boolean;
  filterData: any;
  partnerListForDropdown: any;
  OnlyDeleteData: boolean;
  supplierList: any;
  supplierPrice: any;
  newLoader: boolean;
  loadingState: boolean;
  showingFrom: String;
}
export type ContainerState = quote;

export const initialState: ContainerState = {
  quotes: [],
  count: -1,
  quoteCount: -1,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  sort: "createdAt",
  sortType: "desc",
  currentQuote: {},
  consumers: [],
  slug: "",
  type: "",
  isLoadingData: true,
  companies: [],
  leads: [],
  suppliers: [],
  consumerID: "",
  supplierID: "",
  assignee: [],
  companyId: "",
  isActionDone: false,
  filterData: {},
  partnerListForDropdown: [],
  OnlyDeleteData: false,
  supplierList: [],
  supplierPrice: [],
  newLoader: false,
  loadingState: false,
  showingFrom: '',
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {
      state.showingFrom = action.payload?.showingFrom
    },
    ListSuccess(state, action: PayloadAction<any>) {
      state.quotes = action.payload.data.map((e) => {
        return {
          _id: e._id,
          quoteID: e.QuoteID,
          assignee: e.Assignee ? e.Assignee.name : "-",
          company: e.Company ? e.Company.businessName : "",
          Consumer:
            e.Consumer !== undefined && e.Consumer
              ? `${e.Consumer.firstName} ${e.Consumer.surName}`
              : "",
          site: e.Site ? e.Site.siteName : "-",
          serviceType: e.subServiceType && e.subServiceType.length > 0 ?
            e.serviceType + "," + " " + e.subServiceType.join(", ") : e.serviceType,
          quoteStatus: e.quoteStatus,
        };
      });
      state.remote = true;
    },

    supplierPriceList(state, action: PayloadAction<object | null>) { },
    supplierPriceListSuccess(state, action: PayloadAction<any>) {
      state.supplierPrice = action.payload.data.map((e) => {
        return {
          _id: e._id,
          duration: e.duration,
          standingCharge: e.standingCharge,
          unitRate: e.unitRate,
          minAQ: e.minAQ,
          maxAQ: e.maxAQ,
          supplier: e.supplier,
        };
      });
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
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
      state.isLoadingData = initialState.isLoadingData;
    },
    addQuote(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },

    addRenewalFromQuote(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    createDuplicateQuote(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    addQuoteSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    addQuoteFailure(state, action: PayloadAction<any>) {
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
      state.loadingState = action.payload;
    },

    deleteDebtPayment(state, action: PayloadAction<any>) {
    },

    roleList(state, action: PayloadAction<any>) { },
    roleListSuccess(state, action: PayloadAction<any>) { },
    editQuote(state, action: PayloadAction<any>) {
    },
    currentQuoteData(state, action: PayloadAction<any>) {
      state.currentQuote = action.payload.data;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.type = action.payload.type;
      state.companyId = action.payload.company
        ? action.payload.company._id
        : "";
      state.consumerID = action.payload.consumer
        ? action.payload.consumer._id
        : "";
      state.supplierID = action.payload.supplier
        ? action.payload.supplier._id
        : "";
      state.searchText = "";
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
    },
    addContact(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.type = action.payload.Type;
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
      state.searchText = "";
    },
    singleQuote(state, action: PayloadAction<any>) { },
    singleQuoteSuccess(state, action: PayloadAction<any>) { },

    assigneeListOfQuote(state, action: PayloadAction<any>) { },
    assigneeListOfQuoteSuccess(state, action: PayloadAction<any>) {
      state.assignee = action.payload.data;
    },
    updateAssignee(state, action: PayloadAction<any>) { },
    quoteAction(state, action: PayloadAction<any>) { },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    AddNotes(state, action: PayloadAction<any>) { },
    NotesData(state, action: PayloadAction<any>) {
    },

    IsActionDone(state, action: PayloadAction<any>) {
      state.isActionDone = action.payload;
    },

    FilterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    PartnerList(state, action: PayloadAction<any>) { },
    PartnerListData(state, action: PayloadAction<any>) {
      state.partnerListForDropdown = action.payload;
    },
    restartQuote(state, action: PayloadAction<any>) { },
    dropDownCompanyList(state, action: PayloadAction<any>) { },
    dropDownCompanyListSuccess(state, action: PayloadAction<any>) {
      state.companies = action.payload.data;
    },

    dropDownConsumerList(state, action: PayloadAction<any>) { },
    dropDownConsumerListSuccess(state, action: PayloadAction<any>) {
      state.consumers = action.payload.data;
    },
    dropDownLeadList(state, action: PayloadAction<any>) { },
    dropDownLeadListSuccess(state, action: PayloadAction<any>) {
      state.leads = action.payload.data;
    },
    dropDownSupplierList(state, action: PayloadAction<any>) { },
    dropDownSupplierListSuccess(state, action: PayloadAction<any>) {
      state.suppliers = action.payload.data;
    },

    deleteQuote(state, action: PayloadAction<any>) { },

    sendRequest(state, action: PayloadAction<any>) { },
    actionOnDeleteReq(state, action: PayloadAction<any>) { },
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.quoteCount !== undefined)
        state.quoteCount = action.payload.quoteCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },
    Count(state, action: PayloadAction<any | null>) { },
    CountSuccesss(state, action: PayloadAction<any | null>) {
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: quoteAction,
  reducer: quoteReducer,
  name: sliceKeyQuote,
} = quoteSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.quote || initialState;

export const selectQuoteState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.quote;

export function* quoteList(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.quoteList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(quoteAction.BasicActions({ count }));
    yield put(quoteAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addQuote(props) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.addQuote(i, props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback("Quote created successfully")
      );
      yield put(quoteAction.CloseSideBar(true));

      yield put(quoteAction.List({ showingFrom: props.showingFrom }));
    } else {
      yield put(globalConfigActions.enableFeedback("Quote Add failed"));
    }
    yield put(quoteAction.setIsLoadingData(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
    console.log("error in add new quote", error);
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
      yield put(quoteAction.addQuotePaymentSuccess({}));
      yield put(quoteAction.isPaymentLoader(true));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(quoteAction.setIsLoadingData(false));

    yield put(globalConfigActions.endLoader(null));
    yield put(quoteAction.isPaymentLoader(false));
  } catch (error) {
    yield put(quoteAction.addQuotePaymentFailure({}));
    yield put(quoteAction.isPaymentLoader(false));
    yield put(globalConfigActions.enableFeedback("something went wrong"));
  }
}

function* deleteDeptPayment(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.deleteDebtPaymentReq(i, props.payload);
    if (apiResponse.success)
      yield put(globalConfigActions.enableFeedback("Payment Delete Successfully"));
    yield put(quoteAction.currentQuoteData(apiResponse));

    yield put(quoteAction.setIsLoadingData(false));

  } catch (error) {
    [];
  }
}

function* requestAddRenewalFromQuote(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addRenewalFromQuote(i, props.payload);
    if (apiResponse.success) {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
      yield put(quoteAction.CloseSideBar(true));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(quoteAction.setIsLoadingData(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
    console.log("error in requestAddRenewalFromQuote", error);
  }
}

function* requestCreateDuplicateQuote(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.createDuplicateQuote(i, props.payload);
    if (apiResponse.success) {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
      yield put(quoteAction.CloseSideBar(true));
    } else {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(quoteAction.List({ showingFrom: props.showingFrom }));
    yield put(quoteAction.setIsLoadingData(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
    console.log("error in requestAddRenewalFromQuote", error);
  }
}

function* editQuote(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.editQuote(i, props.payload);

    yield put(globalConfigActions.enableFeedback("Quote updated successfully"));
    yield put(quoteAction.currentQuoteData(apiResponse));

    yield put(quoteAction.setIsLoadingData(false));
    yield quoteList(null);
  } catch (error) {
    [];
  }
}

function* restartQuote(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.restartQuote(i, props.payload);
    yield put(quoteAction.currentQuoteData(apiResponse));

    yield put(quoteAction.setIsLoadingData(false));

    yield quoteList(null);
  } catch (error) {
    [];
  }
}

function* viewQuote(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewQuote(i, props.payload);

    yield put(quoteAction.currentQuoteData(apiResponse));
    yield put(quoteAction.setIsLoadingData(false));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    [];
  }
}

function* consumerListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerListForDropdown(null, i);

    yield put(quoteAction.dropDownConsumerListSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.dropDownConsumerListSuccess([]));
  }
}

function* leadListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.leadListForDropdownTemp(
      i,
      props.payload
    );

    yield put(quoteAction.dropDownLeadListSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.dropDownLeadListSuccess([]));
  }
}

function* supplierListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.supplierListForDropdown(i);

    yield put(quoteAction.dropDownSupplierListSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.dropDownSupplierListSuccess([]));
  }
}

function* companyListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdownTemp(
      i,
      props.payload
    );

    yield put(quoteAction.dropDownCompanyListSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.dropDownCompanyListSuccess([]));
  }
}

function* deleteQuote(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    yield backendApi.deleteQuote(i, props.payload);

    yield put(globalConfigActions.enableFeedback("Quote deleted Successfully"));
    yield put(quoteAction.CloseSideBar(true));
    yield put(quoteAction.List({ showingFrom: props.showingFrom }));
  } catch (error) {
    [];
  }
}

function* assigneeList() {
  try {
    //const i = yield select(getState);
    const apiResponse = yield backendApi.assigneeList(null);

    yield put(quoteAction.assigneeListOfQuoteSuccess(apiResponse));
  } catch (error) {
    yield put(quoteAction.assigneeListOfQuoteSuccess([]));
  }
}

function* updateAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.updateAssignee(i, props.payload);

    yield put(
      quoteAction.singleQuote({
        quoteId: props.payload.QuoteID,
      })
    );

    yield put(quoteAction.setIsLoadingData(false));

    yield quoteList(null);
  } catch (error) {
    [];
  }
}

function* quoteActions(props) {
  try {
    const i = yield select(getState);
    yield backendApi.quoteActions(i, props.payload.data, props.payload.type);

    yield put(quoteAction.IsActionDone(true));

    yield put(
      quoteAction.singleQuote({
        quoteId: i.currentQuote._id,
      })
    );

    yield quoteList(null);
  } catch (error) {
    [];
  }
}

function* partnerList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.partnerList();
    yield put(quoteAction.PartnerListData(apiResponse));
  } catch (error) {
    [];
  }
}

function* Count() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.quoteCount(i);

    yield put(quoteAction.BasicActions({ quoteCount: apiResponse.count }));
  } catch (error) {
    yield put(quoteAction.BasicActions({ quoteCount: 0 }));
  }
}

function* addNotes(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addNotes(i, props.payload);
    yield put(quoteAction.currentQuoteData(apiResponse));
  } catch (error) {
    [];
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getState);
    yield backendApi.sendRequest(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Delete request sent successfully")
    );

    yield put(quoteAction.singleQuote({ quoteId: props.payload.id }));
    yield put(quoteAction.setIsLoadingData(false));
    yield viewQuote(null);
  } catch (error) { }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);

    yield put(quoteAction.BasicActions({ remote: false }));

    yield backendApi.actionOnSelectData(i, props.payload);
    yield globalConfigActions.enableFeedback(
      `Quote delete request ${props.payload.action}ed`
    );
    yield put(quoteAction.BasicActions({ status: true }));
    yield put(quoteAction.List({ showingFrom: props.showingFrom }));
    yield put(quoteAction.BasicActions({ remote: false }));
  } catch (error) {
    [];
  }
}


/**
 * Root saga manages watcher lifecycle
 */
export function* quoteSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(quoteAction.List.type, quoteList);
  yield takeLatest(quoteAction.tableSort.type, quoteList);
  yield takeLatest(quoteAction.FilterData.type, quoteList);
  yield takeLatest(quoteAction.NewPage.type, quoteList);
  yield takeLatest(quoteAction.ChangeLimit.type, quoteList);
  yield takeLatest(quoteAction.Search.type, quoteList);
  yield takeLatest(quoteAction.addQuote.type, addQuote);
  yield takeLatest(quoteAction.addQuotePayment.type, addQuotePaymentReq);
  yield takeLatest(quoteAction.editQuote.type, editQuote);
  yield takeLatest(quoteAction.singleQuote.type, viewQuote);
  yield takeLatest(quoteAction.deleteQuote.type, deleteQuote);
  yield takeLatest(quoteAction.AddNotes.type, addNotes);
  yield takeLatest(quoteAction.assigneeListOfQuote.type, assigneeList);
  yield takeLatest(quoteAction.updateAssignee.type, updateAssignee);
  yield takeLatest(quoteAction.PartnerList.type, partnerList);
  yield takeLatest(quoteAction.Count.type, Count);
  yield takeLatest(quoteAction.sendRequest.type, sendRequest);
  yield takeLatest(quoteAction.deleteDebtPayment.type, deleteDeptPayment)
  yield takeLatest(quoteAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(
    quoteAction.dropDownCompanyList.type,
    companyListForDropdown
  );
  yield takeLatest(
    quoteAction.dropDownConsumerList.type,
    consumerListForDropdown
  );
  yield takeLatest(quoteAction.dropDownLeadList.type, leadListForDropdown);
  yield takeLatest(
    quoteAction.dropDownSupplierList.type,
    supplierListForDropdown
  );
  yield takeLatest(quoteAction.quoteAction.type, quoteActions);
  yield takeLatest(quoteAction.restartQuote.type, restartQuote);
  yield takeLatest(
    quoteAction.addRenewalFromQuote.type,
    requestAddRenewalFromQuote
  );
  yield takeLatest(quoteAction.createDuplicateQuote.type, requestCreateDuplicateQuote);
}
