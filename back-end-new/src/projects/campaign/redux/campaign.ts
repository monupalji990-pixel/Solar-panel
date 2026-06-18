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

import backendApi from "./model/campaign";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface ICampaign {
    currentCampaign: any;
    count: number;
    totalCount: number;
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
    campaigns: any;
    isActionDone: boolean;
    filterData: any;
    templates: {
        list: any;
        limit: number;
        skip: number;
        search: string;
        isLoading: boolean;
        count: number;
    };
    contactlists: {
        list: any;
        limit: number;
        skip: number;
        search: string;
        isLoading: boolean;
        count: number;
    }
}
export type ContainerState = ICampaign;

export const initialState: ContainerState = {
    campaigns: [],
    count: -1,
    totalCount: -1,
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
    currentCampaign: {},
    isActionDone: false,
    filterData: {},
    isLoadingData: false,
    templates: {
        list: [],
        limit: 10,
        skip: 0,
        search: '',
        isLoading: false,
        count: 0
    },
    contactlists: {
        list: [],
        limit: 10,
        skip: 0,
        search: '',
        isLoading: false,
        count: 0
    }
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const campaignSlice = createSlice({
    name: "campaign",
    initialState,
    reducers: {
        List(state, action: PayloadAction<any | null>) { },
        ListSuccess(state, action: PayloadAction<any>) {
            state.campaigns = action.payload.data
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
        addCampaign(state, action: PayloadAction<any>) {
            state.isLoadingData = true;
        },
        addCampaignSuccess(state, action: PayloadAction<any>) {
            state.isLoadingData = false;
        },
        addCampaignFailure(state, action: PayloadAction<any>) {
        },
        roleList(state, action: PayloadAction<any>) { },
        roleListSuccess(state, action: PayloadAction<any>) { },
        editCampaign(state, action: PayloadAction<any>) {
            state.isLoadingData = true;
        },
        currentdViewData(state, action: PayloadAction<any>) {
            state.currentCampaign = action.payload;
        },
        SlugUpdate(state, action: PayloadAction<any>) {
            state.slug = action.payload.slug;
            state.type = action.payload.companyType;
            state.searchText = "";
        },
        viewCampaign(state, action: PayloadAction<any>) { },
        viewCampaignSuccess(state, action: PayloadAction<any>) { },


        setIsLoadingData(state, action: PayloadAction<any>) {
            state.isLoadingData = action.payload;
        },

        IsActionDone(state, action: PayloadAction<any>) {
            state.isActionDone = action.payload;
        },
        FilterData(state, action: PayloadAction<any>) {
            state.filterData = action.payload;
        },

        delete(state, action: PayloadAction<any>) { },

        sendRequest(state, action: PayloadAction<any>) { },


        actionOnDeleteReq(state, action: PayloadAction<any>) { },
        BasicActions(state, action: PayloadAction<any>) {
            if (action.payload.message !== undefined)
                state.message = action.payload.message;
            if (action.payload.sidebar !== undefined)
                state.hideSideBar = action.payload.sidebar;
            if (action.payload.remote !== undefined)
                state.remote = action.payload.remote;
            if (action.payload.count !== undefined)
                state.count = action.payload.count;
        },
        Count(state, action: PayloadAction<any | null>) { },
        CountSuccesss(state, action: PayloadAction<any | null>) {
            state.totalCount = action.payload.count;
        },
        tableSort(state, action: PayloadAction<any>) {
            state.sort = action.payload.sort;
            state.sortType = action.payload.sortType;
        },
        companyListForDropDown(state, action: PayloadAction<any>) {
            state.slug = action.payload.slug;
            state.remote = false
        },

        templateList(state, action: PayloadAction<any>) {
            state.templates.isLoading = true;
        },
        templateListSuccess(state, action: PayloadAction<any>) {
            state.templates.isLoading = false;
            state.templates.list = [...state.templates.list, ...action.payload.data];
            state.templates.count = action.payload.count;
        },
        changePagetemplateList(state, action: PayloadAction<any>) {
            state.templates.isLoading = true;
            state.templates.skip = action.payload.skip;
            state.templates.limit = action.payload.limit;
        },
        changeSearchtemplateList(state, action: PayloadAction<any>) {
            state.templates.list = [];
            state.templates.isLoading = true;
            state.templates.skip = initialState.templates.skip;
            state.templates.search = action.payload.search;
        },
        listContactList(state, action: PayloadAction<any>) {
            state.contactlists.isLoading = true;
        },
        listContactListSuccess(state, action: PayloadAction<any>) {
            state.contactlists.isLoading = false;
            state.contactlists.list = [...state.contactlists.list, ...action.payload.data];
            state.contactlists.count = action.payload.count;
        },
        changePagelistContactList(state, action: PayloadAction<any>) {
            state.contactlists.isLoading = true;
            state.contactlists.skip = action.payload.skip;
            state.contactlists.limit = action.payload.limit;
        },
        changeSearchlistContactList(state, action: PayloadAction<any>) {
            state.contactlists.list = [];
            state.contactlists.isLoading = true;
            state.contactlists.skip = initialState.contactlists.skip;
            state.contactlists.search = action.payload.search;
        },
        sendCampaign(state, action: PayloadAction<any>) {
            state.isLoadingData = true;
        },
        sendCampaignSuccess(state, action: PayloadAction<any>) {
            state.isLoadingData = false;
        },
        changeToInitialState(state, action: PayloadAction<any>) {
            state.limit = initialState.limit;
            state.page = initialState.page;
            state.sort = initialState.sort;
            state.sortType = initialState.sortType;
        }
    },
});

export const {
    actions: campaignAction,
    reducer: campaignReducer,
    name: sliceKeyCampaign,
} = campaignSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.campaign || initialState;

export const selectCampaignState = createSelector(
    [selectDomain],
    (State) => State
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.campaign;

export function* list(props: any) {
    try {
        const i = yield select(getState);
        const apiResponse = yield backendApi.List(i);
        if (apiResponse.success) {
            const count = apiResponse.count;
            yield put(campaignAction.BasicActions({ count }));
            yield put(campaignAction.ListSuccess({ data: apiResponse.campaigns }));
        }
    } catch (error) {
        yield put(campaignAction.ListSuccess({
            data: []
        }));
    } finally {
        if (yield cancelled()) {
            console.log("in finally cancelled");
        }
    }
}

function* addCampaign(props) {
    try {
        const i = yield select(getState);
        const apiResponse = yield backendApi.add(i, props.payload.data);
        yield put(globalConfigActions.startLoader(null));
        if (apiResponse.success) {
            yield put(
                globalConfigActions.enableFeedback("campaign create successfully")
            );
            yield put(campaignAction.currentdViewData(apiResponse));
            yield put(campaignAction.List(null));
            props.payload.fbag?.resetForm();
        } else {
            yield put(globalConfigActions.enableFeedback("campaign create failed"));
        }
        yield put(globalConfigActions.endLoader(null));
        yield put(campaignAction.setIsLoadingData(false));
    } catch (error) {
        yield put(globalConfigActions.enableFeedback("something went wrong"));
    }
}



function* edit(props) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const ApiResponse = yield backendApi.editCompany(i, props.payload.data);
        if (ApiResponse.success) {
            yield put(campaignAction.viewCampaign({ id: props.payload.data?.id }));
            yield list(null);
            props.payload.fbag.closeEdit(null);
            props.payload.fbag.setSubmitting(false);
        }
        yield put(
            globalConfigActions.enableFeedback(ApiResponse.message)
        );
        yield put(campaignAction.setIsLoadingData(false));
    } catch (error) {
        [];
    }
}

function* viewCampaign(props) {
    try {
        yield put(globalConfigActions.startLoader(null));
        const i = yield select(getState);
        const apiResponse = yield backendApi.view(i, props.payload);
        yield put(campaignAction.currentdViewData(apiResponse));
        yield put(campaignAction.setIsLoadingData(false));
        yield put(globalConfigActions.endLoader(null));
    } catch (error) {
        [];
    }
}

function* deleteCampaign(props) {
    try {
        const i = yield select(getState);
        const apiResponse = yield backendApi.delete(i, props.payload);
        if (apiResponse.success) {
            yield put(campaignAction.CloseSideBar(true));
            yield put(campaignAction.List(null));
        }
        yield put(campaignAction.LoaderStart(true));
        yield put(
            globalConfigActions.enableFeedback(apiResponse.message)
        );
    } catch (error) {
        [];
    }
}

function* count() {
    try {
        const i = yield select(getState);
        const apiResponse = yield backendApi.Count(i);
        yield put(campaignAction.CountSuccesss(apiResponse));
    } catch (error) {
        yield put(campaignAction.CountSuccesss({ count: 0 }));
    }
}

function* sendCampaign(props) {
    try {
        const i = yield select(getState);
        const ApiResponse = yield backendApi.sendCampaign(i, props.payload);
        if (ApiResponse.success) {
            yield put(campaignAction.viewCampaign({ id: props.payload.id }));
            yield put(campaignAction.List(null));
        }
        yield put(
            globalConfigActions.enableFeedback(ApiResponse.message)
        );
        yield put(campaignAction.setIsLoadingData(false));
    } catch (error) { }
}

function* actionOnSelectData(props) {
    try {
        const i = yield select(getState);
        yield put(campaignAction.BasicActions({ remote: false }));
        yield backendApi.actionOnSelectData(i, props.payload);
        yield globalConfigActions.enableFeedback(
            `company delete request ${props.payload.action}ed`
        );
        yield put(campaignAction.BasicActions({ status: true }));
        yield put(campaignAction.List(null));
        yield put(campaignAction.BasicActions({ remote: false }));
    } catch (error) {
        [];
    }
}

export function* templateList(props: any) {
    try {
        const i = yield select(getState);
        const templateState = i.templates;
        const apiResponse = yield backendApi.templateList(templateState, i.slug);

        const count =
            apiResponse.templates.length <= templateState.limit
                ? templateState.skip + apiResponse.templates.length
                : -1;
        yield put(campaignAction.templateListSuccess({ data: apiResponse.templates, count: count }));
    } catch (error) {
        yield put(campaignAction.templateListSuccess({
            data: []
        }));
    } finally {
        if (yield cancelled()) {
            console.log("in finally cancelled");
        }
    }
}

export function* listContactList(props: any) {
    try {
        const i = yield select(getState);
        const contactlistsState = i.contactlists
        const apiResponse = yield backendApi.listcontactsLists(contactlistsState, i.slug);

        const count =
            apiResponse.data?.lists.length <= contactlistsState.limit
                ? contactlistsState.skip + apiResponse.data?.lists.length
                : -1;
        yield put(campaignAction.listContactListSuccess({ data: apiResponse.data?.lists, count }));
    } catch (error) {
        console.log("errror ", error);
        yield put(campaignAction.listContactListSuccess({
            data: []
        }));
    } finally {
        if (yield cancelled()) {
            console.log("in finally cancelled");
        }
    }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* campaignSaga() {
    // Watches for loadRepos actions and calls getRepos when one comes in.
    // By using `takeLatest` only the result of the latest API call is applied.
    // It returns task descriptor (just like fork) so we can continue execution
    // It will be cancelled automatically on component unmount
    yield takeLatest(campaignAction.List.type, list);
    yield takeLatest(campaignAction.FilterData.type, list);
    yield takeLatest(campaignAction.NewPage.type, list);
    yield takeLatest(campaignAction.ChangeLimit.type, list);
    yield takeLatest(campaignAction.Search.type, list);
    yield takeLatest(campaignAction.addCampaign.type, addCampaign);
    yield takeLatest(campaignAction.editCampaign.type, edit);
    yield takeLatest(campaignAction.viewCampaign.type, viewCampaign);
    yield takeLatest(campaignAction.delete.type, deleteCampaign);
    yield takeLatest(campaignAction.Count.type, count);
    yield takeLatest(campaignAction.actionOnDeleteReq.type, actionOnSelectData);
    yield takeLatest(campaignAction.tableSort.type, list);
    yield takeLatest(campaignAction.templateList.type, templateList);
    yield takeLatest(campaignAction.changePagetemplateList.type, templateList);
    yield takeLatest(campaignAction.changeSearchtemplateList.type, templateList);
    yield takeLatest(campaignAction.listContactList.type, listContactList);
    yield takeLatest(campaignAction.changePagelistContactList.type, listContactList);
    yield takeLatest(campaignAction.changeSearchlistContactList.type, listContactList);
    yield takeLatest(campaignAction.sendCampaign.type, sendCampaign);
}
