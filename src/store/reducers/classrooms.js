import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false
};

const classroomStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null
  });
};

const classroomSuccess = state => {
  return updateObject(state, {
    loading: false,
    error: null
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLASSROOM_ACTIONS_START: return classroomStart(state, action);
    case actionTypes.CLASSROOM_ACTIONS_SUCCESS: return classroomSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
