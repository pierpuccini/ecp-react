import * as actionTypes from "./actionTypes";

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
        userUpdateFailed({
          code: "no-change-made",
          message: "In Order to save anything please make a change."
        })
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

      dispatch(userUpdateFailed(null, null, persistentErr));
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
          })
          .catch(error => {
            successfullChanges = { ...successfullChanges, password: false };
            dispatch(userUpdateFailed(error, successfullChanges));
          });
      }
    }
    toUpdate.forEach(fieldToUpdate => {
      console.log('fieldToUpdate',fieldToUpdate);
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
          console.log("error", error);
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
          console.log("Account linking error", error);
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
          console.log("error", error);
          dispatch(userUpdateFailed(error));
        });
    }
  };
};
