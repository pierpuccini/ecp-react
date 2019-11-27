import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  success: false,
  showSuccess: false
};

const onboardingStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null,
    showSuccess: null
  });
};

const onboardingFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false,
    showSuccess: false    
  });
};

const onboardingSuccess = state => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true,
    showSuccess: true
  });
};

const onboardingReset = state => {
  return updateObject(state, {
    success: false
  });
};

const onboardingLogout = state => {
  return updateObject(state, null);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ONBOARDING_START: return onboardingStart(state, action);
    case actionTypes.ONBOARDING_FAILED: return onboardingFailed(state, action);
    case actionTypes.ONBOARDING_SUCCESS: return onboardingSuccess(state, action);
    case actionTypes.ONBOARDING_RESET: return onboardingReset(state, action);
    case actionTypes.AUTH_LOGOUT: return onboardingLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
