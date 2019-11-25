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

export const classroomSuccess = (missingFields, code) => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_SUCCESS,
    missingFields: missingFields,
    code: code
  };
};

export const createClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart());
    const currentState = getState();
    let error;
    // Verifies that the token was properly recieved
    if (currentState.auth.token.type === "error") {
      error = {
        code: "token-error",
        message: `${currentState.auth.token.message} for user, please refresh the page`
      };
      dispatch(classroomFail(error));
    } /* If token is all good proceed to sending information to API */ else {
      //Creates headers
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentState.auth.token.token}`
      };
      // In order to active the course, this missing fields must be empty
      let extractMissingFields = {};
      let noMissingFields = [];
      // add the teachers id to payload
      let newPayload = { teacher_id: currentState.firebase.auth.uid };
      Object.keys(payload).forEach(fields => {
        // eslint-disable-next-line
        //Incharge of mapping names to the ones expected by the backend
        let backendFieldName;
        switch (fields) {
          case "institutions":
            backendFieldName = "client_id";
            break;
          case "classCode":
            backendFieldName = "subject_id";
            break;
          case "className":
            backendFieldName = "subject_name";
            break;
          case "studentGroups":
            backendFieldName = "group_size";
            break;
          case "challengeTime":
            backendFieldName = "challenge_duration";
            break;
          case "coins":
            backendFieldName = "initial_coins";
            break;
          default:
            break;
        }
        //Retrieved the missing fields to return to the teacher on empty creation
        extractMissingFields = {
          ...extractMissingFields,
          [fields]: payload[fields] === "no-touch" ? true : false
        };
        //logic to check how many empty fiels exist
        if (payload[fields] !== "no-touch") {
          noMissingFields.push("a");
        }
        newPayload = {
          ...newPayload,
          [backendFieldName]:
            payload[fields] === "no-touch" ? null : payload[fields]
        };
      });
      // if no missing fields exists this replaces the missing fields object
      if (noMissingFields.length === 6) {
        extractMissingFields = { noMissingFields: true };
      }
      //Replaces the payload for better code reading
      payload = newPayload;
      //Creating course in backend
      axios
        .post("/createclassroom", payload, { headers: headers })
        .then(response => {
          console.log("resp", response);
          if (
            response.status === 201 &&
            response.data.code_classroom !== null
          ) {
            dispatch(
              classroomSuccess(
                extractMissingFields,
                response.data.code_classroom
              )
            );
          } else {
            const unknownError = {
              code: "create-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(classroomFail(unknownError));
          }
        })
        .catch(error => {
          dispatch(classroomFail(error.response.data));
        });
    }
  };
};

export const resetCreateClassroom = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_CREATE_RESET
  }
}