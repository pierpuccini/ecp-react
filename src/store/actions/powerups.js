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

export const powerupsCreate = temp => {
  return {
    type: actionTypes.POWERUP_CREATE,
    temp: temp
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

export const powerupsGetAll = powerups => {
  return {
    type: actionTypes.POWERUP_GET_ALL,
    powerups: powerups
  };
};

export const powerupActions = data => {
  return (dispatch /* getState */) => {
    dispatch(powerupsStart());

    console.log("data", data);
    let url =
      data.id == null
        ? "/create-master-powerup"
        : data.deleted != null
        ? "/delete-master-powerup"
        : "/update-master-powerup";

    axios
      .post(url, data)
      .then(res => {
        console.log("res", res);
        dispatch(
          data.id == null
            ? powerupsCreate({ ...data, id: res.data.powerupId })
            : data.deleted != null
            ? powerupsEdit()
            : powerupsDelete()
        );
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(powerupsFailed(error));
      });
  };
};

export const getPowerups = payload => {
  return dispatch => {
    dispatch(powerupsStart());

    axios
      .get(`get-all-powerups/${payload.id}/${payload.role}`)
      .then(res => {
        dispatch(powerupsGetAll(res.data));
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(powerupsFailed(error));
      });
  };
};
