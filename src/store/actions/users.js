import * as actionTypes from "./actionTypes";

export const userUpdateStart = () => {
  return {
    type: actionTypes.USER_UPDATE_STARTED
  };
};

export const userUpdateFailed = err => {
  return {
    type: actionTypes.USER_UPDATE_FAILED,
    error: err
  };
};

export const userUpdateSuccess = () => {
  return {
    type: actionTypes.USER_UPDATE_SUCCESS
  };
};

export const updateUser = (currentUser, newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();
    const currentState = getState();

    const user = firebase.auth().currentUser;

  };
};

export const linkUser = provider => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();
    const currentState = getState();

    if(provider === "google"){
        const fbProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().currentUser.linkWithPopup(fbProvider).then(function(result) {
            console.log('result',result);
            firestore
              .collection("users")
              .doc(result.user.uid)
              .set(
                {
                  googleLink: true
                },
                { merge: true }
              );
            dispatch(userUpdateSuccess());
          }).catch(function(error) {
            dispatch(userUpdateFailed(error))
          });
    }

  };
};
