import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  error: null,
  loading: false,
  authRedirectPath: "/home",
  success: false,
  smsSent: false,
  captcha: null,
  confirmCode: null,
  resetCaptcha: false,
  newUser: false,
  phoneAuthStarted: false,
  verifingSMS: false,
  createPhoneUser: { error: false },
  phoneAuthDone: false,
  isGoogleSignUp: false,
  googleSignUpInfo: null,
  savedGoogleInfo: false
}

const signUpStart = (state, action) => {
  return updateObject(state, { error: null, loading: true, success: false, isGoogleSignUp: action.isGoogleSignUp });
};

const signUpSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    isGoogleSignUp: action.isGoogleSignUp,
    googleSignUpInfo: updateObject(state.googleSignUpInfo, {...action.googleSignUpInfo}),
    savedGoogleInfo: action.savedGoogleInfo
  });
};

const signUpFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    isGoogleSignUp: false
  });
};

const phoneAuthStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    success: false,
    phoneAuthStarted: action.phoneAuthStarted,
    verifingSMS: action.verifingSMS   
  });
};

const phoneAuthSmsSent = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    success: false,
    smsSent: true,
    captcha: action.verifier,
    confirmCode: action.confirmation,
    phoneAuthStarted: false
  });
};

const phoneAuthSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: action.loading,
    smsSent: false,
    captcha: null,
    newUser: action.newUser,
    phoneAuthStarted: action.phoneAuthStarted,
    verifingSMS: action.verifingSMS,
    phoneAuthDone: action.phoneAuthDone

  });
};

const phoneAuthFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: action.loading,
    success: false,
    smsSent: false,
    captcha: null,
    resetCaptcha: (action.newUser)? false : true
  });
};

const authStart = state => {
  return updateObject(state, {
    error: null,
    loading: true,
    success: false,
    createPhoneUser: updateObject(state.createPhoneUser, { error: false }),
    phoneAuthDone: false
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: action.loading,
    newUser: action.newUser
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: action.loading, success: false });
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
    createPhoneUser: updateObject(state.createPhoneUser, { ...action.createPhoneUser})
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
    createPhoneUser: updateObject(state.createPhoneUser, { ...action.createPhoneUser})
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
    case actionTypes.PHONE_AUTH_START: return phoneAuthStart(state, action);
    case actionTypes.PHONE_AUTH_SMS_SENT: return phoneAuthSmsSent(state, action);
    case actionTypes.PHONE_AUTH_SUCCESS: return phoneAuthSuccess(state, action);
    case actionTypes.PHONE_AUTH_FAIL: return phoneAuthFail(state, action);
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