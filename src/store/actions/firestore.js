import * as actionTypes from "./actionTypes";

export const firestoreStart = () => {
    return {
        type: actionTypes.FIRESTORE_START
    }
};

export const firestoreGetUser = () => {
    return {
        type: actionTypes.LOAD_USER_FROM_FIRESTORE
    }
};

export const firestoreCreateUser = () => {
    return {
        type: actionTypes.FIRESTORE_SUCCESS
    }
};

export const firestoreSuccess = () => {
    return {
        type: actionTypes.FIRESTORE_SUCCESS
    }
};

export const firestoreInit = () => {
    return (dispatch) => {

    }
}

