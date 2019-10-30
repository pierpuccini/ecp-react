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

export const updateUser = (payload) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();

    const user = firebase.auth().currentUser;
    console.log('user',user);
    let {toUpdate, data} = payload
    if (toUpdate.length === 0) {
      dispatch(
        userUpdateFailed({code: "no change made",message: "Please make a change or disregard."})
      );
    } else if(toUpdate.includes('email') && toUpdate.includes('password')){
      const credential = firebase.auth.EmailAuthProvider.credential(data.email, data.password);
      user
        .linkWithCredential(credential)
        .then(usercred => {
          const user = usercred.user;
          firestore
            .collection("users")
            .doc(user.uid)
            .set({ email: data.email }, { merge: true });
          dispatch(userUpdateSuccess());
        })
        .catch(error => {
          console.log("Account linking error", error);
          dispatch(userUpdateFailed(error));
        });
    }else {
      firestore
        .collection("users")
        .doc(user.uid)
        .set(
          data,
          { merge: true }
        );
      dispatch(userUpdateSuccess());
    }
  };
};

export const linkUser = provider => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(userUpdateStart());
    const firebase = getFirebase();
    const firestore = getFirestore();

    if (provider === "google") {
      const fbProvider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .currentUser.linkWithPopup(fbProvider)
        .then(function(result) {
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
        })
        .catch(function(error) {
          console.log('error',error);
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

      user.unlink('google.com')
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
          console.log('error',error);
          dispatch(userUpdateFailed(error));
        });
    }
  };
};
