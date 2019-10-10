import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  error: null,
  loading: false,
  authRedirectPath: "/home",
  success: false,
  smsSent : false,
  captcha: null,
  confirmCode: null
};

const signUpStart = state => {
  return updateObject(state, { error: null, loading: true, success: false });
};

const signUpSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const signUpFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const phoneLoginStart = state => {
  return updateObject(state, {
    error: null,
    loading: true,
    success: false    
  });
};

const phoneLoginSmsSent = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    success: false,
    smsSent: true,
    captcha: action.verifier,
    confirmCode: action.confirmation
  });
};

const phoneLoginSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false,
    success: true,
    smsSent: false,
    captcha: null
  });
};

const phoneLoginFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    success: false,
    smsSent: false,
    captcha: null
  });
};

const authStart = state => {
  return updateObject(state, { error: null, loading: true, success: false });
};

const authSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false, success: false });
};

const passwordResetSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false,
    success: true
  });
};

const passwordResetFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false, success: false });
};

const authLogout = (state) => {
  return updateObject(state, { token: null, userId: null, smsSent: false, success: false });
};

const resetSuccess = state => {
  return updateObject(state, { success: false, smsSent: false });
};

const resetErrors = state => {
  return updateObject(state, { error: null, smsSent: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PHONE_LOGIN_START: return phoneLoginStart(state, action);
    case actionTypes.PHONE_LOGIN_SMS_SENT: return phoneLoginSmsSent(state, action);
    case actionTypes.PHONE_LOGIN_SUCCESS: return phoneLoginSuccess(state, action);
    case actionTypes.PHONE_LOGIN_FAIL: return phoneLoginFail(state, action);
    case actionTypes.SIGN_UP_START: return signUpStart(state, action);
    case actionTypes.SIGN_UP_SUCCESS: return signUpSuccess(state, action);
    case actionTypes.SIGN_UP_FAIL: return signUpFail(state, action);
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.PASSWORD_RESET_SUCCESS: return passwordResetSuccess(state, action);
    case actionTypes.PASSWORD_RESET_FAIL: return passwordResetFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.RESET_SUCCESS: return resetSuccess(state, action);
    case actionTypes.RESET_ERRORS_ON_AUTH_LINK_CHANGE: return resetErrors(state, action);
    default:
      return state;
  }
};

export default reducer;
