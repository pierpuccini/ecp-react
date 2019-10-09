import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  error: null,
  loading: false,
  authRedirectPath: "/home"
};

const signUpStart = state => {
  return updateObject(state, { error: null, loading: true });
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

const authStart = state => {
  return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const passwordResetSuccess = (state) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};

const passwordResetFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const authLogout = (state) => {
  return updateObject(state, { token: null, userId: null });
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
    default:
      return state;
  }
};

export default reducer;
