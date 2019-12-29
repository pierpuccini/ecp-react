/* ---------------------------------------------- auth ---------------------------------------------- */
export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export const SIGN_UP_START = "SIGN_UP_START";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAIL = "SIGN_UP_FAIL";

export const PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS";
export const PASSWORD_RESET_FAIL = "PASSWORD_RESET_FAIL";

export const RESET_SUCCESS = "RESET_SUCCESS";
export const RESET_ERRORS_ON_AUTH_LINK_CHANGE = "RESET_ERRORS_ON_AUTH_LINK_CHANGE";

export const GET_ID_TOKEN = "GET_ID_TOKEN"

/* Deletes user if it has not been signed up */
export const DELETE_NEW_USER = "DELETE_NEW_USER";

/* ---------------------------------------------- users ---------------------------------------------- */
export const ONBOARDING_START = "ONBOARDING_START"
export const ONBOARDING_FAILED = 'ONBOARDING_FAILED';
export const ONBOARDING_SUCCESS = "ONBOARDING_SUCCESS"
export const ONBOARDING_RESET = "ONBOARDING_RESET";

export const USER_UPDATE_STARTED = "USER_UPDATE_STARTED";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAILED = "USER_UPDATE_FAILED";
export const USER_RESET_ERRORS = "USER_RESET_ERRORS";
export const USER_RESET = "USER_RESET";
export const USER_DISABLED = "USER_DISABLED";

/* ---------------------------------------------- clasrooms ---------------------------------------------- */
export const CLASSROOM_ACTIONS_START = "CLASSROOM_ACTIONS_START";
export const CLASSROOM_ACTIONS_FAILED = "CLASSROOM_ACTIONS_FAILED";

export const CLASSROOM_CREATE_SUCCESS = "CLASSROOM_CREATE_SUCCESS";
export const CLASSROOM_ACTIONS_CREATE_RESET = "CLASSROOM_ACTIONS_CREATE_RESET";

export const CLASSROOM_GET_ONE_CLASSROOM_SUCCESS = "CLASSROOM_GET_ONE_CLASSROOM_SUCCESS";
export const CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS = "CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS";
export const CLASSROOM_ACTIONS_FETCH_RESET = "CLASSROOM_ACTIONS_FETCH_RESET";

export const CLASSROOM_UPDATE_SUCCESS = "CLASSROOM_UPDATE_SUCCESS";
export const CLASSROOM_MANAGE_STUDENTS_SUCCESS = "CLASSROOM_MANAGE_STUDENTS_SUCCESS";
export const CLASSROOM_DELETE_SUCCESS = "CLASSROOM_DELETE_SUCCESS";
export const CLASSROOM_RESTORE_SUCCESS = "CLASSROOM_RESTORE_SUCCESS";

export const CLASSROOM_SEARCH_SUCCESS = "CLASSROOM_SEARCH_SUCCESS";

export const CLASSROOM_STUDENT_GROUPS_CREATE = 'CLASSROOM_STUDENT_GROUPS_CREATE';

/* ---------------------------------------------- power ups ---------------------------------------------- */
export const POWERUP_START = "POWERUP_START"
export const POWERUP_FAILED = "POWERUP_FAILED"

export const POWERUP_CREATE ="POWERUP_CREATE"
export const POWERUP_EDIT ="POWERUP_EDIT"
export const POWERUP_DELETE ="POWERUP_DELETE"

export const POWERUP_GET_ALL = "POWERUP_GET_ALL"