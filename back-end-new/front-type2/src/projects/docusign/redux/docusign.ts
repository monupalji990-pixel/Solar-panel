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
import backendApi from "./model/docusign";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { digitalDocAction } from "projects/digitalDocs/redux/digital";

export interface docusign {
  templateList: any;
  templateListSkip: number;
  templateListLoading: boolean,
  currentTemplate: any;
  recipientOption: any;
  loading: boolean;
  dynamicRoleFieldsLoading: boolean;
  docusignHistory: Array<any>;
  isAuditDrawerOpen: boolean;
  AuditView: IAuditView;
  tabs: any;
}
export type ContainerState = docusign;

const initOption = {
  module: "",
  options: [],
  isNext: true,
  skip: 0,
  limit: 10,
  search: "",
  companyId: "",
  supplierId: "",
  isLoading: false,
};
interface IAuditView {
  auditEvents: Array<any>;
  isLoading: boolean;
  envId: string;
  documentUrl: string;
  docusignEmailSubject: string;
}
const initialAuditData: IAuditView = {
  auditEvents: [],
  isLoading: false,
  envId: "",
  docusignEmailSubject: "",
  documentUrl: ''
};

export const initialState: ContainerState = {
  templateList: {
    envelopeTemplates: []
  },
  templateListSkip: 0,
  templateListLoading: false,
  currentTemplate: [],
  recipientOption: {
    Edan: initOption,
  },
  loading: false,
  dynamicRoleFieldsLoading: false,
  docusignHistory: [],
  isAuditDrawerOpen: false,
  AuditView: initialAuditData,
  tabs: {
    textTabs: []
  }
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const docusignSlice = createSlice({
  name: "docusign",
  initialState,
  reducers: {
    templateList(state, action: PayloadAction<any | null>) {
      state.loading = true;
    },

    templateListSuccess(state, action: PayloadAction<any>) {
      const newList = [
        ...state.templateList["envelopeTemplates"],
        ...action.payload["envelopeTemplates"],
      ];

      state.templateList = { ...action.payload, envelopeTemplates: newList };
      state.loading = false;
      state.templateListLoading = false
    },
    viewTemplate(state, action: PayloadAction<any | null>) {
      state.dynamicRoleFieldsLoading = true;
    },
    viewTemplateSuccess(state, action: PayloadAction<any>) {
      state.currentTemplate = action.payload.recipientList;
      state.dynamicRoleFieldsLoading = false;
      const recipientObj = {};
      for (const rec of action.payload.recipientList) {
        recipientObj[rec] = initOption;
      }
      state.recipientOption = recipientObj;
      state.tabs = action.payload.tabs;
    },
    sendEnvelope(state, action: PayloadAction<any | null>) {
      state.loading = true;
    },
    sendEnvelopeSuccess(state, action: PayloadAction<any | null>) {
      state.loading = false;
      state.currentTemplate = [];
    },
    getDocusignHistory(state, action: PayloadAction<any | null>) {
      state.loading = true;
    },
    getDocusignHistorySuccess(state, action: PayloadAction<any | null>) {
      state.docusignHistory = action.payload;
      state.loading = false;
    },
    clearDocusignRedux(state, action: PayloadAction<any | null>) {
      return initialState;
    },
    getRecipientOptions(state, action: PayloadAction<any>) {
      state.recipientOption[action.payload.recipient]["options"] = [];
      state.recipientOption[action.payload.recipient]["module"] =
        action.payload.module;
      if (action.payload.companyId)
        state.recipientOption[action.payload.recipient]["companyId"] =
          action.payload.companyId;
      if (action.payload.supplierId)
        state.recipientOption[action.payload.recipient]["supplierId"] =
          action.payload.supplierId;
      state.recipientOption[action.payload.recipient]["isLoading"] = true;
    },
    recipientModuleChange(state, action: PayloadAction<any>) {
      state.recipientOption[action.payload.recipient] = { ...initOption };
      state.recipientOption[action.payload.recipient].isLoading = true;
    },
    recipientOptionChangeLimit(state, action: PayloadAction<any>) {
      state.recipientOption[action.payload.recipient]["module"] =
        action.payload.module;
      state.recipientOption[action.payload.recipient]["skip"] =
        action.payload.skip;
      state.recipientOption[action.payload.recipient]["isLoading"] = true;
    },
    recipientOptionSearch(state, action: PayloadAction<any>) {
      state.recipientOption[action.payload.recipient] = { ...initOption };
      state.recipientOption[action.payload.recipient]["module"] =
        action.payload.module;
      state.recipientOption[action.payload.recipient]["search"] =
        action.payload.search;
      state.recipientOption[action.payload.recipient]["isLoading"] = true;
    },
    recipientOptionSuccess(state, action: PayloadAction<any>) {
      let newData = action.payload.options.map((e) => ({
        value: e.email.replace(/\+[0-9]+/g, ""),
        label: e.email.replace(/\+[0-9]+/g, ""),
      }));
      state.recipientOption[action.payload.recipient]["options"] = [
        ...state.recipientOption[action.payload.recipient]["options"],
        ...newData,
      ];
      state.recipientOption[action.payload.recipient]["isLoading"] = false;
    },
    recipientOptionChangeLoading(state, action: PayloadAction<any>) {
      state.recipientOption[action.payload.recipient]["isLoading"] =
        action.payload;
    },
    changeAuditDrawer(
      state,
      action: PayloadAction<{ open: boolean; envId: string, docusignEmailSubject: string }>
    ) {
      state.isAuditDrawerOpen = action.payload.open;
      state.AuditView.envId = action.payload.envId;
      state.AuditView.docusignEmailSubject = action.payload.docusignEmailSubject;
    },
    getAuditData(state, action: PayloadAction<any>) {
      state.AuditView.isLoading = true;
    },
    AuditDataSucess(state, action: PayloadAction<any>) {
      state.AuditView.auditEvents = action.payload.auditEvents;
      state.AuditView.documentUrl = action.payload.documentUrl;
      state.AuditView.isLoading = false;

    },
    changeTemplateListSkip(state, action: PayloadAction<any>) {
      state.templateListSkip = action.payload.skip;
      state.templateListLoading = true;
    },
  },
});

export const {
  actions: docusignAction,
  reducer: docusignReducer,
  name: sliceKeyDocusign,
} = docusignSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.docusign || initialState;

export const selectDocusignState = createSelector(
  [selectDomain],
  (State) => State
);

export const selectRecipientOption = createSelector(
  [selectDomain],
  (State) => State.recipientOption
);

export const selectAuditViewData = createSelector(
  [selectDomain],
  (State) => State.AuditView
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.docusign;

export function* templateList(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.templateList(props.payload, i);

    if (apiResponse.redirect_url) {
      window.location = apiResponse.redirect_uri;
    } else {
      yield put(docusignAction.templateListSuccess(apiResponse));
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

export function* viewTemplate(props: any) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.getTemplateRecipients(props.payload);
    yield put(docusignAction.viewTemplateSuccess(apiResponse));
    const recipientOptions = yield select(selectRecipientOption);

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}
export function* sendEnvelope(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.sendEnvelope(props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));

    yield put(docusignAction.sendEnvelopeSuccess(null));
    yield put(digitalDocAction.List(null))
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
  } finally {
    if (yield cancelled()) {
    }
  }
}
export function* getDocusignHistory(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.getQuoteEnvelopesHistory(
      props.payload
    );
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(docusignAction.getDocusignHistorySuccess(apiResponse.data));
  } catch (error) {
    console.log(error);
  }
}

function* getRecipientOptions(props: any) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.getRecipientOptions({
      ...i.recipientOption[props.payload.recipient],
      recipient: props.payload.recipient,
    });
    if (apiResponse.success) {
      yield put(
        docusignAction.recipientOptionSuccess({
          recipient: props.payload.recipient,
          options: apiResponse.data,
        })
      );
    }
  } catch (e) {
    yield put(docusignAction.recipientOptionChangeLoading(false));
  }
}

function* getAuditData(props) {
  try {
    const ApiResponse = yield backendApi.getAuditData(props.payload);
    const newData = yield convertData(ApiResponse.auditEvents);
    yield put(docusignAction.AuditDataSucess({ auditEvents: newData, documentUrl: ApiResponse.documentUrl }));
    yield put(globalConfigActions.enableFeedback(ApiResponse.message));
  } catch (e) {
    console.log("error in getAuditData", e);
  }
}

function* convertData(data) {
  try {
    const arr = data.map((e) => {
      const obj = {};
      for (const field of e.eventFields) {
        obj[field.name] = field.value;
      }
      return obj;
    });
    return arr;
  } catch (e) {
    console.log("error in converting data", e);
    return [];
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export function* docusignSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(docusignAction.templateList.type, templateList);
  yield takeLatest(docusignAction.viewTemplate.type, viewTemplate);
  yield takeLatest(docusignAction.sendEnvelope.type, sendEnvelope);
  yield takeLatest(docusignAction.getDocusignHistory.type, getDocusignHistory);
  yield takeLatest(
    docusignAction.getRecipientOptions.type,
    getRecipientOptions
  );
  yield takeLatest(
    docusignAction.recipientOptionChangeLimit.type,
    getRecipientOptions
  );
  yield takeLatest(
    docusignAction.recipientOptionSearch.type,
    getRecipientOptions
  );
  yield takeLatest(docusignAction.getAuditData.type, getAuditData);
  yield takeLatest(docusignAction.changeTemplateListSkip.type, templateList);
}
