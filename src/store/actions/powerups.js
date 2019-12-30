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

export const powerupsCreate = () => {
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

export const powerupsGetAll = powerups => {
  return {
    type: actionTypes.POWERUP_GET_ALL,
    powerups: powerups
  };
};

export const powerupsPurchase = () => {
  return {
    type: actionTypes.POWERUP_PURCHASE
  };
};

export const powerupActions = data => {
  return (dispatch /* getState */) => {
    dispatch(powerupsStart());

    console.log("data", data);
    let url = "/update-master-powerup",
      dispatcher = powerupsEdit(),
      method = "put";
    if (data.id == null) {
      url = "/create-master-powerup";
      dispatcher = powerupsCreate();
      method = "post";
    } else if (data.deleted != null) {
      url = "/delete-master-powerup";
      dispatcher = powerupsDelete();
      method = "delete";
    }

    axios({
      method: method,
      url: url,
      data: data
    })
      .then(res => {
        console.log("res", res);
        dispatch(dispatcher);
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(powerupsFailed(error));
      });
  };
};

export const getPowerups = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(powerupsStart());
    console.log("payload", payload);
    let searchParams = payload.id.length === 0 ? 1 : payload.id;
    if (payload.role === "student") {
      searchParams = [];
      payload.id.forEach(classroom => searchParams.push(classroom.id));
    }
    console.log(
      `get-all-powerups/${searchParams}/${payload.role}/${currentState.firebase.auth.uid}`
    );
    axios
      .get(
        `/get-all-powerups/${searchParams}/${payload.role}/${currentState.firebase.auth.uid}`
      )
      .then(res => {
        dispatch(powerupsGetAll(res.data));
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(powerupsFailed(error));
      });
  };
};

export const purchasePowerup = payload => {
  return dispatch => {
    dispatch(powerupsStart());
    console.log("payload", payload);

    axios
      .post('/buy-powerups', payload)
      .then(res => {
        dispatch(powerupsPurchase());
      })
      .catch(error => {
        console.log("error", error.response);
        dispatch(powerupsFailed(error));
      });
  };
};
