import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
    loading: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PHONE_AUTH_START: return phoneAuthStart(state, action);
    default:
      return state;
  }
};

export default reducer;