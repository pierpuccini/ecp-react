import * as actionTypes from "./actionTypes";
import axios from "../../axios/axios";

export const userUpdateStart = () => {
  return {
    type: actionTypes.USER_UPDATE_STARTED
  };
};

export const userUpdateFailed = (err, successfullChanges, persistentErr) => {
  return {
    type: actionTypes.USER_UPDATE_FAILED,
    error: err,
    successfullChanges: successfullChanges,
    persistentErr: persistentErr
  };
};

export const userUpdateSuccess = successfullChanges => {
  return {
    type: actionTypes.USER_UPDATE_SUCCESS,
    successfullChanges: successfullChanges
  };
};

export const userResetErrors = () => {
  return {
    type: actionTypes.USER_RESET_ERRORS
  };
};

export const updateUser = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();
    const currentState = getState();

    const user = firebase.auth().currentUser;
    let { toUpdate, data } = payload;
    let successfullChanges = currentState.users.successfullChanges;

    if (toUpdate.length === 0) {
      dispatch(
        userUpdateFailed(
          {
            code: "no-change-made",
            message: "In order to save anything please make a change."
          },
          {
            displayName: "no-change",
            institution: "no-change",
            studentId: "no-change",
            email: "no-change",
            password: "no-change"
          }
        )
      );
    }
    if (toUpdate.includes("email") && toUpdate.includes("password")) {
      //Removed duplicates
      toUpdate = [...new Set(toUpdate)];
      let passwordIndex = toUpdate.findIndex(item => item === "password");
      toUpdate.splice(passwordIndex);

      let emailIndex = toUpdate.findIndex(item => item === "email");
      toUpdate.splice(emailIndex);
      const persistentErr = {
        code: "password-provider-only",
        message:
          "Error! can only change password or email, not both at the same time."
      };
      const successfullChanges = {
        displayName: "no-change",
        institution: "no-change",
        studentId: "no-change",
        email: "no-change",
        password: "no-change"
      };
      dispatch(
        userUpdateFailed(persistentErr, successfullChanges, persistentErr)
      );
    }
    if (toUpdate.includes("email") || toUpdate.includes("password")) {
      if (toUpdate.includes("email")) {
        user
          .updateEmail(data.email)
          .then(() => {
            firestore
              .collection("users")
              .doc(user.uid)
              .set({ email: data.email }, { merge: true });
            let emailIndex = toUpdate.findIndex(item => item === "email");
            toUpdate.splice(emailIndex);
            successfullChanges = { ...successfullChanges, email: true };
            dispatch(userUpdateSuccess(successfullChanges));
          })
          .catch(error => {
            successfullChanges = { ...successfullChanges, email: false };
            dispatch(userUpdateFailed(error, successfullChanges));
          });
      } /* Incharge for updating password */ else {
        user
          .updatePassword(data.password)
          .then(() => {
            //The set flattens the array and removes al duplicates
            toUpdate = [...new Set(toUpdate)];
            let passwordIndex = toUpdate.findIndex(item => item === "password");
            toUpdate.splice(passwordIndex);
            successfullChanges = { ...successfullChanges, password: true };
            dispatch(userUpdateSuccess(successfullChanges));
            toUpdate.forEach(fieldToUpdate => {
              firestore
                .collection("users")
                .doc(user.uid)
                .set({ [fieldToUpdate]: data[fieldToUpdate] }, { merge: true })
                .then(() => {
                  successfullChanges = {
                    ...successfullChanges,
                    [fieldToUpdate]: true
                  };
                  dispatch(userUpdateSuccess(successfullChanges));
                })
                .catch(error => {
                  successfullChanges = {
                    ...successfullChanges,
                    [fieldToUpdate]: false
                  };
                  dispatch(userUpdateFailed(error, successfullChanges));
                });
            });
          })
          .catch(error => {
            successfullChanges = { ...successfullChanges, password: false };
            dispatch(userUpdateFailed(error, successfullChanges));
          });
      }
    }
    if (toUpdate.includes("institution")) {
      let institutions = [...currentState.firebase.profile.institutions];
      console.log("institutions", institutions);
      console.log("data", data);
      /* TODO: Remove this condition when implementing multiple institutions per teacher */
      if (institutions.length <= 1) {
        institutions.pop();
      }
      institutions.push(data.institution);

      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then(() => {
          firestore
            .collection("users")
            .doc(currentState.firebase.auth.uid)
            .set(
              {
                institutions: institutions
              },
              { merge: true }
            )
            .then(() => {
              successfullChanges = { ...successfullChanges, institution: true };
              dispatch(userUpdateSuccess(successfullChanges));
            })
            .catch(error => {
              successfullChanges = {
                ...successfullChanges,
                institution: false
              };
              dispatch(userUpdateFailed(error, successfullChanges));
            });
        });
    } else {
      toUpdate.forEach(fieldToUpdate => {
        firestore
          .collection("users")
          .doc(user.uid)
          .set({ [fieldToUpdate]: data[fieldToUpdate] }, { merge: true })
          .then(() => {
            successfullChanges = {
              ...successfullChanges,
              [fieldToUpdate]: true
            };
            dispatch(userUpdateSuccess(successfullChanges));
          })
          .catch(error => {
            successfullChanges = {
              ...successfullChanges,
              [fieldToUpdate]: false
            };
            dispatch(userUpdateFailed(error, successfullChanges));
          });
      });
    }
  };
};

export const linkUser = (provider, payload) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    if (provider === "google") {
      const fbProvider = new firebase.auth.GoogleAuthProvider();
      user
        .linkWithPopup(fbProvider)
        .then(function(result) {
          firestore
            .collection("users")
            .doc(result.user.uid)
            .set(
              {
                email: result.user.email,
                googleLink: true
              },
              { merge: true }
            );
          dispatch(userUpdateSuccess());
        })
        .catch(function(error) {
          dispatch(userUpdateFailed(error));
        });
    } else {
      const credential = firebase.auth.EmailAuthProvider.credential(
        payload.data.email,
        payload.data.password
      );
      user
        .linkWithCredential(credential)
        .then(usercred => {
          const user = usercred.user;
          firestore
            .collection("users")
            .doc(user.uid)
            .set({ email: payload.data.email }, { merge: true });
          dispatch(userUpdateSuccess());
        })
        .catch(error => {
          dispatch(userUpdateFailed(error));
        });
    }
  };
};

export const unlinkUser = provider => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();

    if (provider === "google") {
      const user = firebase.auth().currentUser;

      user
        .unlink("google.com")
        .then(function(result) {
          firestore
            .collection("users")
            .doc(result.uid)
            .set(
              {
                googleLink: false
              },
              { merge: true }
            );
          dispatch(userUpdateSuccess());
        })
        .catch(function(error) {
          dispatch(userUpdateFailed(error));
        });
    }
  };
};

export const resetUserErrors = () => {
  return dispatch => {
    dispatch(userResetErrors());
  };
};

/* Admin options */

//Handles user in custom backend such as delete and deactivate
export const userManagerAuthActions = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    console.log("payload", payload);
    const firestore = getFirestore();
    const currentState = getState();

    let error;
    // Verifies that the token was properly recieved
    if (currentState.auth.token.type === "error") {
      error = {
        code: "token-error",
        message: `${currentState.auth.token.message} for user, please refresh the page`
      };
      dispatch(userUpdateFailed(error));
    } /* If token is all good proceed to sending information to API */ else {
      //Creates headers
      const headers = {
        Authorization: `Bearer ${currentState.auth.token.token}`
      };
      if (payload.action === "disbaled") {
        axios
          .get(`/manageuser?action=${payload.action}&uid=${payload.userId}`, {
            headers: headers
          })
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.log(error.response.data);
            dispatch(userUpdateFailed(error.response.data));
          });
      } else if (payload.action === "delete") {
        axios
          .get(`/manageuser?action=${payload.action}&uid=${payload.userId}`, {
            headers: headers
          })
          .then(res => {
            console.log(res);
            //deletes user from firestore
            firestore
              .collection("users")
              .doc(payload.userId)
              .delete()
              .then(res => {
                console.log("res", res);
              })
              .catch(error => {
                console.log(error.response.data);
                dispatch(userUpdateFailed(error.response.data));
              });
          })
          .catch(error => {
            console.log(error.response.data);
            dispatch(userUpdateFailed(error.response.data));
          });
      }
    }
  };
};

//Handles user in firestore
export const userManager = payload => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firestore = getFirestore();
    const currentState = getState();

    //Gets user id from payload
    const userId = payload.userId;
    //Gets admin By from payload
    const adminBy = payload.adminBy;

    /* Converts they payload to an array */
    // disabeling lint because if block normal array function return
    let payloadArr = Object.keys(payload).map(field => {
      if (field === "userId") {
        // eslint-disable-next-line
        return;
      } else if (field === "adminBy") {
        // eslint-disable-next-line
        return;
      } else {
        return {
          [field]: payload[field]
        };
      }
    });

    /* Removes the null asociated with the payload */
    payloadArr = payloadArr.filter(el => {
      return el != null;
    });

    /* Since user fields may change this code will future proof that */
    let noTouchArr = [];
    payloadArr.forEach(field => {
      if (Object.values(field)[0] === "no-touch") {
        noTouchArr = [...noTouchArr, Object.keys(field)[0]];
      }
    });
    /* Dispatches error if no fields have been changed */
    if (noTouchArr.length === payloadArr.length) {
      dispatch(
        userUpdateFailed(
          {
            code: "no-change-made",
            message: "In order to save anything please make a change."
          },
          {
            role: "no-change",
            institution: "no-change"
          }
        )
      );
    } else {
      delete payload.userId;
      if (payload.adminBy != null) {
        delete payload.adminBy;
      }
      noTouchArr.forEach(field => {
        delete payload[field];
      });

      //Creates payload for user to adminCreate
      if (adminBy === "get-user") {
        payload.adminBy = {
          id: currentState.firebase.auth.uid,
          displayName: currentState.firebase.profile.displayName,
          email: currentState.firebase.profile.email
        };
      }

      // maps institutions as named in DB
      //TODO: must implement a get from state when implementing more than 1 institution per teacher
      if (payload.institution) {
        payload.institutions = [payload.institution];
        delete payload.institution;
      }
      firestore
        .collection("users")
        .doc(userId)
        .set(payload, { merge: true })
        .then(() => {
          dispatch(userUpdateSuccess());
        })
        .catch(error => {
          dispatch(userUpdateFailed(error));
        });
    }
  };
};
