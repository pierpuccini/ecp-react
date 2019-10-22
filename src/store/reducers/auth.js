import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  error: null,
  loading: false,
  authRedirectPath: "/home",
  success: false,
  newUser: false,
  logout: false,
  newUserGoogleLogin: false
}

const signUpStart = (state, action) => {
  return updateObject(state, { error: null, loading: true, success: false, logout: false, newUserGoogleLogin: false });
};

const signUpSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    newUser: false
  });
};

const signUpFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const authStart = state => {
  return updateObject(state, {
    error: null,
    loading: true,
    success: false,
    logout: false,
    newUserGoogleLogin: false
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: action.loading,
    newUser: action.newUser,
    newUserGoogleLogin: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: action.loading, success: false, newUser: action.newUser, newUserGoogleLogin: action.newUserGoogleLogin });
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

const authLogout = (state, action) => {
  let error = null;
  let newUser = null;
  
  action.cleanErrors ? (error = false) : (error = action.errors);
  action.cleanNewUser ? (newUser = false) : (newUser = action.newUser);

  return updateObject(state, {
    error: error,
    smsSent: false,
    success: false,
    resetCaptcha: false,
    newUser: newUser,
    loading: action.loading,
    logout: true
  });
};

const deleteNewUser = (state, action) => {
  let error = null;
  let newUser = null;
  
  action.cleanErrors ? (error = false) : (error = action.errors);
  action.cleanNewUser ? (newUser = false) : (newUser = action.newUser);

  return updateObject(state, {
    error: error,
    smsSent: false,
    success: false,
    resetCaptcha: false,
    newUser: newUser,
    loading: action.loading,
  });
};

const resetSuccess = state => {
  return updateObject(state, { success: false, smsSent: false });
};

const resetErrors = state => {
  return updateObject(state, { error: null, smsSent: false, resetCaptcha: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_UP_START: return signUpStart(state, action);
    case actionTypes.SIGN_UP_SUCCESS: return signUpSuccess(state, action);
    case actionTypes.SIGN_UP_FAIL: return signUpFail(state, action);
    case actionTypes.AUTH_START: return authStart(state, action);
    case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
    case actionTypes.AUTH_FAIL: return authFail(state, action);
    case actionTypes.PASSWORD_RESET_SUCCESS: return passwordResetSuccess(state, action);
    case actionTypes.PASSWORD_RESET_FAIL: return passwordResetFail(state, action);
    case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
    case actionTypes.DELETE_NEW_USER: return deleteNewUser(state, action);
    case actionTypes.RESET_SUCCESS: return resetSuccess(state, action);
    case actionTypes.RESET_ERRORS_ON_AUTH_LINK_CHANGE: return resetErrors(state, action);
    default:
      return state;
  }
};

export default reducer;