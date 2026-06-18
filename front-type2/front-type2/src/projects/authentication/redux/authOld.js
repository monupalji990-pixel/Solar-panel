import produce from 'immer';
import { put, takeLatest } from 'redux-saga/effects';
import backendApi from './Model/api';
// import { configurationConstants } from '../../../sharedUtils/sharedRedux/configuration';

// constants
export const authConstants = {
  AUTH_REQUEST: 'AUTH_REQUEST',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  IS_LOGGED_IN_REQUEST: 'IS_LOGGED_IN_REQUEST',
  IS_LOGGED_IN_SUCCESS: 'IS_LOGGED_IN_SUCCESS',
  IS_LOGGED_IN_FAILURE: 'IS_LOGGED_IN_FAILURE',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  REG_USER_CHANGE_PASS_REQUEST: 'REG_USER_CHANGE_PASS_REQUEST',
  REG_USER_CHANGE_PASS_SUCCESS: 'REG_USER_CHANGE_PASS_SUCCESS',
  REG_USER_CHANGE_PASS_FAILURE: 'REG_USER_CHANGE_PASS_FAILURE',
  UPDATE_REG_USER_REQUEST: 'UPDATE_REG_USER_REQUEST',
  UPDATE_REG_USER_SUCCESS: 'UPDATE_REG_USER_SUCCESS',
  UPDATE_REG_USER_FAILURE: 'UPDATE_REG_USER_FAILURE',
  UPLOAD_PROFILE_IMAGE_REQUEST: 'UPLOAD_PROFILE_IMAGE_REQUEST',
  UPLOAD_PROFILE_IMAGE_SUCCESS: 'UPLOAD_PROFILE_IMAGE_SUCCESS',
  UPLOAD_PROFILE_IMAGE_FAILURE: 'UPLOAD_PROFILE_IMAGE_FAILURE',
  FORGOT_PASS_REQUEST: 'FORGOT_PASS_REQUEST',
  FORGOT_PASS_SUCCESS: 'FORGOT_PASS_SUCCESS',
  FORGOT_PASS_FAILURE: 'FORGOT_PASS_FAILURE',
  CHANGE_PASS_REQUEST: 'CHANGE_PASS_REQUEST',
  CHANGE_PASS_SUCCESS: 'CHANGE_PASS_SUCCESS',
  CHANGE_PASS_FAILURE: 'CHANGE_PASS_FAILURE',
  authorizeUrl: '/tac/project/auth/authorizeUrl',
  CLOSE_SIDE_BAR_AUTH: 'CLOSE_SIDE_BAR_AUTH',
  STOP_SIDE_BAR: 'STOP_SIDE_BAR',
};

export const authActions = {};
// actions

authActions.StopSideBar = payload => {
  return {
    type: authConstants.STOP_SIDE_BAR,
    payload,
  };
};

authActions.authorize = ({ email, password }) => {
  console.log('cdc');
  return {
    type: authConstants.AUTH_REQUEST,
    payload: { email, password },
  };
};
authActions.isLoggedIn = () => {
  return {
    type: authConstants.IS_LOGGED_IN_REQUEST,
    payload: {},
  };
};
authActions.Logout = resolve => {
  return {
    type: authConstants.LOGOUT_REQUEST,
    payload: {},
  };
};
authActions.regUserChangePass = (payload, resolve) => {
  return {
    type: authConstants.REG_USER_CHANGE_PASS_REQUEST,
    payload: payload,
  };
};
authActions.addNewSEmailBySelf = (payload, resolve) => ({
  type: authConstants.ADD_NEW_SEmail_BySelf_REQUEST,
  payload,
});
authActions.removeSEmailBySelf = (payload, resolve) => ({
  type: authConstants.REMOVE_SEmail_BySelf_REQUEST,
  payload,
});
authActions.updateRegUser = (payload, resolve) => ({
  type: authConstants.UPDATE_REG_USER_REQUEST,
  payload,
});
authActions.swapWithPrimaryEmail = (payload, resolve) => ({
  type: authConstants.SWAP_WITH_PRIMARY_EMAIL_REQUEST,
  payload,
});
authActions.uploadProfileImage = (payload, resolve) => ({
  type: authConstants.UPLOAD_PROFILE_IMAGE_REQUEST,
  payload,
});
authActions.forgotPass = (payload, resolve) => ({
  type: authConstants.FORGOT_PASS_REQUEST,
  payload,
});

authActions.changePass = (payload, resolve) => ({
  type: authConstants.CHANGE_PASS_REQUEST,
  payload,
});
authActions.authorizeUrl = payload => ({
  type: authConstants.authorizeUrl,
  payload,
});
authActions.CloseSideBarFun = payload => ({
  type: authConstants.CLOSE_SIDE_BAR_AUTH,
  payload,
});
// The initial state of the App
export const initialState = {
  loggedUser: {
    email: '',
    role: '',
    name: '',
    firstName: '',
    lastName: '',
    gender: '',
    jobTitle: '',
    companyId: '',
    Site: [''],
    phoneNumber: '',
    DOB: '',
    nationalInsurance: '',
  },
  hideSideBar: '',
  logged: 'wait',
  loginRequest: 'wait',
  error: null,
  authorizedUrl: '',
  authorizedStatus: 'checking',
  stopSideBar: true
};

// reducers
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case authConstants.AUTH_REQUEST:
        console.log('cdsed');
        draft.loginRequest = 'start';
        break;
      case authConstants.AUTH_SUCCESS:
        draft.loggedUser = action.payload;
        draft.logged = 'pass';
        break;
      case authConstants.AUTH_FAILURE:
        draft.loggedUser = initialState.loggedUser;
        draft.loginRequest = 'wait';
        draft.logged = 'fail';
        break;
      case authConstants.IS_LOGGED_IN_SUCCESS:
        draft.loggedUser = action.payload;
        draft.logged = 'pass';
        break;
      case authConstants.IS_LOGGED_IN_FAILURE:
        draft.loggedUser.email = initialState;
        draft.logged = 'fail';
        break;
      case authConstants.LOGOUT_SUCCESS:
        draft.loggedUser = initialState;
        draft.logged = 'fail';
        break;
      case authConstants.UPDATE_REG_USER_SUCCESS:
        draft.loggedUser = action.payload;
        break;
      case authConstants.UPLOAD_PROFILE_IMAGE_SUCCESS:
        draft.loggedUser = action.payload;
        break;
      case authConstants.CLOSE_SIDE_BAR_AUTH:
        console.log(action.payload)
        draft.hideSideBar = action.payload.status;
        draft.message = action.payload.msg;
        break;
      case authConstants.STOP_SIDE_BAR:
        draft.stopSideBar = action.payload;
        break;
      case authConstants.authorizeUrl:
        draft.authorizedUrl = action.payload;
        if (
          state.logged == 'pass' &&
          state.loggedUser.role.containers.filter(
            v => action.payload.indexOf(v.container) >= 0,
          ).length > 0
        ) {
          draft.authorizedStatus = 'pass';
        } else {
          draft.authorizedStatus = 'fail';
        }
        break;
      default:
        break;
    }
  });
export default appReducer;

function* authorize(props) {
  try {
    console.log('cdsed 2')

    yield put({
      type: configurationConstants.startLoader,
    });
    const json = yield backendApi.login(props.payload);
    yield put({
      type: configurationConstants.enableFeedback,
      payload: json.message,
    });
    yield put({
      type: configurationConstants.endLoader,
      payload: json.message,
    });
    if (json.success) {
      yield put({ type: authConstants.AUTH_SUCCESS, payload: json });
    } else {
      yield put({ type: authConstants.AUTH_FAILURE, payload: false });
    }
  } catch (error) {
    yield put({ type: authConstants.AUTH_FAILURE, payload: false });
  }
}
function* isLoggedIn(props) {
  try {
    const json = yield backendApi.isLoggedIn();
    if (json.success) {
      yield put({ type: authConstants.IS_LOGGED_IN_SUCCESS, payload: json });
    } else {
      yield put({ type: authConstants.IS_LOGGED_IN_FAILURE, payload: false });
    }
  } catch (error) {
    yield put({ type: authConstants.IS_LOGGED_IN_FAILURE, payload: false });
  }
}
function* Logout(props) {
  try {
    const json = yield backendApi.Logout();
    yield put({ type: authConstants.LOGOUT_SUCCESS, payload: false });
  } catch (error) {
    yield put({ type: 'IS_LOGGED_IN_FAILURE', payload: false });
  }
}


function* regUserChangePass(props) {
  try {
    yield put({
      type: configurationConstants.startLoader,
    });
    const json = yield backendApi.regUserChangePass(props.payload);
    yield put({
      type: configurationConstants.endLoader,
    });
    yield put({
      type: authConstants.CLOSE_SIDE_BAR_AUTH,
      payload: { status: true, msg: '' },
    });
    yield put({
      type: configurationConstants.enableFeedback,
      payload: json.message,
    });
    yield put({ type: 'REG_USER_CHANGE_PASS_SUCCESS', payload: false });
  } catch (error) {
    yield put({ type: 'REG_USER_CHANGE_PASS_FAILURE', payload: false });
  }
}

function* updateRegUser(props) {
  try {
    yield put({
      type: configurationConstants.startLoader,
    });
    const apiResponse = yield backendApi.updateRegUser(props.payload);
    // yield authorize(props);
    yield put({
      type: 'UPDATE_REG_USER_SUCCESS',
      payload: apiResponse.userData,
    });
    yield put({
      type: configurationConstants.endLoader,
    });
    yield put({
      type: 'CLOSE_SIDE_BAR_AUTH',
      payload: { status: true, msg: '' },
    });
    yield put({
      type: configurationConstants.enableFeedback,
      payload: apiResponse.message,
    });
    // props.resolve(apiResponse);
  } catch (error) {
    yield put({
      type: configurationConstants.endLoader,
    });
    // yield put({
    //   type: configurationConstants.enableFeedback,
    //   payload: res.message,
    // });
    yield put({ type: authConstants.UPDATE_REG_USER_FAILURE, payload: false });
  }
}

function* uploadProfileImage(props) {
  try {
    yield put({
      type: configurationConstants.startLoader,
    });
    const apiResponse = yield backendApi.uploadProfileImage(props.payload);
    console.log('apiResponse,apiResponse1', apiResponse);
    yield put({
      type: 'UPLOAD_PROFILE_IMAGE_SUCCESS',
      payload: apiResponse.userData,
    });
    yield put({
      type: configurationConstants.endLoader,
    });
    yield put({
      type: configurationConstants.enableFeedback,
      payload: apiResponse.message,
    });
  } catch (error) {
    yield put({ type: 'UPLOAD_PROFILE_IMAGE_FAILURE', payload: false });
  }
}
function* forgotPass(props) {
  try {
    console.log('Loader Start ---->', configurationConstants.startLoader);
    yield put({
      type: configurationConstants.startLoader,
    });
    const apiResponse = yield backendApi.forgotPass(props.payload);
    console.log('apiResponse,apiResponse1', apiResponse);
    // props.resolve(apiResponse);
    yield put({
      type: authConstants.FORGOT_PASS_SUCCESS,
      payload: apiResponse.userData,
    });
    yield put({
      type: configurationConstants.endLoader,
    });
    yield put({
      type: configurationConstants.enableFeedback,
      payload: apiResponse.message,
    });
    yield put({
      type: authConstants.CLOSE_SIDE_BAR_AUTH,
      payload: { status: true, msg: '' },
    });
  } catch (error) {
    yield put({ type: authConstants.FORGOT_PASS_FAILURE, payload: false });
  }
}
function* changePassUser(props) {
  try {
    yield put({
      type: configurationConstants.startLoader,
    });
    const json = yield backendApi.resetPass(
      props.payload.d,
      props.payload.data,
    );
    yield put({ type: authConstants.CHANGE_PASS_SUCCESS, payload: true });
    yield put({
      type: configurationConstants.enableFeedback,
      payload: json.message,
    });
    yield put({
      type: configurationConstants.endLoader,
      payload: json.message,
    });
  } catch (error) {
    yield put({
      type: configurationConstants.endLoader,
      payload: error.message,
    });
    yield put({ type: authConstants.CHANGE_PASS_FAILURE, payload: false });
  }
}
export const AuthSagas = [
  takeLatest(authConstants.AUTH_REQUEST, authorize),
  takeLatest(authConstants.IS_LOGGED_IN_REQUEST, isLoggedIn),
  takeLatest(authConstants.LOGOUT_REQUEST, Logout),
  takeLatest(authConstants.FORGOT_PASS_REQUEST, forgotPass),
  takeLatest(authConstants.CHANGE_PASS_REQUEST, changePassUser),
  takeLatest(authConstants.REG_USER_CHANGE_PASS_REQUEST, regUserChangePass),
  takeLatest('UPDATE_REG_USER_REQUEST', updateRegUser),
  takeLatest('UPLOAD_PROFILE_IMAGE_REQUEST', uploadProfileImage),
  // takeLatest('FORGOT_PASS_REQUEST', forgotPass),
];
