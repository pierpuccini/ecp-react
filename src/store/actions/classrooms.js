import * as actionTypes from "./actionTypes";
import axios from '../../axios/axios'

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

export const createClassroom = (payload) =>{
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart())
    console.log('payload',payload);
    dispatch(classroomSuccess())
  }
}
