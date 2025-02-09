/* React Imports */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* App imports */
import {
  updateObject,
  checkValidity,
  stateToPayload
} from "../../../shared/utility";
import ClassroomCreator from "../../../components/Classroom/Create/ClassroomCreator";
import FloatingLoader from "../../../components/UI/Loader/FloatingLoader/FloatingLoader";
import Modal from "../../../components/UI/Modal/Modal";
import CreatedClassroomModal from "../../../components/Classroom/Modals/CreatedClassroomModal";
import Loader from "../../../components/UI/Loader/PngLoader/PngLoader";

const CreateClassroom = props => {
  const {
    classrooms,
    myInstitutions,
    loading,
    createSuccess,
    missingFields,
    registrationCode,
    resetCreateClassroom,
    role
  } = props;

  /* Loads clients data from Firestore */
  useFirestoreConnect(() => [
    { collection: "clients", where: ["active", "==", true] }
  ]);
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

  /* TODO: Remove logic in future release for more than one institution per teacher */
  //Extracts institution id in case there is only one assinged to account
  let singleInstitution;
  if (myInstitutions.length === 0) {
    singleInstitution = "";
  } else if (myInstitutions.length <= 1) {
    singleInstitution = myInstitutions[0].id;
  }

  //Opens modal on create classroom success
  useEffect(() => {
    /* IF NEW CASE IS ADDED PLEASE REDO IN AN OTHER USE EFFECT */
    if (createSuccess) {
      handleModal(true);
    }
    /* IF NEW CASE IS ADDED PLEASE REDO IN AN OTHER USE EFFECT */
    // eslint-disable-next-line
  }, [createSuccess]);

  //Input form controlers
  const [createClassroomForm, setcreateClassroomForm] = useState({
    institutions: {
      value: singleInstitution,
      validation: {
        required: true
      },
      valid: true,
      touched: true
    },
    classCode: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    className: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    studentGroups: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    challengeTime: {
      value: 15,
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    coins: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });

  //Incharge of handeling the student groups toggle
  const [switchToggle, setswitchToggle] = useState(false);
  //Incharge of opening the code modal
  const [openClassCodeModal, setopenClassCodeModal] = useState(false);

  /* Handles the switch and if off resets the student groups counter */
  const toggleSwitchHandler = event => {
    if (!event.target.checked) {
      const updatedControls = updateObject(createClassroomForm, {
        studentGroups: updateObject(createClassroomForm.studentGroups, {
          value: "",
          valid: false,
          touched: false
        })
      });
      setcreateClassroomForm(updatedControls);
    }
    setswitchToggle(event.target.checked);
  };

  //Action to push to the main classroom page /classrooms
  const handleNav = () => {
    resetCreateClassroom();
    props.history.push({ state: { overwriteLocalNavState: "classrooms" } });
  };

  /* Controls classroom input Logic */
  const classroomInputHandler = (event, controlName) => {
    const updatedControls = updateObject(createClassroomForm, {
      [controlName]: updateObject(createClassroomForm[controlName], {
        value:
          controlName === "classCode" && event.target.value === ""
            ? ""
            : event.target.value,
        valid: checkValidity(
          controlName === "classCode" && event.target.value === ""
            ? ""
            : event.target.value,
          createClassroomForm[controlName].validation
        ),
        touched: true
      })
    });
    setcreateClassroomForm(updatedControls);
  };

  /* Controls classroom toggle button Logic */
  const classroomToggleButtonHandler = (event, value) => {
    const updatedControls = updateObject(createClassroomForm, {
      studentGroups: updateObject(createClassroomForm.studentGroups, {
        value: value === null ? null : value,
        valid: checkValidity(
          value,
          createClassroomForm.studentGroups.validation
        ),
        touched: true
      })
    });
    setcreateClassroomForm(updatedControls);
  };

  /* Controls classroom time slider Logic */
  const classroomSliderHandler = (event, value) => {
    const updatedControls = updateObject(createClassroomForm, {
      challengeTime: updateObject(createClassroomForm.challengeTime, {
        value: value === null ? null : value,
        valid: checkValidity(
          value.toString(),
          createClassroomForm.challengeTime.validation
        ),
        touched: true
      })
    });
    setcreateClassroomForm(updatedControls);
  };

  /* Handles create classroom actions */
  const createOrCancelHandler = action => {
    if (action === "cancel") {
      setcreateClassroomForm({
        institutions: {
          value: singleInstitution,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        classCode: {
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        className: {
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        studentGroups: {
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        challengeTime: {
          value: 15,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        coins: {
          value: "",
          validation: {
            required: true
          },
          valid: false,
          touched: false
        }
      });
      handleNav();
    } else {
      const payload = stateToPayload(createClassroomForm);
      props.createClassroom(payload);
    }
  };

  /* Handles modal on create succes */
  const handleModal = action => {
    setopenClassCodeModal(action);
    if (!action) {
      handleNav();
    }
  };

  //Controls the floating loader component
  let floatingLoader;
  if (loading) {
    floatingLoader = <FloatingLoader />;
  }

  const modalContainer = (
    <Modal openModal={openClassCodeModal} closeModal={() => handleModal(false)}>
      <CreatedClassroomModal
        registrationCode={registrationCode}
        missingFields={missingFields}
      />
    </Modal>
  );

  /* Checks if data is loaded from firestore */
  if (!isLoaded(clients)) {
    return (
      <div className="App">
        <Loader />
      </div>
    );
  }

  return (
    <React.Fragment>
      {floatingLoader}
      {modalContainer}
      <ClassroomCreator
        navActions={handleNav}
        createClassroomForm={createClassroomForm}
        classroomsId={classrooms}
        institutions={role.includes("admin") ? clients : myInstitutions}
        inputChangedHandler={classroomInputHandler}
        toggleButtonChangedHandler={classroomToggleButtonHandler}
        sliderChangedHandler={classroomSliderHandler}
        buttonClickHandler={createOrCancelHandler}
        switchToggle={switchToggle}
        toggleSwitchHandler={toggleSwitchHandler}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    myInstitutions: state.firebase.profile.institutions,
    classrooms: state.firebase.profile.classrooms,
    loading: state.classrooms.loading,
    createSuccess: state.classrooms.createSuccess,
    missingFields: state.classrooms.missingFields,
    registrationCode: state.classrooms.registrationCode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createClassroom: payload => dispatch(actions.createClassroom(payload)),
    resetCreateClassroom: () => {
      dispatch(actions.resetCreateClassroom());
    }
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateClassroom)
);
