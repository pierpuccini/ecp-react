import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  success: false,
  tempPowerup: null,
  dbPowerups: null
};

const powerupsStart = state => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null,
  });
};

const powerupsFailed = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false,
  });
};

const powerupsCreate = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true,
  });
};

const powerupsEdit = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true,
  });
};

const powerupsDelete = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: false,
    success: true,
  });
};


const logout = state => {
  return updateObject(state, null);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POWERUPS_START: return powerupsStart(state, action);
    case actionTypes.POWERUPS_FAILED: return powerupsFailed(state, action);
    case actionTypes.POWERUP_CREATE: return powerupsCreate(state, action);
    case actionTypes.POWERUP_EDIT: return powerupsEdit(state, action);
    case actionTypes.POWERUP_DELETE: return powerupsDelete(state, action);
    case actionTypes.AUTH_LOGOUT: return logout(state, action);
    default:
      return state;
  }
};

export default reducer;
