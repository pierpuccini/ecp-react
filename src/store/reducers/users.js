import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  success: false
};

const userUpdateStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null
  });
};

const userUpdateFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false
  });
};

const userUpdateSuccess = state => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_UPDATE_STARTED: return userUpdateStart(state, action);
    case actionTypes.USER_UPDATE_SUCCESS: return userUpdateSuccess(state, action);
    case actionTypes.USER_UPDATE_FAILED: return userUpdateFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
