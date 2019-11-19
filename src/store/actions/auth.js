import * as actionTypes from "./actionTypes";
import axios from '../../axios/axios'

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
  let newUser = error.code.includes("user-not-found") ? true : false;
  return {
    type: actionTypes.AUTH_FAIL,
    error: { ...error, customErrorMsg },
    loading: loading,
    newUserGoogleLogin: loading,
    newUser: newUser
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

export const logout = (cleanErrors, cleanNewUser, errors, newUser, loading) => {
  return {
    type: actionTypes.AUTH_LOGOUT,
    cleanErrors: cleanErrors,
    cleanNewUser: cleanNewUser,
    errors: errors,
    newUser: newUser,
    loading: loading
  };
};

export const deleteNewUser = (cleanErrors, cleanNewUser, errors, newUser, loading) => {
  return {
    type: actionTypes.DELETE_NEW_USER,
    cleanErrors: cleanErrors,
    cleanNewUser: cleanNewUser,
    errors: errors,
    newUser: newUser,
    loading: loading
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
        dispatch(signUpStart());
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(result => {
            /* Creates user doc in firestore */
            firestore
              .collection("users")
              .doc(result.user.uid)
              .set({
                displayName: result.user.displayName,
                studentId: "",
                institutions: [],
                classrooms: [],
                role: "",
                email: result.user.email,
                googleLink: true
              });
            dispatch(signUpSuccess(false));
          })
          .catch(err => {
            dispatch(signUpFail(err));
          });
        break;

      default:
        dispatch(signUpStart());
        firebase
          .createUser(
            { email: data.email, password: data.password },
            {
              displayName: data.fullName,
              studentId: "",
              institutions: [],
              classrooms: [],
              role: "",
              email: data.email
            }
          )
          .then(res => {
            dispatch(signUpSuccess(false));
          })
          .catch(err => {
            console.log("res", err);
            dispatch(signUpFail(err));
          });
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
    let error = {};
    let loading = false;
    let cleanErrors = false;
    let cleanNewUser = false;

    /* Getting firebase and redux ready for login */
    const firebase = getFirebase();
    firebase.auth().useDeviceLanguage();
    const provider = new firebase.auth.GoogleAuthProvider();

    /* Detects what login was clicked */

    switch (typeOfLogin) {
      case "google":
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(result => {
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
                dispatch(
                  deleteNewUser(
                    cleanErrors,
                    cleanNewUser,
                    error,
                    newUser,
                    loading
                  )
                );
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
      default:
        firebase
          .auth()
          .signInWithEmailAndPassword(data.email, data.password)
          .then(() => {
            dispatch(authSuccess());
          })
          .catch(err => {
            setTimeout(() => {
              dispatch(authFail(err));
            }, 750);
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
    firebase.logout();
    dispatch(logout(cleanErrors, cleanNewUser, errors, newUser));
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

export const sendIdToken = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
      // Send token to your backend via HTTPS
      // ...
      console.log('[success] idtoken: ', idToken);
      axios.post(`/`, {token: idToken})
      .then(resp =>{
        console.log('Token sent',resp)
      })
      .catch(err => {
        console.log('Token not sent',err)
      })
    }).catch((error) => {
      // Handle error
      console.error('[error] idtoken: ',error);
    });
  };
}
