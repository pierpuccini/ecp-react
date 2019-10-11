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

export const phoneLoginSuccess = (newUser) => {
  return {
    type: actionTypes.PHONE_LOGIN_SUCCESS,
    newUser: newUser
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

export const authSuccess = (newUser) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    newUser: newUser
  };
};

export const authFail = error => {
  let customErrorMsg = null;
  error.code.includes("user-not-found")
    ? (customErrorMsg = "There is no user corresponding to this Email")
    : error.code.includes("wrong-password")
    ? (customErrorMsg = "The Email or Password is incorrect")
    : error.code.includes("new-user") ?
     (customErrorMsg = "Please Sign Up")
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

export const logout = (cleanErrors, cleanNewUser, errors, newUser) => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    cleanErrors: cleanErrors,
    cleanNewUser: cleanNewUser,
    errors: errors,
    newUser: newUser
  };
};
/* TODO: PROPERLY IMPLEMENT PHONE NUMBER */
export const signUp = (data, typeOfLogin) => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(signUpStart());
    const firebase = getFirebase();
    firebase.auth().useDeviceLanguage();
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
    switch (typeOfLogin) {
      case "google":
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            console.log('pier user cred',result);
            if (result.additionalUserInfo.isNewUser) {
              const error = {
                code: "new-user",
                message: "Please Sign Up"
              }
              dispatch(authSuccess(result.additionalUserInfo.isNewUser));
              dispatch(authFail(error));
              firebase
              .auth()
              .signOut()
              .then(() => {
                dispatch(logout(false, false, error, result.additionalUserInfo.isNewUser ));
              });
            } else {
              dispatch(authSuccess(result.additionalUserInfo.isNewUser));
            }
          })
          .catch(err => {
            console.log('google error',err);
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
            .then((result) => {
              console.log('pier user cred',result);
              if (result.additionalUserInfo.isNewUser) {
                const error = {
                  code: "new-user",
                  message: "Please Sign Up"
                }
                dispatch(phoneLoginSuccess(result.additionalUserInfo.isNewUser));
                dispatch(phoneLoginFail(error));
                firebase
                .auth()
                .signOut()
                .then(() => {
                  dispatch(logout(false, false, error, result.additionalUserInfo.isNewUser ));
                });
              } else {
                dispatch(phoneLoginSuccess(result.additionalUserInfo.isNewUser));
              }
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
    let errors = getState().auth.error;
    let newUser = getState().auth.newUser;
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(logout(true, true, errors, newUser));
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
