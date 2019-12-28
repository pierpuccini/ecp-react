import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const powerupsStart = () => {
  return {
    type: actionTypes.POWERUP_START
  };
};

export const powerupsFailed = err => {
  return {
    type: actionTypes.POWERUP_FAILED,
    error: err
  };
};

export const powerupsCreate = err => {
  return {
    type: actionTypes.POWERUP_CREATE
  };
};
export const powerupsEdit = err => {
  return {
    type: actionTypes.POWERUP_EDIT
  };
};
export const powerupsDelete = err => {
  return {
    type: actionTypes.POWERUP_DELETE
  };
};

export const powerupActions = (data) => {
    return (dispatch, /* getState */) => {
        console.log('data',data);
    }
}
