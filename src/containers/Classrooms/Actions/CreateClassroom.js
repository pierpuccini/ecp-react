import React from "react";
//Redux
import { connect } from "react-redux";
//App imports
import ClassroomCreator from "../../../components/Classroom/ClassroomCreator";

const CreateClassroom = (props) => {
  return <ClassroomCreator />;
};

const mapStateToProps = state => {
  return {
    profileLoaded: state.firebase.profile.isLoaded,
    role: state.firebase.profile.role,
    institutions: state.firebase.profile.institutions,
    classrooms: state.firebase.profile.classrooms
  };
};

export default connect(mapStateToProps)(CreateClassroom);
