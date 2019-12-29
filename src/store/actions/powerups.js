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

export const powerupActions = data => {
  return (dispatch /* getState */) => {
    dispatch(powerupsStart());

    console.log("data", data);
    let url, dispatchType;
    if (data.id == null) {
      url = "/create-master-powerup";
      dispatchType = powerupsCreate();
    } else if (data.deleted != null) {
      dispatchType = powerupsEdit();
      url = "/delete-master-powerup";
    } else {
      dispatchType = powerupsDelete();
      url = "/update-master-powerup";
    }

    axios
      .post(url, data)
      .then(res => {
        console.log("res", res);
        dispatch(dispatchType);
      })
      .catch(error => {
        console.log("error", error);
        dispatch(powerupsFailed(error));
      });
  };
};
