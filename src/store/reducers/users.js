import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  success: false,
  successfullChanges: {
    displayName: 'no-change',
    institution: 'no-change',
    studentId: 'no-change',
    email: 'no-change',
    password: 'no-change'
  },
  persistentErr: null
};

const userUpdateStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null,
    successfullChanges: {
      displayName: "no-change",
      institution: "no-change",
      studentId: "no-change",
      email: "no-change",
      password: "no-change"
    }
  });
};

const userUpdateFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false,
    successfullChanges: action.successfullChanges,
    persistentErr: action.persistentErr
  });
};

const userUpdateSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true,
    successfullChanges: action.successfullChanges
  });
};

const userUpdateLogout = (state, action) => {
  return updateObject(state, null);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_UPDATE_STARTED: return userUpdateStart(state, action);
    case actionTypes.USER_UPDATE_SUCCESS: return userUpdateSuccess(state, action);
    case actionTypes.USER_UPDATE_FAILED: return userUpdateFailed(state, action);
    case actionTypes.AUTH_LOGOUT: return userUpdateLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
