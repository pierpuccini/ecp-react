/* React Imports */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
/* Material Imports */
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
/* App imports */
import {
  updateObject,
  checkValidity,
  stateToPayload
} from "../../../shared/utility";
import ClassroomCreator from "../../../components/Classroom/ClassroomCreator";
import FloatingLoader from "../../../components/UI/Loader/FloatingLoader/FloatingLoader";
import Modal from "../../../components/UI/Modal/Modal";
import CodeCopy from "../../../components/UI/SpecialFields/CodeCopy";

const useStyles = makeStyles(theme => ({
  succesfullCreateActions: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const CreateClassroom = props => {
  const matClasses = useStyles();
  const {
    classrooms,
    myInstitutions,
    loading,
    success,
    missingFields,
    registrationCode,
    resetCreateClassroom
  } = props;

  /* TODO: Remove logic in future release for more than one institution per teacher */
  //Extracts institution id in case there is only one assinged to account
  let singleInstitution;
  if (myInstitutions.length === 0) {
    singleInstitution = ""
  } else if (myInstitutions.length <= 1) {
    singleInstitution = myInstitutions[0].id;
  }

  //Opens modal on create classroom success
  useEffect(() => {
    /* IF NEW CASE IS ADDED PLEASE REDO IN AN OTHER USE EFFECT */
    if (success) {
      handleModal(true);
    }
    /* IF NEW CASE IS ADDED PLEASE REDO IN AN OTHER USE EFFECT */
    // eslint-disable-next-line
  }, [success]);

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
      value: null,
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
    resetCreateClassroom()
    props.history.push({ state: { overwriteLocalNavState: "classrooms" } });
  };

  /* Controls classroom input Logic */
  const classroomInputHandler = (event, controlName) => {
    const updatedControls = updateObject(createClassroomForm, {
      [controlName]: updateObject(createClassroomForm[controlName], {
        value:
          controlName === "classCode" && event.target.value === ""
            ? null
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

  /* Controls classroom autocomplete Logic */
  const classroomAutocompleteHandler = (event, value) => {
    const updatedControls = updateObject(createClassroomForm, {
      classCode: updateObject(createClassroomForm.classCode, {
        value: value,
        valid: checkValidity(
          value === null ? "" : value,
          createClassroomForm.classCode.validation
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
          value: null,
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
  const modalTemplate = (
    <div>
      <h2>Classroom created succesfully!</h2>
      <p>Share the following code to register students</p>
      <CodeCopy value={registrationCode} />
      {!missingFields.noMissingFields ? (
        <React.Fragment>
          <h4>To active classroom, fill the following fields:</h4>
          <ul>
            {Object.keys(missingFields).map(field => {
              return missingFields[field] ? <li key={field}>{field}</li> : null;
            })}
          </ul>
        </React.Fragment>
      ) : null}
      <div className={matClasses.succesfullCreateActions}>
        <Button
          className={matClasses.button}
          variant="contained"
          color="primary"
          type="submit"
          disabled={!missingFields.noMissingFields}
        >
          Activate Classroom
        </Button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {floatingLoader}
      <Modal
        openModal={openClassCodeModal}
        closeModal={() => handleModal(false)}
      >
        {modalTemplate}
      </Modal>
      <ClassroomCreator
        navActions={handleNav}
        createClassroomForm={createClassroomForm}
        classroomsId={classrooms}
        institutions={myInstitutions}
        inputChangedHandler={classroomInputHandler}
        toggleButtonChangedHandler={classroomToggleButtonHandler}
        sliderChangedHandler={classroomSliderHandler}
        autocompleteHandler={classroomAutocompleteHandler}
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
    success: state.classrooms.success,
    missingFields: state.classrooms.missingFields,
    registrationCode: state.classrooms.registrationCode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createClassroom: payload => dispatch(actions.createClassroom(payload)),
    resetCreateClassroom: () => {dispatch(actions.resetCreateClassroom())}
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateClassroom));
