import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const onboardingStart = () => {
  return {
    type: actionTypes.ONBOARDING_START
  };
};

export const onboardingFailed = err => {
  return {
    type: actionTypes.ONBOARDING_FAILED,
    error: err
  };
};

export const onboardingSuccess = () => {
  return {
    type: actionTypes.ONBOARDING_SUCCESS
  };
};

export const onboardingReset = () => {
  return {
    type: actionTypes.ONBOARDING_RESET
  };
};

export const checkOnboarding = data => {
  return (dispatch, getState, { getFirestore }) => {
    dispatch(onboardingStart());
    const firestore = getFirestore();
    const currentState = getState();
    //TODO: add student internal code for clients

    // Payload to sent to backend
    const payload = {
      student_id: currentState.firebase.auth.uid,
      code_classroom: data.linkCode
    };

    let error;
    // Verifies that the token was properly recieved
    if (currentState.auth.token.type === "error") {
      error = {
        code: "token-error",
        message: `${currentState.auth.token.message} for user, please refresh the page`
      };
      dispatch(onboardingFailed(error));
    } /* If token is all good proceed to sending information to API */ else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentState.auth.token.token}`
      };

      //TODO: add student ID field
      axios
        .post("/assignclassroom", payload, { headers: headers })
        .then(response => {
          if (response.status === 200) {
            firestore
              .collection("users")
              .doc(currentState.firebase.auth.uid)
              .set(
                {
                  institutions: [data.institution],
                  classrooms: [
                    {
                      code_classroom: data.linkCode,
                      subject_id: response.data.classroomId
                    }
                  ],
                  studentId: "43214321",
                  role: "student"
                },
                { merge: true }
              )
              .then(() => {
                dispatch(onboardingSuccess());
                setTimeout(() => {
                  dispatch(onboardingReset());
                }, 250);
              })
              .catch(err => {
                dispatch(onboardingFailed(err));
              });
          } else {
            const unknownError = {
              code: "add-classroom-error",
              message: "Unkown error, Contact support"
            };
            dispatch(onboardingFailed(unknownError));
          }
        })
        .catch(error => {
          dispatch(onboardingFailed(error.response.data));
        });
    }
  };
};
