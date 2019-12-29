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
    userDisabled,
    //Errors
    onboardingError,
    usersError,
    classroomError,
    powerupsError,
    //Success
    myAccountSuccess,
    onboardingSuccess,
    deleteSuccess,
    powerupsSuccess,
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
    if (powerupsError) {
      payload = { type: "error", info: powerupsError };
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
    if (powerupsSuccess) {
      payload = {
        type: "success",
        info: { message: "Powerup succesfully created or modified!" },
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
    powerupsError,
    //Succes
    myAccountSuccess,
    onboardingSuccess,
    userDisabled,
    deleteSuccess,
    restoreSuccess,
    powerupsSuccess
  ]);

  return <Snackbar payload={snackbarPayload} />;
};

const mapStateToProps = state => {
  return {
    //Error messages
    onboardingError: state.onboarding.error,
    usersError: state.users.error,
    classroomError: state.classrooms.error,
    powerupsError: state.powerups.error,
    //Warning messages
    userDisabled: state.users.warning,
    //Success messages
    onboardingSuccess: state.onboarding.showSuccess,
    myAccountSuccess: state.users.success,
    powerupsSuccess: state.powerups.success,
    deleteSuccess: state.classrooms.deleteSuccess,
    restoreSuccess: state.classrooms.restoreSuccess
  };
};

export default connect(mapStateToProps)(SnackbarLogic);
