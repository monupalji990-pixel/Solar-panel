
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
import backendApi from "./model/history";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface history {
    count: number;
    limit: number;
    historyCount: number;
    page: number;
    historyList: any;
    isLoadingData: boolean;
    remote: boolean;
    historyFor: string;
    userId: string;
    leadId: string;
    companyId: string;
    consumerId: string,
    quoteId: string,
    renewalId: string,
    supplierId: string
    taskId: string;
    showingFrom: string;
}
export type ContainerState = history;

export const initialState: ContainerState = {
    count: -1,
    limit: 10,
    historyCount: -1,
    page: 1,
    historyList: [],
    isLoadingData: false,
    remote: false,
    historyFor: "",
    userId: '',
    leadId: '',
    companyId: '',
    consumerId: '',
    quoteId: '',
    renewalId: '',
    supplierId: '',
    taskId: '',
    showingFrom: ''
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        historyLoaderStart(state, action: PayloadAction<any>) {
            state.remote = action.payload;
            state.page = 1;
        },
        historyList(state, action: PayloadAction<any>) {
            state.showingFrom = action.payload.showingFrom
        },
        historyListSuccess(
            state,
            action: PayloadAction<any>
        ) {
            state.historyList = action.payload?.data?.map(e => {
                return {
                    _id: e._id,
                    event: helperMethods.EventTypeCreator(e),
                    createdAt: e.createdAt ? helperMethods.ConvertDateAndTime(e.createdAt) : helperMethods.MillisecondsToDate(e.timestamps),
                    addedBy: e.addedBy ? e.addedBy : e.editedBy,
                    description: "",
                    notes: e.notes ? e.notes : '-',
                    amount: e.negotiation ? e.negotiation.Amount : '-',
                    contractLength: e.negotiation ? e.negotiation.ContractLength : '-',
                    expiryDate: e.negotiation ? helperMethods.MillisecondsToDate(e.negotiation.ExpiryDate) : '-',
                    invoice: e.invoice ? e.invoice : '-'
                };
            });
            state.remote = true;
        },
        userListFailure(state, action: PayloadAction<any>) {
        },

        historyBasicActions(state, action: PayloadAction<any>) {
            if (action.payload.count !== undefined) state.count = action.payload.count;
            if (action.payload.historyCount !== undefined) state.historyCount = action.payload.historyCount;
        },
        historyChangeLimit(
            state,
            action: PayloadAction<{ limit: number; page: number }>
        ) {
            state.limit = action.payload.limit;
        },
        historyNewPage(state, action: PayloadAction<{ page: number }>) {
            state.page = action.payload.page;
        },
        historyNewPageSuccess(state, action: PayloadAction<{ page: number }>) {
        },
        historyNewPageFailure(state, action: PayloadAction<{ page: number }>) {
        },

        historyCount(state, action: PayloadAction<any | null>) {
        },
        historyFor(state, action: PayloadAction<any | null>) {
            state.historyFor = action.payload.historyFor;
            state.userId = (action.payload.user !== undefined) ? action.payload.user._id : '';
            state.leadId = (action.payload.lead !== undefined) ? action.payload.lead._id : '';
            state.companyId = (action.payload.company !== undefined) ? action.payload.company._id : '';
            state.consumerId = (action.payload.consumer !== undefined) ? action.payload.consumer._id : '';
            state.supplierId = (action.payload.supplier !== undefined) ? action.payload.supplier._id : '';
            state.quoteId = (action.payload.quote !== undefined) ? action.payload.quote._id : '';
            state.renewalId = (action.payload.renewal !== undefined) ? action.payload.renewal._id : '';
            state.taskId = (action.payload.task !== undefined) ? action.payload.task._id : '';
            state.historyCount = -1;
        },
    },
});

export const {
    actions: historyAction,
    reducer: historyReducer,
    name: sliceKeyHistory,
} = historySlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.history || initialState;

export const selectHistoryState = createSelector(
    [selectDomain],
    (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.history;

export function* historyList(props: any) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.historyList(i);
        const count = apiResponse.data.length < i.limit ? ((i.page - 1) * i.limit) + apiResponse.data.length : -1;
        yield put(historyAction.historyBasicActions({ count }))
        yield put(globalConfigActions.endLoader(null));
        yield put(historyAction.historyListSuccess(apiResponse));
    } catch (error) {
        console.log("error", error);
        
        yield put(globalConfigActions.endLoader(null));
        yield put(historyAction.historyListSuccess([]));
    }
}

function* historyCount() {
    try {
        const i = yield select(getState);
        const apiResponse = yield backendApi.historyCount(i);
        yield put(historyAction.historyBasicActions({ historyCount: apiResponse.count }))
    } catch (error) {
        yield put(historyAction.historyBasicActions({ historyCount: 0 }))

    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* historySaga() {
    // Watches for loadRepos actions and calls getRepos when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(historyAction.historyList.type, historyList);
    yield takeLatest(historyAction.historyNewPage.type, historyList);
    yield takeLatest(historyAction.historyChangeLimit.type, historyList);
    yield takeLatest(historyAction.historyCount.type, historyCount);
}
