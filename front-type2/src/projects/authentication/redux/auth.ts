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
import { call, put, select, takeLatest, delay } from "redux-saga/effects";
import { PayloadAction, createSelector, IdSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./Model/api";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { History } from "history";

export interface loggedUser {
  email: string;
  city: string;
  country: string;
  state: string;
  userPic: string;
  role: {
    roleName: string;
    slug: string;
    apis: [string];
    containers: [
      {
        name: String;
        container: String;
        parent: String;
        icon: String;
        isSidebar: Boolean;
        noparent: Boolean;
        parentIcon: String;
      }
    ];
    mobileContainers: [
      {
        name: String;
        icon: String;
        iconType: String;
        routeName: String;
      }
    ];
    configurations: {
      afterLoginPage: string;
    };
  };
  name: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
}
export interface AuthStates {
  username: string;
  dummyData: any;
  loading: boolean;
  loggedUser: {
    _id: string;
    avatar: string;
    email: string;
    role: any;
    name: string;
    firstName: string;
    lastName: string;
    gender: string;
    jobTitle: string;
    companyId: string;
    Site: any;
    mobile: string;
    phone: string;
    DOB: string;
    nationalInsurance: string;
  };
  hideSideBar: boolean;
  logged: string;
  loginRequest: string;
  error: any;
  authorizedUrl: string;
  authorizedStatus: string;
  stopSideBar: boolean;
  isLoadingData: boolean;
  isLoginResponse: boolean;
  isSocketStatus:any;
}
export type ContainerState = AuthStates;

// The initial state of the Auth container

export const initialState: ContainerState = {
  username: "",
  dummyData: [],
  loading: false,
  loggedUser: {
    _id: '',
    avatar: "",
    email: "",
    role: {
      containers: [],
    },
    name: "",
    firstName: "",
    lastName: "",
    gender: "",
    jobTitle: "",
    companyId: "",
    Site: [""],
    mobile: "",
    phone: "",
    DOB: "",
    nationalInsurance: "",
  },
  hideSideBar: true,
  loginRequest: "",
  authorizedUrl: "",
  authorizedStatus: "",
  stopSideBar: false,
  logged: "wait",
  isLoadingData: false,
  error: null,
  isLoginResponse: false,
  isSocketStatus:''
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    socketStatusUpdate(state, action: PayloadAction<any>) {
      state.isSocketStatus = action.payload;
    },
    authReq(state, action: PayloadAction<any>) {
      state.isLoginResponse = true;
    },
    authSuccess(state, action: PayloadAction<any>) {
      state.loggedUser = action.payload;
      state.logged = "pass";
      state.isLoginResponse = false;
    },
    authFail(state, action: PayloadAction<any>) {
      state.loggedUser = initialState.loggedUser;
      state.logged = "fail";
      state.isLoginResponse = false;
    },
    stopSideBar(state, action: PayloadAction<any>) {
      state.stopSideBar = action.payload;
    },
    basicActionForAuth(state, action: PayloadAction<any>) {
      if (action.payload.isLoadingData !== undefined)
        state.isLoadingData = action.payload.isLoadingData;
    },
    loginSuccess(state, action: PayloadAction<any>) {
      state.loggedUser = action.payload;
      state.logged = "pass";
      localStorage.setItem("token", action.payload.token);
    },

    login(state, action: PayloadAction<{ email: string; password: string }>) { },
    loginFailure(state, action: PayloadAction<boolean>) {
      state.loggedUser = initialState.loggedUser;
      state.loginRequest = "wait";
      state.logged = "fail";
    },

    isLoginSuccess(state, action: PayloadAction<AuthStates["loggedUser"]>) {
      state.loggedUser = action.payload;
      state.logged = "pass";
    },
    isLogin(state, action: PayloadAction<any>) { },
    isLoginFailure(state, action: PayloadAction<boolean>) {
      state.loggedUser = initialState.loggedUser;
      state.logged = "fail";
      state.isLoginResponse = false;
    },
    logoutSuccess(state, action: PayloadAction<any>) {
      state.loggedUser = initialState.loggedUser;
      state.logged = "fail";
      location.reload();
    },
    logout(state, action: PayloadAction<any>) { },

    updateRegUserSuccess(
      state,
      action: PayloadAction<AuthStates["loggedUser"]>
    ) {
      state.loggedUser = action.payload;
    },
    updateRegUser(state, action: PayloadAction<any>) { },

    updateRegUserImageSuccess(
      state,
      action: PayloadAction<AuthStates["loggedUser"]>
    ) {
      state.loggedUser = action.payload;
    },
    updateRegUserImage(state, action: PayloadAction<any>) { },
    updateRegUserColumnsSuccess(
      state,
      action: PayloadAction<AuthStates["loggedUser"]>
    ) {
      state.loggedUser = action.payload;
    },
    updateRegUserColumns(state, action: PayloadAction<any>) { },
    closeSideBar(state, action: PayloadAction<boolean>) {
      state.hideSideBar = action.payload;
    },
    changePassword(state, action: PayloadAction<any>) { },

    forgetPass(state, action: PayloadAction<{ email: string }>) { },

    resetPass(
      state,
      action: PayloadAction<{
        d: any;
        data: { password: string };
        history: History;
      }>
    ) { },

    forgetPassSuccess(state, action: PayloadAction<any>) { },
    forgetPassFail(state, action: PayloadAction<any>) { },
  },
});

export const {
  actions: authActions,
  reducer: authReducer,
  name: AuthSlickKey,
} = authSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.auth || initialState;
export const selectAuthState = createSelector(
  [selectDomain],
  (AuthState) => AuthState
);
export const selectLoading = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.loading
);

export const selectError = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.error
);

export const selectLoggedUser = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.loggedUser
);

export const selectLogged = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.logged
);

export const selectSidebar = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.hideSideBar
);

export const selectLoggedReq = createSelector(
  [selectDomain],
  (AuthStates) => AuthStates.loginRequest
);

/**
 *  *********************  SAGA SECTION ******************    
 */

function* authorize(props) {
  try {
    yield put(authActions.basicActionForAuth({ isLoadingData: true }));

    const json = yield backendApi.login(props.payload);

    if (json.data) {
      if (Number(json.data.statusCode) === 2310) {
        yield put(globalConfigActions.enableFeedback(json.data.err));
      }
    }
    if (json.success) {
      yield put(authActions.authSuccess(json));
    } else {
      yield put(authActions.authFail(false));
    }
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));

  } catch (error) {
    if (error.data) {
      if (error.data.err) {
        yield put(globalConfigActions.enableFeedback(error.data.err));
      }
    }
    yield put(authActions.authFail(false));
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));

  }
}

export function* loginReq(
  props: PayloadAction<{ email: string; password: string }>
) {
  try {
    yield put(authActions.basicActionForAuth({ isLoadingData: true }));

    yield put(globalConfigActions.startLoader(null));
    const json = yield backendApi.login(props.payload);
    if (json.success) {
      yield put(authActions.loginSuccess(json));
    } else {
      yield put(authActions.loginFailure(false));
    }
    yield put(globalConfigActions.enableFeedback(json.message));
    yield put(globalConfigActions.endLoader(null));
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));

  } catch (error) {
    yield put(authActions.loginFailure(false));
    console.log(error);
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));

  }
}

export function* isLoginReq(props) {
  try {
    yield put(authActions.basicActionForAuth({ isLoadingData: true }));

    const json = yield backendApi.isLoggedIn();

    if (json.success) {
      yield put(authActions.isLoginSuccess(json));
    } else {
      yield put(authActions.isLoginFailure(false));
    }
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));
  } catch (error) {
    yield put(authActions.isLoginFailure(false));
    yield put(authActions.basicActionForAuth({ isLoadingData: false }));
    console.log(error);
  }
}

export function* logoutReq(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const json = yield backendApi.Logout();
    yield put(authActions.logoutSuccess(false));
    props.resolve(json);
    yield put(globalConfigActions.enableFeedback(json.success));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    console.log(error);
  }
}

export function* changePassReq(props) {
  try {
    console.log("isLogin");
    yield put(globalConfigActions.startLoader(props));
    const json = yield backendApi.regUserChangePass(props.payload);
    yield put(globalConfigActions.enableFeedback(json.message));
    yield put(globalConfigActions.endLoader(props));
  } catch (error) {
    console.log(error);
  }
}
export function* forgotPassNew(props) {
  try {
    const apiResponse = yield backendApi.forgotPass(
      props.payload
    ); 
    yield put(authActions.forgetPassSuccess(apiResponse.userData));
    props.resolve(apiResponse);
  } catch (error) {
    yield put(authActions.forgetPassFail(false));
  }
}

export function* forgetPassReq(props: PayloadAction<{ email: string }>) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const json = yield backendApi.forgotPass(props.payload);
    yield put(globalConfigActions.enableFeedback(json.message));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    console.log(error);
  }
}

export function* resetPassReq(
  props: PayloadAction<{
    d: any;
    data: { password: string };
    history: History;
  }>
) {
  try {
    yield put(globalConfigActions.startLoader(props));
    const json = yield backendApi.resetPass(
      props.payload.d,
      props.payload.data
    );
    if (json.success) {
      props.payload.history.push("/auth/login");
    }
    yield put(globalConfigActions.enableFeedback(json.message));
    yield put(globalConfigActions.endLoader(props));
  } catch (error) {
    console.log(error);
  }
}
/**
 * Root saga manages watcher lifecycle
 */
export function* authFormSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(authActions.authReq, authorize);
  yield takeLatest(authActions.isLogin.type, isLoginReq);
  yield takeLatest(authActions.login.type, loginReq);
  yield takeLatest(authActions.logout.type, logoutReq);
  yield takeLatest(authActions.forgetPass.type, forgotPassNew);
  yield takeLatest(authActions.changePassword.type, changePassReq);
  yield takeLatest(authActions.resetPass.type, resetPassReq);
}
