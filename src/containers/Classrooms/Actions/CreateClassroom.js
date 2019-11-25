/* React Imports */
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
/* App imports */
import { updateObject, checkValidity, stateToPayload } from "../../../shared/utility";
import ClassroomCreator from "../../../components/Classroom/ClassroomCreator";
import FloatingLoader from '../../../components/UI/Loader/FloatingLoader/FloatingLoader'
import Modal from "../../../components/UI/Modal/Modal";
import CodeCopy from '../../../components/UI/SpecialFields/CodeCopy'

const CreateClassroom = props => {
  const { classrooms, myInstitutions, loading, success } = props;

  /* TODO: Remove logic in future release for more than one institution per teacher */
  //Extracts institution id in case there is only one assinged to account
  let singleInstitution;
  if (myInstitutions.length <= 1) {
    singleInstitution = myInstitutions[0].id;
  }

  //Opens modal on create classroom success
  useEffect(() => {
    if (success) {
      handleModal(true)
    }  
  }, [success])

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
  const createOrCancelHandler = (action) =>{
    console.log('action',action);
    if (action === 'cancel') {
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
      const payload = stateToPayload(createClassroomForm)
      props.createClassroom(payload)
    }
  }

  /* Handles modal on create succes */
  const handleModal = (action) => {
    setopenClassCodeModal(action)
  }

  //Controls the floating loader component
  let floatingLoader;
  if (loading) {
    floatingLoader = <FloatingLoader/>
  }
  const modalTemplate = (
    <div>
      <h2>Classroom Created succesfully!</h2>
      <p>Share the following code to register students</p>
      <CodeCopy value="pier"/>
      <h4>To active classroom, fill the following fields:</h4>
      <ul>
        <li>t1</li>
        <li>t2</li>
        <li>t3</li>
      </ul>
    </div>
  )

  return (
    <React.Fragment>
      {floatingLoader}
      <Modal openModal={openClassCodeModal} closeModal={() => handleModal(false)}>{modalTemplate}</Modal>
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
    success: state.classrooms.success
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createClassroom: (payload) => dispatch(actions.createClassroom(payload)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateClassroom));
