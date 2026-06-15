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
import backendApi from "./model/userAdmin";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import userAdmin from "./model/userAdmin";

export interface userAdmin {
  loggedUser: string;
  error: null;
  users: any;
  dropdownUsers: any;
  count: number;
  usersCount: number;
  limit: number;
  page: number;
  remote: boolean;
  hideSideBar: boolean;
  searchText: string;
  message: string;
  role: any;
  sort: string;
  sortType: string;
  slug: string;
  isLoadingData: boolean;
  OnlyDeleteData: boolean;
  currentUser: any;
  filter: any;
  cities: any;
}
export type ContainerState = userAdmin;

export const initialState: ContainerState = {
  loggedUser: "wait",
  error: null,
  users: [],
  dropdownUsers: [],
  count: -1,
  usersCount: -1,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  searchText: "",
  message: "",
  role: [],
  sort: "createdAt",
  sortType: "desc",
  slug: "",
  isLoadingData: true,
  OnlyDeleteData: false,
  currentUser: {},
  filter: { },
  cities: [],
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const UserAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    userList(state, action: PayloadAction<object | null>) { },
    userListSuccess(state, action: PayloadAction<any>) {
      state.users = action.payload.data.map((e) => {
        return {
          _id: e._id,
          name: e.name,
          email: e.email,
          role: e.role ? e.role.roleName : "",
          status: Number(e.isActive) === 1 ? "Active" : "Block",
          jobTitle: e.jobTitle,
          isDelete: e.isDelete,
          avatar: e.avatar,
        };
      });

      state.remote = true;
    },
    userListFailure(state, action: PayloadAction<any>) { },
    userAddFilter(state, action: PayloadAction<any>) {
      state.filter = { ...state.filter, ...action.payload };
    },

    userClearFilter(state, action: PayloadAction<any | null>) {
      state.filter = { role: [], status: -1 };
    },
    userNewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    userNewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    userNewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    userLoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    userChangeLimit(
      state,
      action: PayloadAction<{ limit: number; page: number }>
    ) {
      state.limit = action.payload.limit;
    },
    userSearch(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    userCloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload.status;
      state.message = action.payload.message;
    },
    addUser(state, action: PayloadAction<any>) {
    },
    addUserSuccess(state, action: PayloadAction<any>) {
    },
    addUserFailure(state, action: PayloadAction<any>) {
    },
    roleList(state, action: PayloadAction<object | null>) { },
    roleListSuccess(state, action: PayloadAction<any>) {
      state.role = action.payload;
    },
    roleListFailure(state, action: PayloadAction<any>) { },
    editUser(state, action: PayloadAction<any>) {
    },
    userSlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
      state.searchText = "";
    },
    userLoaderAction(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
      state.page = 1;
    },
    changePassword(state, action: PayloadAction<any>) { },
    sendRequest(state, action: PayloadAction<any>) { },
    actionOnDeleteReq(state, action: PayloadAction<any>) { },
    userBasicActions(state, action: PayloadAction<any>) {
      if (action.payload.message !== undefined)
        state.message = action.payload.message;
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.usersCount !== undefined)
        state.usersCount = action.payload.usersCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
    },
    userListForDropdown(state, action: PayloadAction<any>) { },
    userListForDropdownSuccess(state, action: PayloadAction<any>) {
      state.dropdownUsers = action.payload.data;
    },
    removeUser(state, action: PayloadAction<any>) { },
    userCount(state, action: PayloadAction<any | null>) { },
    viewUserReq(state, action: PayloadAction<any>) { },
    currentUserData(state, action: PayloadAction<any>) {
      state.currentUser = action.payload.contact;
      state.isLoadingData = false;
    },
    loadingData(state, action: PayloadAction<any>) {
      state.users.success = action.payload;
    },
    tableSort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    cityListForDropdown(state, action: PayloadAction<any>) {
    },
    cityListForDropdownSucesss(state, action: PayloadAction<any>) {
      state.cities = action.payload.data;
    },
  },
});

export const {
  actions: userAdminAction,
  reducer: UserAdminReducer,
  name: sliceKeyUserAdmin,
} = UserAdminSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.userAdmin || initialState;

export const selectUsers = createSelector(
  [selectDomain],
  (State) => State.users
);

export const selectUsersState = createSelector(
  [selectDomain],
  (State) => State
);

export const selectFilter = createSelector(
  [selectDomain],
  (State) => State.users.filter
);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getUserState = (state: RootState) => state.userAdmin;

export function* userListByAdmin(props: any) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.userListByAdmin({
      ...i,
      ...props.payload,
      slug: i.slug,
    });
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;
    yield put(userAdminAction.userBasicActions({ count }));
    yield put(globalConfigActions.endLoader(null));
    yield put(userAdminAction.userListSuccess(apiResponse));
  } catch (error) {
    yield put(globalConfigActions.endLoader(null));
    yield put(userAdminAction.userListFailure([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

export function* roleListReq(props: any) {
  try {
    yield put(globalConfigActions.startLoader(props));
    const apiResponse = yield backendApi.roleList();
    yield put(globalConfigActions.endLoader(props));

    yield put(userAdminAction.roleListSuccess(apiResponse));
  } catch (error) {
    console.log(error);
    yield put(globalConfigActions.endLoader(props));
    yield put(userAdminAction.roleListSuccess([]));
  }
}

function* addNewUser(props) {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.addNewUser(i, props.payload);
    if (apiResponse.success) {
      yield put(userAdminAction.userCloseSideBar({ status: true }));
      yield put(globalConfigActions.enableFeedback("User added successfully"));
      yield put(userAdminAction.userList(null));
    } else {
      yield put(globalConfigActions.enableFeedback("User already exist"));
    }
  } catch (error) {
    console.log("error in add new User", error);
    yield put(globalConfigActions.enableFeedback("Something went wrong."));
    yield put(userAdminAction.userCloseSideBar({ status: true }));
  }
}

function* editUser(props) {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.editUser(i, props.payload);
    yield put(globalConfigActions.enableFeedback(apiResponse.message));
    yield put(userAdminAction.userBasicActions({ remote: false }));
    yield put(userAdminAction.currentUserData(apiResponse));
    yield put(userAdminAction.userList(null));
  } catch (error) {
    [];
  }
}

function* viewUser(props) {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.viewUser(i, props.payload);
    yield put(userAdminAction.currentUserData(apiResponse));
  } catch (error) {
    [];
  }
}

function* changePassword(props) {
  try {
    const i = yield select(getUserState);
    yield backendApi.changePassword(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Password updated successfully")
    );
  } catch (error) {
    [];
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.sendRequest(i, props.payload);
    yield put(
      globalConfigActions.enableFeedback("Delete request sent successfully")
    );
    yield put(userAdminAction.currentUserData(apiResponse));
    yield put(userAdminAction.userList(null));
  } catch (error) {
    [];
  }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getUserState);
    yield put(userAdminAction.userBasicActions({ remote: false }));

    yield backendApi.actionOnSelectData(i, props);
    yield put(
      userAdminAction.userBasicActions({
        status: true,
        message: `User delete request ${props.action}ed`,
      })
    );

    yield put(userAdminAction.userList(null));
    yield put(userAdminAction.userBasicActions({ remote: false }));
  } catch (error) {
    [];
  }
}

function* assigneeList() {
  try {
    const apiResponse = yield backendApi.assigneeList(null);
    yield put(userAdminAction.userListForDropdownSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* removeUser(props) {
  try {
    const i = yield select(getUserState);
    yield backendApi.removeUser(i, props.payload);
    yield put(globalConfigActions.enableFeedback("User deleted Successfully"));
    yield put(
      userAdminAction.userBasicActions({ sidebar: false, remote: false })
    );
    yield put(userAdminAction.userList(null));
    yield put(
      userAdminAction.userBasicActions({ sidebar: true, remote: true })
    );
  } catch (error) {
    [];
  }
}

function* userCount() {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.userCount(i);
    yield put(
      userAdminAction.userBasicActions({ usersCount: apiResponse.count })
    );
  } catch (error) {
    yield put(userAdminAction.userBasicActions({ usersCount: 0 }));
  }
}

function* cityListForDropdownReq(props) {
  try {
    const i = yield select(getUserState);
    const apiResponse = yield backendApi.cityListForDropdownReq(
      i,
      props.payload
    );
    yield put(userAdminAction.cityListForDropdownSucesss(apiResponse));
  } catch (error) {
    yield put(userAdminAction.cityListForDropdownSucesss([]));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* userAdminSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(userAdminAction.userList.type, userListByAdmin);
  yield takeLatest(userAdminAction.userNewPage.type, userListByAdmin);
  yield takeLatest(userAdminAction.userChangeLimit.type, userListByAdmin);
  yield takeLatest(userAdminAction.userSearch.type, userListByAdmin);
  yield takeLatest(userAdminAction.addUser.type, addNewUser);
  yield takeLatest(userAdminAction.roleList.type, roleListReq);
  yield takeLatest(userAdminAction.viewUserReq.type, viewUser);
  yield takeLatest(userAdminAction.editUser.type, editUser);
  yield takeLatest(userAdminAction.changePassword.type, changePassword);
  yield takeLatest(userAdminAction.sendRequest.type, sendRequest);
  yield takeLatest(userAdminAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(userAdminAction.userListForDropdown.type, assigneeList);
  yield takeLatest(userAdminAction.removeUser.type, removeUser);
  yield takeLatest(userAdminAction.userCount.type, userCount);
  yield takeLatest(userAdminAction.tableSort.type, userListByAdmin);
  yield takeLatest(userAdminAction.cityListForDropdown.type, cityListForDropdownReq)
}
