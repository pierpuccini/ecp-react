import * as actionTypes from "./actionTypes";

export const phoneLoginStart = () => {
  return {
    type: actionTypes.PHONE_LOGIN_START
  };
};

export const phoneLoginSmsSent = (captcha, confirmationResult) => {
  return {
    type: actionTypes.PHONE_LOGIN_SMS_SENT,
    verifier: captcha,
    confirmation: confirmationResult
  };
};

export const phoneLoginSuccess = () => {
  return {
    type: actionTypes.PHONE_LOGIN_SUCCESS
  };
};

export const phoneLoginFail = error => {
  let customErrorMsg = error.message;
  return {
    type: actionTypes.PHONE_LOGIN_FAIL,
    error: { ...error, customErrorMsg }
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = () => {
  return {
    type: actionTypes.AUTH_SUCCESS
  };
};

export const authFail = error => {
  let customErrorMsg = null;
  error.code.includes("user-not-found")
    ? (customErrorMsg = "There is no user corresponding to this Email")
    : error.code.includes("wrong-password")
    ? (customErrorMsg = "The Email or Password is incorrect")
    : (customErrorMsg = "General Error, Contact Support");
  return {
    type: actionTypes.AUTH_FAIL,
    error: { ...error, customErrorMsg }
  };
};

export const signUpStart = () => {
  return {
    type: actionTypes.SIGN_UP_START
  };
};

export const signUpSuccess = () => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS
  };
};

export const signUpFail = error => {
  let customErrorMsg = error.message;
  return {
    type: actionTypes.SIGN_UP_FAIL,
    error: { ...error, customErrorMsg }
  };
};

export const passwordResetSuccess = () => {
  return {
    type: actionTypes.PASSWORD_RESET_SUCCESS
  };
};

export const passwordResetFail = error => {
  let customErrorMsg = null;
  error.code.includes("user-not-found")
    ? (customErrorMsg = "There is no user corresponding to this Email")
    : error.code.includes("wrong-password")
    ? (customErrorMsg = "The Email or Password is incorrect")
    : (customErrorMsg = "General Error, Contact Support");
  return {
    type: actionTypes.PASSWORD_RESET_FAIL,
    error: { ...error, customErrorMsg }
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};
/* TODO: PROPERLY IMPLEMENT PHONE NUMBER */
export const signUp = (data, typeOfLogin) => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(signUpStart());
    const firebase = getFirebase();
    firebase.auth().useDeviceLanguage();
    console.log("firebase auth state", getState().firebase);
    const provider = new firebase.auth.GoogleAuthProvider();
    switch (typeOfLogin) {
      case "google":
        firebase
          .auth()
          .signInWithRedirect(provider)
          .then(() => {
            dispatch(authSuccess());
          })
          .catch(err => {
            dispatch(authFail(err));
          });
        break;
      default:
        firebase
          .auth()
          .createUserWithEmailAndPassword(data.email, data.password)
          .then(() => {
            const user = firebase.auth().currentUser;
            user
              .updateProfile({
                displayName: data.fullName
              })
              .then(() => {
                dispatch(signUpSuccess());
              })
              .catch(err => {
                dispatch(signUpFail(err));
              });
          })
          .catch(err => {
            dispatch(signUpFail(err));
          });
        break;
    }
  };
};

export const auth = (data, typeOfLogin) => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(authStart());
    const firebase = getFirebase();
    firebase.auth().useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log('pier typ of login', typeOfLogin)
    switch (typeOfLogin) {
      case "google":
        firebase
          .auth()
          .signInWithRedirect(provider)
          .then(() => {
            dispatch(authSuccess());
          })
          .catch(err => {
            dispatch(authFail(err));
          });
        break;
      case "forgotEmail":
        firebase
          .auth()
          .sendPasswordResetEmail(data.email)
          .then(() => {
            dispatch(passwordResetSuccess());
          })
          .catch(err => {
            dispatch(passwordResetFail(err));
          });
        break;
      case "phoneNumber":
        dispatch(phoneLoginStart());
        if (!getState().auth.smsSent) {
          let appVerifier = (window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "sign-in-phone",
            { size: "invisible" }
          ));
          console.log("pier phone", data.phoneNumber);
          firebase
            .auth()
            .signInWithPhoneNumber(`+57${data.phoneNumber}`, appVerifier)
            .then(confirmationResult => {
              dispatch(phoneLoginSmsSent(appVerifier, confirmationResult));
            })
            .catch(err => {
              appVerifier = null;
              dispatch(phoneLoginFail(err));
            });
        } else {
          let credential = firebase.auth.PhoneAuthProvider.credential(
            getState().auth.confirmCode.verificationId,
            data.verif
          );
          firebase.auth().signInWithCredential(credential)
            .then(() => {
              dispatch(phoneLoginSuccess());
            })
            .catch(err => {
              dispatch(phoneLoginFail(err));
            });
        }
        break;
      default:
        firebase
          .auth()
          .signInWithEmailAndPassword(data.email, data.password)
          .then(() => {
            dispatch(authSuccess());
          })
          .catch(err => {
            dispatch(authFail(err));
          });
        break;
    }
  };
};

export const authLogout = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(logout());
      });
  };
};

export const resetSuccess = () => {
  return {
    type: actionTypes.RESET_SUCCESS
  };
};

export const resetErrors = () => {
  return {
    type: actionTypes.RESET_ERRORS_ON_AUTH_LINK_CHANGE
  };
};
