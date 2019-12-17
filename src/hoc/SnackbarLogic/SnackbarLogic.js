/* React Imports */
import React, { useEffect } from "react";
/* Redux Imports */
import { connect } from "react-redux";
/* component Imports */
import Snackbar from "../../components/UI/Snackbar/Snackbar";

const SnackbarLogic = props => {
  const {
    //Props
    snackbarPayload,
    setsnackbarPayload,
    //Warninigs
    disabled,
    //Errors
    onboardingError,
    usersError,
    classroomError,
    //Success
    myAccountSuccess,
    onboardingSuccess,
    userDisabled,
    deleteSuccess,
    restoreSuccess
  } = props;

  //snackbar state handler
  useEffect(() => {
    let payload = snackbarPayload;
    //error handler
    if (usersError) {
      payload = { type: "error", info: usersError };
    }
    if (onboardingError) {
      payload = { type: "error", info: onboardingError };
    }
    if (usersError) {
      payload = { type: "error", info: usersError };
    }
    if (classroomError) {
      payload = { type: "error", info: classroomError };
    }
    //success handler
    if (myAccountSuccess) {
      payload = {
        type: "success",
        info: { message: "User succesfully updated!" }
      };
    }
    if (onboardingSuccess) {
      payload = {
        type: "success",
        info: { message: "Classroom succesfully added!" },
        duration: 10000
      };
    }
    if (deleteSuccess) {
      payload = {
        type: "success",
        info: { message: "Classroom succesfully deleted!" },
        duration: 10000
      };
    }
    if (restoreSuccess) {
      payload = {
        type: "success",
        info: { message: "Classroom succesfully restored!" },
        duration: 10000
      };
    }
    //warnings handler
    if (userDisabled) {
      payload = userDisabled;
    }
    // console.log("payload [app]", payload);
    setsnackbarPayload(payload);
    //missing dep: snackbarPayload
    // eslint-disable-next-line
  }, [
    //Warnings
    disabled,
    //Errors
    usersError,
    onboardingError,
    usersError,
    classroomError,
    //Succes
    myAccountSuccess,
    onboardingSuccess,
    userDisabled,
    deleteSuccess,
    restoreSuccess
  ]);

  return <Snackbar payload={snackbarPayload} />;
};

const mapStateToProps = state => {
  return {
    //Error messages
    onboardingError: state.onboarding.error,
    usersError: state.users.error,
    classroomError: state.classrooms.error,
    //Success messages
    onboardingSuccess: state.onboarding.showSuccess,
    myAccountSuccess: state.users.success,
    deleteSuccess: state.classrooms.deleteSuccess,
    restoreSuccess: state.classrooms.restoreSuccess
  };
};

export default connect(mapStateToProps)(SnackbarLogic);
