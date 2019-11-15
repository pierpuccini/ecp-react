/* React Imports */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
//Redux
import { connect } from "react-redux";
//App imports
import ClassroomCreator from "../../../components/Classroom/ClassroomCreator";

const CreateClassroom = props => {
  const { classrooms, myInstitutions } = props;

  /* TODO: Remove logic in future release for more than one institution per teacher */
  //Extracts institution id in case there is only one assinged to account
  let singleInstitution;
  if (myInstitutions.length <= 1) {
    singleInstitution = myInstitutions[0].id
  };

  const [createClassroomForm, setcreateClassroomForm] = useState({
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
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    },
  });

  //Action to push to the main classroom page /classrooms
  const handleNav = () => {
    props.history.push({ state: { overwriteLocalNavState: "classrooms" } });
  };

  return (
    <ClassroomCreator
      navActions={handleNav}
      createClassroomForm={createClassroomForm}
      classroomsId={classrooms}
      institutions={myInstitutions}
    />
  );
};

const mapStateToProps = state => {
  return {
    role: state.firebase.profile.role,
    myInstitutions: state.firebase.profile.institutions,
    classrooms: state.firebase.profile.classrooms
  };
};

export default withRouter(connect(mapStateToProps)(CreateClassroom));
