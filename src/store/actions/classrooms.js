import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const classroomStart = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_START
  };
};

export const classroomSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_SUCCESS
  };
};

export const createClassroom = (payload, token) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart());
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    console.log('headers',headers);
    console.log("payload", payload);
    let extractMissingFields = {};
    Object.keys(payload).forEach(fields => {
      // eslint-disable-next-line
      extractMissingFields = {
        ...extractMissingFields,
        [fields]: payload[fields] === "no-touch" ? true : false
      };
    });
    console.log("extractMissingFields", extractMissingFields);
    // axios.post('/createclassroom',)
    dispatch(classroomSuccess());
  };
};
