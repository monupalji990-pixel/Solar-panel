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

import backendApi from "./model/assignee";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface assignee {
  isLoadingData: boolean;
  assigneeList: any;
  companyId: string;
  consumerID: string;
  count: number;
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
  assigneeListForDropdown: any;
  assigneeListInstallerForDropdown: any;
  assigneeListSurveyorForDropdown: any;
  assigneeListSalesRepForDropdown: any;
  allAssignee: any;
  currentConsumer: any;
  currentCompany: any;
  showingFrom: String;
}
export type ContainerState = assignee;

export const initialState: ContainerState = {
  isLoadingData: false,
  assigneeList: [],
  companyId: "",
  consumerID: "",
  count: 0,
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
  assigneeListForDropdown: [],
  assigneeListInstallerForDropdown: [],
  assigneeListSurveyorForDropdown: [],
  assigneeListSalesRepForDropdown: [],
  allAssignee: [],
  currentConsumer: {},
  currentCompany: {},
  showingFrom: ''
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const assigneeSlice = createSlice({
  name: "assignee",
  initialState,
  reducers: {
    assigneeCompanylist(state, action: PayloadAction<any | null>) {
      state.showingFrom = action.payload.showingFrom
    },
    assigneeCompanylistSuccess(state, action: PayloadAction<any>) {
      state.assigneeList = action.payload.data.map((e) => {
        return {
          _id: e._id,
          name: e.name,
          email: e.email,
          role: e.role ? e.role.roleName : "",
        };
      });
      state.allAssignee = action.payload.allAssignee;
      state.count = action.payload.count;
      state.remote = true;
    },
    list(state, action: PayloadAction<any | null>) { },
    listSuccess(state, action: PayloadAction<any>) {
      state.assigneeListForDropdown = action.payload.data;
    },
    listFailure(state, action: PayloadAction<any>) { },

    listInstaller(state, action: PayloadAction<any | null>) { },
    listSuccessInstaller(state, action: PayloadAction<any>) {
      state.assigneeListInstallerForDropdown = action.payload.data;
    },
    listFailureInstaller(state, action: PayloadAction<any>) { },

    listSurveyor(state, action: PayloadAction<any | null>) { },
    listSuccessSurveyor(state, action: PayloadAction<any>) {
      state.assigneeListSurveyorForDropdown = action.payload.data;
    },
    listFailureSurveyor(state, action: PayloadAction<any>) { },

    listSalesRep(state, action: PayloadAction<any | null>) { },
    listSuccessSalesRep(state, action: PayloadAction<any>) {
      state.assigneeListSalesRepForDropdown = action.payload.data;
    },
    listFailureSalesRep(state, action: PayloadAction<any>) { },


    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },

    deleteAssignee(state, action: PayloadAction<any>) { },
    addAssignee(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    addAssigneeSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    addAssigneeFailure(state, action: PayloadAction<any>) {
    },
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    NewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.companyId = action.payload.companyId;
      state.consumerID = action.payload.consumerID;
      state.slug = action.payload.slug;
    },
    assigneeConsumerlist(state, action: PayloadAction<any | null>) {
      state.showingFrom = action.payload.showingFrom
    },
    assigneeConsumerlistSuccess(state, action: PayloadAction<any>) {
      state.remote = true;
    },
    setIsLoading(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    FilterData(state, action: PayloadAction<any>) { },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
  },
});

export const {
  actions: assigneeAction,
  reducer: assigneeReducer,
  name: sliceKeyAssignee,
} = assigneeSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.assignee || initialState;

export const selectAssigneeState = createSelector(
  [selectDomain],
  (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.assignee;

export function* assigneeCompanyList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.assigneeListOfCompany(i);
    yield put(assigneeAction.assigneeCompanylistSuccess(apiResponse));
  } catch (error) {
    yield put(assigneeAction.assigneeCompanylistSuccess([]));
  } finally {
    if (yield cancelled()) {
    }
  }
}

export function* assigneeConsumerListList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.assigneeListOfConsumer(i);
    yield put(assigneeAction.assigneeCompanylistSuccess(apiResponse));
  } catch (error) {
    yield put(assigneeAction.assigneeCompanylistSuccess([]));
  } finally {
    if (yield cancelled()) {
    }
  }
}

function* CallToWhichOne() {
  const i = yield select(getState);
  if (i.companyId) yield assigneeCompanyList(null);
  if (i.consumerID) yield assigneeConsumerListList(null);
}

function* removeAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.removeAssignee(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Assignee removed successfully")
    );
    if (props.payload.Consumer) {
      yield assigneeConsumerListList(null);
    }
    if (props.payload.CompanyID) {
      yield assigneeCompanyList(null);
    }
  } catch (error) {
    yield put(assigneeAction.assigneeCompanylistSuccess([]));
  }
}

function* assigneeList(props) {
  try {
    const apiResponse = yield backendApi.assigneeList(null);
    yield put(assigneeAction.listSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* assigneeListInstaller(props) {
  try {
    const apiResponse = yield backendApi.assigneeList(props.payload);
    yield put(assigneeAction.listSuccessInstaller(apiResponse));
  } catch (error) {
    [];
  }
}

function* assigneeListSurveyor(props) {
  try {
    const apiResponse = yield backendApi.assigneeList(props.payload);
    yield put(assigneeAction.listSuccessSurveyor(apiResponse));
  } catch (error) {
    [];
  }
}

function* assigneeListSalesRep(props) {
  try {
    const apiResponse = yield backendApi.assigneeList(props.payload);
    yield put(assigneeAction.listSuccessSalesRep(apiResponse));
  } catch (error) {
    yield put(assigneeAction.listFailureSalesRep([]));
  }
}

function* addAssignee(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addAssignee(i, props);
    yield put(
      globalConfigActions.enableFeedback("Assignee added successfully")
    );
    yield put(assigneeAction.CloseSideBar(true));
    yield put(assigneeAction.LoaderStart(false));

    if (props.payload.action === "viewConsumer")
      yield assigneeConsumerListList(null);
    if (props.payload.action === "viewCompany") yield assigneeCompanyList(null);
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
    yield put(assigneeAction.CloseSideBar(true));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* assigneeSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(assigneeAction.list.type, assigneeList);
  yield takeLatest(assigneeAction.listInstaller.type, assigneeListInstaller);
  yield takeLatest(assigneeAction.listSurveyor.type, assigneeListSurveyor);
  yield takeLatest(assigneeAction.listSalesRep.type, assigneeListSalesRep)
  yield takeLatest(assigneeAction.tableSort.type, assigneeList);
  yield takeLatest(assigneeAction.NewPage.type, CallToWhichOne);
  yield takeLatest(assigneeAction.ChangeLimit.type, CallToWhichOne);
  yield takeLatest(assigneeAction.Search.type, CallToWhichOne);
  yield takeLatest(
    assigneeAction.assigneeCompanylist.type,
    assigneeCompanyList
  );
  yield takeLatest(
    assigneeAction.assigneeConsumerlist.type,
    assigneeConsumerListList
  );
  yield takeLatest(assigneeAction.addAssignee.type, addAssignee);
  yield takeLatest(assigneeAction.deleteAssignee.type, removeAssignee);
}
