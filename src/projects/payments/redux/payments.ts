
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
import backendApi from "./model/payments";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";

export interface payment {
    count: number;
    splitCount: number;
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
    getPayments: any;
    viewLoader: boolean;
    addLoader: boolean;
    hideSidebar: boolean,
    search: any;
    quoteList: any;
    quoteDropdownLimit: any;
    searchValue: string,
    supplierPayments: any;
    commissionPayments: any;
    salesRepPayments: any;
    salesrepLoader: boolean;
    salesRepPaymentsDetail: any;
    quoteDropdownList: any;
    splitCommission: any;
    splitLoader: boolean;
    splitLimit: number;
    splitPage: number;
    splitId: any;
    comissLoader: boolean;
    comissLimit: number;
    comissPage: number;
    comissCount: number;
    salesRepUserId: any;
    getPaymentsAllData: any;
}
export type ContainerState = payment;

export const initialState: ContainerState = {
    count: -1,
    splitCount: -1,
    limit: 10,
    splitLimit: 10,
    splitPage: 1,
    comissLoader: true,
    comissLimit: 10,
    comissPage: 1,
    comissCount: -1,
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
    getPayments: [],
    viewLoader: false,
    addLoader: false,
    hideSidebar: false,
    search: {},
    quoteList: [],
    quoteDropdownLimit: 10,
    searchValue: "",
    supplierPayments: [],
    commissionPayments: [],
    salesRepPayments: [],
    salesrepLoader: false,
    salesRepPaymentsDetail: {},
    quoteDropdownList: [],
    splitCommission: [],
    splitLoader: false,
    splitId: {},
    salesRepUserId: {},
    getPaymentsAllData: {}
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        historyLoaderStart(state, action: PayloadAction<any>) {
            state.remote = action.payload;
            state.page = 1;
        },
        splitHistoryLoaderStart(state, action: PayloadAction<any>) {
            state.splitLoader = action.payload;
            state.splitPage = 1;
        },
        salesRepCommissionHistoryLoaderStart(state, action: PayloadAction<any>) {
            state.salesrepLoader = action.payload;
            state.comissPage = 1;
        },
        paymentList(state, action: PayloadAction<any>) {
            state.remote = false;
        },
        paymentListSuccess(state, action: PayloadAction<any>) {
            state.historyList = action.payload.data.map(e => {
                return {
                    _id: e._id,
                    companyId: e.companyId,
                    company: e.company && e.company?.businessName,
                    contractStatus: e.contractStatus || 'N/A',
                    quoteId: e.quoteId,
                    ref: e.quote && e.quote.QuoteID,
                    supplier: e.supplier,
                    supplierId: e.supplierId,
                    meterNumber: e.quote && e.quote?.service?.electric?.meterNumber || e.quote && e.quote?.service?.gas?.meterNumber
                };
            });
            state.remote = true;
        },

        editPayments(state, action: PayloadAction<any>) {
        },

        viewSalesRepPayments(state, action: PayloadAction<any>) {
            state.salesRepUserId = action.payload;
            state.salesrepLoader = true
        },
        viewSalesRepPaymentsSuccess(state, action: PayloadAction<any>) {
            state.salesRepPayments = action.payload.data
            state.salesRepPaymentsDetail = action.payload
            state.salesrepLoader = false
        },
        viewSalesRepPaymentsFailure(state, action: PayloadAction<any>) {
            state.salesRepPayments = action.payload.data
            state.salesrepLoader = false
        },

        viewPayments(state, action: PayloadAction<any>) {
            state.viewLoader = true;
        },
        viewPaymentsSuccess(state, action: PayloadAction<any>) {
            state.viewLoader = false;
            state.getPaymentsAllData = action.payload
            state.getPayments = action.payload.data
            state.commissionPayments = action.payload.data?.commissionPayments
            state.supplierPayments = action.payload.data?.supplierPayments
        },

        editHistoryPayment(state, action: PayloadAction<any>) {
        },

        updateStatus(state, action: PayloadAction<any>) {
        },

        editMonthlyPayout(state, action: PayloadAction<any>) {
        },

        splitCommission(state, action: PayloadAction<any>) {
            state.splitLoader = true;
            state.splitId = action.payload;
        },
        splitCommissionSuccess(state, action: PayloadAction<any>) {
            state.splitCommission = action.payload.data;
            state.splitLoader = false;
        },

        FilterData(state, action: PayloadAction<any>) {
            state.remote = false;
            state.search = action.payload;
        },

        dropdownQuoteList(state, action: PayloadAction<any>) { },
        dropdownQuoteListSuccess(state, action: PayloadAction<any>) {
            state.quoteDropdownList = action.payload.data;
        },

        addInternalPayment(state, action: PayloadAction<any>) {
        },
        addInternalPaymentSuccess(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },
        addInternalPaymentFailed(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },

        addPayment(state, action: PayloadAction<any>) {
        },
        addPaymentSuccess(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },
        addPaymentFailed(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },

        addSupplierPayment(state, action: PayloadAction<any>) {
        },
        addSupplierPaymentSuccess(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },
        addSupplierPaymentFailed(state, action: PayloadAction<any>) {
            state.addLoader = true;
        },

        userListFailure(state, action: PayloadAction<any>) {
        },

        closeSidebarFun(state, action: PayloadAction<any>) {
            state.hideSidebar = action.payload;
        },

        historyBasicActions(state, action: PayloadAction<any>) {
            if (action.payload.count !== undefined) state.count = action.payload.count;
            if (action.payload.comissCount !== undefined) state.comissCount = action.payload.comissCount;
            if (action.payload.splitCount !== undefined) state.splitCount = action.payload.splitCount;
            if (action.payload.historyCount !== undefined) state.historyCount = action.payload.historyCount;
            if (action.payload.isLoadingData !== undefined) state.isLoadingData = action.payload.isLoadingData;
        },
        historyChangeLimit(
            state,
            action: PayloadAction<{ limit: number; page: number }>
        ) {
            state.limit = action.payload.limit;
        },
        splitChangeLimit(
            state,
            action: PayloadAction<{ splitLimit: number; splitPage: number }>
        ) {
            state.splitLimit = action.payload.splitLimit;
        },
        salesRepChangeLimit(
            state,
            action: PayloadAction<{ comissLimit: number; comissPage: number }>
        ) {
            state.comissLimit = action.payload.comissLimit;
        },
        historyNewPage(state, action: PayloadAction<{ page: number }>) {
            // state.history.success = false;
            state.page = action.payload.page;
        },
        historyNewPageSuccess(state, action: PayloadAction<{ page: number }>) {
        },
        historyNewPageFailure(state, action: PayloadAction<{ page: number }>) {
        },

        splitNewPage(state, action: PayloadAction<{ splitPage: number }>) {
            state.splitPage = action.payload.splitPage;
        },
        splitNewPageSuccess(state, action: PayloadAction<{ splitPage: number }>) {
        },
        splitNewPageFailure(state, action: PayloadAction<{ splitPage: number }>) {
        },

        salesRepNewPage(state, action: PayloadAction<{ comissPage: number }>) {
            state.comissPage = action.payload.comissPage;
        },
        salesRepNewPageSuccess(state, action: PayloadAction<{ comissPage: number }>) {
        },
        salesRepNewPageFailure(state, action: PayloadAction<{ comissPage: number }>) {
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
    actions: paymentAction,
    reducer: paymentReducer,
    name: sliceKeyPayment,
} = paymentSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.payment || initialState;

export const selectPaymentState = createSelector(
    [selectDomain],
    (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.payment;

export function* paymentHistoyList(props: any) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.listPaymentHistory(i);

        const count = apiResponse.data.length < i.limit ? (i.page - 1) * i.limit + apiResponse.data.length : -1;

        yield put(paymentAction.historyBasicActions({ count }))

        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.paymentListSuccess(apiResponse));
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));

        yield put(paymentAction.paymentListSuccess([]));
    }
}

export function* UpdatePaymentInfo(props: any) {
    try {
        const obj: any = {
            supplierId: props?.payload?.supplierId,
            quoteId: props?.payload?.quoteId,
        }
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.editPayment(props.payload);

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.viewPayments(obj));
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
    }
}

export function* editHistoryPaymentReq(props: any) {
    try {
        const newObj: any = {
            supplierId: props?.payload?.data?.supplierId,
            quoteId: props?.payload?.data?.quoteId,
        }
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.editPaymentHistoryAPI(props.payload.obj);
        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.viewPayments(newObj));
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
    }
}

export function* getPaymentHistory(props: any) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.getPaymentHistory(props.payload);

        const count = apiResponse.data.length < i.limit ? ((i.page - 1) * i.limit) + apiResponse.data.length : -1;
        if (apiResponse.success)
            yield put(paymentAction.viewPaymentsSuccess(apiResponse));
        yield put(paymentAction.historyBasicActions({ count }))
        yield put(globalConfigActions.endLoader(null));
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));

        yield put(paymentAction.viewPaymentsSuccess([]));
    } finally {
        if (yield cancelled()) {
            console.log("in finally cancelled");
        }
    }
}

export function* splitCommission(props: any) {
    try {
        const obj: any = {
            supplierId: props?.payload?.supplierId,
            quoteId: props?.payload?.quoteId,
        }
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.splitCommission(props.payload);

        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.addPaymentSuccess({}));
        if (apiResponse.success)
            yield put(paymentAction.viewPayments(obj));
        yield put(paymentAction.historyBasicActions({ isLoadingData: true }))
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));
        yield put(paymentAction.closeSidebarFun(true))
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.addPaymentFailed({}));
        yield put(paymentAction.closeSidebarFun(true))
    }
}

export function* addPaymentHistory(props: any) {
    try {

        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.addPaymentHistory(props.payload);
        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success) {
            yield put(paymentAction.addInternalPaymentSuccess({}));
            yield put(paymentAction.paymentList(null));
        }
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));
        yield put(paymentAction.closeSidebarFun(true))
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.addInternalPaymentFailed({}));
        yield put(paymentAction.closeSidebarFun(true))
    }
}

export function* loadSupplierPayment(props: any) {
    try {
        const obj: any = {
            supplierId: props?.payload?.supplierId,
            quoteId: props?.payload?.quoteId,
        }
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.loadSupplierPayment(props.payload);

        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.addSupplierPaymentSuccess({}));
        if (apiResponse.success)
            yield put(paymentAction.viewPayments(obj));
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));
        yield put(paymentAction.closeSidebarFun(true))

    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.addSupplierPaymentFailed({}));
        yield put(paymentAction.closeSidebarFun(true))
    }
}
export function* salesRepPaymentReq(props: any) {
    try {

        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);

        const apiResponse = yield backendApi.salesRepPaymentAPI(i);

        const comissCount = apiResponse.isNext === false ? (i.comissPage - 1) * i.comissLimit + apiResponse.data.length : -1
        // const comissCount = apiResponse.data.length < i.comissLimit ? (i.comissPage - 1) * i.comissLimit + apiResponse.data.length : -1;

        yield put(paymentAction.historyBasicActions({ comissCount }))

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.viewSalesRepPaymentsSuccess(apiResponse))
        else
            yield put(paymentAction.viewSalesRepPaymentsFailure([]))
    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
    }
}

export function* userQuoteListReq(props: any) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.quoteDropdownList(props.payload);

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.dropdownQuoteListSuccess(apiResponse))

    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.dropdownQuoteListSuccess([]))
    }
}

export function* splitCommissionReq(props: any) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);

        const apiResponse = yield backendApi.splitCommissionReqAPI(i);

        const splitCount = apiResponse.data.length < i.splitLimit ? (i.splitPage - 1) * i.splitLimit + apiResponse.data.length : -1;

        yield put(paymentAction.historyBasicActions({ splitCount }))

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.splitCommissionSuccess(apiResponse))

    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
        yield put(paymentAction.splitCommissionSuccess([]))
    }
}

export function* updateStatusReq(props: any) {
    try {
        const obj: any = {
            supplierId: props?.payload?.sqId?.supplierId,
            quoteId: props?.payload?.sqId?.quoteId,
        }
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.editBulkAction(props.payload.obj);

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.viewPayments(obj));
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));

    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
    }
}

export function* editMonthlyPayoutReq(props: any) {
    try {
        const userId = props.payload.user
        const search: any = {}
        if (props.payload?.search['quote.QuoteID']) search['quote.QuoteID'] = props.payload?.search['quote.QuoteID']
        if (props.payload.search?.startDate) search.startDate = props.payload.search?.startDate
        if (props.payload.search?.endDate) search.endDate = props.payload.search?.endDate

        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.editMonthlyPayoutAPI(props.payload);

        yield put(globalConfigActions.endLoader(null));
        if (apiResponse.success)
            yield put(paymentAction.viewSalesRepPayments({ user: userId, search: search }));
        if (apiResponse.message)
            yield put(globalConfigActions.enableFeedback(apiResponse.message));

    } catch (error) {
        yield put(globalConfigActions.endLoader(null));
    }
}


/**
 * Root saga manages watcher lifecycle
 */
export function* paymentSaga() {
    // Watches for loadRepos actions and calls getRepos when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(paymentAction.paymentList.type, paymentHistoyList);
    yield takeLatest(paymentAction.historyNewPage.type, paymentHistoyList);
    yield takeLatest(paymentAction.historyChangeLimit.type, paymentHistoyList);
    yield takeLatest(paymentAction.FilterData.type, paymentHistoyList);
    yield takeLatest(paymentAction.viewPayments.type, getPaymentHistory);
    yield takeLatest(paymentAction.addPayment.type, splitCommission);
    yield takeLatest(paymentAction.addSupplierPayment.type, loadSupplierPayment);
    yield takeLatest(paymentAction.addInternalPayment.type, addPaymentHistory);
    yield takeLatest(paymentAction.editPayments.type, UpdatePaymentInfo);
    yield takeLatest(paymentAction.editHistoryPayment.type, editHistoryPaymentReq);
    yield takeLatest(paymentAction.viewSalesRepPayments.type, salesRepPaymentReq);
    yield takeLatest(paymentAction.salesRepNewPage.type, salesRepPaymentReq);
    yield takeLatest(paymentAction.salesRepChangeLimit.type, salesRepPaymentReq);
    yield takeLatest(paymentAction.dropdownQuoteList.type, userQuoteListReq);
    yield takeLatest(paymentAction.updateStatus.type, updateStatusReq);
    yield takeLatest(paymentAction.editMonthlyPayout.type, editMonthlyPayoutReq);
    yield takeLatest(paymentAction.splitCommission.type, splitCommissionReq);
    yield takeLatest(paymentAction.splitNewPage.type, splitCommissionReq);
    yield takeLatest(paymentAction.splitChangeLimit.type, splitCommissionReq);
}
