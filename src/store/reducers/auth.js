import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: "/"
};

const authStart = state => {
  return updateObject(state, { error: null, loading: true });
};
const authSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
};
const authFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      console.log("[LOGIN START]");
      return authStart(state, action);

    case actionTypes.AUTH_SUCCESS:
      console.log("[LOGIN SUCCESS]");
      return authSuccess(state, action);

    case actionTypes.AUTH_FAIL:
      console.log("[LOGIN ERROR]");
      return authFail(state, action);

    default:
      return state;
  }
};

export default reducer;
