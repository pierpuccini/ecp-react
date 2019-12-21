/* React imports */
import React, { useState, useEffect } from "react";
import { withRouter, useParams } from "react-router-dom";
/* Redux */
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
/* App imports */
import Loader from "../../../components/UI/Loader/PngLoader/PngLoader";
import FloatingLoader from "../../../components/UI/Loader/FloatingLoader/FloatingLoader";
import DetailedClassroomView from "../../../components/Classroom/DetailedClassroomView";
import {
  updateObject,
  checkValidity,
  stateToPayload,
  userObjCreator
} from "../../../shared/utility";

const ViewAndEditClassroom = props => {
  let { id } = useParams();
  const {
    getOneClassroom,
    updateClassroom,
    manageClassroomStudents,
    location,
    classroom,
    classroomError,
    myInstitutions,
    history,
    role,
    updateSuccess,
    success,
    loading
  } = props;

  const [domReady, setDomReady] = useState(false);
  const [stateReady, setstateReady] = useState(false);

  //Editable state fields
  const [studentGroups, setstudentGroups] = useState({
    groupName: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    studentArray: []
  });
  const [updateClassroomForm, setupdateClassroomForm] = useState({
    client_id: {
      value: "",
      validation: {
        required: true
      },
      valid: true,
      touched: true
    },
    subject_id: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    subject_name: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    group_size: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    challenge_duration: {
      value: 15,
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    initial_coins: {
      value: "",
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  });

  //static state fields, only ones available for change are pending and active students
  const [updateClassroomInfo, setupdateClassroomInfo] = useState({
    code_classroom: "",
    teacher_id: "",
    pending_students: "",
    active_students: ""
  });

  /* Use efect handles async loading for loader */
  // Fetches new course on load
  useEffect(() => {
    async function getMyClassrooms() {
      await getOneClassroom({ id: id });
    }
    getMyClassrooms()
      .then(() => {
        setDomReady(true);
      })
      .catch(err => {
        console.log("err", err);
      });
    /* MISSING DEP: getAllMyClassrooms, id */
    // eslint-disable-next-line
  }, []);

  /* Fetches new course on success */
  useEffect(() => {
    async function getMyClassrooms() {
      await getOneClassroom({ id: id });
    }
    if (updateSuccess) {
      getMyClassrooms()
        .then(() => {
          setDomReady(true);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
    /* MISSING DEP: getAllMyClassrooms,id */
    // eslint-disable-next-line
  }, [updateSuccess]);

  useEffect(() => {
    if (
      classroomError !== null &&
      classroomError.code !== null &&
      classroomError.code === "not-auth"
    ) {
      handleNav();
    }
    // eslint-disable-next-line
  }, [classroomError]);

  /* use effect in charge of populating edit state with classroom info */
  useEffect(() => {
    if (success && classroom != null) {
      const {
        client_id,
        subject_id,
        subject_name,
        group_size,
        challenge_duration,
        initial_coins,
        code_classroom,
        teacher_id,
        pending_students,
        active_students
      } = classroom;

      setupdateClassroomForm({
        client_id: {
          value: client_id,
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        subject_id: {
          value: subject_id,
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        subject_name: {
          value: subject_name,
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        group_size: {
          value: group_size,
          validation: {
            required: true
          },
          valid: group_size == null ? false : true,
          touched: group_size == null ? false : true
        },
        challenge_duration: {
          value: challenge_duration == null ? 15 : challenge_duration,
          validation: {
            required: true
          },
          valid: challenge_duration == null ? false : true,
          touched: challenge_duration == null ? false : true
        },
        initial_coins: {
          value: initial_coins == null ? "" : initial_coins,
          validation: {
            required: true
          },
          valid: initial_coins == null ? false : true,
          touched: initial_coins == null ? false : true
        }
      });
      setupdateClassroomInfo({
        code_classroom: code_classroom,
        teacher_id: teacher_id,
        pending_students: pending_students,
        active_students: active_students
      });
      setstateReady(true);
    }
  }, [success, classroom]);

  /* Loads clients, teachers and studets data from Firestore */
  useFirestoreConnect(() => [
    {
      collection: "users",
      storeAs: "students",
      where: ["role", "==", "student"]
    },
    {
      collection: "users",
      storeAs: "teachers",
      where: ["role", "==", "teacher"]
    },
    {
      collection: "clients",
      storeAs: "clients",
      where: ["active", "==", true]
    }
  ]);

  const students = useSelector(
    ({ firestore: { ordered } }) => ordered.students
  );
  const teachers = useSelector(
    ({ firestore: { ordered } }) => ordered.teachers
  );
  const clients = useSelector(({ firestore: { ordered } }) => ordered.clients);

  /*  --------------------- HANDLERS --------------------- */
  /* Action to push to the main classroom page /classrooms */
  const handleNav = () => {
    history.push({
      state: { overwriteLocalNavState: "classrooms", getAllClassrooms: true }
    });
  };

  /* Controls classroom input Logic */
  const classroomInputHandler = (event, controlName) => {
    const updatedControls = updateObject(updateClassroomForm, {
      [controlName]: updateObject(updateClassroomForm[controlName], {
        value:
          controlName === "subject_id" && event.target.value === ""
            ? null
            : event.target.value,
        valid: checkValidity(
          controlName === "subject_id" && event.target.value === ""
            ? ""
            : event.target.value,
          updateClassroomForm[controlName].validation
        ),
        touched: true
      })
    });
    setupdateClassroomForm(updatedControls);
  };

  /* Controls classroom input Logic */
  const studentGroupsChangedHandler = (event, controlName, data) => {
    let updatedControls;
    if (controlName !== "studentArray") {
      updatedControls = updateObject(studentGroups, {
        [controlName]: updateObject(setstudentGroups[controlName], {
          value: event.target.value,
          valid: checkValidity(
            event.target.value,
            studentGroups[controlName].validation
          ),
          touched: true
        })
      });
      setstudentGroups(updatedControls);
    } else {
      console.log('name', studentGroups);
      console.log("data", data);
    }
  };

  /* Handles edit and view classroom actions */
  const editViewActions = (action, payload) => {
    const {
      client_id,
      subject_id,
      subject_name,
      group_size,
      challenge_duration,
      initial_coins
    } = classroom;

    if (action === "cancel") {
      setupdateClassroomForm({
        client_id: {
          value: client_id == null ? "" : client_id,
          validation: {
            required: true
          },
          valid: true,
          touched: true
        },
        subject_id: {
          value: subject_id,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        subject_name: {
          value: subject_name,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        group_size: {
          value: group_size,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        challenge_duration: {
          value: challenge_duration == null ? 15 : challenge_duration,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        },
        initial_coins: {
          value: initial_coins == null ? "" : initial_coins,
          validation: {
            required: true
          },
          valid: false,
          touched: false
        }
      });
      handleNav();
    } else if (action === "activate") {
      const payload = stateToPayload(updateClassroomForm);
      updateClassroom({ ...payload, id: id.replace(":", "") });
    } else if (action === "save") {
      manageClassroomStudents({ ...payload, id: id.replace(":", "") });
    }
  };

  /* Controls classroom toggle button Logic */
  const classroomToggleButtonHandler = (event, value) => {
    const updatedControls = updateObject(updateClassroomForm, {
      group_size: updateObject(updateClassroomForm.group_size, {
        value: value === "" ? "" : value,
        valid: checkValidity(value, updateClassroomForm.group_size.validation),
        touched: true
      })
    });
    setupdateClassroomForm(updatedControls);
  };

  /* Controls classroom time slider Logic */
  const classroomSliderHandler = (event, value) => {
    const updatedControls = updateObject(updateClassroomForm, {
      challenge_duration: updateObject(updateClassroomForm.challenge_duration, {
        value: value === null ? null : value,
        valid: checkValidity(
          value.toString(),
          updateClassroomForm.challenge_duration.validation
        ),
        touched: true
      })
    });
    setupdateClassroomForm(updatedControls);
  };

  /* Converts editable state to a value readonly state FOR VIEW */
  const convertStateToInfo = () => {
    let classroomInfo = { ...updateClassroomInfo };
    const formKeys = Object.keys(updateClassroomForm);
    /* Es lint disabled because map does not return anything */
    //eslint-disable-next-line
    formKeys.map(key => {
      classroomInfo = {
        ...classroomInfo,
        [key]: updateClassroomForm[key].value
      };
    });
    return classroomInfo;
  };

  /* Incharge of showing detailed view or coin loader */
  if (
    isLoaded(clients, teachers, students) &&
    domReady &&
    stateReady &&
    classroom
  ) {
    return (
      <React.Fragment>
        {loading ? <FloatingLoader></FloatingLoader> : null}
        <DetailedClassroomView
          navActions={handleNav}
          view={location.pathname.includes("view")}
          edit={location.pathname.includes("edit")}
          institutions={role.includes("admin") ? clients : myInstitutions}
          updateClassroomInfo={updateClassroomInfo}
          updateClassroomForm={updateClassroomForm}
          inputChangedHandler={classroomInputHandler}
          studentGroupsChangedHandler={studentGroupsChangedHandler}
          buttonClickHandler={editViewActions}
          toggleButtonChangedHandler={classroomToggleButtonHandler}
          sliderChangedHandler={classroomSliderHandler}
          pending_students={userObjCreator(
            classroom.pending_students,
            students
          )}
          active_students={userObjCreator(classroom.active_students, students)}
          teacher={userObjCreator([classroom.teacher_id], teachers, true)}
          viewInfo={convertStateToInfo()}
          studentGroups={studentGroups}
        />
      </React.Fragment>
    );
  } else {
    return (
      <div style={{ alignSelf: "center" }}>
        <Loader />
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    loading: state.classrooms.loading,
    updateSuccess: state.classrooms.updateSuccess,
    success: state.classrooms.success,
    classroom: state.classrooms.classroom,
    classroomError: state.classrooms.error,
    myInstitutions: state.firebase.profile.institutions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getOneClassroom: payload => dispatch(actions.getOneClassroom(payload)),
    updateClassroom: payload => dispatch(actions.updateClassroom(payload)),
    manageClassroomStudents: payload =>
      dispatch(actions.manageClassroomStudents(payload))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewAndEditClassroom)
);
