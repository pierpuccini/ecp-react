import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const classroomStart = (action, classrooms) => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_START,
    action: action,
    classrooms: classrooms
  };
};

export const classroomFail = (error, classroom, classrooms) => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_FAILED,
    error: error,
    classrooms: classrooms,
    classroom: classroom
  };
};

export const classroomSuccess = (missingFields, code) => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_SUCCESS,
    missingFields: missingFields,
    code: code
  };
};

export const classroomUpdateSuccess = (missingFields, classrooms) => {
  return {
    type: actionTypes.CLASSROOM_UPDATE_SUCCESS,
    missingFields: missingFields,
    classrooms: classrooms
  };
};

export const classroomManageStudentsSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_MANAGE_STUDENTS_SUCCESS
  };
};

export const getAllClassroomSuccess = (classrooms, loading) => {
  return {
    type: actionTypes.CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS,
    classrooms: classrooms,
    loading: loading
  };
};

export const getClassroomSuccess = (classroom, classrooms, updateSuccess) => {
  return {
    type: actionTypes.CLASSROOM_GET_ONE_CLASSROOM_SUCCESS,
    classroom: classroom,
    classrooms: classrooms,
    updateSuccess: updateSuccess
  };
};

export const restoreClassroomSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_RESTORE_SUCCESS
  };
};

export const deleteClassroomSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_DELETE_SUCCESS
  };
};

export const createClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(classroomStart("create"));
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
      //deletes null fields in object
      Object.keys(newPayload).forEach(field => {
        if (newPayload[field] == null) {
          delete newPayload[field];
        }
      });

      //Replaces the payload for better code reading
      payload = newPayload;
      //Creating course in backend
      axios
        .post("/create-classroom", payload, { headers: headers })
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
                  subject_id: response.data.subject_id,
                  id: response.data.id,
                  active: payload.length > 4 ? true : false
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
          console.log(error.response);

          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};

export const updateClassroom = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart("update", currentState.classrooms.classrooms));

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
          [fields]: payload[fields] === "no-touch" ? null : payload[fields]
        };
      });

      // if no missing fields exists this replaces the missing fields object
      if (noMissingFields.length === 6) {
        extractMissingFields = { noMissingFields: true };
      }
      //deletes null fields in object
      Object.keys(newPayload).forEach(field => {
        if (newPayload[field] == null) {
          delete newPayload[field];
        }
      });

      //Replaces the payload for better code reading
      payload = newPayload;

      //Updates course in backend
      axios
        .post("/update-classroom", payload, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            dispatch(
              classroomUpdateSuccess(
                extractMissingFields,
                currentState.classrooms.classrooms
              )
            );
          } else {
            const unknownError = {
              code: "create-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(
              classroomFail(
                unknownError,
                currentState.classrooms.classroom,
                currentState.classrooms.classrooms
              )
            );
          }
        })
        .catch(error => {
          console.log(error.response);

          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
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
        .post("/assign-classroom", payload, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            dispatch(classroomSuccess());
          } else {
            const unknownError = {
              code: "add-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(classroomFail(unknownError));
          }
        })
        .catch(error => {
          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};

export const getAllMyClassrooms = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart(currentState.classrooms.action));

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

      const url = `/all-classroom?type=${payload.role}&user_id=${payload.uid}&page=${payload.page}`;
      axios
        .get(url, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            let loading = false;
            if (currentState.classrooms.action === "create") {
              loading = true;
            }
            dispatch(getAllClassroomSuccess(response.data.classrooms, loading));
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

          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};

export const getOneClassroom = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const currentState = getState();
    dispatch(classroomStart());

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

      const url = `/classroom/${payload.id.replace(":", "")}`;
      axios
        .get(url, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            dispatch(
              getClassroomSuccess(
                response.data.classroom,
                currentState.classrooms.classrooms,
                currentState.classrooms.updateSuccess
              )
            );
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

          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};

export const manageClassroomStudents = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const currentState = getState();
    dispatch(classroomStart());

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

      const studentNameRemover = studentArray => {
        let newStudentArray = [];
        studentArray.forEach(student => newStudentArray.push(student.id));
        return newStudentArray;
      };

      payload = {
        id: payload.id,
        active_students: studentNameRemover(payload.active_students),
        pending_students: studentNameRemover(payload.pending_students),
        deleted_students: studentNameRemover(payload.deleted_students)
      };

      axios
        .post("student-manager", payload, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            dispatch(classroomManageStudentsSuccess());
          } else {
            const unknownError = {
              code: "add-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(
              classroomFail(
                unknownError,
                currentState.classrooms.classroom,
                currentState.classrooms.classrooms
              )
            );
          }
        })
        .catch(error => {
          console.log(error.response);
          dispatch(
            classroomFail(
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data,
              currentState.classrooms.classroom,
              currentState.classrooms.classrooms
            )
          );
        });
    }
  };
};

export const restoreClassroom = classroomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const currentState = getState();
    dispatch(classroomStart("restore", currentState.classrooms.classrooms));

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

      axios
        .put("/restore", { id: classroomId }, { headers: headers })
        .then(response => {
          console.log("res", response);
          dispatch(restoreClassroomSuccess());
        })
        .catch(error => {
          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};

export const deleteClassroom = classroomId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const currentState = getState();
    dispatch(classroomStart("delete", currentState.classrooms.classrooms));

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

      const url = `/delete-classroom/${classroomId}/${currentState.firebase.profile.role}`;
      axios
        .delete(url, { headers: headers })
        .then(() => {
          dispatch(deleteClassroomSuccess());
        })
        .catch(error => {
          console.log(error.response);
          if (error.response == null) {
            error = { message: "Server Error, contact support" };
          } else {
            error =
              error.response.data.error != null
                ? error.response.data.error
                : error.response.data;
          }

          dispatch(classroomFail(error));
        });
    }
  };
};
