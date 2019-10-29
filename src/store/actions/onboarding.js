import * as actionTypes from "./actionTypes";

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
    /* TODO: Call backend API to verify if user exisist in class */
    // Payload to sent to backend
    const payload = {
      institution: data.institution,
      code: data.linkCode
    };
    setTimeout(() => {
      if (payload.code === "111222") {
        /* expected response */
        const res = {
          institution: payload.institution,
          classroom: 123123,
          studentId: 456456
        };
        /* expected response */
        let classrooms;
        firestore
          .collection("users")
          .doc(currentState.firebase.auth.uid)
          .get()
          .then(user => {
            classrooms = [...user.data().classrooms];
            classrooms.push(res.classroom);
            firestore
              .collection("users")
              .doc(currentState.firebase.auth.uid)
              .set({
                ...user.data(),
                institution: res.institution,
                classrooms: classrooms,
                studentId: res.studentId,
                role: "student"
              })
              .then(() => {
                dispatch(onboardingSuccess());                  
                setTimeout(() => {
                  dispatch(onboardingReset())
                }, 500)
              })
              .catch(err => {
                console.log("error: ", err);
                dispatch(onboardingFailed(err));
              });
          })
          .catch(err => {
            console.log("error: ", err);
            dispatch(onboardingFailed(err));
          });
      } else {
        /* Error if classroom code is incorrect */
        const error = {
          code: "wrong code",
          message: "Please provide the correct code"
        };
        dispatch(onboardingFailed(error));
      }
    }, 4213);
  };
};
