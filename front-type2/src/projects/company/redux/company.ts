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
import backendApi from "./model/company";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface company {
  currentCompany: any;
  count: number;
  companyCount: number;
  limit: number;
  page: number;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  message: string;
  messageCode: "-";
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  type: string;
  isLoadingData: boolean;
  companies: any;
  addDocumentLoading: boolean;
  addMeterReadingLoading: boolean;
  assigneeList: any;
  isActionDone: boolean;
  filterData: any;
  notes: any;
  documents: any;
  installerDocuments: any;
  meterReadings: any;
  partnerListForDropdown: any;
  OnlyDeleteData: boolean;
  contactList: any;
  companyListForDropDown: any;
  pageForDropDown: number;
  searchForDown: string;
  limitForDropDown: number;
}
export type ContainerState = company;

export const initialState: ContainerState = {
  companies: [],
  contactList: [],
  count: -1,
  limit: 10,
  page: 1,
  hideSideBar: false,
  remote: false,
  searchText: "",
  message: "",
  messageCode: "-",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  type: "",
  currentCompany: {},
  assigneeList: {},
  isLoadingData: true,
  addDocumentLoading: false,
  addMeterReadingLoading: false,
  notes: [],
  documents: [],
  installerDocuments: [],
  meterReadings: [],
  isActionDone: false,
  filterData: {},
  partnerListForDropdown: [],
  OnlyDeleteData: false,
  companyCount: -1,
  companyListForDropDown: [],
  pageForDropDown: 1,
  searchForDown: "",
  limitForDropDown: 10,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {},
    ListSuccess(state, action: PayloadAction<any>) {
      if (action.payload?.data?.length > 0) {
        state.companies = action.payload.data.map((e) => {
          return {
            _id: e._id,
            companyID: e.companyID,
            company: e.businessName,
            site:
              e.Site !== undefined && e.Site.length > 0
                ? e.Site[0].siteName
                : "",
            hiddenSite: e.Site.map((site) => site.siteName).join(),
            hiddenSitePostcode: e.Site.map((site) => site.postcode).join(),
            salesRep: e.businessName,
            status: e.isActive == 0 ? "Block" : "Active",
            allServices: helperMethods.arrayToString(e.allServices),
            liveServices: helperMethods.arrayToString(e.liveServices),
            createdAt: helperMethods.ConvertDate(e.createdAt),
            contactName:
              e.Contact !== undefined && e.Contact.map((s) => s.name),
            contactEmail:
              e.Contact !== undefined && e.Contact.map((s) => s.email),
            contactMobile:
              e.Contact !== undefined && e.Contact.map((s) => s.mobile),
            contactPhone:
              e.Contact !== undefined && e.Contact.map((s) => s.phone),
            mprn: helperMethods.arrayToString(e.mprn),
            mpan: helperMethods.arrayToString(e.mpan),
            midNumber: helperMethods.arrayToString(e.midNumber),
            postcode: e.postcode !== undefined && e.postcode,
            firstLine: e.firstLine !== undefined && e.firstLine,
            topLine: e.Site && e.Site.map((e) => e?.electric?.topLine).join(),
            meterNumber:
              e.Site && e.Site.map((e) => e?.electric?.meterNumber).join(),
            gasMprn: e.Site && e.Site.map((e) => e?.gas?.MPRN).join(),
            chipMidNumber:
              e.Site && e.Site.map((e) => e?.chipandpin?.midNumber).join(),
          };
        });
        state.remote = true;
      } else {
        state.companies = [];
        state.remote = true;
      }
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
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
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
    addCompanyFailure(state, action: PayloadAction<any>) {},
    roleList(state, action: PayloadAction<any>) {},
    roleListSuccess(state, action: PayloadAction<any>) {},
editCompany(state, action: PayloadAction<any>) {},
    currentCompanyrData(state, action: PayloadAction<any>) {
  const payloadCompany = action?.payload?.company;
  const payloadData = action?.payload?.data;
  const normalizedData = Array.isArray(payloadData)
    ? payloadData[0] ?? {}
    : payloadData ?? {};

  state.currentCompany = payloadCompany ?? normalizedData;
},
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.type = action.payload.companyType;
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
      state.searchText = "";
    },
    addContact(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.type = action.payload.Type;
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
      state.searchText = "";
    },
    singleCompany(state, action: PayloadAction<any>) {},
    singleCompanySuccess(state, action: PayloadAction<any>) {},
    contactListOfCompany(state, action: PayloadAction<any>) {},
    contactListOfCompanySuccess(state, action: PayloadAction<any>) {
      state.contactList = action.payload.data.map((e) => {
        return {
          _id: e._id,
          contactName: e.name,
          contactOffice: e.phone,
          contactMobile: e.mobile,
          contactEmail: e.email,
          jobTitle: e.jobTitle,
          DOB: e.DOB ? helperMethods.ConvertDate(e.DOB) : "",
          nationalInsurance: e.nationalInsurance,
        };
      });
      state.count = action.payload.count;
      state.remote = true;
    },
    assigneeListOfCompany(state, action: PayloadAction<any>) {},
    assigneeListOfCompanySuccess(state, action: PayloadAction<any>) {
      state.assigneeList = action.payload.data;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    AddNotes(state, action: PayloadAction<any>) {},
    NotesData(state, action: PayloadAction<any>) {
      state.notes = action.payload.data.Notes;
    },
    AddDocument(state, action: PayloadAction<any>) {
      state.addDocumentLoading = true;
    },
    AddDocumentSuccess(state, action: PayloadAction<any>) {
      state.addDocumentLoading = false;
    },
    DeleteDocument(state, action: PayloadAction<any>) {},
    AddMeterReading(state, action: PayloadAction<any>) {
      state.addMeterReadingLoading = true;
    },
    AddMeterReadingSuccess(state, action: PayloadAction<any>) {
      state.addMeterReadingLoading = false;
    },
    DeleteMeterReading(state, action: PayloadAction<any>) {},
    DocumentData(state, action: PayloadAction<any>) {
      state.documents = action.payload.data.documents;
      state.installerDocuments = action.payload.data.installerDocuments;
    },
    IsActionDone(state, action: PayloadAction<any>) {
      state.isActionDone = action.payload;
    },
    MeterReadingData(state, action: PayloadAction<any>) {
      state.meterReadings = action.payload.data.meterReading;
    },
    CreateAssignee(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    FilterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    PartnerList(state, action: PayloadAction<any>) {},
    PartnerListData(state, action: PayloadAction<any>) {
      state.partnerListForDropdown = action.payload;
    },

    deleteCompany(state, action: PayloadAction<any>) {},

    sendRequest(state, action: PayloadAction<any>) {},
    actionOnDeleteReq(state, action: PayloadAction<any>) {},
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.companyCount !== undefined)
        state.companyCount = action.payload.companyCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },
    Count(state, action: PayloadAction<any | null>) {},
    CountSuccesss(state, action: PayloadAction<any | null>) {
      state.companyCount = action.payload.count;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    companyListForDropDown(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.remote = false;
    },
    companyListForDropDownSuccess(state, action: PayloadAction<any>) {
      const newList = action.payload.data.map((e) => {
        return {
          _id: e._id,
          company: e.businessName,
          site: e.Site,
        };
      });
      const finalList = [...state.companyListForDropDown, ...newList];
      state.companyListForDropDown = finalList;
      state.remote = true;
    },
    companyListForDropDownLimit(state, action: PayloadAction<any>) {
      state.remote = false;
      state.pageForDropDown = action.payload.page;
      state.limitForDropDown = action.payload.limit;
    },
    companyListForDropDownSearch(state, action: PayloadAction<any>) {
      state.remote = false;
      state.companyListForDropDown = [];
      state.pageForDropDown = initialState.pageForDropDown;
      state.searchForDown = action.payload.searchText;
    },
    changeToInitialState(state, action: PayloadAction<any>) {
      state.limit = initialState.limit;
      state.page = initialState.page;
      state.sort = initialState.sort;
      state.sortType = initialState.sortType;
    },
  },
});

export const {
  actions: companyAction,
  reducer: companyReducer,
  name: sliceKeyCompany,
} = companySlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.company || initialState;

export const selectCompanyState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.company;

export function* companyList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(companyAction.BasicActions({ count }));
    yield put(companyAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(companyAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

export function* companyListForDropDown(props: any) {
  try {
    const i = yield select(getState);
    const state = {
      ...i,
      searchText: i.searchForDown,
      page: i.pageForDropDown,
      limit: i.limitForDropDown,
    };
    const apiResponse = yield backendApi.dropdownCompanyForLead(state);
    yield put(companyAction.companyListForDropDownSuccess(apiResponse));
  } catch (error) {
    yield put(companyAction.companyListForDropDownSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addCompany(props) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.addCompany(i, props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(
        globalConfigActions.enableFeedback("company added successfully")
      );
      yield put(companyAction.currentCompanyrData(apiResponse));
      yield put(companyAction.List(null));
    } else {
      yield put(globalConfigActions.enableFeedback("company Add failed"));
    }
    yield put(globalConfigActions.endLoader(null));
    yield put(companyAction.setIsLoadingData(false));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
    console.log("error in add new company", error);
  }
}

function* addContact(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addContact(i, props.payload);

    yield put(globalConfigActions.enableFeedback("contact Add successfully"));
    yield put({
      type: "CONTACT_LIST_OF_COMPANY",
      payload: { companyId: props.payload.companyId },
    });
    yield put(
      companyAction.contactListOfCompany({ companyId: props.payload.companyId })
    );
    yield put(companyAction.setIsLoadingData(false));
  } catch (error) {}
}

function* editCompany(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    yield backendApi.editCompany(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("company updated successfully")
    );
    yield put(companyAction.singleCompany({ companyId: props.payload.editId }));
    yield put(companyAction.setIsLoadingData(false));
    yield companyList(null);
  } catch (error) {
    [];
  }
}

function* viewCompany(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewCompany(i, props.payload);
    yield put(companyAction.currentCompanyrData(apiResponse));
    yield put(companyAction.setIsLoadingData(false));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    [];
  }
}

function* deleteCompany(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    yield backendApi.deleteCompany(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("company deleted Successfully")
    );
    yield put(companyAction.CloseSideBar(true));
    yield put(companyAction.List(null));
  } catch (error) {
    [];
  }
}

function* addDocument(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addDocument(i, props.payload);
    yield put(companyAction.IsActionDone(true));
    yield put(companyAction.AddDocumentSuccess(true));
    yield put(
      globalConfigActions.enableFeedback("Document added Successfully")
    );
    yield put(companyAction.singleCompany({ companyId: i.currentCompany._id }));
  } catch (error) {
    [];
  }
}

function* deleteDocument(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteDocument(i, props.payload);

    yield put(
      globalConfigActions.enableFeedback("Document deleted successfully")
    );
    yield put(companyAction.IsActionDone(true));
    yield put(companyAction.singleCompany({ companyId: i.currentCompany._id }));
  } catch (error) {
    [];
  }
}

function* addMeterReading(props) {
  try {
    const i = yield select(getState);
    let apiResponse = yield backendApi.addMeterReading(i, props.payload);
    if (apiResponse.success)
      yield put(companyAction.AddMeterReadingSuccess(true));

    yield put(
      globalConfigActions.enableFeedback("Meter reading added Successfully")
    );
    yield put(companyAction.IsActionDone(true));
    yield put(companyAction.singleCompany({ companyId: i.currentCompany._id }));
  } catch (error) {
    [];
  }
}

function* deleteMeterReading(props) {
  try {
    const i = yield select(getState);
    yield backendApi.deleteDocument(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Meter reading deleted Successfully")
    );
    yield put(companyAction.IsActionDone(true));
    yield put(companyAction.singleCompany({ companyId: i.currentCompany._id }));
  } catch (error) {
    [];
  }
}

function* contactListOfCompany(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.contactListOfCompany(i, props.payload);
    yield put(companyAction.contactListOfCompanySuccess(apiResponse));
  } catch (error) {}
}

function* assigneeList() {
  try {
    const apiResponse = yield backendApi.assigneeList(null);
    yield put(companyAction.assigneeListOfCompanySuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* addAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addAssignee(i, props.payload);
    yield put(companyAction.setIsLoadingData(false));
    yield put(
      globalConfigActions.enableFeedback("Assignee Added Successfully")
    );
  } catch (error) {
    [];
  }
}

function* partnerList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.partnerList();
    yield put(companyAction.PartnerListData(apiResponse));
  } catch (error) {
    [];
  }
}

function* companyCount() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyCount(i);
    yield put(companyAction.CountSuccesss(apiResponse));
  } catch (error) {
    yield put(companyAction.CountSuccesss({ count: 0 }));
  }
}

function* addNotes(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addNotes(i, props.payload);
    yield put(companyAction.currentCompanyrData(apiResponse));
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
    yield put(companyAction.singleCompany({ companyId: props.payload.id }));
    yield put(companyAction.setIsLoadingData(false));
    yield put(companyAction.List(null));
  } catch (error) {}
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);
    yield put(companyAction.BasicActions({ remote: false }));
    yield backendApi.actionOnSelectData(i, props.payload);
    yield globalConfigActions.enableFeedback(
      `company delete request ${props.payload.action}ed`
    );
    yield put(companyAction.BasicActions({ status: true }));
    yield put(companyAction.List(null));
    yield put(companyAction.BasicActions({ remote: false }));
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* companySaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(companyAction.List.type, companyList);
  yield takeLatest(companyAction.FilterData.type, companyList);
  yield takeLatest(companyAction.NewPage.type, companyList);
  yield takeLatest(companyAction.ChangeLimit.type, companyList);
  yield takeLatest(companyAction.Search.type, companyList);
  yield takeLatest(companyAction.addCompany.type, addCompany);
  yield takeLatest(companyAction.addContact.type, addContact);
  yield takeLatest(companyAction.editCompany.type, editCompany);
  yield takeLatest(companyAction.singleCompany.type, viewCompany);
  yield takeLatest(
    companyAction.contactListOfCompany.type,
    contactListOfCompany
  );
  yield takeLatest(companyAction.deleteCompany.type, deleteCompany);
  yield takeLatest(companyAction.AddNotes.type, addNotes);
  yield takeLatest(companyAction.AddDocument.type, addDocument);
  yield takeLatest(companyAction.DeleteDocument.type, deleteDocument);
  yield takeLatest(companyAction.AddMeterReading.type, addMeterReading);
  yield takeLatest(companyAction.DeleteMeterReading.type, deleteMeterReading);
  yield takeLatest(companyAction.assigneeListOfCompany.type, assigneeList);
  yield takeLatest(companyAction.CreateAssignee.type, addAssignee);
  yield takeLatest(companyAction.PartnerList.type, partnerList);
  yield takeLatest(companyAction.Count.type, companyCount);
  yield takeLatest(companyAction.sendRequest.type, sendRequest);
  yield takeLatest(companyAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(companyAction.tableSort.type, companyList);
  yield takeLatest(
    companyAction.companyListForDropDown.type,
    companyListForDropDown
  );
  yield takeLatest(
    companyAction.companyListForDropDownLimit.type,
    companyListForDropDown
  );
  yield takeLatest(
    companyAction.companyListForDropDownSearch.type,
    companyListForDropDown
  );
}
