import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const classroomStart = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_START
  };
};

export const classroomFail = error => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_FAILED,
    error: error
  };
};

export const classroomSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_SUCCESS
  };
};

export const createClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart());
    const currentState = getState();
    let error;
    if (currentState.auth.token.type === "error") {
      error = {
        code: "token-error",
        message: `${currentState.auth.token.message} for user, please refresh the page`
      };
      dispatch(classroomFail(error));
    } /* If token is all good proceed to sending information to API */ else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: currentState.auth.token.token
      };
      console.log("headers", headers);
      console.log("payload", payload);
      let extractMissingFields = {};
      Object.keys(payload).forEach(fields => {
        // eslint-disable-next-line
        extractMissingFields = {
          ...extractMissingFields,
          [fields]: payload[fields] === "no-touch" ? true : false
        };
        payload = {
          ...payload,
          [fields]: payload[fields] === "no-touch" ? null : payload[fields]
        };
      });
      console.log("extractMissingFields", extractMissingFields);
      console.log("payload", payload);
      axios
        .post("/createclassroom", payload, { headers: headers })
        .then(response => {
          console.log("resp", response);
          dispatch(classroomSuccess());
        })
        .catch(error => {
          console.log("error", error);
          dispatch(classroomFail(error))
        });
    }
  };
};
