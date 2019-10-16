import * as actionTypes from "./actionTypes";

export const phoneAuthStart = (phoneAuthStarted, verifingSMS) => {
  return {
    type: actionTypes.PHONE_AUTH_START,
    verifingSMS: verifingSMS,
    phoneAuthStarted: phoneAuthStarted
  };
};

export const phoneAuthSmsSent = (captcha, confirmationResult) => {
  return {
    type: actionTypes.PHONE_AUTH_SMS_SENT,
    verifier: captcha,
    confirmation: confirmationResult
  };
};

export const phoneAuthSuccess = (newUser, phoneAuthStarted, verifingSMS, loading, phoneLoginDone) => {
  return {
    type: actionTypes.PHONE_AUTH_SUCCESS,
    newUser: newUser,
    phoneAuthStarted: phoneAuthStarted,
    verifingSMS: verifingSMS,
    loading: loading,
    phoneLoginDone: phoneLoginDone
  };
};

export const phoneAuthFail = (error, newUser, loading) => {
  let customErrorMsg = error.message;
  return {
    type: actionTypes.PHONE_AUTH_FAIL,
    error: { ...error, customErrorMsg },
    newUser : newUser,
    loading: loading
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (newUser, loading) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    newUser: newUser,
    loading: loading
  };
};

export const authFail = (error, loading) => {
  let customErrorMsg = null;
  error.code.includes("user-not-found")
    ? (customErrorMsg = "There is no user corresponding to this Email")
    : error.code.includes("wrong-password")
    ? (customErrorMsg = "The Email or Password is incorrect")
    : error.code.includes("new-user")
    ? (customErrorMsg = "Please Sign Up")
    : (customErrorMsg = "General Error, Contact Support");
  return {
    type: actionTypes.AUTH_FAIL,
    error: { ...error, customErrorMsg },
    loading: loading
  };
};

export const signUpStart = (isGoogleSignUp) => {
  return {
    type: actionTypes.SIGN_UP_START,
    isGoogleSignUp: isGoogleSignUp
  };
};

export const signUpSuccess = (isGoogleSignUp, googleSignUpInfo, savedGoogleInfo) => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS,
    googleSignUpInfo: googleSignUpInfo,
    isGoogleSignUp: isGoogleSignUp,
    savedGoogleInfo: savedGoogleInfo
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

export const logout = (cleanErrors, cleanNewUser, errors, newUser, loading, createPhoneUser) => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    cleanErrors: cleanErrors,
    cleanNewUser: cleanNewUser,
    errors: errors,
    newUser: newUser,
    loading: loading,
    createPhoneUser: createPhoneUser
  };
};

export const deleteNewUser = (cleanErrors, cleanNewUser, errors, newUser, loading, createPhoneUser) => {
  return {
    type: actionTypes.DELETE_NEW_USER,
    cleanErrors: cleanErrors,
    cleanNewUser: cleanNewUser,
    errors: errors,
    newUser: newUser,
    loading: loading,
    createPhoneUser: createPhoneUser
  };
};

export const signUp = (data, typeOfSignUp) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {

    const firebase = getFirebase();
    const firestore = getFirestore();
    firebase.auth().useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();

    switch (typeOfSignUp) {
      case "google":
        let isGoogleSignUp = true;
        dispatch(signUpStart(isGoogleSignUp));
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            let {name, email} = {...result.additionalUserInfo.profile}
            let googleInfo = {
              fullName: name,
              email: email
            }
            dispatch(signUpSuccess(isGoogleSignUp, googleInfo));
            /* Since its a a sign up and we must add thephone number this prevents the page from staying loged in */
            setTimeout(() => {
              let savedGoogleInfo = true
              dispatch(signUpSuccess(isGoogleSignUp, googleInfo, savedGoogleInfo));
            }, 500);
          })
          .catch(err => {
            dispatch(signUpFail(err));
          });
        break;

        case "phoneNumber":
        dispatch(signUpStart(getState().auth.isGoogleSignUp));
        /* Setting variables */
        let phoneSignUpStarted = false;

        phoneSignUpStarted = true;
        dispatch(phoneAuthStart(phoneSignUpStarted));
        /* Initialize captcha */
        let appVerifier = (window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "sign-up-phone",
          { size: "invisible" }
        ));
        /* Sends SMS */
        firebase.auth().signInWithPhoneNumber(`+57${data.phoneNumber}`, appVerifier)
          .then(confirmationResult => {
            dispatch(phoneAuthSmsSent(appVerifier, confirmationResult));
          })
          .catch(err => {
            appVerifier = null;
            dispatch(phoneAuthFail(err));
          });        
        break;

      default:
        dispatch(signUpStart(getState().auth.isGoogleSignUp));
        /* Informes that user sign up will begin */
        if (getState().auth.isGoogleSignUp) {
          /* If google sign up then there is no email user creation */
          
          let phoneSignUpStarted = false;
          let verifingSMS = true;
          let verificationId = null;
          let credential = null;
          /* Redispatches phone start as this one will be adding the phone to exisiting profile */
          dispatch(phoneAuthStart(phoneSignUpStarted, verifingSMS));

          /* Gets from store what the sms sender returns in order to verify the sms */
          verificationId = getState().auth.confirmCode.verificationId;
          credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            data.verif
          );
          /* updates phone number for created profile */
          const user = firebase.auth().currentUser;
          user.updatePhoneNumber(credential);
          /* param inside signUpSuccess is isGoogleSignUp */
          dispatch(signUpSuccess(false));
        } else {
          firebase.auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then((result) => {
              const user = firebase.auth().currentUser;
              user
                .updateProfile({ displayName: data.fullName })
                .then(() => {
                  let phoneSignUpStarted = false;
                  let verifingSMS = true;
                  let verificationId = null;
                  let credential = null;
                  /* Redispatches phone start as this one will be adding the phone to exisiting profile */
                  dispatch(phoneAuthStart(phoneSignUpStarted, verifingSMS));

                  /* Gets from store what the sms sender returns in order to verify the sms */
                  verificationId = getState().auth.confirmCode.verificationId;
                  credential = firebase.auth.PhoneAuthProvider.credential(
                    verificationId,
                    data.verif
                  );
                  /* updates phone number for created profile */
                  user.updatePhoneNumber(credential);
                  console.log('can view result', result);
                  dispatch(signUpSuccess(false));
                  return firestore.collection('users').doc(result.user.uid).set({
                    email: data.email
                  })

                })
                .catch(err => {
                  dispatch(signUpFail(err));
                });
            })
            .catch(err => {
              dispatch(signUpFail(err));
            });
        }
        break;
    }
  };
};

export const auth = (data, typeOfLogin) => {
  return (dispatch, getState, { getFirebase }) => {
    /* Starting Login */
    dispatch(authStart());

    /* Setting variables */
    let newUser = false;
    let error = {} 
    let loading = false;
    let cleanErrors = false
    let cleanNewUser = false; 
    let phoneAuthStarted = false;
    let verifingSMS = true;
    let verificationId = null;
    let credential = null;

    /* Getting firebase and redux ready for login */
    const firebase = getFirebase();
    firebase.auth().useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();

    /* Detects what login was clicked */ 
    switch (typeOfLogin) {
      case "google":
        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            /* Detects if a user is new or not */
            if (result.additionalUserInfo.isNewUser) {
              /* Sets the necesary variables to dispatch */
              error = {
                code: "new-user",
                message: "Please Sign Up"
              };
              newUser = result.additionalUserInfo.isNewUser;
              loading = true;

              /* Dispatches actions for new user */
              dispatch(authSuccess(newUser, loading));
              dispatch(authFail(error, loading));

              /* Since its a new user, prevents login and redirects to sign up and deletes from DB*/
              const user = firebase.auth().currentUser;
              user.delete().then(() => {
                  cleanErrors = false;
                  cleanNewUser = false;
                  newUser = result.additionalUserInfo.isNewUser;
                  loading = false;
                  dispatch(deleteNewUser(cleanErrors, cleanNewUser, error, newUser, loading));
                });
            } else {
              newUser = result.additionalUserInfo.isNewUse;
              loading = false;
              dispatch(authSuccess(newUser, loading));
            }
          })
          .catch(err => {
            /* Dispatches any google errors */
            dispatch(authFail(err));
          });
        break;
        
      case "phoneNumber":
        /* First detects if the sms was sent or not */
        if (!getState().auth.smsSent) {
          /* If the sms was not sent we dispatch the login start for phone */
          phoneAuthStarted = true;
          dispatch(phoneAuthStart(phoneAuthStarted));
          /* Initialize captcha */
          let appVerifier = (window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "sign-in-phone",
            { size: "invisible" }
          ));
          /* Sends SMS */
          firebase.auth().signInWithPhoneNumber(`+57${data.phoneNumber}`, appVerifier)
            .then(confirmationResult => {
              dispatch(phoneAuthSmsSent(appVerifier, confirmationResult));
            })
            .catch(err => {
              appVerifier = null;
              dispatch(phoneAuthFail(err));
            });
        } else {
          /* Redispatches phone start as this one will be login us in */
          dispatch(phoneAuthStart(phoneAuthStarted, verifingSMS));

          /* Gets from store what the sms sender returns in order to verify the sms */
          verificationId = getState().auth.confirmCode.verificationId
          credential = firebase.auth.PhoneAuthProvider.credential(verificationId, data.verif);

          /* Logs us into app */
          firebase.auth().signInWithCredential(credential)
            .then((result) => {
              /* Checks if the user is new */
              if (result.additionalUserInfo.isNewUser) {
                /* Since user is new, sets up necessary variables */
                error = {
                  code: "new-user",
                  message: "Please Sign Up"
                }
                newUser = result.additionalUserInfo.isNewUser;
                verifingSMS = false;
                loading = true;

                /* Dispatches previous variables */
                dispatch(phoneAuthSuccess(newUser, phoneAuthStarted, verifingSMS, loading));
                dispatch(phoneAuthFail(error, newUser, loading));

                /* Since its a new user, prevents login and redirects to sign up and deletes from DB*/
                const user = firebase.auth().currentUser;
                user.delete().then(() => {
                  let cleanErrors = false;
                  let cleanNewUser = false;
                  newUser = result.additionalUserInfo.isNewUser;
                  loading = false;
                  let createPhoneUser = {
                    url: 'phoneloginfailed=true',
                    message: 'Please Sign Up',
                    error: true
                  }
                  dispatch(logout(cleanErrors, cleanNewUser, error, newUser, loading, createPhoneUser ));
                });
              } else {
                /* since user is not new, accepts login */
                newUser = result.additionalUserInfo.isNewUser;
                phoneAuthStarted = false;
                verifingSMS = false;
                loading = false;
                let phoneLoginDone = true;
                dispatch(phoneAuthSuccess(newUser, phoneAuthStarted, verifingSMS, loading, phoneLoginDone));
              }
            })
            .catch(err => {
              dispatch(phoneAuthFail(err));
            });
        }
        break;

      case "forgotEmail":
        firebase.auth().sendPasswordResetEmail(data.email)
          .then(() => {
            dispatch(passwordResetSuccess());
          })
          .catch(err => {
            dispatch(passwordResetFail(err));
          });
        break;
      default:
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
          .then(() => {
            dispatch(authSuccess());
          })
          .catch(err => {
            setTimeout(() => {
              dispatch(authFail(err));
            }, 1500);
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
    const cleanErrors = true;
    const cleanNewUser = true;
    firebase.auth().signOut()
      .then(() => {
        dispatch(logout(cleanErrors, cleanNewUser, errors, newUser));
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
