import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// Login Redux States
import {
  LOGIN_USER,
  LOGIN_AS,
  GET_PANEL_USER,
  EXPORT_PANEL_USER,
  UPDATE_ACCOUNT,
  LOGOUT_USER,
  SOCIAL_LOGIN,
  USER_PROFILE,
  VERIFY_USER,
  RESET_PASSWORD,
  GET_USER_CONSENT_STATUS,
  REGISTER_USER_CONSENT_STATUS,
} from './actionTypes';
import { apiError, loginSuccess, logoutUserSuccess, loginApiResponseSuccess, loginApiResponseError } from './actions';

import {
  loginAs as loginAsApi,
  postLogin,
  getUserProfile as getUserProfileApi,
  postResetPass,
  postUpdateAccount,
  postVerification,
  getPanelUser as getPanelUsersApi,
  exportPanelUser as exportPanelUsersApi,
  getUserConsent as getUserConsentApi,
  registerUserConsent as registerUserConsentApi,
  postLogout,
} from '../../../helpers/backend_helper';
import CustomNotification from '../../../Components/Common/CustomNotification';
import { deleteIndexedDatabase } from '../../../helpers/chat-db';

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, {
      email: user.email,
      password: user.password,
      panel: window.location.hostname,
      captcha: user.captcha,
      timestamp: Math.round(new Date().getTime() / 1000),
    });
    if (response.success) {
      // if (response.permissions !== null && response.permissions !== undefined) {
      //   let enc = encrypt(JSON.stringify(response.permissions));
      //   localStorage.setItem('_ac', enc);
      // }
      if (response.language !== undefined) {
        localStorage.setItem('userLanguage', response.language);
      }
      localStorage.setItem('authToken', response.token);
      yield put(loginSuccess(response));
      window.location.href = '/leadsource/settings';
    } else {
      if (response.code === 'ERR_SESSION_11000') {
        sessionStorage.setItem('prev_session', JSON.stringify(response.session));
        window.location.href = '/login?found_prev_session=1';
      } else {
        CustomNotification.error(response.message);
        yield put(apiError(response.message));
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* loginAs({ payload: data }) {
  try {
    const response = yield call(loginAsApi, data);
    yield put(loginApiResponseSuccess(LOGIN_AS, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* getUserProfile({ payload: data }) {
  try {
    const response = yield call(getUserProfileApi, data);
    if (response.success) {
      yield put(loginApiResponseSuccess(USER_PROFILE, response.data));
    } else {
      yield put(loginApiResponseError(USER_PROFILE, response.data));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* verifyUser({ payload: data }) {
  try {
    const response = yield call(postVerification, data);
    yield put(loginApiResponseSuccess(VERIFY_USER, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* getPanelUser({ payload: data }) {
  try {
    const response = yield call(getPanelUsersApi, data);
    yield put(loginApiResponseSuccess(GET_PANEL_USER, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* getUserConsentStatus({ payload: data }) {
  try {
    const response = yield call(getUserConsentApi, data);
    yield put(loginApiResponseSuccess(GET_USER_CONSENT_STATUS, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* regitserUserConsentStatus({ payload: data }) {
  try {
    const response = yield call(registerUserConsentApi, data);
    yield put(loginApiResponseSuccess(REGISTER_USER_CONSENT_STATUS, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* exportPanelUser({ payload: data }) {
  try {
    const response = yield call(exportPanelUsersApi, data);
    yield put(loginApiResponseSuccess(EXPORT_PANEL_USER, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateAccount({ payload: data }) {
  try {
    const response = yield call(postUpdateAccount, data);
    yield put(loginApiResponseSuccess(UPDATE_ACCOUNT, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* resetPassword({ payload: data }) {
  try {
    const response = yield call(postResetPass, data);
    yield put(loginApiResponseSuccess(RESET_PASSWORD, response));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    let session = '';
    if (localStorage.getItem('authToken')) {
      session = localStorage.getItem('authToken');
    } else if (sessionStorage.getItem('prev_session')) {
      session = sessionStorage.getItem('prev_session');
      session = JSON.parse(session);
      session = session.id;
    }

    const response = yield call(postLogout, {
      session: session,
    });
    if (response.success) {
      if (sessionStorage.getItem('prev_session')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authPermission');
        localStorage.removeItem('timestamp');
        localStorage.removeItem('isFreeActive');
        localStorage.removeItem('adminAsGuest');
        sessionStorage.removeItem('prev_session');

        if (response.language !== undefined) {
          localStorage.setItem('userLanguage', response.language);
        }
        localStorage.setItem('authToken', response.token);
        yield put(loginSuccess(response));
        window.location.href = '/leadsource/settings';
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authPermission');
        localStorage.removeItem('timestamp');
        localStorage.removeItem('isFreeActive');
        localStorage.removeItem('adminAsGuest');
        sessionStorage.removeItem('prev_session');

        deleteIndexedDatabase()
          .then((_) => {})
          .catch((_) => {});
        yield put(logoutUserSuccess(LOGOUT_USER, true));
      }
    } else {
      yield put(apiError(LOGOUT_USER, error));
    }
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(GET_USER_CONSENT_STATUS, getUserConsentStatus);
  yield takeEvery(REGISTER_USER_CONSENT_STATUS, regitserUserConsentStatus);
  yield takeEvery(USER_PROFILE, getUserProfile);
  yield takeEvery(LOGIN_AS, loginAs);
  yield takeEvery(GET_PANEL_USER, getPanelUser);
  yield takeEvery(EXPORT_PANEL_USER, exportPanelUser);
  yield takeEvery(UPDATE_ACCOUNT, updateAccount);
  yield takeEvery(VERIFY_USER, verifyUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

export default authSaga;
