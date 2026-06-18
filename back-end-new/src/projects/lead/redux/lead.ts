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
import backendApi from "./model/lead";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import lead from "./model/lead";
import { companyAction } from "projects/company/redux/company";

export interface lead {
  leads: any;
  leadCount: number;
  count: number;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  message: string;
  role: any;
  companies: any;
  consumers: any;
  sort: string;
  sortType: string;
  slug: string;
  singleLead: any;
  leadId: any;
  isLoading: boolean;
  companyId: any;
  consumerID: any;
  filterData: any;
  partnerListForDropdown: any;
  salesRepListForDropdown: any;
  OnlyDeleteData: boolean;
  leadPointer: Number;
  isSaveLeadLoading: boolean;
  getLeadSourceCount: any;
  showingFrom: string;
  totalFloorState: {
    area: any,
    preRating: undefined,
    postRating: undefined,
    absValue: any,
  }
}
export type ContainerState = lead;

export const initialState: ContainerState = {
  leads: [],
  leadCount: -1,
  count: -1,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  role: [],
  companies: [],
  consumers: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  singleLead: {},
  leadId: "",
  isLoading: false,
  companyId: "",
  consumerID: "",
  filterData: {},
  partnerListForDropdown: [],
  salesRepListForDropdown: [],
  OnlyDeleteData: false,
  leadPointer: 0,
  isSaveLeadLoading: false,
  getLeadSourceCount: {},
  showingFrom: '',
  totalFloorState: {
    area: [],
    preRating: undefined,
    postRating: undefined,
    absValue: 0,
  }
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    updateTotalFloorState(state, action: PayloadAction<any | null>) {
      state.totalFloorState = action.payload
    },
    leadPointerChange(state, action: PayloadAction<any | null>) {
      state.leadPointer = action.payload;
    },
    List(state, action: PayloadAction<any | null>) {
      state.showingFrom = action.payload.showingFrom
    },
    ListSuccess(state, action: PayloadAction<any>) {

      const checkDateBefore = (e) => {
        let d = new Date(e.createdAt)
        let last_three_month = new Date()
        last_three_month.setMonth(last_three_month.getMonth() - 3)
        return d > last_three_month;
      }

      state.leads = action.payload.data.map((e) => {
        return {
          _id: e._id,
          lead: e.leadId,
          createdAt: e.createdAt,
          isBfrThreeMonth: false,//checkDateBefore(e),
          Consumer:
            e.Consumer !== undefined && e.Consumer
              ? `${e.Consumer.firstName} ${e.Consumer.surName}`
              : "",
          company:
            e.Company !== undefined && e.Company ? e.Company.businessName : "",
          site: e.Site !== undefined && e.Site ? e.Site.siteName : "-",
          type:
            e.serviceType !== undefined &&
              e.serviceType
              ? helperMethods.arrayToString(
                e?.subServiceType?.length > 0 ?
                  e.serviceType.concat(e.subServiceType) : e.serviceType
              )
              : "",
          status: e.status,
          source: e.source || '-',
          assignee: e.Assignee?.name || '-',
          addressline1: e.Company ? e.Company.firstLine : e.Consumer.addressOne,
          addressline2: e.Company ? e.Company.secondLine : e.Consumer.addressTwo,
          contact: e.Contact !== undefined && e.Contact ? e.Contact.name : "-",
          businessSector: e.Company !== undefined && e.Company && e.Company.businessSector !== undefined ? e.Company.businessSector : "-",
          postcode: e.Company !== undefined && e.Company && e.Company.postcode !== undefined && e.Company.postcode ? e.Company.postcode : "-",
        };
      });
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
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },

    CompanyListData(state, action: PayloadAction<any>) { },
    CompanyListSuccess(state, action: PayloadAction<any>) {
      state.companies = action.payload.data;
    },
    CompanyListFailure(state, action: PayloadAction<any>) { },

    addLead(state, action: PayloadAction<any>) { },
    addLeadSuccess(state, action: PayloadAction<any>) { },
    addLeadFailure(state, action: PayloadAction<any>) { },

    singleLead(state, action: PayloadAction<any>) { },
    singleLeadSuccess(state, action: PayloadAction<any>) {
      state.singleLead = action.payload.lead;
      state.isSaveLeadLoading = false;
    },
    singleLeadFailure(state, action: PayloadAction<any>) { },
    singleLeadUpdate(state, action: PayloadAction<any>) { },
    LoaderAction(state, action: PayloadAction<any>) {
      state.isLoading = action.payload;
    },
    saveLoaderChange(state, action: PayloadAction<any>) {
      state.isSaveLeadLoading = action.payload;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.companyId = action.payload.company
        ? action.payload.company._id
        : "";
      state.consumerID = action.payload.consumer
        ? action.payload.consumer._id
        : "";
      state.searchText = "";
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
    },
    DeleteLead(state, action: PayloadAction<any>) { },
    FilterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
      state.leadCount = -1;
    },
    getLeadSourceCounts(state, action: PayloadAction<any>) { },
    getLeadSourceCountsSuccess(state, action: PayloadAction<any>) {
      state.getLeadSourceCount = action.payload.data;
    },
    getLeadSourceCountsFailure(state, action: PayloadAction<any>) {
      state.getLeadSourceCount = action.payload.data;
    },
    PartnerList(state, action: PayloadAction<any>) { },
    PartnerListData(state, action: PayloadAction<any>) {
      state.partnerListForDropdown = action.payload;
    },

    ConsumerList(state, action: PayloadAction<any>) { },
    ConsumerListSuccess(state, action: PayloadAction<any>) {
      state.consumers = action.payload.data;
    },

    SalesRepList(state, action: PayloadAction<any>) { },
    SalesRepListSuccess(state, action: PayloadAction<any>) {
      state.salesRepListForDropdown = action.payload;
    },

    sendRequest(state, action: PayloadAction<any>) { },
    actionOnDeleteReq(state, action: PayloadAction<any>) { },

    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.filterData !== undefined)
        state.filterData = action.payload.filterData;
      if (action.payload.leadCount !== undefined)
        state.leadCount = action.payload.leadCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
      if (action.payload.slug !== undefined) state.slug = action.payload.slug;
    },

    AddSalesRepAsAssignee(state, action: PayloadAction<any>) { },

    Count(state, action: PayloadAction<any>) { },
    CountSuccess(state, action: PayloadAction<any>) {
    },

    AddNotes(state, action: PayloadAction<any>) { },
    SoldServices(state, action: PayloadAction<any>) {
      state.isSaveLeadLoading = true;
    },
    SaveServiceData(state, action: PayloadAction<any>) {
      state.isSaveLeadLoading = true;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: leadAction,
  reducer: leadReducer,
  name: sliceKeyLead,
} = leadSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.lead || initialState;

export const selectLeadState = createSelector([selectDomain], (State) => State);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.lead;
export const LeadState = (state: RootState) => state.lead;

function* companyListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdownTemp(
      i,
      props.payload
    );

    yield put(leadAction.CompanyListSuccess(apiResponse));
  } catch (error) {
    yield put(leadAction.CompanyListData([]));
  }
}

function* leadList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.leadList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;
    yield put(leadAction.BasicActions({ count }));
    yield put(leadAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put({ type: "LEAD_LIST_BY_FAILURE", payload: [] });
    yield put(leadAction.ListFailure([]));
  }
}

function* addLead(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addLead(i, props.payload);

    yield put(leadAction.CloseSideBar(true));

    yield put(leadAction.LoaderStart(false));
    yield put(leadAction.List({ showingFrom: props.showingFrom }));
  } catch (error) {
    yield put(leadAction.CloseSideBar(true));
  }
}

function* viewLead(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewLead(i, props.payload);

    yield put(leadAction.singleLeadSuccess(apiResponse));
    yield put(leadAction.LoaderAction(false));
  } catch (error) {
    yield put(leadAction.singleLeadFailure([]));
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getState);
    yield backendApi.sendRequest(i, props.payload);

    yield put(leadAction.singleLead({ leadId: props.payload.id }));
  } catch (error) {
    yield put(leadAction.singleLeadFailure([]));
  }
}

function closeTheDrawer(func: any) {
  return new Promise((resolve, reject) => {
    try {
      func();
      setTimeout(function () { resolve({ message: 'drawer Closed' }) }, 500);

    } catch (err) {
      reject({ message: err.message, err })
    }
  })
}
function* updateLead(props) {
  try {
    yield put(leadAction.LoaderAction(true));

    const i = yield select(getState);
    const apiResponse = yield backendApi.updateLead(i, props.payload.data);
    if (apiResponse.success) {
      const dd = props.payload.data;
      yield put(leadAction.List({ showingFrom: props.showingFrom }));
      if (props.payload.updateField && props.payload.updateField === 'status' && ['admin'].includes(i.slug) &&
        (dd.status === 'Dead Lead' || dd.status === 'Not Interested' || dd.status === 'DND')
      ) {
        const res = yield closeTheDrawer(props.payload.closeDrawer);
        if (props.payload.showingFrom && props.payload.showingFrom == 'viewCompany') {
          yield put(companyAction.List(null));
          if (props.payload.closeCompanyDrawer)
            props.payload.closeCompanyDrawer();
        }
      }
    }
    yield put(globalConfigActions.enableFeedback("Lead updated successfully"));
    yield put(leadAction.singleLeadSuccess(apiResponse));
    yield put(leadAction.LoaderAction(false));
  } catch (error) {
    yield put(leadAction.singleLeadFailure([]));
  }
}

function* deleteLead(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteLead(i, props.payload);

    yield put(globalConfigActions.enableFeedback("Lead delete successfully"));
    yield put(leadAction.CloseSideBar(true));
    yield put(leadAction.List({ showingFrom: props.showingFrom }));
  } catch (error) {
    [];
  }
}

function* partnerList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.partnerList();
    yield put(leadAction.PartnerListData(apiResponse));
  } catch (error) {
    [];
  }
}

function* consumerListForDropdown() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerListForDropdown(null, i);

    yield put(leadAction.ConsumerListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* salesRepList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.salesRepList();
    yield put(leadAction.SalesRepListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);
    yield put(leadAction.BasicActions({ remote: false }));
    yield backendApi.actionOnSelectData(i, props.payload);

    yield put(
      leadAction.BasicActions({
        status: true,
        message: `Lead delete request ${props.payload.action}ed`,
      })
    );
    yield globalConfigActions.enableFeedback(
      `Lead delete request ${props.payload.action}ed`
    );
    yield put(leadAction.List({ showingFrom: props.showingFrom }));
    yield put(leadAction.BasicActions({ remote: true }));
  } catch (error) {
    [];
  }
}

function* addSalesRepAssignee(props) {
  try {
    const i = yield select(getState);

    yield put(leadAction.BasicActions({ remote: false }));
    yield backendApi.addSalesRepAssignee(i, props);
    yield put(
      leadAction.BasicActions({
        status: true,
        message: `Sales rep assigned successfully`,
        sidebar: true,
      })
    );
    yield put(leadAction.List({ showingFrom: props.showingFrom }));
    yield put(leadAction.BasicActions({ remote: true }));
    yield put(
      globalConfigActions.enableFeedback("Sales rep assigned successfully")
    );
  } catch (error) {
    [];
  }
}

function* leadCount(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.leadCount({ ...i, ...props.payload });

    yield put(leadAction.BasicActions({ leadCount: apiResponse.count }));
  } catch (error) {
    yield put(leadAction.BasicActions({ leadCount: 0 }));
  }
}

function* addNotes(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addNotes(i, props.payload);
    yield put(leadAction.singleLeadSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* soldService(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.soldService(i, props.payload);
    yield put(globalConfigActions.enableFeedback("Sold service successfully"));
    yield put(leadAction.singleLeadSuccess(apiResponse));
    yield put(leadAction.List({ showingFrom: props.showingFrom }));
  } catch (error) {
    [];
  }
}

function* saveServiceData(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.saveServiceData(i, props.payload);
    yield put(leadAction.singleLead({ leadId: props.payload.id }));
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
  } catch (error) {
    console.log(error);
  }
}

function* leadSourceCountSaga(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.getLeadSourceCountAPI(i, props.payload);
    if (apiResponse.success) {
      yield put(leadAction.getLeadSourceCountsSuccess(apiResponse));
    } else {
      yield put(leadAction.getLeadSourceCountsFailure(apiResponse));
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* leadSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(leadAction.List.type, leadList);
  yield takeLatest(leadAction.NewPage.type, leadList);
  yield takeLatest(leadAction.ChangeLimit.type, leadList);
  yield takeLatest(leadAction.Search.type, leadList);
  yield takeLatest(leadAction.CompanyListData.type, companyListForDropdown);
  yield takeLatest(leadAction.ConsumerList.type, consumerListForDropdown);
  yield takeLatest(leadAction.addLead.type, addLead);
  yield takeLatest(leadAction.singleLead.type, viewLead);
  yield takeLatest(leadAction.singleLeadUpdate.type, updateLead);
  yield takeLatest(leadAction.DeleteLead.type, deleteLead);
  yield takeLatest(leadAction.FilterData.type, leadList);
  yield takeLatest(leadAction.PartnerList.type, partnerList);
  yield takeLatest(leadAction.SalesRepList.type, salesRepList);
  yield takeLatest(leadAction.sendRequest.type, sendRequest);
  yield takeLatest(leadAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(leadAction.AddSalesRepAsAssignee.type, addSalesRepAssignee);
  yield takeLatest(leadAction.Count.type, leadCount);
  yield takeLatest(leadAction.AddNotes.type, addNotes);
  yield takeLatest(leadAction.SoldServices.type, soldService);
  yield takeLatest(leadAction.SaveServiceData.type, saveServiceData);
  yield takeLatest(leadAction.tableSort.type, leadList);
  yield takeLatest(leadAction.getLeadSourceCounts.type, leadSourceCountSaga)
}
