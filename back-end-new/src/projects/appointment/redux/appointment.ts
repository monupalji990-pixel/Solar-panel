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
import backendApi from "./model/appointment";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import { AppointmentStatus } from "sharedUtils/globalHelper/status";
import moment from "moment";

export interface appointment {
  count: number;
  limit: number;
  page: number;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  sort: string;
  sortType: string;
  slug: string;
  appointments: any;
  loadingCal: boolean;
  isLoadingData: boolean;
  availableUsers: any;
  isLoadingData2: any;
  filterDate: any;
  viewAppointment: any;
  editLoading: boolean;
  companies: any;
  consumers: any;
  viewLoading: boolean;
  addAppointmentRes: any;
  appointmentMatrixList: any;
  appointmentMatrixIsNext: Boolean,
  limitMatrix: any,
  pageMatrix: any,
}
export type ContainerState = appointment;

export const initialState: ContainerState = {
  appointments: [],
  appointmentMatrixList: [],
  count: -1,
  limit: 200,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  sort: "startTime",
  sortType: "desc",
  slug: "",
  loadingCal: false,
  isLoadingData: false,
  availableUsers: [],
  isLoadingData2: false,
  filterDate: {},
  viewAppointment: [],
  editLoading: false,
  companies: [],
  consumers: [],
  viewLoading: false,
  addAppointmentRes: '',
  appointmentMatrixIsNext: false,
  limitMatrix: 10,
  pageMatrix: 1,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {
      state.loadingCal = true;
      state.filterDate = action.payload;
    },
    ListSuccess(state, action: PayloadAction<any>) {
      try {
        state.loadingCal = false;

        const getInitialOfName = (e) => {
          return e?.Assignee?.name ? e?.Assignee?.name.split(" ").map((n) => n[0]).join("") : 'N/A'
        }

        const getAppointmentTime = (e) => {
          return (moment(e?.startTime).format('h:mm a')).replace(' ', '');
        }

        const getAddress = (e) => {
          let address = e.Consumer?.addressOne ? e.Consumer?.addressOne : (e.Company?.firstLine ? e.Company?.firstLine : e.Company?.secondLine)
          return address || ''
        }

        const getConsumerCompanyName = (e) => {
          let name;
          if (e.Consumer?.name) {
            name = e.Consumer?.name
          } else if (e.Company?.businessName) {
            name = e.Company?.businessName
          } else {
            name = ''
          }

          return name || ''
        }

        const appointmentTitle = (e) => {
          if (e.status === '-123') {
            return getAppointmentTime(e) + ' ' + "UNAVAILABLE";
          } else if (e.Assignee) {
            return ((getAppointmentTime(e) + ' ' + getInitialOfName(e)) + " - " + ` ${getConsumerCompanyName(e)}` + ` ${e.postcode || ''}`)
          } else {
            return ""
          }
          // return e.status !== '-123' ? (e.Assignee ? ((getAppointmentTime(e) + ' ' + getInitialOfName(e)) + " - " + ` ${getConsumerCompanyName(e)}` + ` ${e.postcode || ''}`) : "") : "UNAVAILABLE"
        }

        state.appointments = action.payload?.data?.map((e) => {
          return {
            id: e._id,
            status: e.status ?? "",
            start: new Date(e.startTime) ?? "",
            end: new Date(e.endTime) ?? "",
            assignee: e.Assignee ?? "",
            assignee2: e.Assignee2 ?? "",
            title: appointmentTitle(e),
            booker: e.Booker ?? "",
            leadId: e.leadId ?? "",
            dayOfMonth: e.dayOfMonth ?? "",
          };
        });
        state.remote = true;
      } catch (error) {
        console.log(error);
      }
    },
    ListFailure(state, action: PayloadAction<any>) {
      state.loadingCal = false;
    },
    filterList(state, action: PayloadAction<any | null>) {
      state.filterDate = action.payload;
    },
    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    NewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    NewPageMatrix(state, action: PayloadAction<any>) {
      state.pageMatrix = action.payload.page;
      state.loadingCal = true;
    },
    NewPageMatrixSuccess(state, action: PayloadAction<any>) { },
    NewPageMatrixFailure(state, action: PayloadAction<any>) { },
    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    Sort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    ChangeLimitMatrix(state, action: PayloadAction<any>) {
      state.limitMatrix = action.payload.limit;
      state.loadingCal = true;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
      state.isLoadingData2 = false;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
    },

    viewTask(state, action: PayloadAction<any>) { },
    viewTaskSuccess(state, action: PayloadAction<any>) { },
    Count(state, action: PayloadAction<any | null>) { },
    CountSuccesss(state, action: PayloadAction<any | null>) { },

    userListAppointment(state, action: PayloadAction<any>) {
    },
    userListAppointmentSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
      state.availableUsers = action.payload.data;
    },
    userListAppointmentFailure(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
      state.availableUsers = [];
    },

    singleAppointmentDetails(state, action: PayloadAction<any>) {
      state.viewLoading = true;
    },
    singleAppointmentDetailsSuccess(state, action: PayloadAction<any>) {
      state.viewAppointment = action.payload.data;
      state.viewLoading = false;
    },
    singleAppointmentDetailsFailure(state, action: PayloadAction<any>) {
      state.viewAppointment = action.payload.data;
      state.viewLoading = false;
    },

    addAppointment(state, action: PayloadAction<any>) {
    },
    addAppointmentSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData2 = true;
      state.addAppointmentRes = action.payload;
    },
    addAppointmentFailure(state, action: PayloadAction<any>) {
      state.isLoadingData2 = true;
      state.addAppointmentRes = action.payload;
    },

    editAppointment(state, action: PayloadAction<any>) {
      state.editLoading = false;
    },
    editAppointmentSuccess(state, action: PayloadAction<any>) {
      state.editLoading = true;
    },
    editAppointmentFailure(state, action: PayloadAction<any>) {
      state.editLoading = true
    },

    deleteAppointment(state, action: PayloadAction<any>) {
      state.editLoading = false;
    },
    deleteAppointmentSuccess(state, action: PayloadAction<any>) {
      state.editLoading = true;
    },
    deleteAppointmentFailure(state, action: PayloadAction<any>) {
      state.editLoading = true
    },

    CompanyListData(state, action: PayloadAction<any>) { },
    CompanyListSuccess(state, action: PayloadAction<any>) {
      state.companies = action.payload.data;
    },
    CompanyListFailure(state, action: PayloadAction<any>) { },

    ConsumerList(state, action: PayloadAction<any>) { },
    ConsumerListSuccess(state, action: PayloadAction<any>) {
      state.consumers = action.payload.data;
    },

    AppointmentMatrixList(state, action: PayloadAction<any | null>) {
      state.loadingCal = true;
    },
    AppointmentMatrixListSuccess(state, action: PayloadAction<any>) {
      state.loadingCal = false;
      state.appointmentMatrixList = action.payload?.data
      state.appointmentMatrixIsNext = action.payload?.isNext
      state.remote = true;
    },
    AppointmentMatrixListFailure(state, action: PayloadAction<any>) {
      state.loadingCal = false;
      state.remote = true;
      state.appointmentMatrixIsNext = action.payload?.isNext
      state.appointmentMatrixList = action.payload?.data
    },

    ResetInitialState(state, action: PayloadAction<any>) {
      state.isLoadingData2 = action.payload;
    },
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.isLoadingData2 !== undefined)
        state.isLoadingData2 = action.payload;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.isLoadingData !== undefined)
        state.isLoadingData = action.payload.isLoadingData;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    }
  },
});

export const {
  actions: appointmentAction,
  reducer: appointmentReducer,
  name: sliceKeyAppointment,
} = appointmentSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.appointment || initialState;

export const selectAppointmentState = createSelector([selectDomain], (State) => State);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.appointment;

export function* appointmentList(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.appointmentListAPI(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(appointmentAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(appointmentAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
    yield put(appointmentAction.ListFailure([]));
  }
}

export function* AppointmentMatrixListSaga(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.appointmentMatrixList(i, props.payload);

    const count = apiResponse.data.length < i.limitMatrix
      ? (i.pageMatrix - 1) * i.limitMatrix + apiResponse.data.length
      : -1;
    yield put(appointmentAction.BasicActions({ count }));
    yield put(appointmentAction.AppointmentMatrixListSuccess(apiResponse));
  } catch (error) {
    yield put(appointmentAction.AppointmentMatrixListSuccess([]));
    yield put(appointmentAction.AppointmentMatrixListFailure([]));
  }
}

export function* userListAppointmentReq(props) {

  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.userListForAppointmentAPI(props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      // yield put(globalConfigActions.enableFeedback("task added successfully"));
      yield put(appointmentAction.LoaderStart(false));
      yield put(appointmentAction.userListAppointmentSuccess(apiResponse));
    } else {
      yield put(appointmentAction.userListAppointmentFailure(null));
    }
    yield put(appointmentAction.BasicActions({ isLoadingData: false }));
    yield put(appointmentAction.LoaderStart(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(appointmentAction.userListAppointmentFailure(null));
    console.log("Error in Appointment------>>>>", error);
  }
}

export function* singleAppointmentDetailsReq(props) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.singleAppointmentDetails(props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(appointmentAction.LoaderStart(false));
      yield put(appointmentAction.singleAppointmentDetailsSuccess(apiResponse));
    } else {
      yield put(appointmentAction.singleAppointmentDetailsFailure(null));
    }
    yield put(appointmentAction.BasicActions({ isLoadingData: false }));
    yield put(appointmentAction.LoaderStart(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(appointmentAction.singleAppointmentDetailsFailure(null));
    console.log("Error in Appointment------>>>>", error);
  }
}

export function* addAppointmentReq(props) {
  try {

    const D = new Date();
    const firstDay = new Date(D.getFullYear(), D.getMonth(), 1);
    const lastDay = new Date(D.getFullYear(), D.getMonth() + 1, 0);

    const i = yield select(getState);

    const apiResponse = yield backendApi.addAppointmentAPI(props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(appointmentAction.LoaderStart(false));
      yield put(appointmentAction.addAppointmentSuccess(apiResponse));
      yield put(appointmentAction.List({
        startTime: firstDay,
        endTime: lastDay
      }));
      yield put(appointmentAction.AppointmentMatrixList(props.payload));
    } else {
      yield put(appointmentAction.addAppointmentFailure(null));
    }
    if (apiResponse.message) {
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    }
    yield put(appointmentAction.BasicActions({ isLoadingData: false }));
    yield put(appointmentAction.LoaderStart(false));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(appointmentAction.addAppointmentFailure(null));
    console.log("Error in Appointment------>>>>", error);
  }
}

export function* editAppointmentReq(props) {
  try {
    let newDate = new Date();
    let month = new Date(props.payload?.startTime).getMonth();
    let year = new Date(props.payload?.startTime).getFullYear();
    var sDate = new Date(year, month, 1);
    var eDate = new Date(year, month + 1, 0);

    const i = yield select(getState);
    const apiResponse = yield backendApi.editAppointmentAPI(props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(appointmentAction.LoaderStart(false));
      yield put(appointmentAction.editAppointmentSuccess(null));
      yield put(appointmentAction.singleAppointmentDetails({ id: props.payload?.id }));
      if (sDate && eDate) {
        yield put(appointmentAction.List({
          startTime: sDate,
          endTime: eDate
        }));
      }
    } else {
      yield put(appointmentAction.editAppointmentFailure(null));
    }
    yield put(appointmentAction.BasicActions({ isLoadingData: false }));
    yield put(appointmentAction.LoaderStart(false));
    if (apiResponse.message)
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(appointmentAction.editAppointmentFailure(null));
    console.log("Error in Appointment------>>>>", error);
  }
}

export function* deleteAppointmentReq(props) {
  try {
    const i = yield select(getState);
    const D = new Date();
    const firstDay = new Date(D.getFullYear(), D.getMonth(), 1);
    const lastDay = new Date(D.getFullYear(), D.getMonth() + 1, 0);

    const apiResponse = yield backendApi.deleteAppointmentAPI(props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(appointmentAction.LoaderStart(false));
      yield put(appointmentAction.deleteAppointmentSuccess(null));
      yield put(appointmentAction.List({
        startTime: firstDay,
        endTime: lastDay
      }));
      yield put(appointmentAction.AppointmentMatrixList(props.payload));
    } else {
      yield put(appointmentAction.deleteAppointmentFailure(null));
    }
    yield put(appointmentAction.BasicActions({ isLoadingData: false }));
    yield put(appointmentAction.LoaderStart(false));
    if (apiResponse.message)
      yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(appointmentAction.deleteAppointmentFailure(null));
    console.log("Error in Appointment------>>>>", error);
  }
}

function* companyListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdownTemp(i, props.payload);

    yield put(appointmentAction.CompanyListSuccess(apiResponse));
  } catch (error) {
    yield put(appointmentAction.CompanyListData([]));
  }
}

function* consumerListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.consumerListForDropdown(i, props.payload);

    yield put(appointmentAction.ConsumerListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

// deleteAppointmentAPI
/**
 * Root saga manages watcher lifecycle
 */
export function* appointmentSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(appointmentAction.List.type, appointmentList);
  yield takeLatest(appointmentAction.NewPage.type, appointmentList);
  yield takeLatest(appointmentAction.ChangeLimit.type, appointmentList);
  yield takeLatest(appointmentAction.Search.type, appointmentList);
  yield takeLatest(appointmentAction.Sort.type, appointmentList);
  yield takeLatest(appointmentAction.userListAppointment.type, userListAppointmentReq);
  yield takeLatest(appointmentAction.addAppointment.type, addAppointmentReq);
  yield takeLatest(appointmentAction.singleAppointmentDetails.type, singleAppointmentDetailsReq)
  yield takeLatest(appointmentAction.editAppointment.type, editAppointmentReq)
  yield takeLatest(appointmentAction.deleteAppointment.type, deleteAppointmentReq)
  yield takeLatest(appointmentAction.CompanyListData.type, companyListForDropdown);
  yield takeLatest(appointmentAction.ConsumerList.type, consumerListForDropdown);
  yield takeLatest(appointmentAction.AppointmentMatrixList.type, AppointmentMatrixListSaga);
  yield takeLatest(appointmentAction.NewPageMatrix.type, AppointmentMatrixListSaga);
  yield takeLatest(appointmentAction.ChangeLimitMatrix.type, AppointmentMatrixListSaga);
}
