import { put, select, takeLatest, delay } from "redux-saga/effects";
import { PayloadAction, createSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./api";

export interface ConfigurationState {
  slug: any;
  loader: number;
  feedbackMsg: any;
  feedbackShow: boolean;
  partnersDrop: any;
  companiesDrop: any;
  consumersDrop: any;
  selectedCompany: any;
  selectedCompanyWithSite: any;
  selectedLead: any;
  selectedConsumer: any;
  visible: any;
  visibleSame: any;
  visibleThird: any;
  suppliers: any;
  dueTask: any;
  breadcrumbs: any;
  tempSelectOptions: any[];
  isSelectLoading: boolean;
  sidebar: String;
  editProfileDrawer: Boolean;
  currentPage: String;
  appBarTemplate: String;
}
export type ContainerState = ConfigurationState;

let set = new Set();

// The initial state of the Shared container

export const initialState: ContainerState = {
  slug: "",
  loader: 0,
  feedbackMsg: "",
  feedbackShow: false,
  partnersDrop: [],
  companiesDrop: [],
  consumersDrop: [],
  selectedCompany: [],
  selectedCompanyWithSite: [],
  selectedLead: [],
  selectedConsumer: [],
  visible: "password",
  visibleSame: "password",
  visibleThird: "password",
  suppliers: [],
  dueTask: "",
  breadcrumbs: [],
  tempSelectOptions: [],
  isSelectLoading: false,
  sidebar: "hoverClose", // [fullOpen,fullClose,hoverOpen,hoverClose]
  editProfileDrawer: false,
  currentPage: "",
  appBarTemplate: "mainTemplate",
};

const GlobalConfigSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    updateSlug(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
    },
    partnerDropDownListReq(state, action: PayloadAction<any>) { },
    partnerDropDownListResponse(state, action: PayloadAction<any>) {
      state.partnersDrop = action.payload;
    },
    companyDropDownListReq(state, action: PayloadAction<any>) { },
    companyDropDownListResponse(state, action: PayloadAction<any>) {
      state.companiesDrop = action.payload;
    },
    consumerDropDownListReq(state, action: PayloadAction<any>) { },
    consumerDropDownListResponse(state, action: PayloadAction<any>) {
      state.consumersDrop = action.payload.data;
    },
    singleCompanyDetail(state, action: PayloadAction<any>) { },
    singleCompanyDetailSuccess(state, action: PayloadAction<any>) {
      state.selectedCompany = action.payload.data;
    },
    singleConsumerDetail(state, action: PayloadAction<any>) { },
    singleConsumerDetailSuccess(state, action: PayloadAction<any>) {
      state.selectedConsumer = action.payload.data;
    },
    singleCompanyDetailWithSite(state, action: PayloadAction<any>) {
    },
    singleCompanyDetailWithSiteSuccess(state, action: PayloadAction<any>) {
      state.selectedCompanyWithSite = action.payload.data;
    },
    singleLeadDetailWithSite(state, action: PayloadAction<any>) { },
    singleLeadDetailWithSiteSuccess(state, action: PayloadAction<any>) {
      state.selectedLead = action.payload.data;
    },
    changeBreadCrumbs(state, action: PayloadAction<any>) {
      state.breadcrumbs = action.payload;
    },
    changeIsVisible(state, action: PayloadAction<any>) {
      state.visible = action.payload;
    },
    changeIsVisibleSame(state, action: PayloadAction<any>) {
      state.visibleSame = action.payload;
    },
    changeIsVisibleSameThird(state, action: PayloadAction<any>) {
      state.visibleThird = action.payload;
    },
    basicActionsForTask(state, action: PayloadAction<any>) {
      if (action.payload.selectedCompany !== undefined)
        state.selectedCompany = action.payload.selectedCompany;
    },
    supplierList(state, action: PayloadAction<any>) { },
    supplierListSuccess(state, action: PayloadAction<any>) {
      state.suppliers = action.payload.data;
    },
    dueDateTask(state, action: PayloadAction<any>) { },
    dueTaskSuccess(state, action: PayloadAction<any>) {
      state.dueTask = action.payload.data;
    },
    enableFeedback(state, action: PayloadAction<any>) {
      state.feedbackMsg = action.payload;
      state.feedbackShow = true;
    },

    disableFeedback(state, action: PayloadAction<any>) {
      state.feedbackMsg = "";
      state.feedbackShow = false;
    },

    startLoader(state, action: PayloadAction<any>) {
      state.loader = state.loader + 1;
    },

    endLoader(state, action: PayloadAction<any>) {
      state.loader = state.loader - 1;
    },

    endLoaderAll(state, action: PayloadAction<any>) {
      state.loader = 0;
    },
    getTempSelectOptions(state, action: PayloadAction<any>) {
      state.isSelectLoading = true;
      // console.log(action);
    },
    setTempSelectOptions(state, action: PayloadAction<any>) {
      console.log(action);
      let counter = 10;
      if (action.payload.data.length === 0) {
        set.clear();
        state.tempSelectOptions = [];
      } else if (action.payload.data.length > 0) {
        let tempSelectOptions = [...state.tempSelectOptions];

        action.payload.data.forEach((ele) => {

          if (set.has(ele.label)) {
          } else if (action.payload.query === null && counter !== 0) {
            set.add(ele.label);
            counter--;
            tempSelectOptions.push(ele);
          } else if (
            counter !== 0 &&
            ele.label.toLowerCase().includes(action.payload.query) &&
            set.has(ele.label) === false
          ) {
            set.add(ele.label);
            counter--;
            tempSelectOptions.push(ele);
          }
        });
        state.tempSelectOptions = tempSelectOptions;
      }
      state.isSelectLoading = false;
    },
    changeStatusOfSidebar(state, action: PayloadAction<any>) {
      state.sidebar = action.payload;
    },
    changeStatusEditProfileDrawer(state, action: PayloadAction<Boolean>) {
      state.editProfileDrawer = action.payload;
    },
    changeCurrentPage(state, action: PayloadAction<String>) {
      state.currentPage = action.payload;
    },
    changeAppBarTemplate(state, action: PayloadAction<String>) {
      state.appBarTemplate = action.payload;
    },
  },
});

export const {
  actions: globalConfigActions,
  reducer: globalConfigReducer,
  name: globalConfigKeyName,
} = GlobalConfigSlice;
const selectDomain = (state: RootState) => state.configuration || initialState;

export const selectGlobalConfig = createSelector(
  [selectDomain],
  (configuration) => configuration
);
export const selectBreadCrumb = createSelector(
  [selectDomain],
  (configuration) => configuration.breadcrumbs
);

export const selectFeedback = createSelector(
  [selectDomain],
  (configuration) => configuration.feedbackMsg
);

export const selectFeedbackShow = createSelector(
  [selectDomain],
  (configuration) => configuration.feedbackShow
);

export const selectLoader = createSelector(
  [selectDomain],
  (configuration) => configuration.loader
);

export const selectTempSelect = createSelector(
  [selectDomain],
  (configuration) => configuration.tempSelectOptions
);

export const selectIsSelectLoading = createSelector(
  [selectDomain],
  (configuration) => configuration.isSelectLoading
);
export const selectSidebarStatus = createSelector(
  [selectDomain],
  (configuration) => configuration.sidebar
);
export const changeEditProfileDrawerStatus = createSelector(
  [selectDomain],
  (configuration) => configuration.editProfileDrawer
);
export const currentPageSelector = createSelector(
  [selectDomain],
  (configuration) => configuration.currentPage
);
export const appBarTemplateSelector = createSelector(
  [selectDomain],
  (configuration) => configuration.appBarTemplate
);
let product = 1;

export function* getTempSelectOptionsSaga(props) {
  try {
    let apiResponse = yield backendApi.getOptions();
    const temp: any = [];
    apiResponse.forEach((element, idx) => {
      element.label = element.title;
      element.value = element.title;
      temp[idx] = element;
    });
    product++;
    yield put(
      globalConfigActions.setTempSelectOptions({
        data: apiResponse,
        query: props.payload,
      })
    );
  } catch (error) { }
}

export const getState = (state: RootState) => state.configuration;

function* partnerList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.partnerList();
    yield put(globalConfigActions.partnerDropDownListResponse(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.partnerDropDownListResponse([]));
  }
}

function* companyList() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdown(i);
    yield put(globalConfigActions.companyDropDownListResponse(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.companyDropDownListResponse([]));
  }
}

function* consumerList(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerListForDropdown(
      i,
      props.payload
    );
    yield put(globalConfigActions.consumerDropDownListResponse(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.consumerDropDownListResponse([]));
  }
}

function* singleCompanyDetail(props) {
  try {
    const apiResponse = yield backendApi.singleCompanyDetail(props.payload);
    yield put(globalConfigActions.singleCompanyDetailSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* singleCompanyDetailWithSite(props) {
  try {
    const apiResponse = yield backendApi.singleCompanyDetailWithSite(
      props.payload
    );
    yield put(
      globalConfigActions.singleCompanyDetailWithSiteSuccess(apiResponse)
    );
  } catch (error) {
  }
}

function* singleLeadDetailWithSite(props) {
  try {
    const apiResponse = yield backendApi.singleLeadDetailWithSite(
      props.payload
    );
    yield put(globalConfigActions.singleLeadDetailWithSiteSuccess(apiResponse));
  } catch (error) {
    [];
  }
}
function* singleConsumerDetail(props) {
  try {
    const apiResponse = yield backendApi.singleConsumerDetail(props.payload);
    yield put(globalConfigActions.singleConsumerDetailSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* supplierList(props) {
  try {
    const apiResponse = yield backendApi.supplierList(props.payload);
    yield put(globalConfigActions.supplierListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* DueDateTask() {
  try {
    const apiResponse = yield backendApi.DueDateTask();
    yield put(globalConfigActions.dueTaskSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

export function* ConfigurationSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(
    globalConfigActions.partnerDropDownListReq.type,
    partnerList
  );
  yield takeLatest(
    globalConfigActions.companyDropDownListReq.type,
    companyList
  );
  yield takeLatest(
    globalConfigActions.consumerDropDownListReq.type,
    consumerList
  );
  yield takeLatest(
    globalConfigActions.singleCompanyDetail.type,
    singleCompanyDetail
  );
  yield takeLatest(globalConfigActions.singleCompanyDetailWithSite.type, singleCompanyDetailWithSite);
  yield takeLatest(
    globalConfigActions.singleLeadDetailWithSite.type,
    singleLeadDetailWithSite
  );
  yield takeLatest(
    globalConfigActions.singleConsumerDetail.type,
    singleConsumerDetail
  );
  yield takeLatest(globalConfigActions.supplierList.type, supplierList);
  yield takeLatest(globalConfigActions.dueDateTask.type, DueDateTask);
}
