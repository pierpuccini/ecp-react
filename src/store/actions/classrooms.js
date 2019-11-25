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
        Authorization: `Bearer ${currentState.auth.token.token}`
      };
      console.log("headers", headers);
      console.log("payload", payload);
      let extractMissingFields = {};
      // add the teachers id to payload
      let newPayload = {'teacher_id': currentState.firebase.auth.uid}
      Object.keys(payload).forEach(fields => {
        // eslint-disable-next-line
        //Incharge of mapping names to the ones expected by the backend
        let backendFieldName;
        switch (fields) {
          case 'institutions':
            backendFieldName = 'client_id'
            break;
          case 'classCode':
            backendFieldName = 'subject_id'
            break;
          case 'className':
            backendFieldName = 'subject_name'
            break;
          case 'studentGroups':
            backendFieldName = 'group_size'
            break;
          case 'challengeTime':
            backendFieldName = 'challenge_duration'
            break;
          case 'coins':
            backendFieldName = 'initial_coins'
            break;
          default:
            break;
        }
        //Retrieved the missing fields to return to the teacher on empty creation
        extractMissingFields = {
          ...extractMissingFields,
          [fields]: payload[fields] === "no-touch" ? true : false
        };
        newPayload = {
          ...newPayload,
          [backendFieldName]: payload[fields] === "no-touch" ? null : payload[fields]
        };
      });
      payload = newPayload
      console.log("extractMissingFields", extractMissingFields);
      console.log("payload", payload);
      axios
        .post("/createclassroom", payload, { headers: headers })
        .then(response => {
          console.log("resp", response);
          dispatch(classroomSuccess());
        })
        .catch(error => {
          dispatch(classroomFail(error.response.data))
        });
    }
  };
};
