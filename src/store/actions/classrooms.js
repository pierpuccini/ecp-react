import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const classroomStart = (action, classrooms) => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_START,
    action: action,
    classrooms: classrooms
  };
};

export const classroomFail = error => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_FAILED,
    error: error
  };
};

export const classroomCreateSuccess = (missingFields, code) => {
  return {
    type: actionTypes.CLASSROOM_CREATE_SUCCESS,
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

export const getAllclassroomCreateSuccess = (classrooms, loading) => {
  return {
    type: actionTypes.CLASSROOM_GET_ALL_CLASSROOMS_SUCCESS,
    classrooms: classrooms,
    loading: loading
  };
};

export const getclassroomCreateSuccess = (classroom,classrooms,updateSuccess) => {
  return {
    type: actionTypes.CLASSROOM_GET_ONE_CLASSROOM_SUCCESS,
    classroom: classroom,
    classrooms: classrooms,
    updateSuccess: updateSuccess
  };
};

export const restoreclassroomCreateSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_RESTORE_SUCCESS
  };
};

export const deleteclassroomCreateSuccess = () => {
  return {
    type: actionTypes.CLASSROOM_DELETE_SUCCESS
  };
};

export const classroomSearchSuccess = classrooms => {
  return {
    type: actionTypes.CLASSROOM_SEARCH_SUCCESS,
    classrooms: classrooms
  };
};

export const studentGroupSuccess = (classrooms, classroom) => {
  return {
    type: actionTypes.CLASSROOM_STUDENT_GROUPS_CREATE,
    classrooms: classrooms,
    classroom: classroom
  };
};

export const resetCreateClassroom = () => {
  return {
    type: actionTypes.CLASSROOM_ACTIONS_CREATE_RESET
  };
};

/* ---------- Indexed fuctions ---------- */
export const createClassroom = payload => {
  return (dispatch, getState) => {
    dispatch(classroomStart("create"));
    const currentState = getState();

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
      .post("/create-classroom", payload)
      .then(response => {
        if (response.status === 200 && response.data.code_classroom !== null) {
          dispatch(
            classroomCreateSuccess(
              extractMissingFields,
              response.data.code_classroom
            )
          );
        } /* Usually this error occurrs due to Firestore */ else {
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
  };
};

export const updateClassroom = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart("update", currentState.classrooms.classrooms));

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
      .post("/update-classroom", payload)
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
  };
};

export const addClassroom = payload => {
  return (dispatch, getState) => {
    dispatch(classroomStart());
    const currentState = getState();

    payload = { ...payload, student_id: currentState.firebase.auth.uid };
    axios
      .post("/assign-classroom", payload)
      .then(response => {
        if (response.status === 200) {
          dispatch(classroomCreateSuccess());
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
  };
};

export const getAllMyClassrooms = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(
      classroomStart(
        currentState.classrooms.action,
        currentState.classrooms.classrooms
      )
    );

    let filter =
      payload.filter == null
        ? '{"status": "all", "time": "none"}'
        : JSON.stringify(payload.filter);

    const params = {
      type: payload.role,
      user_id: payload.uid,
      page: payload.page,
      filterString: filter
    };

    axios
      .get("/all-classroom", { params: params })
      .then(response => {
        if (response.status === 200) {
          let loading = false;
          if (currentState.classrooms.action === "create") {
            loading = true;
          }
          dispatch(
            getAllclassroomCreateSuccess(response.data.classrooms, loading)
          );
          if (currentState.classrooms.action === 'oneClassroom') {
            dispatch(
              getclassroomCreateSuccess(
                null,
                response.data.classrooms,
                true
              )
            );
          }
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
  };
};

export const getOneClassroom = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(
      classroomStart("oneClassroom", currentState.classrooms.classrooms)
    );

    const url = `/classroom/${payload.id.replace(":", "")}/${
      currentState.firebase.auth.uid
    }`;
    axios
      .get(url)
      .then(response => {
        if (response.status === 200) {
          console.log(currentState.classrooms.updateSuccess);
          dispatch(
            getclassroomCreateSuccess(
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
  };
};

export const manageClassroomStudents = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart());

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
      .post("student-manager", payload)
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
  };
};

export const restoreClassroom = classroomId => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart("restore", currentState.classrooms.classrooms));

    axios
      .put("/restore", { id: classroomId })
      .then(response => {
        console.log("res", response);
        dispatch(restoreclassroomCreateSuccess());
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
  };
};

export const deleteClassroom = classroomId => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart("delete", currentState.classrooms.classrooms));

    const url = `/delete-classroom/${classroomId}/${currentState.firebase.profile.role}`;
    axios
      .delete(url)
      .then(() => {
        dispatch(deleteclassroomCreateSuccess());
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
  };
};

export const searchClassroom = payload => {
  return (dispatch, getState) => {
    const currentState = getState();
    dispatch(classroomStart("search", currentState.classrooms.classrooms));

    console.log("payload", payload);
    /* This condition first searches to match local classroom
       if user prefers then it will find in whole db */
    if (payload.localSearch) {
      let newClassroom;
      let data = [...payload.classrooms.data];
      let resultArray = [];
      //Checks if input is type string
      if (isNaN(payload.value)) {
        //If string the only param for local search is name
        data.forEach(classroom => {
          if (classroom.subject_name.includes(payload.value)) {
            resultArray.push(classroom);
          }
        });
      } else {
        //If number the only param for local search is classroom ID
        data.forEach(classroom => {
          if (classroom.subject_id.toString().includes(payload.value)) {
            resultArray.push(classroom);
          }
        });
      }
      newClassroom = { ...payload.classrooms, data: resultArray };
      if (payload.value === "") {
        newClassroom = currentState.classrooms.classroomsCopy;
      }
      dispatch(classroomSearchSuccess(newClassroom));
    } else {
      let filter =
        payload.filter == null
          ? '{"status": "all", "time": "none"}'
          : JSON.stringify(payload.filter);

      const params = {
        type: payload.allClassroomsPayload.role,
        user_id: payload.allClassroomsPayload.uid,
        page: payload.allClassroomsPayload.page,
        filterString: filter,
        search: payload.value
      };

      console.log("params", params);
      axios
        .get("/all-classroom", { params: params })
        .then(response => {
          console.log("res", response);
          dispatch(classroomSearchSuccess(response.data.classrooms));
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

export const createStudentGroup = payload => {
  return (dispatch, getState) => {
    const currentState = getState()
    dispatch(classroomStart());

    console.log('payload',payload);
    axios
      .post("/create-group", payload)
      .then(response => {
        console.log("res", response);
        dispatch(studentGroupSuccess(currentState.classrooms.classrooms,currentState.classrooms.classroom));
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
  };
};

export const deleteStudentGroup = payload => {
  return (dispatch, getState) => {
    const currentState = getState()
    dispatch(classroomStart());

    axios
      .delete(`/delete-group/${payload}`, payload)
      .then(response => {
        console.log("res", response);
        dispatch(studentGroupSuccess(currentState.classrooms.classrooms,currentState.classrooms.classroom));
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
  };
};
