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

export const getAllClassroomSuccess = (classrooms) => {
  return {
    type: actionTypes.CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS,
    classrooms: classrooms
  };
};

export const createClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart());
    const currentState = getState();
    const firestore = getFirestore();
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
          if (
            response.status === 200 &&
            response.data.code_classroom !== null
          ) {
            // Prevents classroom from being added to admin acc
            if (!currentState.firebase.profile.role.includes("admin")) {
              const classrooms = [
                ...currentState.firebase.profile.classrooms,
                {
                  code_classroom: response.data.code_classroom,
                  subject_id: response.data.id
                }
              ];
              firestore
                .collection("users")
                .doc(currentState.firebase.auth.uid)
                .set({ classrooms: classrooms }, { merge: true })
                .then(() => {
                  dispatch(
                    classroomSuccess(
                      extractMissingFields,
                      response.data.code_classroom
                    )
                  );
                })
                .catch(err => {
                  dispatch(classroomFail(err));
                });
            } else {
              dispatch(
                classroomSuccess(
                  extractMissingFields,
                  response.data.code_classroom
                )
              );
            }
          } else {
            const unknownError = {
              code: "create-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(classroomFail(unknownError));
          }
        })
        .catch(error => {
          console.log(error.response)
          dispatch(classroomFail(error.response.data.error != null ? error.response.data.error:error.response.data));
        });
    }
  };
};

export const resetCreateClassroom = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_CREATE_RESET
  };
};

export const addClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart());
    const currentState = getState();
    const firestore = getFirestore();

    let error;
    // Verifies that the token was properly recieved
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

      payload = { ...payload, student_id: currentState.firebase.auth.uid };
      axios
        .post("/assignclassroom", payload, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            //Spreading classroom to prevent mutating array
            const classrooms = [
              ...currentState.firebase.profile.classrooms,
              {
                code_classroom: payload.code_classroom,
                subject_id: response.data.classroomId
              }
            ];
            firestore
              .collection("users")
              .doc(currentState.firebase.auth.uid)
              .set(
                {
                  classrooms: classrooms
                },
                { merge: true }
              )
              .then(() => {
                dispatch(classroomSuccess());
              })
              .catch(err => {
                dispatch(classroomFail(err));
              });
          } else {
            const unknownError = {
              code: "add-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(classroomFail(unknownError));
          }
        })
        .catch(error => {
          dispatch(classroomFail(error.response.data.error != null ? error.response.data.error:error.response.data));
        });
    }
  };
};

export const getAllMyClassrooms = payload => {
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
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentState.auth.token.token}`
      };

      const url = `/allclassroom?type=${payload.role}&user_id=${payload.uid}`;
      axios
        .get(url, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            dispatch(getAllClassroomSuccess(response.data.classrooms));
          } else {
            const unknownError = {
              code: "add-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(classroomFail(unknownError));
          }
        })
        .catch(error => {
          console.log(error.response);
          dispatch(classroomFail(error.response.data.error != null ? error.response.data.error:error.response.data));
        });
    }
  };
};
