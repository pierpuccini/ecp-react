import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  success: false
};

const onboardingStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null
  });
};

const onboardingFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.err,
    success: false
  });
};

const onboardingSuccess = state => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ONBOARDING_START: return onboardingStart(state, action);
    case actionTypes.ONBOARDING_FAILED: return onboardingFailed(state, action);
    case actionTypes.ONBOARDING_SUCCESS: return onboardingSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
