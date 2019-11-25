import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  missingFields: null,
  registrationCode: null
};

const classroomStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null
  });
};

const classroomFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false
  });
};

const classroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    missingFields: action.missingFields,
    registrationCode: action.code
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLASSROOM_ACTIONS_START: return classroomStart(state, action);
    case actionTypes.CLASSROOM_ACTIONS_FAILED: return classroomFail(state, action);
    case actionTypes.CLASSROOM_ACTIONS_SUCCESS: return classroomSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
