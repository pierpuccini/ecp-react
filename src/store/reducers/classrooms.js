import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  missingFields: {},
  registrationCode: null,
  success: false,
  classroom: null,
  classrooms: null,
  deleteSuccess: null,
  action: false,
  restoreSuccess: false
};

const classroomStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    error: null,
    success: null,
    classroom: null,
    classrooms: action.classrooms,
    deleteSuccess: false,
    action: action.action,
    restoreSuccess: false
  });
};

const classroomFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
    success: false,
    classrooms: action.classrooms
  });
};

const classroomCreateSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    missingFields: action.missingFields,
    registrationCode: action.code,
    success: true,
    createSuccess: true
  });
};

const classroomUpdateSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    missingFields: action.missingFields,
    updateSuccess: true,
    success: true,
    classrooms: action.classrooms
  });
};

const classroomManageStudentsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    success: true
  });
};

const getAllClassroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: action.loading,
    error: null,
    success: true,
    classrooms: action.classrooms,
    classroomsCopy: action.classrooms
  });
};

const getClassroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    success: true,
    classroom: action.classroom,
    classrooms: action.classrooms,
    updateSuccess: action.updateSuccess
  });
};

const restoreClassroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    restoreSuccess: true
  });
};

const deleteClassroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: null,
    deleteSuccess: true
  });
};

const resetCreateClassroom = state => {
  return updateObject(state, {
    loading: false,
    error: false,
    missingFields: {},
    registrationCode: "",
    success: false
  });
};

const resetFetchClassroom = state => {
  return updateObject(state, {
    classroom: null,
    classrooms: null
  });
};

const searchClassroomSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    success: true,
    classrooms: action.classrooms
  });
};

const studentGroupSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    success: true,
    classrooms: action.classrooms,
    classroom: action.classroom
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLASSROOM_ACTIONS_START: return classroomStart(state, action);
    case actionTypes.CLASSROOM_ACTIONS_FAILED: return classroomFail(state, action);
    case actionTypes.CLASSROOM_CREATE_SUCCESS: return classroomCreateSuccess(state, action);
    case actionTypes.CLASSROOM_UPDATE_SUCCESS: return classroomUpdateSuccess(state, action);
    case actionTypes.CLASSROOM_MANAGE_STUDENTS_SUCCESS: return classroomManageStudentsSuccess(state, action);
    case actionTypes.CLASSROOM_RESTORE_SUCCESS: return restoreClassroomSuccess(state, action);
    case actionTypes.CLASSROOM_DELETE_SUCCESS: return deleteClassroomSuccess(state, action);
    case actionTypes.CLASSROOM_GET_ONE_CLASSROOM_SUCCESS: return getClassroomSuccess(state, action);
    case actionTypes.CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS: return getAllClassroomSuccess(state, action);
    case actionTypes.CLASSROOM_SEARCH_SUCCESS: return searchClassroomSuccess(state, action);
    case actionTypes.CLASSROOM_STUDENT_GROUPS_CREATE: return studentGroupSuccess(state, action);
    case actionTypes.CLASSROOM_ACTIONS_FETCH_RESET: return resetFetchClassroom(state, action);
    case actionTypes.CLASSROOM_ACTIONS_CREATE_RESET: return resetCreateClassroom(state, action);
    default:
      return state;
  }
};

export default reducer;
